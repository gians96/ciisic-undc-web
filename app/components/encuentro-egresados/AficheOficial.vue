<template>
  <section id="afiche-oficial-egresados" class="poster-section mt-16 lg:mt-20" aria-labelledby="afiche-oficial-title">
    <div class="max-w-3xl">
      <p class="poster-kicker">Afiche oficial</p>
      <h2 id="afiche-oficial-title" class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Afiche del Encuentro de Egresados 2026
      </h2>
      <p class="mt-5 leading-7 text-slate-300">
        Conoce el afiche del encuentro y compártelo con otros egresados.
      </p>
    </div>

    <div class="poster-card mx-auto mt-8 grid max-w-6xl gap-7 overflow-hidden rounded-[2rem] border border-white/10 p-5 sm:p-8 lg:grid-cols-[minmax(320px,1fr)_minmax(240px,.62fr)] lg:items-center lg:gap-10 lg:p-10">
      <figure class="mx-auto w-full max-w-[36rem]">
        <button
          type="button"
          class="poster-preview group relative block w-full overflow-hidden rounded-2xl border border-white/15 bg-[#031a32]"
          aria-haspopup="dialog"
          aria-label="Ampliar afiche oficial"
          @click="abrir"
        >
          <picture>
            <source :srcset="afiche.preview" type="image/webp">
            <img
              :src="afiche.original"
              :alt="afiche.alt"
              :width="afiche.ancho"
              :height="afiche.alto"
              class="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            >
          </picture>
          <span class="poster-preview-shade absolute inset-0" aria-hidden="true" />
          <span class="poster-zoom absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full" aria-hidden="true">
            <Icon name="heroicons:magnifying-glass-plus" class="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
        <figcaption class="mt-3 text-center text-xs leading-5 text-slate-400">
          Afiche institucional del evento actual · 1122 × 1402 px
        </figcaption>
      </figure>

      <div class="poster-actions rounded-2xl border border-white/10 p-6 sm:p-8">
        <span class="poster-icon inline-flex h-14 w-14 items-center justify-center rounded-2xl">
          <Icon name="heroicons:document-text" class="h-7 w-7" aria-hidden="true" />
        </span>
        <p class="mt-6 text-xs font-bold uppercase tracking-[.16em] text-primary-300">Material para compartir</p>
        <h3 class="mt-2 text-2xl font-bold text-white sm:text-3xl">Consulta la versión oficial</h3>

        <div class="mt-7 flex flex-col gap-3">
          <button type="button" class="poster-button poster-button-primary" @click="abrir">
            <Icon name="heroicons:magnifying-glass-plus" class="h-5 w-5" aria-hidden="true" />
            Ampliar afiche
          </button>
          <a
            :href="afiche.original"
            :download="afiche.nombreDescarga"
            class="poster-button poster-button-secondary"
          >
            <Icon name="heroicons:arrow-down-tray" class="h-5 w-5" aria-hidden="true" />
            Descargar afiche
          </a>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="poster-lightbox">
        <div
          v-if="visorAbierto"
          ref="dialogo"
          class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020b16]/95 p-3 backdrop-blur sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="visor-afiche-title"
          tabindex="-1"
          @click.self="cerrar"
          @keydown="manejarTeclado"
        >
          <div class="relative flex min-h-0 w-full max-w-6xl flex-col">
            <div class="mb-3 flex items-center justify-between gap-4 text-white">
              <h2 id="visor-afiche-title" class="text-sm font-semibold sm:text-base">Afiche oficial del Encuentro de Egresados 2026</h2>
              <button ref="botonCerrar" type="button" class="lightbox-control" aria-label="Cerrar visor del afiche" @click="cerrar">
                <Icon name="heroicons:x-mark" class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div class="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-[#041d39]">
              <img
                :src="afiche.original"
                :alt="afiche.alt"
                :width="afiche.ancho"
                :height="afiche.alto"
                class="max-h-[calc(100dvh-9rem)] w-auto max-w-full object-contain"
              >
            </div>

            <div class="mt-3 flex justify-center">
              <a :href="afiche.original" :download="afiche.nombreDescarga" class="poster-button poster-button-secondary">
                <Icon name="heroicons:arrow-down-tray" class="h-5 w-5" aria-hidden="true" />
                Descargar original
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { encuentroEgresados } from '~/data/encuentro-egresados'

