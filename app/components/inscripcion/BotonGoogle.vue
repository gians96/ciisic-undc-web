<!-- ============================================================================
     BOTÓN «CONTINUAR CON GOOGLE» (Google Identity Services)
     Solo cliente: InscripcionCorreoGoogle lo monta dentro de <ClientOnly> y reserva su altura.
     Emite la credencial (ID token) que entrega Google al elegir una cuenta.
     ============================================================================ -->

<template>
  <div class="boton-google">
    <div v-if="estado === 'cargando'" class="boton-google__marcador" aria-hidden="true" />
    <div ref="contenedor" class="boton-google__gis" />
    <p v-if="estado === 'no_disponible'" class="boton-google__aviso">
      <Icon name="heroicons:exclamation-triangle" class="boton-google__icono" aria-hidden="true" />
      No pudimos cargar el botón de Google; puedes escribir tu correo.
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  clientId: string
}>()

const emit = defineEmits<{
  credencial: [credencial: string]
}>()

const contenedor = ref<HTMLElement | null>(null)
const { estado, mostrarBoton } = useGoogleIdentity()

const alRecibirCredencial = (credencial: string) => emit('credencial', credencial)

const dibujar = () => {
  if (contenedor.value && props.clientId) mostrarBoton(contenedor.value, props.clientId, alRecibirCredencial)
}

onMounted(dibujar)
watch(() => props.clientId, dibujar)
</script>

<style scoped>
.boton-google {
  position: relative;
  height: 100%;
}

/* Mientras carga el script se mantiene la píldora del marcador del SSR */
.boton-google__marcador {
  position: absolute;
  inset: 0 auto 0 0;
  width: min(100%, 400px);
  border: 1px solid #334155;
  border-radius: 9999px;
  background-color: #1e293b;
}

.boton-google__gis {
  position: relative;
  width: 100%;
}

.boton-google__aviso {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
  color: #fde68a;
  font-size: 0.75rem;
  line-height: 1rem;
}

.boton-google__icono {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}
</style>
