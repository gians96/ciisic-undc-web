<!-- ============================================================================
     PÁGINA CONTACT - CONTACTO
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900">
    <!-- Hero Section -->
    <section class="py-20 lg:py-32">
      <div class="custom-container">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6">
            Contáctanos
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            ¿Tienes una pregunta, sugerencia o quieres formar parte del equipo MYKD? 
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
                    class="w-full px-4 py-3 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Tu nombre"
                  />
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
                    class="w-full px-4 py-3 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Tu apellido"
                  />
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
                  class="w-full px-4 py-3 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label for="subject" class="block text-sm font-medium text-gray-300 mb-2">
                  Asunto *
                </label>
                <select
                  id="subject"
                  v-model="form.subject"
                  required
                  class="w-full px-4 py-3 bg-secondary-800 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="general">Consulta General</option>
                  <option value="tournament">Torneos</option>
                  <option value="partnership">Patrocinios</option>
                  <option value="technical">Soporte Técnico</option>
                  <option value="press">Prensa</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label for="message" class="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="6"
                  required
                  class="w-full px-4 py-3 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-4 px-8 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="h-5 w-5 animate-spin mr-2" />
                {{ isSubmitting ? 'Enviando...' : 'Enviar Mensaje' }}
              </button>
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
                  <p class="text-gray-300">info@mykd.com</p>
                  <p class="text-gray-300">support@mykd.com</p>
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
                  <p class="text-gray-300">Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                  <p class="text-gray-300">Sábados: 10:00 AM - 4:00 PM</p>
                  <p class="text-gray-300">Domingos: Cerrado</p>
                </div>
              </div>

              <!-- FAQ Link -->
              <div class="bg-secondary-800 rounded-xl p-6">
                <h3 class="text-white font-semibold mb-2">¿Buscas respuestas rápidas?</h3>
                <p class="text-gray-300 mb-4">
                  Revisa nuestras preguntas frecuentes para encontrar soluciones inmediatas.
                </p>
                <NuxtLink 
                  to="/faq"
                  class="inline-flex items-center text-primary hover:text-primary/80 font-semibold"
                >
                  Ver FAQ
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

import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'

// ============================================================================
// STORES
// ============================================================================

const layoutStore = useLayoutStore()

// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Contacto - MYKD',
  meta: [
    {
      name: 'description',
      content: 'Contáctanos para resolver tus dudas sobre MYKD. Soporte técnico, patrocinios, torneos y más. Estamos aquí para ayudarte.'
    },
    {
      property: 'og:title',
      content: 'Contacto - MYKD'
    },
    {
      property: 'og:description',
      content: 'Contáctanos para resolver tus dudas sobre MYKD. Soporte técnico, patrocinios, torneos y más.'
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

const isSubmitting = ref(false)

// ============================================================================
// COMPUTED
// ============================================================================

const socialLinks = computed(() => [
  {
    platform: 'Discord',
    url: 'https://discord.gg/mykd',
    icon: 'simple-icons:discord'
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/mykd',
    icon: 'simple-icons:twitter'
  },
  {
    platform: 'YouTube',
    url: 'https://youtube.com/mykd',
    icon: 'simple-icons:youtube'
  },
  {
    platform: 'Twitch',
    url: 'https://twitch.tv/mykd',
    icon: 'simple-icons:twitch'
  },
  {
    platform: 'Instagram',
    url: 'https://instagram.com/mykd',
    icon: 'simple-icons:instagram'
  }
])

// ============================================================================
// METHODS
// ============================================================================

const submitForm = async () => {
  if (isSubmitting.value) return

  // Validar campos requeridos
  if (!form.firstName || !form.lastName || !form.email || !form.subject || !form.message) {
    layoutStore.showError('Por favor completa todos los campos requeridos', 'Formulario')
    return
  }

  isSubmitting.value = true

  try {
    // Aquí iría la lógica para enviar el formulario
    // Por ahora simulamos una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    layoutStore.showSuccess(
      `¡Gracias ${form.firstName}! Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.`,
      'Mensaje Enviado'
    )
    
    // Limpiar formulario
    Object.keys(form).forEach(key => {
      form[key as keyof typeof form] = ''
    })
    
  } catch (error) {
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
  // Focus en el primer campo del formulario
  nextTick(() => {
    const firstInput = document.getElementById('firstName')
    if (firstInput) {
      firstInput.focus()
    }
  })
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
</style>
