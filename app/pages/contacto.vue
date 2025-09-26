<!-- ============================================================================
     PÁGINA CONTACT - CONTACTO
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900">
    <!-- Hero Section -->
    <section class="py-20 lg:py-32">
      <div class="custom-container">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-4">
            Contáctanos
          </h1>
          <p class="text-xl text-gray-300 mb-2">
            ¿Tienes una pregunta, sugerencia o quieres formar parte del VII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica? 
            Estamos aquí para ayudarte.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="pb-20">
      <div class="custom-container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <!-- Contact Form -->
          <div>
            <h2 class="text-3xl font-bold text-white mb-8">Envíanos un Mensaje</h2>
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    :class="[
                      'w-full px-4 py-3 bg-secondary-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300',
                      errors.firstName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-secondary-600 focus:border-primary focus:ring-primary/20'
                    ]"
                    placeholder="Tu nombre"
                    @input="validateOnInput('firstName', form.firstName)"
                    @blur="validateField('firstName', form.firstName)"
                  />
                  <p v-if="errors.firstName" class="mt-1 text-sm text-red-500 flex items-center">
                    <Icon name="heroicons:exclamation-circle" class="h-4 w-4 mr-1" />
                    {{ errors.firstName }}
                  </p>
                </div>
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-300 mb-2">
                    Apellido *
                  </label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    :class="[
                      'w-full px-4 py-3 bg-secondary-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300',
                      errors.lastName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-secondary-600 focus:border-primary focus:ring-primary/20'
                    ]"
                    placeholder="Tu apellido"
                    @input="validateOnInput('lastName', form.lastName)"
                    @blur="validateField('lastName', form.lastName)"
                  />
                  <p v-if="errors.lastName" class="mt-1 text-sm text-red-500 flex items-center">
                    <Icon name="heroicons:exclamation-circle" class="h-4 w-4 mr-1" />
                    {{ errors.lastName }}
                  </p>
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  :class="[
                    'w-full px-4 py-3 bg-secondary-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300',
                    errors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-secondary-600 focus:border-primary focus:ring-primary/20'
                  ]"
                  placeholder="tu@email.com"
                  @input="validateOnInput('email', form.email)"
                  @blur="validateField('email', form.email)"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-500 flex items-center">
                  <Icon name="heroicons:exclamation-circle" class="h-4 w-4 mr-1" />
                  {{ errors.email }}
                </p>
              </div>

              <div>
                <label for="subject" class="block text-sm font-medium text-gray-300 mb-2">
                  Asunto *
                </label>
                <select
                  id="subject"
                  v-model="form.subject"
                  required
                  :class="[
                    'w-full px-4 py-3 bg-secondary-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all duration-300',
                    errors.subject 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-secondary-600 focus:border-primary focus:ring-primary/20'
                  ]"
                  @change="validateField('subject', form.subject)"
                  @blur="validateField('subject', form.subject)"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="general">Consulta General</option>
                  <option value="torneos">Torneos</option>
                  <option value="ponencias">Ponencias</option>
                  <option value="patrocinios">Patrocinios</option>
                  <option value="soporte">Soporte</option>
                  <option value="otros">Otros</option>
                </select>
                <p v-if="errors.subject" class="mt-1 text-sm text-red-500 flex items-center">
                  <Icon name="heroicons:exclamation-circle" class="h-4 w-4 mr-1" />
                  {{ errors.subject }}
                </p>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje *
                  <span class="text-xs text-gray-400 ml-1">({{ form.message.length }}/1000)</span>
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="6"
                  required
                  :class="[
                    'w-full px-4 py-3 bg-secondary-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 resize-none',
                    errors.message 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-secondary-600 focus:border-primary focus:ring-primary/20'
                  ]"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                  maxlength="1000"
                  @input="validateOnInput('message', form.message)"
                  @blur="validateField('message', form.message)"
                ></textarea>
                <p v-if="errors.message" class="mt-1 text-sm text-red-500 flex items-center">
                  <Icon name="heroicons:exclamation-circle" class="h-4 w-4 mr-1" />
                  {{ errors.message }}
                </p>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting || isBlocked"
                :class="[
                  'w-full font-semibold py-4 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center',
                  isBlocked 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90 text-black disabled:opacity-50 disabled:cursor-not-allowed'
                ]"
              >
                <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="h-5 w-5 animate-spin mr-2" />
                <Icon v-else-if="isBlocked" name="heroicons:clock" class="h-5 w-5 mr-2" />
                
                <span v-if="isBlocked">
                  Espera {{ formatRemainingTime() }} para enviar otro mensaje
                </span>
                <span v-else-if="isSubmitting">
                  Enviando...
                </span>
                <span v-else>
                  Enviar Mensaje
                </span>
              </button>

              <!-- Alerta de cooldown -->
              <div v-if="isBlocked" class="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div class="flex items-center">
                  <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-yellow-500 mr-2" />
                  <div>
                    <p class="text-yellow-400 font-medium text-sm">Límite de envío alcanzado</p>
                    <p class="text-yellow-300 text-xs mt-1">
                      Para evitar spam, solo puedes enviar un mensaje cada 30 minutos. 
                      Tiempo restante: <span class="font-mono font-bold cooldown-timer">{{ formatRemainingTime() }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Contact Info -->
          <div>
            <h2 class="text-3xl font-bold text-white mb-8">Información de Contacto</h2>
            <div class="space-y-8">
              <!-- Email -->
              <div class="flex items-start">
                <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Icon name="heroicons:envelope" class="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Email</h3>
                  <p class="text-gray-300">congreso@undc.edu.pe</p>
                </div>
              </div>

              <!-- Social Media -->
              <div class="flex items-start">
                <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Icon name="heroicons:share" class="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-4">Redes Sociales</h3>
                  <div class="flex space-x-4">
                    <a
                      v-for="social in socialLinks"
                      :key="social.platform"
                      :href="social.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-10 h-10 bg-secondary-700 hover:bg-primary text-gray-400 hover:text-black rounded-lg flex items-center justify-center transition-all duration-300"
                      :aria-label="`Síguenos en ${social.platform}`"
                    >
                      <Icon :name="social.icon" class="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              <!-- Hours -->
              <div class="flex items-start">
                <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Icon name="heroicons:clock" class="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Horarios de Atención</h3>
                  <p class="text-gray-300">Lunes a Viernes: 8:00 AM - 05:00 PM</p>
                </div>
              </div>

              <!-- FAQ Link -->
              <div class="bg-secondary-800 rounded-xl p-6">
                <h3 class="text-white font-semibold mb-2">¿Buscas respuestas rápidas?</h3>
                <p class="text-gray-300 mb-4">
                  Revisa nuestras preguntas frecuentes para encontrar soluciones inmediatas.
                </p>
                <NuxtLink 
                  to="/preguntas"
                  class="inline-flex items-center text-primary hover:text-primary/80 font-semibold"
                >
                  Revisar preguntas frecuentes
                  <Icon name="heroicons:arrow-right" class="h-4 w-4 ml-2" />
                </NuxtLink>
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

import { useLayoutStore } from '~/stores/layout'

// ============================================================================
// STORES
// ============================================================================

const layoutStore = useLayoutStore()

// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Contacto | VII CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Contáctanos para resolver tus dudas sobre el VII CIISIC. Soporte técnico, patrocinios, torneos y más. Estamos aquí para ayudarte.'
    },
    {
      property: 'og:title',
      content: 'Contacto | VII CIISIC'
    },
    {
      property: 'og:description',
      content: 'Contáctanos para resolver tus dudas sobre el VII CIISIC. Soporte técnico, patrocinios, torneos y más.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// ============================================================================
// ESTADO LOCAL
// ============================================================================

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const lastSubmissionTime = ref<number | null>(null)
const remainingTime = ref(0)
const isBlocked = ref(false)

// Timer para actualizar el tiempo restante
let timer: NodeJS.Timeout | null = null

// ============================================================================
// COMPUTED
// ============================================================================

const socialLinks = computed(() => [
  {
    platform: 'Facebook',
    url: 'https://facebook.com/fiundc',
    icon: 'simple-icons:facebook'
  },
  {
    platform: 'TikTok',
    url: 'https://tiktok.com/@fiundc',
    icon: 'simple-icons:tiktok'
  }
])

// ============================================================================
// METHODS
// ============================================================================

// Función debounce para optimizar validaciones
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Constante para el tiempo de espera (30 minutos en milisegundos)
const COOLDOWN_TIME = 30 * 60 * 1000 // 30 minutos

// Función para comprobar si está en cooldown
const checkCooldown = () => {
  if (process.client) {
    const lastTime = localStorage.getItem('lastContactSubmission')
    if (lastTime) {
      const timeDiff = Date.now() - parseInt(lastTime)
      if (timeDiff < COOLDOWN_TIME) {
        lastSubmissionTime.value = parseInt(lastTime)
        remainingTime.value = Math.ceil((COOLDOWN_TIME - timeDiff) / 1000)
        isBlocked.value = true
        startCountdown()
        return true
      } else {
        // Limpiar localStorage si ya pasó el tiempo
        localStorage.removeItem('lastContactSubmission')
      }
    }
  }
  return false
}

// Función para iniciar la cuenta regresiva
const startCountdown = () => {
  if (timer) clearInterval(timer)
  
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      isBlocked.value = false
      if (timer) clearInterval(timer)
      if (process.client) {
        localStorage.removeItem('lastContactSubmission')
      }
    }
  }, 1000)
}

