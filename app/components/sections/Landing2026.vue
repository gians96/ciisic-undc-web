<template>
  <div class="landing">
    <section class="hero relative overflow-hidden">
      <div class="grid-pattern absolute inset-0" aria-hidden="true" />
      <div class="hero-content relative mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12 lg:px-8 lg:py-16">
        <div class="min-w-0 text-center lg:text-left">
          <p class="eyebrow mb-6 inline-flex max-w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase leading-relaxed tracking-[0.14em]"><span class="h-2 w-2 shrink-0 rounded-full bg-primary-400" /><span>Universidad Nacional de Cañete · 2026</span></p>
          <h1 class="hero-title font-extrabold tracking-tight text-white">Las ideas que <span class="text-primary-400">conectan</span> el futuro.</h1>
          <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg lg:mx-0">VIII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica. Cinco días para compartir conocimiento, descubrir perspectivas y crear conexiones en Cañete.</p>
          <div class="mx-auto mt-8 flex max-w-sm flex-col gap-3 md:max-w-none md:flex-row md:flex-wrap md:justify-center lg:mx-0 lg:justify-start">
            <NuxtLink to="/planes" class="action-primary inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 font-bold">Inscríbete ahora <Icon name="heroicons:arrow-up-right" class="h-5 w-5 shrink-0" /></NuxtLink>
            <NuxtLink to="/about" class="action-secondary inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 font-semibold">Conoce el congreso <Icon name="heroicons:arrow-right" class="h-5 w-5 shrink-0" /></NuxtLink>
          </div>
        </div>
        <figure class="event-card relative mx-auto w-full min-w-0 max-w-lg overflow-hidden rounded-[2rem] border border-white/15 p-3 shadow-2xl sm:p-4 lg:max-w-none">
          <div class="photo-frame relative flex flex-col overflow-hidden rounded-[1.4rem]">
            <img :src="previousCongressImage" alt="Participantes del VII CIISIC reunidos en el auditorio de la UNDC" width="1600" height="898" class="block h-auto w-full" fetchpriority="high">
            <figcaption class="photo-caption relative mt-auto px-5 pb-6 pt-8 text-center sm:px-8 sm:pb-8 lg:text-left">
              <span class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Edición anterior · VII CIISIC</span>
              <p class="mt-2 text-2xl font-bold text-white sm:text-3xl">Una comunidad que sigue creciendo.</p>
            </figcaption>
          </div>
        </figure>
        <div class="grid gap-6 rounded-2xl border border-white/10 bg-[#06294f] px-5 py-6 md:grid-cols-3 lg:col-span-2">
          <div v-for="fact in facts" :key="fact.label" class="flex min-w-0 flex-col items-center gap-3 text-center">
            <Icon :name="fact.icon" class="h-7 w-7 shrink-0 text-primary-400" />
            <div><p class="text-xs uppercase tracking-widest text-slate-400">{{ fact.label }}</p><p class="mt-1 font-semibold text-white">{{ fact.value }}</p></div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24 2xl:max-w-[1600px]">
      <div class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end lg:mb-10">
        <div>
          <p class="kicker">Memorias del congreso</p>
          <h2 class="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Momentos que nos conectaron.</h2>
        </div>
        <p class="max-w-sm leading-relaxed text-slate-300">Un recorrido por las experiencias, encuentros y aprendizajes de la edición anterior.</p>
      </div>
      <PreviousCongressCarousel />
    </section>

    <section class="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24 2xl:max-w-[1600px]"><div class="feature-panel grid overflow-hidden rounded-[2rem] border border-white/10 lg:grid-cols-2"><div class="p-7 sm:p-12 lg:p-16"><p class="kicker">Edición 2026</p><h2 class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Una semana para pensar el futuro juntos.</h2><p class="mt-5 max-w-xl leading-relaxed text-slate-300">El programa detallado y los ponentes se anunciarán próximamente. Por ahora, guarda las fechas y descubre cómo participar.</p><div class="mt-8 flex flex-wrap gap-3"><NuxtLink to="/cronograma" class="action-secondary rounded-xl px-5 py-3 font-semibold">Ver cronograma <Icon name="heroicons:arrow-right" class="ml-1 inline h-4 w-4" /></NuxtLink><NuxtLink to="/ponentes" class="action-secondary rounded-xl px-5 py-3 font-semibold">Ponentes <Icon name="heroicons:arrow-right" class="ml-1 inline h-4 w-4" /></NuxtLink></div></div><div class="feature-art relative flex min-h-[240px] items-center justify-center p-8 sm:min-h-[320px] sm:p-10"><div class="relative text-center"><div class="inline-flex items-center justify-center gap-[0.18em] font-mono text-6xl font-black leading-none tracking-normal text-white sm:text-8xl" aria-label="Del 26 al 30"><span aria-hidden="true">26</span><span aria-hidden="true" class="h-[0.08em] w-[0.55em] shrink-0 bg-primary-400" /><span aria-hidden="true">30</span></div><p class="mt-3 text-sm font-bold uppercase tracking-[.3em] text-primary-300">Octubre 2026</p></div></div></div></section>

    <section class="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-20 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-28 2xl:max-w-[1600px]">
      <div>
        <p class="kicker">La sede</p>
        <h2 class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Nos vemos en Cañete.</h2>
        <p class="mt-5 max-w-lg leading-relaxed text-slate-300">El congreso se realizará en el Auditorio Casa de la Cultura, en San Vicente de Cañete. Encuentra la ubicación y planifica tu visita.</p>
        <NuxtLink to="/sede" class="mt-7 inline-flex items-center gap-2 font-bold text-primary-300 hover:text-white">Cómo llegar <Icon name="heroicons:arrow-right" class="h-5 w-5" /></NuxtLink>
      </div>

      <figure class="venue-card relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[2rem] border border-white/10 sm:min-h-[320px]">
        <NuxtImg
          v-if="venueImage"
          :src="venueImage"
          alt="Exterior del Auditorio Casa de la Cultura de San Vicente de Cañete"
          width="1200"
          height="800"
          sizes="100vw lg:50vw"
          class="absolute inset-0 h-full w-full object-cover object-[center_78%]"
          loading="lazy"
        />
        <div v-else class="venue-placeholder absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-300/25 bg-primary-400/10 text-primary-200">
            <Icon name="heroicons:photo" class="h-7 w-7" />
          </span>
          <p class="text-sm font-bold uppercase tracking-[.18em] text-primary-200">Imagen de la sede</p>
          <p class="mt-2 max-w-xs text-sm leading-relaxed text-slate-300">Espacio preparado para una fotografía del Auditorio Casa de la Cultura.</p>
        </div>
        <div class="venue-overlay absolute inset-0" aria-hidden="true" />
        <figcaption class="relative z-10 p-8 sm:p-10">
          <Icon name="heroicons:map-pin" class="mb-4 h-8 w-8 text-primary-300" />
          <p class="text-2xl font-bold text-white">Auditorio Casa de la Cultura</p>
          <p class="mt-1 text-slate-200">San Vicente de Cañete, Lima · Perú</p>
        </figcaption>
      </figure>
    </section>
  </div>
