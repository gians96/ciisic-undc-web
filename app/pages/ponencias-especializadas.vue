<template>
  <div class="especializadas-page min-h-screen bg-[#041d39] text-white">
    <section class="esp-hero relative overflow-hidden border-b border-white/10 px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
      <div class="esp-grid absolute inset-0" aria-hidden="true" />
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-300">VIII CIISIC UNDC · 2026</p>
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">Ponencias especializadas</h1>
        <p class="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
          Investigadores y profesionales compartirán experiencias, herramientas y perspectivas sobre los desafíos actuales de la ingeniería de sistemas.
        </p>
        <div class="mt-8 flex flex-wrap justify-center gap-3 text-sm">
          <span class="summary-chip"><Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-400" aria-hidden="true" />Martes 27 y miércoles 28 de octubre</span>
          <span class="summary-chip"><Icon name="heroicons:clock" class="h-5 w-5 text-primary-400" aria-hidden="true" />{{ horario }}</span>
          <span class="summary-chip"><Icon name="heroicons:map-pin" class="h-5 w-5 text-primary-400" aria-hidden="true" />Laboratorios y aulas</span>
        </div>

        <div class="mt-8 flex justify-center">
          <NuxtLink to="/inscripcion-ponencias" class="btn btn-primary">
            <Icon name="heroicons:ticket" class="h-5 w-5" aria-hidden="true" />
            Inscríbete a las ponencias
          </NuxtLink>
        </div>

        <div class="mt-8 flex justify-center">
          <UiSegmentedToggle v-model="vista" :options="opciones" label="Ver ponentes o temas especializados" id-prefix="vista-tab" />
        </div>
      </div>
    </section>

    <Transition name="vista" mode="out-in">
      <section
        v-if="vista === 'ponentes'"
        id="vista-panel-ponentes"
        key="ponentes"
        role="tabpanel"
        aria-labelledby="vista-tab-ponentes"
        class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20 2xl:max-w-[1600px]"
      >
        <div class="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Perfil profesional</p>
            <h2 class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Conoce a quienes dictan las ponencias</h2>
            <p class="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Primero nuestros ponentes externos y luego los docentes e investigadores de la comunidad. Abre cada tarjeta para leer su trayectoria.
            </p>
          </div>
          <div class="flex flex-wrap gap-3 text-sm lg:justify-end">
            <span class="summary-chip"><Icon name="heroicons:user-group" class="h-5 w-5 text-primary-400" aria-hidden="true" />{{ ponentes.length }} ponentes</span>
            <span class="summary-chip"><Icon name="heroicons:globe-alt" class="h-5 w-5 text-primary-400" aria-hidden="true" />{{ externos }} externos</span>
          </div>
        </div>

        <div class="ponente-grid grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          <PonenciasPonenteCard v-for="speaker in ponentes" :key="speaker.id" :speaker="speaker" />
        </div>
      </section>

      <section
        v-else
        id="vista-panel-temas"
        key="temas"
        role="tabpanel"
        aria-labelledby="vista-tab-temas"
        class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20 2xl:max-w-[1600px]"
      >
        <div class="mb-10">
          <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Temas, duración y ubicación</p>
          <h2 class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Elige la ponencia que más te interese</h2>
          <div class="mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-primary-400/25 bg-primary-400/[.07] p-4 sm:p-5">
            <Icon name="heroicons:information-circle" class="mt-0.5 h-6 w-6 shrink-0 text-primary-300" aria-hidden="true" />
            <p class="leading-relaxed text-slate-200">
              Todas las ponencias de cada día se dictan <strong class="text-white">al mismo tiempo</strong> en distintos ambientes: revisa el tema y la ubicación, y acude a la que más te interese.
            </p>
          </div>
        </div>

        <div class="space-y-14">
          <section v-for="dia in dias" :key="dia.date" :aria-labelledby="`dia-${dia.date}`">
            <div class="mb-6 flex flex-wrap items-end justify-between gap-4 border-l-4 border-primary-400 pl-4">
              <div>
                <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Ponencias simultáneas</p>
                <h2 :id="`dia-${dia.date}`" class="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{{ dia.etiqueta }}</h2>
              </div>
              <div class="flex flex-wrap gap-2 text-sm">
                <span class="summary-chip"><Icon name="heroicons:clock" class="h-5 w-5 text-primary-400" aria-hidden="true" />{{ rangoHorario(dia.talks[0]!.start, dia.talks[0]!.end) }}</span>
                <span class="summary-chip"><Icon name="heroicons:presentation-chart-bar" class="h-5 w-5 text-primary-400" aria-hidden="true" />{{ dia.talks.length }} ponencias</span>
              </div>
            </div>

            <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <PonenciasTemaCard
                v-for="(talk, index) in dia.talks"
                :key="talk.id"
                :talk="talk"
                :speaker="porId.get(talk.speakerId)!"
                :numero="index + 1"
              />
            </div>
          </section>
        </div>
      </section>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { specializedSpeakers, specializedTalks } from '~/data/ponencias-especializadas'
import { ponentesOrdenados, ponentesPorId, rangoHorario, temasPorDia } from '~/utils/ponencias-especializadas'

type Vista = 'ponentes' | 'temas'

const vista = ref<Vista>('ponentes')

const opciones = [
  { value: 'ponentes', label: 'Ponentes', icon: 'heroicons:user-group', controls: 'vista-panel-ponentes' },
  { value: 'temas', label: 'Temas especializados', icon: 'heroicons:presentation-chart-bar', controls: 'vista-panel-temas' },
]

const ponentes = ponentesOrdenados(specializedSpeakers)
const externos = ponentes.filter(speaker => speaker.external).length
const porId = ponentesPorId(specializedSpeakers)
const dias = temasPorDia(specializedTalks)
const primero = specializedTalks[0]
const horario = primero ? rangoHorario(primero.start, primero.end) : ''

useSeoMeta({
  title: 'Ponencias especializadas | VIII CIISIC 2026',
  description: 'Ponentes, temas, duración y ubicación de las ponencias especializadas del VIII CIISIC 2026 (27 y 28 de octubre) de la Universidad Nacional de Cañete.',
  ogTitle: 'Ponencias especializadas | VIII CIISIC 2026',
  ogDescription: 'Conoce a los ponentes y elige tu ponencia especializada en el VIII CIISIC 2026.',
})
</script>

<style scoped>
.esp-hero { background: radial-gradient(circle at 50% 0%, #087dd83d, transparent 48%), #041d39; }
.esp-grid { opacity: .25; background-image: linear-gradient(#1d7fb43d 1px, transparent 1px), linear-gradient(90deg, #1d7fb43d 1px, transparent 1px); background-size: 64px 64px; mask-image: linear-gradient(to bottom, black, transparent); }
.summary-chip { display: inline-flex; align-items: center; gap: .5rem; border: 1px solid #ffffff1a; border-radius: 9999px; background: #ffffff08; padding: .55rem .9rem; color: #cbd5e1; }
.vista-enter-active, .vista-leave-active { transition: opacity .25s ease, transform .25s ease; }
.vista-enter-from { opacity: 0; transform: translateY(14px); }
.vista-leave-to { opacity: 0; transform: translateY(-8px); }
@media (min-width: 1280px) { .ponente-grid > :last-child:nth-child(3n + 1) { grid-column-start: 2; } }
@media (prefers-reduced-motion: reduce) { .vista-enter-active, .vista-leave-active { transition: none; } }
</style>
