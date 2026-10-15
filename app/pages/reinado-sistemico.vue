<!-- /reinado-sistemico: la página ahora vive en /semana-sistemica/reinado; se conserva la ruta para que los
     enlaces antiguos (afiches, redes, correos) no den 404. -->
<template>
  <div />
</template>

<script setup lang="ts">
await navigateTo('/semana-sistemica/reinado', { redirectCode: 301, replace: true })
</script>
