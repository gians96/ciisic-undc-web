<template>
  <Teleport to="body">
    <!-- Search Overlay -->
    <Transition
      name="search-fade"
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        @click="closeSearch"
        role="dialog"
        aria-modal="true"
        aria-label="Búsqueda global"
      >
        <!-- Search Container -->
        <div class="flex items-start justify-center min-h-screen pt-16 px-4">
          <Transition
            name="search-scale"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isOpen"
              class="w-full max-w-2xl bg-secondary-800 rounded-2xl shadow-2xl overflow-hidden"
              @click.stop
            >
              <!-- Search Input -->
              <div class="relative p-6 border-b border-secondary-700">
                <div class="relative">
                  <Icon 
                    name="heroicons:magnifying-glass" 
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                  />
                  <input
                    ref="searchInput"
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar torneos, equipos, jugadores..."
                    class="w-full pl-12 pr-12 py-4 bg-secondary-700 border border-secondary-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    @keydown.escape="closeSearch"
                    @keydown.down="navigateResults('down')"
                    @keydown.up="navigateResults('up')"
                    @keydown.enter="selectResult"
                  />
                  <button
                    v-if="searchQuery"
                    @click="clearSearch"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label="Limpiar búsqueda"
                  >
                    <Icon name="heroicons:x-mark" class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Search Results -->
              <div v-if="searchQuery" class="max-h-96 overflow-y-auto">
                <!-- Loading State -->
                <div v-if="isLoading" class="p-8 text-center">
                  <Icon name="heroicons:arrow-path" class="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
                  <p class="text-gray-400">Buscando...</p>
                </div>

                <!-- Results -->
                <div v-else-if="searchResults.length > 0" class="p-4">
                  <!-- Categories -->
                  <div v-for="category in groupedResults" :key="category.type" class="mb-6 last:mb-0">
                    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                      {{ category.title }}
                    </h3>
                    <ul class="space-y-1">
                      <li 
                        v-for="(result, index) in category.items" 
                        :key="result.id"
                        :class="{ 'bg-secondary-700': selectedIndex === getGlobalIndex(category.type, index) }"
                        class="rounded-lg"
                      >
                        <NuxtLink
                          :to="result.href"
                          @click="closeSearch"
                          class="flex items-center p-3 text-gray-300 hover:text-white hover:bg-secondary-700 rounded-lg transition-all duration-200"
                        >
                          <!-- Icon -->
                          <div class="flex-shrink-0 w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center mr-3">
                            <Icon :name="result.icon" class="h-5 w-5 text-primary" />
                          </div>
                          
                          <!-- Content -->
                          <div class="flex-1 min-w-0">
                            <p class="font-medium truncate" v-html="highlightMatch(result.title)"></p>
                            <p class="text-sm text-gray-400 truncate" v-html="highlightMatch(result.description)"></p>
                          </div>

                          <!-- Badge -->
                          <span v-if="result.badge" class="ml-3 px-2 py-1 text-xs bg-primary text-black rounded-full font-semibold">
                            {{ result.badge }}
                          </span>
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- No Results -->
                <div v-else class="p-8 text-center">
                  <Icon name="heroicons:magnifying-glass" class="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p class="text-gray-400 mb-2">No se encontraron resultados</p>
                  <p class="text-sm text-gray-500">
                    Intenta con términos diferentes o menos específicos
                  </p>
                </div>
              </div>

              <!-- Quick Actions -->
              <div v-else class="p-6">
                <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Accesos Rápidos
                </h3>
                <div class="grid grid-cols-2 gap-3">
                  <NuxtLink
                    v-for="action in quickActions"
                    :key="action.id"
                    :to="action.href"
                    @click="closeSearch"
                    class="flex items-center p-3 bg-secondary-700 hover:bg-secondary-600 rounded-lg transition-colors duration-200"
                  >
                    <Icon :name="action.icon" class="h-5 w-5 text-primary mr-3" />
                    <span class="text-sm text-gray-300">{{ action.label }}</span>
                  </NuxtLink>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-secondary-700 px-6 py-4">
                <div class="flex items-center justify-between text-xs text-gray-500">
                  <div class="flex items-center space-x-4">
                    <kbd class="px-2 py-1 bg-secondary-700 rounded border border-secondary-600">↑↓</kbd>
                    <span>para navegar</span>
                  </div>
                  <div class="flex items-center space-x-4">
                    <kbd class="px-2 py-1 bg-secondary-700 rounded border border-secondary-600">Enter</kbd>
                    <span>para seleccionar</span>
                  </div>
                  <div class="flex items-center space-x-4">
                    <kbd class="px-2 py-1 bg-secondary-700 rounded border border-secondary-600">Esc</kbd>
                    <span>para cerrar</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { storeToRefs } from 'pinia'
import { useLayoutStore } from '~/stores/layout'
import type { ISearchResult } from '~/types'

// ============================================================================
// STORES
// ============================================================================

const layoutStore = useLayoutStore()
const { isSearchOpen } = storeToRefs(layoutStore)

// ============================================================================
// REFS
// ============================================================================

const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const searchResults = ref<ISearchResult[]>([])
const isLoading = ref(false)
const selectedIndex = ref(0)

