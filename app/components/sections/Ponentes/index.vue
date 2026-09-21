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
              class="text-primary-400 text-sm font-semibold tracking-wider mb-4 uppercase"
            >
              <span
                class="pulse-bg px-4 py-1 rounded-full text-primary-300"
                aria-hidden="true"
              >
                VIII CIISIC 2026
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
                class="w-24 h-1 rounded bg-primary-400 shadow shadow-primary-500/50"
              />
            </div>
          </div>
        </div>
      </header>

      <main class="flex justify-center">
        <div class="max-w-2xl rounded-2xl border border-primary-400/25 bg-slate-900/80 p-8 text-center backdrop-blur">
          <Icon name="heroicons:user-group" class="mx-auto mb-5 h-14 w-14 text-primary-400" />
          <h2 class="mb-3 text-2xl font-semibold text-white">Anuncios próximamente</h2>
          <p class="text-lg leading-relaxed text-slate-300">
            Estamos confirmando a los especialistas nacionales e internacionales de la edición 2026.
          </p>
        </div>
      </main>
    </div>
  </section>
</template>

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
  background-color: rgba(0, 217, 232, 0.1);
  box-shadow: 0 0 0 0 rgba(0, 217, 232, 0.4);
  animation: pulse-only-bg 1.8s infinite ease-out;
  z-index: -1;
}

@keyframes pulse-only-bg {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 217, 232, 0.4);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(0, 217, 232, 0);
  }
}
</style>
