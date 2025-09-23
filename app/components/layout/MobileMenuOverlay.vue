<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition
      name="fade"
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] lg:hidden"
        @click="closeMenu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
      >
        <!-- Menu Panel -->
        <Transition
          name="slide-right"
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="transform -translate-x-full"
          enter-to-class="transform translate-x-0"
          leave-active-class="transition-transform duration-250 ease-in"
          leave-from-class="transform translate-x-0"
          leave-to-class="transform -translate-x-full"
        >
          <div
            v-if="isOpen"
            class="fixed inset-y-0 left-0 w-80 max-w-sm bg-secondary-800 shadow-xl overflow-y-auto z-[9999]"
            @click.stop
          >
            <!-- Header del Menu -->
            <div class="flex items-center justify-between p-6 border-b border-secondary-700">
              <!-- Logo -->
              <NuxtLink to="/" @click="closeMenu" class="flex items-center space-x-3">
                <NuxtImg
                  src="/images/logo/preloader.png"
                  alt="VII CIISIC Logo"
                  class="w-8 h-8 object-contain"
                />
                <span class="text-white font-bold text-xl tracking-wider">VII CIISIC</span>
              </NuxtLink>

              <!-- Close Button -->
              <button
                @click="closeMenu"
                class="p-2 text-gray-400 hover:text-white hover:bg-secondary-700 rounded-lg transition-colors duration-200"
                aria-label="Cerrar menú"
              >
                <Icon name="heroicons:x-mark" class="h-6 w-6" />
              </button>
            </div>

            <!-- Navigation Links -->
            <nav class="p-6">
              <ul class="space-y-2">
                <!-- Navigation Items -->
                <li v-for="item in mainNavigation" :key="item.id">
                  <NuxtLink
                    :to="item.href"
                    @click="closeMenu"
                    class="mobile-nav-link"
                    :class="{ 'active': item.isActive }"
                  >
                    <Icon 
                      v-if="item.icon" 
                      :name="item.icon" 
                      class="h-5 w-5 mr-3 text-primary" 
                    />
                    <span>{{ item.label }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </nav>

            <!-- User Actions -->
            <div class="border-t border-secondary-700 p-6">
              <NuxtLink
                to="/planes"
                @click="closeMenu"
                class="w-full bg-green-500 hover:bg-green-600 text-black py-3 px-4 rounded-lg text-center font-bold uppercase text-sm transition-colors duration-200 block"
              >
                REGISTRO
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigation'
import { useLayoutStore } from '~/stores/layout'

// ============================================================================
// STORES
// ============================================================================

const navigationStore = useNavigationStore()
const layoutStore = useLayoutStore()

const { isMobileMenuOpen } = storeToRefs(layoutStore)

// ============================================================================
// NAVEGACIÓN LOCAL PARA CIISIC
// ============================================================================

const mainNavigation = ref([
  {
    id: 'home',
    label: 'Inicio',
    href: '/',
    icon: 'heroicons:home',
    isActive: false
  },
  {
    id: 'about',
    label: 'Acerca de',
    href: '/about',
    icon: 'heroicons:information-circle',
    isActive: false
  },
  {
    id: 'cronograma',
    label: 'Cronograma',
    href: '/cronograma',
    icon: 'heroicons:calendar-days',
    isActive: false
  },
  {
    id: 'papers',
    label: 'Call for papers',
    href: '/papers',
    icon: 'heroicons:document-text',
    isActive: false
  },
  {
    id: 'ponentes',
    label: 'Ponentes',
    href: '/ponentes',
    icon: 'heroicons:user-group',
    isActive: false
  },
  {
    id: 'sede',
    label: 'Sede',
    href: '/sede',
    icon: 'heroicons:map-pin',
    isActive: false
  },
  {
    id: 'contacto',
    label: 'Contacto',
    href: '/contacto',
    icon: 'heroicons:envelope',
    isActive: false
  }
])

// ============================================================================
// ESTADO LOCAL
// ============================================================================

const openSubmenus = ref<string[]>([])

// ============================================================================
// COMPUTED
// ============================================================================

const isOpen = computed(() => {
  return isMobileMenuOpen.value
})

// ============================================================================
// METHODS
// ============================================================================

const closeMenu = () => {
  layoutStore.closeMobileMenu()
  openSubmenus.value = []
}

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeMenu()
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  if (process.client) {
    document.body.style.overflow = ''
  }
})

watch(isOpen, (newValue) => {
  if (process.client) {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS DEL MOBILE MENU
   ============================================================================ */

/* Mobile Navigation Link Styles */
.mobile-nav-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  color: rgb(209 213 219);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.mobile-nav-link:hover {
  color: white;
  background-color: rgb(55 65 81);
}

.mobile-nav-link.active {
  color: #45f882;
  background-color: rgba(69, 248, 130, 0.1);
  border-left: 2px solid #45f882;
}

.mobile-submenu-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: rgb(156 163 175);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.mobile-submenu-link:hover {
  color: white;
  background-color: rgb(55 65 81);
}

.mobile-submenu-link.active {
  color: #45f882;
  background-color: rgba(69, 248, 130, 0.1);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 24rem;
  opacity: 1;
  transform: translateY(0);
}

/* Responsive Design */
@media (min-width: 1024px) {
  .mobile-menu-overlay {
    display: none;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-transform,
  .transition-opacity {
    transition: none !important;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .mobile-nav-link:hover,
  .mobile-submenu-link:hover {
    background-color: #ffffff;
    color: #000000;
  }
  
  .mobile-nav-link.active,
  .mobile-submenu-link.active {
    background-color: #45f882;
    color: #000000;
  }
}

/* Focus Styles */
.mobile-nav-link:focus,
.mobile-submenu-link:focus {
  outline: none;
  box-shadow: 0 0 0 2px #45f882, 0 0 0 4px rgb(55 65 81);
}

/* Dark Mode Enhancements */
@media (prefers-color-scheme: dark) {
  .mobile-menu-panel {
    backdrop-filter: blur(20px);
  }
}
</style>
