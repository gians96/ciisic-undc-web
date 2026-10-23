<!-- Panel lateral de inscripción: datos, botón de inscripción (o «Inscripciones cerradas»), bases y contacto. -->
<template>
  <aside class="ss-panel overflow-hidden rounded-[2rem] border border-white/10 p-7 sm:p-9" :aria-labelledby="`panel-${actividad.slug}`">
    <span class="ss-icon-box h-14 w-14 rounded-2xl">
      <Icon :name="actividad.icono" class="h-7 w-7" />
    </span>
    <p class="mt-7 text-xs font-bold uppercase tracking-[.2em] text-primary-300">Inscripción</p>
    <h2 :id="`panel-${actividad.slug}`" class="mt-3 text-3xl font-bold tracking-tight text-white">{{ inscripcion.titulo }}</h2>
    <p class="mt-4 leading-relaxed text-slate-300">{{ inscripcion.descripcion }}</p>

    <dl class="mt-6 space-y-3 rounded-2xl border border-white/10 bg-[#041d39]/45 p-5 text-sm">
      <div v-for="fila in inscripcion.filas" :key="fila.label" class="flex items-start justify-between gap-4">
        <dt class="text-slate-400">{{ fila.label }}</dt>
        <dd class="text-right font-semibold text-white">{{ fila.valor }}</dd>
      </div>
    </dl>

    <a
      v-if="abierta"
      :href="inscripcion.url"
      target="_blank"
      rel="noopener noreferrer"
      class="ss-btn ss-btn-primary mt-7"
    >
      {{ inscripcion.texto }}
      <Icon name="heroicons:arrow-top-right-on-square" class="h-5 w-5" />
      <span class="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
    <p v-else role="status" class="mt-7 flex items-start gap-3 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-relaxed text-amber-100">
      <Icon name="heroicons:lock-closed" class="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span><strong class="block text-base text-white">Inscripciones cerradas</strong>El plazo terminó el {{ cierreTexto }}.</span>
    </p>

    <a
      :href="actividad.bases.url"
      target="_blank"
      rel="noopener noreferrer"
      class="ss-btn ss-btn-secondary mt-3"
    >
      {{ actividad.bases.texto }}
      <Icon name="heroicons:document-arrow-down" class="h-5 w-5" />
      <span class="sr-only"> (se abre en una pestaña nueva)</span>
    </a>

    <div class="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm text-slate-400">
      <p class="flex items-start gap-2">
        <Icon name="heroicons:shield-check" class="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
        El registro se realiza únicamente mediante el enlace oficial.
      </p>
      <p v-if="actividad.contacto" class="flex items-start gap-2">
        <Icon name="heroicons:phone" class="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
        <span>
          Consultas:
          <a :href="actividad.contacto.href" class="ss-link font-semibold text-primary-200 hover:text-white">{{ actividad.contacto.texto }}</a>
        </span>
      </p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { ActividadSemanaSistemica } from '~/data/semana-sistemica'
import { formatearFechaSoloDia } from '~/utils/formato'
import { inscripcionAbierta } from '~/utils/semana-sistemica'

const props = defineProps<{ actividad: ActividadSemanaSistemica }>()

const inscripcion = computed(() => props.actividad.inscripcion)

// El cierre se evalúa en el navegador, tras montar (como la cuenta regresiva): el HTML del servidor
// muestra el botón y, si el plazo ya pasó, el cliente lo cambia sin desajuste de hidratación.
const ahora = ref<number | null>(null)
onMounted(() => {
  ahora.value = Date.now()
})

const abierta = computed(() => ahora.value === null || inscripcionAbierta(inscripcion.value.cierre, ahora.value))
const cierreTexto = computed(() => formatearFechaSoloDia(inscripcion.value.cierre.slice(0, 10)))
</script>

<style scoped>
.ss-panel {
  background: radial-gradient(circle at 80% 0%, color-mix(in srgb, var(--acento) 15%, transparent), transparent 38%), linear-gradient(150deg, #0a3157, #062541);
  box-shadow: 0 28px 80px #020f204d;
}
</style>
