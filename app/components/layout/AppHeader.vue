<template>
  <header 
    id="header" 
    :class="headerClasses"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
  >
    <!-- Container Principal -->
    <div class="custom-container">
      <div class="flex items-center justify-between h-16 lg:h-20">
        
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="flex items-center space-x-2 group">
            <NuxtImg
              src="/images/logo/logo.png"
              alt="MYKD Logo"
              width="120"
              height="40"
              class="h-8 lg:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              loading="eager"
              format="webp"
            />
          </NuxtLink>
        </div>

        <!-- Navegación Principal (Desktop) -->
        <nav class="hidden lg:flex items-center space-x-8">
          <template v-for="item in mainNavigation" :key="item.id">
            <!-- Items sin hijos -->
            <NuxtLink
              v-if="!item.children"
              :to="item.href"
              :class="navLinkClasses(item.href)"
              class="relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-primary group"
            >
              {{ item.label }}
              <span 
                v-if="navigationStore.isActiveRoute(item.href)"
                class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-primary"
              />
            </NuxtLink>

            <!-- Items con dropdown -->
            <div 
              v-else
              class="relative group"
              @mouseenter="showDropdown(item.id)"
              @mouseleave="hideDropdown(item.id)"
            >
              <button
                :class="navLinkClasses(item.href)"
                class="flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-primary group"
              >
                {{ item.label }}
                <Icon 
                  name="heroicons:chevron-down" 
                  class="ml-1 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" 
                />
                <span 
                  v-if="navigationStore.isParentRoute(item.href)"
                  class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-primary"
                />
              </button>

              <!-- Dropdown Menu -->
              <Transition name="dropdown">
                <div
                  v-if="activeDropdown === item.id"
                  class="absolute top-full left-0 mt-2 w-56 bg-secondary-800 border border-secondary-700 rounded-lg shadow-xl overflow-hidden"
                >
                  <div class="py-2">
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.id"
                      :to="child.href"
                      class="block px-4 py-2 text-sm text-gray-300 hover:text-primary hover:bg-secondary-700 transition-all duration-200"
                    >
                      {{ child.label }}
                    </NuxtLink>
                  </div>
                </div>
              </Transition>
            </div>
          </template>
        </nav>

        <!-- Actions (Desktop) -->
        <div class="hidden lg:flex items-center space-x-4">
          <!-- Búsqueda -->
          <button
            @click="layoutStore.toggleSearch"
            class="p-2 text-gray-400 hover:text-primary transition-colors duration-300"
            aria-label="Buscar"
          >
            <Icon name="heroicons:magnifying-glass" class="h-5 w-5" />
          </button>

          <!-- Carrito de Compras -->
          <button
            class="relative p-2 text-gray-400 hover:text-primary transition-colors duration-300"
            aria-label="Carrito de compras"
          >
            <Icon name="heroicons:shopping-bag" class="h-5 w-5" />
            <span 
              v-if="cartItemsCount > 0"
              class="absolute -top-1 -right-1 h-4 w-4 bg-primary text-black text-xs rounded-full flex items-center justify-center font-bold"
            >
              {{ cartItemsCount }}
            </span>
          </button>

          <!-- Usuario / Login -->
          <div class="flex items-center space-x-2">
            <NuxtLink
              to="/login"
              class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-primary transition-colors duration-300"
            >
              Iniciar Sesión
            </NuxtLink>
            <NuxtLink
              to="/register"
              class="btn btn-primary text-sm"
            >
              Registrarse
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="layoutStore.toggleMobileMenu"
          class="lg:hidden p-2 text-gray-400 hover:text-primary transition-colors duration-300"
          aria-label="Menú móvil"
        >
          <Icon 
            :name="layoutStore.isMobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" 
            class="h-6 w-6" 
          />
        </button>
      </div>
    </div>

    <!-- Indicador de Progreso de Scroll -->
    <div 
      class="absolute bottom-0 left-0 h-0.5 bg-gradient-primary transition-all duration-300"
      :style="{ width: `${scrollProgress}%` }"
    />
  </header>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'
import { useNavigationStore } from '~/stores/navigation'
import { useScroll } from '~/composables/useScroll'

// ============================================================================
// STORES Y COMPOSABLES
// ============================================================================

const layoutStore = useLayoutStore()
const navigationStore = useNavigationStore()
const { scrollY } = useScroll()

const { 
  isMobileMenuOpen, 
  isSearchOpen 
} = storeToRefs(layoutStore)

const { 
  mainNavigation
} = storeToRefs(navigationStore)

// ============================================================================
// ESTADO LOCAL
// ============================================================================

const activeDropdown = ref<string | null>(null)
const isScrolled = computed(() => scrollY.value > 50)
const scrollProgress = computed(() => {
  const winScroll = scrollY.value
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  return height > 0 ? (winScroll / height) * 100 : 0
})

// Mock data - en una aplicación real, esto vendría de un store
const cartItemsCount = ref(2)

// ============================================================================
// COMPUTED
// ============================================================================

const headerClasses = computed(() => ({
  'bg-secondary-900/95 backdrop-blur-md border-b border-secondary-700': isScrolled.value,
  'bg-transparent': !isScrolled.value,
  'shadow-lg': isScrolled.value
}))

const navLinkClasses = (href: string) => {
  return {
    'text-primary': navigationStore.isActiveRoute(href) || navigationStore.isParentRoute(href),
    'text-gray-300': !navigationStore.isActiveRoute(href) && !navigationStore.isParentRoute(href)
  }
}

// ============================================================================
// METHODS
// ============================================================================

const showDropdown = (itemId: string) => {
  activeDropdown.value = itemId
}

const hideDropdown = (itemId: string) => {
  // Agregar un pequeño delay para permitir hover sobre el dropdown
  setTimeout(() => {
    if (activeDropdown.value === itemId) {
      activeDropdown.value = null
    }
  }, 150)
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Cerrar dropdown al hacer scroll
  const handleScroll = () => {
    activeDropdown.value = null
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true })
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS DEL HEADER
   ============================================================================ */

/* Animaciones para los dropdowns */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
  transform-origin: top center;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Mejora de rendimiento para el backdrop-filter */
header {
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

/* Estilos para el indicador de progreso */
.scroll-progress {
  background: linear-gradient(90deg, var(--tg-theme-primary) 0%, #6aff8e 100%);
}

/* Estilos de hover para los links de navegación */
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--tg-theme-primary) 0%, #6aff8e 100%);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

/* Efectos para el logo */
.logo-link:hover .logo-img {
  filter: drop-shadow(0 0 10px rgba(69, 248, 130, 0.5));
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  header {
    backdrop-filter: blur(8px);
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active,
  .dropdown-leave-active,
  .nav-link::after {
    transition: none;
  }
  
  .group-hover\\:rotate-180 {
    transform: none !important;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  header {
    border-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
