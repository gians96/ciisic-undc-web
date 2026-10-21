<template>
  <div class="del-page min-h-screen bg-[#041d39] text-white">
    <section class="del-hero relative overflow-hidden border-b border-white/10 px-6 py-14 sm:py-16 lg:px-8">
      <div class="del-grid absolute inset-0" aria-hidden="true" />
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-300">VIII CIISIC UNDC · 2026</p>
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Inscripción de delegaciones</h1>
        <p class="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
          Inscribe a tu grupo con un solo registro: agrega a tus integrantes, sube tus vouchers de pago y vuelve con tu link cuando quieras sumar a alguien más.
        </p>
      </div>
    </section>

    <!-- Cargando el link -->
    <section v-if="codigo && cargandoLink" class="mx-auto max-w-3xl px-6 py-20 text-center text-slate-300" role="status">
      <Icon name="heroicons:arrow-path" class="mx-auto h-8 w-8 animate-spin text-primary-400" aria-hidden="true" />
      <p class="mt-4">Cargando tu delegación…</p>
    </section>

    <!-- Link inválido -->
    <section v-else-if="codigo && errorLink" class="mx-auto max-w-3xl px-6 py-20 text-center" role="alert">
      <Icon name="heroicons:exclamation-triangle" class="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
      <h2 class="mt-4 text-2xl font-bold">No pudimos abrir tu delegación</h2>
      <p class="mx-auto mt-3 max-w-xl text-slate-300">{{ errorLink }}</p>
      <button type="button" class="btn btn-outline mt-6" @click="cargarLink">Reintentar</button>
    </section>

    <!-- Registro enviado -->
    <section v-else-if="registrada" class="mx-auto max-w-3xl px-6 py-14 lg:px-8" aria-labelledby="titulo-listo">
      <div ref="bloqueListo" tabindex="-1" class="del-listo rounded-3xl border border-emerald-300/30 p-7 sm:p-9" role="status">
        <span class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
          <Icon name="heroicons:check-circle" class="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 id="titulo-listo" class="mt-5 text-3xl font-extrabold">¡Registro enviado!</h2>
        <p class="mt-2 text-slate-300">
          Registramos a <strong class="text-white">{{ registrada.registrados ?? registrada.totalIntegrantes }}</strong> integrante(s) de
          <strong class="text-white">{{ registrada.nombre }}</strong>. La organización revisará tus vouchers y aprobará al grupo; cada integrante recibirá su credencial por correo.
        </p>
        <dl class="mt-6 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-white/[.04] p-4"><dt class="text-xs uppercase tracking-wide text-slate-400">Integrantes</dt><dd class="mt-1 text-2xl font-bold tabular-nums">{{ registrada.totalIntegrantes }}</dd></div>
          <div class="rounded-2xl border border-white/10 bg-white/[.04] p-4"><dt class="text-xs uppercase tracking-wide text-slate-400">Total a pagar</dt><dd class="mt-1 text-2xl font-bold tabular-nums">{{ formatearSoles(registrada.pago.totalAPagar) }}</dd></div>
          <div class="rounded-2xl border border-white/10 bg-white/[.04] p-4"><dt class="text-xs uppercase tracking-wide text-slate-400">Declarado</dt><dd class="mt-1 text-2xl font-bold tabular-nums">{{ formatearSoles(registrada.pago.declarado) }}</dd></div>
        </dl>
        <p class="mt-3 text-sm" :class="registrada.pago.saldo > 0.005 ? 'text-amber-200' : 'text-emerald-200'">{{ textoSaldo(registrada.pago.saldo) }}</p>
        <div class="mt-6 rounded-2xl border border-primary-400/25 bg-primary-400/[.07] p-4">
          <p class="text-sm font-semibold text-primary-200">Guarda tu link</p>
          <p class="mt-1 text-sm text-slate-300">Con este link puedes agregar más integrantes y más vouchers cuando quieras.</p>
          <p class="mt-2 break-all rounded-lg bg-black/20 px-3 py-2 font-mono text-xs text-slate-200">{{ enlaceDelegacion(registrada.codigoLink) }}</p>
          <div class="mt-3 flex flex-wrap gap-3">
            <button type="button" class="btn btn-primary" @click="copiarEnlace(registrada.codigoLink)">{{ copiado ? 'Copiado' : 'Copiar link' }}</button>
            <NuxtLink :to="{ path: '/delegaciones', query: { delegacion: registrada.codigoLink } }" class="btn btn-outline">Ver mi delegación</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Inscripciones cerradas -->
    <section v-else-if="cerradas" class="mx-auto max-w-3xl px-6 py-20 text-center" role="status">
      <Icon name="heroicons:lock-closed" class="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
      <h2 class="mt-4 text-2xl font-bold">Las inscripciones están cerradas</h2>
      <p class="mx-auto mt-3 max-w-xl text-slate-300">Si tienes dudas sobre tu delegación, comunícate con la organización.</p>
    </section>

    <!-- Delegación existente (con link) -->
    <template v-else-if="vista">
      <section class="mx-auto max-w-5xl space-y-10 px-6 py-12 lg:px-8" aria-labelledby="titulo-delegacion">
        <div class="del-card rounded-3xl border border-white/10 p-6 sm:p-8">
          <div class="flex flex-wrap items-center gap-2">
            <span class="del-chip">{{ ETIQUETA_MODALIDAD[vista.modalidad] }}</span>
            <span v-if="vista.tipoInscripcion" class="del-chip">{{ vista.tipoInscripcion.nombre }}</span>
          </div>
          <h2 id="titulo-delegacion" class="mt-3 text-3xl font-extrabold">{{ vista.nombre }}</h2>
          <p v-if="vista.institucion" class="text-slate-300">{{ vista.institucion }}</p>
          <p v-if="vista.representanteNombre" class="mt-1 text-sm text-slate-400">Delegado: {{ vista.representanteNombre }}</p>
          <dl class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-2xl border border-white/10 bg-white/[.04] p-4"><dt class="text-xs uppercase tracking-wide text-slate-400">Integrantes</dt><dd class="mt-1 text-2xl font-bold tabular-nums">{{ vista.totalIntegrantes }}</dd></div>
            <div class="rounded-2xl border border-white/10 bg-white/[.04] p-4"><dt class="text-xs uppercase tracking-wide text-slate-400">Por persona</dt><dd class="mt-1 text-2xl font-bold tabular-nums">{{ formatearSoles(vista.precioUnitario) }}</dd></div>
            <div class="rounded-2xl border border-white/10 bg-white/[.04] p-4"><dt class="text-xs uppercase tracking-wide text-slate-400">Total a pagar</dt><dd class="mt-1 text-2xl font-bold tabular-nums">{{ formatearSoles(vista.pago.totalAPagar) }}</dd></div>
            <div class="rounded-2xl border p-4" :class="vista.pago.saldo > 0.005 ? 'border-amber-300/30 bg-amber-300/[.07]' : 'border-emerald-300/30 bg-emerald-300/[.07]'">
              <dt class="text-xs uppercase tracking-wide text-slate-400">Saldo</dt>
              <dd class="mt-1 text-2xl font-bold tabular-nums">{{ formatearSoles(vista.pago.saldo) }}</dd>
              <dd class="text-xs text-slate-300">{{ textoSaldo(vista.pago.saldo) }}</dd>
            </div>
          </dl>
          <p v-if="vista.faltanParaPromocional !== null" class="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/[.07] px-4 py-3 text-sm text-amber-100">
            Faltan {{ vista.faltanParaPromocional }} integrante(s) para la tarifa promocional de {{ formatearSoles(vista.precioPromocional) }} por persona.
          </p>
          <p v-else-if="vista.modalidad === 'PRESENCIAL' && vista.totalIntegrantes" class="mt-4 rounded-2xl border border-emerald-300/25 bg-emerald-300/[.07] px-4 py-3 text-sm text-emerald-100">
            Tarifa promocional aplicada: {{ formatearSoles(vista.precioPromocional) }} por persona desde {{ vista.minIntegrantes }} integrantes.
          </p>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 class="text-xl font-bold">Integrantes registrados</h3>
            <ul v-if="vista.integrantes.length" class="mt-4 space-y-2">
              <li v-for="(integrante, indice) in vista.integrantes" :key="indice" class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-sm">
                <span>{{ integrante.nombres }} {{ integrante.apellidos }}</span>
                <span class="font-mono text-xs text-slate-400">{{ integrante.documento }}</span>
              </li>
            </ul>
            <p v-else class="mt-4 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-slate-300">Aún no registraste integrantes.</p>
          </div>
          <div>
            <h3 class="text-xl font-bold">Vouchers enviados</h3>
            <ul v-if="vista.pagos.length" class="mt-4 space-y-2">
              <li v-for="pago in vista.pagos" :key="pago.id" class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-sm">
                <span>{{ formatearSoles(pago.monto) }} · {{ pago.medio ?? 'pago' }} <span class="font-mono text-xs text-slate-400">{{ pago.numeroOperacion }}</span></span>
                <span class="del-estado" :class="`del-estado-${pago.estado.toLowerCase()}`">{{ ETIQUETA_ESTADO_PAGO[pago.estado] }}</span>
              </li>
            </ul>
            <p v-else class="mt-4 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-slate-300">Aún no subiste vouchers.</p>
          </div>
        </div>

        <p v-if="aviso" class="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-emerald-100" role="status">{{ aviso }}</p>
        <p v-if="errorEnvio" ref="bloqueError" tabindex="-1" class="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-100" role="alert">{{ errorEnvio }}</p>

        <form class="space-y-5" novalidate @submit.prevent="enviarIntegrantes">
          <h3 class="text-xl font-bold">Agregar integrantes</h3>
          <DelegacionesIntegrantesEditor v-model="filas" :errores="erroresFilas" />
          <p class="text-sm text-slate-300">
            <strong class="text-white">{{ integrantesNuevos }}</strong> por agregar → {{ vista.totalIntegrantes + integrantesNuevos }} en total ×
            <strong class="text-white">{{ formatearSoles(estimadoLink.precioUnitario) }}</strong> = <strong class="text-white">{{ formatearSoles(estimadoLink.total) }}</strong>
            <span class="text-slate-400"> (estimado)</span>
          </p>
          <button type="submit" class="btn btn-primary" :disabled="enviando || !integrantesNuevos">
            <Icon v-if="enviando" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" aria-hidden="true" />
            {{ enviando ? 'Enviando…' : 'Registrar integrantes' }}
          </button>
        </form>

        <form class="space-y-5" novalidate @submit.prevent="enviarPagos">
          <h3 class="text-xl font-bold">Agregar vouchers</h3>
          <DelegacionesPagosEditor v-model="pagos" :datos-pago="datosPago" :errores="erroresPagos" />
          <button type="submit" class="btn btn-primary" :disabled="enviandoPagos">
            <Icon v-if="enviandoPagos" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" aria-hidden="true" />
            {{ enviandoPagos ? 'Enviando…' : 'Enviar vouchers' }}
          </button>
        </form>
      </section>
    </template>

    <!-- Registro nuevo -->
    <form v-else class="mx-auto max-w-5xl space-y-12 px-6 py-12 lg:px-8" novalidate @submit.prevent="registrar">
      <section aria-labelledby="titulo-delegado" class="space-y-5">
        <div>
          <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Paso 1</p>
          <h2 id="titulo-delegado" class="mt-2 text-3xl font-bold tracking-tight">Datos del delegado</h2>
          <p class="mt-2 text-slate-300">Eres el contacto de tu delegación: te escribiremos a este correo.</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="del-doc" class="del-label">Documento</label>
            <div class="flex gap-2">
              <select v-model="delegado.tipoDocumento" class="del-campo w-24" aria-label="Tipo de documento">
                <option value="dni">DNI</option>
                <option value="ce">CE</option>
              </select>
              <input id="del-doc" v-model="delegado.numeroDocumento" class="del-campo min-w-0" maxlength="12" inputmode="numeric" autocomplete="off" :aria-invalid="Boolean(erroresDelegado.numeroDocumento)" @input="alEscribirDocumento" @blur="alSalirDelDocumento">
            </div>
            <p v-if="erroresDelegado.numeroDocumento" class="del-error" role="alert">{{ erroresDelegado.numeroDocumento }}</p>
            <p v-else-if="buscandoDelegado" class="mt-1 text-xs text-slate-400" role="status">Consultando el DNI…</p>
            <p v-else-if="avisoDelegado" class="mt-1 text-xs text-amber-200" role="status">{{ avisoDelegado }}</p>
          </div>
          <div>
            <label for="del-nombres" class="del-label">Nombres</label>
            <input id="del-nombres" v-model="delegado.nombres" class="del-campo" maxlength="120" autocomplete="given-name" :aria-invalid="Boolean(erroresDelegado.nombres)">
            <p v-if="erroresDelegado.nombres" class="del-error" role="alert">{{ erroresDelegado.nombres }}</p>
          </div>
          <div>
            <label for="del-apellidos" class="del-label">Apellidos</label>
            <input id="del-apellidos" v-model="delegado.apellidos" class="del-campo" maxlength="120" autocomplete="family-name" :aria-invalid="Boolean(erroresDelegado.apellidos)">
            <p v-if="erroresDelegado.apellidos" class="del-error" role="alert">{{ erroresDelegado.apellidos }}</p>
          </div>
          <div>
            <label for="del-correo" class="del-label">Correo</label>
            <input id="del-correo" v-model="delegado.correo" type="email" class="del-campo" maxlength="191" autocomplete="email" :aria-invalid="Boolean(erroresDelegado.correo)">
            <p v-if="erroresDelegado.correo" class="del-error" role="alert">{{ erroresDelegado.correo }}</p>
          </div>
          <div>
            <label for="del-celular" class="del-label">Celular</label>
            <input id="del-celular" v-model="delegado.celular" class="del-campo" maxlength="15" inputmode="tel" autocomplete="tel" :aria-invalid="Boolean(erroresDelegado.celular)">
            <p v-if="erroresDelegado.celular" class="del-error" role="alert">{{ erroresDelegado.celular }}</p>
          </div>
          <label class="flex items-center gap-3 self-end pb-2 text-slate-200">
            <input v-model="delegado.esIntegrante" type="checkbox" class="h-5 w-5 rounded">
            Yo también asistiré (cuento como integrante)
          </label>
        </div>
      </section>

      <section aria-labelledby="titulo-delegacion-nueva" class="space-y-5 border-t border-white/10 pt-10">
        <div>
          <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Paso 2</p>
          <h2 id="titulo-delegacion-nueva" class="mt-2 text-3xl font-bold tracking-tight">Tu delegación</h2>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="del-nombre" class="del-label">Nombre de la delegación</label>
            <input id="del-nombre" v-model="datosDelegacion.nombre" class="del-campo" maxlength="150" placeholder="Escuela de Ingeniería de Sistemas" :aria-invalid="Boolean(errores.nombre)">
            <p v-if="errores.nombre" class="del-error" role="alert">{{ errores.nombre }}</p>
          </div>
          <div>
            <label for="del-institucion" class="del-label">Institución <span class="font-normal text-slate-400">(opcional)</span></label>
            <input id="del-institucion" v-model="datosDelegacion.institucion" class="del-campo" maxlength="191" placeholder="Universidad Nacional de Huancavelica">
          </div>
        </div>
        <fieldset>
          <legend class="del-label">¿Cómo asistirá tu delegación?</legend>
          <div class="mt-2 flex flex-wrap gap-3">
            <label class="del-opcion" :class="{ activo: modalidad === 'PRESENCIAL' }">
              <input v-model="modalidad" type="radio" name="modalidad" value="PRESENCIAL" class="sr-only">
              <span class="font-semibold">Presencial</span>
              <span class="text-sm text-slate-300">{{ tarifa ? `${formatearSoles(tarifa.precioEstandar)} por persona · ${formatearSoles(tarifa.precioPromocional)} desde ${tarifa.minIntegrantes} integrantes (sin kit)` : '…' }}</span>
            </label>
            <label class="del-opcion" :class="{ activo: modalidad === 'VIRTUAL', desactivada: !virtualDisponible }">
              <input v-model="modalidad" type="radio" name="modalidad" value="VIRTUAL" class="sr-only" :disabled="!virtualDisponible">
              <span class="font-semibold">Virtual</span>
              <span class="text-sm text-slate-300">{{ virtualDisponible ? `${formatearSoles(tarifa?.virtual?.precio)} por persona, sin importar la cantidad` : 'Próximamente' }}</span>
            </label>
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="titulo-integrantes" class="space-y-5 border-t border-white/10 pt-10">
        <div>
          <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Paso 3</p>
          <h2 id="titulo-integrantes" class="mt-2 text-3xl font-bold tracking-tight">Integrantes</h2>
          <p class="mt-2 text-slate-300">
            {{ delegado.esIntegrante ? 'Tú ya cuentas como el integrante 1. Agrega a los demás.' : 'Agrega a todas las personas que asistirán.' }}
            Cada uno recibirá su credencial en su correo.
          </p>
        </div>
        <DelegacionesIntegrantesEditor v-model="filas" :errores="erroresFilas" />
        <p v-if="errores.integrantes" class="del-error" role="alert">{{ errores.integrantes }}</p>
      </section>

      <section v-if="tarifa" class="border-t border-white/10 pt-10" aria-live="polite">
        <div class="del-card rounded-3xl border border-white/10 p-6 sm:p-8">
          <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Tu total</p>
          <p class="mt-3 text-lg text-slate-200">
            <strong class="text-white">{{ cantidad }}</strong> integrante(s) ×
            <strong class="text-white">{{ formatearSoles(estimado.precioUnitario) }}</strong> =
            <strong class="text-3xl text-white">{{ formatearSoles(estimado.total) }}</strong>
          </p>
          <p v-if="estimado.faltan !== null && cantidad" class="mt-2 text-sm text-amber-200">
            Faltan {{ estimado.faltan }} integrante(s) para pagar {{ formatearSoles(tarifa.precioPromocional) }} por persona.
          </p>
          <p v-else-if="estimado.promocional" class="mt-2 text-sm text-emerald-200">¡Tarifa promocional aplicada!</p>
          <p class="mt-2 text-xs text-slate-400">Estimado: el monto definitivo lo confirma la organización.</p>
        </div>
      </section>

      <section aria-labelledby="titulo-pago" class="space-y-5 border-t border-white/10 pt-10">
        <div>
          <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Paso 4</p>
          <h2 id="titulo-pago" class="mt-2 text-3xl font-bold tracking-tight">Tus vouchers de pago</h2>
          <p class="mt-2 text-slate-300">Paga el total de tu delegación y sube el voucher. Si pagas en partes, sube uno por cada pago.</p>
        </div>
        <DelegacionesPagosEditor v-model="pagos" :datos-pago="datosPago" :errores="erroresPagos" />
        <p v-if="tarifa && cantidad" class="text-sm" :class="saldoNuevo > 0.005 ? 'text-amber-200' : 'text-emerald-200'">
          Total {{ formatearSoles(estimado.total) }} · declarado en vouchers {{ formatearSoles(declarado) }} · {{ textoSaldo(saldoNuevo) }}
        </p>
      </section>

      <p v-if="errorEnvio" ref="bloqueError" tabindex="-1" class="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-100" role="alert">{{ errorEnvio }}</p>

      <div class="flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
        <button type="submit" class="btn btn-primary" :disabled="enviando || !tarifa">
          <Icon v-if="enviando" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" aria-hidden="true" />
          {{ enviando ? 'Enviando…' : 'Registrar mi delegación' }}
        </button>
        <p class="text-sm text-slate-400">Tus datos se conservan si algo falla.</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { ErroresFormulario, FilaIntegrante, FormularioDelegado, PagoFormulario, DelegacionVisible, TarifaDelegaciones } from '~/types/delegaciones'
