<!-- ============================================================================
     PÁGINA FAQ - PREGUNTAS FRECUENTES
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900 py-20">
    <div class="custom-container">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6">
            Preguntas <span class="text-primary">Frecuentes</span>
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            Encuentra respuestas a las preguntas más comunes sobre MYKD
          </p>
        </div>

        <!-- Search FAQ -->
        <div class="mb-12">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar en las preguntas frecuentes..."
              class="w-full pl-12 pr-4 py-4 bg-secondary-800 border border-secondary-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
          </div>
        </div>

        <!-- FAQ Categories -->
        <div class="mb-12">
          <div class="flex flex-wrap gap-4 justify-center">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              class="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              :class="selectedCategory === category.id 
                ? 'bg-primary text-black' 
                : 'bg-secondary-800 text-gray-300 hover:bg-secondary-700'"
            >
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- FAQ Items -->
        <div class="space-y-4">
          <div
            v-for="faq in filteredFaqs"
            :key="faq.id"
            class="bg-secondary-800 rounded-xl overflow-hidden"
          >
            <button
              @click="toggleFaq(faq.id)"
              class="w-full p-6 text-left flex items-center justify-between hover:bg-secondary-700 transition-colors duration-300"
            >
              <h3 class="text-lg font-semibold text-white pr-4">{{ faq.question }}</h3>
              <Icon 
                name="heroicons:chevron-down" 
                class="h-5 w-5 text-primary transition-transform duration-300"
                :class="{ 'rotate-180': openFaqs.includes(faq.id) }"
              />
            </button>
            <Transition
              name="fade-slide"
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="openFaqs.includes(faq.id)" class="px-6 pb-6">
                <div class="prose prose-invert max-w-none">
                  <p class="text-gray-300 leading-relaxed">{{ faq.answer }}</p>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="mt-16 text-center bg-secondary-800 rounded-2xl p-8">
          <h3 class="text-2xl font-bold text-white mb-4">¿No encontraste lo que buscabas?</h3>
          <p class="text-gray-300 mb-6">
            Nuestro equipo de soporte está aquí para ayudarte con cualquier pregunta
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/contact"
              class="bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Contactar Soporte
            </NuxtLink>
            <a 
              href="https://discord.gg/mykd"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Únete a Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Preguntas Frecuentes | VII CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Encuentra respuestas a las preguntas más frecuentes sobre MYKD, torneos, registro y más.'
    }
  ]
})

// ============================================================================
// ESTADO LOCAL
// ============================================================================

const searchQuery = ref('')
const selectedCategory = ref('all')
const openFaqs = ref<number[]>([])

// ============================================================================
// DATOS
// ============================================================================

const categories = ref([
  { id: 'all', name: 'Todas' },
  { id: 'tournaments', name: 'Torneos' },
  { id: 'account', name: 'Cuenta' },
  { id: 'payments', name: 'Pagos' },
  { id: 'technical', name: 'Técnico' }
])

const faqs = ref([
  {
    id: 1,
    category: 'tournaments',
    question: '¿Cómo me registro para un torneo?',
    answer: 'Para registrarte en un torneo, primero debes crear una cuenta en MYKD. Luego, visita la página del torneo que te interese y haz clic en el botón "Registrarse". Asegúrate de leer las reglas y requisitos antes de confirmar tu participación.'
  },
  {
    id: 2,
    category: 'tournaments',
    question: '¿Puedo cancelar mi registro en un torneo?',
    answer: 'Sí, puedes cancelar tu registro hasta 24 horas antes del inicio del torneo. Después de este período, no se permiten cancelaciones. Para cancelar, ve a tu perfil y encuentra el torneo en la sección "Mis Torneos".'
  },
  {
    id: 3,
    category: 'account',
    question: '¿Cómo cambio mi nombre de usuario?',
    answer: 'Puedes cambiar tu nombre de usuario una vez cada 30 días. Ve a la configuración de tu perfil, encuentra la sección "Información personal" y actualiza tu nombre de usuario. Ten en cuenta que algunos nombres pueden no estar disponibles.'
  },
  {
    id: 4,
    category: 'payments',
    question: '¿Cuándo recibo mis premios?',
    answer: 'Los premios se procesan automáticamente dentro de 48 horas después de que termine el torneo. Recibirás una notificación por email cuando tu premio esté disponible. Los pagos se realizan a través del método que hayas configurado en tu perfil.'
  },
  {
    id: 5,
    category: 'technical',
    question: '¿Qué requisitos técnicos necesito?',
    answer: 'Los requisitos varían según el juego. En general, necesitas una conexión a internet estable, el juego instalado y actualizado, y cumplir con los requisitos mínimos del sistema. Revisa la página específica de cada torneo para conocer los requisitos exactos.'
  },
  {
    id: 6,
    category: 'tournaments',
    question: '¿Qué pasa si pierdo mi conexión durante un partido?',
    answer: 'Si pierdes la conexión durante un partido oficial, tienes un máximo de 5 minutos para reconectarte. Si no puedes reconectarte en ese tiempo, el partido se otorgará a tu oponente. Para partidos de equipo, se pueden hacer pausas acordadas entre ambos equipos.'
  },
  {
    id: 7,
    category: 'account',
    question: '¿Cómo verifico mi cuenta?',
    answer: 'Para verificar tu cuenta, ve a la configuración de perfil y proporciona un documento de identidad válido. La verificación es obligatoria para participar en torneos con premios en efectivo y puede tomar hasta 24 horas en procesarse.'
  },
  {
    id: 8,
    category: 'payments',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito y débito, PayPal, transferencias bancarias y varios métodos de pago digital locales. También puedes recibir premios a través de estos mismos métodos.'
  }
])

// ============================================================================
// COMPUTED
// ============================================================================

const filteredFaqs = computed(() => {
  let filtered = faqs.value

  // Filtrar por categoría
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(faq => faq.category === selectedCategory.value)
  }

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(faq => 
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    )
  }

  return filtered
})

// ============================================================================
// METHODS
// ============================================================================

const toggleFaq = (faqId: number) => {
  const index = openFaqs.value.indexOf(faqId)
  if (index > -1) {
    openFaqs.value.splice(index, 1)
  } else {
    openFaqs.value.push(faqId)
  }
}
</script>

<style scoped>
/* ============================================================================
   ESTILOS ESPECÍFICOS DE LA PÁGINA FAQ
   ============================================================================ */

/* Transition Styles */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* FAQ Card Hover Effects */
.faq-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(69, 248, 130, 0.1);
}

/* Search Input Focus */
.search-input:focus {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(69, 248, 130, 0.1);
}

/* Category Button Active State */
.category-active {
  background: linear-gradient(135deg, #45f882 0%, #3ad66d 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(69, 248, 130, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .contact-buttons {
    flex-direction: column;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active,
  .faq-card:hover,
  .search-input:focus {
    transition: none;
    transform: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .faq-card {
    border: 2px solid #ffffff;
  }
  
  .category-button {
    border: 1px solid #ffffff;
  }
  
  .search-input {
    border: 2px solid #ffffff;
  }
}

/* Loading State */
.loading-skeleton {
  background: linear-gradient(90deg, rgb(55 65 81) 25%, rgb(75 85 99) 50%, rgb(55 65 81) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
