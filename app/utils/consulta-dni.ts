// ============================================================================
// CONSULTA DE DNI (GET /api/v1/public/document-lookup/dni/:numero) — funciones puras
// Contrato: backend-ciisic/specs/003-consultas-dni/contracts/api-consultas.md
// ============================================================================
import type { ApiErrorShape } from '../composables/useApi'
import type { ConsultaDni } from '../types/evento'

export interface NombresConsultados {
  nombres: string
  apellidos: string
}

const limpiar = (valor: string | null | undefined) => String(valor ?? '').replace(/\s+/g, ' ').trim()

/** Respuesta del backend → nombres y apellidos; `null` si no trae datos personales completos. */
export function mapearConsultaDni(datos: Partial<ConsultaDni> | null | undefined): NombresConsultados | null {
  const nombres = limpiar(datos?.nombres)
  const apellidos = limpiar(datos?.apellidos) || limpiar(`${datos?.apellidoPaterno ?? ''} ${datos?.apellidoMaterno ?? ''}`)
  return nombres && apellidos ? { nombres, apellidos } : null
}

const MANUAL = 'Ingresa tus nombres y apellidos manualmente.'

/** Mensaje para una consulta fallida; en todos los casos el usuario puede escribir sus datos. */
export function mensajeFallaConsultaDni(error: Pick<ApiErrorShape, 'statusCode' | 'code'>, numero = ''): string {
  if (error.code === 'DOCUMENT_NOT_FOUND' || error.statusCode === 404) {
    return `No encontramos datos para ${numero ? `el DNI ${numero}` : 'ese DNI'}. ${MANUAL}`
  }
  if (error.code === 'LOOKUP_UNAVAILABLE' || error.statusCode === 503) {
    return `La consulta de DNI no está disponible en este momento. ${MANUAL}`
  }
  if (error.code === 'RATE_LIMITED' || error.statusCode === 429) {
    return 'Hiciste varias consultas seguidas. Espera un minuto o ingresa tus nombres y apellidos manualmente.'
  }
  if (error.code === 'INVALID_DNI' || error.statusCode === 422) return 'El DNI debe tener 8 dígitos numéricos.'
  if (error.code === 'NETWORK_ERROR') return `No pudimos conectar con el servidor para consultar el DNI. ${MANUAL}`
  return `No pudimos consultar el DNI. ${MANUAL}`
}