// Función para formatear tiempo restante
const formatRemainingTime = () => {
  const minutes = Math.floor(remainingTime.value / 60)
  const seconds = remainingTime.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Función para guardar timestamp del envío
const saveSubmissionTime = () => {
  if (process.client) {
    const now = Date.now()
    localStorage.setItem('lastContactSubmission', now.toString())
    lastSubmissionTime.value = now
    remainingTime.value = COOLDOWN_TIME / 1000
    isBlocked.value = true
    startCountdown()
  }
}

// Función para limpiar errores
const clearError = (field: string) => {
  errors[field as keyof typeof errors] = ''
}

// Función para validar email
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para validar un campo específico
const validateField = (field: string, value: string) => {
  switch (field) {
    case 'firstName':
      if (!value.trim()) {
        errors.firstName = 'El nombre es requerido'
      } else if (value.trim().length < 2) {
        errors.firstName = 'El nombre debe tener al menos 2 caracteres'
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        errors.firstName = 'El nombre solo puede contener letras'
      } else {
        errors.firstName = ''
      }
      break
    
    case 'lastName':
      if (!value.trim()) {
        errors.lastName = 'El apellido es requerido'
      } else if (value.trim().length < 2) {
        errors.lastName = 'El apellido debe tener al menos 2 caracteres'
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        errors.lastName = 'El apellido solo puede contener letras'
      } else {
        errors.lastName = ''
      }
      break
    
    case 'email':
      if (!value.trim()) {
        errors.email = 'El correo electrónico es requerido'
      } else if (!isValidEmail(value)) {
        errors.email = 'Ingresa un correo electrónico válido'
      } else {
        errors.email = ''
      }
      break
    
    case 'subject':
      if (!value) {
        errors.subject = 'Selecciona un asunto'
      } else {
        errors.subject = ''
      }
      break
    
    case 'message':
      if (!value.trim()) {
        errors.message = 'El mensaje es requerido'
      } else if (value.trim().length < 10) {
        errors.message = 'El mensaje debe tener al menos 10 caracteres'
      } else if (value.trim().length > 1000) {
        errors.message = 'El mensaje no puede exceder 1000 caracteres'
      } else {
        errors.message = ''
      }
      break
  }
}

// Función para validar todo el formulario
const validateForm = () => {
  validateField('firstName', form.firstName)
  validateField('lastName', form.lastName)
  validateField('email', form.email)
  validateField('subject', form.subject)
  validateField('message', form.message)
  
  return !Object.values(errors).some(error => error !== '')
}

// Validación con debounce para optimizar rendimiento
const debouncedValidateField = debounce(validateField, 300)

// Función para validar en tiempo real (solo en blur para evitar exceso de validaciones)
const validateOnInput = (field: string, value: string) => {
  // Solo validar si el campo tenía error previamente o si está vacío
  const fieldError = errors[field as keyof typeof errors]
  if (fieldError || !value.trim()) {
    debouncedValidateField(field, value)
  }
}

const submitForm = async () => {
  if (isSubmitting.value || isBlocked.value) return

  // Validar formulario completo
  if (!validateForm()) {
    layoutStore.showError('Por favor corrige los errores en el formulario', 'Formulario')
    return
  }

  isSubmitting.value = true

  try {
    // Preparar datos en formato JSON
    const formDmData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject,
      message: form.message.trim(),
      timestamp: new Date().toISOString(),
    }

    console.log(JSON.stringify(formDmData, null, 2))

    // Para copiar fácilmente el JSON
    if (process.client) {
      console.log('JSON para copiar:', JSON.stringify(formDmData))
    }

    // Aquí puedes enviar al API
    // const response = await $fetch('/api/contact', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(formData)
    // })

    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Guardar tiempo de envío para cooldown
    saveSubmissionTime()
    
    // Mostrar notificación pequeña de éxito
    layoutStore.showSuccess(
      `¡Gracias ${form.firstName}! Tu mensaje ha sido enviado correctamente.`,
      'Mensaje Enviado'
    )
    
    // Limpiar formulario y errores
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = ''
    })
    
  } catch (error) {
    console.error('Error al enviar formulario:', error)
    layoutStore.showError(
      'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.',
      'Error'
    )
  } finally {
    isSubmitting.value = false
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Comprobar cooldown al cargar la página
  checkCooldown()
  
  // Focus en el primer campo del formulario
  nextTick(() => {
    const firstInput = document.getElementById('firstName')
    if (firstInput) {
      firstInput.focus()
    }
  })
})

