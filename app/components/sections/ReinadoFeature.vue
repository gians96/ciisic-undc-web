<template>
  <section class="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24 2xl:max-w-[1600px]" aria-labelledby="reinado-landing-title">
    <div class="reinado-panel grid overflow-hidden rounded-[2rem] border border-white/10 lg:grid-cols-[1.08fr_.92fr]">
      <figure class="relative min-h-[310px] overflow-hidden sm:min-h-[400px] lg:min-h-[520px]">
        <NuxtImg
          src="/images/eventos/reinado.webp"
          alt="Participantes y organizadores del Reinado Sistémico durante una edición anterior"
          width="1920"
          height="1200"
          sizes="100vw lg:55vw"
          class="absolute inset-0 h-full w-full object-cover object-center transition duration-700 hover:scale-[1.02]"
          loading="lazy"
        />
        <div class="reinado-photo-shade absolute inset-0" aria-hidden="true" />
        <figcaption class="absolute bottom-5 left-5 rounded-full border border-white/20 bg-[#041d39]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur sm:bottom-7 sm:left-7">
          Imagen de edición anterior
        </figcaption>
      </figure>

      <div class="relative flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
        <div class="crown-mark mb-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl">
          <Icon name="heroicons:sparkles" class="h-7 w-7" />
        </div>
        <p class="kicker">Cultura · Identidad · Comunidad</p>
        <h2 id="reinado-landing-title" class="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Miss &amp; Míster Sistemas 2026
        </h2>
        <p class="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Una celebración que reúne representación, creatividad y espíritu universitario como parte de la semana del VIII CIISIC.
        </p>

        <div class="mt-7 grid gap-3 sm:grid-cols-2">
          <div class="info-chip">
            <Icon name="heroicons:calendar-days" class="h-5 w-5 text-primary-400" />
            <span>Miércoles 28 de octubre</span>
          </div>
          <div class="info-chip">
            <Icon name="heroicons:clock" class="h-5 w-5 text-primary-400" />
            <span>Inicio: 15:00 h</span>
          </div>
        </div>

        <NuxtLink to="/reinado-sistemico" class="details-link mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold">
          Ver detalles
          <Icon name="heroicons:arrow-right" class="h-5 w-5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reinado-panel { background: radial-gradient(circle at 88% 12%, #d946ef24, transparent 34%), linear-gradient(145deg, #092f57, #061f3b); box-shadow: 0 28px 90px #020f204d; }
.reinado-photo-shade { pointer-events: none; background: linear-gradient(to top, #041d39bd 0%, transparent 50%); }
.crown-mark { border: 1px solid #f0abfc40; background: #d946ef1f; color: #f0abfc; box-shadow: 0 12px 35px #d946ef1a; }
.kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
.info-chip { display: flex; min-height: 3.25rem; align-items: center; gap: .65rem; border: 1px solid #ffffff1a; border-radius: .9rem; background: #ffffff08; padding: .8rem 1rem; color: #e2e8f0; font-size: .9rem; font-weight: 600; }
.details-link { background: #00d9e8; color: #032f5f; box-shadow: 0 12px 34px #00d9e82b; transition: transform .2s ease, background .2s ease; }
.details-link:hover { background: #67e8f9; transform: translateY(-2px); }
.details-link:focus-visible { outline: 2px solid #67e8f9; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) { .reinado-panel img, .details-link { transition: none; }.reinado-panel img:hover, .details-link:hover { transform: none; } }
</style>
