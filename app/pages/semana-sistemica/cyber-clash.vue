<template>
  <SemanaSistemicaActividadPagina
    :actividad="actividad"
    kicker="Ciberseguridad y defensa digital"
    titulo="Cyber Clash"
    descripcion="Protege el presente, construye el futuro. Una jornada intensiva sobre ransomware, phishing, análisis de ciberataques y buenas prácticas junto a Kriptome Cybersecurity y la EPIS UNDC."
    posicion="object-center"
  >
    <section aria-labelledby="about-cyber-clash">
      <p class="ss-kicker">Sobre la actividad</p>
      <h2 id="about-cyber-clash" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Protege el presente, construye el futuro en la era de la ciberdefensa.</h2>
      <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        Organizado por <strong>Kriptome Cybersecurity</strong> y la <strong>Escuela Profesional de Ingeniería de Sistemas de la Universidad Nacional de Cañete (UNDC)</strong> en el marco de la Semana Sistémica y el VIII CIISIC. El evento reúne a ponentes especialistas para abordar los vectores de ataque más críticos del entorno tecnológico actual.
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

    <section class="mt-12" aria-labelledby="ponentes-cyber-clash">
      <p class="ss-kicker">Especialistas invitados</p>
      <h2 id="ponentes-cyber-clash" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Ponentes</h2>
      <p class="mt-4 max-w-3xl leading-7 text-slate-300">
        Profesionales con amplia experiencia en seguridad informática, respuesta a incidentes y ciberdefensa.
      </p>
      <div class="mt-7 grid gap-4 sm:grid-cols-3">
        <article v-for="ponente in ponentes" :key="ponente.nombre" class="ss-card p-5 sm:p-6">
          <div class="flex items-start gap-3">
            <span class="ss-icon-box h-10 w-10">
              <Icon name="heroicons:user-circle" class="h-6 w-6" />
            </span>
            <div>
              <h3 class="font-bold text-white">{{ ponente.nombre }}</h3>
              <p class="mt-1 text-xs font-semibold uppercase tracking-[.12em] text-slate-400">{{ ponente.cargo }}</p>
              <p class="mt-2 text-sm leading-6 text-slate-300">{{ ponente.descripcion }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12" aria-labelledby="temas-cyber-clash">
      <p class="ss-kicker">Ejes temáticos</p>
      <h2 id="temas-cyber-clash" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Temas a tratar</h2>
      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <article v-for="tema in temas" :key="tema.nombre" class="ss-card p-5 sm:p-6">
          <div class="flex items-start gap-3">
            <span class="ss-icon-box h-10 w-10">
              <Icon :name="tema.icono" class="h-5 w-5" />
            </span>
            <div>
              <h3 class="font-bold text-white">{{ tema.nombre }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-300">{{ tema.descripcion }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-12" aria-labelledby="cronograma-cyber-clash">
      <p class="ss-kicker">Jueves 29 de octubre</p>
      <h2 id="cronograma-cyber-clash" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Cronograma del evento</h2>
      <p class="mt-4 max-w-3xl leading-7 text-slate-300">Horario oficial en el Auditorio de la Casa de la Cultura.</p>
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

    <section class="mt-12 rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8" aria-labelledby="info-cyber-clash">
      <div class="flex items-start gap-4">
        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-400/10 text-primary-300 ring-1 ring-primary-400/20">
          <Icon name="heroicons:information-circle" class="h-6 w-6" />
        </span>
        <div>
          <h2 id="info-cyber-clash" class="text-xl font-bold text-white">Información importante</h2>
          <p class="mt-2 leading-7 text-slate-300">
            El registro se efectúa completando el formulario oficial y adjuntando el comprobante de pago de S/ 4.00. Para el ingreso al auditorio y la emisión del certificado de asistente, es indispensable presentar su DNI.
          </p>
        </div>
      </div>
    </section>

    <SemanaSistemicaAfiche :actividad="actividad" />
  </SemanaSistemicaActividadPagina>
</template>

<script setup lang="ts">
import { actividadPorSlug } from '~/data/semana-sistemica'
import { formatoHora12 } from '~/utils/ponencias-especializadas'

const actividad = actividadPorSlug('cyber-clash')

const datos = [
  { icon: 'heroicons:academic-cap', label: 'Dirigido a', value: 'Estudiantes de la Escuela Profesional de Ingeniería de Sistemas (EPIS) y público en general.' },
  { icon: 'heroicons:currency-dollar', label: 'Precio de inscripción', value: 'S/ 4.00 por participante, con acceso a todas las ponencias del evento.' },
  { icon: 'heroicons:document-check', label: 'Certificación', value: 'Se otorgará certificado de asistente oficial con valor curricular.' },
  { icon: 'heroicons:building-library', label: 'Lugar del evento', value: 'Auditorio de la Casa de la Cultura, San Vicente de Cañete.' },
]

const ponentes = [
  {
    nombre: 'Enrique Arnáez Braschi',
    cargo: 'Contralmte. Mg.',
    descripcion: 'Especialista en ciberseguridad, bots, agentes de inteligencia artificial y protección contra amenazas complejas.',
  },
  {
    nombre: 'Aaron Moises Palacios Quispe',
    cargo: 'Especialista en ciberseguridad',
    descripcion: 'Experto en análisis de ciberataques, detección y mitigación de intrusiones en infraestructuras digitales.',
  },
  {
    nombre: 'Carlos Eloy Medina Berrospi',
    cargo: 'Consultor de ciberdefensa',
    descripcion: 'Profesional en prevención de ingeniería social, mitigación de phishing y cultura de buenas prácticas de seguridad.',
  },
]

const temas = [
  {
    icono: 'heroicons:envelope-open',
    nombre: 'Phishing',
    descripcion: 'Técnicas modernas de ingeniería social, análisis de vectores de engaño digital y estrategias preventivas en organizaciones.',
  },
  {
    icono: 'heroicons:lock-closed',
    nombre: 'Ransomware',
    descripcion: 'Evolución de familias de ransomware, secuestro y cifrado de datos, y protocolos efectivos de mitigación y contingencia.',
  },
  {
    icono: 'heroicons:magnifying-glass',
    nombre: 'Análisis de ciberataque',
    descripcion: 'Metodología de triaje, identificación de indicadores de compromiso (IoC) y análisis forense paso a paso ante incidentes.',
  },
  {
    icono: 'heroicons:shield-check',
    nombre: 'Buenas prácticas',
    descripcion: 'Higiene digital, autenticación multifactor (MFA), gestión de accesos y construcción de una cultura sólida de ciberseguridad.',
  },
]

const cronograma = [
  { hora: formatoHora12('15:00'), titulo: 'Apertura y bienvenida', descripcion: 'Recepción, acreditación de asistentes y palabras de bienvenida.' },
  { hora: formatoHora12('15:20'), titulo: 'Phishing e ingeniería social', descripcion: 'Vectores de ataque, suplantación y concientización preventiva.' },
  { hora: formatoHora12('16:00'), titulo: 'Ransomware y ciberamenazas emergentes', descripcion: 'Mecanismos de infección, análisis de casos y estrategias de contención.' },
  { hora: formatoHora12('16:50'), titulo: 'Análisis de ciberataque en vivo', descripcion: 'Demostración de detección de intrusiones y respuesta forense.' },
  { hora: formatoHora12('17:35'), titulo: 'Buenas prácticas y clausura', descripcion: 'Resumen de recomendaciones clave, ronda de preguntas y pautas de certificación.' },
]

useSeoMeta({
  title: 'Cyber Clash — Kriptome Cybersecurity | VIII CIISIC',
  description: 'Jueves 29 de octubre a las 3:00 p. m. en la Casa de la Cultura: ciberseguridad, ransomware, phishing, ponentes y registro oficial en Cyber Clash.',
  ogTitle: 'Cyber Clash — Kriptome Cybersecurity | VIII CIISIC',
  ogDescription: 'Aprende sobre ransomware, phishing y ciberataques con Kriptome Cybersecurity el jueves 29 de octubre en la Casa de la Cultura.',
  ogImage: '/images/semana-sistemica/flyer-cyber-clash.webp',
})
</script>
