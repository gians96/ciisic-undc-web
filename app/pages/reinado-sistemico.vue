<template>
  <div class="min-h-screen bg-[#041d39] text-white">
    <section class="reinado-hero relative overflow-hidden border-b border-white/10">
      <NuxtImg
        src="/images/eventos/reinado.webp"
        alt="Participantes y organizadores del Reinado Sistémico durante una edición anterior"
        width="1920"
        height="1200"
        sizes="100vw"
        class="absolute inset-0 h-full w-full object-cover object-center"
        fetchpriority="high"
      />
      <div class="hero-overlay absolute inset-0" aria-hidden="true" />

      <div class="relative mx-auto flex min-h-[610px] max-w-7xl flex-col justify-between px-6 py-10 sm:min-h-[680px] lg:px-8 lg:py-14 2xl:max-w-[1600px]">
        <NuxtLink to="/" class="back-link inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-primary-200 hover:text-white">
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          Volver al inicio
        </NuxtLink>

        <div class="max-w-4xl pb-5">
          <span class="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/25 bg-fuchsia-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-fuchsia-200 backdrop-blur">
            <Icon name="heroicons:sparkles" class="h-5 w-5" /> Actividad cultural
          </span>
          <h1 class="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">Miss &amp; Míster Sistemas 2026</h1>
          <p class="mt-5 max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">
            Liderazgo, talento, creatividad e identidad institucional en el certamen oficial de la Escuela Profesional de Ingeniería de Sistemas.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <span class="hero-chip"><Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-300" />Miércoles 28 de octubre</span>
            <span class="hero-chip"><Icon name="heroicons:clock" class="h-5 w-5 text-primary-300" />Inicio: 15:00 h</span>
            <span class="hero-chip"><Icon name="heroicons:map-pin" class="h-5 w-5 text-primary-300" />Auditorio Casa de la Cultura</span>
          </div>
        </div>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20 2xl:max-w-[1600px]">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)] lg:items-start">
        <div>
          <section aria-labelledby="about-reinado">
            <p class="kicker">Sobre la actividad</p>
            <h2 id="about-reinado" class="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">Una celebración para representar y conectar a nuestra comunidad.</h2>
            <p class="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              El certamen forma parte de las actividades de integración del VIII CIISIC 2026 y reconoce las capacidades de liderazgo, comunicación, talento, creatividad, identidad institucional y desenvolvimiento escénico de sus participantes.
            </p>

            <div class="mt-7 grid gap-4 sm:grid-cols-2">
              <article v-for="fact in officialFacts" :key="fact.label" class="fact-card flex items-start gap-4 rounded-2xl border border-white/10 p-5">
                <Icon :name="fact.icon" class="mt-0.5 h-6 w-6 shrink-0 text-primary-400" />
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">{{ fact.label }}</p>
                  <p class="mt-1 font-semibold leading-relaxed text-white">{{ fact.value }}</p>
                </div>
              </article>
            </div>
          </section>

          <section class="mt-12" aria-labelledby="participation-process">
            <p class="kicker">Cómo participar</p>
            <h2 id="participation-process" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Proceso de inscripción</h2>
            <div class="mt-7 grid gap-4 sm:grid-cols-2">
              <article v-for="step in registrationSteps" :key="step.number" class="step-card rounded-2xl border border-white/10 p-5 sm:p-6">
                <span class="step-number">{{ step.number }}</span>
                <h3 class="mt-5 text-lg font-bold text-white">{{ step.title }}</h3>
                <p class="mt-2 text-sm leading-6 text-slate-300">{{ step.description }}</p>
              </article>
            </div>
          </section>

          <section class="mt-12" aria-labelledby="competition-stages">
            <p class="kicker">Desarrollo del certamen</p>
            <h2 id="competition-stages" class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Etapas principales</h2>
            <div class="mt-7 grid gap-4 sm:grid-cols-2">
              <article v-for="stage in competitionStages" :key="stage.title" class="stage-card rounded-2xl border border-white/10 p-5 sm:p-6">
                <div class="flex items-start gap-3">
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-200 ring-1 ring-fuchsia-300/20">
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
        </div>

        <aside class="registration-card sticky top-24 overflow-hidden rounded-[2rem] border border-white/10 p-7 sm:p-9">
          <span class="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-400/10 text-fuchsia-200 ring-1 ring-fuchsia-300/25">
            <Icon name="heroicons:document-text" class="h-7 w-7" />
          </span>
          <p class="mt-7 text-xs font-bold uppercase tracking-[.2em] text-primary-300">Formulario oficial</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-white">Participa en el Reinado Sistémico</h2>
          <p class="mt-4 leading-relaxed text-slate-300">
            Completa tus datos en el formulario de Google y espera la confirmación de la comisión organizadora.
          </p>

          <dl class="mt-6 space-y-3 rounded-2xl border border-white/10 bg-[#041d39]/45 p-5 text-sm">
            <div class="flex items-start justify-between gap-4"><dt class="text-slate-400">Cierre</dt><dd class="text-right font-semibold text-white">12 de octubre de 2026</dd></div>
            <div class="flex items-start justify-between gap-4"><dt class="text-slate-400">Inscripción</dt><dd class="text-right font-semibold text-white">S/ 50 por participante</dd></div>
            <div class="flex items-start justify-between gap-4"><dt class="text-slate-400">Modalidad</dt><dd class="text-right font-semibold text-white">Registro individual</dd></div>
          </dl>

          <a
            :href="registrationFormUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="registration-button mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold"
          >
            Inscribirme ahora
            <Icon name="heroicons:arrow-top-right-on-square" class="h-5 w-5" />
            <span class="sr-only"> (se abre en una pestaña nueva)</span>
          </a>

          <a
            :href="rulesUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rules-button mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-bold"
          >
            Ver bases oficiales
            <Icon name="heroicons:document-arrow-down" class="h-5 w-5" />
            <span class="sr-only"> (se abre en una pestaña nueva)</span>
          </a>

          <div class="mt-7 border-t border-white/10 pt-6 text-sm text-slate-400">
            <p class="flex items-start gap-2"><Icon name="heroicons:shield-check" class="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />El registro se realizará únicamente mediante el enlace oficial.</p>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const registrationFormUrl = 'https://forms.gle/iS2ab99EJiPBPrEA8'
