<!-- Índice de la credencial (spec 013): sin demostración. El enlace real llega por correo con el código de cada
     persona (/credencial/<codigo>); aquí solo se puede escribir ese código si el enlace se perdió. -->
<template>
  <div class="mx-auto max-w-xl px-6 py-16 text-center">
    <p class="kicker">Credencial</p>
    <h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
      Tu credencial <span class="text-primary-300">3D</span>
    </h1>
    <p class="mt-4 text-slate-300">
      La recibes por correo cuando tu inscripción es aprobada: el mensaje trae un botón con tu enlace personal.
      Si lo perdiste, escribe aquí el código de registro que aparece en tu credencial.
    </p>

    <form class="mt-8 flex flex-col gap-3 sm:flex-row" novalidate @submit.prevent="abrir">
      <label for="codigo" class="sr-only">Código de registro</label>
      <input
        id="codigo"
        v-model="codigo"
        class="campo"
        placeholder="Código de 10 caracteres"
        maxlength="10"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? 'codigo-error' : undefined"
      >
      <button type="submit" class="boton">Ver mi credencial</button>
    </form>
    <p v-if="error" id="codigo-error" class="mt-3 text-sm text-red-300" role="alert">{{ error }}</p>

    <p class="mt-10 text-sm leading-relaxed text-slate-400">
      Si tu inscripción ya fue aprobada y no encuentras el correo, revisa la carpeta de spam o escribe a la
      organización con tu documento.
    </p>
    <NuxtLink to="/" class="mt-6 inline-block text-sm font-semibold text-primary-300 hover:text-white">Ir al sitio del congreso</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { esCodigoCredencial } from '~/utils/credencial'

definePageMeta({ layout: 'credencial' })

useSeoMeta({
  title: 'Credencial | VIII CIISIC 2026',
  description: 'Abre tu credencial digital del VIII CIISIC 2026 con tu código de registro.',
  robots: 'noindex, nofollow',
})

const codigo = ref('')
const error = ref('')

function abrir() {
  const limpio = codigo.value.trim().toUpperCase()
  if (!esCodigoCredencial(limpio)) {
    error.value = 'El código tiene 10 caracteres: letras mayúsculas y números.'
    return
  }
  error.value = ''
  void navigateTo(`/credencial/${limpio}`)
}
</script>

<style scoped>
.kicker {
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.campo {
  flex: 1;
  min-width: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1.25rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
  text-align: center;
}

.campo::placeholder {
  font-family: inherit;
  letter-spacing: normal;
  text-transform: none;
  color: rgba(214, 231, 250, 0.4);
}

.campo:focus-visible {
  outline: 2px solid #00d9e8;
  outline-offset: 2px;
}

.boton {
  border-radius: 999px;
  background: #00d9e8;
  padding: 0.75rem 1.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #041d39;
}

.boton:hover {
  background: #67e8f9;
}
</style>