import type { ModalidadAsistencia } from '~/types/evento'
import { mensajeFallaConsultaDni } from '~/utils/consulta-dni'
import {
  ETIQUETA_MODALIDAD, delegadoVacio, erroresPorIntegrante, estimarGrupo, filaEnBlanco, filaVacia, mensajeErrorDelegacion,
  normalizarDni, pagoVacio, tarifaDeVista, textoSaldo, validarDelegado, validarIntegrantes, validarPago,
} from '~/utils/delegaciones'
import { formatearSoles } from '~/utils/formato'
import { fechaHoyLima } from '~/utils/inscripcion'
import { normalizeApiError } from '~/composables/useApi'

// Página oculta: no está en el menú ni en el pie, y los buscadores no la indexan
useSeoMeta({
  title: 'Inscripción de delegaciones | VIII CIISIC 2026',
  description: 'Registro de delegaciones del VIII CIISIC 2026.',
  robots: 'noindex, nofollow',
})

const ETIQUETA_ESTADO_PAGO = { PENDIENTE: 'Por revisar', VERIFICADO: 'Verificado', RECHAZADO: 'Rechazado' } as const

const route = useRoute()
const { evento, datosPago, inscripcionesAbiertas, recargar: recargarEvento } = useEvento()
const { consultDni } = useConsultation()
const api = useDelegacion()

