<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-secondary-900">
    <!-- Background con gradiente -->
    <div class="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900" />
    
    <!-- Contenido del preloader -->
    <div class="relative z-10 text-center">
      <!-- Logo animado -->
      <div class="mb-8">
        <NuxtImg
          src="/images/logo/logo.png"
          alt="MYKD Logo"
          width="200"
          height="80"
          class="h-16 w-auto mx-auto animate-pulse"
          loading="eager"
        />
      </div>

      <!-- Spinner personalizado -->
      <div class="relative">
        <!-- Círculo exterior -->
        <div class="w-16 h-16 border-4 border-secondary-600 rounded-full animate-spin mx-auto">
          <div class="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-spin" />
        </div>

        <!-- Punto central -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full animate-ping" />
      </div>

      <!-- Texto de carga -->
      <div class="mt-6">
        <h3 class="text-lg font-medium text-white mb-2">Cargando MYKD</h3>
        <p class="text-sm text-gray-400">Preparando la mejor experiencia gaming...</p>
      </div>

      <!-- Barra de progreso -->
      <div class="mt-6 w-64 mx-auto">
        <div class="h-1 bg-secondary-700 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-primary animate-pulse" :style="{ width: `${progress}%` }" />
        </div>
      </div>
    </div>

    <!-- Efectos decorativos -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping opacity-60" />
      <div class="absolute top-3/4 right-1/4 w-1 h-1 bg-primary rounded-full animate-ping opacity-40 animation-delay-1000" />
      <div class="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-50 animation-delay-500" />
    </div>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// PROPS
// ============================================================================

interface Props {
  progress?: number
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0
})

// ============================================================================
// ESTADO LOCAL
// ============================================================================

const progress = ref(0)

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Simular progreso de carga
  const interval = setInterval(() => {
    progress.value += Math.random() * 15
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(interval)
    }
  }, 100)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
/* ============================================================================
   ESTILOS DEL PRELOADER
   ============================================================================ */

/* Animaciones personalizadas */
@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Delays para las animaciones */
.animation-delay-500 {
  animation-delay: 500ms;
}

.animation-delay-1000 {
  animation-delay: 1000ms;
}

/* Spinner con gradiente */
.spinner-gradient {
  background: conic-gradient(from 0deg, transparent, var(--tg-theme-primary));
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Efecto de brillo en el logo */
.logo-glow {
  filter: drop-shadow(0 0 20px rgba(69, 248, 130, 0.5));
}

/* Responsive */
@media (max-width: 768px) {
  .preloader-logo {
    height: 3rem;
  }
  
  .progress-bar {
    width: 16rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .animate-spin,
  .animate-pulse,
  .animate-ping {
    animation: none;
  }
}
</style>
