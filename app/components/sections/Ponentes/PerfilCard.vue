<template>
  <article
    class="group bg-gray-800/60 rounded-2xl py-8 px-9 text-center relative overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-green-400/20 hover:-translate-y-3 hover:bg-gray-800/80 will-change-transform"
  >
    <!-- Decorative background elements - Large bars -->
    <div
      class="absolute -top-4 left-0 w-[70px] h-80 bg-green-400/20 -rotate-[55deg] -translate-x-8 -translate-y-16 transition-all duration-500 ease-out group-hover:bg-green-400/60 z-0"
      style="transform: translate3d(-32px, -64px, 0) rotate(-55deg);"
    />
    <div
      class="absolute -top-4 right-0 w-[70px] h-80 bg-green-400/20 rotate-[55deg] translate-x-8 -translate-y-16 transition-all duration-500 ease-out group-hover:bg-green-400/60"
      style="transform: translate3d(32px, -64px, 0) rotate(55deg);"
    />

    <!-- Decorative background elements - Thin lines -->
    <div
      class="absolute -top-[45px] left-[75px] w-[1px] h-64 bg-green-400/30 -rotate-[55deg] transition-all duration-500 ease-out group-hover:bg-green-400/80"
      style="transform: translate3d(0, 0, 0) rotate(-55deg);"
    />
    <div
      class="absolute -top-[45px] right-[75px] w-[1px] h-64 bg-green-400/30 rotate-[55deg] transition-all duration-500 ease-out group-hover:bg-green-400/80"
      style="transform: translate3d(0, 0, 0) rotate(55deg);"
    />

    <!-- Profile Image Container -->
    <header class="relative mb-8 z-10">
      <div 
        class="transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform"
        style="transform: translate3d(0, 0, 0);"
      >
        <NuxtImg
          :src="imagen"
          :alt="`Foto de perfil de ${nombre}`"
          class="w-56 h-56 mx-auto rounded-full border-4 border-white shadow-xl object-cover"
          loading="lazy"
          style="backface-visibility: hidden; -webkit-font-smoothing: antialiased;"
        />
      </div>
    </header>

    <!-- Member Info -->
    <footer class="relative z-10">
      <h3 
        class="text-white text-xl font-bold uppercase tracking-wide"
        style="transform: translate3d(0, 0, 0);"
      >
        {{ nombre }}
      </h3>
      <p 
        class="text-green-400 text-sm font-medium transition-all duration-300 ease-out"
        style="transform: translate3d(0, 0, 0);"
      >
        {{ empresa }}
      </p>
    </footer>
  </article>
</template>

<script setup>
const props = defineProps({
  nombre: {
    type: String,
    required: true
  },
  empresa: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    required: true
  }
});
</script>

