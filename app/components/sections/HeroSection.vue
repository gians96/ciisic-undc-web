<template>
  <section
    class="relative min-h-[70vh] md:min-h-[80vh] lg:min-h-screen lg:-top-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0">
      <!-- Círculos decorativos de fondo (como en la imagen) -->
      <div
        class="absolute top-32 left-32 w-24 h-24 border border-yellow-500/30 rounded-full"
      ></div>
      <div
        class="absolute top-64 right-48 w-16 h-16 border border-yellow-500/20 rounded-full"
      ></div>
      <div
        class="absolute bottom-32 left-48 w-12 h-12 border border-yellow-500/25 rounded-full"
      ></div>
      <div
        class="absolute bottom-48 right-32 w-20 h-20 border border-yellow-500/20 rounded-full"
      ></div>

      <!-- Puntos decorativos dorados -->
      <div
        class="absolute top-48 left-64 w-3 h-3 bg-yellow-500 rounded-full opacity-60"
      ></div>
      <div
        class="absolute top-96 right-64 w-2 h-2 bg-yellow-500 rounded-full opacity-50"
      ></div>
      <div
        class="absolute bottom-64 right-48 w-3 h-3 bg-yellow-500 rounded-full opacity-40"
      ></div>
    </div>

    <!-- Contenido Principal -->
    <div class="relative z-10 min-h-screen flex items-center">
      <div class="w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Lado Izquierdo - Contenido de Texto -->
          <div class="md:text-left text-center space-y-8">
            <!-- Título Principal STEAMING -->
            <div class="space-y-2">
              <h1
                class="text-gray-800 pt-4 dark:text-white font-bold text-4xl lg:text-7xl"
              >
                <span
                  class="text-transparent bg-clip-text bg-gradient-to-br from-primary to-[#8cd66a]"
                  >VII</span
                >
                Congreso Internacional de Ingeniería de Sistemas e Investigación
                Científica.
              </h1>
              <div class="pt-8">
                <Countdown />
              </div>
            </div>

            <!-- Botón Registro -->
            <div class="pt-4">
              <NuxtLink
                to="/contact"
                class="inline-block bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-4 text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
                style="
                  clip-path: polygon(
                    0 0,
                    calc(100% - 20px) 0,
                    100% 100%,
                    20px 100%
                  );
                "
              >
                REGISTRO
              </NuxtLink>
            </div>
          </div>

          <!-- Lado Derecho - Contenedores de Imágenes -->
          <div class="lg:h-full hidden md:flex">
            <div
              class="flex w-full h-96 min-h-[24rem] lg:min-h-[none] lg:w-full lg:h-full items-center relative"
            >
              <div
                class="absolute z-0 top-1/2 -translate-y-1/2 w-5/6 right-0 h-[calc(80%+20px)] bg-gradient-to-tr opacity-25 from-primary to-pink-300 dark:from-[#570cac] dark:to-primary blur-2xl"
              ></div>
              <div
                class="absolute w-3/5 h-full z-10 p-1 -translate-y-1/2 top-1/2 right-3 rounded-3xl bg-white dark:bg-body shadow-lg shadow-box-shadow border border-box-border"
              >
                <img
                  src="/images/hero/img-hero-1.webp"
                  alt="In studio"
                  width="500"
                  height="auto"
                  loading="lazy"
                  class="w-full h-full rounded-2xl object-cover"
                />
              </div>
              <div
                class="absolute -translate-y-1/2 top-1/2 h-[calc(80%-2rem)] w-[calc(40%-20px)] p-1 rounded-3xl bg-white dark:bg-body shadow-lg shadow-box-shadow border border-box-border"
              >
                <img
                  src="/images/hero/img-hero-2.webp"
                  alt="Happy in studio"
                  width="200"
                  height="auto"
                  loading="lazy"
                  class="w-full h-full rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Elementos decorativos flotantes mejorados -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Partículas flotantes verdes y doradas -->
      <div
        class="absolute top-1/4 left-1/4 w-2 h-2 bg-green-500 rounded-full animate-ping"
        style="animation-delay: 0s"
      ></div>
      <div
        class="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-500 rounded-full animate-ping"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-500 rounded-full animate-ping"
        style="animation-delay: 2s"
      ></div>
      <div
        class="absolute top-2/3 left-1/5 w-1 h-1 bg-yellow-500 rounded-full animate-ping"
        style="animation-delay: 3s"
      ></div>

      <!-- Líneas decorativas -->
      <div
        class="absolute top-1/2 left-0 w-32 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
      ></div>
      <div
        class="absolute top-1/3 right-0 w-32 h-px bg-gradient-to-l from-transparent via-green-500/50 to-transparent"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
