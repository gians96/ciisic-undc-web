<template>
  <div>
    <!-- ===========================================================================
        ENCABEZADO DE PÁGINA
        ============================================================================ -->
    <section class="relative py-24 z-10 flex items-center justify-center">
      <!-- Background Image -->
      <div class="absolute inset-0 z-[-2] bg-cover bg-center"
        style="background-image: url('/images/bg/breadcrumb_bg02.jpg')"></div>
      <!-- Overlay -->
      <div class="absolute inset-0 z-[-1] bg-slate-900/40"></div>
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wider">Planes de Inscripción VII
          CIISIC - UNDC</h1>
        <p class="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades y sé parte de la séptima edición del Congreso
          Internacional de Ingeniería de Sistemas.
        </p>
      </div>
    </section>

    <section class="py-20 md:py-28">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="plan in inscriptionPlans" :key="plan.id" @click="navigateToPlan(plan.id)"
            class="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:border-primary hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
            <div class="p-8 flex flex-col h-full">
              <div class="flex items-center justify-between">
                <h3 class="text-2xl font-bold text-white uppercase">{{ plan.title }}</h3>
                <span v-if="plan.badge" :class="[
                  'text-xs font-bold uppercase px-3 py-1 rounded-full border',
                  plan.badge.includes('SIN') ? 'border-amber-400 text-amber-400' : 'border-primary text-primary'
                ]">
                  {{ plan.badge }}
                </span>
              </div>
              <div class="text-4xl font-extrabold text-primary my-4">{{ plan.price }}</div>
              <p class="text-slate-400 mb-6 text-sm">{{ plan.description }}</p>
              <ul class="space-y-3 text-slate-300 mb-8">
                <li v-for="item in plan.features" :key="item.text" class="flex items-center">
                  <Icon :name="item.icon" class="h-5 w-5 text-primary mr-3" />
                  <span>{{ item.text }}</span>
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
    <section class="py-20 md:py-28 bg-slate-800">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold uppercase text-white mb-2">Nuestro Merchandising Oficial</h2>
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
import { useRouter } from 'vue-router'

// ===========================================================================
// ROUTER
// ===========================================================================
const router = useRouter()

const navigateToPlan = (planId: number) => {
  router.push(`/register?planId=${planId}`)
}

// ===========================================================================
// SEO Y META TAGS
// ===========================================================================
useHead({
  title: 'Planes de Inscripción - VI CIISIC UNDC',
  meta: [
    { name: 'description', content: 'Explora los planes de inscripción para el VI Congreso Internacional de Ingeniería de Sistemas e Informática de la UNDC.' }
  ]
})

// ===========================================================================
// DATOS ESTÁTICOS
// ===========================================================================
const inscriptionPlans = ref([
  {
    id: 1,
    title: 'ESTUDIANTES',
    badge: 'CON KIT',
    price: 'S/ 120.00',
    value: 'estudiantes_con_kit',
    description: 'La experiencia completa para estudiantes de institutos, colegios y otras universidades.',
    features: [
      { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
      { icon: 'heroicons:gift', text: 'Kit de Merchandising Oficial' },
      { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
      { icon: 'heroicons:ticket', text: 'Acceso a todas las ponencias' },
    ]
  },
  {
    id: 2,
    title: 'ESTUDIANTES',
    badge: 'SIN KIT',
    price: 'S/ 60.00',
    value: 'estudiantes_sin_kit',
    description: 'La opción económica para estudiantes, con acceso a todas las ponencias y su certificado.',
    features: [
      { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
      { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
      { icon: 'heroicons:ticket', text: 'Acceso a todas las ponencias' },
      { icon: 'heroicons:x-mark', text: 'No incluye Kit' },
    ]
  },
  {
    id: 3,
    title: 'PUBLICO GENERAL',
    badge: 'INCLUYE KIT',
    price: 'S/ 140.00',
    value: 'publico_general_con_kit',
    description: 'Acceso total con kit para profesionales y cualquier persona interesada en el congreso.',
    features: [
      { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
      { icon: 'heroicons:gift', text: 'Kit de Merchandising Oficial' },
      { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
      { icon: 'heroicons:ticket', text: 'Acceso a todas las ponencias' },
    ]
  }
])

const merchandising = ref([
  { name: 'Maletin Ejecutivo', image: '/images/merchandising/maletin.jpeg' },
  { name: 'TomaTodo', image: '/images/merchandising/tomatodo.jpeg' },
  { name: 'Identificador', image: '/images/merchandising/identificador.jpeg' },
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
</style>
