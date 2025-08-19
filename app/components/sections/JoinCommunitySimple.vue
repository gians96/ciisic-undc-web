<template>
  <section class="py-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 relative overflow-hidden">
    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        
        <!-- Lado Izquierdo - Imagen -->
        <div class="relative">
          <div class="relative aspect-video bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-2xl overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-8xl">🤝</div>
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <button 
                @click="playVideo"
                class="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
              >
                <Icon name="heroicons:play" class="w-8 h-8 text-slate-900 ml-1" />
              </button>
            </div>
          </div>
        </div>

        <!-- Lado Derecho - Contenido -->
        <div class="space-y-8">
          <div class="space-y-4">
            <h2 class="text-4xl lg:text-5xl font-bold text-white leading-tight">
              JOIN THE <span class="text-green-500">COMMUNITY</span>
            </h2>
            <p class="text-lg text-gray-400">
              Join our Discord community and choose onsteur
            </p>
          </div>

          <!-- Estadísticas -->
          <div class="grid grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-green-500 mb-2">5K+</div>
              <div class="text-sm text-gray-400 uppercase tracking-wider">Members</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-500 mb-2">24/7</div>
              <div class="text-sm text-gray-400 uppercase tracking-wider">Active</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-500 mb-2">100+</div>
              <div class="text-sm text-gray-400 uppercase tracking-wider">Channels</div>
            </div>
          </div>

          <!-- Botón Discord -->
          <div class="pt-4">
            <button 
              @click="joinDiscord"
              class="inline-flex items-center bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 text-lg uppercase tracking-wider transition-all duration-300"
              style="clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)"
            >
              <Icon name="simple-icons:discord" class="w-6 h-6 mr-3" />
              JOIN DISCORD
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const playVideo = () => {
  console.log('Playing community video...')
}

const joinDiscord = () => {
  console.log('Joining Discord...')
  window.open('https://discord.gg/vii-ciisic', '_blank')
}
</script>

<style scoped>
section {
  background: 
    radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}

button:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}
</style>
