<template>
  <!-- La mochila y el tomatodo son negros: se apoyan en un escenario claro para no perderse sobre el fondo azul marino -->
  <div class="kit-stage flex items-center justify-center rounded-2xl p-4 sm:p-6">
    <img :src="KIT_IMAGEN" :alt="KIT_IMAGEN_ALT" width="1536" height="1024" :loading="lazy ? 'lazy' : 'eager'" decoding="async" class="kit-img h-auto w-full">
  </div>
</template>

<script setup lang="ts">
import { KIT_IMAGEN, KIT_IMAGEN_ALT } from '~/data/kit-items'

withDefaults(defineProps<{ lazy?: boolean }>(), { lazy: true })
</script>

<style scoped>
.kit-stage { background: radial-gradient(circle at 50% 45%, #f4faff 0%, #d4e8f7 55%, #a9cbe6 100%); }
.kit-img { filter: drop-shadow(0 18px 24px #020f2059); }
</style>
