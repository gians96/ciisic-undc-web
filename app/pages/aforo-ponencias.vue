<template>
  <div class="aforo-page min-h-screen bg-[#041d39] text-white">
    <section class="aforo-hero relative overflow-hidden border-b border-white/10 px-6 py-12 sm:py-16 lg:px-8">
      <div class="aforo-grid absolute inset-0" aria-hidden="true" />
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-300">{{ vista?.evento.nombreCorto ?? 'VIII CIISIC UNDC · 2026' }}</p>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-5xl">Aforo de ponencias especializadas</h1>
        <p class="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Inscritos presenciales, cupos libres y asistencia en puerta de cada tema.
        </p>
        <div v-if="estado === 'listo'" class="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span class="summary-chip" aria-live="polite">
            <Icon name="heroicons:clock" class="h-5 w-5 text-primary-400" aria-hidden="true" />Actualizado {{ hora }}
          </span>
          <button type="button" class="summary-chip summary-chip-boton" :disabled="actualizando" @click="cargar()">
            <Icon name="heroicons:arrow-path" class="h-5 w-5 text-primary-400" :class="{ 'animate-spin': actualizando }" aria-hidden="true" />Actualizar
          </button>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16 2xl:max-w-[1600px]">
      <div v-if="estado === 'enlace'" class="estado-card" role="alert">
        <Icon name="heroicons:link-slash" class="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
        <h2 class="mt-4 text-xl font-bold">Este enlace no es válido</h2>
        <p class="mt-2 text-slate-300">Puede estar incompleto o haber sido desactivado. Pide uno nuevo a la organización del congreso.</p>
      </div>

      <div v-else-if="estado === 'error'" class="estado-card" role="alert">
        <Icon name="heroicons:exclamation-triangle" class="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
        <h2 class="mt-4 text-xl font-bold">No se pudo cargar el aforo</h2>
        <p class="mt-2 text-slate-300">{{ aviso }}</p>
        <button type="button" class="btn btn-primary mt-6" :disabled="actualizando" @click="cargar()">
          <Icon name="heroicons:arrow-path" class="h-5 w-5" aria-hidden="true" />Reintentar
        </button>
      </div>

      <div v-else-if="estado === 'cargando' || !vista" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Cargando el aforo">
        <div v-for="n in 6" :key="n" class="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[.04]" />
      </div>

      <template v-else>
        <p v-if="aviso" class="mb-8 flex items-center gap-3 rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100" role="alert">
          <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />{{ aviso }}
        </p>

        <div v-if="!dias.length" class="estado-card">
          <Icon name="heroicons:presentation-chart-bar" class="mx-auto h-10 w-10 text-primary-300" aria-hidden="true" />
          <h2 class="mt-4 text-xl font-bold">Aún no hay ponencias publicadas</h2>
        </div>

        <div class="space-y-14">
          <section v-for="dia in dias" :key="dia.fecha" :aria-labelledby="`dia-${dia.fecha}`">
            <div class="mb-6 flex flex-wrap items-end justify-between gap-4 border-l-4 border-primary-400 pl-4">
              <h2 :id="`dia-${dia.fecha}`" class="text-2xl font-extrabold tracking-tight sm:text-3xl">{{ dia.etiqueta }}</h2>
              <div class="flex flex-wrap gap-2 text-sm">
                <span class="summary-chip"><Icon name="heroicons:clock" class="h-5 w-5 text-primary-400" aria-hidden="true" />{{ rangoHorario(dia.ponencias[0]!.horaInicio, dia.ponencias[0]!.horaFin) }}</span>
                <span class="summary-chip"><Icon name="heroicons:presentation-chart-bar" class="h-5 w-5 text-primary-400" aria-hidden="true" />{{ dia.ponencias.length }} ponencias</span>
              </div>
            </div>

            <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <article v-for="ponencia in dia.ponencias" :key="ponencia.id" class="aforo-card flex h-full flex-col rounded-3xl border p-5 sm:p-6" :class="ESTILO[nivelOcupacion(ponencia)].tarjeta">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-primary-400/40 bg-primary-400/10 px-3 py-1 text-xs font-bold text-primary-100">
                    <Icon name="heroicons:map-pin" class="h-4 w-4 text-primary-300" aria-hidden="true" />{{ ponencia.ambiente }}
                  </span>
                  <span class="rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset" :class="ESTILO[nivelOcupacion(ponencia)].etiqueta">{{ textoCuposLibres(ponencia) }}</span>
                </div>

                <h3 class="mt-4 flex-1 text-lg font-bold leading-snug text-white sm:text-xl">{{ ponencia.tema }}</h3>
                <p class="mt-2 text-sm leading-snug text-slate-300">{{ ponentesDeLaPonencia(ponencia).map(p => p.nombre).join(' · ') }}</p>

                <div class="mt-5">
                  <div class="flex items-baseline justify-between gap-3">
                    <p class="text-3xl font-extrabold tabular-nums text-white">
                      {{ ponencia.inscritos }}<span v-if="ponencia.cupo !== null" class="text-lg font-semibold text-slate-400"> / {{ ponencia.cupo }}</span>
                    </p>
                    <p class="text-[.68rem] font-semibold uppercase tracking-[.14em] text-slate-400">Inscritos</p>
                  </div>
                  <div
                    v-if="porcentajeOcupacion(ponencia) !== null"
                    class="mt-2 h-2.5 overflow-hidden rounded-full bg-white/10"
                    role="progressbar"
                    :aria-valuenow="ponencia.inscritos"
                    aria-valuemin="0"
                    :aria-valuemax="ponencia.cupo ?? undefined"
                    :aria-label="`${textoInscritos(ponencia)} en ${ponencia.ambiente}`"
                  >
                    <span class="barra block h-full rounded-full" :class="ESTILO[nivelOcupacion(ponencia)].barra" :style="{ width: `${porcentajeOcupacion(ponencia)}%` }" />
                  </div>
                </div>

                <dl class="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm">
                  <div>
                    <dt class="text-[.68rem] font-semibold uppercase tracking-[.14em] text-slate-400">Horario</dt>
                    <dd class="mt-1 font-semibold text-slate-100">{{ rangoHorario(ponencia.horaInicio, ponencia.horaFin) }}</dd>
                  </div>
                  <div>
                    <dt class="text-[.68rem] font-semibold uppercase tracking-[.14em] text-slate-400">Asistencia</dt>
                    <dd class="mt-1 font-semibold text-slate-100">{{ textoAsistencia(ponencia) }}</dd>
                  </div>
                </dl>
              </article>
            </div>
          </section>
        </div>

        <p class="mt-14 border-t border-white/10 pt-5 text-xs leading-relaxed text-slate-400">
          <strong class="font-semibold text-slate-300">Inscritos</strong> = reservas presenciales vigentes (son las que ocupan el aforo).
          <strong class="font-semibold text-slate-300">Asistencia</strong> = registrada en la puerta del ambiente. Las cifras se actualizan solas cada minuto.
          Enlace de uso restringido: compártelo solo con quien lo necesite y no lo publiques.
        </p>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AforoPonencias } from '~/types/ponencias-especializadas'
