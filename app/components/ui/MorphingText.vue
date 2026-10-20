<!-- Port Vue de Magic UI `registry/magicui/morphing-text.tsx` (MIT):
     dos textos superpuestos en rejilla que se cruzan con blur creciente/decrescente
     mientras el filtro SVG `threshold` (feColorMatrix, corte de alfa ~0.55) los funde
     en un efecto "gooey". Ciclo RAF: morph 1.5 s + pausa 0.5 s.
     `activo=true` cicla `texts`; `activo=false` morfea hacia `ancla` y se queda en
     reposo (o pausa en el texto actual si `ancla` está vacío).
     El tamaño y la alineación se heredan del contexto (p. ej. el h1 del hero). -->
<template>
  <span
    class="relative mx-auto grid h-[2.2em] w-full max-w-3xl items-center"
    :class="className"
    :style="{ filter: `url(#${filterId}) blur(0.6px)` }"
  >
    <span class="sr-only">{{ textoInicial }}</span>
    <span ref="span1" aria-hidden="true" class="col-start-1 row-start-1" />
    <span ref="span2" aria-hidden="true" class="col-start-1 row-start-1">{{
      textoInicial
    }}</span>
    <svg
      class="fixed h-0 w-0"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter :id="filterId">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
          />
        </filter>
      </defs>
    </svg>
  </span>
</template>

<script setup lang="ts">
import { useId, watch } from "vue"

const props = withDefaults(
  defineProps<{
    /** Textos que se ciclan mientras `activo` es true. */
    texts: string[]
    /** Texto en reposo cuando `activo` es false; si está vacío, se pausa en el texto actual. */
    ancla?: string
    className?: string
    activo?: boolean
  }>(),
  { ancla: "", className: "", activo: true },
)

const MORPH_TIME = 1.5
const COOLDOWN_TIME = 0.5

const span1 = ref<HTMLSpanElement | null>(null)
const span2 = ref<HTMLSpanElement | null>(null)
const filterId = `morphing-${useId().replace(/[^\w-]/g, "")}`

const textoInicial = props.activo
  ? ((props.texts[0] ?? props.ancla) || "")
  : (props.ancla || props.texts[0] || "")

let enReposo = textoInicial
let iCiclo = props.texts.indexOf(enReposo)
let de = ""
let a = ""
let enMorph = false
let morph = 0
let cooldown = 0
let ultimoTiempo = 0
let cuadro = 0

function objetivo(): string {
  if (props.activo) {
    const total = props.texts.length
    if (total === 0) return props.ancla || enReposo
    if (iCiclo < 0) return (props.texts[0] ?? "") || enReposo
    return (props.texts[(iCiclo + 1) % total] ?? "") || enReposo
  }
  if (props.ancla && enReposo !== props.ancla) return props.ancla
  return enReposo
}

function reposo() {
  if (span2.value) {
    span2.value.style.filter = "none"
    span2.value.style.opacity = "100%"
  }
  if (span1.value) {
    span1.value.style.filter = "none"
    span1.value.style.opacity = "0%"
  }
}

function setEstilos(fraction: number) {
  const t1 = span1.value
  const t2 = span2.value
  if (!t1 || !t2) return

  t2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
  t2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`

  const inverso = 1 - fraction
  t1.style.filter = `blur(${Math.min(8 / inverso - 8, 100)}px)`
  t1.style.opacity = `${Math.pow(inverso, 0.4) * 100}%`

  t1.textContent = de
  t2.textContent = a
}

function paso() {
  if (!enMorph) {
    if (cooldown > 0) {
      reposo()
      return
    }
    const obj = objetivo()
    if (obj === enReposo) {
      reposo()
      return
    }
    de = enReposo
    a = obj
    enMorph = true
    morph = 0
  }

  morph -= cooldown
  cooldown = 0

  let fraction = morph / MORPH_TIME
  if (fraction > 1) {
    cooldown = COOLDOWN_TIME
    fraction = 1
  }

  setEstilos(fraction)
  if (fraction === 1) {
    enReposo = a
    iCiclo = props.texts.indexOf(a)
    enMorph = false
  }
}

function animar() {
  cuadro = requestAnimationFrame(animar)

  const ahora = Date.now()
  const dt = (ahora - ultimoTiempo) / 1000
  ultimoTiempo = ahora

  cooldown -= dt
  paso()
}

function textoEstatico() {
  return props.activo
    ? ((props.texts[0] ?? props.ancla) || "")
    : (props.ancla || props.texts[0] || "")
}

function mostrarEstatico() {
  const texto = textoEstatico()
  if (span2.value) {
    span2.value.textContent = texto
    span2.value.style.filter = "none"
    span2.value.style.opacity = "100%"
  }
  if (span1.value) {
    span1.value.style.filter = "none"
    span1.value.style.opacity = "0%"
  }
  enReposo = texto
  iCiclo = props.texts.indexOf(texto)
}

onMounted(() => {
  const distintos = props.texts.length + (props.ancla ? 1 : 0)
  if (distintos < 2) {
    watch(() => props.activo, mostrarEstatico)
    return
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    watch(() => props.activo, mostrarEstatico)
    return
  }
  ultimoTiempo = Date.now()
  cuadro = requestAnimationFrame(animar)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(cuadro)
})
</script>
