<!-- Dos capas superpuestas (slots `inactivo` y `activo`) que se cruzan con el
     mismo fundido "gooey" de Magic UI MorphingText: blur inverso mientras el
     filtro SVG `threshold` (feColorMatrix, corte de alfa ~0.55) funde los bordes.
     A diferencia del texto, el filtro del contenedor solo se aplica durante la
     transición para no alterar bordes, sombras ni degradados de la interfaz en
     reposo. La inversión (activo cambia a mitad de la transición) se hace
     reflejando el progreso: conserva la mezcla exacta de ambas capas. -->
<template>
  <div ref="contenedor" class="morphing-capas">
    <div
      ref="capa0"
      class="morphing-capa"
      :style="estilo0"
      :aria-hidden="mostrarActivo"
    >
      <slot name="inactivo" />
    </div>
    <div
      ref="capa1"
      class="morphing-capa"
      :style="estilo1"
      :aria-hidden="!mostrarActivo"
    >
      <slot name="activo" />
    </div>
    <svg
      class="fixed h-0 w-0"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter :id="filterId" x="-50%" y="-50%" width="200%" height="200%">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { useId, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** Muestra la capa del slot `activo`; false muestra la del slot `inactivo`. */
    activo?: boolean
  }>(),
  { activo: false },
);

const MORPH_TIME = 1.5;

const filterId = `morphing-capas-${useId().replace(/[^\w-]/g, "")}`;
const filtroGoo = `url(#${filterId}) blur(0.6px)`;

const contenedor = ref<HTMLElement | null>(null);
const capa0 = ref<HTMLElement | null>(null);
const capa1 = ref<HTMLElement | null>(null);
const capas = [capa0, capa1];

// Estilos de reposo iniciales como constantes no reactivas: el HTML de SSR ya
// trae la capa correcta visible y Vue nunca vuelve a pisar los estilos que
// escribe el ciclo RAF (compara vnode → vnode por referencia).
const estilo0 = props.activo
  ? { opacity: "0%", visibility: "hidden" as const }
  : { opacity: "100%", visibility: "visible" as const };
const estilo1 = props.activo
  ? { opacity: "100%", visibility: "visible" as const }
  : { opacity: "0%", visibility: "hidden" as const };

const mostrarActivo = ref(props.activo);

let enReposo = props.activo ? 1 : 0;
let de = 0;
let a = 0;
let enMorph = false;
let morph = 0;
let ultimoTiempo = 0;
let cuadro = 0;
let montado = false;
let reducido = false;

function reposo() {
  if (contenedor.value) contenedor.value.style.filter = "none";
  for (let i = 0; i < 2; i++) {
    const capa = capas[i]?.value;
    if (!capa) continue;
    const visible = i === enReposo;
    capa.style.visibility = visible ? "visible" : "hidden";
    capa.style.opacity = visible ? "100%" : "0%";
    capa.style.filter = "none";
    capa.style.pointerEvents = visible ? "" : "none";
  }
}

function aplicar(f: number) {
  const capaDe = capas[de]?.value;
  const capaA = capas[a]?.value;
  if (!capaDe || !capaA) return;

  capaDe.style.visibility = "visible";
  capaA.style.visibility = "visible";
  capaDe.style.pointerEvents = "none";
  capaA.style.pointerEvents = "none";

  capaA.style.filter = `blur(${Math.min(8 / f - 8, 100)}px)`;
  capaA.style.opacity = `${Math.pow(f, 0.4) * 100}%`;

  const inverso = 1 - f;
  capaDe.style.filter = `blur(${Math.min(8 / inverso - 8, 100)}px)`;
  capaDe.style.opacity = `${Math.pow(inverso, 0.4) * 100}%`;
}

function tick() {
  const ahora = Date.now();
  // Tope de dt: un salto (pestaña en segundo plano, reloj virtual) no debe
  // completar el morf de un salto ni desincronizarlo del título (MorphingText).
  const dt = Math.min((ahora - ultimoTiempo) / 1000, 0.1);
  ultimoTiempo = ahora;
  morph += dt;

  const f = morph / MORPH_TIME;
  if (f >= 1) {
    aplicar(1);
    enReposo = a;
    enMorph = false;
    cuadro = 0;
    reposo();
    return;
  }
  aplicar(f);
  cuadro = requestAnimationFrame(tick);
}

function iniciar() {
  if (cuadro !== 0) return;
  ultimoTiempo = Date.now();
  cuadro = requestAnimationFrame(tick);
}

watch(
  () => props.activo,
  (valor) => {
    mostrarActivo.value = valor;
    const obj = valor ? 1 : 0;
    if (!montado || reducido) {
      enReposo = obj;
      reposo();
      return;
    }
    if (enMorph) {
      if (obj === de) {
        // Inversión a mitad de la transición: reflejar el progreso conserva
        // la mezcla exacta de opacidades y desenfoques de ambas capas.
        const intercambio = de;
        de = a;
        a = intercambio;
        morph = MORPH_TIME - morph;
      }
      return;
    }
    if (obj === enReposo) {
      reposo();
      return;
    }
    de = enReposo;
    a = obj;
    morph = 0;
    enMorph = true;
    if (contenedor.value) contenedor.value.style.filter = filtroGoo;
    iniciar();
  },
);

onMounted(() => {
  montado = true;
  reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  enReposo = props.activo ? 1 : 0;
  mostrarActivo.value = props.activo;
  reposo();
});

onBeforeUnmount(() => {
  if (cuadro !== 0) cancelAnimationFrame(cuadro);
});
</script>

<style scoped>
.morphing-capas {
  display: grid;
  min-width: 0;
}
.morphing-capa {
  grid-area: 1 / 1;
  min-width: 0;
}
</style>