/** Código del link del delegado (`/delegaciones?delegacion=<código>`); vacío = registro nuevo. */
const codigo = computed(() => String(route.query.delegacion ?? '').trim())

// ─── Tarifa ───
const tarifa = ref<TarifaDelegaciones | null>(null)
const virtualDisponible = computed(() => tarifa.value?.virtual != null)

async function cargarTarifa() {
  try {
    tarifa.value = await api.tarifa()
  } catch {
    tarifa.value = null
    errorEnvio.value = 'No pudimos cargar las tarifas. Recarga la página e inténtalo nuevamente.'
  }
}

// ─── Estado común ───
const enviando = ref(false)
const enviandoPagos = ref(false)
const errorEnvio = ref('')
const aviso = ref('')
const bloqueError = ref<HTMLElement | null>(null)
const bloqueListo = ref<HTMLElement | null>(null)
const errores = ref<ErroresFormulario>({})
const erroresDelegado = ref<ErroresFormulario>({})
const erroresFilas = ref<Record<number, ErroresFormulario>>({})
const erroresPagos = ref<Record<number, ErroresFormulario>>({})

// Las filas y los vouchers nacen vacíos y la primera fila se agrega al montar: sus claves vienen de un contador y
// el servidor y el navegador no coincidirían al hidratar (los `for`/`id` de los campos llevan la clave)
const filas = ref<FilaIntegrante[]>([])
const pagos = ref<PagoFormulario[]>([])