import { normalizeApiError, type ApiErrorShape } from '~/composables/useApi'
import {
  horaDeActualizacion,
  nivelOcupacion,
  porcentajeOcupacion,
  textoAsistencia,
  textoCuposLibres,
  textoInscritos,
  tokenDelHash,
  type NivelOcupacion,
} from '~/utils/aforo-ponencias'
import { SERVICIO_NO_DISPONIBLE } from '~/utils/errores-api'
import { ponenciasPorDia, ponentesDeLaPonencia } from '~/utils/inscripcion-ponencias'
import { rangoHorario } from '~/utils/ponencias-especializadas'
import { rutasSitio } from '~/utils/rutas-sitio'

// Página oculta (spec 012; backend spec 036): no está en el menú ni en el pie y no se indexa. El token del enlace va tras
// el `#` (el navegador no lo envía a ningún servidor) y solo vive en memoria: nunca en la URL de una petición ni en la consola.
useSeoMeta({
  title: 'Aforo de ponencias especializadas | VIII CIISIC 2026',
  description: 'Aforo, inscritos y asistencia de las ponencias especializadas del VIII CIISIC 2026.',
  robots: 'noindex, nofollow',
})
// La URL lleva el acceso: ningún enlace saliente debe conocerla
useHead({ meta: [{ name: 'referrer', content: 'no-referrer' }] })

type Estado = 'cargando' | 'listo' | 'enlace' | 'error'

const REFRESCO_MS = 60_000
/** Al volver a la pestaña solo se refresca si pasó más de este tiempo desde la última lectura. */
const REFRESCO_AL_VOLVER_MS = 30_000

