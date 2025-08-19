<template>
  <div id="app" class="min-h-screen bg-slate-900 text-white">
    <!-- Header Principal -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span class="text-black font-bold text-lg">🎮</span>
              </div>
              <span class="text-white font-bold text-xl tracking-wider">VII CIISIC</span>
            </NuxtLink>
          </div>

          <!-- Navegación Principal (Desktop) -->
          <nav class="hidden lg:flex items-center space-x-8">
            <NuxtLink to="/" class="nav-link">HOME</NuxtLink>
            <NuxtLink to="/about" class="nav-link">ABOUT US</NuxtLink>
            <NuxtLink to="/tournament" class="nav-link">TOURNAMENT</NuxtLink>
            <NuxtLink to="/pages" class="nav-link">PAGES</NuxtLink>
            <NuxtLink to="/news" class="nav-link">NEWS</NuxtLink>
            <NuxtLink to="/contact" class="nav-link">CONTACT</NuxtLink>
          </nav>

          <!-- Botón Sign In -->
          <div class="flex items-center space-x-4">
            <NuxtLink 
              to="/login" 
              class="hidden lg:inline-block bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-6 py-2 font-bold uppercase text-sm transition-all duration-300"
              style="clip-path: polygon(0 0, calc(100% - 15px) 0, 100% 100%, 15px 100%);"
            >
              SIGN IN
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
    <footer class="bg-slate-800 border-t border-slate-700 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5"></div>
      
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative">
        
        <!-- Footer Content Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          <!-- Company Info -->
          <div class="space-y-6">
            <!-- Logo -->
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <span class="text-black font-bold text-xl">🎮</span>
              </div>
              <span class="text-white font-bold text-2xl tracking-wider">VII CIISIC</span>
            </div>
            
            <!-- Description -->
            <p class="text-gray-400 leading-relaxed">
              Lorem ipsum dolor sitamet consectetur adipiscing 
              Duis esollici tudin augue euismod. Nulla ullam 
              dolor sitamet consectetur
            </p>
            
            <!-- Social Media -->
            <div class="space-y-4">
              <h4 class="text-white font-bold text-lg">
                ACTIVE <span class="text-green-500">WITH US &gt;&gt;</span>
              </h4>
              <div class="flex space-x-4">
                <!-- Discord -->
                <a href="#" class="w-10 h-10 bg-[#5865F2] rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <Icon name="simple-icons:discord" class="w-5 h-5 text-white" />
                </a>
                <!-- Twitter -->
                <a href="#" class="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <Icon name="simple-icons:twitter" class="w-5 h-5 text-white" />
                </a>
                <!-- Instagram -->
                <a href="#" class="w-10 h-10 bg-gradient-to-br from-[#E4405F] to-[#F77737] rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <Icon name="simple-icons:instagram" class="w-5 h-5 text-white" />
                </a>
                <!-- Telegram -->
                <a href="#" class="w-10 h-10 bg-[#0088CC] rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <Icon name="simple-icons:telegram" class="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-6">
            <h3 class="text-white font-bold text-xl tracking-wider">QUICK LINK</h3>
            <nav class="space-y-3">
              <NuxtLink to="/gaming" class="footer-link">Gaming</NuxtLink>
              <NuxtLink to="/product" class="footer-link">Product</NuxtLink>
              <NuxtLink to="/nfts" class="footer-link">All NFTs</NuxtLink>
              <NuxtLink to="/social" class="footer-link">Social Network</NuxtLink>
              <NuxtLink to="/domains" class="footer-link">Domain Names</NuxtLink>
              <NuxtLink to="/collectibles" class="footer-link">Collectibles</NuxtLink>
            </nav>
          </div>

          <!-- Supports -->
          <div class="space-y-6">
            <h3 class="text-white font-bold text-xl tracking-wider">SUPPORTS</h3>
            <nav class="space-y-3">
              <NuxtLink to="/settings" class="footer-link">Setting & Privacy</NuxtLink>
              <NuxtLink to="/help" class="footer-link">Help & Support</NuxtLink>
              <NuxtLink to="/auctions" class="footer-link">Live Auctions</NuxtLink>
              <NuxtLink to="/details" class="footer-link">Item Details</NuxtLink>
              <NuxtLink to="/support" class="footer-link">24/7 Supports</NuxtLink>
              <NuxtLink to="/news" class="footer-link">Our News</NuxtLink>
            </nav>
          </div>

          <!-- Newsletter -->
          <div class="space-y-6">
            <h3 class="text-white font-bold text-xl tracking-wider">NEWSLETTER</h3>
            
            <p class="text-gray-400 leading-relaxed">
              Subscribe our newsletter to get our latest 
              update & newsconsectetur
            </p>
            
            <!-- Newsletter Form -->
            <div class="space-y-4">
              <div class="relative">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  class="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors duration-200"
                />
                <button class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-400 text-black p-2 rounded-lg transition-colors duration-200">
                  <Icon name="heroicons:paper-airplane" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Bottom -->
        <div class="mt-16 pt-8 border-t border-slate-700">
          <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            <!-- Copyright -->
            <div class="text-gray-400 text-sm">
              <span class="text-green-500">COPYRIGHT © 2025</span> - ALL RIGHTS RESERVED BY 
              <span class="text-blue-400 font-semibold">MYKD</span>
            </div>
            
            <!-- Payment Methods -->
            <div class="flex items-center space-x-3">
              <!-- PayPal -->
              <div class="w-12 h-8 bg-[#00457C] rounded flex items-center justify-center">
                <span class="text-white text-xs font-bold">PayPal</span>
              </div>
              <!-- eBay -->
              <div class="w-12 h-8 bg-[#E53238] rounded flex items-center justify-center">
                <span class="text-white text-xs font-bold">eBay</span>
              </div>
              <!-- Coinbase -->
              <div class="w-12 h-8 bg-[#0052FF] rounded flex items-center justify-center">
                <span class="text-white text-xs font-bold">Coin</span>
              </div>
              <!-- Visa -->
              <div class="w-12 h-8 bg-[#1A1F71] rounded flex items-center justify-center">
                <span class="text-white text-xs font-bold">VISA</span>
              </div>
              <!-- Discover -->
              <div class="w-12 h-8 bg-[#FF6000] rounded flex items-center justify-center">
                <span class="text-white text-xs font-bold">Disc</span>
              </div>
              <!-- Mastercard -->
              <div class="w-12 h-8 bg-[#EB001B] rounded flex items-center justify-center">
                <span class="text-white text-xs font-bold">MC</span>
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

