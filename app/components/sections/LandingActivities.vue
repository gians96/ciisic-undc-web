<template>
  <section aria-labelledby="comparsa-title" class="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
    <div class="grid overflow-hidden rounded-[2rem] border border-white/10 bg-[#082b51] lg:grid-cols-[1.1fr_0.9fr]">
      <div class="relative min-h-[260px] overflow-hidden sm:min-h-[360px] lg:min-h-[440px]">
        <NuxtImg
          src="/images/eventos/comparsa.webp"
          alt="Participantes de la comparsa sistémica en una edición anterior del CIISIC"
          width="1920"
          height="1560"
          sizes="100vw lg:55vw"
          class="absolute inset-0 h-full w-full object-cover object-[center_65%]"
          loading="lazy"
        />
        <span class="absolute bottom-4 left-4 rounded-full border border-white/20 bg-[#041d39]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">Imagen de edición anterior</span>
      </div>
      <div class="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
        <p class="kicker">Cultura y comunidad</p>
        <h2 id="comparsa-title" class="mt-3 max-w-lg text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">Comparsa Sistémica</h2>
        <p class="mt-4 max-w-lg leading-relaxed text-slate-300">El congreso también se vive en las calles. Súmate a una celebración que reúne a estudiantes, docentes y visitantes en Cañete.</p>
        <div class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-200">
          <Icon name="heroicons:calendar-days" class="h-5 w-5" /> Lunes 26 de octubre · 15:00 a 20:00
        </div>
        <NuxtLink to="/cronograma" class="activity-link mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold">
          Ver en el cronograma <Icon name="heroicons:arrow-right" class="h-5 w-5" />
        </NuxtLink>
      </div>
    </div>
  </section>

  <section aria-labelledby="academic-events-title" class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <div class="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end lg:mb-10">
      <div>
        <p class="kicker">Aprende y participa</p>
        <h2 id="academic-events-title" class="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Eventos académicos</h2>
        <p class="mt-4 max-w-2xl leading-relaxed text-slate-300">Cuatro espacios para poner a prueba tus ideas, habilidades y estrategia.</p>
      </div>
      <NuxtLink to="/eventos-academicos" class="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-primary-300 hover:text-white">
        Ver todos los eventos <Icon name="heroicons:arrow-right" class="h-5 w-5" />
      </NuxtLink>
    </div>

    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <article v-for="event in academicEvents" :key="event.title" class="event-card flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#082b51]">
        <div class="relative aspect-[16/10] overflow-hidden">
          <NuxtImg :src="event.image" :alt="event.alt" width="1920" height="1500" sizes="100vw md:33vw" class="h-full w-full object-cover" loading="lazy" />
          <span class="absolute bottom-3 left-3 rounded-full border border-white/15 bg-[#041d39]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">Imagen de edición anterior</span>
        </div>
        <div class="flex flex-1 flex-col p-5 sm:p-6">
          <p class="text-xs font-bold uppercase tracking-[.14em] text-primary-300">{{ event.date }}</p>
          <h3 class="mt-3 text-xl font-bold leading-snug text-white">{{ event.title }}</h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-slate-300">{{ event.description }}</p>
          <NuxtLink :to="event.href" :aria-label="`Ver detalles de ${event.title}`" class="mt-6 inline-flex min-h-11 items-center justify-between gap-2 border-t border-white/10 pt-3 text-sm font-semibold text-primary-300 hover:text-white">
            Ver detalles <Icon name="heroicons:arrow-right" class="h-5 w-5" />
          </NuxtLink>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const academicEvents = [
  {
    title: 'eSports',
    date: 'Martes 27 de octubre',
    description: 'Clash Royale, Left 4 Dead 2, Dragon Ball: Sparking! ZERO y FIFA.',
    image: '/images/eventos/esports.webp',
    alt: 'Participantes jugando en computadoras durante un torneo de eSports anterior',
    href: '/eventos-academicos#esports',
  },
  {
    title: 'Concurso de programación',
    date: 'Martes 27 de octubre',
    description: 'Pon a prueba tu lógica y tu capacidad para resolver problemas con código.',
    image: '/images/eventos/programacion.webp',
    alt: 'Participantes con computadoras en un concurso de programación anterior',
    href: '/eventos-academicos#programacion',
  },
  {
    title: 'Cyber Clash',
    date: 'Jueves 29 de octubre',
    description: 'Desafío de ciberseguridad organizado por Kriptome Cybersecurity.',
    image: '/images/eventos/conversatorio.webp',
    alt: 'Actividad académica durante una edición anterior del CIISIC',
    href: '/eventos-academicos#cyber-clash',
  },
  {
    title: 'Hackathon',
    date: 'Jueves 29 de octubre',
    description: 'Convierte ideas en propuestas y explora soluciones con tecnología.',
    image: '/images/eventos/hackathon.webp',
    alt: 'Participante trabajando en una computadora durante un hackathon anterior',
    href: '/eventos-academicos#hackathon',
  },
]
</script>

<style scoped>
.kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
.activity-link { background: #00d9e8; color: #032f5f; transition: background .2s, transform .2s; }
.activity-link:hover { background: #67e8f9; transform: translateY(-2px); }
.event-card { transition: border-color .2s, transform .2s; }
.event-card:hover { border-color: #22d3ee66; transform: translateY(-3px); }
a:focus-visible { outline: 2px solid #22d3ee; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .activity-link, .event-card { transition: none; }.activity-link:hover, .event-card:hover { transform: none; } }
</style>
