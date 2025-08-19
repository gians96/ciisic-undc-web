<template>
  <section class="py-20 bg-slate-900 relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      
      <!-- Título de la sección -->
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">
          TOP RATED STREAMERS
        </h2>
        <!-- Línea decorativa verde -->
        <div class="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-center space-x-6 mb-16">
        <button class="btn-hero bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-8 py-3 font-bold uppercase tracking-wider transition-all duration-300">
          <span class="flex items-center">
            <Icon name="heroicons:play" class="w-5 h-5 mr-2" />
            BUY HERO
          </span>
        </button>
        
        <button class="btn-nft bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-3 font-bold uppercase tracking-wider transition-all duration-300">
          <span class="flex items-center">
            <Icon name="heroicons:cube" class="w-5 h-5 mr-2" />
            BUY NFTS
          </span>
        </button>
      </div>

      <!-- Grid de streamers -->
      <div class="flex justify-center">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl">
          
          <!-- Streamer 1 -->
          <div class="streamer-card group">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-2xl border-4 border-slate-700 group-hover:border-green-500 transition-colors duration-300">
                🎮
              </div>
              <!-- Indicador online -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div class="mt-3 text-center">
              <p class="text-white text-sm font-medium">Gamer Pro</p>
              <p class="text-green-500 text-xs">ONLINE</p>
            </div>
          </div>

          <!-- Streamer 2 -->
          <div class="streamer-card group">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl border-4 border-slate-700 group-hover:border-green-500 transition-colors duration-300">
                🎯
              </div>
              <!-- Indicador online -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div class="mt-3 text-center">
              <p class="text-white text-sm font-medium">Ace Sniper</p>
              <p class="text-green-500 text-xs">ONLINE</p>
            </div>
          </div>

          <!-- Streamer 3 -->
          <div class="streamer-card group">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl border-4 border-slate-700 group-hover:border-green-500 transition-colors duration-300">
                ⚡
              </div>
              <!-- Indicador online -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div class="mt-3 text-center">
              <p class="text-white text-sm font-medium">Lightning</p>
              <p class="text-green-500 text-xs">ONLINE</p>
            </div>
          </div>

          <!-- Streamer 4 -->
          <div class="streamer-card group">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-2xl border-4 border-slate-700 group-hover:border-green-500 transition-colors duration-300">
                🏆
              </div>
              <!-- Indicador online -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div class="mt-3 text-center">
              <p class="text-white text-sm font-medium">Champion</p>
              <p class="text-green-500 text-xs">ONLINE</p>
            </div>
          </div>

          <!-- Streamer 5 -->
          <div class="streamer-card group">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-2xl border-4 border-slate-700 group-hover:border-green-500 transition-colors duration-300">
                🎭
              </div>
              <!-- Indicador online -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div class="mt-3 text-center">
              <p class="text-white text-sm font-medium">Phantom</p>
              <p class="text-green-500 text-xs">ONLINE</p>
            </div>
          </div>

          <!-- Streamer 6 -->
          <div class="streamer-card group">
            <div class="relative">
              <div class="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-2xl border-4 border-slate-700 group-hover:border-green-500 transition-colors duration-300">
                🚀
              </div>
              <!-- Indicador online -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div class="mt-3 text-center">
              <p class="text-white text-sm font-medium">Rocket</p>
              <p class="text-green-500 text-xs">ONLINE</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Separador decorativo -->
      <div class="mt-20 border-t border-slate-700"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
// ============================================================================
// INTERFACES
// ============================================================================

interface Streamer {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline'
  viewers?: number
  game?: string
}

// ============================================================================
// DATA
// ============================================================================

const streamers: Streamer[] = [
  {
    id: '1',
    name: 'Gamer Pro',
    avatar: '🎮',
    status: 'online',
    viewers: 1250,
    game: 'Valorant'
  },
  {
    id: '2',
    name: 'Ace Sniper',
    avatar: '🎯',
    status: 'online',
    viewers: 980,
    game: 'CS:GO'
  },
  {
    id: '3',
    name: 'Lightning',
    avatar: '⚡',
    status: 'online',
    viewers: 2100,
    game: 'Fortnite'
  },
  {
    id: '4',
    name: 'Champion',
    avatar: '🏆',
    status: 'online',
    viewers: 1750,
    game: 'League of Legends'
  },
  {
    id: '5',
    name: 'Phantom',
    avatar: '🎭',
    status: 'online',
    viewers: 890,
    game: 'Overwatch'
  },
  {
    id: '6',
    name: 'Rocket',
    avatar: '🚀',
    status: 'online',
    viewers: 1450,
    game: 'Rocket League'
  }
]

// ============================================================================
// METHODS
// ============================================================================

const buyHero = () => {
  console.log('Buy Hero clicked')
  // Lógica para comprar hero
}

const buyNFTs = () => {
  console.log('Buy NFTs clicked')
  // Lógica para comprar NFTs
}

const viewStreamer = (streamerId: string) => {
  console.log(`Viewing streamer: ${streamerId}`)
  // Lógica para ver el stream
}
</script>

<style scoped>
/* ============================================================================
   ESTILOS DE LOS STREAMERS
   ============================================================================ */

/* Botones con clip-path */
.btn-hero,
.btn-nft {
  clip-path: polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%);
}

/* Efectos de hover para streamers */
.streamer-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.streamer-card:hover {
  transform: translateY(-5px);
}

/* Animaciones para los avatares */
.streamer-card:hover .rounded-full {
  animation: pulse-glow 1.5s infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.6);
  }
}

/* Indicador de estado online */
.streamer-card .absolute .w-2 {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Animaciones de entrada */
.streamer-card {
  animation: fadeInUp 0.6s ease-out;
}

.streamer-card:nth-child(1) { animation-delay: 0.1s; }
.streamer-card:nth-child(2) { animation-delay: 0.2s; }
.streamer-card:nth-child(3) { animation-delay: 0.3s; }
.streamer-card:nth-child(4) { animation-delay: 0.4s; }
.streamer-card:nth-child(5) { animation-delay: 0.5s; }
.streamer-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .btn-hero,
  .btn-nft {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .flex.space-x-6 {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .streamer-card:hover {
    transform: none;
  }
  
  .streamer-card:hover .rounded-full {
    animation: none;
  }
  
  .streamer-card {
    animation: none;
  }
}

/* Focus states */
.btn-hero:focus,
.btn-nft:focus,
.streamer-card:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}
</style>
