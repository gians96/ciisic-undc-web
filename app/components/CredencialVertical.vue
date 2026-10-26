<!-- Credencial vertical 3D (spec 013): ticket minimalista al estilo del de la miduConf. Sigue al cursor (o al dedo)
     con un giro suave y un brillo, la tecnología principal pone el color y su ícono de marca de agua, y el QR es
     el del código de registro (el mismo del fotocheck impreso). -->
<template>
  <div
    class="credencial-escena"
    :class="{ 'credencial-escena--activa': activa }"
    @pointermove="alMover"
    @pointerleave="alReposo"
    @pointercancel="alReposo"
  >
    <div
      class="credencial"
      :style="{
        '--rx': `${rot.x}deg`,
        '--ry': `${rot.y}deg`,
        '--gx': `${brillo.x}%`,
        '--gy': `${brillo.y}%`,
        '--acento': acento,
      }"
    >
      <div class="credencial__sombra" aria-hidden="true"/>

      <article class="credencial__tarjeta" :aria-label="`Credencial de ${asistente.nombre}`">
        <Icon
          v-if="principal"
          :name="principal.icono"
          class="credencial__marca"
          aria-hidden="true"
        />
        <div class="credencial__brillo" aria-hidden="true"/>

        <header class="credencial__cabecera">
          <NuxtImg
            src="images/logo/preloader.png"
            alt=""
            class="credencial__logo"
          />
          <div class="credencial__evento">
            <p class="credencial__evento-nombre">{{ evento.nombreCorto }}</p>
            <p class="credencial__evento-lugar">{{ evento.lugar }}</p>
          </div>
        </header>

        <div class="credencial__datos">
          <p class="credencial__kicker">Credencial</p>
          <h2 class="credencial__nombre">{{ asistente.nombre }}</h2>
          <p class="credencial__rol">{{ asistente.rol }}</p>
        </div>

        <ul
          v-if="tecnologiasElegidas.length"
          class="credencial__chips"
          aria-label="Tecnologías"
        >
          <li
            v-for="tech in tecnologiasElegidas"
            :key="tech.id"
            class="credencial__chip"
            :style="{ background: tech.color, color: textoSobreColor(tech.color) }"
            :title="tech.nombre"
          >
            <Icon :name="tech.icono" class="credencial__chip-icono" />
            <span class="sr-only">{{ tech.nombre }}</span>
          </li>
        </ul>
        <p v-else class="credencial__sin-tech">Aún sin tecnologías</p>

        <footer class="credencial__pie">
          <div class="credencial__codigo">
            <span class="credencial__codigo-etiqueta">Registro</span>
            <span class="credencial__codigo-valor">{{ asistente.codigo }}</span>
          </div>
          <img
            v-if="qr"
            :src="qr"
            alt="Código QR de la credencial"
            class="credencial__qr"
            width="72"
            height="72"
          >
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { textoSobreColor } from '~/data/tecnologias'
import { acentoDe, tecnologiasDe } from '~/utils/credencial'

export interface AsistenteCredencial {
  nombre: string
  rol: string
  codigo: string
}

const props = withDefaults(
  defineProps<{
    /** Ids del catálogo de `TECNOLOGIAS`, en orden: la primera define el color y la marca de agua. */
    tecnologias?: string[]
    asistente: AsistenteCredencial
    evento?: { nombreCorto: string, lugar: string }
    /** Imagen (data URL) del QR del código. */
    qr?: string
  }>(),
  {
    tecnologias: () => [],
    evento: () => ({ nombreCorto: 'VIII CIISIC 2026', lugar: 'Cañete, Perú · 26–30 oct' }),
    qr: undefined,
  },
)

const tecnologiasElegidas = computed(() => tecnologiasDe(props.tecnologias))
const principal = computed(() => tecnologiasElegidas.value[0])
const acento = computed(() => acentoDe(props.tecnologias))

/** Inclinación en reposo: el ticket nunca queda completamente plano. */
const REPOSO = { x: 5, y: -7 }
const rot = reactive({ ...REPOSO })
const brillo = reactive({ x: 30, y: 15 })
const activa = ref(false)
const sinMovimiento = ref(false)

function alMover(event: PointerEvent) {
  if (sinMovimiento.value) return
  const el = event.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  const px = (event.clientX - r.left) / r.width
  const py = (event.clientY - r.top) / r.height
  activa.value = true
  rot.x = Math.max(-14, Math.min(14, -(py - 0.5) * 26))
  rot.y = Math.max(-14, Math.min(14, (px - 0.5) * 26))
  brillo.x = Math.max(0, Math.min(100, px * 100))
  brillo.y = Math.max(0, Math.min(100, py * 100))
}

