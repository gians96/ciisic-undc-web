<template>
  <section class="py-20 bg-slate-900 relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        
        <!-- Lado Izquierdo - Contenido -->
        <div class="space-y-8">
          <!-- Título principal -->
          <div class="space-y-6">
            <h2 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
              A LOOK INTO<br>
              ROADMAPS<br>
              <span class="text-orange-500 bg-orange-500/20 px-4 py-2 rounded-lg">SEASONS</span>
            </h2>
            
            <!-- Descripción -->
            <p class="text-gray-400 text-lg leading-relaxed max-w-md">
              With Season 1 Ending with our play and Duis elementum sollicitudin is yaugue euismods 
              <span class="text-blue-400">Nulla ulla</span> Player-focused updates games from Mobile App and Enjoy.
            </p>
          </div>

          <!-- Dispositivo móvil placeholder -->
          <div class="pt-8">
            <div class="relative w-48 h-80 bg-gradient-to-b from-slate-700 to-slate-800 rounded-3xl p-4 mx-auto lg:mx-0 border border-slate-600">
              <!-- Pantalla del móvil -->
              <div class="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center">
                <div class="text-4xl">📱</div>
              </div>
              
              <!-- Efectos decorativos -->
              <div class="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <div class="absolute -bottom-2 -left-2 w-6 h-6 border-2 border-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <!-- Lado Derecho - Seasons List -->
        <div class="space-y-6">
          
          <!-- Season 1 -->
          <div class="season-card bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold text-white">SEASON 1</h3>
              <div class="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🎯</span>
              </div>
            </div>
            <p class="text-gray-400 text-sm">
              Primera temporada con características básicas y modo de juego principal.
            </p>
            
            <!-- Progress bar -->
            <div class="mt-4">
              <div class="w-full bg-slate-700 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 100%"></div>
              </div>
              <p class="text-xs text-green-500 mt-1">Completado</p>
            </div>
          </div>

          <!-- Season 2 -->
          <div class="season-card bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold text-white">SEASON 2</h3>
              <div class="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                <span class="text-2xl">⚔️</span>
              </div>
            </div>
            <p class="text-gray-400 text-sm">
              Nueva expansión con modos de juego avanzados y mejoras en el sistema PvP.
            </p>
            
            <!-- Progress bar -->
            <div class="mt-4">
              <div class="w-full bg-slate-700 rounded-full h-2">
                <div class="bg-yellow-500 h-2 rounded-full" style="width: 75%"></div>
              </div>
              <p class="text-xs text-yellow-500 mt-1">En progreso</p>
            </div>
          </div>

          <!-- Season 3 -->
          <div class="season-card bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-2xl font-bold text-white">SEASON 3</h3>
              <div class="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🚀</span>
              </div>
            </div>
            <p class="text-gray-400 text-sm">
              Futuras actualizaciones con tecnología blockchain y sistema de recompensas NFT.
            </p>
            
            <!-- Progress bar -->
            <div class="mt-4">
              <div class="w-full bg-slate-700 rounded-full h-2">
                <div class="bg-gray-500 h-2 rounded-full" style="width: 25%"></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">Próximamente</p>
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

interface Season {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  status: 'completed' | 'in-progress' | 'upcoming'
  features?: string[]
}

// ============================================================================
// DATA
// ============================================================================

const seasons: Season[] = [
  {
    id: '1',
    title: 'SEASON 1',
    description: 'Primera temporada con características básicas y modo de juego principal.',
    icon: '🎯',
    progress: 100,
    status: 'completed',
    features: ['Modo básico de juego', 'Sistema de puntuación', 'Perfiles de usuario']
  },
  {
    id: '2',
    title: 'SEASON 2',
    description: 'Nueva expansión con modos de juego avanzados y mejoras en el sistema PvP.',
    icon: '⚔️',
    progress: 75,
    status: 'in-progress',
    features: ['Modo PvP avanzado', 'Nuevos mapas', 'Sistema de clanes']
  },
  {
    id: '3',
    title: 'SEASON 3',
    description: 'Futuras actualizaciones con tecnología blockchain y sistema de recompensas NFT.',
    icon: '🚀',
    progress: 25,
    status: 'upcoming',
    features: ['Integración blockchain', 'NFT rewards', 'Metaverso']
  }
]

// ============================================================================
// COMPUTED
// ============================================================================

const getStatusColor = (status: Season['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-500'
    case 'in-progress':
      return 'text-yellow-500'
    case 'upcoming':
      return 'text-gray-500'
    default:
      return 'text-gray-500'
  }
}

const getStatusText = (status: Season['status']) => {
  switch (status) {
    case 'completed':
      return 'Completado'
    case 'in-progress':
      return 'En progreso'
    case 'upcoming':
      return 'Próximamente'
    default:
      return 'Desconocido'
  }
}

const getProgressColor = (status: Season['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500'
    case 'in-progress':
      return 'bg-yellow-500'
    case 'upcoming':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}
</script>

<style scoped>
/* ============================================================================
   ESTILOS DEL ROADMAP SEASONS
   ============================================================================ */

/* Efectos para las cards de seasons */
.season-card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.season-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(34, 197, 94, 0.1);
}

/* Animaciones de entrada */
.grid > div:nth-child(1) {
  animation: fadeInLeft 0.8s ease-out;
}

.grid > div:nth-child(2) {
  animation: fadeInRight 0.8s ease-out 0.2s both;
}

.season-card:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.season-card:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

.season-card:nth-child(3) {
  animation: fadeInUp 0.6s ease-out 0.7s both;
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

/* Efectos del dispositivo móvil */
.w-48.h-80 {
  box-shadow: 
    0 0 50px rgba(34, 197, 94, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.w-48.h-80:hover {
  transform: scale(1.05) rotate(2deg);
  transition: transform 0.3s ease;
}

/* Efectos de las barras de progreso */
.bg-green-500,
.bg-yellow-500,
.bg-gray-500 {
  transition: width 1s ease-in-out;
  position: relative;
}

.bg-green-500::after,
.bg-yellow-500::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Responsive */
@media (max-width: 768px) {
  h2 {
    font-size: 2.5rem !important;
    line-height: 1.2;
  }
  
  .w-48.h-80 {
    width: 12rem;
    height: 18rem;
  }
  
  .season-card {
    margin-bottom: 1.5rem;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .season-card:hover,
  .w-48.h-80:hover {
    transform: none;
  }
  
  .grid > div,
  .season-card {
    animation: none;
  }
  
  .bg-green-500::after,
  .bg-yellow-500::after {
    animation: none;
  }
}

/* Focus states */
.season-card:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

/* Glassmorphism effects */
.season-card {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
