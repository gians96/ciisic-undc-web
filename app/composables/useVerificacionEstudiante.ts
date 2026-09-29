// ============================================================================
// VERIFICACIÓN DE ESTUDIANTE UNDC (POST /api/v1/public/events/:codigo/student-verification)
// Se lanza con DNI de 8 dígitos y correo válido; se repite al cambiar DNI o correo.
// ============================================================================
import type { Ref } from 'vue'
import type { ApiExito, VerificacionEstudiante } from '~/types/evento'
import { rutasApiPublica } from '~/utils/api-publica'
import {
  crearCoordinadorVerificacion,
  esCorreoValido,
  mensajeEstadoVerificacion,
  puedeVerificarEstudiante,
  type EstadoVerificacion,
} from '~/utils/verificacion'

interface EntradaVerificacion {
  correo: Ref<string>
  tipoDocumento: Ref<'DNI' | 'CE'>
  numeroDocumento: Ref<string>
  /** Dominio institucional del evento (para el mensaje de correo no institucional). */
  dominio: Ref<string | null | undefined>
}

export const useVerificacionEstudiante = (entrada: EntradaVerificacion) => {
  const { request } = useApi()
  const codigoEvento = useEventoCodigo()

  const estado = ref<EstadoVerificacion>('inactivo')
  const resultado = ref<VerificacionEstudiante | null>(null)
  const codigoFalla = ref<string | null>(null)

  const correo = computed(() => entrada.correo.value.trim().toLowerCase())
  const numeroDocumento = computed(() => entrada.numeroDocumento.value.trim())

  const coordinador = crearCoordinadorVerificacion<VerificacionEstudiante>({
    esperaMs: 600,
    consultar: (solicitud, senal) =>
      request<ApiExito<VerificacionEstudiante>>(rutasApiPublica.verificacionEstudiante(codigoEvento), {
        method: 'POST',
        body: solicitud,
        signal: senal,
        timeout: 20000,
      }).then(respuesta => respuesta.data),
    alResultado: (datos) => {
      resultado.value = datos
      // Solo cuenta como verificado si además llegó el token firmado
      estado.value = datos?.esEstudianteUndc === true && Boolean(datos.verificacionToken) ? 'verificado' : 'no_verificado'
    },
    alFallar: (error) => {
      codigoFalla.value = normalizeApiError(error).code
      estado.value = 'error'
    },
  })

  /** Descarta el resultado anterior (vuelve el precio regular) y verifica los datos actuales. */
  const verificar = (inmediato = false) => {
    resultado.value = null
    codigoFalla.value = null

    if (entrada.tipoDocumento.value !== 'DNI') {
      coordinador.cancelar()
      // Con CE el backend respondería DOCUMENTO_NO_SOPORTADO: se informa sin llamar a la API
      estado.value = esCorreoValido(correo.value) ? 'no_soportado' : 'inactivo'
      return
    }
    if (!puedeVerificarEstudiante('DNI', numeroDocumento.value, correo.value)) {
      coordinador.cancelar()
      estado.value = 'inactivo'
      return
    }

    estado.value = 'verificando'
    coordinador.programar({ correo: correo.value, tipoDocumento: 'dni', numeroDocumento: numeroDocumento.value }, inmediato)
  }

  watch([correo, entrada.tipoDocumento, numeroDocumento], () => verificar())
  onScopeDispose(() => coordinador.cancelar())

  const esEstudianteUndc = computed(() => estado.value === 'verificado')

  return {
    estado: readonly(estado),
    esEstudianteUndc,
    verificacionToken: computed(() => (esEstudianteUndc.value ? resultado.value?.verificacionToken ?? null : null)),
    mensaje: computed(() => mensajeEstadoVerificacion(estado.value, {
      motivo: resultado.value?.motivo,
      codigoFalla: codigoFalla.value,
      dominio: entrada.dominio.value,
    })),
    reintentar: () => verificar(true),
  }
}