// ─── Link de una delegación existente ───
const vista = ref<DelegacionVisible | null>(null)
const cargandoLink = ref(false)
const errorLink = ref('')

async function cargarLink() {
  if (!codigo.value) {
    vista.value = null
    errorLink.value = ''
    return
  }
  cargandoLink.value = true
  errorLink.value = ''
  try {
    vista.value = await api.porCodigo(codigo.value)
  } catch (error) {
    vista.value = null
    errorLink.value = mensajeErrorDelegacion(normalizeApiError(error))
  } finally {
    cargandoLink.value = false
  }
}

/** Cerradas: con link, según el evento de la delegación; sin link, según el evento cargado (si no cargó, no se afirma nada). */
const cerradas = computed(() => (vista.value
  ? vista.value.evento.inscripcionesAbiertas === false
  : !codigo.value && evento.value !== null && !inscripcionesAbiertas.value))

// ─── Registro nuevo ───
const delegado = reactive<FormularioDelegado>(delegadoVacio())
const datosDelegacion = reactive({ nombre: '', institucion: '' })
const modalidad = ref<ModalidadAsistencia>('PRESENCIAL')
const registrada = ref<DelegacionVisible | null>(null)

const buscandoDelegado = ref(false)
const avisoDelegado = ref('')

/** Con 8 dígitos y sin nombres escritos, completa al delegado desde la consulta DNI. */
async function alEscribirDocumento() {
  delegado.numeroDocumento = delegado.numeroDocumento.replace(/\s+/g, '')
  if (delegado.tipoDocumento !== 'dni' || !/^\d{8}$/.test(delegado.numeroDocumento) || buscandoDelegado.value) return
  if (delegado.nombres.trim() || delegado.apellidos.trim()) return
  const numero = delegado.numeroDocumento
  buscandoDelegado.value = true
  avisoDelegado.value = ''
  try {
    const persona = await consultDni(numero)
    if (delegado.numeroDocumento !== numero) return
    if (persona) Object.assign(delegado, persona)
    else avisoDelegado.value = 'La consulta no devolvió nombres. Escríbelos.'
  } catch (error) {
    if (delegado.numeroDocumento === numero) avisoDelegado.value = mensajeFallaConsultaDni(normalizeApiError(error), numero)
  } finally {
    buscandoDelegado.value = false
  }
}