const rulesUrl = 'https://drive.google.com/file/d/1rEXAvwl2drmOpiFOk2zw-B62kw6LRaJy/view?usp=sharing'

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
  { icon: 'heroicons:calendar-days', label: 'Plazo', value: 'Inscripciones abiertas hasta el lunes 12 de octubre.' },
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

<style scoped>
.reinado-hero { background: #041d39; }
.hero-overlay { background: linear-gradient(90deg, #041d39f7 0%, #041d39d9 48%, #041d3973 100%), linear-gradient(to top, #041d39f2 0%, transparent 60%); }
.hero-chip { display: inline-flex; align-items: center; gap: .55rem; border: 1px solid #ffffff24; border-radius: 9999px; background: #041d39b8; padding: .65rem .95rem; color: #e2e8f0; font-size: .875rem; font-weight: 600; backdrop-filter: blur(10px); }
.kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
.step-card { background: linear-gradient(145deg, #0a3157d9, #062541f2); box-shadow: 0 18px 45px #020f202b; }
.fact-card, .stage-card { background: #ffffff08; }
.step-number { display: inline-flex; height: 2.25rem; min-width: 2.25rem; align-items: center; justify-content: center; border-radius: .75rem; background: #22d3ee1a; padding: 0 .65rem; color: #67e8f9; font-size: .75rem; font-weight: 800; }
.registration-card { background: radial-gradient(circle at 80% 0%, #d946ef24, transparent 38%), linear-gradient(150deg, #0a3157, #062541); box-shadow: 0 28px 80px #020f204d; }
.registration-button { background: #00d9e8; color: #032f5f; box-shadow: 0 12px 34px #00d9e82b; transition: transform .2s ease, background .2s ease; }
.registration-button:hover { background: #67e8f9; transform: translateY(-2px); }
.rules-button { border: 1px solid #67e8f94d; background: #67e8f912; color: #cffafe; transition: background .2s ease, border-color .2s ease; }
.rules-button:hover { border-color: #67e8f9; background: #67e8f91f; }
.back-link:focus-visible, .registration-button:focus-visible, .rules-button:focus-visible { outline: 2px solid #67e8f9; outline-offset: 3px; }
@media (max-width: 1023px) { .registration-card { position: static; } }
@media (prefers-reduced-motion: reduce) { .registration-button, .rules-button { transition: none; }.registration-button:hover { transform: none; } }
</style>
