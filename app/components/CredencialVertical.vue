<!-- Credencial vertical 3D a pantalla completa (spec 013): ticket minimalista al estilo del de la miduConf. Sigue al cursor (o al
     dedo) con un giro suave y un brillo; la tecnología principal pone el color y su ícono de marca de agua; el QR es el del
     código de registro (el mismo del fotocheck impreso). Con doble toque (o Intro) pide editar las tecnologías. -->
<template>
  <div
    class="credencial-escena"
    :class="{ 'credencial-escena--activa': activa }"
    role="button"
    tabindex="0"
    :aria-label="`Credencial de ${asistente.nombre}, código ${asistente.codigo}. Toca dos veces o pulsa Intro para editar tus tecnologías.`"
    @pointermove="alMover"
    @pointerleave="alReposo"
    @pointercancel="alReposo"
    @pointerup="alSoltar"
    @dblclick.prevent="emit('editar')"
    @keydown.enter.prevent="emit('editar')"
    @keydown.space.prevent="emit('editar')"
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

      <article class="credencial__tarjeta" aria-hidden="true">
        <Icon
          v-if="principal"
          :name="principal.icono"
          class="credencial__marca"
        />
        <div class="credencial__brillo"/>

        <header class="credencial__cabecera">
          <NuxtImg
            src="images/logo/preloader.png"
            alt=""
            class="credencial__logo"
          />
          <p class="credencial__evento">{{ evento.nombreCorto }}</p>
        </header>
        <p v-if="evento.nombre" class="credencial__congreso">{{ evento.nombre }}</p>

        <p v-if="pista" class="credencial__pista">Toca dos veces para editar</p>

        <div class="credencial__datos">
          <h2 class="credencial__nombre">{{ asistente.nombre }}</h2>
          <ul v-if="tecnologiasElegidas.length" class="credencial__chips">
            <li
              v-for="tech in tecnologiasElegidas"
              :key="tech.id"
              class="credencial__chip"
              :style="{ background: tech.color, color: textoSobreColor(tech.color) }"
              :title="tech.nombre"
            >
              <Icon :name="tech.icono" class="credencial__chip-icono" />
            </li>
          </ul>
        </div>

        <footer class="credencial__pie">
          <img
            v-if="qr"
            :src="qr"
            alt=""
            class="credencial__qr"
          >
          <p class="credencial__codigo">{{ asistente.codigo }}</p>
        </footer>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { textoSobreColor } from '~/data/tecnologias'
import { acentoDe, esDobleToque, tecnologiasDe, type ToqueCredencial } from '~/utils/credencial'

export interface AsistenteCredencial {
  nombre: string
  codigo: string
}

const props = withDefaults(
  defineProps<{
    /** Ids del catálogo de `TECNOLOGIAS`, en orden: la primera define el color y la marca de agua. */
    tecnologias?: string[]
    asistente: AsistenteCredencial
    evento?: { nombreCorto: string, nombre?: string }
    /** Imagen (data URL) del QR del código. */
    qr?: string
    /** Muestra un momento «Toca dos veces para editar» (la página lo apaga solo). */
    pista?: boolean
  }>(),
  {
    tecnologias: () => [],
    evento: () => ({ nombreCorto: 'VIII CIISIC 2026', nombre: 'VIII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica' }),
    qr: undefined,
    pista: false,
  },
)

const emit = defineEmits<{ editar: [] }>()

const tecnologiasElegidas = computed(() => tecnologiasDe(props.tecnologias))
const principal = computed(() => tecnologiasElegidas.value[0])
const acento = computed(() => acentoDe(props.tecnologias))

/** Inclinación en reposo: el ticket nunca queda completamente plano. */
const REPOSO = { x: 4, y: -5 }
const rot = reactive({ ...REPOSO })
const brillo = reactive({ x: 30, y: 15 })
const activa = ref(false)
const sinMovimiento = ref(false)
let ultimoToque: ToqueCredencial | null = null

