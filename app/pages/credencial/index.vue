<!-- Índice de la credencial: sin demostración. El enlace real llega en el correo de
     aprobación con el código de cada persona (/credencial/<codigo>). -->
<template>
  <div class="min-h-screen">
    <section class="relative overflow-hidden py-16 lg:py-24">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"/>

      <div class="custom-container relative">
        <div class="mx-auto max-w-2xl text-center">
          <p class="kicker">Credencial de asistente</p>
          <h1 class="mt-3 text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Tu credencial <span class="text-primary-300">3D</span>
          </h1>
          <p class="mt-4 text-lg text-slate-300">
            Tu credencial está en el correo de aprobación de tu inscripción: el mensaje
            adjunta la información general del congreso y trae un enlace con tu código.
          </p>
        </div>

        <div class="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-3">
          <div
            v-for="(paso, i) in PASOS"
            :key="paso.titulo"
            class="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left backdrop-blur-sm"
          >
            <span class="font-mono text-xs font-bold text-primary-300">0{{ i + 1 }}</span>
            <h2 class="mt-2 text-base font-bold text-white">{{ paso.titulo }}</h2>
            <p class="mt-1.5 text-sm leading-relaxed text-slate-400">{{ paso.texto }}</p>
          </div>
        </div>

        <p class="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-slate-400">
          Si tu inscripción ya fue aprobada y no encuentras el correo, revisa el spam o
          escríbenos a la organización con tu número de registro.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Credencial | VIII CIISIC 2026",
  description:
    "Tu credencial digital del VIII CIISIC 2026 llega en el correo de aprobación y se abre con tu código.",
});

const PASOS = [
  {
    titulo: "Aprueba tu inscripción",
    texto: "Envía tu voucher y espera la revisión de la organización.",
  },
  {
    titulo: "Abre el correo",
    texto: "El correo de aprobación trae el informe del congreso y el enlace a tu credencial.",
  },
  {
    titulo: "Personalízala",
    texto: "Elige tus tecnologías: la primera define el color de tu credencial.",
  },
];
</script>

<style scoped>
.kicker {
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
</style>
