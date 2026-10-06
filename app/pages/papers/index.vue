<!-- ============================================================================
     PÁGINA PAPERS
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-[#041d39]">
    <!-- Hero Section -->
    <section
      class="relative bg-cover bg-center bg-no-repeat py-24 pb-2 overflow-hidden"
    >
      <div class="container mx-auto px-6 relative z-10">
        <div ref="heroRef" class="text-center max-w-4xl mx-auto">
          <p class="text-primary-400 text-sm font-semibold tracking-wider mb-4 uppercase fade-in-element">
            <span class="pulse-bg px-4 py-1 rounded-full text-primary-300">
              VIII CIISIC UNDC
            </span>
          </p>

          <h1 class="text-white text-5xl md:text-6xl font-bold mb-6 fade-in-element" style="animation-delay: 0.2s;">
            CALL FOR PAPERS
          </h1>
          <div class="flex justify-center fade-in-element" style="animation-delay: 0.6s;">
            <div class="w-24 h-1 rounded bg-primary-400 shadow shadow-primary-500/50" />
          </div>
        </div>
      </div>
    </section>

    <section class="pb-2 mt-8">
      <div class="custom-container px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-12 gap-8 items-center">
          <!-- Columna de Texto (6 columnas) -->
          <div class="col-span-12 lg:col-span-6">
            <div class="space-y-6">
              <h2 class="text-3xl font-bold text-white mb-6">Resumen</h2>
              <div class="text-gray-300 text-lg leading-relaxed space-y-4">
                <p>

                  La conferencia VIII CIISIC invita a la presentación de artículos de investigación originales, redactados en  español o inglés, con una extensión de <strong class="text-white">8 a 10 páginas</strong>,
                  considerando tanto el resumen como las referencias bibliográficas.
                </p>
                <p>
                  Se permite un máximo de <strong class="text-white">cuatro (4) autores</strong>
                  por trabajo, incluyendo coautores. El proceso de evaluación seguirá la modalidad de <strong class="text-white">revisión por pares ciegos (double blind peer review)</strong>, asegurando la calidad científica y académica de cada contribución.
                </p>
                <p>
                  Los trabajos deben seguir la <strong class="text-white">plantilla de COINTECI</strong>,
                  que puede descargarse desde:
                </p>
                <div class="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 mx-4 sm:mx-0">
                  <a
                    v-for="(action, index) in papersHero.actions"
                    :key="index"
                    :href="action.to"
                    target="_blank" rel="noopener noreferrer"
                    :class="[action.style, 'text-center text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3']"
                  >
                    {{ action.label }}
                  </a>
                  <a
                    href="https://easychair.org/conferences/?conf=viiiciisic2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-primary rounded-lg px-4 py-2.5 text-center text-sm font-semibold sm:px-6 sm:py-3 sm:text-base"
                  >
                    Registrar paper
                    <span class="sr-only"> en EasyChair (se abre en una pestaña nueva)</span>
                  </a>
                </div>
                <p class="text-sm text-primary-300">Haz clic en Registrar paper para enviar tu artículo. La recepción de papers es del 05 al 14 de octubre.</p>
              </div>
            </div>
          </div>

          <!-- Columna de Imagen (6 columnas) -->
          <div class="col-span-12 lg:col-span-6 flex justify-center items-center">
            <div class="w-full lg:w-[75%] h-auto">
              <img
                src="/images/eventos/papers.webp"
                alt="Afiche de Call for Papers de la edición 2026"
                class="w-full h-auto object-cover rounded-xl shadow-2xl"
              >
              <p class="mt-3 text-center text-sm text-slate-400">Edición 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección: Ejes Temáticos -->
    <section class="pt-16 pb-2">
      <div class="custom-container px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-white mb-6 text-center">Ejes Temáticos</h2>
        <div class="flex justify-center mb-12">
          <div class="w-24 h-1 rounded bg-primary-400 shadow shadow-primary-500/50" />
        </div>

        <div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-stretch">
            <template v-for="(axis, idx) in thematicAxes.slice(0, Math.floor(thematicAxes.length / 4) * 4)" :key="'normal-' + idx">
              <div class="group bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30 hover:bg-slate-800/80 cursor-pointer w-full h-full min-h-[270px]">
                <div class="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/40">
                  <Icon :name="axis.icon" class="h-8 w-8 text-black" />
                </div>
                <h3 class="text-lg font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-primary">{{ axis.title }}</h3>
                <p class="text-gray-300 text-sm transition-colors duration-300 group-hover:text-gray-200">{{ axis.desc }}</p>
              </div>
            </template>
          </div>
          <div v-if="thematicAxes.length % 4 !== 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 justify-center">
            <template v-for="n in Math.floor((4 - (thematicAxes.length % 4)) / 2)" :key="'empty-left-' + n">
              <div class="hidden lg:block"/>
            </template>
            <template v-for="(axis, idx) in thematicAxes.slice(Math.floor(thematicAxes.length / 4) * 4)" :key="'centered-' + idx">
              <div class="group bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30 hover:bg-slate-800/80 cursor-pointer w-full h-full min-h-[270px]">
                <div class="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/40">
                  <Icon :name="axis.icon" class="h-8 w-8 text-black" />
                </div>
                <h3 class="text-lg font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-primary">{{ axis.title }}</h3>
                <p class="text-gray-300 text-sm transition-colors duration-300 group-hover:text-gray-200">{{ axis.desc }}</p>
              </div>
            </template>
            <template v-for="n in Math.ceil((4 - (thematicAxes.length % 4)) / 2)" :key="'empty-right-' + n">
              <div class="hidden lg:block"/>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección: Línea de Tiempo -->
    <section class="pt-16 pb-20">
      <div class="custom-container px-[5%] sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-white mb-6 text-center">Cronograma de Actividades</h2>
        <div class="flex justify-center mb-12">
          <div class="w-24 h-1 rounded bg-primary-400 shadow shadow-primary-500/50" />
        </div>
        <div class="relative">
          <!-- Timeline Line (Desktop) -->
          <div class="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-primary-400 to-primary"/>

          <!-- Timeline Events -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
            <div
              v-for="(event, idx) in timelineEvents"
              :key="idx"
              class="timeline-item flex flex-col items-center relative"
              :class="{
                'timeline-completed': getEventStatus(event) === 'completed',
                'timeline-current': getEventStatus(event) === 'current',
                'timeline-upcoming': getEventStatus(event) === 'upcoming'
              }"
            >
              <!-- Circle Icon -->
              <div
                class="w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg z-20 transition-all duration-300 hover:scale-110"
                :class="{
                  'timeline-current-pulse': getEventStatus(event) === 'current',
                  'bg-gray-500 shadow-gray-500/30': getEventStatus(event) === 'upcoming'
                }"
                :style="getEventStatus(event) === 'completed' || getEventStatus(event) === 'current' ? 'background-color: #00d9e8; box-shadow: 0 2px 8px rgba(0, 217, 232, 0.3); opacity: 1;' : ''"
              >
                <Icon :name="event.icon" class="h-7 w-7 text-white" />
              </div>

              <!-- Event Card -->
              <div
                class="backdrop-blur-sm rounded-xl p-4 text-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 w-full max-w-none sm:max-w-[200px]"
                :class="{
                  'timeline-current-glow': getEventStatus(event) === 'current',
                  'bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/30': getEventStatus(event) === 'upcoming'
                }"
                :style="getEventStatus(event) === 'completed' ? 'background: linear-gradient(135deg, rgba(0, 217, 232, 0.2) 0%, rgba(0, 217, 232, 0.12) 100%); border: 1px solid rgba(0, 217, 232, 0.4); box-shadow: 0 2px 8px rgba(0, 217, 232, 0.25);' : (getEventStatus(event) === 'current' ? 'background: linear-gradient(135deg, rgba(0, 217, 232, 0.15) 0%, rgba(0, 217, 232, 0.08) 100%); border: 1px solid rgba(0, 217, 232, 0.3); box-shadow: 0 2px 8px rgba(0, 217, 232, 0.2);' : '')"
              >
                <div class="font-semibold text-white mb-2 text-sm leading-tight">{{ event.title }}</div>
                <div
                  class="text-xs font-medium"
                  :class="{
                    'text-primary-400': getEventStatus(event) === 'completed' || getEventStatus(event) === 'current',
                    'text-gray-300': getEventStatus(event) === 'upcoming'
                  }"
                >
                  {{ event.date }}
                </div>
              </div>

              <!-- Status Indicator (hidden on mobile) -->
              <div
                v-if="getEventStatus(event) === 'completed'"
                class="hidden sm:flex absolute -top-2 -right-2 w-6 h-6 text-white rounded-full items-center justify-center text-xs font-bold z-30"
                style="background-color: #00d9e8;"
              >
                <Icon name="heroicons:check" class="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Ejes temáticos
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const thematicAxes = [
  { title: 'Inteligencia Artificial y Aprendizaje Automático', icon: 'heroicons:cpu-chip', desc: 'Avances, aplicaciones y retos en IA y machine learning.' },
  { title: 'Ciencia de Datos y Big Data', icon: 'heroicons:circle-stack', desc: 'Procesamiento, análisis y visualización de grandes volúmenes de datos.' },
  { title: 'Redes y Ciberseguridad', icon: 'heroicons:shield-check', desc: 'Infraestructura, protección de datos y amenazas digitales.' },
  { title: 'Desarrollo de Software y Metodologías Ágiles', icon: 'heroicons:code-bracket', desc: 'Buenas prácticas, frameworks y gestión ágil de proyectos.' },
  { title: 'Ingeniería de Software y Pruebas Automatizadas', icon: 'heroicons:bug-ant', desc: 'Calidad, testing y automatización en el ciclo de vida del software.' },
  { title: 'Transformación Digital', icon: 'heroicons:cloud', desc: 'Innovación, digitalización y cambio organizacional.' },
  { title: 'Industria 5.0 y Operaciones Inteligentes', icon: 'heroicons:building-office-2', desc: 'Integración de tecnologías avanzadas en la industria.' },
  { title: 'Economía Digital y Fintech', icon: 'heroicons:currency-dollar', desc: 'Nuevos modelos de negocio, pagos digitales y servicios financieros.' },
  { title: 'Aprendizaje en Línea y Gamificación', icon: 'heroicons:puzzle-piece', desc: 'Estrategias, plataformas y motivación en la educación digital.' },
  { title: 'Educación en Ingeniería y Tecnología', icon: 'heroicons:academic-cap', desc: 'Innovación educativa y formación en áreas STEM.' },
]

