<template>
  <div class="min-h-screen bg-[#041d39] text-white">
    <section class="events-hero relative overflow-hidden border-b border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div class="events-grid absolute inset-0" aria-hidden="true" />
      <div class="relative mx-auto max-w-5xl">
        <NuxtLink to="/" class="back-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-300 hover:text-white">
          <Icon name="heroicons:arrow-left" class="h-5 w-5" /> Volver al inicio
        </NuxtLink>
        <p class="mt-8 text-xs font-bold uppercase tracking-[.22em] text-primary-300">VIII CIISIC UNDC · 2026</p>
        <h1 class="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Eventos académicos</h1>
        <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300 sm:text-xl">
          Consulta los horarios de las competencias, conoce cada actividad y descarga las bases disponibles.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <span class="summary-chip"><Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-400" />27 y 29 de octubre</span>
          <span class="summary-chip"><Icon name="heroicons:trophy" class="h-5 w-5 text-primary-400" />4 actividades</span>
          <span class="summary-chip"><Icon name="heroicons:map-pin" class="h-5 w-5 text-primary-400" />VIII CIISIC 2026</span>
        </div>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <section v-for="day in eventDays" :key="day.date" class="day-section">
        <div class="mb-7 flex flex-col gap-2 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">{{ day.weekday }}</p>
            <h2 class="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{{ day.date }}</h2>
          </div>
          <p class="text-sm text-slate-400">{{ day.events.length }} actividades programadas</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
          <article
            v-for="event in day.events"
            :id="event.id"
            :key="event.id"
            class="event-detail-card scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-[#082b51]"
          >
            <div class="relative aspect-[16/9] overflow-hidden bg-[#062541]">
              <NuxtImg
                :src="event.image"
                :alt="event.imageAlt"
                width="1920"
                height="1080"
                sizes="100vw lg:50vw"
                class="h-full w-full object-cover transition duration-500"
                loading="lazy"
              />
              <div class="photo-shade absolute inset-0" aria-hidden="true" />
              <span class="absolute bottom-4 left-4 rounded-full border border-white/20 bg-[#041d39]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                Imagen de edición anterior
              </span>
            </div>
            <div class="flex h-full flex-col p-6 sm:p-8">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="text-xs font-bold uppercase tracking-[.18em] text-primary-300">{{ event.category }}</p>
                  <h3 class="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">{{ event.title }}</h3>
                </div>
                <span class="time-chip inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold">
                  <Icon name="heroicons:clock" class="h-4 w-4" />{{ event.time }}
                </span>
              </div>

              <p v-if="event.organizer" class="mt-5 flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                <Icon name="heroicons:building-office-2" class="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
                <span>Organiza: <strong class="font-semibold text-white">{{ event.organizer }}</strong></span>
              </p>

              <ul class="mt-6 space-y-3" :aria-label="`Programa de ${event.title}`">
                <li v-for="item in event.schedule" :key="item.name" class="schedule-row flex items-start justify-between gap-4 rounded-xl border border-white/10 px-4 py-3">
                  <span class="font-medium text-slate-200">{{ item.name }}</span>
                  <span class="shrink-0 text-right text-sm font-semibold text-primary-200">{{ item.time }}</span>
                </li>
              </ul>

              <a
                v-if="event.rulesUrl"
                :href="event.rulesUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="rules-link mt-7 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold"
              >
                Ver bases del evento
                <Icon name="heroicons:arrow-top-right-on-square" class="h-5 w-5" />
                <span class="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <div class="mt-14 rounded-2xl border border-primary-400/25 bg-primary-400/[.06] p-6 text-sm leading-relaxed text-slate-300 sm:p-8">
        <div class="flex items-start gap-3">
          <Icon name="heroicons:information-circle" class="mt-0.5 h-6 w-6 shrink-0 text-primary-400" />
          <p>Los horarios señalados como “por confirmar” se actualizarán cuando la organización publique la programación definitiva.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface ScheduleItem {
  name: string
  time: string
}

interface AcademicEvent {
  id: string
  category: string
  title: string
  time: string
  image: string
  imageAlt: string
  organizer?: string
  rulesUrl?: string
  schedule: ScheduleItem[]
}

interface EventDay {
  weekday: string
  date: string
  events: AcademicEvent[]
}

const programmingRulesUrl = 'https://docs.google.com/document/d/1xw4APHNpu7sVMawPsijbvxIJmEMj9Csy/edit?usp=sharing&ouid=114745236451549000237&rtpof=true&sd=true'
const hackathonRulesUrl = 'https://docs.google.com/document/d/1vtq4BGQXXgDz5kM8cbJHmI-buFLylmug/edit?usp=sharing&ouid=114745236451549000237&rtpof=true&sd=true'

