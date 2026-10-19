<template>
  <div class="alumni-page min-h-screen bg-[#041d39] text-white">
    <section class="alumni-hero relative overflow-hidden border-b border-white/10">
      <NuxtImg
        :src="encuentroEgresados.portada.src"
        :alt="encuentroEgresados.portada.alt"
        :width="encuentroEgresados.portada.ancho"
        :height="encuentroEgresados.portada.alto"
        sizes="100vw"
        class="absolute inset-0 h-full w-full object-cover object-center"
        fetchpriority="high"
      />
      <div class="hero-overlay absolute inset-0" aria-hidden="true" />

      <div class="relative mx-auto flex min-h-[600px] max-w-7xl flex-col justify-between px-6 py-10 sm:min-h-[670px] lg:px-8 lg:py-14 2xl:max-w-[1600px]">
        <NuxtLink to="/#encuentro-egresados" class="back-link inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-primary-200 hover:text-white">
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          Volver al inicio
        </NuxtLink>

        <div class="max-w-4xl pb-4">
          <span class="hero-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[.2em] backdrop-blur">
            <Icon name="heroicons:user-group" class="h-5 w-5" />
            Comunidad de egresados
          </span>
          <h1 class="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Encuentro de Egresados 2026
          </h1>
          <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            Un espacio para volver a encontrarnos, compartir experiencias y fortalecer los vínculos de la comunidad de Ingeniería de Sistemas.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <span class="hero-chip">
              <Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-300" />
              {{ encuentroEgresados.fecha }}
            </span>
            <span class="hero-chip">
              <Icon name="heroicons:clock" class="h-5 w-5 text-primary-300" />
              {{ encuentroEgresados.horario }}
            </span>
            <span class="hero-chip hero-chip-muted">
              <Icon name="heroicons:photo" class="h-5 w-5 text-amber-300" />
              Archivo fotográfico
            </span>
          </div>
          <a href="#inscripcion-egresados" class="primary-cta mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold">
            Consultar inscripción
            <Icon name="heroicons:arrow-down" class="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20 2xl:max-w-[1600px]">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)] lg:items-start lg:gap-14">
        <section aria-labelledby="sobre-encuentro">
          <p class="section-kicker">Sobre el encuentro</p>
          <h2 id="sobre-encuentro" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            Una comunidad que mantiene sus vínculos en el tiempo.
          </h2>
          <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            El Encuentro de Egresados forma parte del VIII CIISIC 2026 y propone un momento de reencuentro para la comunidad de la Escuela Profesional de Ingeniería de Sistemas de la UNDC.
          </p>
          <p class="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            La inscripción es gratuita e independiente de los planes del congreso. La actividad se realizará en la Casa de la Cultura; el programa se comunicará cuando sea confirmado oficialmente.
          </p>
        </section>

        <aside class="event-card rounded-3xl border border-white/10 p-6 sm:p-8" aria-labelledby="datos-encuentro">
          <div class="flex items-center gap-3">
            <span class="event-mark inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
              <Icon name="heroicons:calendar-days" class="h-6 w-6" />
            </span>
            <div>
              <p class="text-xs font-bold uppercase tracking-[.16em] text-primary-300">VIII CIISIC 2026</p>
              <h2 id="datos-encuentro" class="mt-1 text-xl font-bold text-white">Información del evento</h2>
            </div>
          </div>

          <dl class="mt-7 divide-y divide-white/10">
            <div v-for="dato in datosEvento" :key="dato.label" class="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
              <dt class="text-xs font-bold uppercase tracking-[.14em] text-slate-400">{{ dato.label }}</dt>
              <dd class="font-semibold leading-6 text-white">
                {{ dato.value }}
              </dd>
            </div>
          </dl>

          <a href="#inscripcion-egresados" class="secondary-cta mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold">
            Ver inscripción gratuita
            <Icon name="heroicons:arrow-down" class="h-5 w-5" />
          </a>
        </aside>
      </div>

      <EncuentroEgresadosTarjetaInscripcion class="mt-16 lg:mt-20" />

      <section class="mt-16 lg:mt-20" aria-labelledby="experiencia-anterior-title">
        <div class="max-w-3xl">
          <p class="section-kicker">Recuerdos de un encuentro anterior</p>
          <h2 id="experiencia-anterior-title" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Así compartimos nuestras experiencias
          </h2>
          <p class="mt-5 leading-7 text-slate-300">
            Estas actividades pertenecen a un encuentro anterior y se presentan como memoria de la comunidad. No constituyen el programa oficial de 2026.
          </p>
        </div>

        <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="experiencia in encuentroEgresados.experienciaAnterior"
            :key="experiencia.titulo"
            class="memory-card rounded-2xl border border-white/10 p-6"
          >
            <span class="memory-icon inline-flex h-11 w-11 items-center justify-center rounded-xl">
              <Icon :name="experiencia.icono" class="h-6 w-6" />
            </span>
            <h3 class="mt-5 text-lg font-bold text-white">{{ experiencia.titulo }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-300">{{ experiencia.descripcion }}</p>
          </article>
        </div>
      </section>

      <EncuentroEgresadosGaleria :imagenes="encuentroEgresados.galeria" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { encuentroEgresados } from '~/data/encuentro-egresados'

const datosEvento = [
  { label: 'Dirigido a', value: encuentroEgresados.dirigidoA },
  { label: 'Lugar', value: encuentroEgresados.lugar },
  { label: 'Participación', value: encuentroEgresados.participacion },
]

useSeoMeta({
  title: 'Encuentro de Egresados 2026 | VIII CIISIC',
  description: 'Inscripción gratuita e información del Encuentro de Egresados de Ingeniería de Sistemas del VIII CIISIC 2026.',
  ogTitle: 'Encuentro de Egresados 2026 | VIII CIISIC',
  ogDescription: 'Martes 27 de octubre, de 18:00 a 20:00: encuentro gratuito para egresados de Ingeniería de Sistemas de la UNDC.',
  ogImage: encuentroEgresados.portada.src,
})
</script>

<style scoped>
.alumni-hero { background: #052c54; }
.hero-overlay {
  background:
    linear-gradient(90deg, #041d39f7 0%, #041d39dc 48%, #041d3970 100%),
    linear-gradient(to top, #041d39f2 0%, transparent 62%);
}
.hero-badge {
  border: 1px solid #fbbf244d;
  background: #f59e0b1f;
  color: #fde68a;
}
.hero-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid #ffffff24;
  border-radius: 9999px;
  background: #041d39c4;
  padding: 0.65rem 0.95rem;
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}
.hero-chip-muted { border-color: #fbbf2438; }
.back-link:focus-visible,
.primary-cta:focus-visible,
.secondary-cta:focus-visible {
  outline: 2px solid #67e8f9;
  outline-offset: 3px;
}
.section-kicker {
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.primary-cta,
.secondary-cta {
  background: #00d9e8;
  color: #032f5f;
  box-shadow: 0 12px 34px #00d9e82b;
  transition: transform 0.2s ease, background 0.2s ease;
}
.primary-cta:hover,
.secondary-cta:hover {
  background: #67e8f9;
  transform: translateY(-2px);
}
.event-card {
  background:
    radial-gradient(circle at 88% 12%, #f59e0b14, transparent 38%),
    linear-gradient(145deg, #0a3157d9, #062541f2);
  box-shadow: 0 18px 50px #020f2038;
}
.event-mark {
  border: 1px solid #fbbf2438;
  background: #f59e0b14;
  color: #fcd34d;
}
.memory-card {
  background: linear-gradient(145deg, #082d50cc, #06233f);
  box-shadow: 0 16px 44px #020f202e;
}
.memory-icon {
  border: 1px solid #67e8f933;
  background: #00d9e812;
  color: #67e8f9;
}
@media (max-width: 639px) {
  .hero-overlay {
    background:
      linear-gradient(to top, #041d39fa 4%, #041d39c7 58%, #041d3975 100%),
      linear-gradient(90deg, #041d39c7, transparent);
  }
}
@media (prefers-reduced-motion: reduce) {
  .primary-cta,
  .secondary-cta { transition: none; }
  .primary-cta:hover,
  .secondary-cta:hover { transform: none; }
}
</style>
