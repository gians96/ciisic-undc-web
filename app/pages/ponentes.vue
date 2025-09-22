<!-- ============================================================================
     PÁGINA PONENTES - LISTADO COMPLETO DE PONENTES
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Hero Section -->
    <section
      class="relative bg-cover bg-center bg-no-repeat py-24 pb-14 overflow-hidden"
    >
      <div class="container mx-auto px-6 relative z-10">
        <div class="text-center max-w-4xl mx-auto" ref="heroRef">
          <p class="text-green-400 text-sm font-semibold tracking-wider mb-4 uppercase fade-in-element">
            <span class="pulse-bg px-4 py-1 rounded-full text-green-300">
              VII CIISIC UNDC
            </span>
          </p>

          <h1 class="text-white text-5xl md:text-6xl font-bold mb-6 fade-in-element" style="animation-delay: 0.2s;">
            PONENTES INVITADOS
          </h1>

          <p class="text-xl text-gray-300 mb-8 leading-relaxed fade-in-element" style="animation-delay: 0.4s;">
            Conoce a los expertos que compartirán sus conocimientos y experiencias 
            en el VII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica
          </p>

          <div class="flex justify-center fade-in-element" style="animation-delay: 0.6s;">
            <div class="w-24 h-1 rounded bg-green-400 shadow shadow-green-500/50" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-1 pb-20">
      <div class="container mx-auto px-6">
        <!-- Lista de Ponentes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PonenteCard
            v-for="ponente in ponentes"
            :key="ponente.id"
            :ponente="ponente"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">

// ============================================================================
// IMPORTS Y COMPOSABLES
// ============================================================================

import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'

// ============================================================================
// COMPOSABLES
// ============================================================================

const { ponentes } = usePonentes()
const layoutStore = useLayoutStore()

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
  title: 'Ponentes | VII CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Conoce a los expertos ponentes del VII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica de la UNDC.'
    },
    {
      property: 'og:title',
      content: 'Ponentes | VII CIISIC'
    },
    {
      property: 'og:description',
      content: 'Expertos internacionales en tecnología, sistemas de información y computación.'
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
   RESPONSIVE DESIGN
   ============================================================================ */

@media (max-width: 768px) {
  .fade-in-element {
    transform: translateY(20px);
  }
}

/* ============================================================================
   ACCESSIBILITY
   ============================================================================ */

@media (prefers-reduced-motion: reduce) {
  .fade-in-element {
    opacity: 1;
    transform: none;
    transition: none;
    animation: none;
  }
  
  .pulse-bg::before {
    animation: none;
  }
}

/* ============================================================================
   HIGH CONTRAST MODE
   ============================================================================ */

@media (prefers-contrast: high) {
  .fade-in-element {
    transition-duration: 0.3s;
  }
}

/* ============================================================================
   PRINT STYLES
   ============================================================================ */

@media print {
  .fade-in-element {
    opacity: 1;
    transform: none;
  }
  
  .pulse-bg::before {
    display: none;
  }
}
</style>
