<template>
  <div class="min-h-screen bg-[#041d39]">
    <div class="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
      <NuxtLink to="/papers" class="inline-flex items-center gap-2 font-semibold text-primary-300 hover:text-white">
        <Icon name="heroicons:arrow-left" class="h-5 w-5" />
        Volver a Call for Papers
      </NuxtLink>
    </div>
    <PaperSubmissionForm />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Registrar paper | VIII CIISIC 2026',
  description: 'Registra tu artículo para el VIII CIISIC 2026: autores, universidades y documento PDF.',
})
</script>
