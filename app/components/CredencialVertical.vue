<!-- Credencial vertical 3D de asistente (efecto tomado del ticket de la
     miduConf): sigue al cursor con rotateX/rotateY, sombra desplazada en
     translateZ y acento de color según la tecnología principal. -->
<template>
  <div
    class="credencial-escena"
    @mousemove="alMover"
    @mouseleave="alReposo"
  >
    <div
      class="credencial"
      :style="{ '--rx': `${rot.x}deg`, '--ry': `${rot.y}deg`, '--acento': acento }"
    >
      <!-- Sombra desplazada atrás del ticket (capa en Z negativa). -->
      <div class="credencial__sombra" aria-hidden="true"/>

      <article class="credencial__tarjeta">
        <div class="credencial__ranura" aria-hidden="true"/>

        <header class="credencial__cabecera">
          <NuxtImg
            src="images/logo/preloader.png"
            alt=""
            class="credencial__logo"
          />
          <div>
            <p class="credencial__evento">VIII CIISIC 2026</p>
            <p class="credencial__sede">Cañete, Perú · 26–30 oct</p>
          </div>
          <span class="credencial__chip-live" aria-hidden="true"/>
        </header>

        <!-- Perforación con muescas laterales (como un ticket físico). -->
        <div class="credencial__perf" aria-hidden="true">
          <span class="credencial__muesca credencial__muesca--izq"/>
          <span class="credencial__muesca credencial__muesca--der"/>
        </div>

        <div class="credencial__datos">
          <p class="credencial__kicker">Admit one</p>
          <h2 class="credencial__nombre">{{ asistente.nombre }}</h2>
          <p class="credencial__rol">{{ asistente.rol }}</p>
        </div>

        <ul
          v-if="tecnologias.length"
          class="credencial__chips"
          aria-label="Tecnologías del asistente"
        >
          <li
            v-for="tech in tecnologias"
            :key="tech.id"
            class="credencial__chip"
            :style="{ background: tech.color, color: textoSobreColor(tech.color) }"
            :title="tech.nombre"
          >
            <Icon :name="tech.icono" class="credencial__chip-icono" />
            <span class="sr-only">{{ tech.nombre }}</span>
          </li>
        </ul>
        <p v-else class="credencial__sin-tech">
          Sin tecnologías registradas.
        </p>

        <footer class="credencial__pie">
          <div class="credencial__codigo">
            <span class="credencial__codigo-valor">{{ asistente.codigo }}</span>
            <span class="credencial__codigo-etiqueta">No. de registro</span>
          </div>
          <div class="credencial__barcode" aria-hidden="true"/>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  tecnologiaPorId,
  textoSobreColor,
  type Tecnologia,
} from "~/data/tecnologias";

export interface AsistenteCredencial {
  nombre: string;
  rol: string;
  codigo: string;
}

const props = withDefaults(
  defineProps<{
    /** Ids del catálogo `TECNOLOGIAS`; el primero define el acento. */
    tecnologias?: string[];
    asistente?: AsistenteCredencial;
  }>(),
  {
    tecnologias: () => ["vue", "vite", "chatgpt"],
    asistente: () => ({
      nombre: "Andrea Ruiz Salas",
      rol: "Estudiante de Ingeniería de Sistemas · UNDC",
      codigo: "CIISIC-26-0042",
    }),
  },
);

const tecnologias = computed<Tecnologia[]>(() =>
  props.tecnologias
    .map((id) => tecnologiaPorId(id))
    .filter((tech): tech is Tecnologia => tech !== undefined),
);

const acento = computed(
  () => tecnologias.value[0]?.color ?? "#00d9e8",
);

/** Inclinación en reposo (el ticket nunca queda completamente plano). */
const REPOSO = { x: 6, y: -6 };
const rot = reactive({ ...REPOSO });
const sinMovimiento = ref(false);

