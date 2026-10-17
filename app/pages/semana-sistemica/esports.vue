<template>
  <SemanaSistemicaActividadPagina
    :actividad="actividad"
    kicker="Eventos académicos"
    titulo="eSports"
    descripcion="Competencias de videojuegos que promueven la integración, la sana competencia y las habilidades estratégicas de los estudiantes de Ingeniería de Sistemas, mediante torneos presenciales en distintas modalidades."
  >
    <section aria-labelledby="about-esports">
      <p class="ss-kicker">Sobre el torneo</p>
      <h2 id="about-esports" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Cuatro videojuegos, una misma arena.</h2>
      <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        El Torneo de Esports EPIS 2026 se juega el martes 27 de octubre en las instalaciones de la Facultad de Ingeniería de Sistemas. Cada videojuego tiene sus propias bases: formato competitivo, criterios de avance, puntualidad, sanciones, requisitos técnicos y premiación.
      </p>
    </section>

    <section class="mt-12" aria-labelledby="juegos-esports">
      <p class="ss-kicker">Videojuegos y modalidades</p>
      <h2 id="juegos-esports" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Elige tu torneo</h2>
      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="juego in juegos" :key="juego.nombre" class="ss-card p-5 sm:p-6">
          <div class="flex items-start gap-3">
            <span class="ss-icon-box h-10 w-10">
              <Icon :name="juego.icono" class="h-5 w-5" />
            </span>
            <div>
              <h3 class="font-bold text-white">{{ juego.nombre }}</h3>
              <p class="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-slate-400">{{ juego.modalidad }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-300">{{ juego.descripcion }}</p>
              <dl class="mt-3 space-y-1 text-sm">
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-400">Costo</dt>
                  <dd class="text-right font-semibold text-white">{{ juego.costo }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-400">Cierre</dt>
                  <dd class="text-right font-semibold text-white">{{ juego.cierre }}</dd>
                </div>
                <div class="flex justify-between gap-3">
                  <dt class="text-slate-400">Premio</dt>
                  <dd class="text-right font-semibold text-white">{{ juego.premio }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12 rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8" aria-labelledby="info-esports">
      <div class="flex items-start gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-300 ring-1 ring-primary-400/20">
          <Icon name="heroicons:information-circle" class="h-6 w-6" />
        </span>
        <div>
          <h2 id="info-esports" class="text-xl font-bold text-white">Información oficial</h2>
          <p class="mt-2 leading-7 text-slate-300">
            Los participantes recibirán avisos sobre horarios, resultados y organización por los canales indicados por la comisión. La participación implica aceptar las reglas correspondientes a cada torneo.
          </p>
        </div>
      </div>
    </section>

    <SemanaSistemicaAfiche :actividad="actividad" />
  </SemanaSistemicaActividadPagina>
</template>

<script setup lang="ts">
import { actividadPorSlug } from '~/data/semana-sistemica'

const actividad = actividadPorSlug('esports')

const juegos = [
  {
    icono: 'heroicons:user-group',
    nombre: 'Left 4 Dead 2',
    modalidad: 'Equipos de 4 + 2 suplentes',
    descripcion: 'Estudiantes regulares y egresados de la EPIS UNDC. Partidas por campañas, con posibles rondas reducidas según los equipos inscritos.',
    costo: 'S/ 30 por equipo',
    cierre: '23 de octubre, 11:59 p. m.',
    premio: 'Premio monetario al primer puesto (monto según inscritos)',
  },
  {
    icono: 'heroicons:bolt',
    nombre: 'Clash Royale',
    modalidad: 'Individual · doble eliminación',
    descripcion: 'Llaves de ganadores y perdedores, con gran final al mejor de tres partidas.',
    costo: 'S/ 6',
    cierre: '23 de octubre, 11:59 p. m.',
    premio: 'Premio monetario al primer puesto',
  },
  {
    icono: 'heroicons:trophy',
    nombre: 'FIFA 25',
    modalidad: 'Individual 1 contra 1',
    descripcion: 'Estudiantes matriculados en el año vigente. Eliminación directa con hasta 16 participantes.',
    costo: 'S/ 6',
    cierre: '23 de octubre, 11:59 p. m.',
    premio: '1.er puesto: S/ 50 · 2.º puesto: S/ 30',
  },
  {
    icono: 'heroicons:fire',
    nombre: 'Dragon Ball: Sparking! ZERO',
    modalidad: 'Equipos 3 vs. 3 y 5 vs. 5',
    descripcion: 'Estudiantes matriculados en el año vigente. 3 contra 3 en octavos y cuartos; 5 contra 5 en semifinales y final. Máximo una fusión por equipo.',
    costo: 'S/ 6',
    cierre: '22 de octubre, 11:59 p. m.',
    premio: '1.er puesto: S/ 50 · 2.º puesto: S/ 30',
  },
]

useSeoMeta({
  title: 'eSports | VIII CIISIC',
  description: 'Martes 27 de octubre, de 3:00 p. m. a 8:00 p. m.: Left 4 Dead 2, Clash Royale, FIFA 25 y Dragon Ball en el Torneo de Esports EPIS 2026.',
  ogTitle: 'eSports | VIII CIISIC',
  ogDescription: 'Torneo de Esports EPIS 2026: cuatro videojuegos, una misma arena.',
  ogImage: '/images/eventos/esports.webp',
})
</script>
