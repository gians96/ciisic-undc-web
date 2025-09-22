<template>
  <div 
    class="bg-secondary-800 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group"
  >
    <!-- Imagen del ponente -->
    <div class="aspect-square overflow-hidden">
      <img 
        :src="ponente.imagen" 
        :alt="`Foto de ${ponente.nombre}`"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
    </div>

    <!-- Información del ponente -->
    <div class="p-6">
      <!-- Nombre y rol -->
      <div class="mb-4">
        <h3 class="text-xl font-bold text-white mb-1">
          {{ ponente.nombre }}
        </h3>
        <p class="text-green-400 font-medium">
          {{ ponente.empresa }}
        </p>
      </div>

      <!-- Descripción -->
      <p v-if="ponente.descripcion" class="text-gray-300 text-sm mb-4 leading-relaxed">
        {{ ponente.descripcion }}
      </p>

      <!-- Especialidades -->
      <div v-if="ponente.especialidades?.length" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="especialidad in ponente.especialidades" 
            :key="especialidad"
            class="px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded-full border border-green-400/20"
          >
            {{ especialidad }}
          </span>
        </div>
      </div>

      <!-- Enlaces sociales -->
      <div class="flex space-x-3">
        <a 
          v-if="ponente.linkedin" 
          :href="ponente.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          class="w-8 h-8 bg-gray-700 hover:bg-blue-600 text-gray-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-300"
          :aria-label="`LinkedIn de ${ponente.nombre}`"
        >
          <Icon name="simple-icons:linkedin" class="w-4 h-4" />
        </a>
      </div>
    </div>

    <!-- Efecto de hover -->
    <div class="absolute inset-0 bg-gradient-to-t from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
  </div>
</template>

<script setup lang="ts">
import type { Ponente } from '~/types'

// ============================================================================
// PROPS
// ============================================================================

interface Props {
  ponente: Ponente
}

const props = defineProps<Props>()
</script>

<style scoped>
/* Efectos adicionales para la card */
.group:hover {
  box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.1);
}

/* Animación para las especialidades */
.group:hover .especialidad {
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
</style>
