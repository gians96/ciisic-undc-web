<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Hero Section -->
    <SectionsHeroSection />

    <!-- Memorias 2024 -->
    <SectionsMemorias />

    <!-- Ponentes para el congreso no hay ni pincho -->
    <SectionsPonentes />
    
    <!-- Gaming Cards Section -->
    <SectionsGamingCardsSection />
    
    <!-- Top Trending Section -->
    <SectionsTopTrendingSection />
    
    <!-- Top Streamers Section -->
    <SectionsTopStreamersSection />
    
    <!-- Human Game Section -->
    <SectionsHumanGameSection />
    
    <!-- Active Team Section -->
    <SectionsActiveTeamSection />
    
    <!-- Join Community Section -->
    <SectionsJoinCommunitySection />
    
    <!-- Roadmap Seasons Section -->
    <SectionsRoadmapSeasonsSection />
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
