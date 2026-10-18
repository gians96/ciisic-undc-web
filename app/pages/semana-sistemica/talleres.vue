<!-- ⚠️ CONTENIDO PENDIENTE: textos, cronograma, datos de inscripción e imágenes son provisionales;
     la comisión de Talleres debe confirmarlos antes de publicar. -->
<template>
  <SemanaSistemicaActividadPagina
    :actividad="actividad"
    kicker="Formación práctica"
    titulo="Talleres sistémicos"
    descripcion="Sesiones prácticas para aplicar lo aprendido durante el VIII CIISIC, con cupos limitados por taller."
  >
    <section aria-labelledby="about-talleres">
      <p class="ss-kicker">Sobre la actividad</p>
      <h2 id="about-talleres" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Aprende haciendo, en grupos pequeños.</h2>
      <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        Los talleres reúnen a estudiantes en sesiones prácticas guiadas para trabajar con herramientas, lenguajes y metodologías del campo de los sistemas. Cada taller tiene cupos limitados y su propio facilitador.
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

    <section class="mt-12" aria-labelledby="cronograma-talleres">
      <p class="ss-kicker">Programación</p>
      <h2 id="cronograma-talleres" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Cronograma del taller</h2>
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

    <template #ancho>
      <SemanaSistemicaGaleria id="talleres" :imagenes="actividad.galeria" />
    </template>

    <template #lateral>
      <section class="mt-12 rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8" aria-labelledby="info-talleres">
        <div class="flex items-start gap-4">
          <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-300 ring-1 ring-primary-400/20">
            <Icon name="heroicons:information-circle" class="h-6 w-6" />
          </span>
          <div>
            <h2 id="info-talleres" class="text-xl font-bold text-white">Información oficial</h2>
            <p class="mt-2 leading-7 text-slate-300">
              Los temas, los facilitadores, los ambientes y las condiciones de participación se publican en las bases oficiales. Inscribirse implica aceptarlas.
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

const actividad = actividadPorSlug('talleres')

const datos = [
  { icon: 'heroicons:academic-cap', label: 'Quiénes participan', value: 'Estudiantes de la Facultad de Ingeniería de Sistemas y público externo, con inscripción previa.' },
  { icon: 'heroicons:clipboard-document-check', label: 'Inscripción', value: 'Formulario de la comisión, con cupos limitados por taller.' },
  { icon: 'heroicons:computer-desktop', label: 'Formato', value: 'Sesiones prácticas en grupos reducidos, con material y guía del facilitador.' },
  { icon: 'heroicons:document-check', label: 'Certificado', value: 'Por confirmar por la comisión organizadora.' },
]

const cronograma = [
  { hora: formatoHora12('18:00'), titulo: 'Apertura y bienvenida', descripcion: 'Registro de asistencia y presentación de la comisión organizadora.' },
  { hora: formatoHora12('18:15'), titulo: 'Taller (bloque 1)', descripcion: 'Primera sesión práctica. Tema y facilitador por confirmar.' },
  { hora: rangoHorario('19:00', '20:00'), titulo: 'Taller (bloque 2) y cierre', descripcion: 'Segunda sesión práctica y evaluación final del taller.' },
]

useSeoMeta({
  title: 'Talleres sistémicos | VIII CIISIC',
  description: 'Jueves 29 de octubre en el campus de la UNDC: programación, requisitos e inscripción de los Talleres sistémicos de la Semana Sistémica.',
  ogTitle: 'Talleres sistémicos | VIII CIISIC',
  ogDescription: 'Sesiones prácticas con cupos limitados el jueves 29 de octubre en el campus de la UNDC.',
  ogImage: '/images/semana-sistemica/flyer-talleres.webp',
})
</script>
