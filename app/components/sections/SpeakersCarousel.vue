<template>
  <section class="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24" aria-labelledby="landing-speakers-title">
    <div class="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div>
        <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Ponentes invitados</p>
        <h2 id="landing-speakers-title" class="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Conocimiento sin fronteras.</h2>
        <p class="mt-4 max-w-2xl text-slate-300">Conoce a nuestros invitados internacionales y a los especialistas de Perú.</p>
      </div>
      <NuxtLink to="/ponentes" class="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-primary-400/40 px-5 py-3 font-semibold text-primary-300 hover:bg-primary-400/10">Ver todos los ponentes <Icon name="heroicons:arrow-right" class="h-5 w-5" /></NuxtLink>
    </div>

    <div id="speakers-track" ref="track" class="speakers-track" role="region" aria-label="Carrusel de ponentes: internacionales y nacionales" aria-roledescription="carrusel" tabindex="0" @scroll.passive="updatePosition" @keydown.left.prevent="move(-1)" @keydown.right.prevent="move(1)" @keydown.home.prevent="goToEdge(false)" @keydown.end.prevent="goToEdge(true)">
      <article v-for="speaker in speakers" :key="speaker.name" class="flex min-w-0 snap-start flex-col overflow-hidden speaker-card rounded-2xl border border-white/10 bg-[#082c52]">
        <div class="relative aspect-[6/5] overflow-hidden bg-[#082d56]">
          <NuxtImg :src="speaker.image" :alt="`Retrato de ${speaker.name}`" width="1122" height="1402" sizes="100vw sm:50vw lg:33vw xl:25vw" class="h-full w-full object-cover object-top" loading="lazy" />
          <span class="absolute bottom-3 left-3 rounded-full border border-white/15 bg-[#041d39]/90 px-3 py-1.5 text-sm font-semibold text-white"><span aria-hidden="true">{{ speaker.flag }}</span> {{ speaker.country }}</span>
        </div>
        <div class="flex flex-1 flex-col p-5">
          <p class="text-[10px] font-semibold uppercase tracking-[.14em] text-primary-300">{{ speaker.country === 'Perú' ? 'Ponente nacional' : 'Ponente internacional' }}</p>
          <h3 class="mt-3 text-lg font-bold leading-snug text-white">{{ speaker.name }}</h3>
          <p class="mb-5 mt-2 text-sm leading-relaxed text-slate-300">{{ speaker.degree }}</p>
          <NuxtLink to="/ponentes" :aria-label="`Ver más sobre ${speaker.name}`" class="mt-auto inline-flex min-h-11 items-center justify-between gap-2 border-t border-white/10 pt-3 text-sm font-semibold text-primary-300 hover:text-white">Ver más <Icon name="heroicons:arrow-right" class="h-5 w-5" /></NuxtLink>
        </div>
      </article>
    </div>

    <div class="mt-5 flex items-center justify-between gap-4">
      <p class="text-sm text-slate-300" aria-live="polite">{{ activeIndex + 1 }} de {{ speakers.length }} ponentes</p>
      <div class="flex gap-3">
        <button type="button" class="carousel-control" aria-label="Ponentes anteriores" aria-controls="speakers-track" :disabled="atStart" @click="move(-1)"><Icon name="heroicons:arrow-left" class="h-5 w-5" /></button>
        <button type="button" class="carousel-control" aria-label="Ponentes siguientes" aria-controls="speakers-track" :disabled="atEnd" @click="move(1)"><Icon name="heroicons:arrow-right" class="h-5 w-5" /></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { speakers } from '~/data/speakers'

const track = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const atStart = ref(true)
const atEnd = ref(false)
let observer: ResizeObserver | undefined

function cardStep() {
  const element = track.value
  if (!element) return 0
  const card = element.firstElementChild as HTMLElement | null
  return (card?.getBoundingClientRect().width ?? 0) + parseFloat(getComputedStyle(element).columnGap)
}

function updatePosition() {
  const element = track.value
  if (!element) return
  activeIndex.value = Math.round(element.scrollLeft / (cardStep() || 1))
  atStart.value = element.scrollLeft <= 2
  atEnd.value = element.scrollLeft + element.clientWidth >= element.scrollWidth - 2
}

function scrollTo(left: number) {
  track.value?.scrollTo({ left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

function move(direction: number) {
  if (track.value) scrollTo(track.value.scrollLeft + direction * cardStep())
}

function goToEdge(end: boolean) {
  scrollTo(end ? track.value?.scrollWidth ?? 0 : 0)
}

onMounted(() => {
  updatePosition()
  observer = new ResizeObserver(updatePosition)
  if (track.value) observer.observe(track.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.speakers-track { display: grid; grid-auto-flow: column; grid-auto-columns: 100%; gap: 1.25rem; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 1rem; scrollbar-width: none; }
.carousel-control { display: inline-flex; min-width: 44px; min-height: 44px; align-items: center; justify-content: center; border: 1px solid #22d3ee66; border-radius: .75rem; color: #67e8f9; background: #082c52; }
.carousel-control:hover:not(:disabled) { background: #0a3868; }
.carousel-control:disabled { opacity: .35; cursor: not-allowed; }
a:focus-visible, button:focus-visible, .speakers-track:focus-visible { outline: 2px solid #22d3ee; outline-offset: 3px; }
.speakers-track::-webkit-scrollbar { display: none; }
@media (min-width: 640px) { .speakers-track { grid-auto-columns: calc((100% - 1.25rem) / 2); } }
@media (min-width: 1024px) { .speakers-track { grid-auto-columns: calc((100% - 2.5rem) / 3); } }
@media (min-width: 1280px) { .speakers-track { grid-auto-columns: calc((100% - 3.75rem) / 4); } }
</style>