// Línea de tiempo (fechas en hora de Lima, UTC-5)
const timelineEvents = [
  {
    title: 'Apertura',
    date: '05 de octubre',
    icon: 'heroicons:calendar-days',
    startDate: '2026-10-05T00:00:00-05:00',
    endDate: '2026-10-05T23:59:59-05:00'
  },
  {
    title: 'Recepción de papers',
    date: '05 - 14 de octubre',
    icon: 'heroicons:arrow-up-tray',
    startDate: '2026-10-05T00:00:00-05:00',
    endDate: '2026-10-14T23:59:59-05:00'
  },
  {
    title: 'Evaluación de papers',
    date: '15 - 20 de octubre',
    icon: 'heroicons:clipboard-document-check',
    startDate: '2026-10-15T00:00:00-05:00',
    endDate: '2026-10-20T23:59:59-05:00'
  },
  {
    title: 'Notificación de aceptación',
    date: '21 - 22 de octubre',
    icon: 'heroicons:envelope',
    startDate: '2026-10-21T00:00:00-05:00',
    endDate: '2026-10-22T23:59:59-05:00'
  },
  {
    title: 'Presentación de papers',
    date: '27 - 28 de octubre',
    icon: 'heroicons:megaphone',
    startDate: '2026-10-27T00:00:00-05:00',
    endDate: '2026-10-28T23:59:59-05:00'
  },
]

