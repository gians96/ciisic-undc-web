<!-- ============================================================================
     PÁGINA LOGIN - INICIAR SESIÓN
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="bg-secondary-800 rounded-2xl shadow-2xl p-8">
        <!-- Logo y Título -->
        <div class="text-center mb-8">
          <NuxtLink to="/" class="inline-block mb-6">
            <NuxtImg
              src="/images/logo/logo.png"
              alt="MYKD Logo"
              width="120"
              height="40"
              class="h-10 w-auto mx-auto"
            />
          </NuxtLink>
          <h1 class="text-3xl font-bold text-white mb-2">Iniciar Sesión</h1>
          <p class="text-gray-300">Accede a tu cuenta MYKD</p>
        </div>

        <!-- Formulario de Login -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              placeholder="tu@email.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 bg-secondary-700 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Icon 
                  :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" 
                  class="h-5 w-5" 
                />
              </button>
            </div>
          </div>

          <!-- Remember Me y Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="form.remember"
                type="checkbox"
                class="w-4 h-4 text-primary bg-secondary-700 border-secondary-600 rounded focus:ring-primary focus:ring-2"
              />
              <span class="ml-2 text-sm text-gray-300">Recordarme</span>
            </label>
            <NuxtLink
              to="/forgot-password"
              class="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </NuxtLink>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Icon v-if="isLoading" name="heroicons:arrow-path" class="h-5 w-5 animate-spin mr-2" />
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="my-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-secondary-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-secondary-800 text-gray-400">O continúa con</span>
            </div>
          </div>
        </div>

        <!-- Social Login -->
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="loginWithProvider('google')"
            class="flex items-center justify-center px-4 py-3 bg-secondary-700 hover:bg-secondary-600 text-white rounded-lg transition-colors duration-300"
          >
            <Icon name="simple-icons:google" class="h-5 w-5 mr-2" />
            Google
          </button>
          <button
            @click="loginWithProvider('discord')"
            class="flex items-center justify-center px-4 py-3 bg-secondary-700 hover:bg-secondary-600 text-white rounded-lg transition-colors duration-300"
          >
            <Icon name="simple-icons:discord" class="h-5 w-5 mr-2" />
            Discord
          </button>
        </div>

        <!-- Register Link -->
        <div class="mt-8 text-center">
          <p class="text-gray-300">
            ¿No tienes una cuenta?
            <NuxtLink 
              to="/register"
              class="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
            >
              Regístrate aquí
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
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
  title: 'Iniciar Sesión | VII CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Inicia sesión en tu cuenta VII CIISIC para acceder a más funcionalidades.'
    },
    {
      property: 'og:title',
      content: 'Iniciar Sesión | VII CIISIC'
    },
    {
      property: 'og:description',
      content: 'Inicia sesión en tu cuenta VII CIISIC para acceder al panel administrativo.'
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
  email: '',
  password: '',
  remember: false
})

const isLoading = ref(false)
const showPassword = ref(false)

// ============================================================================
// METHODS
// ============================================================================

const handleLogin = async () => {
  if (isLoading.value) return

  // Validación básica
  if (!form.email || !form.password) {
    layoutStore.showError('Por favor completa todos los campos', 'Error de validación')
    return
  }

  isLoading.value = true

  try {
    // Aquí iría la lógica de autenticación real
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    layoutStore.showSuccess('¡Bienvenido de vuelta!', 'Inicio de sesión exitoso')
    
    // Redirigir al dashboard o página principal
    await navigateTo('/')
    
  } catch (error) {
    layoutStore.showError(
      'Credenciales incorrectas. Por favor verifica tu email y contraseña.',
      'Error de autenticación'
    )
  } finally {
    isLoading.value = false
  }
}

const loginWithProvider = async (provider: string) => {
  try {
    layoutStore.showInfo(`Redirigiendo a ${provider}...`, 'Autenticación')
    
    // Aquí iría la lógica de OAuth
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    layoutStore.showError(
      `Error al conectar con ${provider}. Inténtalo de nuevo.`,
      'Error de conexión'
    )
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Focus en el campo email al cargar
  nextTick(() => {
    const emailInput = document.getElementById('email')
    if (emailInput) {
      emailInput.focus()
    }
  })
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS ESPECÍFICOS DE LA PÁGINA LOGIN
   ============================================================================ */

/* Form Input Focus Effects */
.form-input:focus {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(69, 248, 130, 0.1);
}

/* Login Card Animation */
.login-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Button Hover Effects */
.submit-btn {
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:hover::before {
  left: 100%;
}

/* Social Button Hover */
.social-btn {
  position: relative;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Password Toggle Button */
.password-toggle {
  transition: all 0.2s ease;
}

.password-toggle:hover {
  transform: scale(1.1);
}

/* Checkbox Custom Styling */
input[type="checkbox"]:checked {
  background-color: #45f882;
  border-color: #45f882;
}

/* Link Hover Effects */
.auth-link {
  position: relative;
}

.auth-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #45f882;
  transition: width 0.3s ease;
}

.auth-link:hover::after {
  width: 100%;
}

/* Background Gradient */
.login-background {
  background: 
    radial-gradient(circle at 20% 80%, rgba(69, 248, 130, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(69, 248, 130, 0.05) 0%, transparent 50%);
}

/* Loading Spinner */
.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-card {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .social-buttons {
    grid-template-columns: 1fr;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .login-card,
  .form-input:focus,
  .social-btn:hover,
  .password-toggle:hover,
  .submit-btn::before {
    animation: none;
    transform: none;
    transition: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .form-input,
  .submit-btn,
  .social-btn {
    border: 2px solid #ffffff;
  }
  
  .form-input:focus {
    border-color: #45f882;
    box-shadow: 0 0 0 2px #45f882;
  }
}

/* Dark Mode Specific */
@media (prefers-color-scheme: dark) {
  .form-input::placeholder {
    color: rgb(156 163 175);
  }
  
  .divider {
    border-color: rgb(75 85 99);
  }
}

/* Error States */
.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.form-input.error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
}
</style>
