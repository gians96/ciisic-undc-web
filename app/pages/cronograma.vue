<!-- ============================================================================
     PÁGINA CRONOGRAMA - CALENDARIO DE ACTIVIDADES
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Hero Section -->
    <section
      class="relative bg-cover bg-center bg-no-repeat py-24 pb-10 overflow-hidden"
    >
      <div class="container mx-auto px-6 relative z-10">
        <div class="text-center max-w-4xl mx-auto" ref="heroRef">
          <p class="text-green-400 text-sm font-semibold tracking-wider mb-4 uppercase fade-in-element">
            <span class="pulse-bg px-4 py-1 rounded-full text-green-300">
              VII CIISIC UNDC
            </span>
          </p>

          <h1 class="text-white text-5xl md:text-6xl font-bold mb-6 fade-in-element" style="animation-delay: 0.2s;">
            CRONOGRAMA DE ACTIVIDADES
          </h1>

          <!-- Navegación de días integrada en el hero -->
          <div class="flex flex-wrap justify-center gap-3 mb-8 fade-in-element" style="animation-delay: 0.4s;">
            <div 
              v-for="day in days" 
              :key="day.id"
              @click="selectedDay = day.id"
              class="day-nav-btn-hero"
              :class="{ 'active': selectedDay === day.id }"
            >
              <div class="font-medium text-sm">{{ day.name }}</div>
              <div class="text-2xl font-bold">{{ day.date }}</div>
            </div>
          </div>

          <div class="flex justify-center fade-in-element" style="animation-delay: 0.6s;">
            <div class="w-24 h-1 rounded bg-green-400 shadow shadow-green-500/50" />
          </div>
        </div>
      </div>
    </section>

    <section class="pb-24">
      <div class="container mx-auto px-6 max-w-7xl">
        
        <div class="space-y-8">

          <div class="day-content">
            <transition name="fade" mode="out-in">
              <div :key="selectedDay" class="selected-day-events">
                <div class="timeline-container max-w-none">
                  <div 
                    v-for="(event, index) in getCurrentDay?.events || []" 
                    :key="index"
                    class="timeline-item-full"
                    :style="{ '--delay': index * 0.1 + 's' }"
                  >
                    <div class="timeline-marker">
                      <div class="timeline-dot" :class="event.type"></div>
                      <div v-if="index < (getCurrentDay?.events?.length || 0) - 1" class="timeline-line"></div>
                    </div>
                    <div class="timeline-content-full">
                      <div class="event-card-full">
                        <div class="event-header">
                          <div class="event-time">{{ event.time }}</div>
                          <div class="event-type-badge" :class="event.type">
                            {{ event.typeLabel }}
                          </div>
                        </div>
                        <h3 class="event-title">{{ event.title }}</h3>
                        <div v-if="event.speaker" class="event-speaker">
                          <div class="speaker-info">
                            <span class="flag-emoji">{{ event.flag }}</span>
                            <span class="speaker-name">{{ event.speaker }}</span>
                          </div>
                        </div>
                        <p v-if="event.description" class="event-description">
                          {{ event.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">

// ============================================================================
// IMPORTS Y COMPOSABLES
// ============================================================================

import { useLayoutStore } from '~/stores/layout'

// ============================================================================
// COMPOSABLES
// ============================================================================

const layoutStore = useLayoutStore()

// ============================================================================
// REFS Y VARIABLES REACTIVAS
// ============================================================================

const selectedDay = ref('lunes')

// ============================================================================
// DATOS DEL CRONOGRAMA
// ============================================================================

const days = ref([
  {
    id: 'lunes',
    name: 'Lunes',
    date: '20',
    events: [
      {
        time: '14:00 - 14:30',
        title: 'Registro y Acreditación',
        type: 'registro',
        typeLabel: 'Registro',
        description: 'Entrega de credenciales y registro de asistencia.',
        speaker: null,
        flag: null
      },
      {
        time: '14:30 - 18:00',
        title: 'Comparsa Sistémica',
        type: 'otros',
        typeLabel: 'Actividades',
        description: 'Integración y participación de los estudiantes en un desfile representativo.',
        speaker: null,
        flag: null
      }
    ]
  },
  {
    id: 'martes',
    name: 'Martes',
    date: '21',
    events: [
      {
        time: '08:00 - 09:00',
        title: 'Inauguración del ciclo de ponencias y Registro de asistencia',
        type: 'registro',
        typeLabel: 'Inauguración y Registro',
        description: 'Inauguramos el ciclo de ponencias del VII CIISIC.',
        speaker: null,
        flag: null
      },
      {
        time: '09:00 - 09:45',
        title: 'Principios de seguridad y el rol del SSDLC en la Ingeniería de Software',
        type: 'ponencia',
        typeLabel: 'Ponencia',
        description: 'Universidad de Buenos Aires - Argentina',
        speaker: 'Mg. Abigail Kauf',
        flag: '🇦🇷'
      },
      {
        time: '09:45 - 10:30',
        title: 'Agentes de Inteligencia Artificial',
        type: 'ponencia',
        typeLabel: 'Ponencia',
        description: 'CENTRUM PUCP - Perú',
        speaker: 'Mg. Gera Flores',
        flag: '🇵🇪'
      },
      {
        time: '10:30 - 11:15',
        title: 'Break',
        type: 'otros',
        typeLabel: 'Receso',
        description: 'Espacio de descanso acompañado de dinámicas y sorteo entre los participantes.',
        speaker: null,
        flag: null
      },
      {
        time: '11:15 - 12:00',
        title: 'Título de Ponencia',
        type: 'ponencia',
        typeLabel: 'Ponencia',
        description: 'Institución - Perú',
        speaker: 'Ponente Nacional 2',
        flag: '🇵🇪'
      },
      {
        time: '12:00 - 13:00',
        title: 'EasyChair',
        type: 'investigacion',
        typeLabel: 'Papers',
        description: 'Difusión de investigaciones académicas.',
        speaker: null,
        flag: null
      },
      {
        time: '13:00 - 14:00',
        title: 'Break',
        type: 'otros',
        typeLabel: 'Receso',
        description: 'Espacio de descanso.',
        speaker: null,
        flag: null
      },
      {
        time: '15:00 - 18:00',
        title: 'Torneo eSports',
        type: 'esports',
        typeLabel: 'eSports',
        description: 'Competencia de videojuegos desarrollada en equipos y de forma individual.',
        speaker: null,
        flag: null
      },
    ]
  },
  {
    id: 'miercoles',
    name: 'Miércoles',
    date: '22',
    events: [
      {
        time: '08:00 - 09:00',
        title: 'Registro de asistencia',
        type: 'registro',
        typeLabel: 'Registro de asistencia',
        description: 'Marcación de asistencia para el día miércoles 22 de octubre.',
        speaker: null,
        flag: null
      },
      {
        time: '09:00 - 09:45',
        title: 'Título de Ponencia',
        type: 'ponencia',
        typeLabel: 'Ponencia',
        description: 'Google Developer Experts - Uruguay',
        speaker: 'Damián Siré',
        flag: '🇺🇾'
      },
      {
        time: '09:45 - 10:30',
        title: 'Título de Ponencia',
        type: 'ponencia',
        typeLabel: 'Ponencia',
        description: 'CISCO - Perú',
        speaker: 'Miguel Garro',
        flag: '🇵🇪'
      },
      {
        time: '10:30 - 11:15',
        title: 'Break',
        type: 'otros',
        typeLabel: 'Receso',
        description: 'Espacio de descanso acompañado de dinámicas y sorteo entre los participantes.',
        speaker: null,
        flag: null
      },
      {
        time: '11:15 - 12:00',
        title: 'Habilidades del Futuro',
        type: 'ponencia',
        typeLabel: 'Ponencia',
        description: 'Universidad Continental - Perú',
        speaker: 'Ivo Yance Carlos',
        flag: '🇵🇪'
      },
      {
        time: '12:00 - 13:00',
        title: 'EasyChair',
        type: 'investigacion',
        typeLabel: 'Papers',
        description: 'Difusión de investigaciones académicas.',
        speaker: null,
        flag: null
      },
      {
        time: '13:00 - 14:00',
        title: 'Break',
        type: 'otros',
        typeLabel: 'Receso',
        description: 'Espacio de descanso.',
        speaker: null,
        flag: null
      },
      {
        time: '16:00 - 20:00',
        title: 'Reinado Sistémico',
        type: 'ceremonia',
        typeLabel: 'Reinado',
        description: 'Concurso de belleza y talento entre los estudiantes de ingeniería de sistemas.',
        speaker: null,
        flag: null
      },
    ]
  },
  {
    id: 'jueves',
    name: 'Jueves',
    date: '23',
    events: [
      {
        time: '08:00 - 09:00',
        title: 'Registro de asistencia',
        type: 'registro',
        typeLabel: 'Registro de asistencia',
        description: 'Marcación de asistencia para el día jueves 23 de octubre.',
        speaker: null,
        flag: null
      },
      {
        time: '09:00 - 09:45',
        title: 'Más allá del código: Potencia tus habilidades como desarrollador en la era GenAI - Softskills',
        type: 'ponencia',
        typeLabel: 'Ponencia',
        description: 'AWS - Colombia',
        speaker: 'Ing. Jose Verbel Tous',
        flag: '🇨🇴'
      },
      {
        time: '09:45 - 10:30',
        title: 'Analítica del aprendizaje en entornos virtuales: un enfoque actual',
        type: 'ponencia',
        typeLabel: 'Ponencia',
        description: 'Universidad Autónoma de Madrid - España',
        speaker: 'Mg. Jim Dios Luna',
        flag: '🇵🇪'
      },
      {
        time: '10:30 - 11:15',
        title: 'Break',
        type: 'otros',
        typeLabel: 'Receso',
        description: 'Espacio de descanso acompañado de dinámicas y sorteo entre los participantes.',
        speaker: null,
        flag: null
      },
      {
        time: '11:15 - 12:00',
        title: 'Metodología de la investigación para Ingeniería de Sistemas',
        type: 'ponencia',
        typeLabel: 'Ponencia',
        description: 'Universidad Tecnica de Georgia',
        speaker: 'Mg. Jowel Cabrera Padilla',
        flag: '🇵🇪'
      },
      {
        time: '12:00 - 13:00',
        title: 'EasyChair',
        type: 'investigacion',
        typeLabel: 'Papers',
        description: 'Difusión de investigaciones académicas.',
        speaker: null,
        flag: null
      },
      {
        time: '13:00 - 14:00',
        title: 'Break',
        type: 'otros',
        typeLabel: 'Receso',
        description: 'Espacio de descanso.',
        speaker: null,
        flag: null
      },
      {
        time: '15:00 - 19:00',
        title: 'Talleres Especializados',
        type: 'taller',
        typeLabel: 'Talleres',
        description: 'Sesiones prácticas sobre temas específicos de interés.',
        speaker: null,
        flag: null
      },
    ]
  },
  {
    id: 'viernes',
    name: 'Viernes',
    date: '24',
    events: [
      {
        time: '08:00 - 10:30',
        title: 'Gymkana Sistémica',
        type: 'otros',
        typeLabel: 'Gymkana',
        description: 'Actividad lúdica para fomentar el trabajo en equipo.',
        speaker: null,
        flag: null
      },
      {
        time: '10:30 - 13:00',
        title: 'Deporte y Recreación',
        type: 'otros',
        typeLabel: 'Deporte',
        description: 'Competencias deportivas y actividades recreativas para los asistentes.',
        speaker: null,
        flag: null
      },
      {
        time: '13:00 - 14:00',
        title: 'Break',
        type: 'otros',
        typeLabel: 'Receso',
        description: 'Espacio de descanso.',
        speaker: null,
        flag: null
      },
      {
        time: '14:00 - 18:00',
        title: 'Deporte y Recreación',
        type: 'otros',
        typeLabel: 'Deporte',
        description: 'Competencias deportivas y actividades recreativas para los asistentes.',
        speaker: null,
        flag: null
      },
      {
        time: '18:00 - 20:00',
        title: 'Actividades Culturales',
        type: 'otros',
        typeLabel: 'Cultura',
        description: 'Como cierre del VII CIISIC se presentarán diversas expresiones culturales.',
        speaker: null,
        flag: null
      },
    ]
  }
])

// ============================================================================
// COMPUTED
// ============================================================================

const getCurrentDay = computed(() => {
  return days.value.find(day => day.id === selectedDay.value) || days.value[0]
})

// ============================================================================
// REFS Y VARIABLES REACTIVAS
// ============================================================================

const heroRef = ref<HTMLElement>()

// ============================================================================
// ANIMACIONES
// ============================================================================

// Animación de entrada
let observer: IntersectionObserver | null = null

const observeElements = () => {
  if (process.client) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            const fadeElements = target.querySelectorAll('.fade-in-element')
            fadeElements.forEach((el, index) => {
              const element = el as HTMLElement
              setTimeout(() => {
                element.classList.add('visible')
              }, index * 100)
            })
            observer?.unobserve(target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )
    if (heroRef.value) observer.observe(heroRef.value)
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  nextTick(() => {
    observeElements()
  })
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Cronograma | VII CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Agenda del VII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica de la UNDC del 20 al 24 de octubre de 2025.'
    },
    {
      property: 'og:title',
      content: 'Cronograma | VII CIISIC'
    },
    {
      property: 'og:description',
      content: 'Calendario completo de conferencias, talleres y actividades del congreso con ponentes internacionales.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})
</script>
<style scoped>
/* ============================================================================
   ANIMACIONES FADE-IN
   ============================================================================ */

.fade-in-element {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: var(--animation-delay, 0s);
}

.fade-in-element.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================================================
   PULSE BACKGROUND ANIMATION
   ============================================================================ */

.pulse-bg {
  position: relative;
  display: inline-block;
  z-index: 0;
}

.pulse-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: rgba(34, 197, 94, 0.1);
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  animation: pulse-only-bg 1.8s infinite ease-out;
  z-index: -1;
}

@keyframes pulse-only-bg {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
}

/* ============================================================================
   NAVEGACIÓN DE DÍAS MINIMALISTA
   ============================================================================ */

.day-nav-btn-hero {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 10px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  color: white;
  min-width: 80px;
}

.day-nav-btn-hero:hover {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.5);
  transform: translateY(-2px);
}

.day-nav-btn-hero.active {
  background: rgba(34, 197, 94, 0.3);
  border-color: #22c55e;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.4);
}

.day-nav-btn {
  background-color: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  min-width: 80px;
}

.day-nav-btn:hover {
  background-color: rgba(51, 65, 85, 0.5);
  border-color: rgba(34, 197, 94, 0.3);
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.1);
}

