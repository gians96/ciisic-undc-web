<template>
  <section
    id="merchandising-oficial"
    class="scroll-mt-24"
    aria-labelledby="merchandising-titulo"
  >
    <div class="max-w-2xl">
      <p class="kicker">Merchandising oficial</p>
      <h2
        id="merchandising-titulo"
        class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
      >
        Productos oficiales del VIII CIISIC 2026
      </h2>
    </div>

    <div class="mt-5 grid gap-4 sm:gap-5 lg:auto-rows-fr lg:grid-cols-2">
      <article
        v-for="producto in productos"
        :key="producto.id"
        class="producto-oficial flex h-full items-center gap-3 overflow-hidden rounded-[1.5rem] p-3 sm:gap-4 sm:p-4 lg:p-5"
        :aria-labelledby="`${producto.id}-titulo`"
      >
        <div
          class="relative h-36 w-36 shrink-0 sm:h-40 sm:w-40 lg:h-44 lg:w-44"
        >
          <img
            :src="producto.imagen"
            :alt="producto.alt"
            :width="producto.ancho"
            :height="producto.alto"
            loading="lazy"
            decoding="async"
            class="product-img absolute inset-0 h-full w-full object-contain"
            :class="[
              producto.escala,
              producto.destacados ? 'producto-mezclado' : '',
            ]"
          >
        </div>

        <div class="flex h-full min-w-0 flex-1 flex-col justify-center">
          <h3
            :id="`${producto.id}-titulo`"
            class="text-base font-bold leading-snug tracking-tight text-white sm:text-lg"
          >
            {{ producto.titulo }}
          </h3>
          <p
            v-if="producto.descripcion"
            class="mt-1 text-xs leading-snug text-slate-300 sm:text-sm"
          >
            {{ producto.descripcion }}
          </p>

          <ul
            v-if="producto.destacados"
            class="mt-2 flex flex-1 flex-col justify-center gap-2 border-t border-white/10 pt-2"
          >
            <li
              v-for="item in producto.specs"
              :key="item.label"
              class="flex items-center gap-2.5"
            >
              <span
                class="icon-tile inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              >
                <Icon :name="item.icon" class="h-4 w-4" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <p class="text-xs font-bold leading-snug text-white sm:text-sm">
                  {{ item.label }}
                </p>
                <p class="text-[0.7rem] leading-snug text-slate-300 sm:text-xs">
                  {{ item.value }}
                </p>
              </div>
            </li>
          </ul>

          <dl
            v-else
            class="mt-2 grid grid-cols-1 content-start gap-x-3 gap-y-2 border-t border-white/10 pt-2 sm:grid-cols-2"
          >
            <div
              v-for="spec in producto.specs"
              :key="spec.label"
              class="flex min-w-0 items-start gap-1.5"
            >
              <span
                class="icon-tile inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
              >
                <Icon :name="spec.icon" class="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <dt
                  class="text-[0.55rem] font-bold uppercase tracking-[0.1em] text-slate-400"
                >
                  {{ spec.label }}
                </dt>
                <dd
                  class="text-[0.7rem] font-semibold leading-snug text-white sm:text-xs"
                >
                  {{ spec.value }}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const productos = [
  {
    id: 'tomatodo',
    titulo: 'Tomatodo oficial del VIII CIISIC 2026',
    descripcion: '',
    imagen: '/images/merchandising/tomatodo-oficial.png',
    alt: 'Tomatodo oficial negro del VIII CIISIC 2026 con el logotipo del congreso',
    ancho: 1920,
    alto: 1080,
    escala: 'scale-[2.2]',
    destacados: false,
    specs: [
      {
        icon: 'heroicons:cube',
        label: 'Producto',
        value: 'Tomatodo personalizado',
      },
      {
        icon: 'heroicons:shield-check',
        label: 'Material',
        value: 'Acero inoxidable con revestimiento de silicona',
      },
      {
        icon: 'heroicons:beaker',
        label: 'Capacidad',
        value: '550 ml',
      },
      {
        icon: 'heroicons:swatch',
        label: 'Color',
        value: 'Negro',
      },
    ],
  },
  {
    id: 'mochila',
    titulo: 'Mochila oficial del VIII CIISIC 2026',
    descripcion: '',
    imagen: '/images/merchandising/mochilaoficial.png?v=2026-10-18',
    alt: 'Mochila oficial negra del VIII CIISIC 2026 con el logotipo del congreso',
    ancho: 1920,
    alto: 1080,
    escala: 'scale-[1.85]',
    destacados: false,
    specs: [
      {
        icon: 'heroicons:shield-check',
        label: 'Material',
        value: 'Nylon',
      },
      {
        icon: 'heroicons:arrows-pointing-out',
        label: 'Medidas',
        value: '45 × 34 × 15 cm',
      },
      {
        icon: 'heroicons:rectangle-stack',
        label: 'Compartimentos',
        value: '2 bolsillos OE malla',
      },
      {
        icon: 'heroicons:computer-desktop',
        label: 'Otras características',
        value: 'Porta laptop',
      },
    ],
  },
  {
    id: 'certificado',
    titulo: 'Fotocheck y certificado oficial',
    descripcion: '',
    imagen: '/images/merchandising/certificado-y-credencial-ciisic.png',
    alt: 'Certificado de 100 horas y fotocheck con código QR del VIII CIISIC 2026',
    ancho: 1600,
    alto: 983,
    escala: '',
    destacados: true,
    specs: [
      {
        icon: 'heroicons:identification',
        label: 'Fotocheck con código QR',
        value: 'Tu acreditación con cordón.',
      },
      {
        icon: 'heroicons:academic-cap',
        label: 'Certificado de 100 horas',
        value: 'Horas académicas del congreso.',
      },
    ],
  },
] as const
</script>

<style scoped>
.producto-oficial {
  background:
    radial-gradient(circle at 88% 4%, #0a4b7a 0%, transparent 46%),
    #082c52;
  border: 1px solid #ffffff1c;
  box-shadow: 0 24px 70px #020f2024;
}
.product-img {
  filter: drop-shadow(0 12px 18px #020f2033) drop-shadow(0 0 14px #ffffff14);
}
.producto-mezclado {
  mix-blend-mode: lighten;
  filter: none;
}
.kicker {
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.icon-tile {
  background: #00d9e81a;
  color: #67e8f9;
}
</style>
