<template>
  <div id="app" class="min-h-screen bg-slate-900 text-white">
    <!-- Header Principal -->
    <header
      class="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50"
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
            <NuxtLink to="/tournament" class="nav-link">Convocatorias</NuxtLink>
            <NuxtLink to="/pages" class="nav-link">Ponentes</NuxtLink>
            <NuxtLink to="/news" class="nav-link">Sede</NuxtLink>
            <NuxtLink to="/contact" class="nav-link">Contacto</NuxtLink>
          </nav>

          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/planes"
              class="hidden lg:inline-block bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-6 py-2 font-bold uppercase text-sm transition-all duration-300"
              style="
                clip-path: polygon(
                  0 0,
                  calc(100% - 15px) 0,
                  100% 100%,
                  15px 100%
                );
              "
            >
              REGISTRO
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main id="main-content" class="relative">
      <NuxtPage />
    </main>

    <!-- Footer Detallado -->
    <footer
      class="bg-slate-800 border-t border-slate-700 relative overflow-hidden"
    >
      <!-- Background Pattern -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5"
      ></div>

      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div class="lg:col-span-5 space-y-6">
            <div class="flex items-center space-x-3">
              <NuxtLink to="/" class="flex items-center space-x-3">
                <NuxtImg
                  src="images/logo/preloader.png"
                  alt="Logo CIISIC"
                  class="w-10 h-10 object-contain"
                />
                <span class="text-white font-bold text-xl tracking-wider">VII CIISIC</span>
              </NuxtLink>
            </div>
            <p class="text-gray-400 leading-relaxed">
              La ingeniería de sistemas impulsa la innovación y la investigación
              científica, construyendo soluciones que transforman el futuro.
            </p>
          </div>
          <div class="lg:col-span-3 space-y-6">
            <h3 class="text-white font-bold text-xl tracking-wider">ENLACES ÚTILES</h3>
            <nav class="space-y-3">
              <NuxtLink to="/about" class="footer-link">Sobre el evento</NuxtLink>
              <NuxtLink to="/faq" class="footer-link">Preguntas frecuentes</NuxtLink>
              <NuxtLink to="/privacy" class="footer-link">Política de privacidad</NuxtLink>
            </nav>
          </div>
          <div class="lg:col-span-2 space-y-6">
            <h3 class="text-white font-bold text-xl tracking-wider">RECURSOS</h3>
            <nav class="space-y-3">
              <NuxtLink to="/tournaments" class="footer-link">Torneos</NuxtLink>
              <NuxtLink to="/ponencias" class="footer-link">Ponencias</NuxtLink>
              <NuxtLink to="/memorias" class="footer-link">Memorias</NuxtLink>
              <NuxtLink to="/gallery" class="footer-link">Galería</NuxtLink>
              <NuxtLink to="/planes" class="footer-link">Registro</NuxtLink>
            </nav>
          </div>
          <!-- Columna 4: Contacto -->
          <div class="lg:col-span-2 space-y-6">
            <h3 class="text-white font-bold text-xl tracking-wider">CONTACTO</h3>
            <nav class="space-y-3">
              <NuxtLink to="mailto:congreso@undc.edu.pe" class="footer-link">congreso@undc.edu.pe</NuxtLink>
              <NuxtLink to="https://wa.me/51949026908" class="footer-link">+51 949026908</NuxtLink>
              <NuxtLink to="" class="footer-link">Auditorio "Casa de la Cultura", San Vicente - Cañete</NuxtLink>

            </nav>
          </div>
        </div>

        <div class="mt-16 pt-8 border-t border-slate-700">
          <div
            class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
          >
            <div class="text-gray-400 text-sm">
              <a href="https://fi.undc.edu.pe" class="text-green-500">Facultad de Ingeniería</a> - Todos los derechos reservados
             
            </div>

            <div class="flex items-center space-x-3">
              <div
                class="w-12 h-8 rounded flex items-center justify-center"
              >
                <a href="https://facebook.com/fiundc" target="_blank" class="w-10 h-10 bg-[#0967FF] rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200" aria-label="Discord">
                  <Icon name="simple-icons:facebook" class="w-5 h-5 text-white" />
                </a>
              </div>
              <div
                class="w-12 h-8 rounded flex items-center justify-center"
              >
                 <a href="https://tiktok.com/@fiundc" target="_blank" class="w-10 h-10 bg-[#000] rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200" aria-label="Twitter">
                  <Icon name="simple-icons:tiktok" class="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { storeToRefs } from "pinia";
import { useLayoutStore } from "~/stores/layout";
import { useNavigationStore } from "~/stores/navigation";

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

/* Footer Styles */
.footer-link {
  display: block;
  color: #9ca3af;
  font-weight: 400;
  transition: all 0.3s ease;
  position: relative;
  padding-left: 0;
}

.footer-link:hover {
  color: #22c55e;
  padding-left: 8px;
  transform: translateX(4px);
}

.footer-link::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 2px;
  background: #22c55e;
  transition: width 0.3s ease;
}

.footer-link:hover::before {
  width: 4px;
}

/* Social Media Icons */
footer a[href="#"]:hover {
  transform: scale(1.1) rotate(5deg);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

/* Newsletter Input */
footer input[type="email"] {
  background: rgba(51, 65, 85, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

footer input[type="email"]:focus {
  background: rgba(51, 65, 85, 0.8);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
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

/* Footer Grid Animation */
footer .grid > div:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

footer .grid > div:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

footer .grid > div:nth-child(3) {
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

footer .grid > div:nth-child(4) {
  animation: fadeInUp 0.6s ease-out 0.7s both;
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

/* Background Pattern Animation */
footer .absolute.inset-0 {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive Footer */
@media (max-width: 768px) {
  footer .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  footer .flex.md\:flex-row {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  footer .space-x-3 {
    justify-content: center;
  }
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
</style>