function alSalirDelDocumento() {
  if (delegado.tipoDocumento === 'dni') delegado.numeroDocumento = normalizarDni(delegado.numeroDocumento)
  void alEscribirDocumento()
}

const integrantesNuevos = computed(() => filas.value.filter(fila => !filaEnBlanco(fila)).length)
const cantidad = computed(() => integrantesNuevos.value + (delegado.esIntegrante ? 1 : 0))
const estimado = computed(() => (tarifa.value ? estimarGrupo(modalidad.value, cantidad.value, tarifa.value) : { precioUnitario: 0, total: 0, faltan: null, promocional: false }))
const estimadoLink = computed(() => (vista.value
  ? estimarGrupo(vista.value.modalidad, vista.value.totalIntegrantes + integrantesNuevos.value, tarifaDeVista(vista.value))
  : { precioUnitario: 0, total: 0, faltan: null, promocional: false }))
const declarado = computed(() => pagos.value.reduce((suma, pago) => suma + (Number(pago.monto) > 0 ? Number(pago.monto) : 0), 0))
const saldoNuevo = computed(() => Math.round((estimado.value.total - declarado.value) * 100) / 100)

function irAlPrimerError() {
  void nextTick(() => {
    const campo = document.querySelector<HTMLElement>('[aria-invalid="true"]')
    if (campo) {
      campo.scrollIntoView({ block: 'center', behavior: 'smooth' })
      campo.focus({ preventScroll: true })
      return
    }
    bloqueError.value?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    bloqueError.value?.focus({ preventScroll: true })
  })
}

