<template>
  <section class="py-20 bg-slate-900 relative overflow-hidden">
    <div class="absolute inset-0">
      <div
        class="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-green-500 to-transparent transform -skew-y-2 opacity-20"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-green-500 to-transparent transform skew-y-2 opacity-20"
      ></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
      <Slide>
        <template #title>
          Memorias
          <span class="text-green-500">{{ anioAnterior }}</span>
        </template>
        <CardImagenes
          v-for="(card, index) in cards"
          :key="`card-${index}`"
          :titulo="card.titulo"
          :descripcion="card.descripcion"
          :imagen="card.imagen"
          :categoria="card.categoria"
        >
            <template #footer>
                Galería <span class="text-yellow-500/50">2024</span>
            </template>
        </CardImagenes>
      </Slide>
    </div>
  </section>
</template>

<script setup>
import Slide from "./Slide.vue";
import CardImagenes from "./Cards.vue";
const anioAnterior = new Date().getFullYear() - 1;

const cards = [
  {
    titulo: "Conferencia de prensa Stallman",
    descripcion: "Rosa García",
    imagen: "/images/memorias-2024/panzas_stallman.webp",
    categoria: 1
  },
  {
    titulo: "Conferencia de prensa Stallman",
    descripcion: "Ana Martínez",
    imagen: "/images/memorias-2024/conferencia_stallman.avif",
    categoria: 1
  },
  {
    titulo: "Inicio torneo Esports",
    descripcion: "Carlos Rivera",
    imagen: "/images/memorias-2024/posers_xd.webp",
    categoria: 2
  },
  {
    titulo: "Torneo Counter Strike",
    descripcion: "Sofía López",
    imagen: "/images/memorias-2024/torneo_counter.webp",
    categoria: 2
  },
  {
    titulo: "Pasacalle Sistemas",
    descripcion: "Miguel Torres",
    imagen: "/images/memorias-2024/pasacalle.webp",
    categoria: 4
  },
  {
    titulo: "CIISIC 2024 día 3",
    descripcion: "Laura Sánchez",
    imagen: "/images/memorias-2024/conferencia_dia3.webp",
    categoria: 1
  },
  {
    titulo: "Ponencias CIISIC 2024 día 3",
    descripcion: "Diego Morales",
    imagen: "/images/memorias-2024/ponencias_dia3.webp",
    categoria: 1
  },
  {
    titulo: "Dr. Alcides - CIISIC 2024",
    descripcion: "Carmen Ruiz",
    imagen: "/images/memorias-2024/algodon_dia3.webp",
    categoria: 1
  },
  {
    titulo: "Reinado Sistemas 2024",
    descripcion: "Javier Pérez",
    imagen: "/images/memorias-2024/reinado.webp",
    categoria: 3
  },
];
</script>