onUnmounted(() => {
  // Limpiar timer al desmontar componente
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS ESPECÍFICOS DE LA PÁGINA CONTACT
   ============================================================================ */

/* Form Styles */
.form-input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(69, 248, 130, 0.1);
}

.form-textarea {
  min-height: 120px;
}

/* Social Links Hover Effects */
.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(69, 248, 130, 0.2);
}

/* Contact Info Cards */
.contact-info-card {
  background: linear-gradient(135deg, rgb(55 65 81) 0%, rgb(75 85 99) 100%);
  border: 1px solid rgb(107 114 128);
}

.contact-info-card:hover {
  border-color: #45f882;
  transform: translateY(-2px);
}

/* Form Animation */
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

/* Responsive Design */
@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .social-links {
    justify-content: center;
  }
}

/* Accessibility */
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

/* High Contrast Mode */
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

/* Dark Mode Specific */
@media (prefers-color-scheme: dark) {
  .form-input::placeholder,
  .form-textarea::placeholder {
    color: rgb(156 163 175);
  }
}

/* Loading State */
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

/* Success/Error Messages */
.message-success {
  background: linear-gradient(135deg, #45f882 0%, #3ad66d 100%);
  color: #000000;
}

.message-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
}

/* Cooldown Timer Styles */
.cooldown-timer {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Blocked Button Animation */
button:disabled.bg-gray-600 {
  position: relative;
  overflow: hidden;
}

button:disabled.bg-gray-600::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
