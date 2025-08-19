<template>
  <section class="py-20 bg-slate-900 relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        
        <!-- Lado Izquierdo - Imagen del juego -->
        <div class="relative">
          <!-- Imagen principal del juego -->
          <div class="relative bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl overflow-hidden">
            <!-- Placeholder para la imagen del personaje gaming -->
            <div class="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
              <!-- Personaje gaming fantástico -->
              <div class="text-8xl">⚔️</div>
            </div>
            
            <!-- Play button overlay -->
            <div class="absolute inset-0 flex items-center justify-center">
              <button class="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                <Icon name="heroicons:play" class="w-8 h-8 text-slate-900 ml-1" />
              </button>
            </div>
          </div>
        </div>

        <!-- Lado Derecho - Información del juego -->
        <div class="space-y-8">
          <!-- Título y rate -->
          <div>
            <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">
              HUMAN GAME
            </h2>
            <div class="flex items-center space-x-2 mb-6">
              <span class="text-yellow-500 text-xl font-bold">RATE 50%</span>
            </div>
          </div>

          <!-- Descripción -->
          <p class="text-gray-400 text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis elementum sollicitudin is yaugue euismods. 
            Nulla ullamcorper. Morbi pharetra tellus miolestis, tincidunt massa venenatis.
          </p>

          <!-- Lista de juegos -->
          <div class="space-y-4">
            <!-- Chichi Dragon Ball -->
            <div class="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-green-500/50 transition-colors duration-300">
              <div class="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-xl">🐲</span>
              </div>
              <span class="text-white font-medium">Chichi Dragon Ball</span>
            </div>

            <!-- Space Babe Night -->
            <div class="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-green-500/50 transition-colors duration-300">
              <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-xl">🚀</span>
              </div>
              <span class="text-white font-medium">Space Babe Night</span>
            </div>

            <!-- Dragon Ball -->
            <div class="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-green-500/50 transition-colors duration-300">
              <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-xl">⚡</span>
              </div>
              <span class="text-white font-medium">Dragon Ball</span>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="grid grid-cols-3 gap-4 pt-8">
            <button class="bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded-lg font-medium uppercase tracking-wider transition-colors duration-300 border border-slate-600 hover:border-green-500">
              DRAGON BALL
            </button>
            <button class="bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded-lg font-medium uppercase tracking-wider transition-colors duration-300 border border-slate-600 hover:border-green-500">
              NFT MARKET
            </button>
            <button class="bg-slate-800 hover:bg-slate-700 text-white py-4 px-6 rounded-lg font-medium uppercase tracking-wider transition-colors duration-300 border border-slate-600 hover:border-green-500">
              SUPPORT
            </button>
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

interface GameItem {
  id: string
  name: string
  icon: string
  color: string
  description?: string
}

// ============================================================================
// DATA
// ============================================================================

const gameItems: GameItem[] = [
  {
    id: '1',
    name: 'Chichi Dragon Ball',
    icon: '🐲',
    color: 'orange',
    description: 'Aventura épica con personajes de Dragon Ball'
  },
  {
    id: '2',
    name: 'Space Babe Night',
    icon: '🚀',
    color: 'red',
    description: 'Exploración espacial con aventuras nocturnas'
  },
  {
    id: '3',
    name: 'Dragon Ball',
    icon: '⚡',
    color: 'yellow',
    description: 'El clásico universo de Dragon Ball'
  }
]

// ============================================================================
// METHODS
// ============================================================================

const playGame = () => {
  console.log('Playing game...')
  // Lógica para reproducir el video del juego
}

const selectGame = (gameId: string) => {
  console.log(`Game selected: ${gameId}`)
  // Lógica para seleccionar el juego
}

const openDragonBall = () => {
  console.log('Opening Dragon Ball...')
  // Navegación a Dragon Ball
}

const openNFTMarket = () => {
  console.log('Opening NFT Market...')
  // Navegación al mercado NFT
}

const openSupport = () => {
  console.log('Opening Support...')
  // Navegación al soporte
}
</script>

<style scoped>
/* ============================================================================
   ESTILOS DEL HUMAN GAME SECTION
   ============================================================================ */

/* Efectos para la imagen del juego */
.aspect-video {
  position: relative;
  overflow: hidden;
}

.aspect-video::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 50%);
  z-index: 1;
}

/* Efectos del botón de play */
.play-button {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Animaciones para los elementos de juego */
.game-item {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.game-item:hover {
  transform: translateX(8px);
}

/* Efectos de entrada */
.grid > div:nth-child(1) {
  animation: fadeInLeft 0.8s ease-out;
}

.grid > div:nth-child(2) {
  animation: fadeInRight 0.8s ease-out 0.2s both;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Efectos para los botones de acción */
.grid button:hover {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .grid.grid-cols-3 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  h2 {
    font-size: 2.5rem !important;
  }
  
  .aspect-video {
    margin-bottom: 2rem;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .game-item:hover {
    transform: none;
  }
  
  .grid > div {
    animation: none;
  }
  
  button:hover {
    transform: none;
  }
}

/* Focus states */
button:focus,
.game-item:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

/* Efectos especiales para la imagen del juego */
.relative::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(34, 197, 94, 0.1) 50%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.relative:hover::after {
  opacity: 1;
}
</style>
