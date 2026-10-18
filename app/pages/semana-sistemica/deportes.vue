<template>
  <SemanaSistemicaActividadPagina
    :actividad="actividad"
    kicker="Torneo deportivo"
    titulo="Deportes y gincana"
    descripcion="Básquet, futsal, vóley, gincana y ajedrez en una jornada de integración en el campus de la UNDC."
    posicion="object-[center_65%]"
  >
    <section aria-labelledby="about-deportes">
      <p class="ss-kicker">Sobre la actividad</p>
      <h2 id="about-deportes" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Un día de competencia y recreación en el campus.</h2>
      <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        Las competencias recreativas y deportivas del VIII CIISIC se organizan por salón o ciclo, con igualdad de condiciones y juego limpio. Todas las disciplinas se juegan en el campus deportivo de la Universidad Nacional de Cañete.
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

    <section class="mt-12" aria-labelledby="cronograma-deportes">
      <p class="ss-kicker">Viernes 30 de octubre</p>
      <h2 id="cronograma-deportes" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Cronograma del día</h2>
      <p class="mt-4 max-w-3xl leading-7 text-slate-300">Horario referencial: la comisión puede ajustarlo y lo comunica por los canales oficiales.</p>
      <ol class="ss-timeline mt-7">
        <li v-for="bloque in cronograma" :key="bloque.titulo">
          <span class="ss-timeline-hora">{{ bloque.hora }}</span>
          <div>
            <h3 class="font-bold text-white">{{ bloque.titulo }}</h3>
            <p v-if="bloque.descripcion" class="mt-1 text-sm leading-6 text-slate-300">{{ bloque.descripcion }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="mt-12" aria-labelledby="disciplinas-deportes">
      <p class="ss-kicker">Disciplinas</p>
      <h2 id="disciplinas-deportes" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Cinco competencias</h2>
      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="disciplina in disciplinas" :key="disciplina.nombre" class="ss-card p-5 sm:p-6">
          <div class="flex items-start gap-3">
            <span class="ss-icon-box h-10 w-10">
              <Icon :name="disciplina.icono" class="h-5 w-5" />
            </span>
            <div>
              <h3 class="font-bold text-white">{{ disciplina.nombre }}</h3>
              <p class="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-slate-400">{{ disciplina.sede }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-300">{{ disciplina.descripcion }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <template #lateral>
      <section class="mt-12 rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8" aria-labelledby="info-deportes">
        <div class="flex items-start gap-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-300 ring-1 ring-primary-400/20">
            <Icon name="heroicons:information-circle" class="h-6 w-6" />
          </span>
          <div>
            <h2 id="info-deportes" class="text-xl font-bold text-white">Información oficial</h2>
            <p class="mt-2 leading-7 text-slate-300">
              Las reglas de cada disciplina, el arbitraje, los reclamos, la seguridad y la premiación están en las bases oficiales. La inscripción implica aceptarlas por completo.
            </p>
          </div>
        </div>
      </section>
      <SemanaSistemicaAfiche :actividad="actividad" />
    </template>
  </SemanaSistemicaActividadPagina>
</template>

<script setup lang="ts">
import { actividadPorSlug } from '~/data/semana-sistemica'
import { formatoHora12, rangoHorario } from '~/utils/ponencias-especializadas'

const actividad = actividadPorSlug('deportes')

const datos = [
  { icon: 'heroicons:academic-cap', label: 'Quiénes participan', value: 'Estudiantes, egresados, docentes y personal administrativo de la Facultad de Ingeniería de Sistemas, inscritos por salón o ciclo.' },
  { icon: 'heroicons:clipboard-document-check', label: 'Inscripción', value: 'Nómina oficial con DNI y código de cada participante, y designación de capitán y delegado.' },
  { icon: 'heroicons:calendar-days', label: 'Fixtures', value: 'Los calendarios de partidos se publican el 27 de octubre.' },
  { icon: 'heroicons:trophy', label: 'Premiación', value: 'Trofeo y medallas al primer puesto de futsal, vóley y básquet; trofeo en ajedrez y gincana.' },
]

const cronograma = [
  { hora: rangoHorario('08:00', '09:00'), titulo: 'Recibimiento y pasacalles', descripcion: '' },
  { hora: formatoHora12('10:00'), titulo: 'Gincana', descripcion: 'Pruebas recreativas en la explanada central.' },
  { hora: formatoHora12('12:00'), titulo: 'Refrigerio', descripcion: '' },
  { hora: formatoHora12('13:30'), titulo: 'Deportes en simultáneo', descripcion: 'Inicio de los encuentros de básquet, futsal, vóley y ajedrez.' },
  { hora: formatoHora12('19:00'), titulo: 'Culminación de los encuentros', descripcion: '' },
  { hora: formatoHora12('20:00'), titulo: 'Premiación', descripcion: 'A cargo de las autoridades universitarias.' },
]

const disciplinas = [
  { icono: 'heroicons:fire', nombre: 'Básquet', sede: 'Loza reglamentaria', descripcion: '5 en cancha (mínimo 4) y plantel de hasta 10. Dos tiempos de 10 minutos.' },
  { icono: 'heroicons:bolt', nombre: 'Futsal', sede: 'Cancha reglamentaria', descripcion: '5 en cancha (mínimo 4) y plantel de hasta 10. Dos tiempos de 10 minutos.' },
  { icono: 'heroicons:sparkles', nombre: 'Vóley', sede: 'Loza reglamentaria', descripcion: '6 en cancha (mínimo 5, con al menos 2 mujeres) y plantel de hasta 10. Al mejor de 3 sets.' },
  { icono: 'heroicons:flag', nombre: 'Gincana', sede: 'Explanada central', descripcion: 'Glotones, 3 en raya, bailetón de mascotas, carrera de enanos y quemados.' },
  { icono: 'heroicons:puzzle-piece', nombre: 'Ajedrez', sede: 'Espacio acondicionado', descripcion: 'Individual, ritmo blitz de 5 minutos. Los representantes por salón se indican en las bases.' },
]

useSeoMeta({
  title: 'Deportes y gincana | VIII CIISIC',
  description: 'Viernes 30 de octubre en el campus de la UNDC: cronograma, disciplinas, costos, bases e inscripción del torneo deportivo de la Semana Sistémica.',
  ogTitle: 'Deportes y gincana | VIII CIISIC',
  ogDescription: 'Básquet, futsal, vóley, gincana y ajedrez el viernes 30 de octubre en el campus de la UNDC.',
  ogImage: '/images/semana-sistemica/flyer-deportes.webp',
})
</script>
