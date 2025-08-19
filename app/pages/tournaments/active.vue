<!-- ============================================================================
     PÁGINA TOURNAMENTS ACTIVE - TORNEOS ACTIVOS
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900 py-20">
    <div class="custom-container">
      <div class="text-center mb-16">
        <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6">
          Torneos <span class="text-primary">Activos</span>
        </h1>
        <p class="text-xl text-gray-300 mb-8">
          Únete a los torneos que están en curso ahora mismo
        </p>
      </div>

      <!-- Tournament Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div 
          v-for="tournament in activeTournaments" 
          :key="tournament.id"
          class="bg-secondary-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
        >
          <div class="relative">
            <div class="w-full h-48 bg-gradient-to-br from-red-500/20 to-secondary-700 flex items-center justify-center">
              <Icon name="heroicons:play" class="h-16 w-16 text-red-500" />
            </div>
            <div class="absolute top-4 left-4">
              <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                EN VIVO
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
                <Icon name="heroicons:users" class="h-4 w-4 mr-2" />
                <span class="text-sm">{{ tournament.participants }} participantes</span>
              </div>
              <div class="flex items-center text-red-400">
                <Icon name="heroicons:clock" class="h-4 w-4 mr-2" />
                <span class="text-sm">{{ tournament.timeRemaining }}</span>
              </div>
            </div>
            <NuxtLink 
              :to="`/tournaments/${tournament.slug}`"
              class="w-full bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-300 block"
            >
              Ver Torneo
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="activeTournaments.length === 0" class="text-center py-16">
        <Icon name="heroicons:trophy" class="h-24 w-24 text-gray-500 mx-auto mb-6" />
        <h3 class="text-2xl font-bold text-white mb-4">No hay torneos activos</h3>
        <p class="text-gray-300 mb-8">Revisa nuestros próximos torneos o mantente atento a nuestras redes sociales</p>
        <NuxtLink 
          to="/tournaments/upcoming"
          class="bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
        >
          Ver Próximos Torneos
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Torneos Activos - MYKD',
  meta: [
    {
      name: 'description',
      content: 'Únete a los torneos activos de MYKD. Compite en tiempo real y gana premios increíbles.'
    }
  ]
})

// ============================================================================
// DATOS
// ============================================================================

const activeTournaments = ref([
  {
    id: 1,
    name: 'Copa MYKD League of Legends',
    slug: 'copa-mykd-lol',
    description: 'Final del torneo más importante del año',
    prizePool: '50,000',
    participants: 32,
    timeRemaining: '2h 45m'
  },
  {
    id: 2,
    name: 'CS:GO Showdown',
    slug: 'csgo-showdown',
    description: 'Semifinales del campeonato',
    prizePool: '25,000',
    participants: 8,
    timeRemaining: '1h 20m'
  }
])
</script>
