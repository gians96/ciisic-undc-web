<template>
  <section class="py-20 bg-slate-900 relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      
      <!-- Header con navegación -->
      <div class="flex items-center justify-between mb-12">
        <!-- Título -->
        <div class="flex items-center space-x-3">
          <h2 class="text-3xl lg:text-4xl font-bold text-white">Eventos y Consursos</h2>
        </div>
        
        <!-- Controles de navegación -->
        <div class="flex space-x-2">
          <button 
            @click="prevSlide"
            class="w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center transition-colors duration-300"
          >
            <Icon name="heroicons:chevron-left" class="w-5 h-5 text-white" />
          </button>
          <button 
            @click="nextSlide"
            class="w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center transition-colors duration-300"
          >
            <Icon name="heroicons:chevron-right" class="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <!-- Grid de trending items -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Trending Card Principal -->
        <div class="trending-card bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <!-- Creator info header -->
          <div class="p-4 border-b border-slate-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span class="text-black font-bold text-sm">XD</span>
                </div>
                <div>
                  <p class="text-white text-sm font-medium">Crypto Max</p>
                  <p class="text-gray-400 text-xs">@Jon Max</p>
                </div>
              </div>
              
              <!-- Heart icon -->
              <button class="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Icon name="heroicons:heart" class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <!-- Imagen principal -->
          <div class="relative aspect-square">
            <div class="w-full h-full bg-gradient-to-br from-blue-400 via-green-400 to-purple-500 flex items-center justify-center">
              <!-- Arte NFT placeholder -->
              <div class="text-6xl">🎨</div>
            </div>
            
            <!-- Overlay con información -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
              <div class="p-4 w-full">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-white font-bold text-sm">Last Bid</p>
                    <p class="text-yellow-500 font-bold">💎 1.002 ETH</p>
                  </div>
                  
                  <button class="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200">
                    Leer más
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Trending Cards Adicionales -->
        <div class="trending-card bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div class="p-4 border-b border-slate-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-sm">AG</span>
                </div>
                <div>
                  <p class="text-white text-sm font-medium">Art Genius</p>
                  <p class="text-gray-400 text-xs">@ArtGen</p>
                </div>
              </div>
              <button class="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Icon name="heroicons:heart" class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div class="relative aspect-square">
            <div class="w-full h-full bg-gradient-to-br from-red-400 via-yellow-400 to-orange-500 flex items-center justify-center">
              <div class="text-6xl">🖼️</div>
            </div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
              <div class="p-4 w-full">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-white font-bold text-sm">Last Bid</p>
                    <p class="text-yellow-500 font-bold">💎 0.85 ETH</p>
                  </div>
                  <button class="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200">
                    Bid →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="trending-card bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <div class="p-4 border-b border-slate-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-sm">DM</span>
                </div>
                <div>
                  <p class="text-white text-sm font-medium">Digital Master</p>
                  <p class="text-gray-400 text-xs">@DigiMaster</p>
                </div>
              </div>
              <button class="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <Icon name="heroicons:heart" class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div class="relative aspect-square">
            <div class="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500 flex items-center justify-center">
              <div class="text-6xl">🌟</div>
            </div>
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
              <div class="p-4 w-full">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-white font-bold text-sm">Last Bid</p>
                    <p class="text-yellow-500 font-bold">💎 1.25 ETH</p>
                  </div>
                  <button class="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200">
                    Bid →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Indicadores de slide -->
      <div class="flex justify-center mt-8 space-x-2">
        <div 
          v-for="(slide, index) in 3" 
          :key="index"
          class="w-2 h-2 rounded-full transition-colors duration-300"
          :class="currentSlide === index ? 'bg-green-500' : 'bg-slate-600'"
        ></div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
// ============================================================================
// INTERFACES
// ============================================================================

interface TrendingItem {
  id: string
  title: string
  creator: string
  creatorHandle: string
  price: string
  currency: string
  image: string
  likes: number
  isLiked: boolean
}

// ============================================================================
// DATA
// ============================================================================

const currentSlide = ref(0)

const trendingItems: TrendingItem[] = [
  {
    id: '1',
    title: 'Cosmic Art Collection',
    creator: 'Crypto Max',
    creatorHandle: '@Jon Max',
    price: '1.002',
    currency: 'ETH',
    image: '🎨',
    likes: 234,
    isLiked: false
  },
  {
    id: '2',
    title: 'Abstract Vision',
    creator: 'Art Genius',
    creatorHandle: '@ArtGen',
    price: '0.85',
    currency: 'ETH',
    image: '🖼️',
    likes: 189,
    isLiked: false
  },
  {
    id: '3',
    title: 'Digital Dreams',
    creator: 'Digital Master',
    creatorHandle: '@DigiMaster',
    price: '1.25',
    currency: 'ETH',
    image: '🌟',
    likes: 312,
    isLiked: true
  }
]

// ============================================================================
// METHODS
// ============================================================================

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 3
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? 2 : currentSlide.value - 1
}

const toggleLike = (itemId: string) => {
  console.log(`Toggle like for item: ${itemId}`)
  // Lógica para toggle like
}

const placeBid = (itemId: string) => {
  console.log(`Place bid for item: ${itemId}`)
  // Lógica para hacer una oferta
}

// ============================================================================
// LIFECYCLE
// ============================================================================

let slideInterval: NodeJS.Timeout

onMounted(() => {
  // Auto-slide cada 5 segundos
  slideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
})

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS DE TOP TRENDING
   ============================================================================ */

/* Efectos para las trending cards */
.trending-card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.trending-card:hover {
  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.15);
}

/* Efectos de hover para las imágenes */
.trending-card:hover .aspect-square > div {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

/* Animaciones de entrada escalonada */
.trending-card:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.trending-card:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.trending-card:nth-child(3) {
  animation: fadeInUp 0.6s ease-out 0.5s both;
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

/* Efectos de los botones de navegación */
button:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Efectos especiales para los overlays */
.absolute.inset-0 {
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

/* Efectos de los indicadores */
.w-2.h-2 {
  transition: all 0.3s ease;
}

.bg-green-500.w-2.h-2 {
  transform: scale(1.5);
}

/* Glassmorphism para las cards */
.trending-card {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Efectos de brillo en los precios */
.text-yellow-500 {
  text-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .flex.items-center.justify-between {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  h2 {
    font-size: 2rem !important;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .trending-card:hover {
    transform: none;
  }
  
  .trending-card:hover .aspect-square > div {
    transform: none;
  }
  
  .trending-card {
    animation: none;
  }
  
  button:hover {
    transform: none;
  }
}

/* Focus states */
button:focus,
.trending-card:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

/* Efectos de pulso para elementos destacados */
.bg-yellow-500 {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(234, 179, 8, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.8);
  }
}
</style>
