<template>
  <section class="max-w-7xl">
    <!-- Header con título y navegación -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <h2 class="text-3xl lg:text-4xl font-bold text-white">
          <slot name="title">Título por defecto</slot>
        </h2>
      </div>
      
      <!-- Botones de navegación -->
      <div v-if="showNavigation" class="flex space-x-2">
        <button 
          @click="prevSlide"
          class="w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center transition-colors duration-300"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          @click="nextSlide"
          class="w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center transition-colors duration-300"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Contenedor del carrusel -->
    <div class="relative z-10 py-4">
      <div class="overflow-hidden">
        <div 
          :class="['flex', transitionClass]"
          :style="slideStyle"
          @transitionend="onTransitionEnd"
          ref="track"
        >
          <div 
            v-for="(slideGroup, slideIndex) in displaySlides" 
            :key="`display-${slideIndex}`"
            class="flex-shrink-0 w-full"
          >
            <div 
              class="grid"
              :class="{
                'grid-cols-1': itemsPerSlide === 1,
                'grid-cols-2': itemsPerSlide === 2,
                'grid-cols-3': itemsPerSlide === 3
              }"
            >
              <component
                v-for="(item, itemIndex) in slideGroup"
                :key="`slide-${slideIndex}-item-${itemIndex}`"
                :is="item"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicadores -->
    <div v-if="showNavigation" class="flex justify-center mt-8 space-x-2">
      <div 
        v-for="(_, index) in realTotalSlides" 
        :key="index"
        class="w-2 h-2 rounded-full transition-colors duration-300 cursor-pointer"
        :class="(currentIndexMapped === index) ? 'bg-green-500' : 'bg-slate-600'"
        @click="goToSlide(index)"
      ></div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, useSlots, onMounted, onUnmounted, watch, nextTick } from 'vue';

const slots = useSlots();

/* --- estado --- */
const currentIndex = ref(1);
const itemsPerSlide = ref(3);
const isTransitionEnabled = ref(true);

/* --- extracción de nodes desde slots--- */
const slotNodes = computed(() => {
  if (!slots.default) return [];
  try {
    const slotContent = slots.default();
    function extractComponents(nodes) {
      const components = [];
      for (const node of nodes) {
        if (!node) continue;
        if (node.children && Array.isArray(node.children)) {
          components.push(...extractComponents(node.children));
        } else if (node.type && typeof node.type === 'object') {
          components.push(node);
        } else if (node.type && typeof node.type === 'string' && !['#text', '#comment'].includes(node.type)) {
          components.push(node);
        }
      }
      return components;
    }
    return extractComponents(slotContent);
  } catch (e) {
    console.error('Error extrayendo slots:', e);
    return [];
  }
});

const cardCount = computed(() => slotNodes.value.length);
const showNavigation = computed(() => cardCount.value > itemsPerSlide.value);

/* --- construir slides agrupados --- */
const slidesData = computed(() => {
  const nodes = slotNodes.value;
  const slides = [];
  for (let i = 0; i < nodes.length; i += itemsPerSlide.value) {
    const slideGroup = nodes.slice(i, i + itemsPerSlide.value);
    slides.push(slideGroup);
  }
  return slides;
});

/* --- displaySlides incluye clones al inicio y fin --- */
const displaySlides = computed(() => {
  const s = slidesData.value;
  if (!s || s.length === 0) return [];
  // clonamos referencias (no deep clone, basta con reasignar)
  const first = s[0];
  const last = s[s.length - 1];
  return [last, ...s, first];
});

const realTotalSlides = computed(() => slidesData.value.length);
const displayTotal = computed(() => displaySlides.value.length);

/* --- estilo de transform con control de transición --- */
const slideStyle = computed(() => {
  const translateX = -currentIndex.value * 100;
  return {
    transform: `translateX(${translateX}%)`
  };
});

