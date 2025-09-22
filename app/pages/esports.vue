<!-- ============================================================================
     PÁGINA TOURNAMENTS - TORNEOS
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900">
    <!-- Hero Section -->
    <section class="py-20 lg:py-32">
      <div class="custom-container">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6">
            <span class="text-primary">Torneos</span> eSports
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            Participa en los torneos más emocionantes y compite por premios increíbles. 
            Desde principiantes hasta profesionales, hay un lugar para todos.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/tournaments/active"
              class="bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Ver Torneos Activos
            </NuxtLink>
            <NuxtLink 
              to="/tournaments/upcoming"
              class="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
            >
              Próximos Torneos
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Tournament Categories -->
    <section class="py-20 bg-secondary-800">
      <div class="custom-container">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            Categorías de Torneos
          </h2>
          <p class="text-gray-300 text-lg">
            Encuentra el torneo perfecto para tu nivel y juego favorito
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="category in tournamentCategories" 
            :key="category.id"
            class="bg-secondary-700 rounded-2xl p-6 hover:bg-secondary-600 transition-all duration-300 cursor-pointer group"
            @click="navigateToCategory(category.slug)"
          >
            <div class="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon :name="category.icon" class="h-8 w-8 text-black" />
            </div>
            <h3 class="text-xl font-semibold text-white text-center mb-4">{{ category.name }}</h3>
            <p class="text-gray-300 text-center mb-4">{{ category.description }}</p>
            <div class="text-center">
              <span class="text-primary font-semibold">{{ category.activeCount }} torneos activos</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Tournaments -->
    <section class="py-20">
      <div class="custom-container">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            Torneos Destacados
          </h2>
          <p class="text-gray-300 text-lg">
            Los eventos más importantes del momento
          </p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div 
            v-for="tournament in featuredTournaments" 
            :key="tournament.id"
            class="bg-secondary-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
          >
            <div class="relative">
              <div class="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary-700 flex items-center justify-center">
                <Icon name="heroicons:trophy" class="h-16 w-16 text-primary" />
              </div>
              <div class="absolute top-4 left-4">
                <span 
                  class="px-3 py-1 rounded-full text-sm font-semibold"
                  :class="getStatusClass(tournament.status)"
                >
                  {{ tournament.status }}
                </span>
              </div>
              <div class="absolute top-4 right-4">
                <span class="bg-primary text-black px-3 py-1 rounded-full text-sm font-bold">
                  ${{ tournament.prizePool }}
                </span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-white mb-2">{{ tournament.name }}</h3>
              <p class="text-gray-300 mb-4">{{ tournament.description }}</p>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center text-gray-400">
                  <Icon name="heroicons:calendar" class="h-4 w-4 mr-2" />
                  <span class="text-sm">{{ formatDate(tournament.startDate) }}</span>
                </div>
                <div class="flex items-center text-gray-400">
                  <Icon name="heroicons:users" class="h-4 w-4 mr-2" />
                  <span class="text-sm">{{ tournament.participants }}/{{ tournament.maxParticipants }}</span>
                </div>
              </div>
              <div class="flex gap-3">
                <NuxtLink 
                  :to="`/tournaments/${tournament.slug}`"
                  class="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-300"
                >
                  Ver Detalles
                </NuxtLink>
                <button 
                  v-if="tournament.status === 'Inscripciones Abiertas'"
                  @click="registerForTournament(tournament.id)"
                  class="flex-1 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  Inscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tournament Rules -->
    <section class="py-20 bg-secondary-800">
      <div class="custom-container">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
              Reglas Generales
            </h2>
            <p class="text-gray-300 text-lg">
              Información importante para todos los participantes
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span class="text-black font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Registro Obligatorio</h3>
                  <p class="text-gray-300">Todos los participantes deben registrarse antes de la fecha límite.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span class="text-black font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Fair Play</h3>
                  <p class="text-gray-300">Respeto mutuo y juego limpio son fundamentales en todos nuestros eventos.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span class="text-black font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Configuración Estándar</h3>
                  <p class="text-gray-300">Todos los juegos utilizan configuraciones oficiales y mapas aprobados.</p>
                </div>
              </div>
            </div>
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span class="text-black font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Comunicación</h3>
                  <p class="text-gray-300">Mantente conectado en nuestro Discord oficial durante los eventos.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span class="text-black font-bold text-sm">5</span>
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Premios</h3>
                  <p class="text-gray-300">Los premios se distribuyen dentro de 48 horas después del torneo.</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <span class="text-black font-bold text-sm">6</span>
                </div>
                <div>
                  <h3 class="text-white font-semibold mb-2">Soporte</h3>
                  <p class="text-gray-300">Nuestro equipo está disponible 24/7 durante los eventos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'

// ============================================================================
// STORES
// ============================================================================

const layoutStore = useLayoutStore()

// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'eSports | VII CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Participa en los mejores torneos de eSports en el VII CIISIC. Compite por premios increíbles.'
    },
    {
      property: 'og:title',
      content: 'eSports | VII CIISIC'
    },
    {
      property: 'og:description',
      content: 'Participa en los mejores torneos de eSports en el VII CIISIC. Compite por premios increíbles.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// ============================================================================
// DATOS DE LA PÁGINA
// ============================================================================

const tournamentCategories = ref([
  {
    id: 1,
    name: 'MOBA',
    slug: 'moba',
    description: 'League of Legends, Dota 2 y más',
    icon: 'heroicons:shield-check',
    activeCount: 12
  },
  {
    id: 2,
    name: 'FPS',
    slug: 'fps',
    description: 'CS:GO, Valorant, Apex Legends',
    icon: 'heroicons:bolt',
    activeCount: 8
  },
  {
    id: 3,
    name: 'Battle Royale',
    slug: 'battle-royale',
    description: 'Fortnite, PUBG, Warzone',
    icon: 'heroicons:globe-americas',
    activeCount: 6
  },
  {
    id: 4,
    name: 'Fighting',
    slug: 'fighting',
    description: 'Street Fighter, Tekken, Mortal Kombat',
    icon: 'heroicons:fire',
    activeCount: 4
  },
  {
    id: 5,
    name: 'Sports',
    slug: 'sports',
    description: 'FIFA, NBA 2K, Rocket League',
    icon: 'heroicons:trophy',
    activeCount: 7
  },
  {
    id: 6,
    name: 'RTS',
    slug: 'rts',
    description: 'StarCraft 2, Age of Empires',
    icon: 'heroicons:puzzle-piece',
    activeCount: 3
  }
])

const featuredTournaments = ref([
  {
    id: 1,
    name: 'Copa MYKD League of Legends',
    slug: 'copa-mykd-lol',
    description: 'El torneo más importante del año de League of Legends con equipos de toda Latinoamérica.',
    image: '/images/tournaments/lol-tournament.jpg',
    status: 'En Vivo',
    prizePool: '50,000',
    startDate: new Date('2025-08-25'),
    participants: 32,
    maxParticipants: 32
  },
  {
    id: 2,
    name: 'MYKD Valorant Masters',
    slug: 'valorant-masters',
    description: 'Torneo clasificatorio para el campeonato mundial de Valorant.',
    image: '/images/tournaments/valorant-tournament.jpg',
    status: 'Inscripciones Abiertas',
    prizePool: '25,000',
    startDate: new Date('2025-09-01'),
    participants: 18,
    maxParticipants: 32
  },
  {
    id: 3,
    name: 'CS:GO Championship',
    slug: 'csgo-championship',
    description: 'El evento más competitivo de Counter-Strike con los mejores equipos.',
    image: '/images/tournaments/csgo-tournament.jpg',
    status: 'Próximamente',
    prizePool: '75,000',
    startDate: new Date('2025-09-15'),
    participants: 0,
    maxParticipants: 16
  },
  {
    id: 4,
    name: 'Fortnite Solos Cup',
    slug: 'fortnite-solos',
    description: 'Competencia individual de Fortnite con formato Battle Royale.',
    image: '/images/tournaments/fortnite-tournament.jpg',
    status: 'Inscripciones Abiertas',
    prizePool: '15,000',
    startDate: new Date('2025-08-30'),
    participants: 64,
    maxParticipants: 100
  }
])

// ============================================================================
// METHODS
// ============================================================================

const navigateToCategory = (slug: string) => {
  navigateTo(`/tournaments/category/${slug}`)
}

const registerForTournament = async (tournamentId: number) => {
  try {
    // Aquí iría la lógica de registro al torneo
    layoutStore.showSuccess(
      '¡Te has registrado exitosamente al torneo!',
      'Registro Completado'
    )
  } catch (error) {
    layoutStore.showError(
      'Error al registrarse al torneo. Inténtalo de nuevo.',
      'Error de Registro'
    )
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'En Vivo':
      return 'bg-red-500 text-white'
    case 'Inscripciones Abiertas':
      return 'bg-green-500 text-white'
    case 'Próximamente':
      return 'bg-blue-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
</script>

<style scoped>
/* ============================================================================
   ESTILOS ESPECÍFICOS DE LA PÁGINA TOURNAMENTS
   ============================================================================ */

/* Category Cards */
.category-card {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: #45f882;
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(69, 248, 130, 0.1);
}

/* Tournament Cards */
.tournament-card {
  transition: all 0.3s ease;
  border: 1px solid rgb(75 85 99);
}

.tournament-card:hover {
  border-color: #45f882;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

/* Status Badges */
.status-live {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Prize Pool Styling */
.prize-pool {
  background: linear-gradient(135deg, #45f882 0%, #3ad66d 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Rules Section */
.rule-number {
  background: linear-gradient(135deg, #45f882 0%, #3ad66d 100%);
}

/* Button Animations */
.btn-primary {
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tournament-grid {
    grid-template-columns: 1fr;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-buttons {
    flex-direction: column;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .category-card:hover,
  .tournament-card:hover,
  .btn-primary::before,
  .status-live {
    animation: none;
    transform: none;
    transition: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .category-card,
  .tournament-card {
    border: 2px solid #ffffff;
  }
  
  .category-card:hover,
  .tournament-card:hover {
    border-color: #45f882;
  }
}

/* Loading States */
.loading-skeleton {
  background: linear-gradient(90deg, rgb(55 65 81) 25%, rgb(75 85 99) 50%, rgb(55 65 81) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
