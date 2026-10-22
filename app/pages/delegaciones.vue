<template>
  <div class="del-page min-h-screen bg-[#041d39] text-white">
    <section class="del-hero relative overflow-hidden border-b border-white/10 px-6 py-14 sm:py-16 lg:px-8">
      <div class="del-grid absolute inset-0" aria-hidden="true" />
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-300">VIII CIISIC UNDC · 2026</p>
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Inscripción de delegaciones</h1>
        <p class="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
          {{ modo === 'integrante'
            ? 'Inscríbete en la delegación de tu institución: elige tu plan y completa tus datos.'
            : 'Agrega a los integrantes de tu delegación, sube los vouchers de pago y vuelve con tu link cuando quieras sumar a alguien más.' }}
        </p>
      </div>
    </section>

    <!-- ═══ Link individual: cada integrante se inscribe solo ═══ -->
    <template v-if="modo === 'integrante'">
      <section v-if="cargandoPublica" class="mx-auto max-w-3xl px-6 py-20 text-center text-slate-300" role="status">
        <Icon name="heroicons:arrow-path" class="mx-auto h-8 w-8 animate-spin text-primary-400" aria-hidden="true" />
        <p class="mt-4">Cargando tu delegación…</p>
      </section>

      <section v-else-if="errorPublica" class="mx-auto max-w-3xl px-6 py-20 text-center" role="alert">
        <Icon name="heroicons:exclamation-triangle" class="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
        <h2 class="mt-4 text-2xl font-bold">No pudimos abrir este link</h2>
        <p class="mx-auto mt-3 max-w-xl text-slate-300">{{ errorPublica }}</p>
        <button type="button" class="btn btn-outline mt-6" @click="cargarPublica">Reintentar</button>
      </section>

      <section v-else-if="inscrita" class="mx-auto max-w-3xl px-6 py-14 lg:px-8" aria-labelledby="titulo-inscrito">
        <div ref="bloqueListo" tabindex="-1" class="del-listo rounded-3xl border border-emerald-300/30 p-7 sm:p-9" role="status">
          <span class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <Icon name="heroicons:check-circle" class="h-8 w-8" aria-hidden="true" />
          </span>
          <h2 id="titulo-inscrito" class="mt-5 text-3xl font-extrabold">
            {{ inscrita.omitidos ? 'Ya estabas inscrito' : '¡Listo, quedaste inscrito!' }}
          </h2>
          <p class="mt-2 text-slate-300">
            Estás en la delegación <strong class="text-white">{{ inscrita.delegacion.nombre }}</strong> con el plan
            <strong class="text-white">{{ inscrita.plan.codigo ? ETIQUETA_PLAN[inscrita.plan.codigo] : '' }}</strong>.
            El pago lo realiza tu delegación en conjunto: cuando la organización apruebe al grupo recibirás tu credencial en tu correo.
          </p>
        </div>
      </section>

      <section v-else-if="cerradasPublica" class="mx-auto max-w-3xl px-6 py-20 text-center" role="status">
        <Icon name="heroicons:lock-closed" class="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
        <h2 class="mt-4 text-2xl font-bold">Las inscripciones están cerradas</h2>
        <p class="mx-auto mt-3 max-w-xl text-slate-300">Si tienes dudas, comunícate con la organización.</p>
      </section>

      <form v-else-if="publica" class="mx-auto max-w-3xl space-y-10 px-6 py-12 lg:px-8" novalidate @submit.prevent="inscribirme">
        <div class="del-card rounded-3xl border border-white/10 p-6 sm:p-8">
          <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Tu delegación</p>
          <h2 class="mt-2 text-3xl font-extrabold">{{ publica.nombre }}</h2>
          <p v-if="publica.institucion" class="text-slate-300">{{ publica.institucion }}</p>
        </div>

        <fieldset v-if="planesPublicos.length > 1" class="space-y-3">
          <legend class="del-label">Elige tu plan</legend>
          <div class="flex flex-wrap gap-3">
            <label v-for="plan in planesPublicos" :key="plan.codigo" class="del-opcion" :class="{ activo: formulario.plan === plan.codigo }">
              <input v-model="formulario.plan" type="radio" name="plan" :value="plan.codigo" class="sr-only">
              <span class="font-semibold">{{ ETIQUETA_PLAN[plan.codigo] }}</span>
              <span class="text-sm text-slate-300">{{ DESCRIPCION_PLAN[plan.codigo] }}</span>
              <span class="text-sm font-semibold text-primary-200">{{ textoPrecioPlan(plan, publica.minIntegrantes) }}</span>
            </label>
          </div>
          <p v-if="erroresIndividual.plan" class="del-error" role="alert">{{ erroresIndividual.plan }}</p>
        </fieldset>
        <p v-else-if="planesPublicos.length === 1" class="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-slate-200">
          Plan: <strong class="text-white">{{ ETIQUETA_PLAN[planesPublicos[0]!.codigo] }}</strong> · {{ textoPrecioPlan(planesPublicos[0]!, publica.minIntegrantes) }} por persona
        </p>
        <p v-else class="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-amber-100" role="alert">
          Esta delegación aún no tiene planes disponibles. Comunícate con la organización.
        </p>

        <section class="space-y-5">
          <h3 class="text-xl font-bold">Tus datos</h3>
          <div class="grid gap-x-4 gap-y-5 md:grid-cols-12">
            <div class="md:col-span-4">
              <label for="ind-doc" class="del-label">Documento</label>
              <div class="del-grupo">
                <select v-model="formulario.tipoDocumento" class="del-campo del-tipo" aria-label="Tipo de documento" @change="avisoDni = ''">
                  <option value="dni">DNI</option>
                  <option value="ce">CE</option>
                </select>
                <input
                  id="ind-doc"
                  v-model="formulario.numeroDocumento"
                  class="del-campo"
                  maxlength="12"
                  :inputmode="formulario.tipoDocumento === 'dni' ? 'numeric' : 'text'"
                  :placeholder="formulario.tipoDocumento === 'dni' ? '8 dígitos' : 'Número de CE'"
                  autocomplete="off"
                  :aria-invalid="Boolean(erroresIndividual.numeroDocumento)"
                  @input="alEscribirDocumento"
                  @blur="alSalirDelDocumento"
                  @keydown.enter.prevent="alPulsarEnterDocumento"
                >
              </div>
              <p v-if="erroresIndividual.numeroDocumento" class="del-error" role="alert">{{ erroresIndividual.numeroDocumento }}</p>
              <p v-else-if="buscandoDni" class="mt-1.5 flex items-center gap-1.5 text-xs text-slate-300" role="status">
                <Icon name="heroicons:arrow-path" class="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Consultando el DNI…
              </p>
              <p v-else-if="avisoDni" class="mt-1.5 text-xs text-amber-200" role="status">{{ avisoDni }}</p>
            </div>
            <div class="md:col-span-4">
              <label for="ind-nombres" class="del-label">Nombres</label>
              <input id="ind-nombres" v-model="formulario.nombres" class="del-campo" maxlength="120" autocomplete="given-name" :aria-invalid="Boolean(erroresIndividual.nombres)">
              <p v-if="erroresIndividual.nombres" class="del-error" role="alert">{{ erroresIndividual.nombres }}</p>
            </div>
            <div class="md:col-span-4">
              <label for="ind-apellidos" class="del-label">Apellidos</label>
              <input id="ind-apellidos" v-model="formulario.apellidos" class="del-campo" maxlength="120" autocomplete="family-name" :aria-invalid="Boolean(erroresIndividual.apellidos)">
              <p v-if="erroresIndividual.apellidos" class="del-error" role="alert">{{ erroresIndividual.apellidos }}</p>
            </div>
            <div class="md:col-span-8">
              <label for="ind-correo" class="del-label">{{ publica.dominioCorreo ? 'Tu correo institucional' : 'Correo' }}</label>
              <div :class="publica.dominioCorreo ? 'del-grupo' : undefined">
                <input
                  id="ind-correo"
                  v-model="formulario.correo"
                  :type="publica.dominioCorreo ? 'text' : 'email'"
                  class="del-campo"
                  maxlength="191"
                  inputmode="email"
                  autocomplete="off"
                  autocapitalize="none"
                  spellcheck="false"
                  :placeholder="publica.dominioCorreo ? 'usuario' : 'correo@ejemplo.com'"
                  :aria-invalid="Boolean(erroresIndividual.correo)"
                  @blur="alSalirDelCorreo"
                >
                <span v-if="publica.dominioCorreo" class="del-sufijo">@{{ publica.dominioCorreo }}</span>
              </div>
              <p v-if="erroresIndividual.correo" class="del-error" role="alert">{{ erroresIndividual.correo }}</p>
              <p v-else-if="publica.dominioCorreo" class="mt-1.5 text-xs text-slate-400">Escribe solo lo que va antes de la @. No necesitas iniciar sesión con Google.</p>
            </div>
            <div class="md:col-span-4">
              <label for="ind-celular" class="del-label">Celular <span class="font-normal text-slate-400">(opcional)</span></label>
              <input id="ind-celular" v-model="formulario.celular" class="del-campo" maxlength="15" inputmode="tel" autocomplete="tel" placeholder="987654321" :aria-invalid="Boolean(erroresIndividual.celular)">
              <p v-if="erroresIndividual.celular" class="del-error" role="alert">{{ erroresIndividual.celular }}</p>
            </div>
          </div>
        </section>

        <p v-if="errorEnvio" ref="bloqueError" tabindex="-1" class="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-100" role="alert">{{ errorEnvio }}</p>

        <div class="flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
          <button type="submit" class="btn btn-primary" :disabled="enviando || !planesPublicos.length">
            <Icon v-if="enviando" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" aria-hidden="true" />
            {{ enviando ? 'Enviando…' : 'Inscribirme' }}
          </button>
          <p class="text-sm text-slate-400">El pago lo realiza tu delegación en conjunto.</p>
        </div>
      </form>
    </template>

    <!-- ═══ Link del delegado ═══ -->
    <template v-else-if="modo === 'delegado'">
      <section v-if="cargandoLink" class="mx-auto max-w-3xl px-6 py-20 text-center text-slate-300" role="status">
        <Icon name="heroicons:arrow-path" class="mx-auto h-8 w-8 animate-spin text-primary-400" aria-hidden="true" />
        <p class="mt-4">Cargando tu delegación…</p>
      </section>

      <section v-else-if="errorLink" class="mx-auto max-w-3xl px-6 py-20 text-center" role="alert">
        <Icon name="heroicons:exclamation-triangle" class="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
        <h2 class="mt-4 text-2xl font-bold">No pudimos abrir tu delegación</h2>
        <p class="mx-auto mt-3 max-w-xl text-slate-300">{{ errorLink }}</p>
        <button type="button" class="btn btn-outline mt-6" @click="cargarLink">Reintentar</button>
      </section>

      <section v-else-if="cerradas" class="mx-auto max-w-3xl px-6 py-20 text-center" role="status">
        <Icon name="heroicons:lock-closed" class="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
        <h2 class="mt-4 text-2xl font-bold">Las inscripciones están cerradas</h2>
        <p class="mx-auto mt-3 max-w-xl text-slate-300">Si tienes dudas sobre tu delegación, comunícate con la organización.</p>
      </section>

      <section v-else-if="vista" class="mx-auto max-w-5xl space-y-10 px-6 py-12 lg:px-8" aria-labelledby="titulo-delegacion">
        <div class="del-card rounded-3xl border border-white/10 p-6 sm:p-8">
          <div class="flex flex-wrap items-center gap-2">
            <span v-for="plan in planesVista" :key="plan.codigo" class="del-chip">{{ ETIQUETA_PLAN[plan.codigo] }}</span>
            <span v-if="vista.dominioCorreo" class="del-chip">@{{ vista.dominioCorreo }}</span>
          </div>
          <h2 id="titulo-delegacion" class="mt-3 text-3xl font-extrabold">{{ vista.nombre }}</h2>
          <p v-if="vista.institucion" class="text-slate-300">{{ vista.institucion }}</p>
          <p v-if="vista.representanteNombre" class="mt-1 text-sm text-slate-400">Delegado: {{ vista.representanteNombre }}</p>
          <dl class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-2xl border border-white/10 bg-white/[.04] p-4"><dt class="text-xs uppercase tracking-wide text-slate-400">Integrantes</dt><dd class="mt-1 text-2xl font-bold tabular-nums">{{ vista.totalIntegrantes }}</dd></div>
            <div class="rounded-2xl border border-white/10 bg-white/[.04] p-4"><dt class="text-xs uppercase tracking-wide text-slate-400">Total a pagar</dt><dd class="mt-1 text-2xl font-bold tabular-nums">{{ formatearSoles(vista.pago.totalAPagar) }}</dd></div>
            <div class="rounded-2xl border border-white/10 bg-white/[.04] p-4"><dt class="text-xs uppercase tracking-wide text-slate-400">Declarado</dt><dd class="mt-1 text-2xl font-bold tabular-nums">{{ formatearSoles(vista.pago.declarado) }}</dd></div>
            <div class="rounded-2xl border p-4" :class="vista.pago.saldo > 0.005 ? 'border-amber-300/30 bg-amber-300/[.07]' : 'border-emerald-300/30 bg-emerald-300/[.07]'">
              <dt class="text-xs uppercase tracking-wide text-slate-400">Saldo</dt>
              <dd class="mt-1 text-2xl font-bold tabular-nums">{{ formatearSoles(vista.pago.saldo) }}</dd>
              <dd class="text-xs text-slate-300">{{ textoSaldo(vista.pago.saldo) }}</dd>
            </div>
          </dl>

          <ul class="mt-4 grid gap-3 sm:grid-cols-3">
            <li v-for="plan in planesVista" :key="plan.codigo" class="rounded-2xl border border-white/10 bg-white/[.04] p-4">
              <p class="font-semibold">{{ ETIQUETA_PLAN[plan.codigo] }}</p>
              <p class="mt-1 text-sm text-slate-300">{{ textoPrecioPlan(plan, vista.minIntegrantes) }}</p>
              <p class="mt-1 text-xs text-slate-400">{{ plan.integrantes }} integrante(s)</p>
            </li>
          </ul>
          <p v-if="!planesVista.length" class="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/[.07] px-4 py-3 text-sm text-amber-100">
            Tu delegación aún no tiene planes activos: la organización los está configurando.
          </p>
          <p v-else-if="vista.faltanParaPromocional !== null" class="mt-4 rounded-2xl border border-amber-300/25 bg-amber-300/[.07] px-4 py-3 text-sm text-amber-100">
            Faltan {{ vista.faltanParaPromocional }} integrante(s) para el precio promocional.
          </p>

          <div v-if="vista.codigoInscripcion" class="mt-6 rounded-2xl border border-primary-400/25 bg-primary-400/[.07] p-4">
            <p class="text-sm font-semibold text-primary-200">Link para que tus integrantes se inscriban solos</p>
            <p class="mt-1 text-sm text-slate-300">Compártelo con tu grupo: cada uno elige su plan y completa sus datos. El pago lo sigues haciendo tú, en conjunto.</p>
            <p class="mt-2 break-all rounded-lg bg-black/20 px-3 py-2 font-mono text-xs text-slate-200">{{ enlaceIndividual(vista.codigoInscripcion) }}</p>
            <button type="button" class="btn btn-primary mt-3" @click="copiarIndividual(vista.codigoInscripcion)">{{ copiadoIndividual ? 'Copiado' : 'Copiar link' }}</button>
          </div>
        </div>

        <div class="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 class="text-xl font-bold">Integrantes registrados</h3>
            <ul v-if="vista.integrantes.length" class="mt-4 space-y-2">
              <li v-for="(integrante, indice) in vista.integrantes" :key="indice" class="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-sm">
                <span>{{ integrante.nombres }} {{ integrante.apellidos }}</span>
                <span class="flex items-center gap-2">
                  <span v-if="integrante.plan" class="del-chip">{{ ETIQUETA_PLAN[integrante.plan] }}</span>
                  <span class="font-mono text-xs text-slate-400">{{ integrante.documento }}</span>
                </span>
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

        <p v-if="aviso" ref="bloqueAviso" tabindex="-1" class="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-emerald-100 outline-none" role="status">{{ aviso }}</p>
        <p v-if="errorEnvio" ref="bloqueError" tabindex="-1" class="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-red-100" role="alert">{{ errorEnvio }}</p>

        <form class="space-y-5" novalidate @submit.prevent="enviarIntegrantes">
          <h3 class="text-xl font-bold">Agregar integrantes</h3>
          <p v-if="!planesVista.length" class="text-sm text-slate-300">Podrás agregar integrantes cuando la organización active los planes de tu delegación.</p>
          <template v-else>
            <DelegacionesIntegrantesEditor v-model="filas" :errores="erroresFilas" :planes="planesVista" :dominio="vista.dominioCorreo" />
            <div class="del-accion">
              <p class="text-sm text-slate-300" aria-live="polite">
                <strong class="text-white">{{ integrantesNuevos }}</strong> por agregar · {{ vista.totalIntegrantes + integrantesNuevos }} en el grupo
                <span class="block text-slate-400">
                  <span class="hidden sm:inline">Total estimado: </span><strong class="text-white">{{ formatearSoles(estimadoLink.total) }}</strong>
                  <span class="sm:hidden"> estimado</span><span class="hidden sm:inline"> (con el plan de cada uno)</span>
                </span>
              </p>
              <button type="submit" class="btn btn-primary w-full sm:w-auto" :disabled="enviando || !integrantesNuevos">
                <Icon v-if="enviando" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" aria-hidden="true" />
                <Icon v-else name="heroicons:check" class="h-5 w-5" aria-hidden="true" />
                {{ enviando ? 'Enviando…' : integrantesNuevos ? `Registrar ${integrantesNuevos} integrante${integrantesNuevos === 1 ? '' : 's'}` : 'Registrar integrantes' }}
              </button>
            </div>
          </template>
        </form>

        <form class="space-y-5" novalidate @submit.prevent="enviarPagos">
          <h3 class="text-xl font-bold">Agregar vouchers</h3>
          <p class="text-sm text-slate-300">Paga el total de tu delegación y sube el voucher. Si pagas en partes, sube uno por cada pago.</p>
          <DelegacionesPagosEditor v-model="pagos" :datos-pago="datosPago" :errores="erroresPagos" />
          <button type="submit" class="btn btn-primary" :disabled="enviandoPagos">
            <Icon v-if="enviandoPagos" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" aria-hidden="true" />
            {{ enviandoPagos ? 'Enviando…' : 'Enviar vouchers' }}
          </button>
        </form>
      </section>
    </template>

    <!-- ═══ Sin link ═══ -->
    <section v-else class="mx-auto max-w-3xl px-6 py-20 text-center">
      <Icon name="heroicons:link" class="mx-auto h-10 w-10 text-primary-300" aria-hidden="true" />
      <h2 class="mt-4 text-2xl font-bold">Usa el link que te envió la organización</h2>
      <p class="mx-auto mt-3 max-w-xl text-slate-300">
        Cada delegación tiene su propio link: el delegado entra con el suyo para agregar integrantes y vouchers, y los integrantes con el link individual que comparta su delegado.
        Si aún no lo tienes, comunícate con la organización.
      </p>
      <NuxtLink to="/contacto" class="btn btn-outline mt-6">Contactar a la organización</NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
