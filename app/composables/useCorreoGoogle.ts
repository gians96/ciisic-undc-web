// ============================================================================
// VERIFICACIÓN OPCIONAL DEL CORREO CON GOOGLE (BFF POST /api/publico/verificacion-google →
// backend POST /api/v1/site/google-verification)
// Estados: inactivo | verificando | verificado | error. El verificacionCorreoToken vive solo en
// memoria (ni almacenamiento del navegador ni payload de SSR) y descartar() lo borra.
// ============================================================================
import type { ApiErrorShape } from '~/composables/useApi'
import type { ApiExito, VerificacionCorreoGoogle } from '~/types/evento'
import {
  mapearVerificacionGoogle,
  mensajeCorreoGoogle,
  type DatosCorreoGoogle,
  type EstadoCorreoGoogle,
} from '~/utils/google'
import { rutasSitio } from '~/utils/rutas-sitio'

interface OpcionesCorreoGoogle {
  /** Se llama cuando el backend confirma el correo (solo para la verificación vigente). */
  alVerificar?: (datos: DatosCorreoGoogle) => void
}

export const useCorreoGoogle = (opciones: OpcionesCorreoGoogle = {}) => {
  const { request } = useApi()

  const estado = ref<EstadoCorreoGoogle>('inactivo')
  const datos = shallowRef<DatosCorreoGoogle | null>(null)
  const token = shallowRef<string | null>(null)
  const falla = shallowRef<Pick<ApiErrorShape, 'statusCode' | 'code'> | null>(null)

  let secuencia = 0
  let controlador: AbortController | null = null

  /** Invalida la verificación en curso: su respuesta, si llega, se ignora. */
  const cancelarEnCurso = () => {
    secuencia++
    controlador?.abort()
    controlador = null
  }

  const olvidar = () => {
    datos.value = null
    token.value = null
    falla.value = null
  }

  /** Envía la credencial de Google al BFF; solo cuenta la respuesta de la última verificación. */
  const verificar = async (credencial: string) => {
    cancelarEnCurso()
    const actual = secuencia
    const propio = new AbortController()
    controlador = propio
    olvidar()
    estado.value = 'verificando'

    try {
      const respuesta = await request<ApiExito<VerificacionCorreoGoogle>>(rutasSitio.verificacionGoogle, {
        method: 'POST',
        body: { credential: credencial },
        signal: propio.signal,
        timeout: 20000,
      })
      if (actual !== secuencia) return
      const resultado = mapearVerificacionGoogle(respuesta?.data)
      if (!resultado) throw new Error('Respuesta de verificación con formato inválido')
      datos.value = resultado.datos
      token.value = resultado.token
      estado.value = 'verificado'
      opciones.alVerificar?.(resultado.datos)
    } catch (error) {
      if (actual !== secuencia) return
      const { statusCode, code } = normalizeApiError(error)
      falla.value = { statusCode, code }
      estado.value = 'error'
    } finally {
      if (controlador === propio) controlador = null
    }
  }

  /** Olvida la verificación y el token: el correo vuelve a ser editable y ya no se envía el token. */
  const descartar = () => {
    cancelarEnCurso()
    olvidar()
    estado.value = 'inactivo'
  }

  onScopeDispose(cancelarEnCurso)

  return {
    estado: readonly(estado),
    datos: computed(() => datos.value),
    /** verificacionCorreoToken (solo en memoria). */
    token: computed(() => token.value),
    mensaje: computed(() => mensajeCorreoGoogle(estado.value, { tipoCuenta: datos.value?.tipoCuenta, falla: falla.value })),
    verificar,
    descartar,
  }
}
