<template>
  <main class="min-h-screen bg-slate-900 text-white">
    <section class="relative overflow-hidden px-6 py-24 lg:py-32">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-yellow-500/10" />
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-400">
          VIII CIISIC UNDC · 2026
        </p>
        <h1 class="mb-6 text-4xl font-bold md:text-6xl">
          Cronograma de actividades
        </h1>
        <p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
          El VIII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica
          se realizará del 26 al 30 de octubre de 2026 en la Casa de la Cultura de la
          Universidad Nacional de Cañete.
        </p>

        <div class="mx-auto max-w-2xl rounded-2xl border border-primary-400/25 bg-slate-800/70 p-8 shadow-2xl backdrop-blur">
          <Icon name="heroicons:calendar-days" class="mx-auto mb-5 h-14 w-14 text-primary-400" />
          <h2 class="mb-3 text-2xl font-semibold">Agenda en preparación</h2>
          <p class="text-slate-300">
            Próximamente publicaremos las conferencias, talleres, ponentes y horarios de cada día.
          </p>
          <div class="mt-7 flex flex-wrap justify-center gap-2" aria-label="Días del evento">
            <span
              v-for="day in eventDays"
              :key="day.date"
              class="rounded-full border border-slate-600 bg-slate-700/70 px-4 py-2 text-sm text-slate-200"
            >
              {{ day.label }} {{ day.date }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
const eventDays = [
  { label: 'Lun.', date: 26 },
  { label: 'Mar.', date: 27 },
  { label: 'Mié.', date: 28 },
  { label: 'Jue.', date: 29 },
  { label: 'Vie.', date: 30 },
]

useHead({
  title: 'Cronograma | VIII CIISIC 2026',
  meta: [
    {
      name: 'description',
      content: 'Cronograma del VIII CIISIC de la UNDC, del 26 al 30 de octubre de 2026.',
    },
    { property: 'og:title', content: 'Cronograma | VIII CIISIC 2026' },
    {
      property: 'og:description',
      content: 'La agenda detallada del VIII CIISIC 2026 será publicada próximamente.',
    },
  ],
})
</script>
