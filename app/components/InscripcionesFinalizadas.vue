<template>
  <section :class="compacto ? 'py-2' : 'px-4 py-16 sm:py-20'" aria-live="polite">
    <div
      class="mx-auto max-w-2xl rounded-2xl border border-slate-700/60 bg-slate-800/60 p-8 text-center shadow-xl sm:p-10"
      role="status"
    >
      <span
        class="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400"
      >
        <Icon name="heroicons:lock-closed" class="h-7 w-7" aria-hidden="true" />
      </span>

      <h2 class="mt-6 text-3xl font-bold uppercase tracking-wide text-white">
        Inscripciones finalizadas
      </h2>
      <p class="mt-3 leading-relaxed text-slate-300">
        Las inscripciones al VII CIISIC han finalizado. Gracias por ser parte del congreso.
      </p>
      <p class="mt-2 text-sm text-slate-400">
        Si tienes dudas sobre tu inscripción, escríbenos desde la página de
        <NuxtLink to="/contacto" class="font-semibold text-green-400 underline hover:text-green-300"
          >contacto</NuxtLink
        >.
      </p>

      <NuxtLink
        v-if="!compacto"
        to="/"
        class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-green-400 hover:text-green-300"
      >
        <Icon name="heroicons:arrow-left" class="h-4 w-4" aria-hidden="true" />
        Volver al inicio
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
// Aviso de que las inscripciones del VII CIISIC ya no están abiertas.
// `compacto` lo usa /planes, donde el aviso va dentro del encabezado de la página.
defineProps<{
  compacto?: boolean
}>()
</script>