.day-nav-btn.active {
  background-color: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.5);
  color: rgb(74, 222, 128);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
}

/* ============================================================================
   HEADER DEL DÍA MINIMALISTA
   ============================================================================ */

.day-header-minimal {
  border-bottom: 1px solid rgba(71, 85, 105, 0.5);
  padding-bottom: 1.5rem;
}

/* ============================================================================
   TIMELINE MINIMALISTA
   ============================================================================ */

.timeline-container {
  position: relative;
  width: 100%;
  max-width: none;
}

.timeline-item-full {
  display: flex;
  gap: 1.5rem;
  padding-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out;
  animation-delay: var(--delay, 0s);
  animation-fill-mode: both;
  width: 100%;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 24px;
}

.timeline-dot {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 4px solid rgb(15, 23, 42);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.timeline-dot.ponencia {
  background-color: rgb(168, 85, 247);
}

.timeline-dot.taller {
  background-color: rgb(234, 179, 8);
}

.timeline-dot.otros {
  background-color: rgb(99, 102, 241);
}

.timeline-dot.ceremonia {
  background-color: rgb(239, 68, 68);
}

.timeline-dot.esports {
  background-color: rgb(236, 72, 153);
}

.timeline-dot.registro {
  background-color: rgb(59, 130, 246);
}

.timeline-dot.investigacion {
  background-color: rgb(249, 115, 22);
}

.timeline-line {
  width: 2px;
  background-color: rgba(71, 85, 105, 0.5);
  flex: 1;
  margin-top: 0.5rem;
  min-height: 60px;
}

.timeline-content-full {
  flex: 1;
  width: 100%;
}

.event-card-full {
  background-color: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(71, 85, 105, 0.5);
  border-radius: 0.75rem;
  padding: 1.5rem;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  width: 100%;
  max-width: none;
}

.event-card-full:hover {
  background-color: rgba(51, 65, 85, 0.3);
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.event-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.event-time {
  color: rgb(74, 222, 128);
  font-size: 0.875rem;
  font-weight: 500;
  background-color: rgba(34, 197, 94, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.event-type-badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-type-badge.ponencia {
  background-color: rgba(168, 85, 247, 0.2);
  color: rgb(196, 181, 253);
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.event-type-badge.taller {
  background-color: rgba(234, 179, 8, 0.2);
  color: rgb(254, 240, 138);
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.event-type-badge.otros {
  background-color: rgba(99, 102, 241, 0.2);
  color: rgb(165, 180, 252);
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.event-type-badge.ceremonia {
  background-color: rgba(239, 68, 68, 0.2);
  color: rgb(252, 165, 165);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.event-type-badge.esports {
  background-color: rgba(236, 72, 153, 0.2);
  color: rgb(251, 207, 232);
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.event-type-badge.registro {
  background-color: rgba(59, 130, 246, 0.2);
  color: rgb(147, 197, 253);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.event-type-badge.investigacion {
  background-color: rgba(249, 115, 22, 0.2);
  color: rgb(251, 191, 36);
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.event-title {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  line-height: 1.375;
}


.speaker-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.flag-emoji {
  font-size: 1.125rem;
}

.speaker-name {
  color: rgb(209, 213, 219);
  font-size: 0.875rem;
  font-weight: 500;
}

.event-description {
  color: rgb(156, 163, 175);
  font-size: 0.875rem;
  line-height: 1.625;
}

.additional-info {
  margin-top: 4rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  background-color: rgba(30, 41, 59, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(71, 85, 105, 0.5);
  backdrop-filter: blur(4px);
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-icon {
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  background-color: rgba(51, 65, 85, 0.5);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-title {
  color: white;
  font-weight: 600;
}

.info-text {
  color: rgb(156, 163, 175);
  font-size: 0.875rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .day-nav-btn,
  .day-nav-btn-hero {
    padding: 0.75rem;
    font-size: 0.875rem;
    min-width: 70px;
  }
  
  .timeline-item-full {
    gap: 1rem;
  }
  
  .event-card-full {
    padding: 1rem;
  }
  
  .event-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .speaker-info {
    gap: 0.5rem;
  }
  
  .fade-in-element {
    transform: translateY(20px);
  }
}

@media (max-width: 640px) {
  .timeline-marker {
    min-width: 20px;
  }
  
  .timeline-dot {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .event-title {
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-element,
  .timeline-item-full {
    opacity: 1;
    transform: none;
    transition: none;
    animation: none;
  }
  
  .pulse-bg::before {
    animation: none;
  }
  
  .day-nav-btn,
  .day-nav-btn-hero {
    transform: none;
  }
  
  .day-nav-btn:hover,
  .day-nav-btn-hero:hover {
    transform: none;
  }
}

@media (prefers-contrast: high) {
  .event-card-full {
    border-width: 2px;
  }
  
  .event-time {
    border-width: 2px;
  }
  
  .day-nav-btn,
  .day-nav-btn-hero {
    border-width: 2px;
  }
}

@media (prefers-color-scheme: dark) {
  .info-icon {
    background-color: rgba(71, 85, 105, 0.5);
  }
}

@media print {
  .fade-in-element,
  .timeline-item-full {
    opacity: 1;
    transform: none;
    animation: none;
  }
  
  .pulse-bg::before {
    display: none;
  }
  
  .day-nav-btn,
  .day-nav-btn-hero {
    border: 1px solid #000;
    background: #fff;
    color: #000;
  }
  
  .additional-info {
    break-inside: avoid;
  }
}
</style>
