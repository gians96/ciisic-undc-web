<template>
  <div class="registration-page min-h-screen pb-16 lg:pb-24">
    <div class="mx-auto max-w-6xl px-6 pt-12 sm:pt-16 lg:px-8 lg:pt-24">
      <div class="mx-auto max-w-3xl text-center">
        <p class="kicker mb-4">VIII CIISIC 2026 · Inscripciones</p>
        <h1 class="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">Tu lugar en el <span class="text-primary-400">congreso</span> comienza aquí.</h1>
        <p class="mt-6 text-lg leading-relaxed text-slate-300">Elige la modalidad que te corresponde y completa el formulario de inscripción. La confirmación y el precio definitivo se mostrarán durante el proceso de registro.</p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300"><span class="inline-flex items-center gap-2"><Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-400" />26–30 de octubre</span><span class="inline-flex items-center gap-2"><Icon name="heroicons:map-pin" class="h-5 w-5 text-primary-400" />San Vicente de Cañete</span></div>
      </div>

      <div class="mt-10 grid gap-5 md:grid-cols-2 lg:mt-14">
        <NuxtLink to="/estudiantes" class="plan-card group flex flex-col rounded-[1.75rem] p-7 sm:p-9">
          <div class="flex items-start justify-between"><span class="icon-tile inline-flex h-14 w-14 items-center justify-center rounded-2xl"><Icon name="heroicons:academic-cap" class="h-7 w-7" /></span><Icon name="heroicons:arrow-up-right" class="h-6 w-6 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary-300" /></div>
          <p class="mt-9 text-xs font-bold uppercase tracking-[.2em] text-primary-300">Modalidad 01</p>
          <h2 class="mt-2 text-3xl font-bold text-white">Estudiantes</h2>
          <p class="mt-4 flex-1 leading-relaxed text-slate-300">Para quienes se encuentran cursando estudios y quieren formar parte de esta experiencia académica.</p>
          <span class="mt-9 inline-flex items-center gap-2 font-bold text-primary-300">Continuar inscripción <Icon name="heroicons:arrow-right" class="h-5 w-5" /></span>
        </NuxtLink>
        <NuxtLink to="/general" class="plan-card group flex flex-col rounded-[1.75rem] p-7 sm:p-9">
          <div class="flex items-start justify-between"><span class="icon-tile inline-flex h-14 w-14 items-center justify-center rounded-2xl"><Icon name="heroicons:briefcase" class="h-7 w-7" /></span><Icon name="heroicons:arrow-up-right" class="h-6 w-6 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary-300" /></div>
          <p class="mt-9 text-xs font-bold uppercase tracking-[.2em] text-primary-300">Modalidad 02</p>
          <h2 class="mt-2 text-3xl font-bold text-white">Profesionales y público general</h2>
          <p class="mt-4 flex-1 leading-relaxed text-slate-300">Para egresados, profesionales, investigadores y toda persona interesada en el congreso.</p>
          <span class="mt-9 inline-flex items-center gap-2 font-bold text-primary-300">Continuar inscripción <Icon name="heroicons:arrow-right" class="h-5 w-5" /></span>
        </NuxtLink>
      </div>

      <div class="support-card mt-8 flex flex-col gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><h2 class="text-xl font-bold text-white">¿Inscribirás una delegación?</h2><p class="mt-1 text-slate-300">Comunícate con el equipo organizador para coordinar tu registro.</p></div><a href="https://wa.me/51933030027" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary-400/50 px-5 py-3 font-semibold text-primary-300 transition hover:bg-primary-400/10"><Icon name="heroicons:chat-bubble-left-right" class="h-5 w-5" />Escribir por WhatsApp</a></div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Inscripciones | VIII CIISIC 2026', description: 'Elige tu modalidad e inscríbete en el VIII CIISIC 2026 en San Vicente de Cañete.' })
</script>

<style scoped>
.registration-page { background: radial-gradient(circle at 50% 0, #0a4b7a, transparent 38%), #041d39; }
.kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
.plan-card, .support-card { background: #082c52; border: 1px solid #ffffff1c; }
.plan-card { transition: transform .25s, background .25s, border-color .25s; }
.plan-card:hover { transform: translateY(-5px); background: #0a3868; border-color: #67e8f980; }
.icon-tile { background: #00d9e81a; color: #67e8f9; }
@media (prefers-reduced-motion: reduce) { .plan-card { transition: none; } }
@media (max-width: 359px) { .registration-page h1 { font-size: 2.5rem; } }
</style>
