<template>
  <div class="min-h-screen bg-[#041d39] text-white">
    <section class="reinado-hero relative overflow-hidden border-b border-white/10">
      <NuxtImg
        src="/images/eventos/reinado.webp"
        alt="Participantes y organizadores del Reinado Sistémico durante una edición anterior"
        width="1920"
        height="1200"
        sizes="100vw"
        class="absolute inset-0 h-full w-full object-cover object-center"
        fetchpriority="high"
      />
      <div class="hero-overlay absolute inset-0" aria-hidden="true" />

      <div class="relative mx-auto flex min-h-[610px] max-w-7xl flex-col justify-between px-6 py-10 sm:min-h-[680px] lg:px-8 lg:py-14 2xl:max-w-[1600px]">
        <NuxtLink to="/" class="back-link inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-primary-200 hover:text-white">
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          Volver al inicio
        </NuxtLink>

        <div class="max-w-4xl pb-5">
          <span class="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-fuchsia-200 backdrop-blur">
            <Icon name="heroicons:sparkles" class="h-5 w-5" /> Actividad cultural
          </span>
          <h1 class="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">Reinado Sistémico 2026</h1>
          <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            Representación, creatividad y espíritu universitario en una jornada de integración para la comunidad del VIII CIISIC.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <span class="hero-chip"><Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-300" />Miércoles 28 de octubre</span>
            <span class="hero-chip"><Icon name="heroicons:clock" class="h-5 w-5 text-primary-300" />15:00–23:00 h</span>
            <span class="hero-chip"><Icon name="heroicons:map-pin" class="h-5 w-5 text-primary-300" />San Vicente de Cañete</span>
          </div>
        </div>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20 2xl:max-w-[1600px]">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)] lg:items-start">
        <div>
          <section aria-labelledby="about-reinado">
            <p class="kicker">Sobre la actividad</p>
            <h2 id="about-reinado" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Una celebración para representar y conectar a nuestra comunidad.</h2>
            <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              El Reinado Sistémico forma parte de las actividades de integración del VIII CIISIC 2026. La jornada reúne a participantes, delegaciones y comunidad universitaria en torno a la identidad, el talento y la convivencia.
            </p>
          </section>

          <section class="mt-12" aria-labelledby="participation-process">
            <p class="kicker">Cómo participar</p>
            <h2 id="participation-process" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Proceso de inscripción</h2>
            <div class="mt-7 grid gap-4 sm:grid-cols-3">
              <article v-for="step in registrationSteps" :key="step.number" class="step-card rounded-2xl border border-white/10 p-5 sm:p-6">
                <span class="step-number">{{ step.number }}</span>
                <h3 class="mt-5 text-lg font-bold text-white">{{ step.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-300">{{ step.description }}</p>
              </article>
            </div>
          </section>

          <section class="mt-12 rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8" aria-labelledby="important-info">
            <div class="flex items-start gap-4">
              <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-300 ring-1 ring-primary-400/20">
                <Icon name="heroicons:information-circle" class="h-6 w-6" />
              </span>
              <div>
                <h2 id="important-info" class="text-xl font-bold text-white">Información oficial</h2>
                <p class="mt-2 leading-7 text-slate-300">
                  Las bases, requisitos específicos y comunicaciones posteriores serán informados por la comisión organizadora mediante el formulario oficial de inscripción.
                </p>
              </div>
            </div>
          </section>
        </div>

        <aside class="registration-card sticky top-24 overflow-hidden rounded-[2rem] border border-white/10 p-7 sm:p-9">
          <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-400/10 text-fuchsia-200 ring-1 ring-fuchsia-300/25">
            <Icon name="heroicons:document-text" class="h-7 w-7" />
          </span>
          <p class="mt-7 text-xs font-bold uppercase tracking-[.2em] text-primary-300">Formulario oficial</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-white">Participa en el Reinado Sistémico</h2>
          <p class="mt-4 leading-relaxed text-slate-300">
            Completa tus datos en el formulario de Google y espera la confirmación de la comisión organizadora.
          </p>

          <a
            v-if="registrationFormUrl"
            :href="registrationFormUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="registration-button mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold"
          >
            Inscribirme ahora
            <Icon name="heroicons:arrow-top-right-on-square" class="h-5 w-5" />
            <span class="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          <span v-else class="disabled-button mt-7 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold" aria-disabled="true">
            Formulario próximamente
            <Icon name="heroicons:clock" class="h-5 w-5" />
          </span>

          <div class="mt-7 border-t border-white/10 pt-6 text-sm text-slate-400">
            <p class="flex items-start gap-2"><Icon name="heroicons:shield-check" class="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />El registro se realizará únicamente mediante el enlace oficial.</p>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Coloca aquí la URL pública del formulario de Google para activar el botón.
const registrationFormUrl: string | null = null

const registrationSteps = [
  { number: '01', title: 'Abre el formulario', description: 'Accede al formulario oficial desde el botón de inscripción.' },
  { number: '02', title: 'Completa tus datos', description: 'Registra la información solicitada y revisa las indicaciones de la organización.' },
  { number: '03', title: 'Espera la confirmación', description: 'La comisión organizadora comunicará los siguientes pasos de participación.' },
]

useSeoMeta({
  title: 'Reinado Sistémico 2026 | VIII CIISIC',
  description: 'Conoce los detalles del Reinado Sistémico 2026, actividad cultural del VIII CIISIC de la Universidad Nacional de Cañete.',
  ogTitle: 'Reinado Sistémico 2026 | VIII CIISIC',
  ogDescription: 'Representación, creatividad y espíritu universitario en el VIII CIISIC 2026.',
  ogImage: '/images/eventos/reinado.webp',
})
</script>

<style scoped>
.reinado-hero { background: #041d39; }
.hero-overlay { background: linear-gradient(90deg, #041d39f7 0%, #041d39d9 48%, #041d3973 100%), linear-gradient(to top, #041d39f2 0%, transparent 60%); }
.hero-chip { display: inline-flex; align-items: center; gap: .55rem; border: 1px solid #ffffff24; border-radius: 9999px; background: #041d39b8; padding: .65rem .95rem; color: #e2e8f0; font-size: .875rem; font-weight: 600; backdrop-filter: blur(10px); }
.kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
.step-card { background: linear-gradient(145deg, #0a3157d9, #062541f2); box-shadow: 0 18px 45px #020f202b; }
.step-number { display: inline-flex; height: 2.25rem; min-width: 2.25rem; align-items: center; justify-content: center; border-radius: .75rem; background: #22d3ee1a; padding: 0 .65rem; color: #67e8f9; font-size: .75rem; font-weight: 800; }
.registration-card { background: radial-gradient(circle at 80% 0%, #d946ef24, transparent 38%), linear-gradient(150deg, #0a3157, #062541); box-shadow: 0 28px 80px #020f204d; }
.registration-button { background: #00d9e8; color: #032f5f; box-shadow: 0 12px 34px #00d9e82b; transition: transform .2s ease, background .2s ease; }
.registration-button:hover { background: #67e8f9; transform: translateY(-2px); }
.disabled-button { border: 1px solid #ffffff1a; background: #ffffff0d; color: #94a3b8; }
.back-link:focus-visible, .registration-button:focus-visible { outline: 2px solid #67e8f9; outline-offset: 3px; }
@media (max-width: 1023px) { .registration-card { position: static; } }
@media (prefers-reduced-motion: reduce) { .registration-button { transition: none; }.registration-button:hover { transform: none; } }
</style>
