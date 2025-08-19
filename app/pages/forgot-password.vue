<!-- ============================================================================
     PÁGINA DE RESTABLECIMIENTO DE CONTRASEÑA
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block mb-6">
          <div class="h-12 w-32 bg-primary rounded-lg flex items-center justify-center">
            <span class="text-black font-bold text-xl">MYKD</span>
          </div>
        </NuxtLink>
        <h2 class="text-3xl font-bold text-white mb-2">Restablecer Contraseña</h2>
        <p class="text-gray-400">
          {{ step === 'email' ? 'Ingresa tu correo electrónico para recibir instrucciones' : 'Revisa tu correo electrónico' }}
        </p>
      </div>

      <!-- Step 1: Email Form -->
      <div v-if="step === 'email'" class="space-y-6">
        <form @submit.prevent="handleResetRequest" class="space-y-6">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              placeholder="tu@email.com"
              :disabled="isLoading"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !email"
            class="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            <Icon v-if="isLoading" name="heroicons:arrow-path" class="h-5 w-5 mr-2 animate-spin" />
            {{ isLoading ? 'Enviando...' : 'Enviar Instrucciones' }}
          </button>
        </form>

        <!-- Back to Login -->
        <div class="text-center">
          <NuxtLink 
            to="/login" 
            class="text-primary hover:underline font-medium flex items-center justify-center"
          >
            <Icon name="heroicons:arrow-left" class="h-4 w-4 mr-2" />
            Volver al Inicio de Sesión
          </NuxtLink>
        </div>
      </div>

      <!-- Step 2: Email Sent Confirmation -->
      <div v-else-if="step === 'sent'" class="text-center space-y-6">
        <!-- Success Icon -->
        <div class="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
          <Icon name="heroicons:envelope-open" class="h-8 w-8 text-primary" />
        </div>

        <!-- Message -->
        <div class="space-y-4">
          <h3 class="text-xl font-semibold text-white">Correo Enviado</h3>
          <p class="text-gray-300 leading-relaxed">
            Hemos enviado un enlace de restablecimiento de contraseña a 
            <span class="text-primary font-medium">{{ email }}</span>
          </p>
          <p class="text-sm text-gray-400">
            Si no recibes el correo en los próximos minutos, revisa tu carpeta de spam.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="handleResendEmail"
            :disabled="resendCooldown > 0"
            class="w-full bg-secondary-800 hover:bg-secondary-700 disabled:bg-secondary-800/50 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            <Icon v-if="isResending" name="heroicons:arrow-path" class="h-5 w-5 mr-2 animate-spin" />
            {{ isResending ? 'Reenviando...' : resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar Correo' }}
          </button>
          
          <NuxtLink 
            to="/login" 
            class="w-full block bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300 text-center"
          >
            Volver al Inicio de Sesión
          </NuxtLink>
        </div>

        <!-- Change Email -->
        <button
          @click="step = 'email'"
          class="text-gray-400 hover:text-primary text-sm transition-colors duration-300"
        >
          ¿Usar un correo diferente?
        </button>
      </div>

      <!-- Step 3: Reset Form (if token is provided) -->
      <div v-else-if="step === 'reset'" class="space-y-6">
        <form @submit.prevent="handlePasswordReset" class="space-y-6">
          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-2">
              Nueva Contraseña
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="Mínimo 8 caracteres"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Icon :name="showNewPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5" />
              </button>
            </div>
            <!-- Password Strength Indicator -->
            <div class="mt-2">
              <div class="flex space-x-1">
                <div 
                  v-for="n in 4" 
                  :key="n"
                  class="flex-1 h-1 rounded"
                  :class="getPasswordStrengthColor(n)"
                ></div>
              </div>
              <p class="text-xs text-gray-400 mt-1">{{ passwordStrengthText }}</p>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
              Confirmar Nueva Contraseña
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="Repite tu nueva contraseña"
                :disabled="isLoading"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Icon :name="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5" />
              </button>
            </div>
            <!-- Password Match Indicator -->
            <p 
              v-if="confirmPassword" 
              class="text-xs mt-1"
              :class="newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'"
            >
              {{ newPassword === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden' }}
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword"
            class="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            <Icon v-if="isLoading" name="heroicons:arrow-path" class="h-5 w-5 mr-2 animate-spin" />
            {{ isLoading ? 'Actualizando...' : 'Actualizar Contraseña' }}
          </button>
        </form>
      </div>

      <!-- Security Tips -->
      <div class="mt-8 bg-secondary-800 rounded-lg p-6">
        <h4 class="text-sm font-semibold text-white mb-3 flex items-center">
          <Icon name="heroicons:shield-check" class="h-4 w-4 mr-2 text-primary" />
          Consejos de Seguridad
        </h4>
        <ul class="text-xs text-gray-400 space-y-1">
          <li>• Usa una contraseña única que no hayas usado en otros sitios</li>
          <li>• Incluye una combinación de letras, números y símbolos</li>
          <li>• Evita información personal como nombres o fechas</li>
          <li>• Considera usar un gestor de contraseñas</li>
        </ul>
      </div>

      <!-- Help Link -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          ¿Necesitas ayuda?
          <NuxtLink to="/contact" class="text-primary hover:underline ml-1">
            Contacta nuestro soporte
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Restablecer Contraseña - MYKD',
  meta: [
    {
      name: 'description',
      content: 'Restablece tu contraseña de MYKD de forma segura. Recibe instrucciones por correo electrónico.'
    }
  ]
})

// ============================================================================
// ESTADO LOCAL
// ============================================================================

const route = useRoute()
const router = useRouter()

const step = ref<'email' | 'sent' | 'reset'>('email')
const isLoading = ref(false)
const isResending = ref(false)
const resendCooldown = ref(0)

// Email step
const email = ref('')

// Reset step
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// ============================================================================
// COMPUTED
// ============================================================================

const passwordStrength = computed(() => {
  const password = newPassword.value
  let strength = 0
  
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z\d]/.test(password)) strength++
  
  return strength
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  const texts = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte']
  return texts[strength] || 'Muy débil'
})