// ============================================================================
// COMPUTED
// ============================================================================

const isOpen = computed(() => isSearchOpen.value)

const quickActions = computed(() => [
  {
    id: 'tournaments',
    label: 'Torneos',
    href: '/tournaments',
    icon: 'heroicons:trophy'
  },
  {
    id: 'teams',
    label: 'Equipos',
    href: '/teams',
    icon: 'heroicons:user-group'
  },
  {
    id: 'shop',
    label: 'Tienda',
    href: '/shop',
    icon: 'heroicons:shopping-bag'
  },
  {
    id: 'rankings',
    label: 'Rankings',
    href: '/rankings',
    icon: 'heroicons:chart-bar'
  }
])

const groupedResults = computed(() => {
  const groups = searchResults.value.reduce((acc: Record<string, ISearchResult[]>, result: ISearchResult) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type]!.push(result)
    return acc
  }, {} as Record<string, ISearchResult[]>)

  return Object.entries(groups).map(([type, items]: [string, ISearchResult[]]) => ({
    type,
    title: getTypeTitle(type),
    items: items.slice(0, 5) // Limitar a 5 resultados por categoría
  }))
})

// ============================================================================
// METHODS
// ============================================================================

const closeSearch = () => {
  layoutStore.closeSearch()
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = 0
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = 0
  searchInput.value?.focus()
}

const performSearch = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true

  try {
    // Simular búsqueda - aquí iría la llamada real a la API
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Resultados mock
    searchResults.value = [
      {
        id: '1',
        type: 'tournament',
        title: 'Torneo Mundial de League of Legends',
        description: 'El torneo más importante del año',
        href: '/tournaments/lol-worlds',
        icon: 'heroicons:trophy',
        badge: 'EN VIVO'
      },
      {
        id: '2',
        type: 'team',
        title: 'Team MYKD',
        description: 'Equipo profesional de CS:GO',
        href: '/teams/mykd',
        icon: 'heroicons:user-group'
      },
      {
        id: '3',
        type: 'product',
        title: 'Teclado Gaming RGB',
        description: 'Teclado mecánico para gaming profesional',
        href: '/shop/keyboard-rgb',
        icon: 'heroicons:computer-desktop'
      }
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    )
  } catch (error) {
    console.error('Error en búsqueda:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

const navigateResults = (direction: 'up' | 'down') => {
  const totalResults = searchResults.value.length
  if (totalResults === 0) return

  if (direction === 'down') {
    selectedIndex.value = (selectedIndex.value + 1) % totalResults
  } else {
    selectedIndex.value = selectedIndex.value === 0 ? totalResults - 1 : selectedIndex.value - 1
  }
}

const selectResult = () => {
  const result = searchResults.value[selectedIndex.value]
  if (result) {
    navigateTo(result.href)
    closeSearch()
  }
}

const getGlobalIndex = (type: string, localIndex: number): number => {
  let globalIndex = 0
  for (const group of groupedResults.value) {
    if (group.type === type) {
      return globalIndex + localIndex
    }
    globalIndex += group.items.length
  }
  return globalIndex
}

const getTypeTitle = (type: string): string => {
  const titles: Record<string, string> = {
    tournament: 'Torneos',
    team: 'Equipos',
    player: 'Jugadores',
    product: 'Productos',
    news: 'Noticias'
  }
  return titles[type] || type
}

const highlightMatch = (text: string): string => {
  if (!searchQuery.value) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-primary text-black px-1 rounded">$1</mark>')
}

// ============================================================================
// WATCHERS
// ============================================================================

let searchTimeout: NodeJS.Timeout | null = null

watch(searchQuery, (newQuery: string) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    if (newQuery) {
      performSearch(newQuery)
    } else {
      searchResults.value = []
    }
  }, 300)
})

watch(isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      searchInput.value?.focus()
    })
    selectedIndex.value = 0
  }
})

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    // Ctrl/Cmd + K para abrir búsqueda
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      if (!isOpen.value) {
        layoutStore.openSearch()
      }
    }
  }

  document.addEventListener('keydown', handleKeydown)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS DE BÚSQUEDA GLOBAL
   ============================================================================ */

/* Transitions */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.3s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

.search-scale-enter-active,
.search-scale-leave-active {
  transition: all 0.3s ease;
}

.search-scale-enter-from,
.search-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Highlight Animation */
mark {
  animation: highlight 0.3s ease-in-out;
}

@keyframes highlight {
  from {
    background-color: transparent;
  }
  to {
    background-color: #45f882;
  }
}

/* Scrollbar Styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgb(55 65 81);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgb(107 114 128);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgb(156 163 175);
}

/* Keyboard Navigation */
.search-result:focus,
.search-result:focus-visible {
  outline: none;
  background-color: rgb(55 65 81);
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-container {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .search-fade-enter-active,
  .search-fade-leave-active,
  .search-scale-enter-active,
  .search-scale-leave-active {
    transition: none !important;
  }
  
  mark {
    animation: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .search-result:hover {
    background-color: #ffffff;
    color: #000000;
  }
  
  mark {
    background-color: #ffff00;
    color: #000000;
  }
}
</style>