</template>

<script setup lang="ts">
import PreviousCongressCarousel from './PreviousCongressCarousel.vue'

const previousCongressImage = '/images/congreso-anterior.webp'

// Coloca la fotografía en public/images/sede/ y reemplaza null por su ruta pública.
// Ejemplo: const venueImage = '/images/sede/casa-de-la-cultura.webp'
const venueImage: string | null = '/images/sede/cultura.webp'

const facts = [
  { icon: 'heroicons:calendar-days', label: 'Cuándo', value: '26–30 de octubre de 2026' },
  { icon: 'heroicons:map-pin', label: 'Dónde', value: 'San Vicente de Cañete' },
  { icon: 'heroicons:academic-cap', label: 'Organiza', value: 'Universidad Nacional de Cañete' },
]
</script>

<style scoped>
.landing { background: #041d39; color: white; }
.hero { background: radial-gradient(circle at 75% 45%, #087dd844, transparent 36%), linear-gradient(135deg, #052c54, #041d39 58%, #062e57); }
.hero-title { font-size: clamp(2.25rem, 4.5vw, 3.75rem); line-height: 1.08; text-wrap: balance; }
.grid-pattern { opacity: .22; background-image: linear-gradient(#1d7fb455 1px, transparent 1px), linear-gradient(90deg, #1d7fb455 1px, transparent 1px); background-size: 68px 68px; mask-image: linear-gradient(to right, transparent, black); }
.eyebrow, .event-card { background: #092f57d9; border: 1px solid #ffffff24; }
.eyebrow { color: #a5f3fc; }
.event-card { backdrop-filter: blur(20px); }
.photo-frame { background: radial-gradient(circle at 50% 35%, #10649488, transparent 55%), #082d56; border: 1px solid #ffffff1a; }
.photo-caption { background: linear-gradient(transparent, #041d39f2); }
.action-primary { background: #00d9e8; color: #032f5f; box-shadow: 0 12px 34px #00d9e82b; transition: transform .2s, background .2s; }
.action-primary:hover { background: #67e8f9; transform: translateY(-2px); }
.action-secondary { background: #ffffff0d; border: 1px solid #ffffff33; color: white; transition: background .2s, border-color .2s; }
.action-secondary:hover { background: #ffffff1c; border-color: #67e8f9; }
.kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
.feature-panel { background: #082b51; }
.feature-art { background: repeating-linear-gradient(135deg, transparent 0 32px, #ffffff0a 33px 34px), #053a70; }
.venue-card { background: #06335f; }
.venue-placeholder { background: radial-gradient(circle at 68% 20%, #0b75e58f, transparent 42%), linear-gradient(135deg, #0b447b, #032548); }
.venue-placeholder::before { position: absolute; inset: 0; content: ''; opacity: .2; background-image: linear-gradient(#67e8f929 1px, transparent 1px), linear-gradient(90deg, #67e8f929 1px, transparent 1px); background-size: 44px 44px; }
.venue-placeholder > * { position: relative; }
.venue-overlay { background: linear-gradient(to top, #041d39f5 0%, #041d3980 40%, transparent 75%); pointer-events: none; }
@media (prefers-reduced-motion: reduce) { .action-primary, .action-secondary { transition: none; } }
</style>