// ============================================================================
// METHODS
// ============================================================================

const getPasswordStrengthColor = (index: number) => {
  const strength = passwordStrength.value
  if (index <= strength) {
    if (strength <= 1) return 'bg-red-500'
    if (strength <= 2) return 'bg-yellow-500'
    if (strength <= 3) return 'bg-blue-500'
    return 'bg-green-500'
  }
  return 'bg-secondary-600'
}

const handleResetRequest = async () => {
  try {
    isLoading.value = true
    
    // Simular envío de correo
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    step.value = 'sent'
    startResendCooldown()
    
  } catch (error) {
    alert('Error al enviar el correo. Por favor, inténtalo de nuevo.')
  } finally {
    isLoading.value = false
  }
}

const handleResendEmail = async () => {
  try {
    isResending.value = true
    
    // Simular reenvío
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    startResendCooldown()
    
  } catch (error) {
    alert('Error al reenviar el correo. Por favor, inténtalo de nuevo.')
  } finally {
    isResending.value = false
  }
}

const handlePasswordReset = async () => {
  try {
    isLoading.value = true
    
    if (newPassword.value !== confirmPassword.value) {
      throw new Error('Las contraseñas no coinciden')
    }
    
    if (newPassword.value.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres')
    }
    
    // Simular actualización de contraseña
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('¡Contraseña actualizada exitosamente!')
    await router.push('/login')
    
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Error al actualizar la contraseña')
  } finally {
    isLoading.value = false
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Check if there's a reset token in the URL
  const token = route.query.token as string
  if (token) {
    step.value = 'reset'
  }
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS ESPECÍFICOS DE LA PÁGINA DE RESTABLECIMIENTO
   ============================================================================ */

/* Form Animation */
form {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success Animation */
.success-icon {
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Input Focus Effects */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(69, 248, 130, 0.1);
}

/* Button Hover Effects */
button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(69, 248, 130, 0.2);
}

/* Password Strength Animation */
.password-strength-bar {
  transition: all 0.3s ease;
}

/* Loading States */
.loading-button {
  position: relative;
  overflow: hidden;
}

.loading-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(69, 248, 130, 0.1),
    transparent
  );
  animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Security Tips */
.security-tips {
  background: linear-gradient(135deg, rgb(55 65 81) 0%, rgb(75 85 99) 100%);
}

/* Responsive Design */
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  input,
  button {
    border-width: 2px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  form,
  .success-icon,
  input:focus,
  button:hover,
  .loading-button::after {
    animation: none;
    transform: none;
  }
}
</style>
