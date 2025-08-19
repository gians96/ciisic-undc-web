<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Configuración global de la app
useHead({
  titleTemplate: '%s | MYKD - eSports & Gaming',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#45f882' }
  ]
})
</script>
