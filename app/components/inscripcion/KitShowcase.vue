<template>
  <section id="kit" class="kit-showcase grid gap-6 rounded-[1.75rem] p-5 sm:p-7 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10 lg:p-9" aria-labelledby="kit-titulo">
    <InscripcionKitImagen />
    <div>
      <p class="kicker mb-3">Kit oficial · VIII CIISIC 2026</p>
      <h2 id="kit-titulo" class="text-3xl font-bold text-white sm:text-4xl">Qué incluye tu kit</h2>
      <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <li v-for="item in KIT_ITEMS" :key="item.titulo" class="flex items-start gap-3">
          <span class="icon-tile inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"><Icon :name="item.icon" class="h-6 w-6" /></span>
          <div>
            <p class="font-bold leading-snug text-white">{{ item.titulo }}</p>
            <p class="mt-0.5 text-sm leading-snug text-slate-300">{{ item.detalle }}</p>
          </div>
        </li>
      </ul>
      <p class="mt-6 text-sm leading-relaxed text-slate-400">{{ KIT_NOTA }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { KIT_ITEMS, KIT_NOTA } from '~/data/kit-items'
</script>

<style scoped>
.kit-showcase { background: #082c52; border: 1px solid #ffffff1c; scroll-margin-top: 6rem; }
.kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
.icon-tile { background: #00d9e81a; color: #67e8f9; }
</style>