/** Errores de integrantes del backend por posición → por clave de fila (solo las filas con datos se enviaron). */
function aErroresPorClave(fields: Record<string, string> | undefined, desfase: number): Record<number, ErroresFormulario> {
  const claves = filas.value.filter(fila => !filaEnBlanco(fila)).map(fila => fila.clave)
  const resultado: Record<number, ErroresFormulario> = {}
  for (const [posicion, campos] of Object.entries(erroresPorIntegrante(fields, desfase))) {
    const clave = claves[Number(posicion)]
    if (clave !== undefined) resultado[clave] = campos
  }
  return resultado
}

function validarVouchers(): boolean {
  const hoy = fechaHoyLima()
  const resultado: Record<number, ErroresFormulario> = {}
  for (const pago of pagos.value) {
    const campos = validarPago(pago, hoy)
    if (Object.keys(campos).length) resultado[pago.clave] = campos
  }
  erroresPagos.value = resultado
  return !Object.keys(resultado).length
}

async function registrar() {
  if (enviando.value || !tarifa.value) return
  errorEnvio.value = ''
  errores.value = {}
  erroresDelegado.value = validarDelegado(delegado)
  erroresFilas.value = validarIntegrantes(filas.value, delegado.esIntegrante ? delegado : null)
  if (datosDelegacion.nombre.trim().length < 2) errores.value.nombre = 'Ingresa el nombre de la delegación.'
  if (!cantidad.value) errores.value.integrantes = 'Registra al menos un integrante.'
  const vouchersValidos = validarVouchers()
  if (Object.keys(erroresDelegado.value).length || Object.keys(erroresFilas.value).length || Object.keys(errores.value).length || !vouchersValidos) {
    errorEnvio.value = 'Revisa los campos marcados antes de enviar.'
    irAlPrimerError()
    return
  }

  enviando.value = true
  try {
    registrada.value = await api.registrar({
      codigoLink: null,
      modalidad: modalidad.value,
      delegacion: { nombre: datosDelegacion.nombre, institucion: datosDelegacion.institucion },
      delegado,
      integrantes: filas.value,
      pagos: pagos.value,
    })
    void nextTick(() => bloqueListo.value?.focus())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    const normalizado = normalizeApiError(error)
    errorEnvio.value = mensajeErrorDelegacion(normalizado)
    // Los errores por campo del backend (`representante.correo`, `participantes[2].numeroDocumento`)
    const campos = normalizado.fields ?? {}
    erroresDelegado.value = Object.fromEntries(Object.entries(campos).filter(([campo]) => campo.startsWith('representante.')).map(([campo, texto]) => [campo.replace('representante.', ''), texto]))
    erroresFilas.value = aErroresPorClave(campos, delegado.esIntegrante ? 1 : 0)
    irAlPrimerError()
  } finally {
    enviando.value = false
  }
}

