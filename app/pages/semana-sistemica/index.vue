<!-- /semana-sistemica: el tab del menú es un desplegable; quien llegue a la ruta base va a la primera actividad
     (la comparsa, el lunes 26) en lugar de ver un 404. -->
<template>
  <div />
</template>

<script setup lang="ts">
await navigateTo('/semana-sistemica/comparsa', { replace: true })
</script>