// Función para verificar el estado de cada evento
const getEventStatus = (event: { startDate: string; endDate: string }) => {
  if (!event.startDate || !event.endDate) return 'upcoming'
  const today = new Date()
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)

  if (today >= startDate && today <= endDate) {
    return 'current' // Evento en curso
  } else if (today > endDate) {
    return 'completed' // Evento completado
  } else {
    return 'upcoming' // Evento futuro
  }
}
const heroRef = ref(null)
const papersHero = {
  actions: [
    { label: 'Formato de presentación · referencia 2025', to: '/[VII CIISIC] Formato.docx', style: 'btn-secondary' },

  ]
}
// Animación de entrada
let observer: IntersectionObserver | null = null
const observeElements = () => {
  if (import.meta.client) {
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
onMounted(() => {
  nextTick(() => {
    observeElements()
  })
})
onUnmounted(() => {
  if (observer) observer.disconnect()
})

useHead({
  title: 'Call for Papers | VIII CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Envía tu paper para participar en el VIII CIISIC. Revisa los requisitos y fechas importantes.'
    },
    {
      property: 'og:title',
      content: 'Call for Papers  | VIII CIISIC'
    },
    {
      property: 'og:description',
      content: 'Envía tu paper para participar en el VIII CIISIC. Revisa los requisitos y fechas importantes.'
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
   ANIMACIONES DE ENTRADA Y FADE-IN
   ============================================================================ */

.fade-in-element {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: var(--animation-delay, 0s);
}

.fade-in-element.visible {
  opacity: 1;
  transform: translateY(0);
}

/* =========================================================================
  ESTILOS
  ========================================================================= */
.btn-primary {
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(0);
  display: inline-block;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 217, 232, 0.3);
}
.btn-secondary {
  background-color: transparent;
  border: 2px solid #00d9e8;
  color: #00d9e8;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(0);
  display: inline-block;
}
.btn-secondary:hover {
  background-color: #00d9e8;
  color: black;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 217, 232, 0.3);
}

.form-input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 217, 232, 0.1);
}

