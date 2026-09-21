<template>
  <div class="min-h-screen bg-[#041d39] text-white">
    <section class="relative overflow-hidden px-6 pb-10 pt-16 lg:pt-20">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-300/5" />
      <div ref="heroRef" class="relative z-10 mx-auto max-w-7xl text-center">
        <p class="fade-in-element mb-4 text-sm font-semibold uppercase tracking-wider text-primary-300">
          <span class="pulse-bg rounded-full px-4 py-1">VIII CIISIC UNDC · 2026</span>
        </p>
        <h1 class="fade-in-element mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">CRONOGRAMA DE ACTIVIDADES</h1>

        <div class="fade-in-element mb-8 hidden justify-center md:flex">
          <div class="view-toggle">
            <button type="button" class="toggle-btn" :class="{ active: viewMode === 'timeline' }" @click="viewMode = 'timeline'">
              <Icon name="heroicons:clock" class="h-5 w-5" />Línea de Tiempo
            </button>
            <button type="button" class="toggle-btn" :class="{ active: viewMode === 'calendar' }" @click="viewMode = 'calendar'">
              <Icon name="heroicons:calendar-days" class="h-5 w-5" />Vista Calendario
            </button>
          </div>
        </div>

        <div v-if="effectiveViewMode === 'timeline'" class="mb-8 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Días del congreso">
          <button v-for="(day, index) in schedule" :key="day.date" type="button" role="tab" :aria-selected="selectedDay === index" class="day-nav-btn-hero" :class="{ active: selectedDay === index }" @click="selectedDay = index">
            <span class="block text-sm font-medium">{{ day.short }}</span>
            <span class="block text-2xl font-bold">{{ day.dayNumber }}</span>
          </button>
        </div>
        <div class="fade-in-element flex justify-center"><div class="h-1 w-24 rounded bg-primary-400 shadow shadow-primary-500/50" /></div>
      </div>
    </section>

    <section class="pb-24">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
        <Transition name="fade" mode="out-in">
          <div v-if="effectiveViewMode === 'timeline'" :key="`timeline-${selectedDay}`" class="timeline-container">
            <div v-for="(event, index) in currentDay.events" :key="`${event.time}-${event.title}`" class="timeline-item-full" :style="{ '--delay': `${index * 0.08}s` }">
              <div class="timeline-marker">
                <div class="timeline-dot" :class="event.category" />
                <div v-if="index < currentDay.events.length - 1" class="timeline-line" />
              </div>
              <div class="timeline-content-full">
                <article class="event-card-full">
                  <div class="event-header">
                    <time class="event-time">{{ event.time }}</time>
                    <span class="event-type-badge" :class="event.category">{{ categoryLabel[event.category] }}</span>
                  </div>
                  <h2 class="event-title">{{ event.title }}</h2>
                  <div v-if="event.detail" class="event-speaker"><Icon name="heroicons:microphone" class="h-4 w-4 text-primary-400" /><span>{{ event.detail }}</span></div>
                  <p v-if="event.meta" class="event-description">{{ event.meta }}</p>
                </article>
              </div>
            </div>
          </div>

          <div v-else key="calendar" class="calendar-grid">
            <article v-for="day in schedule" :key="day.date" class="calendar-day-card">
              <header class="calendar-day-header">
                <h2 class="calendar-day-title"><span class="day-name">{{ day.short }}</span><span class="day-date">{{ day.dayNumber }}</span></h2>
              </header>
              <div class="calendar-events-list">
                <article v-for="event in day.events" :key="`${day.date}-${event.time}-${event.title}`" class="calendar-event-item" :class="event.category">
                  <time class="calendar-event-time">{{ event.time }}</time>
                  <h3 class="calendar-event-title">{{ event.title }}</h3>
                  <p v-if="event.detail" class="calendar-event-speaker">{{ event.detail }}</p>
                  <p v-if="event.meta" class="calendar-event-type">{{ event.meta }}</p>
                </article>
              </div>
            </article>
          </div>
        </Transition>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
type EventCategory = 'academic' | 'institutional' | 'cultural'
interface ScheduleEvent { time: string; title: string; detail?: string; meta?: string; category: EventCategory }
interface ScheduleDay { short: string; dayNumber: string; date: string; events: ScheduleEvent[] }

const heroRef = ref<HTMLElement>()
const selectedDay = ref(0)
const viewMode = ref<'timeline' | 'calendar'>('timeline')
const isMobile = ref(false)
const effectiveViewMode = computed(() => isMobile.value ? 'timeline' : viewMode.value)
let mobileQuery: MediaQueryList | undefined
const updateViewport = () => { isMobile.value = mobileQuery?.matches ?? false }
const categoryLabel: Record<EventCategory, string> = { academic: 'Ponencia', institutional: 'Institucional', cultural: 'Actividades' }

