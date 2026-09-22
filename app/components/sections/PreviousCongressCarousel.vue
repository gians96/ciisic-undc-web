<template>
  <div class="gallery-shell">
    <div
      ref="track"
      class="gallery-track grid grid-flow-col gap-4 overflow-x-auto pb-2 sm:gap-5"
      role="region"
      aria-label="Galería del VII CIISIC 2025"
      tabindex="0"
      @scroll.passive="updateActiveSlide"
      @keydown.left.prevent="previousSlide"
      @keydown.right.prevent="nextSlide"
    >
      <article
        v-for="(photo, index) in previousCongressPhotos"
        :key="photo.id"
        class="gallery-card group relative snap-start overflow-hidden rounded-[1.6rem] border border-white/15 bg-[#082f59]"
      >
        <div class="relative aspect-[4/3] overflow-hidden">
          <NuxtImg
            v-if="photo.image"
            :src="photo.image"
            :alt="photo.alt"
            width="960"
            height="720"
            sizes="90vw sm:65vw md:50vw xl:33vw"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            loading="lazy"
          />
          <div v-else class="photo-placeholder absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-300/25 bg-primary-400/10 text-primary-200">
              <Icon name="heroicons:photo" class="h-7 w-7" />
            </span>
            <p class="text-sm font-bold uppercase tracking-[.18em] text-primary-200">Foto {{ String(index + 1).padStart(2, '0') }}</p>
            <p class="mt-2 max-w-xs text-sm leading-relaxed text-slate-300">Espacio preparado para una fotografía del VII CIISIC.</p>
          </div>
          <div class="card-overlay absolute inset-0" aria-hidden="true" />
          <span class="absolute left-5 top-5 rounded-full border border-white/20 bg-[#041d39]/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-white backdrop-blur">
            VII CIISIC · 2025
          </span>
          <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p class="text-xs font-semibold uppercase tracking-[.18em] text-primary-200">{{ photo.category }}</p>
            <h3 class="mt-2 text-xl font-bold text-white sm:text-2xl">{{ photo.title }}</h3>
          </div>
        </div>
      </article>
    </div>

    <div class="mt-6 flex items-center justify-between gap-4">
      <div class="flex items-center gap-2" aria-label="Posición en la galería">
        <button
          v-for="(_, index) in indicatorCount"
          :key="index"
          type="button"
          class="h-2 rounded-full transition-all"
          :class="index === activeSlide ? 'w-8 bg-primary-400' : 'w-2 bg-white/25 hover:bg-white/50'"
          :aria-label="`Ir al grupo ${index + 1}`"
          :aria-current="index === activeSlide ? 'true' : undefined"
          @click="goToSlide(index)"
        />
      </div>

      <div class="flex gap-2">
        <button type="button" class="carousel-button" aria-label="Fotografías anteriores" @click="previousSlide">
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
        </button>
        <button type="button" class="carousel-button" aria-label="Fotografías siguientes" @click="nextSlide">
          <Icon name="heroicons:arrow-right" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GalleryPhoto {
  id: number
  title: string
  category: string
  image: string | null
  alt: string
}

// Para cargar las fotografías, colócalas en public/images/memorias-2025/
// y reemplaza null por una ruta como: '/images/memorias-2025/foto-01.webp'.
const previousCongressPhotos: GalleryPhoto[] = [
  { id: 1, title: 'Ceremonia de inauguración', category: 'Apertura', image: '/images/memorias-2025/1.webp', alt: 'Ceremonia de inauguración del VII CIISIC 2025' },
  { id: 2, title: 'Ponencias internacionales', category: 'Conocimiento', image: '/images/memorias-2025/2.webp', alt: 'Ponencia internacional durante el VII CIISIC 2025' },
  { id: 3, title: 'Comunidad universitaria', category: 'Comunidad', image: '/images/memorias-2025/3.webp', alt: 'Participantes reunidos durante el VII CIISIC 2025' },
  { id: 4, title: 'Encuentro de investigadores', category: 'Investigación', image: '/images/memorias-2025/4.webp', alt: 'Investigadores participantes del VII CIISIC 2025' },
  { id: 5, title: 'Actividades de integración', category: 'Experiencias', image: '/images/memorias-2025/5.webp', alt: 'Actividad de integración del VII CIISIC 2025' },
  { id: 6, title: 'Clausura del congreso', category: 'Celebración', image: '/images/memorias-2025/6.webp', alt: 'Ceremonia de clausura del VII CIISIC 2025' },
]

