<!-- ============================================================================
     VERIFICACIÓN OPCIONAL DEL CORREO CON GOOGLE (junto al campo de correo)
     Solo aparece si la configuración del sitio trae client ID. El SSR reserva la altura del botón
     con un marcador y el botón se monta en el cliente dentro de <ClientOnly> (sin saltos de
     diseño). El estado se anuncia en un chip aria-live con la acción «Usar otro correo».
     ============================================================================ -->

<template>
  <div v-if="clientId" class="correo-google">
    <template v-if="estado !== 'verificado'">
      <p class="correo-google__ayuda">{{ AYUDA_CORREO_GOOGLE }}</p>
      <div class="correo-google__boton">
        <ClientOnly>
          <InscripcionBotonGoogle :client-id="clientId" @credencial="emit('credencial', $event)" />
          <template #fallback>
            <div class="correo-google__marcador" aria-hidden="true" />
          </template>
        </ClientOnly>
      </div>
    </template>

    <!-- Estado de la verificación (se anuncia a lectores de pantalla) -->
    <div aria-live="polite">
      <p v-if="mensaje" class="correo-google__chip" :class="`correo-google__chip--${mensaje.tono}`">
        <Icon
          :name="icono"
          class="correo-google__icono"
          :class="{ 'animate-spin': estado === 'verificando' }"
          aria-hidden="true"
        />
        <span>{{ mensaje.texto }}</span>
        <button v-if="estado === 'verificado'" type="button" class="correo-google__accion" @click="usarOtroCorreo">
          Usar otro correo
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AYUDA_CORREO_GOOGLE, type EstadoCorreoGoogle, type MensajeCorreoGoogle } from '~/utils/google'

const props = defineProps<{
  /** Client ID de la configuración del sitio; sin él no se muestra nada. */
  clientId: string | null
  estado: EstadoCorreoGoogle
  mensaje: MensajeCorreoGoogle | null
  /** `id` del campo de correo, para devolverle el foco. */
  campoCorreo?: string
}>()

const emit = defineEmits<{
  credencial: [credencial: string]
  descartar: []
}>()

const icono = computed(() => {
  if (props.estado === 'verificando') return 'heroicons:arrow-path'
  if (props.estado === 'verificado') return 'heroicons:check-badge'
  return 'heroicons:exclamation-triangle'
})

const enfocarCorreo = () => {
  if (props.campoCorreo) document.getElementById(props.campoCorreo)?.focus()
}

// «Usar otro correo»: descarta el token, desbloquea el correo y le devuelve el foco
const usarOtroCorreo = async () => {
  emit('descartar')
  await nextTick()
  enfocarCorreo()
}

// Al verificar desaparece el botón de Google; si tenía el foco, este pasa al correo (ya fijado)
watch(() => props.estado, async (estado) => {
  if (estado !== 'verificado') return
  const enfocado = document.activeElement
  await nextTick()
  if (!enfocado || enfocado === document.body || !enfocado.isConnected) enfocarCorreo()
})
</script>

<style scoped>
.correo-google {
  margin-top: 0.75rem;
}

.correo-google__ayuda {
  margin-bottom: 0.5rem;
  color: #94a3b8;
  font-size: 0.75rem;
  line-height: 1rem;
}

/* Altura del botón «large» de Google: el marcador del SSR y el botón ocupan lo mismo */
.correo-google__boton {
  height: 40px;
}

.correo-google__marcador {
  width: min(100%, 400px);
  height: 100%;
  border: 1px solid #334155;
  border-radius: 9999px;
  background-color: #1e293b;
}

.correo-google__chip {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  background-color: rgba(30, 41, 59, 0.6);
  color: #cbd5e1;
  font-size: 0.75rem;
  line-height: 1.1rem;
}

.correo-google__chip--exito {
  border-color: rgba(0, 217, 232, 0.5);
  background-color: rgba(0, 217, 232, 0.08);
  color: #a5f3fc;
}

.correo-google__chip--aviso {
  border-color: rgba(251, 191, 36, 0.5);
  background-color: rgba(251, 191, 36, 0.08);
  color: #fde68a;
}

.correo-google__icono {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.05rem;
}

.correo-google__accion {
  margin-left: auto;
  padding: 0 0.25rem;
  border-radius: 0.25rem;
  color: inherit;
  font-weight: 600;
  text-decoration: underline;
  white-space: nowrap;
}

.correo-google__accion:focus-visible {
  outline: 2px solid #00d9e8;
  outline-offset: 2px;
}
</style>