const schedule: ScheduleDay[] = [
  { short: 'Lunes', dayNumber: '26', date: '26/10', events: [
    { time: '08:00 - 09:00', title: 'Recepción de delegaciones', category: 'institutional' },
    { time: '09:00 - 10:30', title: 'Actividades de integración y socioculturales', category: 'cultural' },
    { time: '15:00 - 20:00', title: 'Comparsa Sistémica', category: 'cultural' },
  ] },
  { short: 'Martes', dayNumber: '27', date: '27/10', events: [
    { time: '08:00 - 09:00', title: 'Registro de participantes', category: 'institutional' },
    { time: '09:00 - 10:30', title: 'Inauguración del Congreso', detail: 'Ponente internacional Patricio Ramírez Correa', meta: 'Chile · Presencial', category: 'institutional' },
    { time: '10:30 - 11:15', title: 'Ponencia', detail: 'MSc. Daniel Alejandro Yucra Sotomayor', meta: 'Perú', category: 'academic' },
    { time: '11:15 - 12:00', title: 'Ponencia', detail: 'César Armando Beltrán Castañón', meta: 'Perú', category: 'academic' },
    { time: '12:00 - 12:45', title: 'Ponencias Especializadas', category: 'academic' },
    { time: '13:00 - 14:00', title: 'Break', category: 'cultural' },
    { time: '15:00 - 18:00', title: 'E-Sports / Concurso de Programación / Elevator Pitch', category: 'cultural' },
    { time: '18:00 - 20:00', title: 'Encuentro de Egresados', category: 'cultural' },
  ] },
  { short: 'Miércoles', dayNumber: '28', date: '28/10', events: [
    { time: '08:00 - 09:00', title: 'Registro de participantes', category: 'institutional' },
    { time: '09:00 - 10:30', title: 'Ponencia', detail: 'Dr. Abraham Gamarra Moreno', meta: 'Perú', category: 'academic' },
    { time: '10:30 - 11:15', title: 'Ponencia internacional', detail: 'Dr. Jorge Risco', meta: 'Brasil · Virtual', category: 'academic' },
    { time: '11:15 - 12:00', title: 'Ponencia', detail: 'Javier Gamboa Cruzado', meta: 'Perú', category: 'academic' },
    { time: '12:00 - 12:45', title: 'Ponencias Especializadas', category: 'academic' },
    { time: '13:00 - 14:00', title: 'Break', category: 'cultural' },
    { time: '15:00 - 23:00', title: 'Reinado', category: 'cultural' },
  ] },
  { short: 'Jueves', dayNumber: '29', date: '29/10', events: [
    { time: '08:00 - 09:00', title: 'Registro de participantes', category: 'institutional' },
    { time: '09:00 - 10:30', title: 'Ponencia internacional', detail: 'Dra. María Fernanda', meta: 'Colombia · Presencial', category: 'academic' },
    { time: '10:30 - 11:15', title: 'Ponencia', detail: 'Dr. Hugo David Calderón Vilca', meta: 'Perú', category: 'academic' },
    { time: '11:15 - 12:00', title: 'Ponencias de Investigación', category: 'academic' },
    { time: '12:00 - 12:45', title: 'Clausura', category: 'institutional' },
    { time: '13:00 - 14:00', title: 'Break', category: 'cultural' },
    { time: '15:00 - 18:00', title: 'E-Sports / Hackathon', category: 'cultural' },
  ] },
  { short: 'Viernes', dayNumber: '30', date: '30/10', events: [
    { time: '09:00 - 12:00', title: 'Actividades Culturales y Deportivas', category: 'cultural' },
    { time: '12:00 - 12:45', title: 'Break', category: 'cultural' },
  ] },
]

const currentDay = computed(() => schedule[selectedDay.value]!)

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 767px)')
  updateViewport()
  mobileQuery.addEventListener('change', updateViewport)
  const elements = heroRef.value?.querySelectorAll('.fade-in-element') || []
  elements.forEach((element, index) => window.setTimeout(() => element.classList.add('visible'), index * 100))
})
onBeforeUnmount(() => mobileQuery?.removeEventListener('change', updateViewport))

useSeoMeta({ title: 'Cronograma | VIII CIISIC 2026', description: 'Agenda del VIII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica de la UNDC del 26 al 30 de octubre de 2026.', ogTitle: 'Cronograma | VIII CIISIC 2026', ogDescription: 'Calendario completo de conferencias y actividades del VIII CIISIC 2026.' })
</script>