// ─── Con el link: solo agrega ───
async function enviarIntegrantes() {
  if (enviando.value || !vista.value) return
  errorEnvio.value = ''
  aviso.value = ''
  erroresFilas.value = validarIntegrantes(filas.value)
  if (!integrantesNuevos.value) return
  if (Object.keys(erroresFilas.value).length) {
    errorEnvio.value = 'Revisa los integrantes marcados antes de enviar.'
    irAlPrimerError()
    return
  }
  enviando.value = true
  try {
    const respuesta = await api.agregarIntegrantes(vista.value.codigoLink, filas.value)
    vista.value = respuesta
    filas.value = [filaVacia()]
    aviso.value = `Listo: ${respuesta.registrados ?? 0} integrante(s) registrados${respuesta.omitidos ? ` y ${respuesta.omitidos} ya estaban` : ''}.`
  } catch (error) {
    const normalizado = normalizeApiError(error)
    errorEnvio.value = mensajeErrorDelegacion(normalizado)
    erroresFilas.value = aErroresPorClave(normalizado.fields, 0)
    irAlPrimerError()
  } finally {
    enviando.value = false
  }
}

async function enviarPagos() {
  if (enviandoPagos.value || !vista.value) return
  errorEnvio.value = ''
  aviso.value = ''
  if (!validarVouchers()) {
    errorEnvio.value = 'Revisa los vouchers marcados antes de enviar.'
    irAlPrimerError()
    return
  }
  enviandoPagos.value = true
  try {
    vista.value = await api.agregarPagos(vista.value.codigoLink, pagos.value)
    pagos.value = [pagoVacio()]
    erroresPagos.value = {}
    aviso.value = 'Listo: recibimos tus vouchers. La organización los revisará.'
  } catch (error) {
    errorEnvio.value = mensajeErrorDelegacion(normalizeApiError(error))
    irAlPrimerError()
  } finally {
    enviandoPagos.value = false
  }
}

