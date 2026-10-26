<!-- Credencial 3D con datos reales (spec 013): la abre el enlace del correo (/credencial/<codigo>). La credencial ocupa toda la pantalla
     en vertical y no hay nada más: con doble toque se abre el editor de tecnologías, que se guardan solas en el servidor. -->
<template>
  <div class="pagina" :style="{ '--acento': acento }">
    <div class="pagina__fondo" aria-hidden="true"/>

    <section
      v-if="cargando"
      class="pagina__estado"
      aria-live="polite"
    >
      <p class="mt-4 text-lg text-slate-300">Cargando tu credencial…</p>
    </section>

    <section v-else-if="!datos" class="pagina__estado">
      <h1 class="text-3xl font-bold tracking-tight">No pudimos mostrar tu credencial</h1>
      <p class="mt-4 text-slate-300">{{ mensajeFalla }}</p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          v-if="reintentable"
          type="button"
          class="boton boton--primario"
          @click="recargar"
        >
          Reintentar
        </button>
        <NuxtLink to="/" class="boton boton--secundario">Ir al sitio del congreso</NuxtLink>
      </div>
    </section>

    <template v-else>
      <h1 class="sr-only">Tu credencial del {{ datos.evento.nombreCorto }}</h1>

      <CredencialVertical
        :tecnologias="seleccion"
        :asistente="asistente"
        :evento="{ nombreCorto: datos.evento.nombreCorto, nombre: datos.evento.nombre }"
        :qr="qr"
        :pista="pista"
        @editar="abrirEditor"
      />

      <!-- Solo si el guardado falló y el editor está cerrado: de otro modo la persona no se enteraría -->
      <p
        v-if="estado === 'error' && !editando"
        class="pagina__aviso"
        role="alert"
      >
        {{ mensajeErrorGuardado }}
        <button type="button" class="pagina__reintentar" @click="guardar">Reintentar</button>
      </p>
    </template>

    <CredencialEditor
      :abierto="editando"
      :seleccion="seleccion"
      :estado="estado"
      :mensaje-error="mensajeErrorGuardado"
      :lleno="lleno"
      @cerrar="editando = false"
      @alternar="alternar"
      @principal="hacerPrincipalLocal"
      @reintentar="guardar"
    />
  </div>
</template>

<script setup lang="ts">
import { renderSVG } from 'uqr'
import { normalizeApiError } from '~/composables/useApi'
import type { ApiExito } from '~/types/evento'
import {
  acentoDe,
  alternarTecnologia,
  hacerPrincipal,
  mensajeCredencial,
  mensajeGuardado,
  mismaSeleccion,
  nombreCompleto,
  normalizarSeleccion,
  type DatosCredencial,
  type EstadoGuardado,
} from '~/utils/credencial'
import { rutasSitio } from '~/utils/rutas-sitio'

definePageMeta({ layout: 'credencial' })

/** Tiempo sin cambios antes de guardar: agrupa varios toques seguidos en una sola petición. */
const ESPERA_GUARDADO_MS = 600
/** Cuánto se muestra el aviso «Toca dos veces para editar». */
const DURACION_PISTA_MS = 5000

const ruta = useRoute()
const codigo = computed(() => String(ruta.params.codigo ?? '').trim().toUpperCase())

const { request } = useApi()
// `await`: la selección se arma con los datos ya cargados, así el servidor entrega la credencial completa
const { data, status, error, refresh } = await useAsyncData(
  () => `credencial:${codigo.value}`,
  () =>
    request<ApiExito<DatosCredencial>>(rutasSitio.credencial(codigo.value)).then(
      respuesta => respuesta?.data ?? null,
    ),
  { watch: [codigo] },
)

const datos = computed(() => data.value ?? null)
const cargando = computed(() => status.value === 'pending')
const fallo = computed(() => (error.value ? normalizeApiError(error.value) : null))
const mensajeFalla = computed(() => (fallo.value ? mensajeCredencial(fallo.value) : ''))
const reintentable = computed(() => {
  const estado = fallo.value?.statusCode ?? 500
  return estado === 0 || estado >= 500
})
const recargar = () => { void refresh() }

useSeoMeta({
  title: () => (datos.value ? `Credencial | ${datos.value.evento.nombreCorto}` : 'Credencial | VIII CIISIC 2026'),
  description: 'Credencial digital 3D del congreso con tu nombre y tu código de registro.',
  // Es personal: se abre con el enlace del correo y no debe aparecer en buscadores
  robots: 'noindex, nofollow',
  // Pantalla completa en el celular: la barra del navegador toma el color de fondo de la credencial
  themeColor: '#041d39',
})

const asistente = computed(() => ({
  nombre: datos.value ? nombreCompleto(datos.value) : '',
  codigo: datos.value?.codigo ?? codigo.value,
}))

/** QR del código de registro (el mismo del fotocheck impreso), oscuro sobre blanco para que cualquier lector lo lea. */
const qr = computed(() => {
  if (!datos.value) return undefined
  const svg = renderSVG(datos.value.codigo, { ecc: 'M', border: 0, blackColor: '#041d39', whiteColor: '#ffffff' })
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
})

// ─── Editor: doble toque sobre la credencial ────────────────────────────────

