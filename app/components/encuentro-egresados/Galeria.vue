<template>
  <section class="gallery-section mt-16 lg:mt-20" aria-labelledby="galeria-egresados-title">
    <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p class="gallery-kicker">Archivo fotográfico</p>
        <h2 id="galeria-egresados-title" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Recuerdos de un encuentro anterior
        </h2>
      </div>
      <p class="max-w-sm text-sm leading-6 text-slate-400 sm:text-right">
        Fotografías de un encuentro anterior de Ingeniería de Sistemas.
      </p>
    </div>

    <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <button
        v-for="(imagen, indice) in imagenes"
        :key="imagen.src"
        type="button"
        class="gallery-item group relative min-h-[230px] overflow-hidden rounded-2xl border border-white/10 bg-[#082b51] text-left sm:min-h-[280px]"
        :class="{ 'lg:col-span-2 lg:row-span-2 lg:min-h-[576px]': indice === 0 }"
        :aria-label="`Ampliar fotografía ${indice + 1} de ${imagenes.length}`"
        @click="abrir(indice, $event)"
      >
        <NuxtImg
          :src="imagen.src"
          :alt="imagen.alt"
          :width="imagen.ancho"
          :height="imagen.alto"
          :sizes="indice === 0 ? '100vw sm:100vw lg:66vw' : '100vw sm:50vw lg:33vw'"
          class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
          loading="lazy"
        />
        <span class="gallery-shade absolute inset-0" aria-hidden="true" />
        <span class="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#041d39]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          <Icon name="heroicons:magnifying-glass-plus" class="h-4 w-4" />
          Ampliar
        </span>
      </button>
    </div>

    <p class="mt-5 text-xs leading-5 text-slate-500">
      Archivo institucional · II Reencuentro de Egresados de Ingeniería de Sistemas.
    </p>

    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="activa !== null"
          ref="dialogo"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-[#020b16]/95 p-3 backdrop-blur sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotografías del reencuentro de egresados"
          tabindex="-1"
          @click.self="cerrar"
          @keydown="manejarTecladoDialogo"
        >
          <div class="relative flex h-full max-h-[900px] w-full max-w-6xl flex-col justify-center">
            <div class="mb-3 flex items-center justify-between gap-4 text-white">
              <p class="text-sm font-semibold" aria-live="polite">
                Fotografía {{ activa + 1 }} de {{ imagenes.length }} · Archivo fotográfico
              </p>
              <button
                ref="botonCerrar"
                type="button"
                class="lightbox-control"
                aria-label="Cerrar visor"
                @click="cerrar"
              >
                <Icon name="heroicons:x-mark" class="h-6 w-6" />
              </button>
            </div>

            <div class="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-[#041d39]">
              <NuxtImg
                :src="imagenActiva.src"
                :alt="imagenActiva.alt"
                :width="imagenActiva.ancho"
                :height="imagenActiva.alto"
                sizes="100vw lg:1200px"
                class="h-full w-full object-contain"
              />

              <button
                type="button"
                class="lightbox-control absolute left-3 top-1/2 -translate-y-1/2 sm:left-5"
                aria-label="Ver fotografía anterior"
                @click="anterior"
              >
                <Icon name="heroicons:chevron-left" class="h-7 w-7" />
              </button>
              <button
                type="button"
                class="lightbox-control absolute right-3 top-1/2 -translate-y-1/2 sm:right-5"
                aria-label="Ver fotografía siguiente"
                @click="siguiente"
              >
                <Icon name="heroicons:chevron-right" class="h-7 w-7" />
              </button>
            </div>

            <p class="mx-auto mt-3 max-w-3xl text-center text-sm leading-6 text-slate-300">
              {{ imagenActiva.alt }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import type { ImagenEncuentroEgresados } from '~/data/encuentro-egresados'

const props = defineProps<{ imagenes: readonly ImagenEncuentroEgresados[] }>()

const activa = ref<number | null>(null)
const botonCerrar = ref<HTMLButtonElement | null>(null)
const dialogo = ref<HTMLElement | null>(null)
let disparador: HTMLElement | null = null

const imagenActiva = computed<ImagenEncuentroEgresados>(() => props.imagenes[activa.value ?? 0]!)

async function abrir(indice: number, event: MouseEvent) {
  disparador = event.currentTarget as HTMLElement
  activa.value = indice
  if (import.meta.client) document.body.style.overflow = 'hidden'
  await nextTick()
  botonCerrar.value?.focus()
}

function cerrar() {
  activa.value = null
  if (import.meta.client) document.body.style.overflow = ''
  nextTick(() => disparador?.focus())
}

function anterior() {
  if (activa.value === null) return
  activa.value = (activa.value - 1 + props.imagenes.length) % props.imagenes.length
}

function siguiente() {
  if (activa.value === null) return
  activa.value = (activa.value + 1) % props.imagenes.length
}

function manejarTecladoDialogo(event: KeyboardEvent) {
  if (event.key === 'Escape') cerrar()
  if (event.key === 'ArrowLeft') anterior()
  if (event.key === 'ArrowRight') siguiente()

  if (event.key !== 'Tab' || !dialogo.value) return
  const controles = Array.from(dialogo.value.querySelectorAll<HTMLElement>('button:not([disabled])'))
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
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<style scoped>
.gallery-kicker {
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.gallery-item {
  box-shadow: 0 18px 50px #020f2038;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.gallery-item:hover {
  border-color: #67e8f966;
  transform: translateY(-2px);
}
.gallery-item:focus-visible,
.lightbox-control:focus-visible {
  outline: 2px solid #67e8f9;
  outline-offset: 3px;
}
.gallery-shade {
  background: linear-gradient(to top, #041d39b8 0%, transparent 45%);
  pointer-events: none;
}
.lightbox-control {
  display: inline-flex;
  min-height: 2.75rem;
  min-width: 2.75rem;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff33;
  border-radius: 0.875rem;
  background: #041d39d9;
  color: white;
  backdrop-filter: blur(12px);
  transition: background 0.2s ease, border-color 0.2s ease;
}
.lightbox-control:hover {
  border-color: #67e8f9;
  background: #075b78;
}
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .gallery-item,
  .gallery-item img,
  .lightbox-control,
  .lightbox-enter-active,
  .lightbox-leave-active {
    transition: none;
  }
  .gallery-item:hover,
  .gallery-item img:hover {
    transform: none;
  }
}
</style>
