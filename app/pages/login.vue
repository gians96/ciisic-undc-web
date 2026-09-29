<!-- ============================================================================
     /login: el panel administrativo es una aplicación aparte (NUXT_PUBLIC_ADMIN_URL).
     Esta ruta solo redirige; si la URL no está configurada muestra un aviso.
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="bg-secondary-800 rounded-2xl shadow-2xl p-8 text-center">
        <NuxtLink to="/" class="inline-block mb-6">
          <NuxtImg
            src="/images/logo/logo.png"
            alt="VIII CIISIC"
            width="120"
            height="40"
            class="h-10 w-auto mx-auto"
          />
        </NuxtLink>
        <h1 class="text-3xl font-bold text-white mb-2">Panel administrativo</h1>
        <p class="text-gray-300" role="status">
          El panel administrativo no está disponible en este momento. Si formas parte de la organización,
          comunícate con el equipo técnico.
        </p>
        <NuxtLink
          to="/"
          class="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-black transition-colors duration-300 hover:bg-primary/90"
        >
          <Icon name="heroicons:home" class="h-5 w-5" aria-hidden="true" />
          Volver al inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Panel administrativo | VIII CIISIC',
  meta: [{ name: 'robots', content: 'noindex' }]
})

// La URL sale de la configuración (no de la petición): no hay redirección abierta.
// En SSR responde 302; en navegación cliente cambia de sitio con location.
const adminUrl = String(useRuntimeConfig().public.adminUrl || '').trim()
if (adminUrl) {
  await navigateTo(adminUrl, { external: true, redirectCode: 302 })
}
</script>
