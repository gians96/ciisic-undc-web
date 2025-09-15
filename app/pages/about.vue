<!-- ============================================================================
     PÁGINA ABOUT - NOSOTROS CON ANIMACIONES DE SCROLL
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
      <div class="custom-container relative">
        <div class="max-w-4xl mx-auto text-center" ref="heroRef">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6 fade-in-element">
            {{ aboutCongress.title.replace(aboutCongress.highlight, '') }}
            <span class="text-primary">{{ aboutCongress.highlight }}</span>
          </h1>
          <p class="text-xl text-gray-300 mb-8 leading-relaxed fade-in-element" style="animation-delay: 0.2s;">
            {{ aboutCongress.description }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center fade-in-element" style="animation-delay: 0.4s;">
            <NuxtLink v-for="(action, index) in aboutCongress.actions" :key="index" :to="action.to"
              :class="action.style">
              {{ action.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20 bg-secondary-800" ref="missionRef">
      <div class="custom-container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="fade-in-element">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
              {{ congressInfo.title }}
            </h2>

            <p v-for="(paragraph, index) in congressInfo.paragraphs" :key="'p-' + index"
              class="text-gray-300 text-lg mb-6 leading-relaxed">
              {{ paragraph }}
            </p>

            <ul class="space-y-4">
              <li v-for="(bullet, index) in congressInfo.bullets" :key="'b-' + index" 
                  class="flex items-start fade-in-element" 
                  :style="`animation-delay: ${0.1 * (index + 1)}s;`">
                <Icon name="heroicons:check" class="h-6 w-6 text-primary mt-1 mr-3 flex-shrink-0" />
                <span class="text-gray-300">{{ bullet }}</span>
              </li>
            </ul>
          </div>

          <div class="relative fade-in-element" style="animation-delay: 0.3s;">
            <div
              class="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary-700 rounded-2xl shadow-2xl flex items-center justify-center">
              <img :src="congressInfo.image" alt="Imagen Congreso" class="object-cover w-full h-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20" ref="statsRef">
      <div class="custom-container">
        <div class="text-center mb-16 fade-in-element">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            Comunidad en crecimiento
          </h2>
          <p class="text-gray-300 text-lg">
            Cada edición reúne a más asistentes, más países y más investigaciones, consolidando al congreso como un
            espacio de referencia en innovación y conocimiento.
          </p>
        </div>
        <div class="grid gap-8" :class="[
          'grid-cols-1',
          stats.length >= 2 ? 'md:grid-cols-2' : '',
          stats.length >= 3 ? 'lg:grid-cols-3' : '',
          stats.length >= 4 ? 'xl:grid-cols-4' : ''
        ]">
          <div v-for="(item, index) in stats" :key="index" 
               class="text-center fade-in-element" 
               :style="`animation-delay: ${0.2 * index}s;`">
            <div class="text-4xl lg:text-5xl font-bold text-primary mb-2 count-up" 
                 :data-target="item.value.replace('+', '')">
              0
            </div>
            <div class="text-gray-300">
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-secondary-800" ref="teamRef">
      <div class="custom-container">
        <div class="text-center mb-16 fade-in-element">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            Voces que inspiran
          </h2>
          <p class="text-gray-300 text-lg">
            Descubre a los invitados y especialistas que harán de este congreso una experiencia única de aprendizaje.
          </p>
        </div>
        <div class="grid gap-8" :class="[
          'grid-cols-1',
          teamSections.length >= 2 ? 'md:grid-cols-2' : '',
          teamSections.length >= 3 ? 'lg:grid-cols-3' : ''
        ]">
          <div v-for="(item, index) in teamSections" :key="index"
            class="bg-secondary-700 rounded-2xl p-6 text-center hover:bg-secondary-600 transition-all duration-300 fade-in-element team-card"
            :style="`animation-delay: ${0.15 * index}s;`">
            <div
              class="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Icon :name="item.icon" class="h-10 w-10 text-black" />
            </div>
            <h3 class="text-xl font-semibold text-primary mb-2">{{ item.title }}</h3>
            <p class="text-gray-300 text-sm">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Sobre Nosotros - VII CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Conoce más sobre VII CIISIC, la plataforma de evento académico anual que reúne investigadores, profesionales y estudiantes para compartir conocimientos'
    },
    {
      property: 'og:title',
      content: 'Sobre Nosotros - VII CIISIC'
    },
    {
      property: 'og:description',
      content: 'Conoce más sobre VII CIISIC, la plataforma de evento académico anual que reúne investigadores, profesionales y estudiantes para compartir conocimientos'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// ============================================================================
// REFS PARA ANIMACIONES
// ============================================================================

const heroRef = ref(null)
const missionRef = ref(null)
const statsRef = ref(null)
const teamRef = ref(null)

// ============================================================================
// INTERSECTION OBSERVER PARA ANIMACIONES
// ============================================================================

let observer: IntersectionObserver | null = null

const observeElements = () => {
  if (process.client) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            
            // Animar elementos fade-in dentro de la sección
            const fadeElements = target.querySelectorAll('.fade-in-element')
            fadeElements.forEach((el, index) => {
              const element = el as HTMLElement
              setTimeout(() => {
                element.classList.add('visible')
              }, index * 100) // Retraso escalonado
            })

            // Animar contadores si es la sección de stats
            if (target.classList.contains('stats-section') || target.querySelector('.count-up')) {
              animateCounters(target)
            }

            // Desconectar el observer después de animar
            observer?.unobserve(target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Observar todas las secciones
    const sections = [heroRef.value, missionRef.value, statsRef.value, teamRef.value]
    sections.forEach(section => {
      if (section) observer?.observe(section)
    })
  }
}

// ============================================================================
// ANIMACIÓN DE CONTADORES
// ============================================================================

const animateCounters = (section: Element) => {
  const counters = section.querySelectorAll('.count-up')
  
  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target') || '0')
    const increment = target / 30 // Duración de la animación
    let current = 0
    
    const updateCounter = () => {
      current += increment
      if (current < target) {
        counter.textContent = Math.floor(current).toString()
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target.toString() + '+'
      }
    }
    
    updateCounter()
  })
}

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

