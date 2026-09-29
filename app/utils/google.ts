// ============================================================================
// VERIFICACIÓN OPCIONAL DEL CORREO CON GOOGLE EN LA INSCRIPCIÓN: MENSAJES Y REGLAS (sin Vue)
// Contrato: backend POST /api/v1/site/google-verification (vía /api/publico/verificacion-google),
// resumen en specs/001-landing-multi-evento/contracts/bff-landing.md
// ============================================================================
import type { ApiErrorShape } from '../composables/useApi'
import type { TipoCuentaCorreo, VerificacionCorreoGoogle } from '../types/evento'
import { mensajeErrorGoogle } from './errores-api'
import { esCorreoValido } from './verificacion'

export type EstadoCorreoGoogle = 'inactivo' | 'verificando' | 'verificado' | 'error'

/** Lo que la landing usa de la verificación (el token va aparte y solo en memoria). */
export interface DatosCorreoGoogle {
  correo: string
  nombres: string | null
  apellidos: string | null
  tipoCuenta: TipoCuentaCorreo
  esInstitucional: boolean
}

export interface MensajeCorreoGoogle {
  tono: 'exito' | 'info' | 'aviso'
  texto: string
}

export const AYUDA_CORREO_GOOGLE = 'Opcional: verifica tu correo con Google (recomendado para cuentas @undc.edu.pe)'
export const MENSAJE_VERIFICANDO_GOOGLE = 'Verificando tu correo con Google…'

const MENSAJES_TIPO_CUENTA: Record<TipoCuentaCorreo, string> = {
  ESTUDIANTE: 'Estudiante UNDC — tu correo institucional quedó verificado',
  PERSONAL: 'Personal UNDC verificado',
  EXTERNO: 'Correo verificado con Google',
}

const esTipoCuenta = (valor: unknown): valor is TipoCuentaCorreo =>
  typeof valor === 'string' && Object.prototype.hasOwnProperty.call(MENSAJES_TIPO_CUENTA, valor)

/** Mensaje del chip para el tipo de cuenta (un tipo desconocido se trata como externo). */
export function mensajeTipoCuenta(tipoCuenta: string | null | undefined): string {
  return MENSAJES_TIPO_CUENTA[esTipoCuenta(tipoCuenta) ? tipoCuenta : 'EXTERNO']
}

/** Mensaje del chip para cada estado (`null` = no se muestra nada). */
export function mensajeCorreoGoogle(
  estado: EstadoCorreoGoogle,
  detalle: { tipoCuenta?: string | null, falla?: Pick<ApiErrorShape, 'statusCode' | 'code'> | null } = {},
): MensajeCorreoGoogle | null {
  switch (estado) {
    case 'verificando':
      return { tono: 'info', texto: MENSAJE_VERIFICANDO_GOOGLE }
    case 'verificado':
      return { tono: 'exito', texto: mensajeTipoCuenta(detalle.tipoCuenta) }
    case 'error':
      return { tono: 'aviso', texto: mensajeErrorGoogle(detalle.falla ?? { statusCode: 500, code: 'REQUEST_ERROR' }) }
    default:
      return null
  }
}

const limpiar = (valor: unknown) => (typeof valor === 'string' ? valor.replace(/\s+/g, ' ').trim() : '')

/**
 * Respuesta de `google-verification` → datos y token. `null` si falta lo indispensable (correo
 * válido y token): una respuesta incompleta nunca deja el correo como verificado.
 */
export function mapearVerificacionGoogle(
  respuesta: Partial<VerificacionCorreoGoogle> | null | undefined,
): { datos: DatosCorreoGoogle, token: string } | null {
  const correo = limpiar(respuesta?.correo).toLowerCase()
  const token = limpiar(respuesta?.verificacionCorreoToken)
  if (!esCorreoValido(correo) || !token) return null
  const tipoCuenta = esTipoCuenta(respuesta?.tipoCuenta) ? respuesta.tipoCuenta : 'EXTERNO'
  return {
    datos: {
      correo,
      nombres: limpiar(respuesta?.nombres) || null,
      apellidos: limpiar(respuesta?.apellidos) || null,
      tipoCuenta,
      esInstitucional: respuesta?.esInstitucional === true,
    },
    token,
  }
}

/**
 * Nombres y apellidos que se completan con los de Google (`null` = no tocar el campo): cada campo
 * solo si está vacío y nunca si los nombres vinieron de la consulta de DNI (RENIEC manda).
 */
export function nombresDesdeGoogle(
  actual: { nombres: string, apellidos: string, desdeDni: boolean },
  google: Pick<DatosCorreoGoogle, 'nombres' | 'apellidos'>,
): { nombres: string | null, apellidos: string | null } {
  if (actual.desdeDni) return { nombres: null, apellidos: null }
  const nombres = limpiar(google.nombres)
  const apellidos = limpiar(google.apellidos)
  return {
    nombres: !actual.nombres.trim() && nombres ? nombres : null,
    apellidos: !actual.apellidos.trim() && apellidos ? apellidos : null,
  }
}

/**
 * `verificacionCorreoToken` que acompaña a la inscripción: solo mientras el correo siga bloqueado y
 * el del formulario sea el verificado; en cualquier otro caso no se envía.
 */
export function tokenCorreoParaEnvio(entrada: {
  bloqueado: boolean
  token: string | null | undefined
  correoVerificado: string | null | undefined
  correoFormulario: string | null | undefined
}): string | null {
  const token = String(entrada.token ?? '').trim()
  const verificado = String(entrada.correoVerificado ?? '').trim().toLowerCase()
  const formulario = String(entrada.correoFormulario ?? '').trim().toLowerCase()
  return entrada.bloqueado && token && verificado && verificado === formulario ? token : null
}
