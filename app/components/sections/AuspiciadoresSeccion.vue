<!-- Auspiciadores del congreso en un loop infinito (UiLogoLoop, port del
     React Bits LogoLoop). Va justo debajo del bloque de datos del hero; cada
     logo va en una tarjeta blanca grande (como los logos de nubetec-web) y el
     loop avanza de a un logo con una pausa entre cada paso (`step`). Solo los
     logos con letras blancas (`fondo: "oscuro"`) llevan tarjeta azul oscura. Al
     pasar el mouse el loop se detiene, sube la tarjeta y aparece el nombre. -->
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
      :speed="200"
      step
      pause-on-hover
      labels="hover"
      aria-label="Logos de los auspiciadores del VIII CIISIC 2026"
    >
      <template #item="{ item }">
        <span
          class="logoloop__node tarjeta"
          :class="{ 'tarjeta--oscura': esOscura(item) }"
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

/** `fondo: "oscuro"`: el logo lleva letras blancas y se pierde en la tarjeta blanca. */
type Auspiciador = LogoLoopItem & { fondo?: "oscuro" };

const esOscura = (item: LogoLoopItem) => (item as Auspiciador).fondo === "oscuro";

// Logos convertidos con sharp desde la carpeta local de auspiciadores
// (máx. 640 px de ancho, WebP q82) y servidos desde public/images/auspiciadores/.
const logos: Auspiciador[] = [
  {
    src: "/images/auspiciadores/bodega-de-la-cruz.webp",
    alt: "Bodega De La Cruz",
    title: "Bodega De La Cruz",
    fondo: "oscuro",
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
    fondo: "oscuro",
  },
  {
    src: "/images/auspiciadores/devits.webp",
    alt: "Devits.pe",
    title: "Devits.pe · Ir al sitio",
    href: "https://devits.pe",
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
  },
  {
    src: "/images/auspiciadores/enzo-led-eventos.webp",
    alt: "Enzo LED & Eventos",
    title: "Enzo LED & Eventos",
    fondo: "oscuro",
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
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 28px -14px rgba(0, 0, 0, 0.6);
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Logos con letras blancas: sobre blanco desaparecen, así que llevan el azul del sitio. */
.tarjeta--oscura {
  border-color: rgba(255, 255, 255, 0.14);
  background: #0b2a4d;
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

/* Los logos con enlace (`href`) se abren en otra pestaña: el loop los atenúa al
   hover y aquí lo anulamos para que la tarjeta no se opaque. */
.auspiciadores :deep(.logoloop:not([data-muted]) .logoloop__item:not([data-color]) a.logoloop__content:hover) {
  opacity: 1;
}

/* Con `step` el motor marca como activo al logo más cercano al centro y el loop
   mostraría su nombre sin que nadie lo señale: el nombre solo sale al hover. */
.auspiciadores :deep(.logoloop__item[data-active]:not(:hover):not(:focus-within) .logoloop__tip) {
  opacity: 0;
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
