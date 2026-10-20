<!-- Marco común de las páginas de la Semana Sistémica: portada con fecha, hora y lugar, columna de
     contenido (slot) y panel de inscripción. Los estilos `.ss-*` son compartidos por las tres páginas. -->
<template>
  <div class="ss-pagina min-h-screen bg-[#041d39] text-white" :style="{ '--acento': actividad.acento }">
    <section class="relative overflow-hidden border-b border-white/10">
      <NuxtImg
        :src="actividad.portada.src"
        :alt="actividad.portada.alt"
        :width="actividad.portada.ancho"
        :height="actividad.portada.alto"
        sizes="100vw"
        class="absolute inset-0 h-full w-full object-cover"
        :class="posicion"
        fetchpriority="high"
      />
      <div class="ss-hero-overlay absolute inset-0" aria-hidden="true" />
      <a
        v-if="actividad.creditoPortada"
        :href="actividad.creditoPortada.href"
        target="_blank"
        rel="noopener noreferrer"
        class="absolute bottom-4 right-4 rounded-full border border-white/20 bg-[#041d39]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:text-primary-200"
      >
        {{ actividad.creditoPortada.texto }}
      </a>
      <span v-else class="absolute bottom-4 right-4 rounded-full border border-white/20 bg-[#041d39]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
        Imagen de edición anterior
      </span>

      <div class="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-between px-6 py-10 sm:min-h-[640px] lg:px-8 lg:py-14 2xl:max-w-[1600px]">
        <NuxtLink to="/" class="ss-back inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-primary-200 hover:text-white">
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          Volver al inicio
        </NuxtLink>

        <div class="max-w-4xl pb-5">
          <span class="ss-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[.2em] backdrop-blur">
            <Icon :name="actividad.icono" class="h-5 w-5" /> {{ kicker }}
          </span>
          <h1 class="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">{{ titulo }}</h1>
          <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">{{ descripcion }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <span class="ss-chip"><Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-300" />{{ etiquetaDia(actividad.fecha) }}</span>
            <span class="ss-chip"><Icon name="heroicons:clock" class="h-5 w-5 text-primary-300" />{{ actividad.horaTexto }}</span>
            <span class="ss-chip"><Icon name="heroicons:map-pin" class="h-5 w-5 text-primary-300" />{{ actividad.lugar }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20 2xl:max-w-[1600px]">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)] lg:items-start">
        <div><slot /></div>
        <SemanaSistemicaPanelInscripcion :actividad="actividad" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActividadSemanaSistemica } from '~/data/semana-sistemica'
import { etiquetaDia } from '~/utils/ponencias-especializadas'

withDefaults(defineProps<{
  actividad: ActividadSemanaSistemica
  /** Etiqueta sobre el título, p. ej. «Actividad cultural». */
  kicker: string
  titulo: string
  descripcion: string
  /** Clase de `object-position` de la portada. */
  posicion?: string
}>(), { posicion: 'object-center' })
</script>

<style>
.ss-pagina { --acento: #67e8f9; }
.ss-hero-overlay { background: linear-gradient(90deg, #041d39f7 0%, #041d39d9 48%, #041d3973 100%), linear-gradient(to top, #041d39f2 0%, transparent 60%); }
.ss-chip { display: inline-flex; align-items: center; gap: .55rem; border: 1px solid #ffffff24; border-radius: 9999px; background: #041d39b8; padding: .65rem .95rem; color: #e2e8f0; font-size: .875rem; font-weight: 600; backdrop-filter: blur(10px); }
.ss-badge { border: 1px solid color-mix(in srgb, var(--acento) 30%, transparent); background: color-mix(in srgb, var(--acento) 12%, transparent); color: color-mix(in srgb, var(--acento) 55%, white); }
.ss-icon-box { display: flex; flex-shrink: 0; align-items: center; justify-content: center; border-radius: .75rem; background: color-mix(in srgb, var(--acento) 12%, transparent); color: color-mix(in srgb, var(--acento) 55%, white); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--acento) 28%, transparent); }
.ss-kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
.ss-card { background: #ffffff08; border: 1px solid #ffffff1a; border-radius: 1rem; }
.ss-step { background: linear-gradient(145deg, #0a3157d9, #062541f2); box-shadow: 0 18px 45px #020f202b; border: 1px solid #ffffff1a; border-radius: 1rem; }
.ss-step-number { display: inline-flex; height: 2.25rem; min-width: 2.25rem; align-items: center; justify-content: center; border-radius: .75rem; background: #22d3ee1a; padding: 0 .65rem; color: #67e8f9; font-size: .75rem; font-weight: 800; }
.ss-timeline { --ss-hora: 6rem; --ss-gap: 1.75rem; position: relative; margin: 0; padding: 0; list-style: none; }
.ss-timeline::before { content: ''; position: absolute; top: .5rem; bottom: .5rem; left: calc(var(--ss-hora) + var(--ss-gap) / 2 - 1px); width: 2px; background: #ffffff1f; }
.ss-timeline > li { position: relative; display: grid; grid-template-columns: var(--ss-hora) 1fr; gap: var(--ss-gap); padding: .7rem 0; }
.ss-timeline > li::before { content: ''; position: absolute; top: 1.15rem; left: calc(var(--ss-hora) + var(--ss-gap) / 2 - .45rem); height: .9rem; width: .9rem; border-radius: 9999px; background: var(--acento); box-shadow: 0 0 0 4px #041d39; }
.ss-timeline-hora { color: #67e8f9; font-size: .875rem; font-weight: 700; line-height: 1.6; font-variant-numeric: tabular-nums; }
.ss-btn { display: inline-flex; min-height: 3rem; width: 100%; align-items: center; justify-content: center; gap: .5rem; border-radius: .75rem; padding: .75rem 1.25rem; font-weight: 700; transition: transform .2s ease, background .2s ease, border-color .2s ease; }
.ss-btn-primary { background: #00d9e8; color: #032f5f; box-shadow: 0 12px 34px #00d9e82b; }
.ss-btn-primary:hover { background: #67e8f9; transform: translateY(-2px); }
.ss-btn-secondary { border: 1px solid #67e8f94d; background: #67e8f912; color: #cffafe; }
.ss-btn-secondary:hover { border-color: #67e8f9; background: #67e8f91f; }
.ss-back:focus-visible, .ss-btn:focus-visible, .ss-link:focus-visible { outline: 2px solid #67e8f9; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .ss-btn { transition: none; } .ss-btn-primary:hover { transform: none; } }
@media (max-width: 480px) {
  .ss-timeline { --ss-hora: 5rem; --ss-gap: 1.25rem; }
}
</style>
