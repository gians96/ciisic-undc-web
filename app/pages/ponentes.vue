<template>
  <div class="speakers-page min-h-screen bg-[#041d39] text-white">
    <section class="speaker-hero relative overflow-hidden border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
      <div class="speaker-grid absolute inset-0" aria-hidden="true" />
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-300">VIII CIISIC UNDC · 2026</p>
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">Ponentes invitados</h1>
        <p class="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
          Especialistas nacionales e internacionales compartirán su experiencia en ingeniería, investigación, inteligencia artificial, ciberseguridad y transformación digital.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          <span class="summary-chip"><Icon name="heroicons:user-group" class="h-5 w-5 text-primary-400" />5 ponentes</span>
          <span class="summary-chip"><Icon name="heroicons:globe-americas" class="h-5 w-5 text-primary-400" />3 países</span>
          <span class="summary-chip"><Icon name="heroicons:academic-cap" class="h-5 w-5 text-primary-400" />Perfil académico y profesional</span>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20 2xl:max-w-[1600px]">
      <div class="mb-9 sm:mb-12">
        <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Conoce a los especialistas</p>
        <h2 class="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Experiencia que conecta conocimiento y futuro.</h2>
      </div>

      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="speaker in speakers" :key="speaker.name" class="speaker-card group overflow-hidden rounded-[1.75rem] border border-white/10">
          <div class="speaker-photo relative aspect-[4/5] overflow-hidden bg-[#082d56]">
            <div
              class="speaker-photo-backdrop absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-2xl"
              :style="{ backgroundImage: `url(${speaker.image})` }"
              aria-hidden="true"
            />
            <NuxtImg
              :src="speaker.image"
              :alt="`Retrato de ${speaker.name}`"
              width="1122"
              height="1402"
              sizes="100vw md:50vw xl:33vw"
              class="relative z-10 h-full w-full object-contain object-center transition duration-500 group-hover:scale-[1.015]"
              loading="lazy"
            />
            <div class="photo-shade absolute inset-0" aria-hidden="true" />
            <span class="country-badge absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#041d39]/85 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
              <span aria-hidden="true">{{ speaker.flag }}</span>{{ speaker.country }}
            </span>
          </div>

          <div class="flex flex-col p-6 sm:p-7">
            <p class="text-xs font-bold uppercase tracking-[.18em] text-primary-300">{{ speaker.degreeLevel }}</p>
            <h3 class="mt-2 text-2xl font-bold leading-tight text-white">{{ speaker.name }}</h3>
            <div class="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[.035] p-4">
              <Icon name="heroicons:academic-cap" class="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
              <div><p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Grado académico más alto</p><p class="mt-1 font-semibold leading-snug text-slate-100">{{ speaker.degree }}</p></div>
            </div>
            <p class="mt-5 leading-relaxed text-slate-300">{{ speaker.summary }}</p>
            <div class="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
              <span v-for="area in speaker.areas" :key="area" class="rounded-full bg-primary-400/10 px-3 py-1 text-xs font-semibold text-primary-200 ring-1 ring-primary-400/20">{{ area }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Speaker {
  name: string
  degreeLevel: string
  degree: string
  country: string
  flag: string
  image: string
  summary: string
  areas: string[]
}

const speakers: Speaker[] = [
  {
    name: 'Abraham Esteban Gamarra Moreno',
    degreeLevel: 'Doctor',
    degree: 'Doctor en Ingeniería',
    country: 'Perú',
    flag: '🇵🇪',
    image: '/images/ponentes/2026/abraham-gamarra-enhanced.webp',
    summary: 'Docente de pregrado y posgrado, investigador y conferencista internacional con formación en informática, inteligencia artificial, robótica y aprendizaje automático.',
    areas: ['Inteligencia artificial', 'Robótica', 'Machine learning'],
  },
  {
    name: 'Daniel Yucra Sotomayor',
    degreeLevel: 'Magíster',
    degree: 'Máster universitario en Administración y Gestión Avanzada de Proyectos',
    country: 'Perú',
    flag: '🇵🇪',
    image: '/images/ponentes/2026/daniel-yucra-enhanced.webp',
    summary: 'Especialista y docente en seguridad de la información, gestión de riesgos tecnológicos, gobierno digital y transformación digital.',
    areas: ['Ciberseguridad', 'Gestión de riesgos', 'Transformación digital'],
  },
  {
    name: 'María Fernanda Díaz Velásquez',
    degreeLevel: 'Doctora',
    degree: 'Doctora en Ciencias Aplicadas',
    country: 'Colombia',
    flag: '🇨🇴',
    image: '/images/ponentes/2026/maria-fernanda-diaz-enhanced.webp',
    summary: 'Ingeniera y líder académica con experiencia en arquitectura empresarial, Industria 4.0 y 5.0, agentes inteligentes y toma de decisiones estratégicas.',
    areas: ['Arquitectura empresarial', 'Industria 5.0', 'Agentes inteligentes'],
  },
  {
    name: 'Patricio Ramírez Correa',
    degreeLevel: 'Ph.D.',
    degree: 'Doctor en Economía y Administración de Empresas',
    country: 'Chile',
    flag: '🇨🇱',
    image: '/images/ponentes/2026/patricio-ramirez-enhanced.webp',
    summary: 'Profesor titular e investigador en sistemas de información, adopción tecnológica, salud digital, comercio electrónico y analítica de datos.',
    areas: ['Sistemas de información', 'Adopción tecnológica', 'Analítica de datos'],
  },
  {
    name: 'Hugo David Calderón Vilca',
    degreeLevel: 'Doctor',
    degree: 'Doctor en Ciencia de la Computación',
    country: 'Perú',
    flag: '🇵🇪',
    image: '/images/ponentes/2026/hugo-calderon-enhanced.webp',
    summary: 'Profesor investigador dedicado a inteligencia artificial, aprendizaje automático, minería de datos y procesamiento de lenguaje natural.',
    areas: ['Inteligencia artificial', 'Minería de datos', 'Lenguaje natural'],
  },
]

useSeoMeta({
  title: 'Ponentes | VIII CIISIC 2026',
  description: 'Conoce a los ponentes nacionales e internacionales invitados al VIII CIISIC 2026 de la Universidad Nacional de Cañete.',
  ogTitle: 'Ponentes | VIII CIISIC 2026',
  ogDescription: 'Especialistas de Perú, Colombia y Chile participarán en el VIII CIISIC 2026.',
})
</script>

<style scoped>
.speaker-hero { background: radial-gradient(circle at 50% 0%, #087dd83d, transparent 48%), #041d39; }
.speaker-grid { opacity: .25; background-image: linear-gradient(#1d7fb43d 1px, transparent 1px), linear-gradient(90deg, #1d7fb43d 1px, transparent 1px); background-size: 64px 64px; mask-image: linear-gradient(to bottom, black, transparent); }
.summary-chip { display: inline-flex; align-items: center; gap: .5rem; border: 1px solid #ffffff1a; border-radius: 9999px; background: #ffffff08; padding: .55rem .9rem; color: #cbd5e1; }
.speaker-card { background: linear-gradient(155deg, #0a3157e6, #062541f2); box-shadow: 0 24px 70px #020f203d; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.speaker-card:hover { transform: translateY(-5px); border-color: #22d3ee66; box-shadow: 0 30px 80px #020f2066; }
.photo-shade { z-index: 11; pointer-events: none; background: linear-gradient(to top, #041d3966, transparent 32%); }
@media (prefers-reduced-motion: reduce) { .speaker-card, .speaker-photo img { transition: none; }.speaker-card:hover { transform: none; } }
</style>
