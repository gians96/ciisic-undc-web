<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Hero Section -->
    <SectionsHeroSection />
    
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
  title: 'VII CIISIC - Gaming Platform',
  meta: [
    { name: 'description', content: 'Professional gaming platform with tournaments, NFTs, and community features' }
  ]
})
</script>
