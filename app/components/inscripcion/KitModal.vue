<template>
  <div class="kit-modal-trigger">
    <!-- type="button": vive dentro de un <form> y no debe enviarlo -->
    <button ref="trigger" type="button" class="kit-trigger" aria-haspopup="dialog" @click="abrir">
      <Icon name="heroicons:gift" class="h-4 w-4" />Ver qué incluye el kit
    </button>

    <Teleport to="body">
      <Transition name="kit-fade">
        <div v-if="abierto" class="kit-overlay" @click="cerrar">
          <div class="kit-dialog" role="dialog" aria-modal="true" aria-labelledby="kit-modal-titulo" @click.stop @keydown.escape.stop="cerrar" @keydown.tab.prevent>
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <p class="kit-kicker">Kit oficial · VIII CIISIC 2026</p>
                <h2 id="kit-modal-titulo" class="mt-1 text-2xl font-bold text-white">Qué incluye tu kit</h2>
              </div>
              <button ref="cerrarBtn" type="button" class="kit-close" aria-label="Cerrar" @click="cerrar"><Icon name="heroicons:x-mark" class="h-5 w-5" /></button>
            </div>
            <InscripcionKitImagen :lazy="false" />
            <ul class="mt-5 grid gap-3 sm:grid-cols-2">
              <li v-for="item in KIT_ITEMS" :key="item.titulo" class="flex items-center gap-3 text-sm text-slate-200">
                <span class="kit-icon inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"><Icon :name="item.icon" class="h-5 w-5" /></span>
                <span class="font-semibold">{{ item.titulo }}</span>
              </li>
            </ul>
            <p class="mt-4 text-sm leading-relaxed text-slate-400">{{ KIT_NOTA }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { KIT_ITEMS, KIT_NOTA } from '~/data/kit-items'

const abierto = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const cerrarBtn = ref<HTMLButtonElement | null>(null)

async function abrir() {
  abierto.value = true
  await nextTick()
  cerrarBtn.value?.focus()
}

function cerrar() {
  abierto.value = false
  trigger.value?.focus()
}

// Bloquea el scroll de la página mientras el diálogo está abierto
watch(abierto, (valor) => {
  if (import.meta.client) document.body.style.overflow = valor ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<style scoped>
.kit-trigger { display: inline-flex; align-items: center; gap: .4rem; margin: .1rem 0 .6rem; padding: .2rem 0; background: none; border: 0; color: #67e8f9; font-size: .875rem; font-weight: 600; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
.kit-trigger:hover { color: #a5f3fc; }
.kit-trigger:focus-visible, .kit-close:focus-visible { outline: 2px solid #67e8f9; outline-offset: 3px; border-radius: .375rem; }
.kit-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; background: #000c; backdrop-filter: blur(4px); }
.kit-dialog { width: 100%; max-width: 44rem; max-height: calc(100dvh - 2rem); overflow-y: auto; padding: 1.25rem; background: #082c52; border: 1px solid #ffffff1c; border-radius: 1.25rem; box-shadow: 0 28px 90px #020f204d; outline: none; }
@media (min-width: 640px) { .kit-dialog { padding: 1.75rem; } }
.kit-kicker { color: #67e8f9; font-size: .75rem; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; }
.kit-close { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; flex-shrink: 0; border-radius: .5rem; background: #ffffff14; color: #fff; cursor: pointer; }
.kit-close:hover { background: #ffffff26; }
.kit-icon { background: #00d9e81a; color: #67e8f9; }
.kit-fade-enter-active, .kit-fade-leave-active { transition: opacity .2s ease; }
.kit-fade-enter-from, .kit-fade-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .kit-fade-enter-active, .kit-fade-leave-active { transition: none; } }
</style>
