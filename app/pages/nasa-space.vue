<!-- ============================================================================
     PÁGINA NASA SPACE — EVENTO FUTURO
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900 py-20">
    <div class="custom-container">
      <div class="max-w-4xl mx-auto text-center">
        <!-- ⚠️ CONTENIDO PENDIENTE: página provisional del Nasa Space. Sustituir
             título, descripción, fecha, sede y bases cuando el evento sea
             oficial (la imagen ya es la oficial del Space Apps 2026). -->
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
          de la Universidad Nacional de Cañete.
        </p>

        <img
          src="/images/eventos/nasa-space.webp"
          alt="Logo oficial del NASA Space Apps Challenge 2026"
          width="1920"
          height="1080"
          class="mx-auto mb-10 w-full max-w-xl rounded-2xl border border-white/10"
        >

        <div class="mb-12 flex flex-wrap justify-center gap-3">
          <span
            class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-gray-200"
          >
            <Icon name="heroicons:calendar-days" class="h-4 w-4 text-primary" />
            14 y 15 de noviembre de 2026
          </span>
          <span
            class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-gray-200"
          >
            <Icon name="heroicons:map-pin" class="h-4 w-4 text-primary" />
            Sede por confirmar
          </span>
        </div>

        <div class="flex flex-wrap justify-center gap-4">
          <a
            href="https://www.spaceappschallenge.org/2026/local-events/san-vicente-de-canete/"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-secondary-900 transition-colors hover:bg-primary-300"
          >
            Sitio oficial del Space Apps Challenge
            <Icon name="heroicons:arrow-up-right" class="h-5 w-5 shrink-0" />
          </a>
          <NuxtLink
            to="/"
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary/40 px-6 py-3 font-semibold text-primary-300 transition-colors hover:bg-primary/10"
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
  ogImage: "/images/eventos/nasa-space.jpg",
});
</script>
