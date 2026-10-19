<template>
  <SemanaSistemicaActividadPagina
    :actividad="actividad"
    kicker="Eventos académicos"
    titulo="Concurso de Programación"
    descripcion="Competencia académica en la que equipos de estudiantes ponen a prueba sus habilidades de lógica algorítmica, resolución de problemas, eficiencia y calidad de código mediante desafíos de programación."
  >
    <section aria-labelledby="about-programacion">
      <p class="ss-kicker">Sobre la actividad</p>
      <h2 id="about-programacion" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Lógica, eficiencia y código limpio en equipo.</h2>
      <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        El VIII Concurso de Programación UNDC 2026 reúne a estudiantes de Ingeniería de Sistemas de la Universidad Nacional de Cañete y a delegaciones de otras instituciones de educación superior invitadas al VIII CIISIC 2026.
      </p>

      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="fact in datos" :key="fact.label" class="ss-card flex items-start gap-4 p-5">
          <Icon :name="fact.icon" class="mt-0.5 h-6 w-6 shrink-0 text-primary-400" />
          <div>
            <p class="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{{ fact.label }}</p>
            <p class="mt-1 font-semibold leading-relaxed text-white">{{ fact.value }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12" aria-labelledby="categorias-programacion">
      <p class="ss-kicker">Categorías de competencia</p>
      <h2 id="categorias-programacion" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Tres niveles, un solo ganador por categoría</h2>
      <div class="mt-7 grid gap-4 sm:grid-cols-3">
        <article v-for="categoria in categorias" :key="categoria.nombre" class="ss-card p-5 sm:p-6">
          <div class="flex items-start gap-3">
            <span class="ss-icon-box h-10 w-10">
              <Icon :name="categoria.icono" class="h-5 w-5" />
            </span>
            <div>
              <h3 class="font-bold text-white">{{ categoria.nombre }}</h3>
              <p class="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-slate-400">{{ categoria.ciclos }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-300">{{ categoria.descripcion }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12" aria-labelledby="cronograma-programacion">
      <p class="ss-kicker">Cronograma oficial</p>
      <h2 id="cronograma-programacion" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Fechas clave del concurso</h2>
      <ol class="ss-timeline mt-7">
        <li v-for="hito in cronograma" :key="hito.titulo">
          <span class="ss-timeline-hora">{{ hito.hora }}<small v-if="hito.nota" class="block text-xs font-normal text-slate-400">{{ hito.nota }}</small></span>
          <div>
            <h3 class="font-bold text-white">{{ hito.titulo }}</h3>
            <p v-if="hito.descripcion" class="mt-1 text-sm leading-6 text-slate-300">{{ hito.descripcion }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="mt-12" aria-labelledby="evaluacion-programacion">
      <p class="ss-kicker">Evaluación y premiación</p>
      <h2 id="evaluacion-programacion" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Qué evalúa el jurado</h2>
      <p class="mt-4 max-w-3xl leading-7 text-slate-300">
        La evaluación considera funcionalidad, eficiencia algorítmica, estructuras de datos, calidad e innovación, sustentación técnica y uso adecuado de herramientas. Se premiará al equipo que obtenga el primer puesto en cada categoría, con certificación y premio monetario. El monto del premio se confirmará oficialmente el 26 de octubre.
      </p>
    </section>

    <section class="mt-12 rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8" aria-labelledby="info-programacion">
      <div class="flex items-start gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-300 ring-1 ring-primary-400/20">
          <Icon name="heroicons:information-circle" class="h-6 w-6" />
        </span>
        <div>
          <h2 id="info-programacion" class="text-xl font-bold text-white">Información oficial</h2>
          <p class="mt-2 leading-7 text-slate-300">
            El reglamento del concurso, los requisitos, los temarios, las normas de participación y los criterios de evaluación están en las bases oficiales. La inscripción se completa una vez que el Comité de Eventos Académicos verifica el pago.
          </p>
        </div>
      </div>
    </section>

    <SemanaSistemicaAfiche :actividad="actividad" />
  </SemanaSistemicaActividadPagina>
</template>

<script setup lang="ts">
import { actividadPorSlug } from '~/data/semana-sistemica'

const actividad = actividadPorSlug('programacion')

const datos = [
  { icon: 'heroicons:user-group', label: 'Quiénes participan', value: 'Estudiantes de Ingeniería de Sistemas de la UNDC y delegaciones invitadas al VIII CIISIC 2026, en equipos de 2 o 3 estudiantes.' },
  { icon: 'heroicons:academic-cap', label: 'Exclusividad', value: 'Participación exclusiva para estudiantes regulares; no se admiten egresados. Cada estudiante integra un solo equipo y compite en una sola categoría.' },
  { icon: 'heroicons:banknotes', label: 'Costo de inscripción', value: 'S/ 15 por equipo. Inscripciones del 9 al 23 de octubre de 2026, hasta las 8:00 p. m.' },
  { icon: 'heroicons:computer-desktop', label: 'Lugar', value: 'Laboratorios de cómputo del Pabellón Académico de la EPIS. El laboratorio específico se comunica con anticipación.' },
]

const categorias = [
  { icono: 'heroicons:sparkles', nombre: 'Básico', ciclos: 'Ciclos I a III', descripcion: 'Tres preguntas o ejercicios de lógica y programación.' },
  { icono: 'heroicons:bolt', nombre: 'Intermedio', ciclos: 'Ciclos IV a VII', descripcion: 'Dos preguntas o ejercicios de mayor exigencia algorítmica.' },
  { icono: 'heroicons:trophy', nombre: 'Avanzado', ciclos: 'Ciclos VIII a X', descripcion: 'Un problema práctico integrador.' },
]

const cronograma = [
  { hora: '3:00 p. m.', nota: '26 de octubre', titulo: 'Asignación de laboratorios y premio oficial', descripcion: 'Se publica el laboratorio de cada equipo y el monto del premio.' },
  { hora: '5:00 p. m.', nota: 'a 7:00 p. m.', titulo: 'Competencia', descripcion: 'Desarrollo de los desafíos de programación por categorías.' },
  { hora: '7:00 p. m.', nota: 'desde', titulo: 'Evaluación y sustentación técnica', descripcion: 'El jurado evalúa las soluciones y cada equipo sustenta su trabajo.' },
  { hora: '8:00 p. m.', nota: '27 de octubre', titulo: 'Publicación de ganadores', descripcion: 'Se anuncian los primeros puestos de cada categoría.' },
  { hora: 'Clausura', nota: '29 de octubre', titulo: 'Ceremonia de premiación', descripcion: 'Premiación durante la clausura oficial del VIII CIISIC 2026.' },
]

useSeoMeta({
  title: 'Concurso de Programación | VIII CIISIC',
  description: 'Martes 27 de octubre, de 5:00 p. m. a 7:00 p. m.: categorías, cronograma, evaluación e inscripción del VIII Concurso de Programación UNDC 2026.',
  ogTitle: 'Concurso de Programación | VIII CIISIC',
  ogDescription: 'VIII Concurso de Programación UNDC 2026: lógica, eficiencia y código limpio en equipo.',
  ogImage: '/images/eventos/programacion.webp',
})
</script>
