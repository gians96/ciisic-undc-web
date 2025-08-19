<!-- ============================================================================
     PÁGINA TOURNAMENTS UPCOMING - PRÓXIMOS TORNEOS
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900 py-20">
    <div class="custom-container">
      <div class="text-center mb-16">
        <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6">
          Próximos <span class="text-primary">Torneos</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8">
          Regístrate ahora para los torneos que vienen
        </p>
      </div>

      <!-- Tournament Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div 
          v-for="tournament in upcomingTournaments" 
          :key="tournament.id"
          class="bg-secondary-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
        >
          <div class="relative">
            <div class="w-full h-48 bg-gradient-to-br from-blue-500/20 to-secondary-700 flex items-center justify-center">
              <Icon name="heroicons:calendar" class="h-16 w-16 text-blue-500" />
            </div>
            <div class="absolute top-4 left-4">
              <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                PRÓXIMAMENTE
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
              <div class="flex items-center text-blue-400">
                <Icon name="heroicons:users" class="h-4 w-4 mr-2" />
                <span class="text-sm">{{ tournament.registered }}/{{ tournament.maxParticipants }}</span>
              </div>
            </div>
            <div class="flex gap-3">
              <NuxtLink 
                :to="`/tournaments/${tournament.slug}`"
                class="flex-1 bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-300"
              >
                Ver Detalles
              </NuxtLink>
              <button 
                @click="registerForTournament(tournament.id)"
                class="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { useLayoutStore } from '~/stores/layout'

// ============================================================================
// STORES
// ============================================================================

const layoutStore = useLayoutStore()

// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Próximos Torneos - MYKD',
  meta: [
    {
      name: 'description',
      content: 'Regístrate para los próximos torneos de MYKD. No te pierdas la oportunidad de competir.'
    }
  ]
})

// ============================================================================
// DATOS
// ============================================================================

const upcomingTournaments = ref([
  {
    id: 1,
    name: 'MYKD Valorant Masters',
    slug: 'valorant-masters',
    description: 'Torneo clasificatorio para el campeonato mundial',
    prizePool: '25,000',
    startDate: new Date('2025-09-01'),
    registered: 18,
    maxParticipants: 32
  },
  {
    id: 2,
    name: 'Fortnite Solos Cup',
    slug: 'fortnite-solos',
    description: 'Competencia individual de Battle Royale',
    prizePool: '15,000',
    startDate: new Date('2025-08-30'),
    registered: 64,
    maxParticipants: 100
  },
  {
    id: 3,
    name: 'FIFA 25 Championship',
    slug: 'fifa-championship',
    description: 'El torneo de fútbol virtual más competitivo',
    prizePool: '10,000',
    startDate: new Date('2025-09-10'),
    registered: 12,
    maxParticipants: 64
  }
])

// ============================================================================
// METHODS
// ============================================================================

const registerForTournament = async (tournamentId: number) => {
  try {
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

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
</script>