const transitionClass = computed(() => {
  // aplicamos la clase de transición sólo cuando isTransitionEnabled = true
  return isTransitionEnabled.value ? 'transition-transform duration-500 ease-in-out' : '';
});

/* --- mapear índice mostrado para indicadores (0..n-1) --- */
const currentIndexMapped = computed(() => {
  // currentIndex: 1..realTotal
  if (realTotalSlides.value === 0) return 0;
  let mapped = currentIndex.value - 1;
  // normalizar
  if (mapped < 0) mapped = 0;
  if (mapped >= realTotalSlides.value) mapped = realTotalSlides.value - 1;
  return mapped;
});

/* --- navegación --- */
function nextSlide() {
  if (displaySlides.value.length === 0) return;
  isTransitionEnabled.value = true;
  currentIndex.value++;
  // si pasa al clon (index === displayTotal - 1), lo corregimos en onTransitionEnd
}

function prevSlide() {
  if (displaySlides.value.length === 0) return;
  isTransitionEnabled.value = true;
  currentIndex.value--;
  // si llega a 0 (clon al inicio) lo corregimos en onTransitionEnd
}

function goToSlide(index) {
  // index es 0..realTotalSlides-1
  if (displaySlides.value.length === 0) return;
  isTransitionEnabled.value = true;
  currentIndex.value = index + 1; // +1 por el clon inicial
}

/* --- corrección cuando animación termina --- */
function onTransitionEnd(e) {
  // sólo reaccionar si la propiedad transform terminó
  if (e.propertyName !== 'transform') return;

  // Si estamos en el clon final (que es el clon del primer), saltar sin animación al primer real
  if (currentIndex.value === displayTotal.value - 1) {
    // Desactivar transición, setear al primer real, forzar reflow si hace falta
    isTransitionEnabled.value = false;
    currentIndex.value = 1;
    // nextTick para reactivar la transición después del "snap"
    nextTick(() => {
      // usa microtask para reactivar; se puede usar setTimeout(,0) si es necesario
      // reactivar con un pequeño delay para garantizar que se haya aplicado el estilo sin transición
      setTimeout(() => {
        isTransitionEnabled.value = true;
      }, 0);
    });
  }

  // Si estamos en el clon inicial (index 0, clon del último), saltar al último real
  if (currentIndex.value === 0) {
    isTransitionEnabled.value = false;
    currentIndex.value = displayTotal.value - 2; // último real
    nextTick(() => {
      setTimeout(() => {
        isTransitionEnabled.value = true;
      }, 0);
    });
  }
}

/* --- responsive --- */
function updateItemsPerSlide() {
  if (import.meta.client) {
    let newValue;
    if (window.innerWidth >= 1024) {
      newValue = 3;
    } else if (window.innerWidth >= 768) {
      newValue = 2;
    } else {
      newValue = 1;
    }
    itemsPerSlide.value = newValue;
  }
}

/* --- lifecycle / watchers --- */
onMounted(() => {
  if (import.meta.client) {
    updateItemsPerSlide();
    window.addEventListener('resize', updateItemsPerSlide);
    // iniciar en el primer slide real
    currentIndex.value = 1;
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', updateItemsPerSlide);
  }
});

// cuando cambian las slides (p.ej. responsive) reiniciamos el índice para evitar out-of-bounds
watch([realTotalSlides, itemsPerSlide], () => {
  // si no hay slides reales, reset
  if (realTotalSlides.value === 0) {
    currentIndex.value = 0;
    return;
  }
  // mantener en rango: 1..realTotalSlides
  if (currentIndex.value < 1 || currentIndex.value > realTotalSlides.value) {
    // desactivar transición al resetear para evitar salto animado inesperado
    isTransitionEnabled.value = false;
    currentIndex.value = Math.min(Math.max(1, currentIndex.value), realTotalSlides.value);
    nextTick(() => {
      setTimeout(() => {
        isTransitionEnabled.value = true;
      }, 0);
    });
  }
}, { immediate: true });

</script>
