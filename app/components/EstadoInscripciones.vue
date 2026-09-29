<template>
  <section class="mx-auto max-w-2xl px-4 py-16 sm:py-20" :aria-busy="estado === 'cargando'">
    <div class="estado-card rounded-2xl p-8 text-center sm:p-10" role="status" aria-live="polite">
      <template v-if="estado === 'cargando'">
        <Icon name="heroicons:arrow-path" class="mx-auto h-10 w-10 animate-spin text-primary-400" aria-hidden="true" />
        <p class="mt-4 text-slate-300">Cargando la información de inscripción…</p>
      </template>

      <template v-else>
        <span
          class="estado-icono mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl"
          :class="estado === 'cerradas' ? 'estado-icono--cerradas' : 'estado-icono--error'"
        >
          <Icon
            :name="estado === 'cerradas' ? 'heroicons:lock-closed' : 'heroicons:exclamation-triangle'"
            class="h-7 w-7"
            aria-hidden="true"
          />
        </span>

        <h2 class="mt-6 text-3xl font-bold text-white">
          {{ estado === 'cerradas' ? 'Inscripciones cerradas' : 'No pudimos cargar la inscripción' }}
        </h2>
        <p class="mt-3 leading-relaxed text-slate-300">
          <template v-if="estado === 'cerradas'">
            Las inscripciones {{ nombreEvento ? `para el ${nombreEvento}` : '' }} no están disponibles en este momento.
            Si tienes dudas, comunícate con la organización.
          </template>
          <template v-else>
            Ocurrió un problema al obtener los planes y los datos de pago. Revisa tu conexión e inténtalo nuevamente.
          </template>
        </p>

        <button v-if="estado === 'error'" type="button" class="accion mt-7" @click="emit('reintentar')">
          <Icon name="heroicons:arrow-path" class="h-5 w-5" aria-hidden="true" />
          Reintentar
        </button>

        <div class="mt-8 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row">
          <a :href="`mailto:${correo}`" class="contacto">
            <Icon name="heroicons:envelope" class="h-4 w-4" aria-hidden="true" />
            {{ correo }}
          </a>
          <a v-if="enlaceTelefono" :href="enlaceTelefono" target="_blank" rel="noopener noreferrer" class="contacto">
            <Icon name="heroicons:chat-bubble-left-right" class="h-4 w-4" aria-hidden="true" />
            {{ telefono }}
          </a>
        </div>

        <NuxtLink to="/" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-300 hover:text-white">
          <Icon name="heroicons:arrow-left" class="h-4 w-4" aria-hidden="true" />
          Volver al inicio
        </NuxtLink>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { enlaceWhatsApp } from '~/utils/formato'

defineProps<{
  estado: 'cargando' | 'error' | 'cerradas'
}>()

const emit = defineEmits<{
  (e: 'reintentar'): void
}>()

const { evento, contacto } = useEvento()

// Contacto del evento (con el de la organización como respaldo si el evento no cargó)
const nombreEvento = computed(() => evento.value?.nombreCorto || '')
const correo = computed(() => contacto.value?.correo || 'congreso@undc.edu.pe')
const telefono = computed(() => contacto.value?.telefono || '+51 949 026 908')
const enlaceTelefono = computed(() => enlaceWhatsApp(telefono.value))
</script>

<style scoped>
.estado-card {
  background: #082c52;
  border: 1px solid #ffffff1c;
}

.estado-icono--cerradas {
  background: rgba(251, 191, 36, 0.12);
  color: #fcd34d;
}

.estado-icono--error {
  background: rgba(248, 113, 113, 0.12);
  color: #fca5a5;
}

.accion {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid rgba(34, 211, 238, 0.5);
  border-radius: 0.75rem;
  padding: 0.75rem 1.25rem;
  color: #67e8f9;
  font-weight: 600;
  transition: background-color 0.2s;
}

.accion:hover {
  background: rgba(34, 211, 238, 0.1);
}

.contacto {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 0.5rem 0.875rem;
  color: #93c5fd;
  transition: border-color 0.2s, background-color 0.2s;
}

.contacto:hover {
  border-color: #60a5fa;
  background: #0f2744;
}

.accion:focus-visible,
.contacto:focus-visible {
  outline: 2px solid #22d3ee;
  outline-offset: 3px;
}
</style>
