<!-- /delegaciones: registro público de una delegación (representante + integrantes + un solo pago).
     Con ?delegacion=<código> el formulario se abre con esa delegación ya cargada (la comparte el
     staff desde el panel). Contrato: backend-ciisic/specs/018-delegaciones/contracts/api-delegaciones.md. -->
<template>
  <div class="registration-page min-h-screen pb-16 lg:pb-24">
    <div class="mx-auto max-w-6xl px-6 pt-12 sm:pt-16 lg:px-8 lg:pt-24">
      <div class="mx-auto max-w-3xl text-center">
        <p class="kicker mb-4">VIII CIISIC 2026 · Inscripciones</p>
        <h1 class="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">Registro de <span class="text-primary-400">delegaciones</span></h1>
        <p class="mt-6 text-lg leading-relaxed text-slate-300">Inscribe a tu delegación universitaria o institucional de una sola vez: el representante llena sus datos, agrega a los integrantes y realiza un solo pago por el total.</p>
      </div>

      <EstadoInscripciones v-if="cargando" estado="cargando" />
      <EstadoInscripciones v-else-if="hayError" estado="error" @reintentar="recargar" />
      <EstadoInscripciones v-else-if="evento && !inscripcionesAbiertas" estado="cerradas" />
      <EstadoInscripciones v-else-if="codigoLink && !delegacion" estado="error" @reintentar="recargar" />
      <DelegacionesFormularioDelegacion v-else class="mt-10" :codigo-link="codigoLink || undefined" />
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Delegaciones | VIII CIISIC 2026', description: 'Registra tu delegación universitaria o institucional en el VIII CIISIC 2026: el representante agrega a los integrantes y paga el total junto.' })

const route = useRoute()

/** El link que comparte el staff: `?delegacion=<código>`. */
const codigoLink = computed(() => String(route.query.delegacion ?? '').trim())

const { evento, inscripcionesAbiertas, cargando: cargandoEvento, error: errorEvento, recargar: recargarEvento } = useEvento()
const { cargando: cargandoTarifa, error: errorTarifa, recargar: recargarTarifa } = useTarifaDelegaciones()
const { delegacion, cargando: cargandoDelegacion, error: errorDelegacion, recargar: recargarDelegacion } = useDelegacionPorLink(codigoLink)

const cargando = computed(() => cargandoEvento.value || cargandoTarifa.value || cargandoDelegacion.value)
const hayError = computed(() => Boolean(errorEvento.value || errorTarifa.value || errorDelegacion.value))
function recargar() {
  recargarEvento()
  recargarTarifa()
  recargarDelegacion()
}
</script>

<style scoped>
.registration-page { background: radial-gradient(circle at 50% 0, #0a4b7a, transparent 38%), #041d39; }
.kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
@media (max-width: 359px) { .registration-page h1 { font-size: 2.5rem; } }
</style>
