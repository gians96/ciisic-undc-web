<!-- ============================================================================
     PÁGINA PAPERS
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
      <div class="custom-container relative">
        <div class="max-w-4xl mx-auto text-center" ref="heroRef">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6 fade-in-element">
            {{ papersHero.title.replace(papersHero.highlight, '') }}
            <span class="text-primary">{{ papersHero.highlight }}</span>
          </h1>
          <p class="text-xl text-gray-300 mb-8 leading-relaxed fade-in-element" style="animation-delay: 0.2s;">
            {{ papersHero.description }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center fade-in-element" style="animation-delay: 0.4s;">
            <NuxtLink v-for="(action, index) in papersHero.actions" :key="index" :to="action.to" :class="action.style">
              {{ action.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Papers Section (Formulario) -->
    <section class="pb-20 mt-16">
      <div class="custom-container">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-2">
          <!-- Columna 1: Card Call for Papers -->
          <div class="flex justify-center items-start col-span-12 lg:col-span-4">
            <div class="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden w-full flex flex-col gap-2">
              <!-- Header -->
              <div class="p-4 border-b border-slate-700">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center">
                    <span class="text-black font-bold text-lg">📄</span>
                  </div>
                  <div>
                    <p class="text-white text-base font-semibold">Call for Papers</p>
                    <p class="text-gray-400 text-xs">@Comité Científico</p>
                  </div>
                </div>
              </div>
              <div class="relative aspect-[4/3] bg-slate-700 flex items-center justify-center">
                <img src="/images/eventos/callforpaper.webp" alt="Call for Papers" class="w-full h-full object-cover" />
              </div>
              <div class="p-4 flex flex-col gap-1">
                <p class="text-xs text-gray-400 italic mt-1">
                  El Comité Organizador del VII CIISIC invita a investigadores, académicos y profesionales a presentar sus propuestas para este encuentro internacional que se llevará a cabo del 20 al 24 de octubre de 2025.
                </p>
              </div>
            </div>
          </div>
          <!-- Columna 2: Datos importantes -->
          <div class="flex items-center justify-center col-span-12 lg:col-span-8">
            <div class="p-8 flex flex-col gap-3 w-full">
            <div class="flex items-center gap-2 mb-2">
              <Icon name="mdi:star-circle-outline" class="h-8 w-8 text-primary" />
              <h2 class="text-2xl font-bold text-white tracking-tight">Datos Importantes</h2>
            </div>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li class="flex items-start gap-3">
                <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Icon name="mdi:file-document-edit-outline" class="h-7 w-7 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-1">Extensión</h3>
                  <p class="text-gray-300 text-sm">Entre 2500 y 3500 palabras por paper.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Icon name="mdi:account-multiple-outline" class="h-7 w-7 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-1">Máximo de autores</h3>
                  <p class="text-gray-300 text-sm">Hasta 4 autores por paper.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Icon name="mdi:language-markdown-outline" class="h-7 w-7 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-1">Idioma</h3>
                  <p class="text-gray-300 text-sm">Español o inglés.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Icon name="mdi:eye-off-outline" class="h-7 w-7 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-1">Revisión</h3>
                  <p class="text-gray-300 text-sm">Todos los trabajos serán revisados por pares ciegos.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Icon name="mdi:file-word-box-outline" class="h-7 w-7 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-1">Formato</h3>
                  <p class="text-gray-300 text-sm">El envío debe realizarse en formato Word o PDF.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Icon name="mdi:account-voice" class="h-7 w-7 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-1">Presentación</h3>
                  <p class="text-gray-300 text-sm">La presentación de los papers será presencial.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                  <Icon name="mdi:email-fast-outline" class="h-7 w-7 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-1">Contacto</h3>
                  <p class="text-gray-300 text-sm">congreso@undc.edu.pe</p>
                </div>
              </li>
            </ul>
          </div>
      </div>
      </div>
      </div>
    </section>

    <!-- Sección: Ejes Temáticos -->
    <section class="py-20 bg-secondary-800">
      <div class="custom-container">
        <h2 class="text-3xl font-bold text-white mb-12 text-center">Ejes Temáticos</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          <div v-for="(axis, idx) in thematicAxes" :key="idx" class="bg-secondary-900 rounded-xl p-6 flex flex-col items-center text-center shadow hover:shadow-lg transition-all duration-300">
            <div class="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
              <Icon :name="axis.icon" class="h-8 w-8 text-black" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">{{ axis.title }}</h3>
            <p class="text-gray-300 text-sm">{{ axis.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección: Línea de Tiempo -->
    <section class="py-20">
      <div class="custom-container">
        <h2 class="text-3xl font-bold text-white mb-12 text-center">Cronograma de Actividades</h2>
        <div class="flex flex-col md:flex-row md:justify-between items-center gap-10 md:gap-0 timeline">
          <div v-for="(event, idx) in timelineEvents" :key="idx" class="flex flex-col items-center relative md:w-1/5">
            <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3 z-10">
              <Icon :name="event.icon" class="h-7 w-7 text-black" />
            </div>
            <div class="bg-secondary-800 text-white rounded-lg px-4 py-2 text-center shadow mb-2">
              <div class="font-semibold">{{ event.title }}</div>
              <div class="text-xs text-gray-300">{{ event.date }}</div>
            </div>
            <div class="hidden md:block absolute top-6 right-0 w-full h-1 border-t-2 border-primary z-0"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Ejes temáticos
const thematicAxes = [
  { title: 'Inteligencia Artificial', icon: 'mdi:robot-outline', desc: 'Aplicaciones, ética y avances en IA.' },
  { title: 'Ciberseguridad', icon: 'mdi:shield-lock-outline', desc: 'Protección de datos, amenazas y soluciones.' },
  { title: 'Transformación Digital', icon: 'mdi:cloud-sync-outline', desc: 'Innovación en empresas y procesos.' },
  { title: 'Educación y TIC', icon: 'mdi:school-outline', desc: 'Tecnología en la enseñanza y aprendizaje.' },
  { title: 'Desarrollo de Software', icon: 'mdi:code-tags', desc: 'Metodologías, frameworks y casos de éxito.' },
  { title: 'Internet de las Cosas', icon: 'mdi:access-point-network', desc: 'IoT, dispositivos conectados y aplicaciones.' },
  { title: 'Emprendimiento Tecnológico', icon: 'mdi:lightbulb-on-outline', desc: 'Startups, innovación y modelos de negocio.' },
]

// Línea de tiempo
const timelineEvents = [
  { title: 'Apertura de convocatoria', date: '1 de agosto', icon: 'mdi:calendar-plus' },
  { title: 'Recepción de papers', date: '1 de agosto - 15 de septiembre', icon: 'mdi:file-upload-outline' },
  { title: 'Evaluación de papers', date: '16 de septiembre - 10 de octubre', icon: 'mdi:clipboard-check-outline' },
  { title: 'Notificación de aceptación', date: '15 de octubre', icon: 'mdi:email-check-outline' },
  { title: 'Presentación de papers', date: '24 de octubre', icon: 'mdi:account-voice' },
]

import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useLayoutStore } from '~/stores/layout'
const layoutStore = useLayoutStore()
// Hero Section data estilo About
const heroRef = ref(null)
const papersHero = {
  title: '¿Quieres presentar tu paper en el VII CISIC? ',
  highlight: 'Call for Papers',
  description: 'Comparte tu investigación, experiencia o proyecto con la comunidad académica y profesional.',
  actions: [
    { label: 'Registrar paper', to: 'https://google.com', style: 'btn-primary' },
    { label: 'Verificar bases', to: 'https://google.com', style: 'btn-secondary' }
  ]
}
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
onMounted(() => {
  nextTick(() => {
    observeElements()
  })
})
onUnmounted(() => {
  if (observer) observer.disconnect()
})

useHead({
  title: 'Call for Papers - CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Envía tu paper para participar en el VII CIISIC. Revisa los requisitos y fechas importantes.'
    },
    {
      property: 'og:title',
      content: 'Call for Papers  - CIISIC'
    },
    {
      property: 'og:description',
      content: 'Envía tu paper para participar en el VII CIISIC. Revisa los requisitos y fechas importantes.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  title: '',
  abstract: ''
})
const isSubmitting = ref(false)

const submitForm = async () => {
  if (isSubmitting.value) return
  if (!form.firstName || !form.lastName || !form.email || !form.title || !form.abstract) {
    layoutStore.showError('Por favor completa todos los campos requeridos', 'Formulario')
    return
  }
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    layoutStore.showSuccess(
      `¡Gracias ${form.firstName}! Tu ponencia ha sido enviada correctamente. Nos pondremos en contacto pronto.`,
      'Ponencia Enviada'
    )
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })
  } catch (error) {
    layoutStore.showError(
      'Hubo un error al enviar tu ponencia. Por favor intenta de nuevo.',
      'Error'
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>

/* =========================================================================
  ESTILOS 
  ========================================================================= */
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

.form-input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(69, 248, 130, 0.1);
}

.form-textarea {
  min-height: 120px;
}

.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(69, 248, 130, 0.2);
}

.contact-info-card {
  background: linear-gradient(135deg, rgb(55 65 81) 0%, rgb(75 85 99) 100%);
  border: 1px solid rgb(107 114 128);
}

.contact-info-card:hover {
  border-color: #45f882;
  transform: translateY(-2px);
}

.form-field {
  animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .social-links {
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .form-field,
  .social-link:hover,
  .contact-info-card:hover,
  .form-input:focus {
    animation: none;
    transform: none;
    transition: none;
  }
}

@media (prefers-contrast: high) {
  .form-input,
  .form-textarea,
  .form-select {
    border: 2px solid #ffffff;
  }
  .form-input:focus,
  .form-textarea:focus,
  .form-select:focus {
    border-color: #45f882;
    box-shadow: 0 0 0 2px #45f882;
  }
}

@media (prefers-color-scheme: dark) {
  .form-input::placeholder,
  .form-textarea::placeholder {
    color: rgb(156 163 175);
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}


</style>
