<template>
  <section class="py-20 bg-slate-900 relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Header con navegación -->
      <div class="flex items-center justify-between mb-12">
        <!-- Título -->
        <div class="flex items-center space-x-3">
          <h2 class="text-3xl lg:text-4xl font-bold text-white">
            Eventos y Concursos
          </h2>
        </div>
      </div>

      <!-- Grid de trending items -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Trending Card Principal -->
        <div
          v-for="(evento, index) in eventosItems"
          :key="evento.id"
          class=" bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden "
        >
          <!-- Creator info header -->
          <div class="p-4 border-b border-slate-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center"
                >
                  <span class="text-black font-bold text-sm">
                    {{ evento.icon }}
                  </span>
                </div>
                <div>
                  <p class="text-white text-sm font-medium">
                    {{ evento.title }}
                  </p>
                  <p class="text-gray-400 text-xs">{{ evento.creator }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Imagen principal -->
          <div class="relative aspect-square">
            <div
              class="w-full h-full flex items-center justify-center"
            >
              <template v-if="evento.image.startsWith('/')">
                <img
                  :src="evento.image"
                  :alt="evento.title"
                  class="w-full h-full object-cover"
                />
              </template>
              <template v-else>
                <div
                  class="text-6xl flex items-center justify-center w-full h-full"
                >
                  {{ evento.image }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// ============================================================================
// INTERFACES
// ============================================================================

interface EventosItem {
  id: string;
  icon: string;
  title: string;
  creator: string;
  image: string;
}

// ============================================================================
// DATA
// ============================================================================

const currentSlide = ref(0);

const eventosItems: EventosItem[] = [
  {
    id: "1",
    icon: "🎉",
    title: "Comparsa Sistémica",
    creator: "Comité de Comparsa",
    image: "/images/eventos/comparsa.webp",
  },
  {
    id: "2",
    icon: "📣",
    title: "Conversatorio de Investigación",
    creator: "@Comité de Conversatorio",
    image: "/images/eventos/conversatorio.webp",
  },
  {
    id: "3",
    icon: "🎤",
    title: "Ponencias Magistrales",
    creator: "@Comité Académico",
    image: "/images/eventos/ponencias.webp",
  },
  {
    id: "4",
    icon: "💻",
    title: "Hackathon",
    creator: "@Comité Eventos Académicos",
    image: "/images/eventos/hackathon.webp",
  },
  {
    id: "5",
    icon: "👨‍💻",
    title: "Concurso de Programación",
    creator: "@Comité Eventos Académicos",
    image: "/images/eventos/programacion.webp",
  },
  {
    id: "6",
    icon: "🎮",
    title: "Torneo E-sports",
    creator: "@Comité Eventos Académicos",
    image: "/images/eventos/esports.webp",
  },
  {
    id: "7",
    icon: "📄",
    title: "Call for Papers",
    creator: "@Comité Científico",
    image: "/images/eventos/callforpaper.webp",
  },
  {
    id: "8",
    icon: "👑",
    title: "Reinado Sistemico",
    creator: "@Comité Reinado",
    image: "/images/eventos/reinado.webp",
  },
  {
    id: "9",
    icon: "🏅",
    title: "Juegos Deportivos",
    creator: "@Comité Juegos Deportivos",
    image: "/images/eventos/deportes.webp",
  },
];

// ============================================================================
// METHODS
// ============================================================================

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 3;
};

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? 2 : currentSlide.value - 1;
};

// ============================================================================
// LIFECYCLE
// ============================================================================

let slideInterval: NodeJS.Timeout;

onMounted(() => {
  // Auto-slide cada 5 segundos
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
});

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});
</script>

<style scoped>
/* ============================================================================
   ESTILOS DE TOP TRENDING
   ============================================================================ */

/* Efectos para las trending cards */
.trending-card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.trending-card:hover {
  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.15);
}

/* Efectos de hover para las imágenes */
.trending-card:hover .aspect-square > div {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

/* Animaciones de entrada escalonada */
.trending-card:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.trending-card:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.trending-card:nth-child(3) {
  animation: fadeInUp 0.6s ease-out 0.5s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efectos de los botones de navegación */
button:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

/* Efectos especiales para los overlays */
.absolute.inset-0 {
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

/* Efectos de los indicadores */
.w-2.h-2 {
  transition: all 0.3s ease;
}

.bg-green-500.w-2.h-2 {
  transform: scale(1.5);
}

/* Glassmorphism para las cards */
.trending-card {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Efectos de brillo en los precios */
.text-yellow-500 {
  text-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .flex.items-center.justify-between {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  h2 {
    font-size: 2rem !important;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .trending-card:hover {
    transform: none;
  }

  .trending-card:hover .aspect-square > div {
    transform: none;
  }

  .trending-card {
    animation: none;
  }

  button:hover {
    transform: none;
  }
}

/* Focus states */
button:focus,
.trending-card:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

/* Efectos de pulso para elementos destacados */
.bg-yellow-500 {
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 5px rgba(234, 179, 8, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.8);
  }
}
</style>