import type {
  DelegacionPublica, DelegacionVisible, ErroresFormulario, FilaIntegrante, FormularioInscripcionIndividual, InscripcionIndividualRespuesta, PagoFormulario,
} from '~/types/delegaciones'
import { mensajeFallaConsultaDni } from '~/utils/consulta-dni'
import {
  DESCRIPCION_PLAN, ETIQUETA_PLAN, cantidadesPorPlan, erroresInscripcionIndividual, erroresPorIntegrante, estimarGrupo, filaEnBlanco, filaVacia,
  inscripcionIndividualVacia, mensajeErrorDelegacion, normalizarDni, pagoVacio, planesActivos, planPorDefecto, prefijoDeCorreo, textoPrecioPlan,
  textoSaldo, validarInscripcionIndividual, validarIntegrantes, validarPago,
} from '~/utils/delegaciones'
import { formatearSoles } from '~/utils/formato'
import { fechaHoyLima } from '~/utils/inscripcion'
import { normalizeApiError } from '~/composables/useApi'

// Página oculta: no está en el menú ni en el pie, y los buscadores no la indexan
useSeoMeta({
  title: 'Inscripción de delegaciones | VIII CIISIC 2026',
  description: 'Inscripción de delegaciones del VIII CIISIC 2026.',
  robots: 'noindex, nofollow',
})

