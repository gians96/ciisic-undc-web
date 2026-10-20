<template>
  <SemanaSistemicaActividadPagina
    :actividad="actividad"
    kicker="Eventos académicos"
    titulo="Hackathon"
    descripcion="Un espacio de innovación y creatividad tecnológica donde estudiantes y egresados desarrollarán soluciones para desafíos reales de la comunidad, con énfasis en Seguridad Ciudadana, Ciudades Inteligentes y Desarrollo Sostenible."
  >
    <section aria-labelledby="about-hackathon">
      <p class="ss-kicker">«Innovación, Investigación y Tecnología para el Desarrollo Sostenible»</p>
      <h2 id="about-hackathon" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Soluciones reales en una sola jornada.</h2>
      <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        La Hackathon UNDC 2026 es presencial, por equipos de 2 a 5 integrantes, en los laboratorios y ambientes habilitados de la Universidad Nacional de Cañete. La asignación específica se publica el 25 de octubre. Las categorías compiten y se premian de manera independiente; no se permiten equipos mixtos entre ambas categorías.
      </p>

      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="categoria in categorias" :key="categoria.nombre" class="ss-card p-5 sm:p-6">
          <div class="flex items-start gap-3">
            <span class="ss-icon-box h-10 w-10">
              <Icon :name="categoria.icono" class="h-5 w-5" />
            </span>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{{ categoria.nivel }}</p>
            <h3 class="mt-1 font-bold text-white">{{ categoria.nombre }}</h3>
            <p class="mt-2 text-sm leading-6 text-slate-300">{{ categoria.descripcion }}</p>
          </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12" aria-labelledby="ejes-hackathon">
      <p class="ss-kicker">¿Qué puedes desarrollar?</p>
      <h2 id="ejes-hackathon" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Tecnología para tu comunidad</h2>
      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="eje in ejes" :key="eje.titulo" class="ss-card flex items-start gap-4 p-5">
          <Icon :name="eje.icono" class="mt-0.5 h-6 w-6 shrink-0 text-primary-400" />
          <div>
            <h3 class="font-bold text-white">{{ eje.titulo }}</h3>
            <p class="mt-1 text-sm leading-6 text-slate-300">{{ eje.descripcion }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12" aria-labelledby="fases-hackathon">
      <p class="ss-kicker">Jueves 29 de octubre</p>
      <h2 id="fases-hackathon" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Proceso de la competencia</h2>
      <ol class="ss-timeline mt-7">
        <li v-for="fase in fases" :key="fase.titulo">
          <span class="ss-timeline-hora">{{ fase.hora }}<small v-if="fase.nota" class="block text-xs font-normal text-slate-400">{{ fase.nota }}</small></span>
          <div>
            <h3 class="font-bold text-white">{{ fase.titulo }}</h3>
            <p class="mt-1 text-sm leading-6 text-slate-300">{{ fase.descripcion }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="mt-12" aria-labelledby="premios-hackathon">
      <p class="ss-kicker">Premios</p>
      <h2 id="premios-hackathon" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Certificación y premio monetario</h2>
      <p class="mt-4 max-w-3xl leading-7 text-slate-300">
        Primer puesto de la Categoría A y primer puesto de la Categoría B: certificación para todo el equipo ganador y premio monetario. El monto oficial se confirmará el 25 de octubre de 2026, según el total de inscritos. La premiación está programada para el 30 de octubre a las 8:00 p. m., en la sede de San Luis.
      </p>
    </section>

    <section class="mt-12 rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8" aria-labelledby="info-hackathon">
      <div class="flex items-start gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-300 ring-1 ring-primary-400/20">
          <Icon name="heroicons:information-circle" class="h-6 w-6" />
        </span>
        <div>
          <h2 id="info-hackathon" class="text-xl font-bold text-white">Información oficial</h2>
          <p class="mt-2 leading-7 text-slate-300">
            Consulta las reglas completas de participación, fases, evaluación, restricciones y premiación en las bases oficiales. La inscripción queda completa cuando se verifican los datos de todos los integrantes y el pago.
          </p>
        </div>
      </div>
    </section>

    <SemanaSistemicaAfiche :actividad="actividad" />
  </SemanaSistemicaActividadPagina>
</template>

<script setup lang="ts">
import { actividadPorSlug } from '~/data/semana-sistemica'

const actividad = actividadPorSlug('hackathon')

const categorias = [
  { icono: 'heroicons:academic-cap', nivel: 'Categoría A', nombre: 'Estudiantes de pregrado', descripcion: 'Estudiantes de la UNDC y de universidades e institutos invitados. Se priorizan prototipos funcionales e innovadores orientados a resolver el desafío elegido.' },
  { icono: 'heroicons:briefcase', nivel: 'Categoría B', nombre: 'Egresados', descripcion: 'Egresados y graduados de la EPIS de la UNDC. Se priorizan la madurez técnica, la viabilidad de implementación y la arquitectura escalable.' },
]

const ejes = [
  { icono: 'heroicons:shield-check', titulo: 'Seguridad ciudadana', descripcion: 'Tecnologías para abordar desafíos relacionados con la seguridad de la comunidad.' },
  { icono: 'heroicons:building-office-2', titulo: 'Ciudades inteligentes', descripcion: 'Soluciones digitales para responder a necesidades del entorno urbano.' },
  { icono: 'heroicons:globe-alt', titulo: 'Desarrollo sostenible', descripcion: 'Propuestas tecnológicas orientadas al bienestar ciudadano y la sostenibilidad.' },
  { icono: 'heroicons:cpu-chip', titulo: 'Prototipos tecnológicos', descripcion: 'Aplicaciones web o móviles, sistemas IoT, hardware y prototipos interactivos.' },
]

const fases = [
  { hora: '5:40 p. m.', nota: 'apertura', titulo: 'Inauguración', descripcion: 'Apertura oficial de la jornada en los ambientes habilitados.' },
  { hora: '6:00 p. m.', nota: 'a 6:30 p. m.', titulo: 'Fase 1 Presentación y validación de la problemática', descripcion: 'Elevator pitch de 3 minutos para presentar el problema y 2 minutos de retroalimentación del jurado.' },
  { hora: '8:30 p. m.', nota: 'a 9:00 p. m.', titulo: 'Fase 2 Presentación de la propuesta de solución', descripcion: 'Exposición técnica de 5 minutos sobre la solución, arquitectura, tecnologías y metodología.' },
  { hora: '9:00 p. m.', nota: 'a 9:30 p. m.', titulo: 'Break de cena', descripcion: 'Pausa para la cena, según la elección del equipo participante.' },
  { hora: '10:30 p. m.', nota: 'a 11:30 p. m.', titulo: 'Fase 3 Exposición final y demostración', descripcion: 'Exposición de 10 minutos con demostración funcional o interactiva del prototipo y preguntas del jurado.' },
]

useSeoMeta({
  title: 'Hackathon | VIII CIISIC',
  description: 'Jueves 29 de octubre, de 6:00 p. m. a 11:30 p. m.: categorías, fases, inscripción y premios de la Hackathon UNDC 2026.',
  ogTitle: 'Hackathon | VIII CIISIC',
  ogDescription: 'Hackathon UNDC 2026: innovación, investigación y tecnología para el desarrollo sostenible.',
  ogImage: '/images/eventos/hackathon.webp',
})
</script>
