<!-- Loop infinito de logos, port Vue del LogoLoop de React Bits (MIT).
     El motor (LogoLoop.engine.ts) escribe transform/opacity directo en el DOM
     durante el RAF; la plantilla solo pinta las copias que el motor calcula en
     refresh() (copias × logos). Slot `item` equivalente a renderItem del original
     para envolver cada logo (p. ej. en una tarjeta blanca). -->
<template>
  <div
    ref="raiz"
    :class="claseRaiz"
    :style="estiloContenedor"
    role="region"
    :aria-label="ariaLabel"
    :data-intro="introPendiente ? '' : undefined"
    :data-draggable="draggable ? '' : undefined"
    :data-muted="cantidadApagado > 0 ? '' : undefined"
    :data-labels="labels !== 'none' ? labels : undefined"
  >
    <div ref="pista" class="logoloop__track">
      <ul
        v-for="copia in disposicion.copies"
        :key="copia - 1"
        class="logoloop__list"
        role="list"
        :aria-hidden="copia - 1 === disposicion.primary ? undefined : true"
      >
        <li
          v-for="(item, i) in logos"
          :key="`${copia - 1}-${i}`"
          class="logoloop__item"
          role="listitem"
          :data-color="item.hoverColor ? '' : undefined"
          :style="estiloItem(item)"
        >
          <component
            :is="item.href ? 'a' : 'div'"
            class="logoloop__content"
            v-bind="contenidoAttrs(item, copia - 1 === disposicion.primary)"
          >
            <slot name="item" :item="item">
              <img
                :src="item.src"
                :alt="item.alt ?? ''"
                :title="item.title"
                loading="lazy"
                decoding="async"
                :draggable="false"
              >
            </slot>
            <span
              v-if="muestraEtiqueta(item)"
              class="logoloop__label"
              :aria-hidden="item.alt ? true : undefined"
              >{{ item.title }}</span
            >
          </component>
          <span v-if="labels === 'hover' && item.title" class="logoloop__tip" aria-hidden="true">{{
            item.title
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";
import {
  crearMotorLogoLoop,
  fadeMask,
  toCssLength,
  type LogoLoopConfig,
  type LogoLoopItem,
  type LogoLoopLayout,
  type LogoLoopMotor,
} from "./LogoLoop.engine";

export type { LogoLoopItem };

const props = withDefaults(
  defineProps<{
    logos: LogoLoopItem[];
    /** px/s del desplazamiento; negativo invierte el sentido. */
    speed?: number;
    direction?: "left" | "right" | "up" | "down";
    width?: number | string;
    logoHeight?: number;
    gap?: number;
    /** Pausa al hover salvo que se pase hoverSpeed explícito. */
    pauseOnHover?: boolean;
    hoverSpeed?: number;
    fadeOut?: boolean;
    fadeOutWidth?: number;
    scaleOnHover?: boolean;
    layout?: "line" | "wave" | "arc" | "orbit";
    bend?: number;
    focus?: number;
    magnify?: number;
    tiltX?: number;
    tiltY?: number;
    step?: boolean;
    muted?: number;
    labels?: "none" | "inline" | "below" | "hover";
    draggable?: boolean;
    scrollBoost?: number;
    intro?: boolean;
    ariaLabel?: string;
  }>(),
  {
    speed: 120,
    direction: "left",
    width: "100%",
    logoHeight: 28,
    gap: 32,
    hoverSpeed: undefined,
    fadeOut: true,
    fadeOutWidth: 0.12,
    scaleOnHover: false,
    layout: "line",
    bend: 0.5,
    focus: 0,
    magnify: 0,
    tiltX: 0,
    tiltY: 0,
    step: false,
    muted: 0,
    labels: "none",
    draggable: true,
    scrollBoost: 0,
    intro: true,
    ariaLabel: "Logos",
  },
);

defineSlots<{
  /** Envuelve el logo por defecto (equivale a renderItem del original). */
  item?: (props: { item: LogoLoopItem }) => unknown;
}>();

const raiz = ref<HTMLElement | null>(null);
const pista = ref<HTMLElement | null>(null);

const disposicion = ref<LogoLoopLayout>({ copies: 3, primary: 1 });

// Estado inicial no reactivo: el SSR ya trae `data-intro` y el motor lo quita
// del DOM; Vue nunca vuelve a escribirlo porque compara vnode → vnode.
const introPendiente = props.intro;

const vertical = computed(
  () => props.direction === "up" || props.direction === "down",
);

// Objeto mutable plano: el motor lo lee en cada cuadro sin pasar por reactividad.
const configuracion: { current: LogoLoopConfig } = {
  current: {} as LogoLoopConfig,
};

watchEffect(() => {
  configuracion.current = {
    speed: props.speed,
    dirSign: (vertical.value
      ? props.direction === "up"
      : props.direction !== "right"
    )
      ? 1
      : -1,
    hoverValue:
      props.hoverSpeed !== undefined
        ? props.hoverSpeed
        : props.pauseOnHover === false
          ? undefined
          : 0,
    vertical: vertical.value,
    layout: props.layout,
    bend: props.bend,
    focus: props.focus,
    magnify: props.magnify,
    tiltX: props.tiltX,
    tiltY: props.tiltY,
    step: props.step,
    draggable: props.draggable,
    scrollBoost: props.scrollBoost,
    intro: props.intro,
    scaleOnHover: props.scaleOnHover,
    labels: props.labels,
    links: props.logos.some((item) => Boolean(item.href)),
  };
});

const cantidadApagado = computed(() => Math.min(1, props.muted));

const claseRaiz = computed(() =>
  [
    "logoloop",
    vertical.value ? "logoloop--vertical" : "logoloop--horizontal",
    props.scaleOnHover ? "logoloop--scale-hover" : "",
  ]
    .filter(Boolean)
    .join(" "),
);

const estiloContenedor = computed<CSSProperties>(() => {
  const ancho = toCssLength(props.width);
  const estilo: Record<string, string> = {
    "--logoloop-gap": `${props.gap}px`,
    "--logoloop-logoHeight": `${props.logoHeight}px`,
  };
  if (vertical.value) {
    if (ancho && ancho !== "100%") estilo.width = ancho;
  } else {
    estilo.width = ancho ?? "100%";
  }
  if (cantidadApagado.value > 0) {
    estilo["--logoloop-gray"] = Math.min(1, cantidadApagado.value * 2).toFixed(3);
    estilo["--logoloop-dim"] = (1 - cantidadApagado.value * 0.6).toFixed(3);
  }
  const mascara = props.fadeOut
    ? fadeMask(props.fadeOutWidth, vertical.value)
    : undefined;
  if (mascara) {
    estilo.maskImage = mascara;
    estilo.WebkitMaskImage = mascara;
  }
  return estilo as CSSProperties;
});

function estiloItem(item: LogoLoopItem): CSSProperties | undefined {
  return item.hoverColor
    ? ({ "--logoloop-item-color": item.hoverColor } as CSSProperties)
    : undefined;
}

function contenidoAttrs(
  item: LogoLoopItem,
  principal: boolean,
): Record<string, unknown> {
  if (!item.href) return {};
  return {
    href: item.href,
    "aria-label": (item.alt ?? item.title ?? "") || "logo link",
    target: "_blank",
    rel: "noreferrer noopener",
    draggable: "false",
    tabindex: principal ? undefined : -1,
  };
}

function muestraEtiqueta(item: LogoLoopItem): boolean {
  return (
    (props.labels === "inline" || props.labels === "below") && Boolean(item.title)
  );
}

let motor: LogoLoopMotor | null = null;

onMounted(() => {
  motor = crearMotorLogoLoop(
    raiz.value as HTMLDivElement,
    pista.value as HTMLDivElement,
    configuracion,
    (layout) => {
      disposicion.value = { ...layout };
    },
  );
  motor.refresh();
});

// Repite el segundo layout-effect del original: remeir cuando cambian las copias
// o las props que afectan la geometría (flush post: tras pintar el DOM).
watch(
  () => [
    disposicion.value.copies,
    disposicion.value.primary,
    props.logos,
    vertical.value,
    props.logoHeight,
    props.gap,
    props.labels,
    props.layout,
    props.bend,
    props.focus,
    props.magnify,
    props.tiltX,
    props.tiltY,
    props.scaleOnHover,
  ],
  () => {
    motor?.refresh();
    motor?.wake();
  },
  { flush: "post" },
);

onBeforeUnmount(() => {
  motor?.destroy();
  motor = null;
});
</script>

<style>
/* Estilos del original sin scoping: el motor depende de .logoloop__item y
   .logoloop__content para medir y escribir transform por elemento. */
.logoloop {
  --logoloop-gap: 32px;
  --logoloop-logoHeight: 28px;
  --logoloop-pad: 0px;
  position: relative;
  overflow: hidden;
  overflow: clip;
  padding-top: var(--logoloop-pad);
  padding-bottom: var(--logoloop-pad);
  -webkit-tap-highlight-color: transparent;
}

.logoloop--vertical {
  display: inline-block;
  height: 100%;
  padding: 0 var(--logoloop-pad);
}

.logoloop[data-draggable] {
  cursor: grab;
  touch-action: pan-y pinch-zoom;
}

.logoloop--vertical[data-draggable] {
  touch-action: pan-x pinch-zoom;
}

.logoloop[data-dragging],
.logoloop[data-dragging] * {
  cursor: grabbing;
}

.logoloop__track {
  position: relative;
  z-index: 0;
  display: flex;
  width: max-content;
  will-change: transform;
  user-select: none;
  -webkit-user-select: none;
}

.logoloop--vertical .logoloop__track {
  flex-direction: column;
  width: 100%;
  height: max-content;
}

.logoloop__list {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.logoloop--vertical .logoloop__list {
  flex-direction: column;
}

.logoloop__item {
  position: relative;
  flex: 0 0 auto;
  margin-right: var(--logoloop-gap);
  font-size: var(--logoloop-logoHeight);
  line-height: 1;
}

.logoloop--vertical .logoloop__item {
  margin-right: 0;
  margin-bottom: var(--logoloop-gap);
}

.logoloop[data-intro] .logoloop__item {
  opacity: 0;
}

.logoloop__content {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--logoloop-logoHeight) * 0.3);
  border-radius: 4px;
  color: inherit;
  text-decoration: none;
  transition:
    opacity 0.35s ease,
    filter 0.35s ease,
    color 0.35s ease;
}

.logoloop[data-labels='below'] .logoloop__content {
  flex-direction: column;
  gap: calc(var(--logoloop-logoHeight) * 0.22);
}

.logoloop__content:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.logoloop__node {
  display: inline-flex;
  align-items: center;
}

.logoloop__item img {
  display: block;
  width: auto;
  height: var(--logoloop-logoHeight);
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  -webkit-user-drag: none;
  pointer-events: none;
}

.logoloop__node,
.logoloop__item img {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logoloop--scale-hover .logoloop__item:hover img,
.logoloop--scale-hover .logoloop__item:hover .logoloop__node {
  transform: scale(1.35);
}

.logoloop__label {
  font-size: max(12px, calc(var(--logoloop-logoHeight) * 0.5));
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.logoloop[data-labels='below'] .logoloop__label {
  font-size: max(11px, calc(var(--logoloop-logoHeight) * 0.26));
  font-weight: 500;
  letter-spacing: 0;
  opacity: 0.72;
}

.logoloop__tip {
  position: absolute;
  top: 100%;
  left: 50%;
  margin-top: calc(var(--logoloop-logoHeight) * 0.2);
  font-size: max(11px, calc(var(--logoloop-logoHeight) * 0.26));
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  opacity: 0;
  translate: -50% 4px;
  pointer-events: none;
  transition:
    opacity 0.25s ease,
    translate 0.25s ease;
}

.logoloop--vertical .logoloop__tip {
  top: 50%;
  left: 100%;
  margin-top: 0;
  margin-left: calc(var(--logoloop-logoHeight) * 0.25);
  translate: 4px -50%;
}

.logoloop__item:hover .logoloop__tip,
.logoloop__item:focus-within .logoloop__tip,
.logoloop__item[data-active] .logoloop__tip {
  opacity: 0.8;
  translate: -50% 0;
}

.logoloop--vertical .logoloop__item:hover .logoloop__tip,
.logoloop--vertical .logoloop__item:focus-within .logoloop__tip,
.logoloop--vertical .logoloop__item[data-active] .logoloop__tip {
  translate: 0 -50%;
}

.logoloop[data-muted] .logoloop__content {
  filter: grayscale(var(--logoloop-gray, 1));
  opacity: var(--logoloop-dim, 0.5);
}

.logoloop[data-muted] .logoloop__item:hover .logoloop__content,
.logoloop[data-muted] .logoloop__item:focus-within .logoloop__content,
.logoloop[data-muted] .logoloop__item[data-active] .logoloop__content {
  filter: none;
  opacity: 1;
}

.logoloop__item[data-color]:hover .logoloop__content,
.logoloop__item[data-color]:focus-within .logoloop__content,
.logoloop__item[data-color][data-active] .logoloop__content {
  color: var(--logoloop-item-color);
}

.logoloop:not([data-muted]) .logoloop__item:not([data-color]) a.logoloop__content:hover {
  opacity: 0.8;
}

@media (prefers-reduced-motion: reduce) {
  .logoloop__content,
  .logoloop__node,
  .logoloop__item img,
  .logoloop__tip {
    transition: none;
  }
}
</style>