function alMover(event: PointerEvent) {
  if (sinMovimiento.value) return
  const el = event.currentTarget as HTMLElement
  const r = el.getBoundingClientRect()
  const px = (event.clientX - r.left) / r.width
  const py = (event.clientY - r.top) / r.height
  activa.value = true
  rot.x = Math.max(-10, Math.min(10, -(py - 0.5) * 20))
  rot.y = Math.max(-10, Math.min(10, (px - 0.5) * 20))
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

/** Doble toque con el dedo: se detecta a mano porque iOS no siempre dispara `dblclick` (con el mouse sí llega `dblclick`; el editor se abre una sola vez). */
function alSoltar(event: PointerEvent) {
  const toque: ToqueCredencial = { instante: event.timeStamp, x: event.clientX, y: event.clientY }
  if (esDobleToque(ultimoToque, toque)) {
    ultimoToque = null
    emit('editar')
    return
  }
  ultimoToque = toque
}

onMounted(() => {
  sinMovimiento.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<style scoped>
/* La credencial ocupa la pantalla en vertical: alto = el de la ventana y ancho en proporción (sin pasarse del ancho disponible) */
.credencial-escena {
  --margen: 0.75rem;
  --alto: calc(100vh - 2 * var(--margen));
  --alto: calc(100dvh - 2 * var(--margen));
  --ancho: min(calc(var(--alto) * 0.62), calc(100vw - 2 * var(--margen)));
  perspective: 1400px;
  width: var(--ancho);
  height: var(--alto);
  /* Sin zoom por doble toque (es el gesto de editar); la página no se desplaza */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  outline: none;
}

.credencial-escena:focus-visible .credencial__tarjeta {
  outline: 2px solid #00d9e8;
  outline-offset: 3px;
}

/* Flotación suave en reposo; se detiene al interactuar y con «reducir movimiento» */
.credencial {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx, 4deg)) rotateY(var(--ry, -5deg));
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
    translate: 0 -5px;
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
  container-type: size;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 7cqw 8cqw 7cqw;
  border: 1.5px solid transparent;
  border-radius: 9cqw;
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
  top: 18%;
  right: -12cqw;
  width: 78cqw;
  height: 78cqw;
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
  gap: 3cqw;
  transform: translateZ(18px);
}

.credencial__logo {
  width: 11cqw;
  height: 11cqw;
  object-fit: contain;
}

.credencial__evento {
  font-size: clamp(0.8rem, 4.2cqw, 1.1rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

/* Nombre completo del congreso, bajo la cabecera */
.credencial__congreso {
  max-width: 92%;
  margin-top: 5cqw;
  font-size: clamp(0.85rem, 5.7cqw, 1.4rem);
  font-weight: 600;
  line-height: 1.32;
  color: rgba(226, 240, 255, 0.88);
  text-wrap: balance;
  transform: translateZ(14px);
}

/* Aviso que se apaga solo: en el hueco entre el congreso y el nombre */
.credencial__pista {
  position: absolute;
  top: 44%;
  left: 50%;
  z-index: 4;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: rgba(2, 10, 22, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-size: clamp(0.7rem, 3.6cqw, 0.9rem);
  font-weight: 600;
  white-space: nowrap;
  color: rgba(226, 240, 255, 0.92);
  transform: translateX(-50%) translateZ(40px);
  animation: credencial-pista 5s ease forwards;
}

@keyframes credencial-pista {
  0%,
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.credencial__datos {
  margin-top: auto;
  transform: translateZ(34px);
}

.credencial__nombre {
  font-size: clamp(1.5rem, 10.5cqw, 3rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
  text-wrap: balance;
  overflow-wrap: anywhere;
}

.credencial__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 2.4cqw;
  margin: 6cqw 0 0;
  padding: 0;
  list-style: none;
  transform: translateZ(24px);
}

.credencial__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 11cqw;
  height: 11cqw;
  border-radius: 3.4cqw;
  box-shadow:
    0 6px 14px rgba(1, 8, 18, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.credencial__chip-icono {
  width: 5.8cqw;
  height: 5.8cqw;
}

/* QR abajo al centro y, debajo, el código */
.credencial__pie {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3.2cqw;
  margin-top: 8cqw;
  padding-top: 7cqw;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  transform: translateZ(20px);
}

.credencial__qr {
  width: clamp(5.5rem, min(46cqw, 24cqh), 15rem);
  height: auto;
  aspect-ratio: 1;
  padding: 2.6cqw;
  border-radius: 4.4cqw;
  background: #fff;
}

.credencial__codigo {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: clamp(0.95rem, 5.4cqw, 1.5rem);
  font-weight: 700;
  letter-spacing: 0.18em;
  text-indent: 0.18em;
}

@media (prefers-reduced-motion: reduce) {
  .credencial {
    transition: none;
    animation: none;
  }

  .credencial__pista {
    animation: none;
  }
}
</style>
