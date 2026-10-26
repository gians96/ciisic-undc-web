// ============================================================================
// CREDENCIAL 3D POR CÓDIGO (spec 013; BFF /api/publico/credencial/:codigo → backend /api/v1/site/credential/:codigo)
// Funciones puras. Contrato: backend-ciisic/specs/038-credencial-3d-enlace/contracts/api-credencial.md
// ============================================================================
import { MAXIMO_TECNOLOGIAS, tecnologiaPorId, type Tecnologia } from '../data/tecnologias'
import type { ApiErrorShape } from '../composables/useApi'

/** `data` del backend (spec 038): lo que se imprime en la credencial y las tecnologías elegidas. */
export interface DatosCredencial {
  nombres: string
  apellidos: string
  codigo: string
  clasificacion: string | null
  tipo: { nombre: string, etiqueta: string } | null
  /** Ids del catálogo, en el orden elegido (la primera define el color). Ausente en un backend anterior. */
  tecnologias?: string[]
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
    return 'El enlace de la credencial no es válido. Revisa el correo que recibiste.'
  }
  if (error.code === 'CREDENTIAL_NOT_FOUND' || error.statusCode === 404) {
    return 'No encontramos una credencial con ese código. Solo las inscripciones aprobadas tienen credencial.'
  }
  if (error.code === 'NETWORK_ERROR' || error.statusCode === 0) {
    return 'No pudimos conectar para cargar tu credencial. Intenta de nuevo en unos minutos.'
  }
  return 'No pudimos cargar la credencial en este momento. Intenta de nuevo en unos minutos.'
}

/** Mensaje cuando no se pudieron guardar las tecnologías (la elección sigue en pantalla). */
export function mensajeGuardado(error: Pick<ApiErrorShape, 'statusCode' | 'code'>): string {
  if (error.statusCode === 429) return 'Hiciste muchos cambios seguidos. Espera un momento e inténtalo de nuevo.'
  if (error.code === 'NETWORK_ERROR' || error.statusCode === 0) return 'Sin conexión: tus cambios aún no se guardaron.'
  return 'No pudimos guardar tus cambios.'
}

/** Estado del guardado automático de las tecnologías. */
export type EstadoGuardado = 'inactivo' | 'guardando' | 'guardado' | 'error'

// ─── Tecnologías elegidas ───────────────────────────────────────────────────

/** Ids que siguen en el catálogo (una versión vieja puede dejar ids huérfanos), sin repetir y hasta el máximo. */
export function normalizarSeleccion(ids: unknown): string[] {
  if (!Array.isArray(ids)) return []
  const vistos = new Set<string>()
  for (const id of ids) {
    if (typeof id === 'string' && tecnologiaPorId(id) !== undefined) vistos.add(id)
  }
  return [...vistos].slice(0, MAXIMO_TECNOLOGIAS)
}

/**
 * Agrega o quita una tecnología. Al agregarla pasa al frente (y define el color principal); si ya hay
 * `MAXIMO_TECNOLOGIAS` no entra otra hasta quitar una (`lleno`).
 */
export function alternarTecnologia(actual: readonly string[], id: string): { ids: string[], lleno: boolean } {
  if (tecnologiaPorId(id) === undefined) return { ids: [...actual], lleno: false }
  if (actual.includes(id)) return { ids: actual.filter(elegida => elegida !== id), lleno: false }
  if (actual.length >= MAXIMO_TECNOLOGIAS) return { ids: [...actual], lleno: true }
  return { ids: [id, ...actual], lleno: false }
}

/** Pasa una tecnología ya elegida al frente: es la que da el color a la credencial. */
export function hacerPrincipal(actual: readonly string[], id: string): string[] {
  if (!actual.includes(id)) return [...actual]
  return [id, ...actual.filter(elegida => elegida !== id)]
}

/** Las tecnologías del catálogo para los ids elegidos, en el mismo orden. */
export function tecnologiasDe(ids: readonly string[]): Tecnologia[] {
  return ids.map(id => tecnologiaPorId(id)).filter((tech): tech is Tecnologia => tech !== undefined)
}

/** Si dos listas son iguales en contenido y orden (para no guardar lo que no cambió). */
export function mismaSeleccion(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i])
}

/** Catálogo filtrado por lo que se escribe en el buscador (nombre, sin tildes ni mayúsculas). */
export function filtrarCatalogo(catalogo: readonly Tecnologia[], busqueda: string): Tecnologia[] {
  const sinTildes = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const palabras = sinTildes(busqueda).split(/\s+/).filter(Boolean)
  if (!palabras.length) return [...catalogo]
  return catalogo.filter((tech) => {
    const texto = sinTildes(`${tech.nombre} ${tech.id}`)
    return palabras.every(palabra => texto.includes(palabra))
  })
}

/** Acento de la credencial cuando no se eligió ninguna tecnología (el cian del congreso). */
export const ACENTO_POR_DEFECTO = '#00d9e8'

export function acentoDe(ids: readonly string[]): string {
  return tecnologiasDe(ids)[0]?.color ?? ACENTO_POR_DEFECTO
}
