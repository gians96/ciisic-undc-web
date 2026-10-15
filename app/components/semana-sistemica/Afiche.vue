<!-- Afiche oficial de la actividad; el enlace abre la imagen completa (los afiches llevan códigos QR). -->
<template>
  <section class="mt-12" :aria-labelledby="`afiche-${actividad.slug}`">
    <p class="ss-kicker">Afiche oficial</p>
    <h2 :id="`afiche-${actividad.slug}`" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{{ actividad.nombre }}</h2>
    <a
      :href="actividad.afiche.src"
      target="_blank"
      rel="noopener noreferrer"
      class="ss-link mt-7 block max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#082b51] transition hover:border-primary-300/50"
    >
      <NuxtImg
        :src="actividad.afiche.src"
        :alt="actividad.afiche.alt"
        :width="actividad.afiche.ancho"
        :height="actividad.afiche.alto"
        sizes="100vw sm:384px"
        class="h-auto w-full"
        loading="lazy"
      />
      <span class="sr-only">Abrir el afiche en tamaño completo (se abre en una pestaña nueva)</span>
    </a>
  </section>
</template>

<script setup lang="ts">
import type { ActividadSemanaSistemica } from '~/data/semana-sistemica'

defineProps<{ actividad: ActividadSemanaSistemica }>()
</script>
