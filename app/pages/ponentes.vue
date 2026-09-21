<template>
  <div class="bg-[#041d39] px-6 py-16 text-white sm:py-20 lg:py-24">
    <section class="mx-auto max-w-4xl text-center">
      <p class="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-400">
        VIII CIISIC UNDC · 2026
      </p>
      <h1 class="mb-6 text-4xl font-bold md:text-6xl">Ponentes invitados</h1>
      <p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-300">
        Estamos preparando la relación de especialistas nacionales e internacionales que participarán
        del 26 al 30 de octubre de 2026.
      </p>
      <div class="mx-auto max-w-xl rounded-2xl border border-primary-400/25 bg-slate-800/70 p-8">
        <Icon name="heroicons:user-group" class="mx-auto mb-5 h-14 w-14 text-primary-400" />
        <h2 class="mb-3 text-2xl font-semibold">Anuncios próximamente</h2>
        <p class="text-slate-300">
          Los perfiles de la edición anterior fueron retirados para no atribuir participaciones todavía no confirmadas.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Ponentes | VIII CIISIC 2026',
  meta: [
    {
      name: 'description',
      content: 'Ponentes invitados del VIII CIISIC 2026 de la Universidad Nacional de Cañete.',
    },
  ],
})
</script>