<style scoped>
.fade-in-element { opacity: 0; transform: translateY(30px); transition: all .8s cubic-bezier(.25,.46,.45,.94); }
.fade-in-element.visible { opacity: 1; transform: translateY(0); }
.pulse-bg { position: relative; display: inline-block; z-index: 0; color: #67e8f9; }
.pulse-bg::before { position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: #00d9e81a; box-shadow: 0 0 0 0 #00d9e866; content: ''; animation: pulse-bg 1.8s infinite ease-out; }
@keyframes pulse-bg { to { box-shadow: 0 0 0 10px #00d9e800; } }
.view-toggle { display: flex; border: 1px solid #ffffff1a; border-radius: .75rem; background: #ffffff08; padding: .25rem; }
.toggle-btn { display: flex; align-items: center; gap: .5rem; border-radius: .55rem; padding: .7rem 1rem; color: #94a3b8; font-size: .875rem; font-weight: 600; transition: all .25s ease; }
.toggle-btn.active { background: #00d9e826; color: #67e8f9; box-shadow: 0 0 20px #00d9e826; }
.day-nav-btn-hero { min-width: 80px; cursor: pointer; border: 1px solid #00d9e84d; border-radius: .5rem; background: #00d9e81a; padding: .65rem 1rem; color: white; text-align: center; backdrop-filter: blur(10px); transition: all .3s ease; }
.day-nav-btn-hero:hover { border-color: #00d9e880; background: #00d9e833; transform: translateY(-2px); }
.day-nav-btn-hero.active { border-color: #00d9e8; background: #00d9e84d; box-shadow: 0 0 20px #00d9e866; }
.timeline-container { position: relative; width: 100%; }
.timeline-item-full { display: flex; width: 100%; gap: 1.5rem; padding-bottom: 2rem; animation: fade-up .6s ease-out var(--delay) both; }
.timeline-marker { display: flex; min-width: 24px; flex-direction: column; align-items: center; }
.timeline-dot { position: relative; z-index: 2; height: 1.5rem; width: 1.5rem; border: 4px solid #041d39; border-radius: 50%; }
.timeline-dot.academic { background: #a855f7; }.timeline-dot.institutional { background: #3b82f6; }.timeline-dot.cultural { background: #ec4899; }
.timeline-line { margin-top: .5rem; min-height: 60px; width: 2px; flex: 1; background: #47556980; }
.timeline-content-full { width: 100%; flex: 1; }
.event-card-full { width: 100%; border: 1px solid #47556980; border-radius: .75rem; background: #1e29334d; padding: 1.5rem; backdrop-filter: blur(4px); transition: all .3s ease; }
.event-card-full:hover { border-color: #00d9e84d; background: #3341554d; box-shadow: 0 10px 25px #0003; }
.event-header { margin-bottom: 1rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem; }
.event-time { border: 1px solid #00d9e833; border-radius: 9999px; background: #00d9e81a; padding: .25rem .75rem; color: #67e8f9; font-size: .875rem; font-weight: 600; }
.event-type-badge { border-radius: 9999px; padding: .25rem .75rem; font-size: .75rem; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; }
.event-type-badge.academic { border: 1px solid #a855f74d; background: #a855f733; color: #c4b5fd; }.event-type-badge.institutional { border: 1px solid #3b82f64d; background: #3b82f633; color: #93c5fd; }.event-type-badge.cultural { border: 1px solid #ec48994d; background: #ec489933; color: #fbcfe8; }
.event-title { margin-bottom: .35rem; color: white; font-size: 1.125rem; font-weight: 600; line-height: 1.375; }
.event-speaker { display: flex; align-items: center; gap: .5rem; color: #d1d5db; font-size: .9rem; font-weight: 500; }
.event-description { margin-top: .35rem; color: #9ca3af; font-size: .875rem; }
.calendar-grid { display: grid; grid-template-columns: repeat(5, minmax(0,1fr)); gap: 1rem; }
.calendar-day-card { overflow: hidden; border: 1px solid #47556980; border-radius: .75rem; background: #1e29334d; }
.calendar-day-header { border-bottom: 1px solid #47556980; background: #00d9e81a; padding: 1rem; }
.calendar-day-title { display: flex; flex-direction: column; gap: 4px; margin: 0; }.day-name { color: #67e8f9; font-size: .875rem; font-weight: 500; letter-spacing: .05em; text-transform: uppercase; }.day-date { color: white; font-size: 1.5rem; font-weight: 700; }
.calendar-events-list { display: flex; flex-direction: column; }
.calendar-event-item { min-height: 130px; border-bottom: 1px solid #47556966; padding: 1rem; }.calendar-event-item:last-child { border-bottom: 0; }
.calendar-event-item.academic { border-left: 3px solid #a855f7; }.calendar-event-item.institutional { border-left: 3px solid #3b82f6; }.calendar-event-item.cultural { border-left: 3px solid #ec4899; }
.calendar-event-time { color: #67e8f9; font-size: .75rem; font-weight: 600; }.calendar-event-title { margin-top: .45rem; color: white; font-size: .9rem; font-weight: 600; line-height: 1.35; }.calendar-event-speaker,.calendar-event-type { margin-top: .4rem; color: #aeb8c7; font-size: .75rem; line-height: 1.4; }
.fade-enter-active,.fade-leave-active { transition: all .3s ease; }.fade-enter-from { opacity: 0; transform: translateY(20px); }.fade-leave-to { opacity: 0; transform: translateY(-20px); }
@keyframes fade-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
@media (max-width: 767px) { .timeline-item-full { gap: 1rem; }.timeline-marker { min-width: 20px; }.timeline-dot { height: 1.25rem; width: 1.25rem; }.event-card-full { padding: 1rem; }.event-header { flex-direction: column; align-items: flex-start; }.calendar-grid { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .fade-in-element,.timeline-item-full { opacity: 1; transform: none; transition: none; animation: none; }.pulse-bg::before { animation: none; }.day-nav-btn-hero:hover { transform: none; } }
</style>
