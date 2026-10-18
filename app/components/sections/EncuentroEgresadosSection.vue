<template>
  <section
    id="encuentro-egresados"
    class="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24 2xl:max-w-[1600px]"
    aria-labelledby="encuentro-egresados-title"
  >
    <div class="alumni-panel grid overflow-hidden rounded-[2rem] border border-white/10 lg:grid-cols-[1.08fr_.92fr]">
      <figure class="relative min-h-[310px] overflow-hidden sm:min-h-[400px] lg:min-h-[520px]">
        <NuxtImg
          :src="encuentroEgresados.portadaLanding.src"
          :alt="encuentroEgresados.portadaLanding.alt"
          :width="encuentroEgresados.portadaLanding.ancho"
          :height="encuentroEgresados.portadaLanding.alto"
          sizes="100vw lg:55vw"
          class="absolute inset-0 h-full w-full object-cover object-center transition duration-700 hover:scale-[1.02]"
          loading="lazy"
        />
        <div class="alumni-photo-shade absolute inset-0" aria-hidden="true" />
        <figcaption class="absolute bottom-5 left-5 rounded-full border border-white/20 bg-[#041d39]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur sm:bottom-7 sm:left-7">
          Archivo fotográfico
        </figcaption>
      </figure>

      <div class="relative flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
        <div class="alumni-mark mb-7 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
          <Icon name="heroicons:user-group" class="h-7 w-7" />
        </div>
        <p class="kicker">Comunidad · Egresados</p>
        <h2 id="encuentro-egresados-title" class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Encuentro de Egresados 2026
        </h2>
        <p class="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Un espacio para reencontrarnos, compartir experiencias y fortalecer los vínculos de nuestra comunidad de Ingeniería de Sistemas.
        </p>

        <div class="mt-7 grid gap-3 sm:grid-cols-2">
          <div class="info-chip">
            <Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-400" />
            <span>{{ encuentroEgresados.fechaCorta }}</span>
          </div>
          <div class="info-chip">
            <Icon name="heroicons:clock" class="h-5 w-5 text-primary-400" />
            <span>{{ encuentroEgresados.horario }}</span>
          </div>
        </div>

        <NuxtLink
          :to="encuentroEgresados.ruta"
          class="details-link mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold"
        >
          Ver detalles
          <Icon name="heroicons:arrow-right" class="h-5 w-5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { encuentroEgresados } from '~/data/encuentro-egresados'
</script>

<style scoped>
.alumni-panel {
  background:
    radial-gradient(circle at 88% 12%, #f59e0b1c, transparent 34%),
    linear-gradient(145deg, #092f57, #061f3b);
  box-shadow: 0 28px 90px #020f204d;
}
.alumni-photo-shade {
  pointer-events: none;
  background: linear-gradient(to top, #041d39bd 0%, transparent 50%);
}
.alumni-mark {
  border: 1px solid #fbbf2440;
  background: #f59e0b17;
  color: #fcd34d;
  box-shadow: 0 12px 35px #f59e0b14;
}
.kicker {
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.info-chip {
  display: flex;
  min-height: 3.25rem;
  align-items: center;
  gap: 0.65rem;
  border: 1px solid #ffffff1a;
  border-radius: 0.9rem;
  background: #ffffff08;
  padding: 0.8rem 1rem;
  color: #e2e8f0;
  font-size: 0.9rem;
  font-weight: 600;
}
.details-link {
  background: #00d9e8;
  color: #032f5f;
  box-shadow: 0 12px 34px #00d9e82b;
  transition: transform 0.2s ease, background 0.2s ease;
}
.details-link:hover {
  background: #67e8f9;
  transform: translateY(-2px);
}
.details-link:focus-visible {
  outline: 2px solid #67e8f9;
  outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) {
  .alumni-panel img,
  .details-link {
    transition: none;
  }
  .alumni-panel img:hover,
  .details-link:hover {
    transform: none;
  }
}
</style>
