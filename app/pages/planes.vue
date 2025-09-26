<template>
  <div class="min-h-screen bg-secondary-900">
    <!-- Hero Section -->
    <section
      class="relative bg-cover bg-center bg-no-repeat py-24 pb-2 overflow-hidden"
    >
      <div class="container mx-auto px-6 relative z-10">
        <div class="text-center max-w-4xl mx-auto" ref="heroRef">
          <p class="text-green-400 text-sm font-semibold tracking-wider mb-4 uppercase fade-in-element">
            <span class="pulse-bg px-4 py-1 rounded-full text-green-300">
              VII CIISIC UNDC
            </span>
          </p>

          <h1 class="text-white text-5xl md:text-6xl font-bold mb-6 fade-in-element" style="animation-delay: 0.2s;">
            INSCRIPCIONES
          </h1>

          <p class="text-xl text-gray-300 mb-6 leading-relaxed fade-in-element" style="animation-delay: 0.4s;">
            Sé parte de la séptima edición del Congreso Internacional de Ingeniería de Sistemas e Investigación Científica
          </p>

          <!-- Botones de inscripción -->
          <div class="space-y-6 mb-6 fade-in-element" style="animation-delay: 0.6s;">
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button @click="navigateToPlan('estudiantes')"
                class="bg-green-400 hover:bg-green-300 text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Inscripciones para Estudiantes
              </button>
              <button @click="navigateToPlan('general')"
                class="bg-green-400 hover:bg-green-300 text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Inscripciones para Público General
              </button>
            </div>
            <div class="text-center">
              <p class="text-gray-300 text-lg">
                 Para inscripción de delegaciones comunicarse con: 
                <a href="https://wa.me/51976541722" target="_blank" class="text-green-400 hover:text-green-300 transition-colors underline font-semibold">
                  976541722
                </a>
              </p>
            </div>
          </div>

          <div class="flex justify-center fade-in-element" style="animation-delay: 0.8s;">
            <div class="w-24 h-1 rounded bg-green-400 shadow shadow-green-500/50" />
          </div>
        </div>
      </div>
    </section>

    <!-- Sección Merchandising -->
    <section class="pt-16 pb-12 bg-secondary-900">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold uppercase text-white mb-2">Merchandising Oficial</h2>
          <p class="text-slate-400 max-w-2xl mx-auto">Productos de alta calidad para llevar tu experiencia al siguiente
            nivel.</p>
        </div>
        <div class="relative max-w-5xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <div v-for="item in merchandising" :key="item.name" class="relative rounded-lg overflow-hidden group shadow-xl max-w-sm w-full">
              <img :src="item.image" :alt="item.name"
                class="w-full h-80 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110">
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                <div class="text-center w-full">
                  <p class="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-in-out mb-2">
                    {{ item.name }}
                  </p>
                  <div class="w-12 h-0.5 bg-primary mx-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// ===========================================================================
// ROUTER
// ===========================================================================
const navigateToPlan = (planValue: string) => {
  if (planValue === 'estudiantes') {
    navigateTo('/estudiantes')
  } else if (planValue === 'general') {
    navigateTo('/general')
  }
}

// ===========================================================================
// SEO Y META TAGS
// ===========================================================================
useHead({
  title: 'Planes | VII CIISIC',
  meta: [
    { name: 'description', content: 'Explora los planes de inscripción para el VII Congreso Internacional de Ingeniería de Sistemas e Informática de la UNDC.' }
  ]
})

// ===========================================================================
// DATOS ESTÁTICOS
// ===========================================================================
const merchandising = ref([
  { name: 'Maletin Ejecutivo', image: '/images/merchandising/maletin.webp' },
  { name: 'TomaTodo', image: '/images/merchandising/tomatodo.webp' },
  { name: 'Identificador', image: '/images/merchandising/identificador.webp' }
])
</script>

<style scoped>
/* Estilos para la barra de scroll del carrusel */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #1e293b;
  /* slate-800 */
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #45f882;
  /* primary */
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #34d399;
  /* emerald-400 */
}

/* ============================================================================
   PULSE BADGE STYLES
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
</style>