const ESTILO: Record<NivelOcupacion, { tarjeta: string, etiqueta: string, barra: string }> = {
  'sin-limite': { tarjeta: 'border-white/10', etiqueta: 'bg-white/[.06] text-slate-200 ring-white/15', barra: 'bg-primary-400' },
  'libre': { tarjeta: 'border-white/10', etiqueta: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/30', barra: 'bg-primary-400' },
  'casi-lleno': { tarjeta: 'border-amber-300/30', etiqueta: 'bg-amber-400/15 text-amber-200 ring-amber-300/30', barra: 'bg-amber-400' },
  'lleno': { tarjeta: 'border-rose-300/35', etiqueta: 'bg-rose-400/15 text-rose-200 ring-rose-300/35', barra: 'bg-rose-400' },
}

const { request } = useApi()
const estado = ref<Estado>('cargando')
const vista = ref<AforoPonencias | null>(null)
const aviso = ref('')
const actualizando = ref(false)

let token: string | null = null
let turno = 0
let ultimaLectura = 0
let temporizador: ReturnType<typeof setInterval> | undefined

const dias = computed(() => ponenciasPorDia(vista.value?.ponencias ?? []))
const hora = computed(() => horaDeActualizacion(vista.value?.generadoEn))

const mensajeDe = (error: ApiErrorShape) => (error.statusCode === 429 ? error.message : SERVICIO_NO_DISPONIBLE)

async function cargar(silencioso = false) {
  if (!token) {
    estado.value = 'enlace'
    return
  }
  const mio = ++turno
  actualizando.value = true
  try {
    const respuesta = await request<{ data: AforoPonencias }>(rutasSitio.aforoPonenciasEspecializadas, { method: 'POST', body: { token }, timeout: 12000 })
    if (mio !== turno) return
    vista.value = respuesta.data
    estado.value = 'listo'
    aviso.value = ''
    ultimaLectura = Date.now()
  } catch (error) {
    if (mio !== turno) return
    const e = normalizeApiError(error)
    if (e.statusCode === 404 || e.code === 'LINK_NOT_FOUND') {
      // El enlace se renovó o se desactivó mientras se miraba
      estado.value = 'enlace'
      vista.value = null
    } else if (vista.value) {
      // Ya hay cifras a la vista: se conservan y se avisa que esta lectura falló
      aviso.value = silencioso ? 'No se pudo actualizar. Se muestran las últimas cifras.' : mensajeDe(e)
    } else {
      estado.value = 'error'
      aviso.value = mensajeDe(e)
    }
  } finally {
    if (mio === turno) actualizando.value = false
  }
}

function leerEnlace() {
  token = tokenDelHash(window.location.hash)
  vista.value = null
  aviso.value = ''
  estado.value = token ? 'cargando' : 'enlace'
  if (token) cargar()
}

function alVolver() {
  if (document.visibilityState === 'visible' && vista.value && Date.now() - ultimaLectura > REFRESCO_AL_VOLVER_MS) cargar(true)
}

onMounted(() => {
  leerEnlace()
  temporizador = setInterval(() => {
    if (document.visibilityState === 'visible' && vista.value && !actualizando.value) cargar(true)
  }, REFRESCO_MS)
  document.addEventListener('visibilitychange', alVolver)
  window.addEventListener('hashchange', leerEnlace)
})

onBeforeUnmount(() => {
  clearInterval(temporizador)
  document.removeEventListener('visibilitychange', alVolver)
  window.removeEventListener('hashchange', leerEnlace)
  token = null
})
</script>

<style scoped>
.aforo-hero { background: linear-gradient(180deg, #062a52 0%, #041d39 55%); }
.aforo-grid { opacity: .25; background-image: linear-gradient(#1d7fb43d 1px, transparent 1px), linear-gradient(90deg, #1d7fb43d 1px, transparent 1px); background-size: 64px 64px; mask-image: linear-gradient(to bottom, black, transparent); }
.summary-chip { display: inline-flex; align-items: center; gap: .5rem; border: 1px solid #ffffff1a; border-radius: 9999px; background: #ffffff08; padding: .55rem .9rem; color: #cbd5e1; }
.summary-chip-boton { cursor: pointer; transition: background-color .2s ease, border-color .2s ease; }
.summary-chip-boton:hover:not(:disabled) { background: #ffffff14; border-color: #22d3ee59; }
.summary-chip-boton:disabled { cursor: progress; opacity: .7; }
.estado-card { margin-inline: auto; max-width: 36rem; border: 1px solid #ffffff1a; border-radius: 1.5rem; background: #ffffff08; padding: 2.5rem 1.75rem; text-align: center; }
.aforo-card { background: linear-gradient(150deg, #0a3157d9, #062541f2); box-shadow: 0 20px 55px #020f2033; }
.barra { transition: width .5s ease; }
@media (prefers-reduced-motion: reduce) { .barra { transition: none; } }
</style>
