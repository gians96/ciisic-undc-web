<!-- Tarjeta de tipo de delegación (spec 019): «Delegación General» o «Delegación Promocional».
     Radio real invisibilizado dentro de un radiogroup: el teclado y los lectores de pantalla
     manejan la selección igual que en los planes de inscripción. -->
<template>
  <label class="tarjeta-tipo" :class="{ 'tarjeta-tipo--activa': activa }">
    <input
      type="radio"
      name="tipoDelegacion"
      class="sr-only"
      :value="tipo.id"
      :checked="activa"
      @change="emit('actualizar', tipo.id)"
    >
    <span class="tarjeta-tipo__cabecera">
      <span class="tarjeta-tipo__selector" :class="{ 'tarjeta-tipo__selector--activa': activa }">
        <span v-if="activa" class="tarjeta-tipo__punto" />
      </span>
      <span class="tarjeta-tipo__titulo">{{ tipo.titulo }}</span>
      <span v-if="tipo.badge" class="tarjeta-tipo__badge">{{ tipo.badge }}</span>
    </span>
    <span class="tarjeta-tipo__precio">
      {{ formatearSoles(tipo.precio) }}<span class="tarjeta-tipo__unidad"> por persona</span>
    </span>
    <span v-if="tipo.descripcion" class="tarjeta-tipo__descripcion">{{ tipo.descripcion }}</span>
    <ul v-if="tipo.caracteristicas.length" class="tarjeta-tipo__lista">
      <li v-for="caracteristica in tipo.caracteristicas" :key="caracteristica.text" class="tarjeta-tipo__item">
        <Icon :name="caracteristica.icon" class="tarjeta-tipo__icono" aria-hidden="true" />
        <span>{{ caracteristica.text }}</span>
      </li>
    </ul>
  </label>
</template>

<script setup lang="ts">
import type { TarjetaTipoDelegacion } from '~/utils/delegaciones'
import { formatearSoles } from '~/utils/formato'

defineProps<{ tipo: TarjetaTipoDelegacion, activa: boolean }>()
const emit = defineEmits<{ actualizar: [id: number] }>()
</script>

<style scoped>
.tarjeta-tipo { display: flex; flex-direction: column; gap: 0.5rem; cursor: pointer; border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.04); padding: 1.25rem; transition: border-color 0.2s, background-color 0.2s; }
.tarjeta-tipo:hover { border-color: rgba(0, 217, 232, 0.5); }
.tarjeta-tipo--activa { border-color: #00d9e8; background: rgba(0, 217, 232, 0.08); }
.tarjeta-tipo:focus-within { outline: 2px solid #00d9e8; outline-offset: 2px; }
.tarjeta-tipo__cabecera { display: flex; align-items: center; gap: 0.5rem; }
.tarjeta-tipo__titulo { font-weight: 700; color: #fff; }
.tarjeta-tipo__badge { margin-left: auto; border-radius: 9999px; background: #00d9e81a; color: #67e8f9; font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.6rem; text-transform: uppercase; }
.tarjeta-tipo__precio { margin-top: 0.25rem; color: #fff; font-size: 1.5rem; font-weight: 800; }
.tarjeta-tipo__unidad { font-size: 0.8rem; font-weight: 500; color: #94a3b8; }
.tarjeta-tipo__descripcion { font-size: 0.85rem; color: #cbd5e1; }
.tarjeta-tipo__lista { margin-top: 0.5rem; display: grid; gap: 0.35rem; }
.tarjeta-tipo__item { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.8rem; color: #e2e8f0; }
.tarjeta-tipo__icono { width: 1rem; height: 1rem; flex: none; margin-top: 0.15rem; color: #67e8f9; }
.tarjeta-tipo__selector { display: flex; width: 1.25rem; height: 1.25rem; flex: none; align-items: center; justify-content: center; border: 2px solid #475569; border-radius: 9999px; transition: all 300ms; }
.tarjeta-tipo__selector--activa { background-color: #00d9e8; border-color: #00d9e8; }
.tarjeta-tipo__punto { width: 0.5rem; height: 0.5rem; border-radius: 9999px; background-color: #041d39; }
</style>
