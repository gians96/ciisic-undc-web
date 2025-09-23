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
            Encuentra respuestas a las preguntas más comunes sobre el VII CIISIC 2025
          </p>
        </div>

        <!-- Search FAQ -->
        <div class="mb-12">
          <div class="relative">
            <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar información sobre el congreso..."
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
            Nuestro equipo organizador está aquí para ayudarte con cualquier pregunta sobre el congreso
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/contacto"
              class="bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Contactar Organización
            </NuxtLink>
            <a 
              href="mailto:congreso@undc.edu.pe"
              class="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Enviar Email
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
      content: 'Encuentra respuestas a las preguntas más frecuentes sobre el VII CIISIC 2025, ponentes, registro, pagos y más información del congreso.'
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
  { id: 'registro', name: 'Registro' },
  { id: 'ponentes', name: 'Ponentes' },
  { id: 'pagos', name: 'Pagos' },
  { id: 'evento', name: 'Evento' },
  { id: 'sede', name: 'Sede' }
])

const faqs = ref([
  {
    id: 1,
    category: 'registro',
    question: '¿Cómo me registro para el VII CIISIC 2025?',
    answer: 'Puedes registrarte a través de nuestra página web en la sección de registro. Solo necesitas completar el formulario con tus datos personales, seleccionar el tipo de inscripción y realizar el pago correspondiente. Una vez confirmado el pago, recibirás un email de confirmación con todos los detalles.'
  },
  {
    id: 2,
    category: 'ponentes',
    question: '¿Quiénes serán los ponentes del congreso?',
    answer: 'Contaremos con destacados expertos en sistemas de información, inteligencia artificial, ciberseguridad y tecnologías emergentes. Entre nuestros ponentes principales se encuentran reconocidos académicos y profesionales de la industria con amplia experiencia en investigación y desarrollo tecnológico. Puedes ver la lista completa en nuestra sección de ponentes.'
  },
  {
    id: 3,
    category: 'pagos',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos transferencias bancarias. Los precios varían según el tipo de inscripción.'
  },
  {
    id: 4,
    category: 'evento',
    question: '¿Cuándo y dónde se realizará el congreso?',
    answer: 'El VII CIISIC 2025 se realizará del 20 al 24 de octubre de 2025 en las instalaciones del Auditorio "Casa de la Cultura", en San Vicente de Cañete. El evento incluye conferencias magistrales, presentación de trabajos de investigación y networking académico y profesional.'
  },
  {
    id: 5,
    category: 'sede',
    question: '¿Cómo llego a la sede del evento?',
    answer: 'La Sede Académica "Casa de la Cultura" se encuentra en Av. Mariscal Benavides N° 1370 San Vicente - Cañete.'
  },
  {
    id: 6,
    category: 'registro',
    question: '¿Hasta cuándo puedo registrarme?',
    answer: 'Las inscripciones están abiertas hasta el 19 de octubre de 2025. Te recomendamos registrarte con anticipación para asegurar tu lugar para no perderte de este increíble evento.'
  },
  {
    id: 7,
    category: 'evento',
    question: '¿Qué incluye mi inscripción?',
    answer: 'Se incluyen diferentes beneficios según el tipo de inscripcion, lo puedes revisar en la sección de planes.'
  },
  {
    id: 8,
    category: 'ponentes',
    question: '¿Puedo presentar mi trabajo de investigación?',
    answer: 'Sí, aceptamos la presentación de trabajos de investigación en las modalidades de ponencia oral y poster. Las propuestas deben enviarse según cronograma indicado en la sección de Call for Papers. Todos los trabajos pasan por un proceso de evaluación por pares.'
  },
  {
    id: 9,
    category: 'evento',
    question: '¿Habrá modalidad virtual?',
    answer: 'El congreso es presencial, pero las conferencias magistrales principales serán transmitidas en vivo y quedarán disponibles en nuestra plataforma virtual para los participantes registrados. Los talleres prácticos y sesiones de networking son exclusivamente presenciales.'
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
