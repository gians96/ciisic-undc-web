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

          <p class="text-xl text-gray-300 mb-8 leading-relaxed fade-in-element" style="animation-delay: 0.4s;">
            Sé parte de la séptima edición del Congreso Internacional de Ingeniería de Sistemas e Investigación Científica
          </p>

          <div class="flex justify-center fade-in-element" style="animation-delay: 0.6s;">
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

    <!-- Sección Planes -->
    <section class="pt-8 pb-20 bg-secondary-900">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <div v-for="plan in inscriptionPlans" :key="plan.id" @click="navigateToPlan(plan.value)"
            class="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:border-primary hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div class="p-8 flex flex-col h-full">
              <div class="flex items-center justify-between">
                <h3 class="text-2xl font-bold text-white uppercase">{{ plan.title }}</h3>
              </div>
              <div class="text-4xl font-extrabold text-primary my-4">{{ plan.price }}</div>
              <p class="text-slate-400 mb-6 text-sm">{{ plan.description }}</p>
              <ul class="space-y-3 text-slate-300 mb-8">
                <li v-for="feature in plan.features" :key="feature.text" class="flex items-center">
                  <Icon :name="feature.icon" 
                        :class="feature.icon === 'heroicons:x-mark' ? 'h-5 w-5 text-red-400 mr-3' : 'h-5 w-5 text-primary mr-3'" />
                  <span :class="feature.icon === 'heroicons:x-mark' ? 'text-slate-400' : 'text-slate-300'">
                    {{ feature.text }}
                  </span>
                </li>
              </ul>
              <div class="mt-auto">
                <button
                  class="w-full bg-primary text-black font-semibold py-3 px-4 rounded-lg transition-transform duration-300 hover:scale-105">Inscríbete
                  ahora</button>
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
const inscriptionPlans = ref([
  {
    id: 1,
    title: 'ESTUDIANTES',
    price: 'Desde S/ 60.00',
    value: 'estudiantes',
    description: 'La opción económica para estudiantes, con acceso a todas las ponencias y su certificado digital por 100h.',
    features: [
      { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
      { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
      { icon: 'heroicons:ticket', text: 'Acceso a todas las ponencias' }
    ]
  },
  {
    id: 2,
    title: 'PROFESIONALES Y PUBLICO GENERAL',
    price: 'Desde S/ 80.00',
    value: 'general',
    description: 'La opción económica para profesionales y cualquier persona interesada en el congreso, con acceso a todas las ponencias y su certificado digital por 100h.',
    features: [
      { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
      { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
      { icon: 'heroicons:ticket', text: 'Acceso a todas las ponencias' }
    ]
  }
])

const merchandising = ref([
  { name: 'Maletin Ejecutivo', image: '/images/merchandising/maletin.webp' },
  { name: 'TomaTodo', image: '/images/merchandising/tomatodo.webp' },
  { name: 'Identificador', image: '/images/merchandising/identificador.webp' }
])

// ===========================================================================
// LÓGICA INTERACTIVA
// ===========================================================================
const activeAccordion = ref<number | null>(1);

const toggleAccordion = (id: number) => {
  if (activeAccordion.value === id) {
    activeAccordion.value = null;
  } else {
    activeAccordion.value = id;
  }
}
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
