<template>
  <div>
    <!-- ===========================================================================
        ENCABEZADO DE PÁGINA
        ============================================================================ -->
    <section class="relative py-24 z-10 flex items-center justify-center">
      <!-- Background Image -->
      <div class="absolute inset-0 z-[-2] bg-cover bg-center" style="background-image: url('/images/bg/breadcrumb_bg02.jpg')"></div>
      <!-- Overlay -->
      <div class="absolute inset-0 z-[-1] bg-slate-900/40"></div>
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-3xl md:text-5xl font-extrabold text-white uppercase tracking-wider">Planes de Inscripción VI CIISIC - UNDC</h1>
        <p class="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
          Elige el plan que mejor se adapte a tus necesidades y sé parte de la septima edición del Congreso Internacional de Ingeniería de Sistemas e Informática.
        </p>
      </div>
    </section>

    <!-- ===========================================================================
        SECCIÓN DE PLANES (TARJETAS INTERACTIVAS)
        ============================================================================ -->
    <section class="py-20 md:py-28">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="plan in inscriptionPlans"
            :key="plan.id"
            @click="navigateToPlan(plan.path)"
            class="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:border-primary hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
          >
            <div class="p-8 flex flex-col h-full">
              <h3 class="text-2xl font-bold text-white uppercase">{{ plan.title }}</h3>
              <div class="text-4xl font-extrabold text-primary my-4">{{ plan.price }}</div>
              <p class="text-slate-400 mb-6 text-sm">{{ plan.description }}</p>
              <ul class="space-y-3 text-slate-300 mb-8">
                <li v-for="item in plan.features" :key="item.text" class="flex items-center">
                  <Icon :name="item.icon" class="h-5 w-5 text-primary mr-3" />
                  <span>{{ item.text }}</span>
                </li>
              </ul>
              <div class="mt-auto">
                <button class="w-full bg-primary text-black font-semibold py-3 px-4 rounded-lg transition-transform duration-300 hover:scale-105">Inscríbete ahora</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!--
    ===========================================================================
        SECCIÓN DE DETALLES DEL PLAN (ACORDEÓN)
        ============================================================================
    <section class="py-20 md:py-28 bg-slate-800">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold uppercase text-white mb-2">Características de cada Plan</h2>
          <p class="text-slate-400 max-w-2xl mx-auto">Haz clic en un plan para ver todos los detalles.</p>
        </div>
        <div class="max-w-4xl mx-auto">
          <div v-for="plan in inscriptionPlans" :key="plan.id" class="border border-slate-700 rounded-lg mb-4 overflow-hidden">
            <button @click="toggleAccordion(plan.id)" class="w-full flex justify-between items-center p-5 text-left text-lg font-semibold text-white bg-slate-800 hover:bg-slate-700/80 transition-colors duration-200">
              <span>{{ plan.title }}</span>
              <Icon
                name="heroicons:chevron-down"
                class="h-6 w-6 transition-transform duration-300"
                :class="{ 'rotate-180': activeAccordion === plan.id }"
              />
            </button>
            <div v-if="activeAccordion === plan.id" class="bg-slate-800/50 text-slate-300">
              <div class="p-6">
                <h4 class="font-bold text-lg mb-2 text-primary">Requisitos y Procedimiento</h4>
                <p class="mb-4">{{ plan.details.requirements }}</p>
                <h4 class="font-bold text-lg mb-2 text-primary">Certificación</h4>
                <p>{{ plan.details.certification }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    -->

    <!-- ===========================================================================
        SECCIÓN DE MERCHANDISING (CARRUSEL)
        ============================================================================ -->
    <section class="py-20 md:py-28 bg-slate-800">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold uppercase text-white mb-2">Nuestro Merchandising Oficial</h2>
          <p class="text-slate-400 max-w-2xl mx-auto">Productos de alta calidad para llevar tu experiencia al siguiente nivel.</p>
        </div>
        <div class="relative">
          <div class="flex overflow-x-auto gap-6 pb-4" style="scroll-snap-type: x mandatory;">
            <div v-for="item in merchandising" :key="item.name" class="relative flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg overflow-hidden group" style="scroll-snap-align: center;">
              <img :src="item.image" :alt="item.name" class="w-full h-80 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110">
              <div class="absolute inset-0 bg-black/60 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                <p class="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-in-out">{{ item.name }}</p>
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

const navigateToPlan = (path?: string) => {
  if (path) {
    router.push(path)
  }
}

// ===========================================================================
// SEO Y META TAGS
// ===========================================================================
useHead({
  title: 'Planes de Inscripción | VII CIISIC',
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
    title: 'Pregrado UNDC [Regular]',
    price: 'S/ 80.00',
    path: '/register/estudiantes',
    description: 'Acceso completo para estudiantes de pregrado de la UNDC.',
    features: [
      { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
      { icon: 'heroicons:gift', text: 'Kit de Merchandising' },
      { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
      { icon: 'heroicons:ticket', text: 'Acceso a todas las ponencias' },
    ],
    details: {
      requirements: 'Ser estudiante de pregrado matriculado en la UNDC. Presentar carnet universitario o constancia de matrícula al momento del registro.',
      certification: 'El certificado se emite al completar el 80% de asistencia a las ponencias. Se enviará en formato digital al correo registrado.'
    }
  },
  {
    id: 2,
    title: 'Docentes y Posgrado UNDC',
    price: 'S/ 120.00',
    path: '/register/estudiantes',
    description: 'Plan diseñado para la comunidad académica y de posgrado.',
    features: [
      { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
      { icon: 'heroicons:briefcase', text: 'Maletín Ejecutivo' },
      { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
      { icon: 'heroicons:sparkles', text: 'Acceso a zona VIP' },
    ],
     details: {
      requirements: 'Ser docente o estudiante de posgrado en la UNDC. Presentar fotocheck o constancia correspondiente.',
      certification: 'El certificado se emite al completar el 80% de asistencia a las ponencias. Se enviará en formato digital al correo registrado.'
    }
  },
  {
    id: 3,
    title: 'Público en General [Regular]',
    price: 'S/ 150.00',
    path: '/register/general',
    description: 'Para profesionales y entusiastas externos a la universidad.',
    features: [
      { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
      { icon: 'heroicons:gift', text: 'Kit de Merchandising' },
      { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
      { icon: 'heroicons:ticket', text: 'Acceso a todas las ponencias' },
    ],
     details: {
      requirements: 'Inscripción abierta a todo el público interesado en las últimas tendencias de ingeniería de sistemas e informática.',
      certification: 'El certificado se emite al completar el 80% de asistencia a las ponencias. Se enviará en formato digital al correo registrado.'
    }
  },
  {
    id: 4,
    title: 'Público en General [Virtual]',
    price: 'S/ 50.00',
    path: '/register/general',
    description: 'Asiste desde cualquier parte del mundo y obtén tu certificado.',
    features: [
      { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
      { icon: 'heroicons:signal', text: 'Acceso a transmisión en vivo' },
      { icon: 'heroicons:play-circle', text: 'Grabaciones de ponencias' },
      { icon: 'heroicons:chat-bubble-left-right', text: 'Acceso a canal de Discord' },
    ],
     details: {
      requirements: 'Inscripción abierta a todo el público. Solo se necesita una conexión a internet estable.',
      certification: 'El certificado se emite al completar la visualización del 80% de las ponencias grabadas o en vivo. Se enviará en formato digital.'
    }
  }
])

const merchandising = ref([
  { name: 'Morral Institucional', image: '/images/gallery/project_01.jpg' },
  { name: 'Botella de Aluminio', image: '/images/gallery/project_02.jpg' },
  { name: 'Polo Oficial del Evento', image: '/images/gallery/project_03.jpg' },
  { name: 'Cuaderno y Lapicero', image: '/images/gallery/project_04.jpg' },
  { name: 'Gorra con Logo', image: '/images/gallery/project_05.jpg' },
  { name: 'Llavero Exclusivo', image: '/images/gallery/project_06.jpg' },
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
  background: #1e293b; /* slate-800 */
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #45f882; /* primary */
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #34d399; /* emerald-400 */
}
</style>
