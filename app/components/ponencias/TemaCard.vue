<template>
  <article class="tema-card flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 p-5 sm:p-6" :class="{ 'is-external': hayExterno }">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <span class="rounded-full border border-white/15 bg-white/[.06] px-3 py-1 text-xs font-bold text-slate-200">
        Ponencia {{ String(numero).padStart(2, '0') }}
      </span>
      <span
        v-if="hayExterno"
        class="inline-flex items-center gap-1.5 rounded-full bg-primary-400 px-3 py-1 text-[.68rem] font-extrabold uppercase tracking-wider text-[#032f5f]"
      >
        <Icon name="heroicons:globe-alt" class="h-3.5 w-3.5" aria-hidden="true" />
        {{ speakers.length > 1 && !todosExternos ? 'Con ponente externo' : etiqueta }}
      </span>
    </div>

    <h3 class="mt-4 flex-1 text-xl font-bold leading-snug text-white sm:text-[1.35rem]">{{ talk.topic }}</h3>

    <dl class="mt-5 grid grid-cols-2 gap-3">
      <div class="fact rounded-2xl border border-white/10 bg-white/[.035] p-3.5">
        <dt class="flex items-center gap-2 text-[.68rem] font-semibold uppercase tracking-[.14em] text-slate-400">
          <Icon name="heroicons:clock" class="h-4 w-4 text-primary-400" aria-hidden="true" />Duración
        </dt>
        <dd class="mt-1.5 text-lg font-extrabold leading-tight text-white">{{ duracion }}</dd>
        <dd class="mt-0.5 text-xs font-medium text-slate-400">{{ horario }}</dd>
      </div>
      <div class="fact fact-room rounded-2xl border border-primary-400/40 bg-primary-400/10 p-3.5">
        <dt class="flex items-center gap-2 text-[.68rem] font-semibold uppercase tracking-[.14em] text-primary-200">
          <Icon name="heroicons:map-pin" class="h-4 w-4 text-primary-300" aria-hidden="true" />Ubicación
        </dt>
        <dd class="mt-1.5 text-lg font-extrabold leading-tight text-white">{{ talk.room }}</dd>
        <dd class="mt-0.5 text-xs font-medium text-primary-200/80">Ambiente de la ponencia</dd>
      </div>
    </dl>

    <div class="pt-5">
      <div class="flex items-center gap-3 border-t border-white/10 pt-5">
        <div class="flex shrink-0 -space-x-3">
          <NuxtImg
            v-for="speaker in speakers"
            :key="speaker.id"
            :src="speaker.image"
            alt=""
            width="96"
            height="96"
            class="h-12 w-12 rounded-full border-2 border-[#0a3157] object-cover object-top"
            loading="lazy"
          />
        </div>
        <div class="min-w-0">
          <p class="text-[.68rem] font-semibold uppercase tracking-[.14em] text-slate-400">{{ speakers.length > 1 ? 'Ponentes del tema' : 'Ponente' }}</p>
          <p v-for="speaker in speakers" :key="speaker.id" class="font-semibold leading-snug text-slate-100">{{ speaker.name }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { SpecializedSpeaker, SpecializedTalk } from '~/data/ponencias-especializadas'
import { duracionMin, duracionTexto, etiquetaDePonentes, rangoHorario } from '~/utils/ponencias-especializadas'

const props = defineProps<{
  talk: SpecializedTalk
  /** Quienes dictan el tema (uno o varios si lo comparten); el principal va primero. */
  speakers: readonly SpecializedSpeaker[]
  /** Posición de la ponencia dentro de su día (empieza en 1). */
  numero: number
}>()

const hayExterno = computed(() => props.speakers.some(speaker => speaker.external))
const todosExternos = computed(() => props.speakers.length > 0 && props.speakers.every(speaker => speaker.external))
const etiqueta = computed(() => etiquetaDePonentes(props.speakers.map(speaker => speaker.external)))
const duracion = computed(() => duracionTexto(duracionMin(props.talk.start, props.talk.end)))
const horario = computed(() => rangoHorario(props.talk.start, props.talk.end))
</script>

<style scoped>
.tema-card { background: linear-gradient(150deg, #0a3157d9, #062541f2); box-shadow: 0 20px 55px #020f2033; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.tema-card:hover { transform: translateY(-4px); border-color: #22d3ee59; box-shadow: 0 26px 68px #020f2052; }
.tema-card.is-external { border-color: #22d3ee47; }
.fact-room { box-shadow: 0 10px 24px -14px rgba(0, 217, 232, 0.35); }
@media (prefers-reduced-motion: reduce) { .tema-card { transition: none; } .tema-card:hover { transform: none; } }
</style>
