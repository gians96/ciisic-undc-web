<!-- /undc: página anterior con planes y precios fijos. Los planes vigentes (desde la API) están en
     /planes; se conserva la ruta para que los enlaces antiguos no den 404. -->
<template>
  <div />
</template>

<script setup lang="ts">
await navigateTo('/planes', { redirectCode: 301, replace: true })
</script>