const editando = ref(false)
const pista = ref(false)
let temporizadorPista: ReturnType<typeof setTimeout> | undefined

function abrirEditor() {
  pista.value = false
  editando.value = true
}

// ─── Tecnologías: se guardan solas en el servidor ───────────────────────────

const seleccion = ref<string[]>([])
/** Lo último que el servidor confirmó: no se guarda lo que no cambió. */
const guardadas = ref<string[]>([])
const lleno = ref(false)
const estado = ref<EstadoGuardado>('inactivo')
const mensajeErrorGuardado = ref('')
const acento = computed(() => acentoDe(seleccion.value))

watch(
  datos,
  (nuevos) => {
    const delServidor = normalizarSeleccion(nuevos?.tecnologias)
    seleccion.value = delServidor
    guardadas.value = delServidor
  },
  { immediate: true },
)

let temporizador: ReturnType<typeof setTimeout> | undefined
let enCurso = false
let hayPendiente = false

async function guardar() {
  clearTimeout(temporizador)
  temporizador = undefined
  if (enCurso) {
    // Una sola petición a la vez: lo que cambió mientras tanto se manda al terminar
    hayPendiente = true
    return
  }
  const enviar = [...seleccion.value]
  if (mismaSeleccion(enviar, guardadas.value) && estado.value !== 'error') {
    estado.value = 'inactivo'
    return
  }
  enCurso = true
  estado.value = 'guardando'
  try {
    await request(rutasSitio.tecnologiasCredencial(codigo.value), { method: 'POST', body: { tecnologias: enviar } })
    guardadas.value = enviar
    estado.value = hayPendiente ? 'guardando' : 'guardado'
  } catch (fallido) {
    estado.value = 'error'
    mensajeErrorGuardado.value = mensajeGuardado(normalizeApiError(fallido))
  } finally {
    enCurso = false
    if (hayPendiente) {
      hayPendiente = false
      void guardar()
    }
  }
}

function cambiar(nuevas: string[]) {
  seleccion.value = nuevas
  estado.value = 'guardando'
  clearTimeout(temporizador)
  temporizador = setTimeout(() => { void guardar() }, ESPERA_GUARDADO_MS)
}

function alternar(id: string) {
  const resultado = alternarTecnologia(seleccion.value, id)
  lleno.value = resultado.lleno
  if (!resultado.lleno) cambiar(resultado.ids)
}

function hacerPrincipalLocal(id: string) {
  cambiar(hacerPrincipal(seleccion.value, id))
}

/** Si cierran la pestaña con un cambio sin guardar, se manda de todos modos (`sendBeacon` sobrevive al cierre). */
function guardarAlSalir() {
  if (temporizador === undefined || mismaSeleccion(seleccion.value, guardadas.value)) return
  clearTimeout(temporizador)
  temporizador = undefined
  const cuerpo = new Blob([JSON.stringify({ tecnologias: seleccion.value })], { type: 'application/json' })
  navigator.sendBeacon(rutasSitio.tecnologiasCredencial(codigo.value), cuerpo)
}

onMounted(() => {
  window.addEventListener('pagehide', guardarAlSalir)
  // El aviso solo tiene sentido si la credencial cargó
  if (datos.value) {
    pista.value = true
    temporizadorPista = setTimeout(() => { pista.value = false }, DURACION_PISTA_MS)
  }
})
onBeforeUnmount(() => {
  if (import.meta.client) window.removeEventListener('pagehide', guardarAlSalir)
  clearTimeout(temporizadorPista)
  guardarAlSalir()
})
</script>

<style scoped>
/* Toda la pantalla, sin desplazamiento: la credencial es lo único que hay */
.pagina {
  position: relative;
  display: grid;
  place-items: center;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

/* Resplandor del color de la tecnología principal detrás de la credencial */
.pagina__fondo {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      circle at 50% 45%,
      color-mix(in srgb, var(--acento, #00d9e8) 24%, transparent),
      transparent 55%
    ),
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px) 0 0 / 44px 44px,
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px) 0 0 / 44px 44px;
  mask-image: radial-gradient(circle at 50% 45%, #000 20%, transparent 78%);
  transition: background 0.4s ease;
}

.pagina__estado {
  position: relative;
  max-width: 34rem;
  padding: 1.5rem;
  text-align: center;
}

.pagina__aviso {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  z-index: 20;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  max-width: calc(100vw - 2rem);
  padding: 0.6rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(252, 165, 165, 0.35);
  background: rgba(40, 10, 16, 0.92);
  font-size: 0.85rem;
  color: #fecaca;
  transform: translateX(-50%);
}

.pagina__reintentar {
  font-weight: 700;
  text-decoration: underline;
  color: #fff;
}

.boton {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.7rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  transition: transform 0.15s ease;
}

.boton:hover {
  transform: translateY(-1px);
}

.boton:focus-visible,
.pagina__reintentar:focus-visible {
  outline: 2px solid #00d9e8;
  outline-offset: 2px;
}

.boton--primario {
  background: #00d9e8;
  color: #041d39;
}

.boton--secundario {
  border: 1px solid rgba(255, 255, 255, 0.24);
  font-weight: 600;
  color: #cbd5e1;
}

@media (prefers-reduced-motion: reduce) {
  .pagina__fondo,
  .boton {
    transition: none;
  }
}
</style>
