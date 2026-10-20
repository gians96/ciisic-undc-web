<template>
  <section id="inscripcion-egresados" class="registration-card overflow-hidden rounded-[2rem] border border-white/10" aria-labelledby="inscripcion-egresados-title">
    <div class="grid gap-8 p-7 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(290px,.9fr)] lg:gap-12 lg:p-12">
      <div>
        <span class="registration-icon inline-flex h-14 w-14 items-center justify-center rounded-2xl">
          <Icon name="heroicons:clipboard-document-check" class="h-7 w-7" aria-hidden="true" />
        </span>
        <p class="section-kicker mt-7">Inscripción gratuita</p>
        <h2 id="inscripcion-egresados-title" class="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Participa en el Encuentro de Egresados
        </h2>
        <p class="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
          Reencuéntrate con tus compañeros de Ingeniería de Sistemas de la UNDC. Completa el formulario oficial para registrar tu participación.
        </p>

        <div class="mt-7" aria-live="polite">
          <a
            v-if="estado === 'abierta' && configuracion.url"
            :href="configuracion.url"
            target="_blank"
            rel="noopener noreferrer"
            class="registration-button inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold sm:w-auto"
            @click="validarDisponibilidadAntesDeAbrir"
          >
            Inscribirme gratuitamente
            <Icon name="heroicons:arrow-top-right-on-square" class="h-5 w-5" aria-hidden="true" />
            <span class="sr-only"> (se abre en una pestaña nueva)</span>
          </a>

          <div v-else-if="estado === 'cerrada'" class="status-box status-box-closed" role="status">
            <Icon name="heroicons:lock-closed" class="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
            <div>
              <strong class="block text-base text-white">Inscripciones cerradas</strong>
              <span>El plazo de inscripción finalizó el 23 de octubre de 2026.</span>
            </div>
          </div>

          <div v-else class="status-box" role="status">
            <Icon name="heroicons:clock" class="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
            <div>
              <strong class="block text-base text-white">Formulario disponible próximamente</strong>
              <span>El enlace aparecerá aquí cuando la organización autorice la apertura.</span>
            </div>
          </div>
        </div>
      </div>

      <div class="event-summary rounded-2xl border border-white/10 p-5 sm:p-6">
        <p class="text-xs font-bold uppercase tracking-[.16em] text-primary-300">Datos confirmados</p>
        <dl class="mt-4 divide-y divide-white/10 text-sm">
          <div v-for="fila in filas" :key="fila.label" class="flex items-start justify-between gap-5 py-4">
            <dt class="text-slate-400">{{ fila.label }}</dt>
            <dd class="max-w-[62%] text-right font-semibold text-white">{{ fila.valor }}</dd>
          </div>
        </dl>

        <div class="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-slate-300">
          <p class="flex items-start gap-3">
            <Icon name="heroicons:shield-check" class="mt-0.5 h-5 w-5 shrink-0 text-primary-300" aria-hidden="true" />
            <span>El registro se realizará únicamente mediante el formulario oficial de Google.</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  formatearCierreInscripcionEgresados,
} from '~/utils/inscripcion-egresados'
import { useInscripcionEgresados } from '~/composables/useInscripcionEgresados'

const { configuracion, estado, validarDisponibilidadAntesDeAbrir } = useInscripcionEgresados()

const filas = computed(() => [
  { label: 'Fecha', valor: '27 de octubre de 2026' },
  { label: 'Horario', valor: '6:00 p. m. – 8:00 p. m.' },
  { label: 'Lugar', valor: 'Casa de la Cultura' },
  { label: 'Costo', valor: 'Gratuito' },
  { label: 'Fecha límite', valor: formatearCierreInscripcionEgresados(configuracion.cierre) },
])

</script>

<style scoped>
.registration-card {
  scroll-margin-top: calc(var(--header-height, 5rem) + 1.5rem);
  background:
    radial-gradient(circle at 10% 8%, #00d9e817, transparent 34%),
    radial-gradient(circle at 92% 10%, #f59e0b12, transparent 30%),
    linear-gradient(145deg, #0a3157, #061f3b);
  box-shadow: 0 28px 80px #020f204d;
}
.registration-icon {
  border: 1px solid #fbbf2440;
  background: #f59e0b17;
  color: #fcd34d;
}
.section-kicker {
  color: #67e8f9;
  font-size: .75rem;
  font-weight: 800;
  letter-spacing: .2em;
  text-transform: uppercase;
}
.event-summary { background: #031a3280; }
.registration-button {
  background: #00d9e8;
  color: #032f5f;
  box-shadow: 0 12px 34px #00d9e82b;
  transition: transform .2s ease, background .2s ease;
}
.registration-button:hover { background: #67e8f9; transform: translateY(-2px); }
.registration-button:focus-visible { outline: 2px solid #67e8f9; outline-offset: 3px; }
.status-box {
  display: flex;
  max-width: 38rem;
  align-items: flex-start;
  gap: .75rem;
  border: 1px solid #67e8f940;
  border-radius: 1rem;
  background: #22d3ee12;
  padding: 1rem;
  color: #bae6fd;
  font-size: .875rem;
  line-height: 1.55;
}
.status-box-closed {
  border-color: #fbbf2440;
  background: #f59e0b12;
  color: #fde68a;
}
@media (prefers-reduced-motion: reduce) {
  .registration-button { transition: none; }
  .registration-button:hover { transform: none; }
}
</style>
