<template>
  <div class="segmented-toggle" role="tablist" :aria-label="label">
    <button
      v-for="(option, index) in options"
      :id="`${idPrefix}-${option.value}`"
      :key="option.value"
      :ref="(el) => setBoton(el, index)"
      type="button"
      role="tab"
      class="segmented-btn"
      :class="{ active: option.value === model }"
      :aria-selected="option.value === model"
      :aria-controls="option.controls"
      :tabindex="option.value === model ? 0 : -1"
      @click="model = option.value"
      @keydown="onKeydown($event, index)"
    >
      <Icon v-if="option.icon" :name="option.icon" class="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface SegmentedToggleOption {
  value: string
  label: string
  /** Nombre del icono (p. ej. `heroicons:clock`). */
  icon?: string
  /** Id del panel que controla la pestaña (`aria-controls`). */
  controls?: string
}

const props = withDefaults(defineProps<{
  options: SegmentedToggleOption[]
  /** Nombre accesible del grupo de pestañas. */
  label: string
  idPrefix?: string
}>(), { idPrefix: 'toggle' })

const model = defineModel<string>({ required: true })

const botones: (HTMLButtonElement | null)[] = []
const setBoton = (el: unknown, index: number) => {
  botones[index] = el instanceof HTMLButtonElement ? el : null
}

// Teclado de pestañas: flechas, Inicio y Fin mueven la selección y el foco.
const onKeydown = (event: KeyboardEvent, index: number) => {
  const ultimo = props.options.length - 1
  const destino: Record<string, number> = {
    ArrowRight: index === ultimo ? 0 : index + 1,
    ArrowLeft: index === 0 ? ultimo : index - 1,
    Home: 0,
    End: ultimo,
  }
  const siguiente = destino[event.key]
  if (siguiente === undefined) return
  event.preventDefault()
  const opcion = props.options[siguiente]
  if (!opcion) return
  model.value = opcion.value
  botones[siguiente]?.focus()
}
</script>

<style scoped>
.segmented-toggle { display: inline-flex; max-width: 100%; border: 1px solid #ffffff1a; border-radius: .75rem; background: #ffffff08; padding: .25rem; }
.segmented-btn { display: flex; flex: 1 1 auto; align-items: center; justify-content: center; gap: .5rem; border-radius: .55rem; padding: .7rem 1rem; color: #94a3b8; font-size: .875rem; font-weight: 600; transition: all .25s ease; }
.segmented-btn:hover { color: #e2e8f0; }
.segmented-btn.active { background: #00d9e826; color: #67e8f9; }
.segmented-btn:focus-visible { outline: 2px solid #00d9e8; outline-offset: 2px; }
@media (max-width: 479px) { .segmented-toggle { display: flex; width: 100%; } .segmented-btn { padding: .7rem .6rem; font-size: .8rem; gap: .4rem; } }
@media (prefers-reduced-motion: reduce) { .segmented-btn { transition: none; } }
</style>