function alReposo() {
  activa.value = false
  rot.x = REPOSO.x
  rot.y = REPOSO.y
  brillo.x = 30
  brillo.y = 15
}

onMounted(() => {
  sinMovimiento.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<style scoped>
.credencial-escena {
  perspective: 1100px;
  display: inline-block;
  /* El dedo sigue desplazando la página en vertical; el giro responde al arrastre horizontal y al toque */
  touch-action: pan-y;
}

/* Flotación suave en reposo; se detiene al interactuar y con «reducir movimiento» */
.credencial {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx, 5deg)) rotateY(var(--ry, -7deg));
  transition: transform 0.2s ease-out;
  animation: credencial-flota 6s ease-in-out infinite;
}

.credencial-escena--activa .credencial {
  animation-play-state: paused;
}

@keyframes credencial-flota {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -6px;
  }
}

.credencial__sombra {
  position: absolute;
  inset: 8% 6%;
  z-index: -1;
  border-radius: 32px;
  background: var(--acento, #00d9e8);
  filter: blur(46px);
  opacity: 0.34;
  transform: translateZ(-60px);
  transition: background 0.4s ease;
}

.credencial__tarjeta {
  position: relative;
  width: clamp(290px, 82vw, 340px);
  min-height: 520px;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1.5rem 1.35rem;
  border: 1.5px solid transparent;
  border-radius: 28px;
  background:
    linear-gradient(165deg, #0b2547 0%, #07162b 55%, #050f20 100%) padding-box,
    linear-gradient(
        155deg,
        var(--acento, #00d9e8),
        rgba(255, 255, 255, 0.1) 40%,
        rgba(255, 255, 255, 0.04)
      )
      border-box;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 28px 56px rgba(1, 8, 18, 0.55);
  isolation: isolate;
}

/* Ícono de la tecnología principal como marca de agua */
.credencial__marca {
  position: absolute;
  top: 22%;
  right: -1.5rem;
  width: 13rem;
  height: 13rem;
  color: var(--acento, #00d9e8);
  opacity: 0.12;
  pointer-events: none;
  z-index: -1;
  transform: translateZ(10px) rotate(-8deg);
  transition: color 0.4s ease;
}

/* Brillo que sigue al cursor */
.credencial__brillo {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(
    circle at var(--gx, 30%) var(--gy, 15%),
    rgba(255, 255, 255, 0.18),
    transparent 46%
  );
  mix-blend-mode: overlay;
}

.credencial__cabecera {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transform: translateZ(18px);
}

.credencial__logo {
  width: 2.25rem;
  height: 2.25rem;
  object-fit: contain;
}

.credencial__evento-nombre {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.credencial__evento-lugar {
  margin-top: 0.1rem;
  font-size: 0.7rem;
  color: rgba(226, 240, 255, 0.6);
}

.credencial__datos {
  margin-top: auto;
  padding-top: 5.5rem;
  transform: translateZ(34px);
}

.credencial__kicker {
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--acento, #00d9e8);
  transition: color 0.4s ease;
}

.credencial__nombre {
  margin-top: 0.55rem;
  font-size: clamp(1.6rem, 7.2vw, 1.95rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.02em;
  text-wrap: balance;
  overflow-wrap: anywhere;
}

.credencial__rol {
  margin-top: 0.5rem;
  font-size: 0.82rem;
  line-height: 1.4;
  color: rgba(214, 231, 250, 0.7);
}

.credencial__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 1.35rem 0 0;
  padding: 0;
  list-style: none;
  transform: translateZ(24px);
}

.credencial__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.65rem;
  box-shadow:
    0 6px 14px rgba(1, 8, 18, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.credencial__chip-icono {
  width: 1.1rem;
  height: 1.1rem;
}

.credencial__sin-tech {
  margin-top: 1.35rem;
  font-size: 0.78rem;
  color: rgba(214, 231, 250, 0.45);
}

.credencial__pie {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.1rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  transform: translateZ(20px);
}

.credencial__codigo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.credencial__codigo-etiqueta {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: rgba(214, 231, 250, 0.5);
}

.credencial__codigo-valor {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.credencial__qr {
  width: 4.5rem;
  height: 4.5rem;
  padding: 0.3rem;
  border-radius: 0.6rem;
  background: #fff;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .credencial {
    transition: none;
    animation: none;
  }
}
</style>
