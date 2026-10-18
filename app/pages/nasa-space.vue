<!-- ============================================================================
     PÁGINA NASA SPACE — EVENTO FUTURO
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900 py-20">
    <div class="custom-container">
      <div class="max-w-4xl mx-auto text-center">
        <!-- ⚠️ CONTENIDO PENDIENTE: página provisional del Nasa Space. Sustituir
             título, descripción, fecha, sede, bases e imagen cuando el evento
             sea oficial. -->
        <p
          class="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-primary"
        >
          Próximamente
        </p>
        <h1 class="mb-6 text-4xl font-bold text-white lg:text-6xl">
          Nasa <span class="text-primary">Space</span>
        </h1>
        <p class="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-300">
          Un nuevo evento de la Escuela Profesional de Ingeniería de Sistemas
          de la Universidad Nacional de Cañete. Estamos preparando los
          detalles: fecha, sede y bases oficiales se anunciarán pronto.
        </p>

        <div class="mb-12 flex flex-wrap justify-center gap-3">
          <span
            class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-gray-200"
          >
            <Icon name="heroicons:calendar-days" class="h-4 w-4 text-primary" />
            Fecha por confirmar
          </span>
          <span
            class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-gray-200"
          >
            <Icon name="heroicons:map-pin" class="h-4 w-4 text-primary" />
            Sede por confirmar
          </span>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/"
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-secondary-900 transition-colors hover:bg-primary-300"
          >
            Volver al inicio
            <Icon name="heroicons:arrow-right" class="h-5 w-5 shrink-0" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Nasa Space | Próximamente · UNDC",
  description:
    "Nasa Space: un nuevo evento de la Escuela Profesional de Ingeniería de Sistemas de la UNDC. Fecha, sede y bases por confirmar.",
  ogTitle: "Nasa Space | Próximamente",
  ogDescription:
    "Próximamente: Nasa Space, un nuevo evento de la Escuela Profesional de Ingeniería de Sistemas de la UNDC.",
});
</script>
