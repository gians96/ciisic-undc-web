<!-- Auspiciadores del congreso en un loop infinito (UiLogoLoop, port del
     React Bits LogoLoop). Va justo debajo del bloque de datos del hero; cada
     logo va en una tarjeta grande: oscura translúcida por defecto (los logos con
     letras blancas se leen sobre ella) y blanca solo cuando el logo trae su
     propio fondo claro (`fondo: "claro"`). Al pasar el mouse sube la tarjeta y
     aparece el nombre del auspiciador. -->
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
      class="mt-8"
      :logos="logos"
      :logo-height="104"
      :gap="28"
      :speed="80"
      labels="hover"
      aria-label="Logos de los auspiciadores del VIII CIISIC 2026"
    >
      <template #item="{ item }">
        <span
          class="logoloop__node tarjeta"
          :class="{ 'tarjeta--clara': esClara(item) }"
        >
          <img
            :src="item.src"
            :alt="item.alt ?? ''"
            loading="lazy"
            decoding="async"
            :draggable="false"
          >
        </span>
      </template>
    </UiLogoLoop>
  </section>
</template>

<script setup lang="ts">
import type { LogoLoopItem } from "../ui/LogoLoop.vue";

/** `fondo: "claro"`: el logo trae fondo blanco y necesita tarjeta blanca. */
type Auspiciador = LogoLoopItem & { fondo?: "claro" };

const esClara = (item: LogoLoopItem) => (item as Auspiciador).fondo === "claro";

// Logos convertidos con sharp desde la carpeta local de auspiciadores
// (máx. 640 px de ancho, WebP q82) y servidos desde public/images/auspiciadores/.
const logos: Auspiciador[] = [
  {
    src: "/images/auspiciadores/bodega-de-la-cruz.webp",
    alt: "Bodega De La Cruz",
    title: "Bodega De La Cruz",
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
    src: "/images/auspiciadores/don-erasmo.webp",
    alt: "Don Erasmo",
    title: "Don Erasmo",
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
  {
    src: "/images/auspiciadores/bloom.webp",
    alt: "Bloom",
    title: "Bloom",
  },
  {
    src: "/images/auspiciadores/glen-soft.webp",
    alt: "Glen Soft",
    title: "Glen Soft",
    fondo: "claro",
  },
];
</script>

<style scoped>
.auspiciadores {
  background: #041d39;
  padding-bottom: 1rem;
}

/* Espacio arriba para la elevación del hover y abajo para la etiqueta con el
   nombre, que el overflow del loop recortaría si no hubiera margen. */
.auspiciadores :deep(.logoloop) {
  --logoloop-pad: 14px;
  padding-bottom: 3.5rem;
}

@media (min-width: 1024px) {
  .auspiciadores {
    padding-bottom: 2rem;
  }
}

.kicker {
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.tarjeta {
  padding: 14px 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 28px -14px rgba(0, 0, 0, 0.6);
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.tarjeta--clara {
  border-color: rgba(255, 255, 255, 0.9);
  background: #fff;
}

/* Un logo muy ancho (Glen Soft) no debe estirar su tarjeta más de la cuenta. */
.tarjeta img {
  max-width: 18rem;
}

.logoloop__item:hover .tarjeta,
.logoloop__item:focus-within .tarjeta {
  border-color: rgba(103, 232, 249, 0.7);
  box-shadow:
    0 0 0 1px rgba(103, 232, 249, 0.25),
    0 16px 32px -14px rgba(103, 232, 249, 0.45);
  transform: translateY(-4px);
}

/* Etiqueta con el nombre: pastilla legible en vez del texto tenue del loop. */
.auspiciadores :deep(.logoloop__tip) {
  z-index: 1;
  margin-top: 0.25rem;
  padding: 0.375rem 0.875rem;
  border: 1px solid rgba(103, 232, 249, 0.35);
  border-radius: 999px;
  background: #0b2a4d;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0;
}

.auspiciadores :deep(.logoloop__item:hover .logoloop__tip),
.auspiciadores :deep(.logoloop__item:focus-within .logoloop__tip) {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .tarjeta {
    transition: none;
  }

  .logoloop__item:hover .tarjeta,
  .logoloop__item:focus-within .tarjeta {
    transform: none;
  }
}
</style>
