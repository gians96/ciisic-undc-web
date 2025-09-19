<!-- ============================================================================
     PÁGINA SEDES - CÓMO LLEGAR A LA SEDE DEL EVENTO
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
      <div class="custom-container relative">
        <div class="max-w-4xl mx-auto text-center" ref="heroRef">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6 fade-in-element">
            {{ sedeHero.title.replace(sedeHero.highlight, '') }}
            <span class="text-primary">{{ sedeHero.highlight }}</span>
          </h1>
          <p class="text-xl text-gray-300 mb-8 leading-relaxed fade-in-element" style="animation-delay: 0.2s;">
            {{ sedeHero.description }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center fade-in-element" style="animation-delay: 0.4s;">
            <NuxtLink v-for="(action, index) in sedeHero.actions" :key="index" :to="action.to" :class="action.style">
              {{ action.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="pt-16 pb-20 lg:pt-22 lg:pb-32">
      <div class="custom-container">
        <!-- Título general -->
        
        <!-- Grid de 2 columnas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <!-- Columna 1 -->
          <div class="space-y-6">
            <!-- Card de ubicación -->
            <div class="bg-secondary-800 rounded-xl p-6">
              <div class="flex items-start mb-6">
                <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Icon name="heroicons:map-pin" class="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Sede Académica "Casa de la Cultura"</h3>
                  <p class="text-gray-300 text-l">Av. Mariscal Benavides N° 1370 San Vicente - Cañete</p>
                </div>
              </div>
              
              <div class="rounded-lg overflow-hidden mb-4">
                <img 
                  src="/images/about/casa-de-la-cultura.png" 
                  alt="Casa de la Cultura - Universidad Nacional de Cañete"
                  class="w-full h-48 object-cover"
                />
              </div>
            </div>

            <!-- Card de fechas -->
            <div class="bg-secondary-800 rounded-xl p-6">
              <div class="flex items-start">
                <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Icon name="heroicons:calendar-days" class="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Fechas del Evento</h3>
                  <p class="text-gray-300">Del 20 al 24 de octubre de 2025</p>
                  <p class="text-sm text-gray-400">Horario: 8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna 2 -->
          <div class="space-y-6">
            <!-- Card de transporte -->
            <div class="bg-secondary-800 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <Icon name="heroicons:building-office" class="h-5 w-5 text-black" />
                </div>
                <h3 class="text-white font-semibold">Transporte Público</h3>
              </div>
              
              <div class="space-y-4">
                <div>
                  <p class="text-gray-300 text-sm mb-2">Rutas que pasan por la sede del evento:</p>
                  <div class="flex flex-wrap gap-2 mb-3">
                    <span class="bg-secondary-700 text-gray-300 px-2 py-1 rounded text-xs">Linea "A"</span>
                    <span class="bg-secondary-700 text-gray-300 px-2 py-1 rounded text-xs">Linea "B"</span>
                    <span class="bg-secondary-700 text-gray-300 px-2 py-1 rounded text-xs">Taxi Colectivo</span>
                  </div>
                  <div>
                    <p class="text-gray-400 text-xs">
                      Tiempo estimado desde la plaza de armas: 7 minutos (dependiendo del tráfico)
                    </p>
                    <p class="text-gray-400 text-xs">
                      Costo aproximado: S/ 1.50
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card de referencias -->
            <div class="bg-secondary-800 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <Icon name="heroicons:building-storefront" class="h-5 w-5 text-black" />
                </div>
                <h3 class="text-white font-semibold">Referencias Cercanas</h3>
              </div>
              
              <div class="space-y-2">
                <p class="text-gray-300 text-sm">• Policlínico Inkamay Salud</p>
                <p class="text-gray-300 text-sm">• Coliseo Metropolitano "Lolo Fernández"</p>
              </div>
            </div>

            <!-- Card de contacto -->
            <div class="bg-secondary-800 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <Icon name="heroicons:phone" class="h-5 w-5 text-black" />
                </div>
                <h3 class="text-white font-semibold">Contacto de Emergencia</h3>
              </div>
              <div class="space-y-2">
                <p class="text-gray-300">Email: congreso@undc.edu.pe</p>
                <p class="text-gray-300">Teléfono: 949026908</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'

// ============================================================================
// STORES
// ============================================================================

const layoutStore = useLayoutStore()

// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Sede del Evento - CIISIC 2025',
  meta: [
    {
      name: 'description',
      content: 'Información completa sobre cómo llegar a la sede del VII CIISIC.'
    },
    {
      property: 'og:title',
      content: 'Sede del Evento - CIISIC 2025'
    },
    {
      property: 'og:description',
      content: 'Encuentra toda la información para llegar a la sede del VII CIISIC.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// ============================================================================
// DATA
// ============================================================================

const sedeHero = {
  title: 'Encuentra toda la información para llegar a la ',
  highlight: 'Sede del Evento',
  description: 'Casa de la Cultura - Universidad Nacional de Cañete. Te ayudamos a planificar tu visita de la mejor manera.',
  actions: [
    { label: 'Ver en Google Maps', to: 'https://maps.app.goo.gl/E2zfCYn8fgU1G3uZ7', style: 'btn-primary' },
  ]
}

// ============================================================================
// LIFECYCLE
// ============================================================================

// Refs para las animaciones
const heroRef = ref<HTMLElement | null>(null)

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

    if (heroRef.value) {
      observer.observe(heroRef.value)
    }
  }
}

onMounted(() => {
  observeElements()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS ESPECÍFICOS DE LA PÁGINA SEDES
   ============================================================================ */

/* Animation for cards */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects for info cards */
.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(69, 248, 130, 0.1);
  transition: all 0.3s ease;
}

/* Transportation route badges */
.route-badge {
  background: linear-gradient(135deg, #45f882 0%, #3ad66d 100%);
  color: #000000;
  font-weight: 600;
}

/* Emergency section styling */
.emergency-section {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Location image hover effect */
.location-image {
  transition: transform 0.3s ease;
}

.location-image:hover {
  transform: scale(1.05);
}

/* Icon containers */
.icon-container {
  background: linear-gradient(135deg, #45f882 0%, #3ad66d 100%);
  transition: all 0.3s ease;
}

.icon-container:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(69, 248, 130, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .location-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

/* Hero Section Animations and Buttons */
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

.fade-in-element {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-in-element.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .info-card:hover,
  .location-image:hover,
  .icon-container:hover {
    animation: none;
    transform: none;
    transition: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .emergency-section {
    border: 2px solid #ef4444;
  }
  
  .route-badge {
    border: 1px solid #000000;
  }
}

/* Print Styles */
@media print {
  .emergency-section {
    background: #f9f9f9;
    border: 1px solid #ccc;
  }
  
  .icon-container {
    background: #ccc;
  }
}
</style>