.form-textarea {
  min-height: 120px;
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 217, 232, 0.2);
}

.contact-info-card {
  background: linear-gradient(135deg, rgb(55 65 81) 0%, rgb(75 85 99) 100%);
  border: 1px solid rgb(107 114 128);
}

.contact-info-card:hover {
  border-color: #00d9e8;
  transform: translateY(-2px);
}

.form-field {
  animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-element,
  .form-field,
  .social-link:hover,
  .contact-info-card:hover,
  .form-input:focus {
    animation: none !important;
    transform: none !important;
    transition: none !important;
  }

  .fade-in-element {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .fade-in-element {
    transform: translateY(20px);
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .social-links {
    justify-content: center;
  }
}

@media (prefers-contrast: high) {
  .form-input,
  .form-textarea,
  .form-select {
    border: 2px solid #ffffff;
  }
  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    border-color: #00d9e8;
    box-shadow: 0 0 0 2px #00d9e8;
  }
}

@media (prefers-color-scheme: dark) {
  .form-input::placeholder,
  .form-textarea::placeholder {
    color: rgb(156 163 175);
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
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
  background-color: rgba(0, 217, 232, 0.1);
  box-shadow: 0 0 0 0 rgba(0, 217, 232, 0.4);
  animation: pulse-only-bg 1.8s infinite ease-out;
  z-index: -1;
}

@keyframes pulse-only-bg {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 217, 232, 0.4);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(0, 217, 232, 0);
  }
}

/* ============================================================================
   TIMELINE STYLES
   ============================================================================ */

.timeline-item {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: calc(var(--item-index, 0) * 0.1s);
}

/* Animaciones para etapa actual - Minimalistas */
.timeline-current-glow {
  animation: subtlePulse 3s ease-in-out infinite;
}

.timeline-current-pulse {
  animation: subtlePulse 3s ease-in-out infinite;
}

@keyframes subtlePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.95;
    box-shadow: 0 2px 8px rgba(0, 217, 232, 0.15);
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
    box-shadow: 0 4px 15px rgba(0, 217, 232, 0.25), 0 0 20px rgba(0, 217, 232, 0.1);
  }
}

.timeline-item:nth-child(1) { --item-index: 0; }
.timeline-item:nth-child(2) { --item-index: 1; }
.timeline-item:nth-child(3) { --item-index: 2; }
.timeline-item:nth-child(4) { --item-index: 3; }
.timeline-item:nth-child(5) { --item-index: 4; }

/* Timeline Status States */
.timeline-completed {
  transform: scale(1.02);
}

.timeline-upcoming {
  opacity: 0.8;
}

@keyframes currentPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
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
  .timeline-item {
    animation-delay: calc(var(--item-index, 0) * 0.05s);
  }
}
</style>
