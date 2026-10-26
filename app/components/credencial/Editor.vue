<!-- Editor de las tecnologías de la credencial 3D (spec 013): hoja inferior en el celular y cuadro centrado en
     pantallas grandes. No guarda por sí mismo: avisa cada cambio y la página guarda sola. -->
<template>
  <Teleport to="body">
    <div
      v-if="abierto"
      class="editor"
      @keydown.esc.stop="emit('cerrar')"
    >
      <button
        type="button"
        class="editor__fondo"
        tabindex="-1"
        aria-label="Cerrar el editor"
        @click="emit('cerrar')"
      />

      <div
        ref="panel"
        class="editor__panel"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${id}-titulo`"
        tabindex="-1"
      >
        <header class="editor__cabecera">
          <div>
            <h2 :id="`${id}-titulo`" class="editor__titulo">Tus tecnologías</h2>
            <p class="editor__subtitulo">
              <span class="tabular-nums">{{ seleccion.length }} / {{ MAXIMO_TECNOLOGIAS }}</span>
              · la primera da el color a tu credencial
            </p>
          </div>
          <button
            type="button"
            class="editor__cerrar"
            aria-label="Cerrar"
            @click="emit('cerrar')"
          >
            <Icon name="heroicons:x-mark" class="h-5 w-5" />
          </button>
        </header>

        <div class="editor__cuerpo">
          <ul v-if="elegidas.length" class="editor__elegidas" aria-label="Tecnologías elegidas">
            <li v-for="(tech, i) in elegidas" :key="tech.id" class="elegida">
              <button
                type="button"
                class="elegida__cuerpo"
                :style="{ background: tech.color, color: textoSobreColor(tech.color) }"
                :title="i === 0 ? 'Color principal' : 'Usar como color principal'"
                :aria-label="i === 0 ? `${tech.nombre}, color principal` : `${tech.nombre}: usar como color principal`"
                @click="emit('principal', tech.id)"
              >
                <Icon :name="tech.icono" class="h-4 w-4" />
                {{ tech.nombre }}
                <span v-if="i === 0" class="elegida__principal" aria-hidden="true">●</span>
              </button>
              <button
                type="button"
                class="elegida__quitar"
                :aria-label="`Quitar ${tech.nombre}`"
                @click="emit('alternar', tech.id)"
              >
                <Icon name="heroicons:x-mark" class="h-3.5 w-3.5" />
              </button>
            </li>
          </ul>
          <p v-else class="editor__vacio">Elige las tecnologías que usas: aparecerán en tu credencial.</p>

          <p v-if="lleno" class="editor__aviso" role="status">
            Llegaste al máximo de {{ MAXIMO_TECNOLOGIAS }}: quita una para agregar otra.
          </p>

          <label class="sr-only" :for="`${id}-buscar`">Buscar una tecnología</label>
          <div class="editor__buscar">
            <Icon name="heroicons:magnifying-glass" class="editor__buscar-icono" aria-hidden="true" />
            <input
              :id="`${id}-buscar`"
              v-model="busqueda"
              type="search"
              placeholder="Buscar: Vue, Python, Docker…"
              autocomplete="off"
              spellcheck="false"
            >
          </div>

          <section
            v-for="grupo in grupos"
            :key="grupo.id"
            class="editor__grupo"
            :aria-label="grupo.nombre"
          >
            <h3 class="editor__grupo-titulo">{{ grupo.nombre }}</h3>
            <div class="editor__catalogo">
              <button
                v-for="tech in grupo.items"
                :key="tech.id"
                type="button"
                class="tech"
                :class="{ 'tech--activa': seleccion.includes(tech.id) }"
                :style="seleccion.includes(tech.id) ? { background: tech.color, borderColor: tech.color, color: textoSobreColor(tech.color) } : undefined"
                :aria-pressed="seleccion.includes(tech.id)"
                @click="emit('alternar', tech.id)"
              >
                <Icon :name="tech.icono" class="h-4 w-4" />
                {{ tech.nombre }}
              </button>
            </div>
          </section>

          <p v-if="!grupos.length" class="editor__vacio">
            No hay tecnologías que coincidan con «{{ busqueda }}».
          </p>
        </div>

        <footer class="editor__pie">
          <p class="editor__estado" :class="`editor__estado--${estado}`" role="status" aria-live="polite">
            <template v-if="estado === 'guardando'">Guardando…</template>
            <template v-else-if="estado === 'guardado'">
              <Icon name="heroicons:check-circle" class="h-4 w-4" aria-hidden="true" /> Guardado
            </template>
            <template v-else-if="estado === 'error'">
              {{ mensajeError }}
              <button type="button" class="editor__reintentar" @click="emit('reintentar')">Reintentar</button>
            </template>
            <template v-else>Se guarda solo</template>
          </p>
          <button type="button" class="editor__listo" @click="emit('cerrar')">Listo</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import {
  GRUPOS_TECNOLOGIA,
  MAXIMO_TECNOLOGIAS,
  TECNOLOGIAS,
  textoSobreColor,
} from '~/data/tecnologias'
import { filtrarCatalogo, tecnologiasDe, type EstadoGuardado } from '~/utils/credencial'

const props = defineProps<{
  abierto: boolean
  /** Ids elegidos, en orden (la primera es la principal). */
  seleccion: string[]
  estado: EstadoGuardado
  mensajeError: string
  /** El último intento de agregar chocó con el máximo. */
  lleno: boolean
}>()

const emit = defineEmits<{
  cerrar: []
  alternar: [id: string]
  principal: [id: string]
  reintentar: []
}>()

const id = useId()
const panel = ref<HTMLElement | null>(null)
const busqueda = ref('')

const elegidas = computed(() => tecnologiasDe(props.seleccion))

const grupos = computed(() => {
  const visibles = filtrarCatalogo(TECNOLOGIAS, busqueda.value)
  return GRUPOS_TECNOLOGIA
    .map(grupo => ({ ...grupo, items: visibles.filter(tech => tech.grupo === grupo.id) }))
    .filter(grupo => grupo.items.length)
})

// Mientras está abierto la página de atrás no se desplaza; al abrir el foco pasa al cuadro (no al buscador,
// para no abrir el teclado del celular).
watch(() => props.abierto, async (abierto) => {
  if (!import.meta.client) return
  document.body.style.overflow = abierto ? 'hidden' : ''
  if (abierto) {
    busqueda.value = ''
    await nextTick()
    panel.value?.focus()
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<style scoped>
.editor {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.editor__fondo {
  position: absolute;
  inset: 0;
  background: rgba(2, 8, 18, 0.7);
  backdrop-filter: blur(4px);
  cursor: default;
}

.editor__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 34rem;
  max-height: 88vh;
  max-height: 88dvh;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 0;
  border-radius: 1.5rem 1.5rem 0 0;
  background: #07162b;
  box-shadow: 0 -20px 60px rgba(1, 8, 18, 0.6);
  outline: none;
  animation: editor-sube 0.22s ease-out;
}

@media (min-width: 640px) {
  .editor {
    align-items: center;
  }

  .editor__panel {
    max-height: 80vh;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 1.5rem;
  }
}

@keyframes editor-sube {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}

.editor__cabecera {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.25rem 0.75rem;
}

.editor__titulo {
  font-size: 1.1rem;
  font-weight: 800;
}

.editor__subtitulo {
  margin-top: 0.15rem;
  font-size: 0.78rem;
  color: rgba(214, 231, 250, 0.6);
}

.editor__cerrar {
  display: inline-flex;
  padding: 0.45rem;
  border-radius: 999px;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.06);
}

.editor__cerrar:hover {
  background: rgba(255, 255, 255, 0.12);
}

.editor__cuerpo {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 1.25rem 1rem;
}

.editor__elegidas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;
}

.elegida {
  display: inline-flex;
  align-items: stretch;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(1, 8, 18, 0.35);
}

.elegida__cuerpo {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem 0.4rem 0.8rem;
  font-size: 0.8rem;
  font-weight: 700;
}

.elegida__principal {
  font-size: 0.55rem;
  line-height: 1;
}

.elegida__quitar {
  display: inline-flex;
  align-items: center;
  padding: 0 0.55rem;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
}

.elegida__quitar:hover {
  background: rgba(0, 0, 0, 0.45);
}

.editor__vacio {
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: rgba(214, 231, 250, 0.6);
}

.editor__aviso {
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.8rem;
  color: #fde68a;
  background: rgba(251, 191, 36, 0.1);
}

.editor__buscar {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  margin-bottom: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.9rem;
  background: #0b1f3a;
}

.editor__buscar-icono {
  width: 1.1rem;
  height: 1.1rem;
  color: rgba(214, 231, 250, 0.5);
}

.editor__buscar input {
  flex: 1;
  min-width: 0;
  background: transparent;
  font-size: 0.9rem;
  color: #fff;
  outline: none;
}

.editor__buscar:focus-within {
  border-color: #00d9e8;
}

.editor__grupo-titulo {
  margin: 1rem 0 0.5rem;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(214, 231, 250, 0.5);
}

.editor__catalogo {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.tech {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.82rem;
  font-weight: 600;
  color: #cbd5e1;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}

.tech:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.4);
}

.tech--activa {
  box-shadow: 0 6px 16px rgba(1, 8, 18, 0.4);
}

.editor__pie {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.25rem calc(0.85rem + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.editor__estado {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: rgba(214, 231, 250, 0.6);
}

.editor__estado--guardado {
  color: #6ee7b7;
}

.editor__estado--error {
  color: #fca5a5;
}

.editor__reintentar {
  font-weight: 700;
  text-decoration: underline;
  color: #fff;
}

.editor__listo {
  padding: 0.6rem 1.5rem;
  border-radius: 999px;
  background: #00d9e8;
  font-size: 0.9rem;
  font-weight: 700;
  color: #041d39;
}

.editor__listo:hover {
  background: #67e8f9;
}

.editor button:focus-visible,
.editor input:focus-visible {
  outline: 2px solid #00d9e8;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .editor__panel {
    animation: none;
  }

  .tech {
    transition: none;
  }
}
</style>