import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'
import { useNavigationStore } from '~/stores/navigation'

// ============================================================================
// STORES
// ============================================================================

const layoutStore = useLayoutStore()
const navigationStore = useNavigationStore()

// ============================================================================
// COMPOSABLES
// ============================================================================

const route = useRoute()

// ============================================================================
// METADATA Y SEO
// ============================================================================

useSeoMeta({
  title: 'VII CIISIC - Gaming & eSports',
  description: 'Plataforma de gaming y eSports. Únete a torneos y vive la experiencia gaming definitiva.',
  ogTitle: 'VII CIISIC - Gaming & eSports',
  ogDescription: 'Plataforma de gaming y eSports. Únete a torneos y vive la experiencia gaming definitiva.',
  ogImage: '/logo.png',
  twitterCard: 'summary_large_image'
})

// ============================================================================
// WATCHERS
// ============================================================================

// Actualizar la ruta actual en el store cuando cambie
watch(() => route.path, (newPath) => {
  navigationStore.setCurrentRoute(newPath)
}, { immediate: true })

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

onMounted(() => {
  // Configurar el scroll suave
  if (typeof window !== 'undefined') {
    document.documentElement.style.scrollBehavior = 'smooth'
  }
})

// ============================================================================
// HEAD CONFIGURATION
// ============================================================================

useHead({
  htmlAttrs: {
    lang: 'es'
  },
  bodyAttrs: {
    class: 'bg-slate-900 text-white'
  }
})
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
  content: '';
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
  0%, 100% {
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
