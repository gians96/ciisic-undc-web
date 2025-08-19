<template>
  <section class="py-20 bg-slate-900 relative overflow-hidden">
    <!-- Background decorativo -->
    <div class="absolute inset-0">
      <!-- Línea verde angular -->
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-500 to-transparent transform -skew-y-2 opacity-20"></div>
      <div class="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-green-500 to-transparent transform skew-y-2 opacity-20"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Grid de cartas gaming -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Wolf Gaming Art -->
        <div class="gaming-card bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <!-- Imagen de la carta -->
          <div class="relative mb-6">
            <div class="aspect-square bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-6xl">
              🐺
            </div>
            <!-- Badge de categoría -->
            <div class="absolute -top-2 -right-2 bg-orange-500 text-black px-3 py-1 rounded-lg text-xs font-bold">
              ART
            </div>
          </div>
          
          <!-- Información de la carta -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">WOLF GAMING ART</h3>
            
            <!-- Creator info -->
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span class="text-black font-bold text-sm">A</span>
              </div>
              <div>
                <p class="text-white text-sm font-medium">Alax Max</p>
                <p class="text-gray-400 text-xs uppercase">CREATOR</p>
              </div>
            </div>
            
            <!-- Precio y botón -->
            <div class="flex items-center justify-between pt-4">
              <div>
                <p class="text-white text-lg font-bold">1.002 <span class="text-yellow-500">ETH</span></p>
              </div>
              <button class="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200">
                Bid →
              </button>
            </div>
          </div>
        </div>

        <!-- Forest Princess -->
        <div class="gaming-card bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <!-- Imagen de la carta -->
          <div class="relative mb-6">
            <div class="aspect-square bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-6xl">
              👑
            </div>
            <!-- Badge de categoría -->
            <div class="absolute -top-2 -right-2 bg-purple-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
              CHAR
            </div>
          </div>
          
          <!-- Información de la carta -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">FOREST PRINCESS</h3>
            
            <!-- Creator info -->
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <p class="text-white text-sm font-medium">Alax Max</p>
                <p class="text-gray-400 text-xs uppercase">CREATOR</p>
              </div>
            </div>
            
            <!-- Precio y botón -->
            <div class="flex items-center justify-between pt-4">
              <div>
                <p class="text-white text-lg font-bold">1.053 <span class="text-yellow-500">ETH</span></p>
              </div>
              <button class="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200">
                Bid →
              </button>
            </div>
          </div>
        </div>

        <!-- Girl Firefly Art -->
        <div class="gaming-card bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
          <!-- Imagen de la carta -->
          <div class="relative mb-6">
            <div class="aspect-square bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-6xl">
              🧚‍♀️
            </div>
            <!-- Badge de categoría -->
            <div class="absolute -top-2 -right-2 bg-green-500 text-black px-3 py-1 rounded-lg text-xs font-bold">
              ART
            </div>
          </div>
          
          <!-- Información de la carta -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-white">GIRL FIREFLY ART</h3>
            
            <!-- Creator info -->
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span class="text-black font-bold text-sm">A</span>
              </div>
              <div>
                <p class="text-white text-sm font-medium">Alax Max</p>
                <p class="text-gray-400 text-xs uppercase">CREATOR</p>
              </div>
            </div>
            
            <!-- Precio y botón -->
            <div class="flex items-center justify-between pt-4">
              <div>
                <p class="text-white text-lg font-bold">1.024 <span class="text-yellow-500">ETH</span></p>
              </div>
              <button class="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200">
                Bid →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// ============================================================================
// INTERFACES
// ============================================================================

interface GamingCard {
  id: string
  title: string
  creator: string
  price: string
  currency: string
  image: string
  category: string
  categoryColor: string
}

// ============================================================================
// DATA
// ============================================================================

const cards: GamingCard[] = [
  {
    id: '1',
    title: 'WOLF GAMING ART',
    creator: 'Alax Max',
    price: '1.002',
    currency: 'ETH',
    image: '🐺',
    category: 'ART',
    categoryColor: 'orange'
  },
  {
    id: '2',
    title: 'FOREST PRINCESS',
    creator: 'Alax Max',
    price: '1.053',
    currency: 'ETH',
    image: '👑',
    category: 'CHAR',
    categoryColor: 'purple'
  },
  {
    id: '3',
    title: 'GIRL FIREFLY ART',
    creator: 'Alax Max',
    price: '1.024',
    currency: 'ETH',
    image: '🧚‍♀️',
    category: 'ART',
    categoryColor: 'green'
  }
]

// ============================================================================
// METHODS
// ============================================================================

const handleBid = (cardId: string) => {
  console.log(`Bid placed for card: ${cardId}`)
  // Aquí iría la lógica para procesar la puja
}
</script>

<style scoped>
/* ============================================================================
   ESTILOS DE LAS GAMING CARDS
   ============================================================================ */

.gaming-card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.gaming-card:hover {
  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.1);
}

/* Efectos de hover para las cartas */
.gaming-card:hover .aspect-square {
  transform: scale(1.05) rotate(2deg);
  transition: transform 0.3s ease;
}

/* Animaciones de entrada */
.gaming-card {
  animation: fadeInUp 0.6s ease-out;
}

.gaming-card:nth-child(2) {
  animation-delay: 0.2s;
}

.gaming-card:nth-child(3) {
  animation-delay: 0.4s;
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

/* Responsive */
@media (max-width: 768px) {
  .gaming-card {
    margin-bottom: 2rem;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .gaming-card:hover .aspect-square {
    transform: none;
  }
  
  .gaming-card {
    animation: none;
  }
}

/* Efectos de glassmorphism */
.gaming-card {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Focus states */
button:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}
</style>
