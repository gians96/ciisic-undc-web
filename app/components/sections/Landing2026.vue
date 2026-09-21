<template>
  <div class="landing">
    <div class="intro-screen">
    <section class="hero relative overflow-hidden">
      <div class="grid-pattern absolute inset-0" aria-hidden="true" />
      <div class="hero-content relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-24 2xl:max-w-[1600px] 2xl:gap-20">
        <div>
          <p class="eyebrow mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]"><span class="h-2 w-2 rounded-full bg-primary-400" /> Universidad Nacional de Cañete · 2026</p>
          <h1 class="text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl xl:text-7xl">Las ideas que <span class="text-primary-400">conectan</span> el futuro.</h1>
          <p class="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">VIII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica. Cinco días para compartir conocimiento, descubrir perspectivas y crear conexiones en Cañete.</p>
          <div class="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start xl:flex-row xl:items-stretch">
            <NuxtLink to="/planes" class="action-primary inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 font-bold">Inscríbete ahora <Icon name="heroicons:arrow-up-right" class="h-5 w-5 shrink-0" /></NuxtLink>
            <NuxtLink to="/about" class="action-secondary inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 font-semibold">Conoce el congreso <Icon name="heroicons:arrow-right" class="h-5 w-5 shrink-0" /></NuxtLink>
          </div>
          <div class="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-sm text-slate-300">
            <span class="inline-flex items-center gap-2"><Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-400" />26–30 oct. 2026</span>
            <span class="inline-flex items-center gap-2"><Icon name="heroicons:map-pin" class="h-5 w-5 text-primary-400" />San Vicente de Cañete, Perú</span>
          </div>
        </div>
        <figure class="event-card relative mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/15 p-3 shadow-2xl sm:p-4 2xl:max-w-[680px]">
          <div class="photo-frame relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[1.4rem] sm:min-h-[440px] 2xl:min-h-[500px]">
            <img v-if="previousCongressImage" :src="previousCongressImage" alt="Participantes del VII CIISIC en la edición anterior" class="absolute inset-0 h-full w-full object-cover" fetchpriority="high" />
            <div v-else class="relative flex flex-col items-center px-8 pb-20 text-center">
              <Icon name="heroicons:photo" class="mb-5 h-14 w-14 text-primary-300" />
              <p class="text-xl font-bold text-white sm:text-2xl">Un recuerdo del VII CIISIC</p>
              <p class="mt-2 max-w-xs text-sm text-slate-300">Espacio para una fotografía del congreso anterior</p>
            </div>
            <figcaption class="photo-caption absolute inset-x-0 bottom-0 px-6 pb-6 pt-20 sm:px-8 sm:pb-8">
              <span class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Edición anterior · VII CIISIC</span>
              <p class="mt-2 text-2xl font-bold text-white sm:text-3xl">Una comunidad que sigue creciendo.</p>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>

    <div class="border-y border-white/10 bg-[#06294f] py-6"><div class="mx-auto grid max-w-7xl gap-5 px-6 sm:grid-cols-3 lg:px-8 2xl:max-w-[1600px]"><div v-for="fact in facts" :key="fact.label" class="flex items-center gap-4 sm:justify-center"><Icon :name="fact.icon" class="h-7 w-7 shrink-0 text-primary-400" /><div><p class="text-xs uppercase tracking-widest text-slate-400">{{ fact.label }}</p><p class="font-semibold text-white">{{ fact.value }}</p></div></div></div></div>
    </div>

    <section class="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24 2xl:max-w-[1600px]"><div class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end lg:mb-10"><div><p class="kicker">Explora el congreso</p><h2 class="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">Tu próxima gran conexión empieza aquí.</h2></div><p class="max-w-sm text-slate-300">Encuentra la información que necesitas para participar en esta edición.</p></div><div class="grid gap-5 md:grid-cols-3"><NuxtLink v-for="card in cards" :key="card.title" :to="card.to" class="explore-card group rounded-[1.75rem] p-7"><div class="mb-8 flex items-start justify-between lg:mb-10"><span class="icon-tile inline-flex h-12 w-12 items-center justify-center rounded-xl"><Icon :name="card.icon" class="h-6 w-6" /></span><Icon name="heroicons:arrow-up-right" class="h-5 w-5 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary-300" /></div><p class="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-primary-300">{{ card.eyebrow }}</p><h3 class="text-2xl font-bold text-white">{{ card.title }}</h3><p class="mt-3 leading-relaxed text-slate-300">{{ card.description }}</p></NuxtLink></div></section>

    <section class="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24 2xl:max-w-[1600px]"><div class="feature-panel grid overflow-hidden rounded-[2rem] border border-white/10 lg:grid-cols-2"><div class="p-7 sm:p-12 lg:p-16"><p class="kicker">Edición 2026</p><h2 class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Una semana para pensar el futuro juntos.</h2><p class="mt-5 max-w-xl leading-relaxed text-slate-300">El programa detallado y los ponentes se anunciarán próximamente. Por ahora, guarda las fechas y descubre cómo participar.</p><div class="mt-8 flex flex-wrap gap-3"><NuxtLink to="/cronograma" class="action-secondary rounded-xl px-5 py-3 font-semibold">Ver cronograma <Icon name="heroicons:arrow-right" class="ml-1 inline h-4 w-4" /></NuxtLink><NuxtLink to="/ponentes" class="action-secondary rounded-xl px-5 py-3 font-semibold">Ponentes <Icon name="heroicons:arrow-right" class="ml-1 inline h-4 w-4" /></NuxtLink></div></div><div class="feature-art relative flex min-h-[240px] items-center justify-center p-8 sm:min-h-[320px] sm:p-10"><div class="relative text-center"><div class="font-mono text-6xl font-black tracking-tighter text-white sm:text-8xl">26<span class="text-primary-400">—</span>30</div><p class="mt-3 text-sm font-bold uppercase tracking-[.3em] text-primary-300">Octubre 2026</p></div></div></div></section>

    <section class="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-20 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-28 2xl:max-w-[1600px]"><div><p class="kicker">La sede</p><h2 class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Nos vemos en Cañete.</h2><p class="mt-5 max-w-lg leading-relaxed text-slate-300">El congreso se realizará en el Auditorio Casa de la Cultura, en San Vicente de Cañete. Encuentra la ubicación y planifica tu visita.</p><NuxtLink to="/sede" class="mt-7 inline-flex items-center gap-2 font-bold text-primary-300 hover:text-white">Cómo llegar <Icon name="heroicons:arrow-right" class="h-5 w-5" /></NuxtLink></div><div class="venue-card flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[2rem] border border-white/10 p-8 sm:min-h-[280px] sm:p-10"><div><Icon name="heroicons:map-pin" class="mb-4 h-8 w-8 text-primary-300" /><p class="text-2xl font-bold text-white">Auditorio Casa de la Cultura</p><p class="mt-1 text-slate-200">San Vicente de Cañete, Lima · Perú</p></div></div></section>
  </div>
