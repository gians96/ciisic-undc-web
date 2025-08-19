<!-- ============================================================================
     PÁGINA DE REGISTRO
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
        <h2 class="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
        <p class="text-gray-400">Únete a la comunidad de gamers más activa</p>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- Personal Information -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
            Nombre de Usuario *
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="w-full px-4 py-3 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            placeholder="Elige un nombre único"
          />
          <p class="text-xs text-gray-500 mt-1">Mínimo 3 caracteres, solo letras, números y guiones</p>
        </div>

        <!-- Email -->
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

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Contraseña *
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-12 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
            >
              <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Contraseña *
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-12 bg-secondary-800 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              placeholder="Repite tu contraseña"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
            >
              <Icon :name="showConfirmPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Date of Birth -->
        <div>
          <label for="birthDate" class="block text-sm font-medium text-gray-300 mb-2">
            Fecha de Nacimiento *
          </label>
          <input
            id="birthDate"
            v-model="form.birthDate"
            type="date"
            required
            class="w-full px-4 py-3 bg-secondary-800 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          />
          <p class="text-xs text-gray-500 mt-1">Debes ser mayor de 13 años para registrarte</p>
        </div>

        <!-- Country -->
        <div>
          <label for="country" class="block text-sm font-medium text-gray-300 mb-2">
            País *
          </label>
          <select
            id="country"
            v-model="form.country"
            required
            class="w-full px-4 py-3 bg-secondary-800 border border-secondary-600 rounded-lg text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
          >
            <option value="">Selecciona tu país</option>
            <option value="AR">Argentina</option>
            <option value="BR">Brasil</option>
            <option value="CL">Chile</option>
            <option value="CO">Colombia</option>
            <option value="CR">Costa Rica</option>
            <option value="EC">Ecuador</option>
            <option value="ES">España</option>
            <option value="GT">Guatemala</option>
            <option value="HN">Honduras</option>
            <option value="MX">México</option>
            <option value="NI">Nicaragua</option>
            <option value="PA">Panamá</option>
            <option value="PE">Perú</option>
            <option value="PY">Paraguay</option>
            <option value="SV">El Salvador</option>
            <option value="UY">Uruguay</option>
            <option value="VE">Venezuela</option>
            <option value="US">Estados Unidos</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        <!-- Gaming Preferences -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-3">
            Juegos Favoritos (Opcional)
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label v-for="game in games" :key="game.id" class="flex items-center">
              <input
                v-model="form.favoriteGames"
                :value="game.id"
                type="checkbox"
                class="sr-only"
              />
              <div class="flex items-center cursor-pointer">
                <div class="w-5 h-5 border-2 border-secondary-600 rounded mr-3 flex items-center justify-center"
                     :class="form.favoriteGames.includes(game.id) ? 'bg-primary border-primary' : ''">
                  <Icon v-if="form.favoriteGames.includes(game.id)" name="heroicons:check" class="h-3 w-3 text-black" />
                </div>
                <span class="text-sm text-gray-300">{{ game.name }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-start">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="sr-only"
          />
          <label for="terms" class="flex items-start cursor-pointer">
            <div class="w-5 h-5 border-2 border-secondary-600 rounded mr-3 mt-0.5 flex items-center justify-center"
                 :class="form.acceptTerms ? 'bg-primary border-primary' : ''">
              <Icon v-if="form.acceptTerms" name="heroicons:check" class="h-3 w-3 text-black" />
            </div>
            <span class="text-sm text-gray-300">
              Acepto los 
              <NuxtLink to="/terms" class="text-primary hover:underline">Términos y Condiciones</NuxtLink>
              y la 
              <NuxtLink to="/privacy" class="text-primary hover:underline">Política de Privacidad</NuxtLink>
            </span>
          </label>
        </div>

        <!-- Newsletter -->
        <div class="flex items-start">
          <input
            id="newsletter"
            v-model="form.newsletter"
            type="checkbox"
            class="sr-only"
          />
          <label for="newsletter" class="flex items-start cursor-pointer">
            <div class="w-5 h-5 border-2 border-secondary-600 rounded mr-3 mt-0.5 flex items-center justify-center"
                 :class="form.newsletter ? 'bg-primary border-primary' : ''">
              <Icon v-if="form.newsletter" name="heroicons:check" class="h-3 w-3 text-black" />
            </div>
            <span class="text-sm text-gray-300">
              Quiero recibir noticias sobre torneos y novedades por correo electrónico
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <Icon v-if="isLoading" name="heroicons:arrow-path" class="h-5 w-5 mr-2 animate-spin" />
          {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-gray-400">
            ¿Ya tienes una cuenta?
            <NuxtLink to="/login" class="text-primary hover:underline font-medium ml-1">
              Iniciar Sesión
            </NuxtLink>
          </p>
        </div>
      </form>

      <!-- Social Registration -->
      <div class="mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-secondary-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-secondary-900 text-gray-400">O regístrate con</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            class="w-full inline-flex justify-center py-3 px-4 border border-secondary-600 rounded-lg bg-secondary-800 text-sm font-medium text-gray-300 hover:bg-secondary-700 transition-colors duration-300"
          >
            <Icon name="simple-icons:google" class="h-5 w-5" />
            <span class="ml-2">Google</span>
          </button>
          <button
            type="button"
            class="w-full inline-flex justify-center py-3 px-4 border border-secondary-600 rounded-lg bg-secondary-800 text-sm font-medium text-gray-300 hover:bg-secondary-700 transition-colors duration-300"
          >
            <Icon name="simple-icons:discord" class="h-5 w-5" />
            <span class="ml-2">Discord</span>
          </button>
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
  title: 'Registro - MYKD',
  meta: [
    {
      name: 'description',
      content: 'Únete a MYKD y forma parte de la comunidad de gaming más activa. Crea tu cuenta y participa en torneos épicos.'
    }
  ]
})

