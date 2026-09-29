// ============================================================================
// CATÁLOGOS DEL SITIO (GET /api/publico/catalogos) — funciones puras
// ============================================================================
import type { ClasificacionCatalogo } from '../types/evento'

export interface OpcionClasificacion {
  id: number
  etiqueta: string
}

/** `ESTUDIANTE - IV CICLO` → `IV CICLO` (el formulario ya es de estudiantes). */
export function etiquetaClasificacion(nombre: string | null | undefined): string {
  const texto = String(nombre ?? '').replace(/\s+/g, ' ').trim()
  return texto.replace(/^ESTUDIANTE\s*-\s*/i, '') || texto
}

/** Clasificaciones válidas del catálogo como opciones del selector de ciclo. */
export function mapearClasificaciones(lista: ClasificacionCatalogo[] | null | undefined): OpcionClasificacion[] {
  if (!Array.isArray(lista)) return []
  return lista
    .filter(item => Number.isInteger(Number(item?.id)) && Number(item.id) > 0 && String(item?.nombre ?? '').trim() !== '')
    .map(item => ({ id: Number(item.id), etiqueta: etiquetaClasificacion(item.nombre) }))
}