</template>

<script setup lang="ts">
// Coloca la foto en public/images/congreso-anterior.webp y usa '/images/congreso-anterior.webp'.
const previousCongressImage: string | null = null

const facts = [
  { icon: 'heroicons:calendar-days', label: 'Cuándo', value: '26–30 de octubre de 2026' },
  { icon: 'heroicons:map-pin', label: 'Dónde', value: 'San Vicente de Cañete' },
  { icon: 'heroicons:academic-cap', label: 'Organiza', value: 'Universidad Nacional de Cañete' },
]
const cards = [
  { icon: 'heroicons:ticket', eyebrow: 'Participa', title: 'Inscripciones', description: 'Encuentra la modalidad de registro que se adapta a ti.', to: '/planes' },
  { icon: 'heroicons:calendar-days', eyebrow: 'Planifica', title: 'Cronograma', description: 'Conoce las fechas generales; el programa de cada día llegará pronto.', to: '/cronograma' },
  { icon: 'heroicons:document-text', eyebrow: 'Investiga', title: 'Call for papers', description: 'Mantente al tanto de las novedades para investigadores y autores.', to: '/papers' },
]
</script>

<style scoped>
.landing { background: #041d39; color: white; }
.intro-screen { display: flex; flex-direction: column; min-height: calc(100vh - 80px); min-height: calc(100svh - 80px); }
.hero { display: flex; flex: 1; flex-direction: column; background: radial-gradient(circle at 75% 45%, #087dd844, transparent 36%), linear-gradient(135deg, #052c54, #041d39 58%, #062e57); }
.hero-content { flex: 1; width: 100%; }
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
.explore-card { background: #082c52; border: 1px solid #ffffff1c; transition: transform .25s, border-color .25s, background .25s; }
.explore-card:hover { transform: translateY(-5px); border-color: #67e8f980; background: #0a3868; }
.icon-tile { background: #00d9e81a; color: #67e8f9; }
.feature-panel { background: #082b51; }
.feature-art { background: repeating-linear-gradient(135deg, transparent 0 32px, #ffffff0a 33px 34px), #053a70; }
.venue-card { background: radial-gradient(circle at 75% 20%, #0b75e5aa, transparent 40%), linear-gradient(135deg, #0b447b, #032548); }
@media (prefers-reduced-motion: reduce) { .action-primary, .action-secondary, .explore-card { transition: none; } }
@media (max-width: 359px) { .landing h1 { font-size: 2.5rem; } }
</style>
