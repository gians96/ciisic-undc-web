<template>
  <div id="app" class="min-h-screen bg-[#041d39] text-white">
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    <!-- Header Principal -->
    <header
      class="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-[#041d39]/95 backdrop-blur-xl"
    >
      <div class="max-w-7xl mx-auto px-6 lg:px-8 2xl:max-w-[1600px]">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-3">
              <NuxtImg
                src="images/logo/preloader.png"
                alt="Logo CIISIC"
                class="w-10 h-10 object-contain"
              />
              <span class="text-white font-bold text-xl tracking-wide sm:text-2xl">VIII CIISIC<span class="ml-2 text-sm font-semibold text-primary-300">2026</span></span>
            </NuxtLink>
          </div>

          <!-- Navegación Principal (Desktop) -->
          <nav class="hidden lg:flex items-center gap-6" aria-label="Navegación principal">
            <NuxtLink to="/" class="nav-link">Inicio</NuxtLink>
            <NuxtLink to="/about" class="nav-link">Congreso</NuxtLink>
            <NuxtLink to="/cronograma" class="nav-link">Cronograma</NuxtLink>
            <NuxtLink to="/ponentes" class="nav-link">Ponentes</NuxtLink>
            <NuxtLink to="/sede" class="nav-link">Sede</NuxtLink>
          </nav>

          <div class="flex items-center space-x-4">
            <!-- Botón de menú móvil -->
            <button
              @click="layoutStore.toggleMobileMenu()"
              class="lg:hidden rounded-xl border border-white/15 p-2.5 text-white hover:border-primary-400 hover:text-primary-300 focus-visible:outline-primary-400"
              aria-label="Abrir menú de navegación"
              :aria-expanded="layoutStore.isMobileMenuOpen"
            >
              <Icon name="heroicons:bars-3" class="h-6 w-6" />
            </button>

            <NuxtLink
              to="/planes"
              class="hidden lg:inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-3 text-sm font-bold text-[#032f5f] transition hover:-translate-y-0.5 hover:bg-primary-300"
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
  title: "VIII CIISIC 2026 | UNDC",
  description: "VIII CIISIC de la UNDC, del 26 al 30 de octubre de 2026",
  ogTitle: "VIII CIISIC 2026 | UNDC",
  ogDescription: "VIII CIISIC de la UNDC, del 26 al 30 de octubre de 2026",
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
    class: "bg-[#041d39] text-white",
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
  color: #cbd5e1;
  font-weight: 600;
  letter-spacing: 0.01em;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #00d9e8;
  transform: translateY(-1px);
}

.nav-link.router-link-exact-active {
  color: #00d9e8;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #00d9e8, #075bcb);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  width: 100%;
}

.skip-link {
  position: fixed;
  top: -5rem;
  left: 1rem;
  z-index: 100;
  border-radius: .75rem;
  background: #00d9e8;
  color: #032f5f;
  padding: .75rem 1rem;
  font-weight: 700;
}
.skip-link:focus { top: 1rem; }



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
  outline: 2px solid #00d9e8;
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
