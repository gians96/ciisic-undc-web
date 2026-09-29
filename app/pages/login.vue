<!-- ============================================================================
     /login: el panel es una aplicación aparte; su URL se define en el backend y llega en la
     configuración del sitio (/api/publico/configuracion). Esta ruta solo redirige; si no hay URL
     muestra un aviso (y "Reintentar" si la configuración no cargó).
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
        <div role="status" aria-live="polite">
          <p v-if="urlPanel" class="text-gray-300">
            Te estamos llevando al panel. Si no ocurre en unos segundos,
            <a :href="urlPanel" class="font-semibold text-primary underline-offset-4 hover:underline">ábrelo aquí</a>.
          </p>
          <p v-else-if="error" class="text-gray-300">
            No pudimos obtener la dirección del panel en este momento. Revisa tu conexión e inténtalo nuevamente.
          </p>
          <p v-else class="text-gray-300">
            El panel administrativo no está disponible en este momento. Si formas parte de la organización,
            comunícate con el equipo técnico.
          </p>
        </div>
        <button
          v-if="error && !urlPanel"
          type="button"
          class="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/50 px-5 py-3 font-semibold text-primary transition-colors duration-300 hover:bg-primary/10 disabled:opacity-60"
          :disabled="reintentando"
          @click="reintentar"
        >
          <Icon name="heroicons:arrow-path" class="h-5 w-5" :class="{ 'animate-spin': reintentando }" aria-hidden="true" />
          Reintentar
        </button>
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

// La URL sale de la configuración del sitio (no de la petición): no hay redirección abierta y
// solo se aceptan URLs http(s) absolutas. En SSR responde 302; en navegación cliente cambia de
// sitio con location.
const { urlPanel, error, listo, recargar } = useConfiguracionSitio()
await listo
if (urlPanel.value) {
  await navigateTo(urlPanel.value, { external: true, redirectCode: 302 })
}

const reintentando = ref(false)

const reintentar = async () => {
  reintentando.value = true
  try {
    await recargar()
  } finally {
    reintentando.value = false
  }
  if (urlPanel.value) await navigateTo(urlPanel.value, { external: true })
}
</script>
