<template>
  <div id="app" class="min-h-screen bg-slate-900 text-white">
    <!-- Header Principal -->
    <header
      class="fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-3">
              <NuxtImg
                src="images/logo/preloader.png"
                alt="Logo CIISIC"
                class="w-10 h-10 object-contain"
              />
              <span class="text-white font-bold text-3xl tracking-wider"
                >VII CIISIC</span
              >
            </NuxtLink>
          </div>

          <!-- Navegación Principal (Desktop) -->
          <nav class="hidden lg:flex items-center space-x-8">
            <NuxtLink to="/" class="nav-link">Inicio</NuxtLink>
            <NuxtLink to="/about" class="nav-link">Acerca de</NuxtLink>
            <NuxtLink to="/cronograma" class="nav-link">Cronograma</NuxtLink>
            <NuxtLink to="/papers" class="nav-link">Call for papers</NuxtLink>
            <NuxtLink to="/ponentes" class="nav-link">Ponentes</NuxtLink>
            <NuxtLink to="/sede" class="nav-link">Sede</NuxtLink>
            <NuxtLink to="/contacto" class="nav-link">Contacto</NuxtLink>
          </nav>

          <div class="flex items-center space-x-4">
            <!-- Botón de menú móvil -->
            <button
              @click="() => { console.log('Button clicked, current state:', layoutStore.isMobileMenuOpen); layoutStore.toggleMobileMenu(); console.log('New state:', layoutStore.isMobileMenuOpen); }"
              class="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-label="Abrir menú de navegación"
            >
              <Icon name="heroicons:bars-3" class="h-6 w-6" />
            </button>

            <NuxtLink
              to="/planes"
              class="hidden lg:inline-block bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-6 py-2 font-bold uppercase text-sm transition-all duration-300 registro-button-clip"
            >
              INSCRIPCIONES
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <MobileMenuOverlay />

    <!-- Contenido Principal -->
    <main id="main-content" class="relative">
      <NuxtPage />
    </main>
    <LayoutAppFooter />

  </div>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { useLayoutStore } from "~/stores/layout";
import { useNavigationStore } from "~/stores/navigation";
import MobileMenuOverlay from "~/components/layout/MobileMenuOverlay.vue";

// ============================================================================
// STORES
// ============================================================================

const layoutStore = useLayoutStore();
const navigationStore = useNavigationStore();

// ============================================================================
// COMPOSABLES
// ============================================================================

const route = useRoute();

// ============================================================================
// METADATA Y SEO
// ============================================================================

useSeoMeta({
  title: "VII CIISIC | UNDC",
  description: "Plataforma con información sobre el VII CIISIC",
  ogTitle: "VII CIISIC | UNDC",
  ogDescription: "Plataforma con información sobre el VII CIISIC",
  ogImage: "/images/logo/preloader.png",
  twitterCard: "summary_large_image",
});

// ============================================================================
// WATCHERS
// ============================================================================

// Actualizar la ruta actual en el store cuando cambie
watch(
  () => route.path,
  (newPath) => {
    navigationStore.setCurrentRoute(newPath);
  },
  { immediate: true }
);

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

onMounted(() => {
  // Configurar el scroll suave
  if (typeof window !== "undefined") {
    document.documentElement.style.scrollBehavior = "smooth";
  }
});

// ============================================================================
// HEAD CONFIGURATION
// ============================================================================

useHead({
  htmlAttrs: {
    lang: "es",
  },
  bodyAttrs: {
    class: "bg-slate-900 text-white",
  },
});
</script>

<style scoped>
/* ============================================================================
   ESTILOS DEL LAYOUT PRINCIPAL
   ============================================================================ */

#app {
  --header-height: 80px;
  padding-top: var(--header-height);
}

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

.nav-link.router-link-active {
  color: #22c55e;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}



/* Payment Methods */
.w-12.h-8 {
  transition: all 0.3s ease;
  cursor: pointer;
}

.w-12.h-8:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}



/* Smooth scroll para toda la aplicación */
html {
  scroll-behavior: smooth;
}

/* Prevenir scroll horizontal */
#app {
  overflow-x: hidden;
}

/* Transiciones suaves */
#main-content {
  transition: filter 0.3s ease, opacity 0.3s ease;
}

/* Estilos para el focus del teclado */
:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  footer .grid > div,
  footer .absolute.inset-0,
  footer a[href="#"]:hover,
  .footer-link:hover,
  .w-12.h-8:hover {
    animation: none;
    transform: none;
  }

  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Clase para el botón de registro con clip-path */
.registro-button-clip {
  clip-path: polygon(
    0 0,
    calc(100% - 15px) 0,
    100% 100%,
    15px 100%
  );
}
</style>
