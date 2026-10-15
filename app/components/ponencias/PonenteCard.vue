<template>
  <article class="ponente-card group overflow-hidden rounded-3xl border border-white/10" :class="{ 'is-external': speaker.external }">
    <div class="ponente-photo relative aspect-[4/5] overflow-hidden bg-[#082d56]">
      <div
        class="absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-2xl"
        :style="{ backgroundImage: `url(${speaker.image})` }"
        aria-hidden="true"
      />
      <NuxtImg
        :src="speaker.image"
        :alt="`Retrato de ${speaker.name}`"
        width="1122"
        height="1402"
        sizes="100vw md:50vw xl:33vw"
        class="relative z-10 h-full w-full object-contain object-center transition duration-500 group-hover:scale-[1.015]"
        loading="lazy"
      />
      <div class="photo-shade absolute inset-0" aria-hidden="true" />
      <span
        v-if="speaker.external"
        class="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full bg-primary-400 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#032f5f] shadow-lg shadow-black/30"
      >
        <Icon name="heroicons:globe-alt" class="h-4 w-4" aria-hidden="true" />
        Ponente externo
      </span>
    </div>

    <div class="p-5 sm:p-6">
      <p class="text-[.68rem] font-bold uppercase tracking-[.18em] text-primary-300">Ponente especializado</p>
      <h3 class="mt-2 text-xl font-bold leading-snug text-white sm:text-[1.35rem]">{{ speaker.name }}</h3>

      <details class="bio-details mt-5 border-t border-white/10 pt-5">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded text-sm font-semibold text-primary-200">
          <span>Ver perfil profesional</span>
          <Icon name="heroicons:chevron-down" class="bio-chevron h-5 w-5 shrink-0 transition-transform" aria-hidden="true" />
        </summary>
        <div class="mt-4 space-y-3 text-sm leading-7 text-slate-300">
          <p v-for="parrafo in parrafos" :key="parrafo">{{ parrafo }}</p>
        </div>
      </details>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { SpecializedSpeaker } from '~/data/ponencias-especializadas'
import { parrafosDelPerfil } from '~/utils/ponencias-especializadas'

const props = defineProps<{ speaker: SpecializedSpeaker }>()

const parrafos = computed(() => parrafosDelPerfil(props.speaker.bio))
</script>

<style scoped>
.ponente-card { background: linear-gradient(150deg, #0a3157d9, #062541f2); box-shadow: 0 20px 55px #020f2033; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.ponente-card:hover { transform: translateY(-4px); border-color: #22d3ee59; box-shadow: 0 26px 68px #020f2052; }
.ponente-card.is-external { border-color: #22d3ee47; box-shadow: 0 20px 55px #020f2033, 0 0 0 1px #22d3ee1f; }
.photo-shade { z-index: 11; pointer-events: none; background: linear-gradient(to top, #041d3966, transparent 32%); }
.bio-details[open] .bio-chevron { transform: rotate(180deg); }
.bio-details summary::-webkit-details-marker { display: none; }
.bio-details summary:focus-visible { outline: 2px solid #00d9e8; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { .ponente-card, .bio-chevron { transition: none; } .ponente-card:hover { transform: none; } }
</style>
