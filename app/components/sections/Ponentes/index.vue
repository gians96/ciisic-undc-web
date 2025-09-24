<template>
  <section
    class="relative bg-cover bg-center bg-no-repeat py-32 pb-24 min-h-screen"
    :style="`background-image: url(https://mykd-nuxt.vercel.app/images/bg/team_bg.jpg)`"
  >
    <div class="absolute inset-0 bg-gray-900/40" />

    <div class="container mx-auto px-6 relative z-10">
      <header class="flex justify-center mb-16">
        <div class="w-full max-w-2xl">
          <div class="text-center">
            <p
              class="text-green-400 text-sm font-semibold tracking-wider mb-4 uppercase"
            >
              <span
                class="pulse-bg px-4 py-1 rounded-full text-green-300"
                aria-hidden="true"
              >
                Invitados de reconocimiento
              </span>
            </p>

            <!-- Main title -->
            <h1
              id="team-title"
              class="text-white text-4xl md:text-5xl font-bold"
            >
              PONENTES INVITADOS
            </h1>

            <!-- Línea decorativa -->
            <div class="mt-4 flex justify-center">
              <div
                class="w-24 h-1 rounded bg-green-400 shadow shadow-green-500/50"
              />
            </div>
          </div>
        </div>
      </header>

      <!-- Ponentes -->
      <main class="flex justify-center">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl"
          role="list"
          aria-label="Lista de miembros del equipo"
        >
          <PerfilCard
            v-for="ponente in ponentes"
            :key="ponente.id"
            :nombre="ponente.nombre"
            :imagen="ponente.imagen"
            :empresa="ponente.empresa"
          />
        </div>
      </main>
    </div>
  </section>
</template>

<script setup>
import PerfilCard from "./PerfilCard.vue";

// Usar el composable centralizado de ponentes
const { ponentes } = usePonentes()

// Usar todos los ponentes para la sección en la página principal
</script>

<style scoped>
.pulse-bg {
  position: relative;
  display: inline-block;
  z-index: 0;
}

.pulse-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: rgba(34, 197, 94, 0.1);
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  animation: pulse-only-bg 1.8s infinite ease-out;
  z-index: -1;
}

@keyframes pulse-only-bg {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
}
</style>