// ============================================================================
// INTERFACES
// ============================================================================

interface HeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

// ============================================================================
// PROPS
// ============================================================================

const props = withDefaults(defineProps<HeroProps>(), {
  title: "STEAMING",
  subtitle: "VIDEO GAMES ONLINE",
  description: "Live gaming experience with cutting-edge technology.",
  ctaText: "CONTACT US",
  ctaLink: "/contact",
});
</script>

<style scoped>
/* ============================================================================
   ESTILOS DEL HERO SECTION - STEAMING GAMES
   ============================================================================ */

/* Animaciones personalizadas */
@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(2deg);
  }
}

@keyframes glow-pulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
  }
}

/* Efectos especiales del fondo */
section {
  background: radial-gradient(
      circle at 20% 80%,
      rgba(34, 197, 94, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(245, 158, 11, 0.1) 0%,
      transparent 50%
    ),
    linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
}

/* Efectos especiales para el título STEAMING */
h1 {
  text-shadow: 0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3),
    0 0 60px rgba(34, 197, 94, 0.1);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.8));
}

/* Efectos del badge LIVE GAMING */
.bg-green-500 {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Efectos del badge DEFEAT */
.bg-gradient-to-r {
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.8));
}

/* Hover effects mejorados */
a:hover {
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
  transform: scale(1.05) !important;
}

/* Efectos de los logos de patrocinadores */
.absolute.bottom-8 div {
  transition: all 0.3s ease;
}

.absolute.bottom-8 div:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

/* Efectos del personaje */
.text-9xl {
  animation: float-slow 6s ease-in-out infinite;
  filter: drop-shadow(0 10px 30px rgba(34, 197, 94, 0.3));
}

/* Círculos decorativos */
.border-yellow-500\/30,
.border-yellow-500\/20,
.border-yellow-500\/25 {
  animation: glow-pulse 4s ease-in-out infinite;
}

/* Partículas flotantes */
.bg-yellow-500.rounded-full {
  animation: float-slow 8s ease-in-out infinite;
}

.bg-green-500.rounded-full {
  animation: float-slow 6s ease-in-out infinite reverse;
}

/* Responsive mejoras */
@media (max-width: 768px) {
  h1 {
    font-size: 4rem !important;
    line-height: 1;
  }

  h2 {
    font-size: 1.25rem !important;
  }

  .grid {
    text-align: center;
  }

  .absolute.bottom-8 {
    position: relative !important;
    bottom: auto !important;
    left: auto !important;
    text-align: center;
    margin-top: 2rem;
  }

  .absolute.bottom-8 .flex {
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 3rem !important;
  }

  .text-9xl {
    font-size: 4rem !important;
  }

  .w-80.h-80 {
    width: 16rem !important;
    height: 16rem !important;
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .text-9xl {
    animation: none;
  }

  .border-yellow-500\/30,
  .border-yellow-500\/20,
  .border-yellow-500\/25 {
    animation: none;
  }
}

/* Focus states para accesibilidad */
a:focus {
  outline: 2px solid #22c55e;
  outline-offset: 4px;
}

/* Efectos de entrada */
.space-y-8 > * {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.space-y-8 > *:nth-child(1) {
  animation-delay: 0.2s;
}

.space-y-8 > *:nth-child(2) {
  animation-delay: 0.4s;
}

.space-y-8 > *:nth-child(3) {
  animation-delay: 0.6s;
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

/* Efectos para el lado derecho */
.relative.z-10 {
  animation: fadeInRight 1s ease-out 0.8s both;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