// ============================================================================
// INTERFACES
// ============================================================================

interface RegistrationForm {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  birthDate: string
  country: string
  favoriteGames: string[]
  acceptTerms: boolean
  newsletter: boolean
}

interface Game {
  id: string
  name: string
}

// ============================================================================
// ESTADO LOCAL
// ============================================================================

const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref<RegistrationForm>({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  country: '',
  favoriteGames: [],
  acceptTerms: false,
  newsletter: false
})

// ============================================================================
// DATOS
// ============================================================================

const games = ref<Game[]>([
  { id: 'lol', name: 'League of Legends' },
  { id: 'valorant', name: 'Valorant' },
  { id: 'csgo', name: 'CS:GO' },
  { id: 'fortnite', name: 'Fortnite' },
  { id: 'cod', name: 'Call of Duty' },
  { id: 'fifa', name: 'FIFA' },
  { id: 'apex', name: 'Apex Legends' },
  { id: 'rocket', name: 'Rocket League' }
])

// ============================================================================
// METHODS
// ============================================================================

const validateForm = () => {
  if (form.value.password !== form.value.confirmPassword) {
    throw new Error('Las contraseñas no coinciden')
  }

  if (form.value.password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres')
  }

  if (form.value.username.length < 3) {
    throw new Error('El nombre de usuario debe tener al menos 3 caracteres')
  }

  if (!form.value.acceptTerms) {
    throw new Error('Debes aceptar los términos y condiciones')
  }

  // Validar edad (mayor de 13 años)
  const birthDate = new Date(form.value.birthDate)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  
  if (age < 13) {
    throw new Error('Debes ser mayor de 13 años para registrarte')
  }
}

const handleRegister = async () => {
  try {
    isLoading.value = true
    
    // Validar formulario
    validateForm()
    
    // Simular registro (aquí iría la lógica real de registro)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mostrar mensaje de éxito y redirigir
    alert('¡Cuenta creada exitosamente! Revisa tu correo para verificar tu cuenta.')
    
    // Redirigir al login
    await navigateTo('/login')
    
  } catch (error) {
    alert(error instanceof Error ? error.message : 'Error al crear la cuenta')
  } finally {
    isLoading.value = false
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

// Proteger ruta si ya está logueado (comentado por ahora)
// definePageMeta({
//   middleware: 'guest'
// })
</script>

<style scoped>
/* ============================================================================
   ESTILOS ESPECÍFICOS DE LA PÁGINA DE REGISTRO
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

/* Input Focus Effects */
input:focus,
select:focus {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(69, 248, 130, 0.1);
}

/* Custom Checkbox Styling */
.custom-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.custom-checkbox input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.custom-checkbox .checkmark {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgb(75 85 99);
  border-radius: 0.25rem;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.custom-checkbox input:checked + .checkmark {
  background-color: rgb(69 248 130);
  border-color: rgb(69 248 130);
}

/* Button Hover Effects */
button {
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(69, 248, 130, 0.2);
}

/* Social Button Effects */
.social-button {
  position: relative;
  overflow: hidden;
}

.social-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(69 248 130);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-button:hover::before {
  opacity: 0.1;
}

/* Loading Animation */
.loading-button {
  position: relative;
}

.loading-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(69, 248, 130, 0.2);
  border-radius: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.loading-button.loading::after {
  opacity: 1;
}

/* Responsive Design */
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .games-grid {
    grid-template-columns: 1fr;
  }
  
  .social-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  input,
  select,
  button {
    border-width: 2px;
  }
  
  .custom-checkbox .checkmark {
    border-width: 2px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  form,
  input:focus,
  select:focus,
  button:hover {
    animation: none;
    transform: none;
  }
}
</style>
