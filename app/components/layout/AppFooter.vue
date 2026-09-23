<template>
  <footer class="footer border-t border-white/10 text-white">
    <div class="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16 2xl:max-w-[1600px]">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-12">
        <div>
          <NuxtLink to="/" class="inline-flex items-center gap-3"><img src="/images/logo/preloader.png" alt="" class="h-11 w-11 object-contain" /><span class="text-xl font-bold">VIII CIISIC <span class="text-primary-300">2026</span></span></NuxtLink>
          <p class="mt-5 max-w-sm leading-relaxed text-slate-300">Ingeniería de sistemas e investigación científica para conectar ideas, personas y posibilidades.</p>
          <p class="mt-5 inline-flex items-start gap-2 text-sm text-slate-300"><Icon name="heroicons:calendar-days" class="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />26 al 30 de octubre · San Vicente de Cañete</p>
        </div>
        <div><h2 class="footer-heading">Explora</h2><nav class="mt-5 flex flex-col gap-3" aria-label="Explora"><NuxtLink to="/about">El congreso</NuxtLink><NuxtLink to="/cronograma">Cronograma</NuxtLink><NuxtLink to="/ponentes">Ponentes</NuxtLink><NuxtLink to="/sede">Sede</NuxtLink></nav></div>
        <div><h2 class="footer-heading">Participa</h2><nav class="mt-5 flex flex-col gap-3" aria-label="Participa"><NuxtLink to="/planes">Inscripciones</NuxtLink><NuxtLink to="/papers">Call for papers</NuxtLink><NuxtLink to="/preguntas">Preguntas frecuentes</NuxtLink><NuxtLink to="/contacto">Contacto</NuxtLink></nav></div>
        <div><h2 class="footer-heading">Contacto</h2><div class="mt-5 flex flex-col gap-3"><a href="mailto:congreso@undc.edu.pe">congreso@undc.edu.pe</a><a href="https://wa.me/51933030027" target="_blank" rel="noopener noreferrer">+51 933030027</a><div class="mt-2 flex gap-3"><a href="https://facebook.com/fiundc" target="_blank" rel="noopener noreferrer" aria-label="Facebook de la Facultad de Ingeniería" class="social"><Icon name="simple-icons:facebook" class="h-5 w-5" /></a><a href="https://tiktok.com/@fiundc" target="_blank" rel="noopener noreferrer" aria-label="TikTok de la Facultad de Ingeniería" class="social"><Icon name="simple-icons:tiktok" class="h-5 w-5" /></a></div></div></div>
      </div>
      <div class="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:justify-between"><span>© 2026 Facultad de Ingeniería · Universidad Nacional de Cañete</span><NuxtLink to="/privacidad">Política de privacidad</NuxtLink></div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: #032648; }
.footer-heading { color: #fff; font-size: .8rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
a { color: #cbd5e1; transition: color .2s, border-color .2s; }
a:hover { color: #67e8f9; }
.social { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; border: 1px solid #ffffff30; border-radius: .75rem; }
.social:hover { border-color: #67e8f9; }
</style>