const ETIQUETA_ESTADO_PAGO = { PENDIENTE: 'Por revisar', VERIFICADO: 'Verificado', RECHAZADO: 'Rechazado' } as const

const route = useRoute()
const { datosPago, recargar: recargarEvento } = useEvento()
const { consultDni } = useConsultation()
const api = useDelegacion()

/** Link del delegado (`/delegaciones?delegacion=<código>`) y link individual (`/delegaciones?unirme=<código>`). */
const codigo = computed(() => String(route.query.delegacion ?? '').trim())
const codigoIndividual = computed(() => String(route.query.unirme ?? '').trim())
const modo = computed<'delegado' | 'integrante' | 'ninguno'>(() => (codigoIndividual.value ? 'integrante' : codigo.value ? 'delegado' : 'ninguno'))

// ─── Estado común ───
const enviando = ref(false)
const errorEnvio = ref('')
const bloqueError = ref<HTMLElement | null>(null)
const bloqueListo = ref<HTMLElement | null>(null)
const bloqueAviso = ref<HTMLElement | null>(null)

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

/** Tras registrar integrantes o vouchers el aviso queda arriba: se lleva a la vista para que se note que salió bien. */
function irAlAviso() {
  void nextTick(() => bloqueAviso.value?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
}

// ═══ Link individual ═══
const publica = ref<DelegacionPublica | null>(null)
const cargandoPublica = ref(modo.value === 'integrante')
const errorPublica = ref('')
const inscrita = ref<InscripcionIndividualRespuesta | null>(null)
const formulario = reactive<FormularioInscripcionIndividual>(inscripcionIndividualVacia())
const erroresIndividual = ref<ErroresFormulario>({})
const buscandoDni = ref(false)
const avisoDni = ref('')

const planesPublicos = computed(() => publica.value?.planes ?? [])
const cerradasPublica = computed(() => publica.value?.evento.inscripcionesAbiertas === false)

async function cargarPublica() {
  if (!codigoIndividual.value) {
    publica.value = null
    errorPublica.value = ''
    return
  }
  cargandoPublica.value = true
  errorPublica.value = ''
  try {
    publica.value = await api.publica(codigoIndividual.value)
    // Con un solo plan activo ya queda elegido
    if (publica.value.planes.length === 1) formulario.plan = publica.value.planes[0]?.codigo ?? ''
  } catch (error) {
    publica.value = null
    errorPublica.value = mensajeErrorDelegacion(normalizeApiError(error))
  } finally {
    cargandoPublica.value = false
  }
}

/** Con 8 dígitos y sin nombres escritos, completa los nombres desde la consulta DNI. */
async function alEscribirDocumento() {
  formulario.numeroDocumento = formulario.numeroDocumento.replace(/\s+/g, '')
  if (formulario.tipoDocumento !== 'dni' || !/^\d{8}$/.test(formulario.numeroDocumento) || buscandoDni.value) return
  if (formulario.nombres.trim() || formulario.apellidos.trim()) return
  const numero = formulario.numeroDocumento
  buscandoDni.value = true
  avisoDni.value = ''
  try {
    const persona = await consultDni(numero)
    if (formulario.numeroDocumento !== numero) return
    if (persona) Object.assign(formulario, { nombres: persona.nombres, apellidos: persona.apellidos })
    else avisoDni.value = 'La consulta no devolvió nombres. Escríbelos.'
  } catch (error) {
    if (formulario.numeroDocumento === numero) avisoDni.value = mensajeFallaConsultaDni(normalizeApiError(error), numero)
  } finally {
    buscandoDni.value = false
  }
}

function alSalirDelDocumento() {
  if (formulario.tipoDocumento === 'dni') formulario.numeroDocumento = normalizarDni(formulario.numeroDocumento)
  void alEscribirDocumento()
}

/** Enter en el documento no envía el formulario: consulta el DNI y pasa a los nombres. */
function alPulsarEnterDocumento() {
  alSalirDelDocumento()
  document.getElementById('ind-nombres')?.focus()
}

/** Con dominio, si pegan el correo completo se deja solo el prefijo (el sufijo ya está a la vista). */
function alSalirDelCorreo() {
  if (publica.value?.dominioCorreo) formulario.correo = prefijoDeCorreo(formulario.correo, publica.value.dominioCorreo)
}

async function inscribirme() {
  if (enviando.value || !publica.value) return
  errorEnvio.value = ''
  erroresIndividual.value = validarInscripcionIndividual(formulario, { dominio: publica.value.dominioCorreo, planes: planesPublicos.value })
  if (Object.keys(erroresIndividual.value).length) {
    errorEnvio.value = 'Revisa los campos marcados antes de enviar.'
    irAlPrimerError()
    return
  }
  enviando.value = true
  try {
    inscrita.value = await api.inscribirme(codigoIndividual.value, formulario, publica.value.dominioCorreo)
    void nextTick(() => bloqueListo.value?.focus())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    const normalizado = normalizeApiError(error)
    errorEnvio.value = mensajeErrorDelegacion(normalizado)
    erroresIndividual.value = erroresInscripcionIndividual(normalizado.fields)
    irAlPrimerError()
  } finally {
    enviando.value = false
  }
}

// ═══ Link del delegado ═══
const vista = ref<DelegacionVisible | null>(null)
const cargandoLink = ref(modo.value === 'delegado')
const errorLink = ref('')
const aviso = ref('')
const enviandoPagos = ref(false)
const erroresFilas = ref<Record<number, ErroresFormulario>>({})
const erroresPagos = ref<Record<number, ErroresFormulario>>({})
const copiadoIndividual = ref(false)

// Las filas y los vouchers nacen vacíos y la primera fila se agrega al montar: sus claves vienen de un contador y
// el servidor y el navegador no coincidirían al hidratar (los `for`/`id` de los campos llevan la clave)
const filas = ref<FilaIntegrante[]>([])
const pagos = ref<PagoFormulario[]>([])

const planesVista = computed(() => (vista.value ? planesActivos(vista.value.planes) : []))
const planUnicoVista = computed(() => (vista.value ? planPorDefecto(vista.value.planes) : ''))
const integrantesNuevos = computed(() => filas.value.filter(fila => !filaEnBlanco(fila)).length)

/** Lo que costará el grupo con los integrantes que ya tiene y los que están por agregarse. */
const estimadoLink = computed(() => {
  if (!vista.value) return { integrantes: 0, total: 0, faltan: null, unitarios: {} }
  const cantidades = cantidadesPorPlan(filas.value, planUnicoVista.value)
  for (const plan of vista.value.planes) cantidades[plan.codigo] = (cantidades[plan.codigo] ?? 0) + plan.integrantes
  return estimarGrupo(vista.value.planes, cantidades, vista.value.minIntegrantes)
})

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
    if (!filas.value.length || filas.value.every(filaEnBlanco)) filas.value = [filaVacia(planPorDefecto(vista.value.planes))]
  } catch (error) {
    vista.value = null
    errorLink.value = mensajeErrorDelegacion(normalizeApiError(error))
  } finally {
    cargandoLink.value = false
  }
}