// ─── Link para volver ───
const copiado = ref(false)

function enlaceDelegacion(codigoLink: string): string {
  const origen = import.meta.client ? window.location.origin : ''
  return `${origen}/delegaciones?delegacion=${encodeURIComponent(codigoLink)}`
}

async function copiarEnlace(codigoLink: string) {
  try {
    await navigator.clipboard.writeText(enlaceDelegacion(codigoLink))
    copiado.value = true
    setTimeout(() => { copiado.value = false }, 2000)
  } catch {
    copiado.value = false
  }
}

onMounted(async () => {
  if (!filas.value.length) filas.value = [filaVacia()]
  if (!pagos.value.length) pagos.value = [pagoVacio()]
  await Promise.all([cargarTarifa(), cargarLink()])
  if (!datosPago.value) void recargarEvento()
})

// Al cambiar de link (o salir de él) se reinicia lo escrito
watch(codigo, () => {
  registrada.value = null
  filas.value = [filaVacia()]
  pagos.value = [pagoVacio()]
  errorEnvio.value = ''
  aviso.value = ''
  void cargarLink()
})
</script>

<style>
/* Estilos de la página y de sus componentes (IntegrantesEditor, PagosEditor): no son «scoped» a propósito */
.del-hero { background: radial-gradient(circle at 50% 0%, #087dd83d, transparent 48%), #041d39; }
.del-grid { opacity: .25; background-image: linear-gradient(#1d7fb43d 1px, transparent 1px), linear-gradient(90deg, #1d7fb43d 1px, transparent 1px); background-size: 64px 64px; mask-image: linear-gradient(to bottom, black, transparent); }
.del-card { background: linear-gradient(150deg, #0a3157d9, #062541f2); box-shadow: 0 20px 55px #020f2033; }
.del-listo { background: linear-gradient(150deg, #0a3157d9, #062541f2); box-shadow: 0 20px 55px #020f2033; }
.del-listo:focus { outline: none; }
.del-chip { display: inline-flex; align-items: center; border: 1px solid #ffffff1a; border-radius: 9999px; background: #ffffff08; padding: .3rem .8rem; font-size: .8rem; font-weight: 600; color: #cbd5e1; }
.del-label { display: block; margin-bottom: .4rem; font-size: .875rem; font-weight: 600; color: #e2e8f0; }
.del-campo { width: 100%; border-radius: .75rem; border: 1px solid #ffffff26; background: #ffffff0d; padding: .7rem .9rem; color: #fff; transition: border-color .2s ease, background-color .2s ease; }
.del-campo::placeholder { color: #94a3b8; }
.del-campo:focus { outline: none; border-color: #22d3ee; background: #ffffff14; }
.del-campo[aria-invalid='true'] { border-color: #f87171; }
select.del-campo option { color: #0f172a; }
.del-error { margin-top: .35rem; font-size: .8rem; color: #fca5a5; }
.del-opcion { display: flex; min-width: 16rem; flex: 1; cursor: pointer; flex-direction: column; gap: .25rem; border: 1px solid #ffffff26; border-radius: 1rem; padding: 1rem 1.25rem; transition: border-color .2s ease, background-color .2s ease; }
.del-opcion:hover { border-color: #22d3ee80; }
.del-opcion.activo { border-color: #22d3ee; background: #22d3ee1f; }
.del-opcion.desactivada { cursor: not-allowed; opacity: .55; }
.del-opcion:has(input:focus-visible) { outline: 2px solid #22d3ee; outline-offset: 2px; }
.del-estado { border-radius: 9999px; padding: .15rem .65rem; font-size: .72rem; font-weight: 700; }
.del-estado-pendiente { background: #fbbf2426; color: #fcd34d; }
.del-estado-verificado { background: #34d39926; color: #6ee7b7; }
.del-estado-rechazado { background: #f8717126; color: #fca5a5; }
@media (prefers-reduced-motion: reduce) { .del-campo, .del-opcion { transition: none; } }
</style>