function alMover(event: MouseEvent) {
  if (sinMovimiento.value) return;
  const el = event.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  const px = (event.clientX - r.left) / r.width - 0.5;
  const py = (event.clientY - r.top) / r.height - 0.5;
  rot.x = Math.max(-14, Math.min(14, -py * 24));
  rot.y = Math.max(-14, Math.min(14, px * 24));
}

function alReposo() {
  rot.x = REPOSO.x;
  rot.y = REPOSO.y;
}

onMounted(() => {
  sinMovimiento.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
});
</script>

<style scoped>
.credencial-escena {
  perspective: 1100px;
  display: inline-block;
}

.credencial {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx, 6deg)) rotateY(var(--ry, -6deg));
  transition: transform 0.18s ease-out;
}

.credencial__sombra {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 28px;
  background: var(--acento, #00d9e8);
  filter: blur(42px);
  opacity: 0.38;
  transform: translateZ(-56px) scale(0.94);
}

.credencial__tarjeta {
  position: relative;
  width: clamp(300px, 84vw, 352px);
  min-height: 560px;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.75rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 28px;
  background:
    linear-gradient(168deg, rgba(12, 44, 80, 0.96), rgba(5, 22, 43, 0.98))
      padding-box,
    linear-gradient(
        150deg,
        var(--acento, #00d9e8),
        rgba(255, 255, 255, 0.14) 45%,
        rgba(255, 255, 255, 0.05)
      )
      border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 30px 60px rgba(1, 8, 18, 0.55);
}

/* Ranura para el cordón de la credencial. */
.credencial__ranura {
  position: absolute;
  top: 0.9rem;
  left: 50%;
  width: 4.5rem;
  height: 0.7rem;
  border-radius: 999px;
  background: rgba(2, 10, 22, 0.92);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.8);
  transform: translateX(-50%);
}

.credencial__cabecera {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-bottom: 1.25rem;
}

.credencial__logo {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
}

.credencial__evento {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.credencial__sede {
  font-size: 0.72rem;
  color: rgba(226, 240, 255, 0.66);
}

.credencial__chip-live {
  width: 0.55rem;
  height: 0.55rem;
  margin-left: auto;
  border-radius: 999px;
  background: var(--acento, #00d9e8);
  box-shadow: 0 0 12px var(--acento, #00d9e8);
}

/* Perforación + muescas semicirculares a los lados. */
.credencial__perf {
  position: relative;
  height: 0;
  border-top: 2px dashed rgba(255, 255, 255, 0.28);
}

.credencial__muesca {
  position: absolute;
  top: 50%;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 999px;
  background: #041d39;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  transform: translateY(-50%);
}

.credencial__muesca--izq {
  left: -2.45rem;
}

.credencial__muesca--der {
  right: -2.45rem;
}

.credencial__datos {
  padding: 1.5rem 0 1.25rem;
}

.credencial__kicker {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--acento, #00d9e8);
}

.credencial__nombre {
  margin-top: 0.5rem;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.credencial__rol {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  line-height: 1.45;
  color: rgba(214, 231, 250, 0.72);
}

.credencial__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  list-style: none;
}

.credencial__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  box-shadow:
    0 6px 16px rgba(1, 8, 18, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.credencial__chip-icono {
  width: 1.35rem;
  height: 1.35rem;
}

.credencial__sin-tech {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: rgba(214, 231, 250, 0.5);
}

.credencial__pie {
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.credencial__codigo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.credencial__codigo-valor {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.credencial__codigo-etiqueta {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(214, 231, 250, 0.55);
}

.credencial__barcode {
  height: 2.6rem;
  margin-top: 0.85rem;
  border-radius: 4px;
  background:
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.92) 0 2px,
      transparent 2px 5px,
      rgba(255, 255, 255, 0.92) 5px 6px,
      transparent 6px 10px,
      rgba(255, 255, 255, 0.92) 10px 13px,
      transparent 13px 15px
    );
  opacity: 0.85;
}

@media (prefers-reduced-motion: reduce) {
  .credencial {
    transition: none;
  }
}
</style>
