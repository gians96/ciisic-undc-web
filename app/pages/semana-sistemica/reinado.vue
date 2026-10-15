<template>
  <SemanaSistemicaActividadPagina
    :actividad="actividad"
    kicker="Actividad cultural"
    titulo="Miss & Míster Sistemas 2026"
    descripcion="Liderazgo, talento, creatividad e identidad institucional en el certamen oficial de la Escuela Profesional de Ingeniería de Sistemas."
  >
    <section aria-labelledby="about-reinado">
      <p class="ss-kicker">Sobre la actividad</p>
      <h2 id="about-reinado" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Una celebración para representar y conectar a nuestra comunidad.</h2>
      <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        El certamen forma parte de las actividades de integración del VIII CIISIC 2026 y reconoce las capacidades de liderazgo, comunicación, talento, creatividad, identidad institucional y desenvolvimiento escénico de sus participantes.
      </p>

      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="fact in officialFacts" :key="fact.label" class="ss-card flex items-start gap-4 p-5">
          <Icon :name="fact.icon" class="mt-0.5 h-6 w-6 shrink-0 text-primary-400" />
          <div>
            <p class="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{{ fact.label }}</p>
            <p class="mt-1 font-semibold leading-relaxed text-white">{{ fact.value }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12" aria-labelledby="participation-process">
      <p class="ss-kicker">Cómo participar</p>
      <h2 id="participation-process" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Proceso de inscripción</h2>
      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="step in registrationSteps" :key="step.number" class="ss-step p-5 sm:p-6">
          <span class="ss-step-number">{{ step.number }}</span>
          <h3 class="mt-5 text-lg font-bold text-white">{{ step.title }}</h3>
          <p class="mt-2 text-sm leading-6 text-slate-300">{{ step.description }}</p>
        </article>
      </div>
    </section>

    <section class="mt-12" aria-labelledby="competition-stages">
      <p class="ss-kicker">Desarrollo del certamen</p>
      <h2 id="competition-stages" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Etapas principales</h2>
      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="stage in competitionStages" :key="stage.title" class="ss-card p-5 sm:p-6">
          <div class="flex items-start gap-3">
            <span class="ss-icon-box h-10 w-10">
              <Icon :name="stage.icon" class="h-5 w-5" />
            </span>
            <div>
              <h3 class="font-bold text-white">{{ stage.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-300">{{ stage.description }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12 rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8" aria-labelledby="important-info">
      <div class="flex items-start gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-300 ring-1 ring-primary-400/20">
          <Icon name="heroicons:information-circle" class="h-6 w-6" />
        </span>
        <div>
          <h2 id="important-info" class="text-xl font-bold text-white">Información oficial</h2>
          <p class="mt-2 leading-7 text-slate-300">
            Las bases, requisitos específicos y comunicaciones posteriores serán informados por la comisión organizadora mediante el formulario oficial de inscripción.
          </p>
        </div>
      </div>
    </section>

    <SemanaSistemicaGaleria id="reinado" :imagenes="actividad.galeria" />
    <SemanaSistemicaAfiche :actividad="actividad" />
  </SemanaSistemicaActividadPagina>
</template>

<script setup lang="ts">
import { actividadPorSlug } from '~/data/semana-sistemica'

const actividad = actividadPorSlug('reinado')

const registrationSteps = [
  { number: '01', title: 'Abre el formulario', description: 'Accede al formulario oficial desde el botón de inscripción.' },
  { number: '02', title: 'Acredita tu matrícula', description: 'Adjunta la constancia o el documento solicitado para acreditar tu condición de estudiante.' },
  { number: '03', title: 'Completa el pago', description: 'Realiza el pago de S/ 50 y presenta el comprobante según las indicaciones oficiales.' },
  { number: '04', title: 'Espera la confirmación', description: 'La comisión publicará la relación de participantes aptos en la reunión informativa.' },
]

const officialFacts = [
  { icon: 'heroicons:user-group', label: 'Representación', value: 'Una pareja —Miss y Míster— por cada ciclo académico.' },
  { icon: 'heroicons:academic-cap', label: 'Quiénes participan', value: 'Estudiantes de Ingeniería de Sistemas matriculados en el semestre 2026-II.' },
  { icon: 'heroicons:clipboard-document-check', label: 'Registro', value: 'La inscripción de cada participante es individual.' },
  { icon: 'heroicons:calendar-days', label: 'Plazo', value: 'Inscripciones hasta el jueves 15 de octubre, a las 23:59 (hora de Lima).' },
]

const competitionStages = [
  { icon: 'heroicons:user-group', title: 'Presentación grupal e individual', description: 'Opening coordinado y presentación de nombre, ciclo y mensaje de representación.' },
  { icon: 'heroicons:star', title: 'Presentación de talento', description: 'Talento artístico, cultural, deportivo, académico o tecnológico de hasta tres minutos.' },
  { icon: 'heroicons:chat-bubble-left-right', title: 'Pregunta y respuesta', description: 'Se evalúan claridad, coherencia, seguridad y capacidad argumentativa.' },
  { icon: 'heroicons:sparkles', title: 'Desfile en traje de gala', description: 'Evaluación de presencia escénica, porte, seguridad, elegancia y desenvolvimiento.' },
  { icon: 'heroicons:trophy', title: 'Deliberación y premiación', description: 'El jurado consolida los resultados y la comisión proclama a las personas ganadoras.' },
]

useSeoMeta({
  title: 'Miss & Míster Sistemas 2026 | VIII CIISIC',
  description: 'Consulta los requisitos, etapas, bases e inscripción de Miss & Míster Sistemas 2026 de la Universidad Nacional de Cañete.',
  ogTitle: 'Miss & Míster Sistemas 2026 | VIII CIISIC',
  ogDescription: 'Representación, creatividad y espíritu universitario en el VIII CIISIC 2026.',
  ogImage: '/images/eventos/reinado.webp',
})
</script>
