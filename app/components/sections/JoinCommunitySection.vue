<template>
  <section class="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0">
      <div class="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full mb-6">
          <Icon name="heroicons:users" class="w-5 h-5 text-green-400" />
          <span class="text-green-400 font-medium">Join Community</span>
        </div>
        
        <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6">
          Join Our <span class="text-green-400">Gaming</span> Community
        </h2>
        
        <p class="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Connect with over 5,000+ gamers, participate in exclusive tournaments, 
          and get early access to new features and NFT drops.
        </p>
      </div>

      <!-- Community Stats & Discord -->
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Community Stats -->
        <div class="space-y-8">
          <div class="grid grid-cols-2 gap-6">
            <!-- Active Members -->
            <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
              <div class="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:user-group" class="w-8 h-8 text-green-400" />
              </div>
              <div class="text-3xl font-bold text-white mb-2">5,247</div>
              <div class="text-slate-400">Active Members</div>
            </div>

            <!-- Online Now -->
            <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
              <div class="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:signal" class="w-8 h-8 text-purple-400" />
              </div>
              <div class="text-3xl font-bold text-white mb-2">1,832</div>
              <div class="text-slate-400">Online Now</div>
            </div>

            <!-- Daily Messages -->
            <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
              <div class="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:chat-bubble-left-right" class="w-8 h-8 text-blue-400" />
              </div>
              <div class="text-3xl font-bold text-white mb-2">15K+</div>
              <div class="text-slate-400">Daily Messages</div>
            </div>

            <!-- Tournaments -->
            <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
              <div class="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name="heroicons:trophy" class="w-8 h-8 text-yellow-400" />
              </div>
              <div class="text-3xl font-bold text-white mb-2">247</div>
              <div class="text-slate-400">Tournaments</div>
            </div>
          </div>

          <!-- Community Benefits -->
          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-white mb-6">Community Benefits</h3>
            
            <div v-for="benefit in communityBenefits" :key="benefit.id" 
                 class="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
              <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon :name="benefit.icon" class="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div class="font-semibold text-white">{{ benefit.title }}</div>
                <div class="text-sm text-slate-400">{{ benefit.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Discord Join Section -->
        <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 lg:p-12">
          <!-- Discord Logo -->
          <div class="text-center mb-8">
            <div class="w-24 h-24 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="simple-icons:discord" class="w-12 h-12 text-indigo-400" />
            </div>
            
            <h3 class="text-3xl font-bold text-white mb-4">Join Our Discord</h3>
            <p class="text-slate-300 mb-8">
              Get instant access to our gaming community, exclusive channels, 
              and real-time updates on tournaments and events.
            </p>
          </div>

          <!-- Discord Features -->
          <div class="space-y-4 mb-8">
            <div v-for="feature in discordFeatures" :key="feature.id"
                 class="flex items-center gap-3">
              <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-400 flex-shrink-0" />
              <span class="text-slate-200">{{ feature.text }}</span>
            </div>
          </div>

          <!-- Join Button -->
          <button @click="joinDiscord" 
                  class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 group">
            <div class="flex items-center justify-center gap-3">
              <Icon name="simple-icons:discord" class="w-6 h-6" />
              <span>Join Discord Community</span>
              <Icon name="heroicons:arrow-right" class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <!-- Social Links -->
          <div class="mt-8 pt-8 border-t border-slate-700/50">
            <div class="text-center mb-4">
              <span class="text-slate-400">Follow us on social media</span>
            </div>
            
            <div class="flex justify-center gap-4">
              <button v-for="social in socialLinks" :key="social.id"
                      @click="openSocialLink(social.url)"
                      class="w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                      :class="social.hoverColor">
                <Icon :name="social.icon" class="w-6 h-6" :class="social.iconColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface CommunityBenefit {
  id: string
  title: string
  description: string
  icon: string
}

interface DiscordFeature {
  id: string
  text: string
}

interface SocialLink {
  id: string
  name: string
  icon: string
  url: string
  iconColor: string
  hoverColor: string
}

// ============================================================================
// DATA & COMPUTED
// ============================================================================

const communityBenefits: CommunityBenefit[] = [
  {
    id: '1',
    title: 'Exclusive NFT Drops',
    description: 'Early access to limited edition gaming NFTs',
    icon: 'heroicons:gift'
  },
  {
    id: '2',
    title: 'Tournament Priority',
    description: 'Priority registration for premium tournaments',
    icon: 'heroicons:trophy'
  },
  {
    id: '3',
    title: 'Expert Coaching',
    description: 'Free coaching sessions with pro gamers',
    icon: 'heroicons:academic-cap'
  },
  {
    id: '4',
    title: 'Beta Access',
    description: 'Test new features before public release',
    icon: 'heroicons:rocket-launch'
  }
]

const discordFeatures: DiscordFeature[] = [
  { id: '1', text: 'Real-time gaming discussions' },
  { id: '2', text: 'Tournament announcements' },
  { id: '3', text: 'NFT trading channels' },
  { id: '4', text: 'Voice chat for team games' },
  { id: '5', text: 'Exclusive giveaways' },
  { id: '6', text: 'Direct support from admins' }
]

const socialLinks: SocialLink[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'simple-icons:x',
    url: 'https://twitter.com/viiiciisic',
    iconColor: 'text-slate-400',
    hoverColor: 'hover:bg-blue-500/20'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'simple-icons:instagram',
    url: 'https://instagram.com/viiiciisic',
    iconColor: 'text-slate-400',
    hoverColor: 'hover:bg-pink-500/20'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'simple-icons:youtube',
    url: 'https://youtube.com/viiiciisic',
    iconColor: 'text-slate-400',
    hoverColor: 'hover:bg-red-500/20'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    icon: 'simple-icons:twitch',
    url: 'https://twitch.tv/viiiciisic',
    iconColor: 'text-slate-400',
    hoverColor: 'hover:bg-purple-500/20'
  }
]

// ============================================================================
// METHODS
// ============================================================================

const joinDiscord = () => {
  // Aquí iría la lógica para unirse a Discord
  window.open('https://discord.gg/viiiciisic', '_blank')
}

const openSocialLink = (url: string) => {
  window.open(url, '_blank')
}
</script>