const afiche = encuentroEgresados.afiche
const visorAbierto = ref(false)
const botonCerrar = ref<HTMLButtonElement | null>(null)
const dialogo = ref<HTMLElement | null>(null)
let disparador: HTMLElement | null = null
let overflowAnterior = ''

async function abrir(evento: MouseEvent) {
  disparador = evento.currentTarget as HTMLElement
  visorAbierto.value = true
  if (import.meta.client) {
    overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  await nextTick()
  botonCerrar.value?.focus()
}

function cerrar() {
  visorAbierto.value = false
  if (import.meta.client) document.body.style.overflow = overflowAnterior
  nextTick(() => disparador?.focus())
}

function manejarTeclado(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    cerrar()
    return
  }
  if (event.key !== 'Tab' || !dialogo.value) return

  const controles = Array.from(dialogo.value.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'))
  const primero = controles[0]
  const ultimo = controles.at(-1)
  if (event.shiftKey && document.activeElement === primero) {
    event.preventDefault()
    ultimo?.focus()
  } else if (!event.shiftKey && document.activeElement === ultimo) {
    event.preventDefault()
    primero?.focus()
  }
}

onUnmounted(() => {
  if (import.meta.client && visorAbierto.value) document.body.style.overflow = overflowAnterior
})
</script>

<style scoped>
.poster-section { scroll-margin-top: calc(var(--header-height, 5rem) + 1.5rem); }
.poster-kicker {
  color: #67e8f9;
  font-size: .75rem;
  font-weight: 800;
  letter-spacing: .2em;
  text-transform: uppercase;
}
.poster-card {
  background:
    radial-gradient(circle at 90% 12%, #f59e0b17, transparent 35%),
    radial-gradient(circle at 8% 85%, #00d9e814, transparent 35%),
    linear-gradient(145deg, #0a3157, #061f3b);
  box-shadow: 0 28px 80px #020f204d;
}
.poster-preview {
  aspect-ratio: 561 / 701;
  box-shadow: 0 22px 55px #020f2066;
  transition: border-color .2s ease, transform .2s ease;
}
.poster-preview:hover { border-color: #67e8f980; transform: translateY(-2px); }
.poster-preview-shade {
  background: linear-gradient(to top, #020b16a6 0%, transparent 28%);
  pointer-events: none;
}
.poster-zoom {
  border: 1px solid #ffffff33;
  background: #041d39e6;
  color: white;
  backdrop-filter: blur(12px);
}
.poster-icon {
  border: 1px solid #fbbf2440;
  background: #f59e0b17;
  color: #fcd34d;
}
.poster-actions { background: #031a3266; }
.poster-button {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  border-radius: .75rem;
  padding: .75rem 1.1rem;
  font-weight: 700;
  transition: transform .2s ease, background .2s ease, border-color .2s ease;
}
.poster-button:hover { transform: translateY(-2px); }
.poster-button-primary { background: #00d9e8; color: #032f5f; }
.poster-button-primary:hover { background: #67e8f9; }
.poster-button-secondary {
  border: 1px solid #67e8f94d;
  background: #082d50;
  color: #cffafe;
}
.poster-button-secondary:hover { border-color: #67e8f9; background: #0a3d64; }
.poster-preview:focus-visible,
.poster-button:focus-visible,
.lightbox-control:focus-visible { outline: 2px solid #67e8f9; outline-offset: 3px; }
.lightbox-control {
  display: inline-flex;
  min-height: 2.75rem;
  min-width: 2.75rem;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff33;
  border-radius: .875rem;
  background: #041d39d9;
  color: white;
  backdrop-filter: blur(12px);
}
.lightbox-control:hover { border-color: #67e8f9; background: #075b78; }
.poster-lightbox-enter-active,
.poster-lightbox-leave-active { transition: opacity .2s ease; }
.poster-lightbox-enter-from,
.poster-lightbox-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .poster-preview,
  .poster-button,
  .poster-lightbox-enter-active,
  .poster-lightbox-leave-active { transition: none; }
  .poster-preview:hover,
  .poster-button:hover { transform: none; }
}
</style>
