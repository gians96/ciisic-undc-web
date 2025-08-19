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
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
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
            class="fixed inset-y-0 left-0 w-80 max-w-sm bg-secondary-800 shadow-xl overflow-y-auto"
            @click.stop
          >
            <!-- Header del Menu -->
            <div class="flex items-center justify-between p-6 border-b border-secondary-700">
              <!-- Logo -->
              <NuxtLink to="/" @click="closeMenu" class="flex items-center">
                <NuxtImg
                  src="/images/logo/logo.png"
                  alt="MYKD Logo"
                  width="120"
                  height="40"
                  class="h-8 w-auto"
                />
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
                  <!-- Simple Link -->
                  <NuxtLink
                    v-if="!item.children"
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

                  <!-- Dropdown -->
                  <div v-else>
                    <button
                      @click="toggleSubmenu(item.id)"
                      class="mobile-nav-link w-full"
                      :class="{ 'active': item.isActive }"
                    >
                      <Icon 
                        v-if="item.icon" 
                        :name="item.icon" 
                        class="h-5 w-5 mr-3 text-primary" 
                      />
                      <span>{{ item.label }}</span>
                      <Icon 
                        name="heroicons:chevron-down" 
                        class="h-4 w-4 ml-auto transition-transform duration-200"
                        :class="{ 'rotate-180': openSubmenus.includes(item.id) }"
                      />
                    </button>

                    <!-- Submenu -->
                    <Transition
                      name="slide-down"
                      enter-active-class="transition-all duration-200 ease-out"
                      enter-from-class="transform -translate-y-2 opacity-0 max-h-0"
                      enter-to-class="transform translate-y-0 opacity-100 max-h-96"
                      leave-active-class="transition-all duration-150 ease-in"
                      leave-from-class="transform translate-y-0 opacity-100 max-h-96"
                      leave-to-class="transform -translate-y-2 opacity-0 max-h-0"
                    >
                      <div v-if="openSubmenus.includes(item.id)" class="mt-2 ml-8">
                        <ul class="space-y-1">
                          <li v-for="child in item.children" :key="child.id">
                            <NuxtLink
                              :to="child.href"
                              @click="closeMenu"
                              class="mobile-submenu-link"
                              :class="{ 'active': child.isActive }"
                            >
                              {{ child.label }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </div>
                    </Transition>
                  </div>
                </li>
              </ul>
            </nav>

            <!-- Search Section -->
            <div class="border-t border-secondary-700 p-6">
              <button
                @click="openSearch"
                class="w-full flex items-center p-3 bg-secondary-700 hover:bg-secondary-600 rounded-lg transition-colors duration-200"
              >
                <Icon name="heroicons:magnifying-glass" class="h-5 w-5 mr-3 text-primary" />
                <span class="text-gray-300">Buscar...</span>
              </button>
            </div>

            <!-- User Actions -->
            <div class="border-t border-secondary-700 p-6">
              <div class="flex space-x-3">
                <!-- Login Button -->
                <NuxtLink
                  to="/login"
                  @click="closeMenu"
                  class="flex-1 bg-secondary-700 hover:bg-secondary-600 text-white py-3 px-4 rounded-lg text-center font-semibold transition-colors duration-200"
                >
                  Iniciar Sesión
                </NuxtLink>

                <!-- Register Button -->
                <NuxtLink
                  to="/register"
                  @click="closeMenu"
                  class="flex-1 bg-primary hover:bg-primary/90 text-black py-3 px-4 rounded-lg text-center font-semibold transition-colors duration-200"
                >
                  Registrarse
                </NuxtLink>
              </div>
            </div>

            <!-- Social Links -->
            <div class="border-t border-secondary-700 p-6">
              <h3 class="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                Síguenos
              </h3>
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
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { storeToRefs } from 'pinia'
import { useNavigationStore } from '~/stores/navigation'
import { useLayoutStore } from '~/stores/layout'

// ============================================================================
// STORES
// ============================================================================

const navigationStore = useNavigationStore()
const layoutStore = useLayoutStore()

const { mainNavigation } = storeToRefs(navigationStore)
const { isMobileMenuOpen } = storeToRefs(layoutStore)

// ============================================================================
// ESTADO LOCAL
// ============================================================================

const openSubmenus = ref<string[]>([])

// ============================================================================
// COMPUTED
// ============================================================================

const isOpen = computed(() => isMobileMenuOpen.value)

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
  }
])

// ============================================================================
// METHODS
// ============================================================================

const closeMenu = () => {
  layoutStore.closeMobileMenu()
  openSubmenus.value = []
}

const toggleSubmenu = (itemId: string) => {
  const index = openSubmenus.value.indexOf(itemId)
  if (index > -1) {
    openSubmenus.value.splice(index, 1)
  } else {
    openSubmenus.value.push(itemId)
  }
}

const openSearch = () => {
  closeMenu()
  layoutStore.openSearch()
}

// ============================================================================
// LIFECYCLE
// ============================================================================

// Cerrar el menú cuando se presiona Escape
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      closeMenu()
    }
  }

  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Prevenir scroll en el body cuando el menú está abierto
watch(isOpen, (newValue) => {
  if (process.client) {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Limpiar overflow al desmontar
onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
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
