<template>
  <SemanaSistemicaActividadPagina
    :actividad="actividad"
    kicker="Cultura y comunidad"
    titulo="Comparsa Sistémica"
    descripcion="Delegaciones por salón o ciclo recorren San Vicente de Cañete con carros alegóricos, banderolas y mascotas bajo el tema de la inteligencia artificial."
  >
    <section aria-labelledby="about-comparsa">
      <p class="ss-kicker">Sobre la actividad</p>
      <h2 id="about-comparsa" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">El congreso también se vive en las calles.</h2>
      <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        La comparsa impulsa la difusión de la cultura local y la participación de la comunidad universitaria con el tema «La revolución de la inteligencia artificial: transformando el mundo». Cada delegación representa una aplicación, plataforma o infraestructura de IA y elige libremente su subtemática.
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

    <section class="mt-12" aria-labelledby="recorrido-comparsa">
      <p class="ss-kicker">Recorrido oficial</p>
      <h2 id="recorrido-comparsa" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Cuatro puntos de evaluación</h2>
      <p class="mt-4 max-w-3xl leading-7 text-slate-300">
        El recorrido es ordenado y respetuoso. Las delegaciones salen por ciclos, en orden ascendente, y las horas después de la concentración son aproximadas.
      </p>
      <ol class="ss-timeline mt-7">
        <li v-for="punto in recorrido" :key="punto.titulo">
          <span class="ss-timeline-hora">{{ punto.hora }}<small class="block text-xs font-normal text-slate-400">{{ punto.nota }}</small></span>
          <div>
            <h3 class="font-bold text-white">{{ punto.titulo }}</h3>
            <p class="mt-1 text-sm leading-6 text-slate-300">{{ punto.descripcion }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="mt-12" aria-labelledby="requisitos-comparsa">
      <p class="ss-kicker">Requisitos obligatorios</p>
      <h2 id="requisitos-comparsa" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Qué debe llevar cada delegación</h2>
      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="requisito in requisitos" :key="requisito.titulo" class="ss-card p-5 sm:p-6">
          <div class="flex items-start gap-3">
            <span class="ss-icon-box h-10 w-10">
              <Icon :name="requisito.icono" class="h-5 w-5" />
            </span>
            <div>
              <h3 class="font-bold text-white">{{ requisito.titulo }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-300">{{ requisito.descripcion }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12 rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8" aria-labelledby="info-comparsa">
      <div class="flex items-start gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-300 ring-1 ring-primary-400/20">
          <Icon name="heroicons:information-circle" class="h-6 w-6" />
        </span>
        <div>
          <h2 id="info-comparsa" class="text-xl font-bold text-white">Información oficial</h2>
          <p class="mt-2 leading-7 text-slate-300">
            Los criterios de evaluación, el jurado, las sanciones y las subtemáticas sugeridas por ciclo están en las bases oficiales. La participación implica aceptarlas.
          </p>
        </div>
      </div>
    </section>

    <SemanaSistemicaGaleria id="comparsa" :imagenes="actividad.galeria" />
    <SemanaSistemicaAfiche :actividad="actividad" />
  </SemanaSistemicaActividadPagina>
</template>

<script setup lang="ts">
import { actividadPorSlug } from '~/data/semana-sistemica'

const actividad = actividadPorSlug('comparsa')

const datos = [
  { icon: 'heroicons:academic-cap', label: 'Quiénes participan', value: 'Estudiantes de Ingeniería de Sistemas matriculados, en delegaciones por salón o por ciclo.' },
  { icon: 'heroicons:banknotes', label: 'Cuota única', value: 'S/ 30 por salón (turno mañana o tarde) o S/ 50 por ciclo (mañana y tarde juntos).' },
  { icon: 'heroicons:star', label: 'Evaluación', value: 'Ocho criterios y 400 puntos como máximo, calificados en cuatro puntos del recorrido.' },
  { icon: 'heroicons:trophy', label: 'Premios', value: '1.º puesto: S/ 150, trofeo y reconocimiento. 2.º puesto: S/ 100 y reconocimiento.' },
]

const recorrido = [
  { hora: '2:30 p. m.', nota: 'Concentración', titulo: 'Casa de la Cultura', descripcion: 'Presentación inicial de las delegaciones, puntualidad y organización del orden de salida. Se espera a las delegaciones desde las 2:30 hasta las 3:00 p. m.' },
  { hora: '3:15 p. m.', nota: 'aprox.', titulo: 'Mega Plaza', descripcion: 'Representación de la temática de inteligencia artificial, banderola con su frase, carro alegórico y participación de la delegación.' },
  { hora: '3:50 p. m.', nota: 'aprox.', titulo: 'Óvalo principal de San Vicente', descripcion: 'Continuidad de la presentación, armonía rítmica y coordinación de la delegación.' },
  { hora: '4:10 p. m.', nota: 'aprox.', titulo: 'Plaza de Armas de San Vicente', descripcion: 'Presentación de cierre con bailes y arengas, evaluación final y espacio para fotografías grupales.' },
]

const requisitos = [
  { icono: 'heroicons:user-group', titulo: 'Uniforme', descripcion: 'Camisetas, polos o prendas distintivas del ciclo y del turno.' },
  { icono: 'heroicons:truck', titulo: 'Carro alegórico', descripcion: 'Vehículo o estructura móvil decorada según la temática tecnológica elegida.' },
  { icono: 'heroicons:flag', titulo: 'Banderola', descripcion: 'Visible y legible, con el ciclo, el turno, el nombre de la propuesta y una frase representativa.' },
  { icono: 'heroicons:sparkles', titulo: 'Miss y Míster Sistemas', descripcion: 'Una pareja por delegación: la Miss, con traje de gala o sport elegante; el Míster, con terno, smoking o traje formal.' },
  { icono: 'heroicons:face-smile', titulo: 'Mascota o personaje', descripcion: 'Vinculado con la subtemática, representa al salón o ciclo y acompaña a la delegación durante todo el recorrido.' },
]

useSeoMeta({
  title: 'Comparsa Sistémica | VIII CIISIC',
  description: 'Lunes 26 de octubre: recorrido, requisitos, cuotas, bases e inscripción de la Comparsa Sistémica de la Universidad Nacional de Cañete.',
  ogTitle: 'Comparsa Sistémica | VIII CIISIC',
  ogDescription: 'Delegaciones, carros alegóricos y mascotas recorren San Vicente de Cañete el lunes 26 de octubre.',
  ogImage: '/images/semana-sistemica/comparsa-01.webp',
})
</script>
