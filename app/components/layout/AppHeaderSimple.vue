<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-3">
            <!-- Icono del logo -->
            <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <span class="text-black font-bold text-lg">🎮</span>
            </div>
            <span class="text-white font-bold text-xl tracking-wider">VII CIISIC</span>
          </NuxtLink>
        </div>

        <!-- Navegación Principal (Desktop) -->
        <nav class="hidden lg:flex items-center space-x-8">
          <NuxtLink 
            to="/" 
            class="nav-link"
            :class="{ 'active': $route.path === '/' }"
          >
            HOME
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="nav-link"
            :class="{ 'active': $route.path === '/about' }"
          >
            ABOUT US
          </NuxtLink>
          <NuxtLink 
            to="/tournament" 
            class="nav-link"
            :class="{ 'active': $route.path === '/tournament' }"
          >
            TOURNAMENT
          </NuxtLink>
          <NuxtLink 
            to="/pages" 
            class="nav-link"
            :class="{ 'active': $route.path === '/pages' }"
          >
            PAGES
          </NuxtLink>
          <NuxtLink 
            to="/news" 
            class="nav-link"
            :class="{ 'active': $route.path === '/news' }"
          >
            NEWS
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="nav-link"
            :class="{ 'active': $route.path === '/contact' }"
          >
            CONTACT
          </NuxtLink>
        </nav>

        <!-- Botones de Acción -->
        <div class="flex items-center space-x-4">
          <!-- Botón de Búsqueda -->
          <button 
            class="p-2 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Buscar"
          >
            <Icon name="heroicons:magnifying-glass" class="h-6 w-6" />
          </button>

          <!-- Botón Sign In -->
          <NuxtLink 
            to="/login" 
            class="hidden lg:inline-block bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-6 py-2 font-bold uppercase text-sm transition-all duration-300 clip-path-btn"
          >
            SIGN IN
          </NuxtLink>

          <!-- Menú Hamburguesa (Mobile) -->
          <button 
            @click="toggleMobileMenu"
            class="lg:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Menú"
          >
            <Icon v-if="!isMobileMenuOpen" name="heroicons:bars-3" class="h-6 w-6" />
            <Icon v-else name="heroicons:x-mark" class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Menú Móvil -->
    <div v-if="isMobileMenuOpen" class="lg:hidden bg-slate-800 border-t border-slate-700">
      <div class="px-6 py-4 space-y-4">
        <NuxtLink 
          v-for="item in mobileNavItems" 
          :key="item.href"
          :to="item.href" 
          @click="closeMobileMenu"
          class="block py-2 text-gray-300 hover:text-green-500 font-medium uppercase tracking-wider transition-colors duration-200"
        >
          {{ item.label }}
        </NuxtLink>
        
        <!-- Sign In móvil -->
        <NuxtLink 
          to="/login" 
          @click="closeMobileMenu"
          class="block mt-4 bg-green-500 text-black px-4 py-2 font-bold uppercase text-center transition-colors duration-200"
        >
          SIGN IN
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// ============================================================================
// ESTADO LOCAL
// ============================================================================

const isMobileMenuOpen = ref(false)

const mobileNavItems = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'TOURNAMENT', href: '/tournament' },
  { label: 'PAGES', href: '/pages' },
  { label: 'NEWS', href: '/news' },
  { label: 'CONTACT', href: '/contact' }
]

// ============================================================================
// METHODS
// ============================================================================

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// ============================================================================
// WATCHERS
// ============================================================================

// Cerrar menú móvil al cambiar de ruta
watch(() => useRoute().path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS DEL HEADER GAMING
   ============================================================================ */

/* Navegación principal */
.nav-link {
  color: #d1d5db;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #22c55e;
  transform: translateY(-1px);
}

.nav-link.active {
  color: #22c55e;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Botón Sign In con clip-path */
.clip-path-btn {
  clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 100%, 15px 100%);
}

/* Efectos del header */
header {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Responsive improvements */
@media (max-width: 1023px) {
  .nav-link {
    font-size: 1rem;
    padding: 0.5rem 0;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .nav-link {
    transition: none;
  }
  
  .nav-link::after {
    transition: none;
  }
  
  .nav-link:hover {
    transform: none;
  }
}

/* Focus styles */
.nav-link:focus,
button:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}
</style>
