// ============================================================================
// CREDENCIAL 3D POR CÓDIGO (BFF /api/publico/credencial/:codigo → backend /api/v1/site/credential/:codigo)
// Funciones puras. Contrato: backend-ciisic/specs/020-credencial-enlace-correo/contracts/api-credencial.md
// ============================================================================
import { tecnologiaPorId, type Tecnologia } from '../data/tecnologias'
import type { ApiErrorShape } from '../composables/useApi'

/** `data` del backend (spec 020): exactamente lo que se imprime en la credencial. */
export interface DatosCredencial {
  nombres: string
  apellidos: string
  codigo: string
  clasificacion: string | null
  tipo: { nombre: string, etiqueta: string } | null
  evento: { nombre: string, nombreCorto: string }
}

/** Mismo formato que `codigo_credencial` del backend: 10 caracteres en mayúsculas. */
export const REGEX_CODIGO_CREDENCIAL = /^[0-9A-Z]{10}$/

export function esCodigoCredencial(codigo: unknown): boolean {
  return typeof codigo === 'string' && REGEX_CODIGO_CREDENCIAL.test(codigo.trim().toUpperCase())
}

const limpiar = (valor: string | null | undefined) => String(valor ?? '').replace(/\s+/g, ' ').trim()

export function nombreCompleto(datos: Pick<DatosCredencial, 'nombres' | 'apellidos'>): string {
  return limpiar(`${limpiar(datos.nombres)} ${limpiar(datos.apellidos)}`)
}

/** «Rol» de la credencial: clasificación del estudiante, tipo de inscripción o Asistente. */
export function rolDeCredencial(datos: Pick<DatosCredencial, 'clasificacion' | 'tipo'>): string {
  return limpiar(datos.clasificacion) || limpiar(datos.tipo?.nombre) || 'Asistente'
}

/** Mensaje para la página cuando la credencial no se pudo cargar. */
export function mensajeCredencial(error: Pick<ApiErrorShape, 'statusCode' | 'code'>): string {
  if (error.code === 'INVALID_CODE' || error.statusCode === 422) {
    return 'El enlace de la credencial no es válido. Revisa el correo de aprobación.'
  }
  if (error.code === 'CREDENTIAL_NOT_FOUND' || error.statusCode === 404) {
    return 'No encontramos una credencial con ese código. Solo las inscripciones aprobadas tienen credencial.'
  }
  if (error.code === 'NETWORK_ERROR' || error.statusCode === 0) {
    return 'No pudimos conectar para cargar tu credencial. Intenta de nuevo en unos minutos.'
  }
  return 'No pudimos cargar la credencial en este momento. Intenta de nuevo en unos minutos.'
}

// ─── Tecnologías elegidas (solo en este dispositivo) ────────────────────────

const PREFIJO_CLAVE = 'credencial:'

export function claveDeTecnologias(codigo: string): string {
  return `${PREFIJO_CLAVE}${limpiar(codigo).toUpperCase()}`
}

/** Ids guardados que siguen en el catálogo (una versión vieja puede dejar ids huérfanos). */
export function tecnologiasGuardadas(
  codigo: string,
  almacen: Pick<Storage, 'getItem'> | null | undefined,
): string[] {
  if (!almacen) return []
  try {
    const bruto = almacen.getItem(claveDeTecnologias(codigo))
    const ids: unknown = bruto ? JSON.parse(bruto) : []
    if (!Array.isArray(ids)) return []
    return ids.filter((id): id is string => typeof id === 'string' && tecnologiaPorId(id) !== undefined)
  } catch {
    return []
  }
}

export function guardarTecnologias(
  codigo: string,
  ids: string[],
  almacen: Pick<Storage, 'setItem'> | null | undefined,
): void {
  if (!almacen) return
  try {
    almacen.setItem(claveDeTecnologias(codigo), JSON.stringify(ids.filter(id => tecnologiaPorId(id) !== undefined)))
  } catch {
    // Sin almacenamiento (modo privado): la selección vive en la sesión de la pestaña.
  }
}

/** Catálogo para el editor, con las elegidas en el orden elegido. */
export function tecnologiasDe(ids: string[]): Tecnologia[] {
  return ids.map(id => tecnologiaPorId(id)).filter((tech): tech is Tecnologia => tech !== undefined)
}