/** Cerradas: según el evento de la delegación (si no cargó, no se afirma nada). */
const cerradas = computed(() => (vista.value ? vista.value.evento.inscripcionesAbiertas === false : false))

/** Errores de integrantes del backend por posición → por clave de fila (solo las filas con datos se enviaron). */
function aErroresPorClave(fields: Record<string, string> | undefined): Record<number, ErroresFormulario> {
  const claves = filas.value.filter(fila => !filaEnBlanco(fila)).map(fila => fila.clave)
  const resultado: Record<number, ErroresFormulario> = {}
  for (const [posicion, campos] of Object.entries(erroresPorIntegrante(fields, 0))) {
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

async function enviarIntegrantes() {
  if (enviando.value || !vista.value) return
  errorEnvio.value = ''
  aviso.value = ''
  erroresFilas.value = validarIntegrantes(filas.value, { dominio: vista.value.dominioCorreo, pedirPlan: planesVista.value.length > 1 })
  if (!integrantesNuevos.value) return
  if (Object.keys(erroresFilas.value).length) {
    errorEnvio.value = 'Revisa los integrantes marcados antes de enviar.'
    irAlPrimerError()
    return
  }
  enviando.value = true
  try {
    const respuesta = await api.agregarIntegrantes(vista.value.codigoLink, filas.value, vista.value.dominioCorreo)
    vista.value = respuesta
    filas.value = [filaVacia(planPorDefecto(respuesta.planes))]
    aviso.value = `Listo: ${respuesta.registrados ?? 0} integrante(s) registrados${respuesta.omitidos ? ` y ${respuesta.omitidos} ya estaban` : ''}.`
    irAlAviso()
  } catch (error) {
    const normalizado = normalizeApiError(error)
    errorEnvio.value = mensajeErrorDelegacion(normalizado)
    erroresFilas.value = aErroresPorClave(normalizado.fields)
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
    irAlAviso()
  } catch (error) {
    errorEnvio.value = mensajeErrorDelegacion(normalizeApiError(error))
    irAlPrimerError()
  } finally {
    enviandoPagos.value = false
  }
}

// ─── Link individual para compartir ───
function enlaceIndividual(codigoInscripcion: string): string {
  const origen = import.meta.client ? window.location.origin : ''
  return `${origen}/delegaciones?unirme=${encodeURIComponent(codigoInscripcion)}`
}

async function copiarIndividual(codigoInscripcion: string) {
  try {
    await navigator.clipboard.writeText(enlaceIndividual(codigoInscripcion))
    copiadoIndividual.value = true
    setTimeout(() => { copiadoIndividual.value = false }, 2000)
  } catch {
    copiadoIndividual.value = false
  }
}

onMounted(async () => {
  if (!pagos.value.length) pagos.value = [pagoVacio()]
  await Promise.all([cargarLink(), cargarPublica()])
  if (modo.value === 'delegado' && !filas.value.length) filas.value = [filaVacia()]
  if (!datosPago.value) void recargarEvento()
})

// Al cambiar de link (o salir de él) se reinicia lo escrito
watch([codigo, codigoIndividual], () => {
  inscrita.value = null
  Object.assign(formulario, inscripcionIndividualVacia())
  erroresIndividual.value = {}
  filas.value = []
  pagos.value = [pagoVacio()]
  errorEnvio.value = ''
  aviso.value = ''
  void cargarLink()
  void cargarPublica()
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
.del-fila { border: 1px solid #ffffff1a; border-radius: 1rem; background: #ffffff0a; padding: 1rem 1.1rem 1.25rem; transition: border-color .2s ease; }
.del-fila:focus-within { border-color: #22d3ee59; }
.del-quitar { display: inline-flex; align-items: center; gap: .35rem; border-radius: 9999px; padding: .4rem .7rem; font-size: .8rem; font-weight: 600; color: #cbd5e1; transition: background-color .2s ease, color .2s ease; }
.del-quitar:hover { background: #f871711f; color: #fecaca; }
/* Control compuesto (tipo + número, usuario + @dominio): un solo borde y un solo foco */
.del-grupo { display: flex; align-items: stretch; border-radius: .75rem; border: 1px solid #ffffff26; background: #ffffff0d; transition: border-color .2s ease, background-color .2s ease; }
.del-grupo:focus-within { border-color: #22d3ee; background: #ffffff14; }
.del-grupo:has([aria-invalid='true']) { border-color: #f87171; }
.del-grupo > .del-campo { min-width: 0; flex: 1 1 0%; border: 0; border-radius: 0; background: transparent; }
.del-grupo > .del-campo:focus { background: transparent; }
.del-grupo > .del-campo:first-child { border-radius: .75rem 0 0 .75rem; }
.del-grupo > .del-campo:last-child { border-radius: 0 .75rem .75rem 0; }
.del-grupo > .del-tipo { flex: 0 0 auto; width: auto; border-right: 1px solid #ffffff1f; padding-right: .5rem; font-weight: 600; cursor: pointer; }
.del-sufijo { display: flex; max-width: 60%; flex: 0 0 auto; align-items: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; border-left: 1px solid #ffffff1f; border-radius: 0 .75rem .75rem 0; background: #ffffff0a; padding: 0 .9rem; font-size: .9rem; color: #cbd5e1; }
.del-plan { display: inline-flex; cursor: pointer; align-items: baseline; gap: .5rem; border: 1px solid #ffffff26; border-radius: .75rem; padding: .55rem .9rem; transition: border-color .2s ease, background-color .2s ease; }
.del-plan:hover { border-color: #22d3ee80; }
.del-plan.activo { border-color: #22d3ee; background: #22d3ee1f; }
.del-plan:has(input:focus-visible) { outline: 2px solid #22d3ee; outline-offset: 2px; }
/* Resumen y botón de envío siempre a la vista mientras el formulario está en pantalla */
.del-page .btn:disabled { cursor: not-allowed; opacity: .5; box-shadow: none; transform: none; }
.del-accion { position: sticky; bottom: .75rem; z-index: 10; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem 1.5rem; border: 1px solid #ffffff26; border-radius: 1rem; background: #062541f2; padding: .75rem 1rem; box-shadow: 0 14px 40px #020f2080; backdrop-filter: blur(8px); }
@media (min-width: 640px) { .del-accion { bottom: 1rem; padding: .85rem 1.1rem; } }
.del-opcion { display: flex; min-width: 14rem; flex: 1; cursor: pointer; flex-direction: column; gap: .25rem; border: 1px solid #ffffff26; border-radius: 1rem; padding: 1rem 1.25rem; transition: border-color .2s ease, background-color .2s ease; }
.del-opcion:hover { border-color: #22d3ee80; }
.del-opcion.activo { border-color: #22d3ee; background: #22d3ee1f; }
.del-opcion:has(input:focus-visible) { outline: 2px solid #22d3ee; outline-offset: 2px; }
.del-estado { border-radius: 9999px; padding: .15rem .65rem; font-size: .72rem; font-weight: 700; }
.del-estado-pendiente { background: #fbbf2426; color: #fcd34d; }
.del-estado-verificado { background: #34d39926; color: #6ee7b7; }
.del-estado-rechazado { background: #f8717126; color: #fca5a5; }
@media (prefers-reduced-motion: reduce) { .del-campo, .del-opcion, .del-fila, .del-grupo, .del-plan, .del-quitar { transition: none; } }
</style>
