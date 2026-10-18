<!-- Fotos de la edición anterior (con la insignia habitual del sitio). Con exactamente3 imágenes
     (el caso de Comparsa y Reinado) el mosaico es un rectángulo apaisado (21:9) centrado al 85%
     del ancho: la primera va grande a la izquierda y las otras dos apiladas a la derecha. Con
     cualquier otro conteo, mosaico de2 columnas (la primera a todo el ancho si el total es impar). -->
<template>
  <section v-if="imagenes.length" class="mt-12" :aria-labelledby="`galeria-${id}`">
    <p class="ss-kicker">Galería</p>
    <h2 :id="`galeria-${id}`" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{{ titulo }}</h2>
    <div
      class="mt-7 grid gap-4 sm:mx-auto sm:max-w-[85%] sm:grid-cols-2"
      :class="{ 'sm:grid-rows-2 sm:aspect-[21/9]': esTrio }"
    >
      <figure
        v-for="(imagen, indice) in imagenes"
        :key="imagen.src"
        class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#082b51]"
        :class="claseFigura(indice)"
      >
        <NuxtImg
          :src="imagen.src"
          :alt="imagen.alt"
          :width="imagen.ancho"
          :height="imagen.alto"
          sizes="100vw sm:50vw lg:40vw"
          class="h-full w-full object-cover"
          loading="lazy"
        />
        <span class="absolute bottom-3 left-3 rounded-full border border-white/15 bg-[#041d39]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          Imagen de edición anterior
        </span>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ImagenActividad } from '~/data/semana-sistemica'

const props = withDefaults(defineProps<{
  /** Identificador único en la página (para `aria-labelledby`). */
  id: string
  imagenes: readonly ImagenActividad[]
  titulo?: string
}>(), { titulo: 'Así se vivió la edición anterior' })

/** El mosaico grande-izquierda / dos-derecha solo tiene sentido con exactamente3 fotos. */
const esTrio = computed(() => props.imagenes.length === 3)

function claseFigura(indice: number): string {
  if (esTrio.value) return indice === 0 ? 'sm:row-span-2' : ''
  return props.imagenes.length % 2 === 1 && indice === 0 ? 'sm:col-span-2' : ''
}
</script>
