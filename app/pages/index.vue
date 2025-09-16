<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Hero Section -->
    <SectionsHeroSection />

    <!-- Memorias 2024 -->
    <SectionsMemorias />

    <!-- Ponentes para el congreso no hay ni pincho -->
    <SectionsPonentes />
    
    <!-- Top Trending Section - Eventos y concursos -->
    <SectionsTopTrendingSection />
    
    <!-- Human Game Section - Mapa ubicacion -->
    <SectionsHumanGameSection />
    
    <!-- Active Team Section - comite de estudiantes -->
    <SectionsActiveTeamSection />

  </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'VII CIISIC | UNDC',
  meta: [
    { name: 'description', content: 'Sistema de informacion del VII CIISIC' }
  ]
})
</script>
