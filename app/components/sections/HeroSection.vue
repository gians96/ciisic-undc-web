<template>
  <section
    class="relative h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0">
      <!-- Círculos decorativos de fondo (responsive) -->
      <div
        class="absolute top-16 left-16 sm:top-32 sm:left-32 w-16 h-16 sm:w-24 sm:h-24 border border-yellow-500/30 rounded-full"
      ></div>
      <div
        class="absolute top-32 right-24 sm:top-64 sm:right-48 w-12 h-12 sm:w-16 sm:h-16 border border-yellow-500/20 rounded-full"
      ></div>
      <div
        class="absolute bottom-16 left-24 sm:bottom-32 sm:left-48 w-8 h-8 sm:w-12 sm:h-12 border border-yellow-500/25 rounded-full"
      ></div>
      <div
        class="absolute bottom-24 right-16 sm:bottom-48 sm:right-32 w-14 h-14 sm:w-20 sm:h-20 border border-yellow-500/20 rounded-full"
      ></div>

      <!-- Puntos decorativos dorados (responsive) -->
      <div
        class="absolute top-24 left-32 sm:top-48 sm:left-64 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full opacity-60"
      ></div>
      <div
        class="absolute top-48 right-32 sm:top-96 sm:right-64 w-1 h-1 sm:w-2 sm:h-2 bg-yellow-500 rounded-full opacity-50"
      ></div>
      <div
        class="absolute bottom-32 right-24 sm:bottom-64 sm:right-48 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full opacity-40"
      ></div>
    </div>

    <!-- Contenido Principal -->
    <div class="relative z-10 h-full flex items-center">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16" style="transform: scale(0.9); transform-origin: center;">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">
          <!-- Lado Izquierdo - Contenido de Texto -->
          <div
            class="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8 flex flex-col justify-center min-h-[80vh] sm:min-h-0"
          >
            <!-- Título Principal -->
            <div class="space-y-6 sm:space-y-4">
              <h1
                class="text-white font-bold text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl leading-tight"
              >
                <span
                  class="text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-300"
                  >VII</span
                >
                Congreso Internacional de Ingeniería de Sistemas e Investigación
                Científica.
              </h1>
              <div class="py-6 sm:py-4 lg:pt-8">
                <Countdown />
              </div>
            </div>

            <!-- Botón Registro -->
            <div class="pb-8 lg:pb-12">
              <NuxtLink
                to="/planes"
                class="inline-block bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
          <div class="hidden md:flex lg:h-full">
            <div
              class="flex w-full h-full items-center relative min-h-[400px] lg:min-h-[500px]"
            >
              <div
                class="absolute z-0 top-1/2 -translate-y-1/2 w-5/6 right-0 h-4/5 bg-gradient-to-tr opacity-25 from-green-500 to-emerald-300 blur-2xl"
              ></div>
              <div
                class="absolute w-3/5 h-4/5 z-10 p-1 -translate-y-1/2 top-1/2 -right-3 rounded-3xl bg-white shadow-2xl border"
              >
                <img
                  src="/images/hero/img-hero-1.webp"
                  alt="Congreso CIISIC"
                  width="500"
                  height="600"
                  loading="lazy"
                  class="w-full h-full rounded-2xl object-cover"
                />
              </div>
              <div
                class="absolute -translate-y-1/2 top-1/2 h-3/5 w-2/5 p-1 rounded-3xl bg-white shadow-2xl border"
              >
                <img
                  src="/images/hero/img-hero-2.webp"
                  alt="Tecnología e Innovación"
                  width="300"
                  height="400"
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
      <!-- Partículas flotantes verdes y doradas (responsive) -->
      <div
        class="absolute top-1/4 left-1/4 w-1 h-1 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-ping"
        style="animation-delay: 0s"
      ></div>
      <div
        class="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-500 rounded-full animate-ping"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/3 w-1 h-1 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-ping"
        style="animation-delay: 2s"
      ></div>
      <div
        class="absolute top-2/3 left-1/5 w-1 h-1 bg-yellow-500 rounded-full animate-ping"
        style="animation-delay: 3s"
      ></div>

      <!-- Líneas decorativas (responsive) -->
      <div
        class="absolute top-1/2 left-0 w-16 sm:w-32 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"
      ></div>
      <div
        class="absolute top-1/3 right-0 w-16 sm:w-32 h-px bg-gradient-to-l from-transparent via-green-500/50 to-transparent"
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
   ESTILOS DEL HERO SECTION - CIISIC CONGRESS
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

/* Efectos especiales para el título */
h1 {
  text-shadow: 0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.2),
    0 0 60px rgba(34, 197, 94, 0.1);
  filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.8));
}

/* Efectos del botón de registro */
.bg-green-500 {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Hover effects mejorados */
a:hover {
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4) !important;
  transform: scale(1.05) !important;
}

/* Círculos decorativos con animación */
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
    font-size: 3.5rem !important;
    line-height: 1.1;
  }

  .space-y-6 {
    gap: 1.5rem;
  }

  .grid {
    text-align: center;
  }
}

@media (max-width: 640px) {
  section {
    min-height: 100vh;
    min-height: 100dvh;
    /* Para navegadores modernos */
  }

  h1 {
    font-size: 3rem !important;
  }

  .px-4 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  .text-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2.75rem !important;
  }
}

/* Optimización para pantallas muy grandes */
@media (min-width: 1920px) {
  h1 {
    font-size: 5.5rem;
  }
}

/* Soporte para altura de viewport en móviles */
section {
  height: 100vh;
  height: 100dvh;
  /* Fallback para navegadores que soportan dvh */
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus states para accesibilidad */
a:focus {
  outline: 2px solid #22c55e;
  outline-offset: 4px;
}

/* Efectos de entrada */
.space-y-6 > *,
.space-y-8 > * {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.space-y-6 > *:nth-child(1),
.space-y-8 > *:nth-child(1) {
  animation-delay: 0.2s;
}

.space-y-6 > *:nth-child(2),
.space-y-8 > *:nth-child(2) {
  animation-delay: 0.4s;
}

.space-y-6 > *:nth-child(3),
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
.hidden.md\\:flex {
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