const eventDays: EventDay[] = [
  {
    weekday: 'Martes',
    date: '27 de octubre',
    events: [
      {
        id: 'esports',
        category: 'Competencia',
        title: 'eSports',
        time: 'Desde las 15:00 h',
        image: '/images/eventos/esports.webp',
        imageAlt: 'Participantes jugando en computadoras durante un torneo de eSports anterior',
        schedule: [
          { name: 'Clash Royale', time: '15:00–17:00 h' },
          { name: 'Left 4 Dead 2', time: '17:00–21:00 h' },
          { name: 'Dragon Ball: Sparking! ZERO', time: 'Por confirmar' },
          { name: 'FIFA', time: 'Por confirmar' },
        ],
      },
      {
        id: 'programacion',
        category: 'Desarrollo de software',
        title: 'Concurso de Programación',
        time: 'Desde las 17:00 h',
        image: '/images/eventos/programacion.webp',
        imageAlt: 'Participantes con computadoras en un concurso de programación anterior',
        rulesUrl: programmingRulesUrl,
        schedule: [
          { name: 'Inicio del concurso', time: '17:00 h' },
        ],
      },
    ],
  },
  {
    weekday: 'Jueves',
    date: '29 de octubre',
    events: [
      {
        id: 'cyber-clash',
        category: 'Ciberseguridad',
        title: 'Cyber Clash',
        time: '15:00–17:00 h',
        image: '/images/eventos/conversatorio.webp',
        imageAlt: 'Actividad académica durante una edición anterior del CIISIC',
        organizer: 'Kriptome Cybersecurity',
        schedule: [
          { name: 'Evento de ciberseguridad', time: '15:00–17:00 h' },
        ],
      },
      {
        id: 'hackathon',
        category: 'Innovación tecnológica',
        title: 'Hackathon',
        time: '17:40–23:30 h',
        image: '/images/eventos/hackathon.webp',
        imageAlt: 'Participante trabajando en una computadora durante un hackathon anterior',
        rulesUrl: hackathonRulesUrl,
        schedule: [
          { name: 'Desarrollo de la Hackathon', time: '17:40–23:30 h' },
        ],
      },
    ],
  },
]

useSeoMeta({
  title: 'Eventos académicos | VIII CIISIC 2026',
  description: 'Cronograma, horarios y bases de los eventos académicos del VIII CIISIC 2026: eSports, programación, Cyber Clash y Hackathon.',
  ogTitle: 'Eventos académicos | VIII CIISIC 2026',
  ogDescription: 'Conoce los eventos académicos del 27 y 29 de octubre y consulta sus bases.',
})
</script>

<style scoped>
.events-hero { background: radial-gradient(circle at 18% 0%, #087dd852, transparent 42%), #041d39; }
.events-grid { opacity: .22; background-image: linear-gradient(#1d7fb43d 1px, transparent 1px), linear-gradient(90deg, #1d7fb43d 1px, transparent 1px); background-size: 64px 64px; mask-image: linear-gradient(to bottom, black, transparent); }
.summary-chip { display: inline-flex; align-items: center; gap: .5rem; border: 1px solid #ffffff1a; border-radius: 9999px; background: #ffffff08; padding: .55rem .9rem; color: #cbd5e1; }
.day-section + .day-section { margin-top: 4.5rem; }
.event-detail-card { box-shadow: 0 24px 70px #020f2033; transition: border-color .2s ease, transform .2s ease; }
.event-detail-card:hover { border-color: #22d3ee66; transform: translateY(-3px); }
.event-detail-card:hover img { transform: scale(1.025); }
.photo-shade { pointer-events: none; background: linear-gradient(to top, #041d39b8, transparent 55%); }
.time-chip { border: 1px solid #22d3ee4d; background: #22d3ee12; color: #a5f3fc; }
.schedule-row { background: #041d3959; }
.rules-link { background: #00d9e8; color: #032f5f; transition: background .2s ease, transform .2s ease; }
.rules-link:hover { background: #67e8f9; transform: translateY(-2px); }
.back-link:focus-visible, .rules-link:focus-visible { outline: 2px solid #22d3ee; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .event-detail-card, .event-detail-card img, .rules-link { transition: none; }.event-detail-card:hover, .event-detail-card:hover img, .rules-link:hover { transform: none; } }
</style>