onMounted(() => {
  // Inicializar animaciones después de que el DOM esté listo
  nextTick(() => {
    observeElements()
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// ============================================================================
// DATOS DE LA PÁGINA
// ============================================================================

const aboutCongress = {
  title: '¿Qué es el congreso VII CIISIC?',
  highlight: 'VII CIISIC',
  description: 'El congreso VII CIISIC es un evento académico anual que reúne investigadores, profesionales y estudiantes para compartir conocimientos y experiencias en el campo de la informática y sus aplicaciones. Presentan conferencias o exposiciones sobre temas relacionados con su trabajo o actividad.',
  actions: [
    { label: 'Inscríbete', to: '/tournaments', style: 'btn-primary' },
    { label: 'Contáctanos', to: '/contact', style: 'btn-secondary' }
  ]
}

const congressInfo = {
  title: 'El valor de un congreso',
  paragraphs: [
    'Asistir y participar en congresos fortalece los aprendizajes adquiridos en la universidad, ofreciendo a los estudiantes un espacio para compartir ideas, opiniones y experiencias. Además, los asistentes reciben un certificado que enriquece su currículo académico y potencia su experiencia profesional.'
  ],
  bullets: [
    'Conectar con expertos y profesionales del sector',
    'Fortalecer aprendizajes universitarios con experiencias reales',
    'Obtener certificados que enriquecen tu currículo académico'
  ],
  image: '/images/about/casa-de-la-cultura.png'
}

const stats = [
  { value: '200+', label: 'Asistentes' },
  { value: '3+', label: 'Países representados' },
  { value: '8+', label: 'Ponencias' }
]

const teamSections = [
  {
    icon: 'heroicons:user-group',
    title: 'Ponentes invitados',
    description: 'Expertos reconocidos a nivel nacional e internacional que compartirán su experiencia, casos reales y tendencias del sector.'
  },
  {
    icon: 'heroicons:academic-cap',
    title: 'Ponentes especializados',
    description: 'Profesionales y académicos con trayectoria en áreas específicas que profundizan en metodologías, herramientas y buenas prácticas.'
  },
  {
    icon: 'heroicons:light-bulb',
    title: 'Oportunidad de aprender y crecer',
    description: 'Espacio para escuchar a los ponentes, hacer preguntas y llevarte ideas accionables para tus proyectos, investigaciones y carrera.'
  }
]

</script>

<style scoped>
/* ============================================================================
   ANIMACIONES DE ENTRADA Y FADE-IN
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
   ESTILOS DE BOTONES
   ============================================================================ */

.btn-primary {
  background-color: #45f882;
  color: black;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(0);
}

.btn-primary:hover {
  background-color: rgba(69, 248, 130, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(69, 248, 130, 0.3);
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid #45f882;
  color: #45f882;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(0);
}

.btn-secondary:hover {
  background-color: #45f882;
  color: black;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(69, 248, 130, 0.3);
}

/* ============================================================================
   EFECTOS HOVER MEJORADOS
   ============================================================================ */

.team-card {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(0);
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(69, 248, 130, 0.15);
}

/* ============================================================================
   ANIMACIONES DE CONTADORES
   ============================================================================ */

.count-up {
  transition: all 0.3s ease-out;
}

/* ============================================================================
   RESPONSIVE Y ACCESSIBILITY
   ============================================================================ */

@media (max-width: 768px) {
  .fade-in-element {
    transform: translateY(20px);
  }
  
  .team-card:hover {
    transform: translateY(-4px);
  }
}

/* Respeta las preferencias de movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  .fade-in-element,
  .team-card,
  .btn-primary,
  .btn-secondary {
    animation: none !important;
    transition: none !important;
  }
  
  .fade-in-element {
    opacity: 1;
    transform: translateY(0);
  }
  
  .team-card:hover,
  .btn-primary:hover,
  .btn-secondary:hover {
    transform: none;
  }
}

/* Modo alto contraste */
@media (prefers-contrast: high) {
  .bg-secondary-700,
  .bg-secondary-800 {
    border: 1px solid #ffffff;
  }
  
  .text-gray-300 {
    color: #ffffff;
  }
  
  .fade-in-element {
    outline: 1px solid transparent;
  }
}

/* ============================================================================
   INDICADOR DE CARGA SUAVE
   ============================================================================ */

.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
