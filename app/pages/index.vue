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
  title: 'VIII CIISIC 2026 | UNDC',
  meta: [
    { name: 'description', content: 'VIII CIISIC de la UNDC, del 26 al 30 de octubre de 2026 en San Vicente de Cañete.' }
  ]
})
</script>
