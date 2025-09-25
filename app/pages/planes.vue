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
                  <Icon :name="item.icon" class="plan-feature-icon"
                    :class="{ 'feature-excluded': item.icon === 'heroicons:x-mark' }" />
                  <span :class="{ 'feature-excluded-text': item.icon === 'heroicons:x-mark' }">
                    {{ item.text }}
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
          <p class="text-slate-400 max-w-2xl mx-auto">Productos de alta calidad para llevar tu experiencia al siguiente
            nivel.</p>
        </div>
        <div class="relative max-w-5xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <div v-for="item in merchandising" :key="item.name"
              class="relative rounded-lg overflow-hidden group shadow-xl max-w-sm w-full">
              <img :src="item.image" :alt="item.name"
                class="w-full h-80 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110">
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                <div class="text-center w-full">
                  <p
                    class="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-in-out mb-2">
                    {{ item.name }}
                  </p>
                  <div
                    class="w-12 h-0.5 bg-primary mx-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-in-out">
                  </div>
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
import { useInscriptionPlansStore } from '~/stores/inscriptionPlans'

// ===========================================================================
// ROUTER Y STORE
// ===========================================================================
const router = useRouter()
const inscriptionPlansStore = useInscriptionPlansStore()

// ===========================================================================
// ESTADO REACTIVO
// ===========================================================================
const isRefreshing = ref(false)

// ===========================================================================
// LIFECYCLE HOOKS
// ===========================================================================
onMounted(async () => {
  try {
    // Cargar planes desde API al acceder a la página
    await inscriptionPlansStore.fetchPlans()
    console.log('✅ Planes cargados en la página de planes')
  } catch (error) {
    console.warn('⚠️ Error cargando planes en la página de planes:', error)
    // Los datos por defecto ya están disponibles en el store
  }
})

const navigateToPlan = (planId: number) => {
  router.push(`/register?planId=${planId}`)
}

// ===========================================================================
// MÉTODOS
// ===========================================================================
const refreshPlans = async () => {
  isRefreshing.value = true
  try {
    await inscriptionPlansStore.refreshPlans()
    console.log('✅ Planes actualizados exitosamente')
  } catch (error) {
    console.error('💥 Error actualizando planes:', error)
  } finally {
    isRefreshing.value = false
  }
}

// ===========================================================================
// SEO Y META TAGS
// ===========================================================================
useHead({
  title: 'Planes de Inscripción - VII CIISIC UNDC',
  meta: [
    { name: 'description', content: 'Explora los planes de inscripción para el VII Congreso Internacional de Ingeniería de Sistemas e Informática de la UNDC.' }
  ]
})

// ===========================================================================
// COMPUTED
// ===========================================================================
const inscriptionPlans = computed(() => inscriptionPlansStore.plansFormatted)
const isLoading = computed(() => inscriptionPlansStore.isLoading)
const hasError = computed(() => !!inscriptionPlansStore.error)

// ===========================================================================
// DATOS ESTÁTICOS (MERCHANDISING)
// ===========================================================================
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

.plan-feature-icon {
  width: 1rem;
  height: 1rem;
  color: #45f882;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.plan-feature-icon.feature-excluded {
  color: #ef4444;
}

.feature-excluded-text {
  color: #9ca3af;
  text-decoration: line-through;
}
</style>
