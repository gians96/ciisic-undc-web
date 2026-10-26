<!-- Layout de la credencial 3D (spec 013): sin menú ni pie del sitio, solo la marca del congreso. La página
     es personal (se abre con el enlace del correo) y no se indexa. -->
<template>
  <div class="min-h-screen bg-[#041d39] text-white">
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    <header class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="VIII CIISIC 2026, ir al inicio">
        <NuxtImg src="images/logo/preloader.png" alt="" class="h-9 w-9 object-contain" />
        <span class="text-base font-bold tracking-wide">
          VIII CIISIC <span class="ml-1 text-xs font-semibold text-primary-300">2026</span>
        </span>
      </NuxtLink>
      <NuxtLink
        to="/"
        class="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-primary-400 hover:text-white"
      >
        Ir al sitio
      </NuxtLink>
    </header>
    <main id="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
/* Visible solo al enfocarlo con el teclado */
.skip-link {
  position: fixed;
  top: -5rem;
  left: 1rem;
  z-index: 100;
  border-radius: 0.75rem;
  background: #00d9e8;
  color: #032f5f;
  padding: 0.75rem 1rem;
  font-weight: bold;
  transition: top 0.15s ease;
}

.skip-link:focus {
  top: 1rem;
}
</style>
