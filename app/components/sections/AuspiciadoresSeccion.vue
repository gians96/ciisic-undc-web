<!-- Auspiciadores del congreso en un loop infinito (UiLogoLoop, port del
     React Bits LogoLoop). Va justo debajo del bloque de datos del hero; los
     logos se sirven sin tarjeta, sobre el fondo de la landing. -->
<template>
  <section
    class="auspiciadores"
    aria-labelledby="auspiciadores-titulo"
  >
    <div class="mx-auto max-w-7xl px-6 lg:px-8 2xl:max-w-[1600px]">
      <p class="kicker">Auspiciadores</p>
      <h2
        id="auspiciadores-titulo"
        class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
      >
        Quienes hacen posible el congreso.
      </h2>
    </div>
    <UiLogoLoop
      class="mt-10"
      :logos="logos"
      :logo-height="80"
      :gap="20"
      :speed="80"
      labels="hover"
      scale-on-hover
      aria-label="Logos de los auspiciadores del VIII CIISIC 2026"
    />
  </section>
</template>

<script setup lang="ts">
import type { LogoLoopItem } from "../ui/LogoLoop.vue";

// Logos convertidos con sharp desde la carpeta local de auspiciadores
// (máx. 640 px de ancho, WebP q82) y servidos desde public/images/auspiciadores/.
const logos: LogoLoopItem[] = [
  {
    src: "/images/auspiciadores/bodega-de-la-cruz.webp",
    alt: "Bodega De La Cruz",
    title: "Bodega De La Cruz",
  },
  {
    src: "/images/auspiciadores/bloom.webp",
    alt: "Bloom Centro de Belleza",
    title: "Bloom Centro de Belleza",
  },
  {
    src: "/images/auspiciadores/carbonero.webp",
    alt: "Carbonero",
    title: "Carbonero",
  },
  {
    src: "/images/auspiciadores/comedor-editas.webp",
    alt: "Comedor Edita's",
    title: "Comedor Edita's",
  },
  {
    src: "/images/auspiciadores/devits.webp",
    alt: "DevITS.pe",
    title: "DevITS.pe",
  },
  {
    src: "/images/auspiciadores/don-erasmo.webp",
    alt: "Don Erasmo",
    title: "Don Erasmo",
  },
  {
    src: "/images/auspiciadores/glen-soft.webp",
    alt: "Glen Soft",
    title: "Glen Soft",
  },
  {
    src: "/images/auspiciadores/imprenta-angel.webp",
    alt: "Imprenta Ángel",
    title: "Imprenta Ángel",
  },
  {
    src: "/images/auspiciadores/la-cosecha.webp",
    alt: "La Cosecha",
    title: "La Cosecha",
  },
  {
    src: "/images/auspiciadores/pequezitas.webp",
    alt: "Pequezitas",
    title: "Pequezitas",
  },
  {
    src: "/images/auspiciadores/residencia-benavides.webp",
    alt: "Residencia Benavides",
    title: "Residencia Benavides",
  },
];
</script>

<style scoped>
.auspiciadores {
  background: #041d39;
  padding-bottom: 2.5rem;
}

/* Margen vertical para que el zoom del hover (scale 1.35) no lo recorte
   el overflow del loop. */
.auspiciadores :deep(.logoloop) {
  --logoloop-pad: 18px;
}

/* Cards sutiles tras cada logo (tipo «trusted by»): disimulan que varios
   logos tienen colores parecidos al fondo navy. Tamaño fijo para que la
   fila se vea uniforme aunque los logos tengan anchos distintos. */
.auspiciadores :deep(.logoloop__content) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  width: 168px;
  height: 104px;
  justify-content: center;
}

.auspiciadores :deep(.logoloop__item img) {
  width: auto;
  height: auto;
  max-width: 124px;
  max-height: 64px;
}

@media (min-width: 1024px) {
  .auspiciadores {
    padding-bottom: 4rem;
  }
}

.kicker {
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
</style>