const track = ref<HTMLElement | null>(null)
const activeSlide = ref(0)
const visibleCards = ref(1)
const indicatorCount = computed(() => Math.max(1, previousCongressPhotos.length - visibleCards.value + 1))

function updateVisibleCards() {
  if (!import.meta.client) return
  visibleCards.value = window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1
  activeSlide.value = Math.min(activeSlide.value, indicatorCount.value - 1)
}

function cardStep() {
  const card = track.value?.querySelector<HTMLElement>('.gallery-card')
  if (!card || !track.value) return 0
  const gap = Number.parseFloat(getComputedStyle(track.value).columnGap) || 0
  return card.getBoundingClientRect().width + gap
}

function goToSlide(index: number) {
  const safeIndex = Math.max(0, Math.min(index, indicatorCount.value - 1))
  activeSlide.value = safeIndex
  track.value?.scrollTo({ left: safeIndex * cardStep(), behavior: 'smooth' })
}

function previousSlide() {
  goToSlide(activeSlide.value > 0 ? activeSlide.value - 1 : indicatorCount.value - 1)
}

function nextSlide() {
  goToSlide(activeSlide.value < indicatorCount.value - 1 ? activeSlide.value + 1 : 0)
}

function updateActiveSlide() {
  if (!track.value) return
  const step = cardStep()
  if (!step) return
  activeSlide.value = Math.min(Math.round(track.value.scrollLeft / step), indicatorCount.value - 1)
}

onMounted(() => {
  updateVisibleCards()
  window.addEventListener('resize', updateVisibleCards)
})

onUnmounted(() => window.removeEventListener('resize', updateVisibleCards))
</script>

<style scoped>
.gallery-shell { position: relative; }
.gallery-track { grid-auto-columns: 88%; scroll-snap-type: x mandatory; scrollbar-width: none; overscroll-behavior-inline: contain; }
.gallery-track::-webkit-scrollbar { display: none; }
.gallery-card { box-shadow: 0 20px 60px #020f2038; }
.photo-placeholder { background: radial-gradient(circle at 50% 30%, #0b78a566, transparent 44%), linear-gradient(145deg, #0a3a68, #062746); }
.photo-placeholder::before { position: absolute; inset: 0; content: ''; opacity: .24; background-image: linear-gradient(#67e8f929 1px, transparent 1px), linear-gradient(90deg, #67e8f929 1px, transparent 1px); background-size: 40px 40px; }
.photo-placeholder > * { position: relative; }
.card-overlay { background: linear-gradient(to top, #041d39f5 0%, #041d3966 42%, transparent 68%); pointer-events: none; }
.carousel-button { display: inline-flex; height: 3rem; width: 3rem; align-items: center; justify-content: center; border: 1px solid #ffffff26; border-radius: 9999px; background: #ffffff0d; color: white; transition: background .2s, border-color .2s, transform .2s; }
.carousel-button:hover { border-color: #67e8f9; background: #67e8f91a; transform: translateY(-2px); }
.carousel-button:focus-visible, .gallery-track:focus-visible { outline: 2px solid #67e8f9; outline-offset: 3px; }
@media (min-width: 640px) { .gallery-track { grid-auto-columns: 65%; } }
@media (min-width: 768px) { .gallery-track { grid-auto-columns: calc((100% - 1.25rem) / 2); } }
@media (min-width: 1280px) { .gallery-track { grid-auto-columns: calc((100% - 2.5rem) / 3); } }
@media (prefers-reduced-motion: reduce) { .gallery-card img, .carousel-button, button { transition: none; } }
</style>
