// ============================================================================
// AFORO DE LAS PONENCIAS ESPECIALIZADAS CON EL ENLACE PÚBLICO (funciones puras)
// Página /aforo-ponencias#<token> (spec 012) → BFF /api/publico/ponencias-especializadas/aforo →
// backend GET /api/v1/site/specialized-talk-occupancy (spec 036). El backend da las cifras; aquí solo se presentan.
// ============================================================================
import type { PersonaAforo, PonenciaAforo } from '../types/ponencias-especializadas'

/** Desde este porcentaje de ocupación un tema se muestra «casi lleno». */
export const UMBRAL_CASI_LLENO = 0.8

/** Token del enlace tras el `#` (43 caracteres base64url, como los emite el backend); `null` si falta o no tiene esa forma. */
export function tokenDelHash(hash: string | null | undefined): string | null {
  const token = String(hash ?? '').trim().replace(/^#/, '').trim()
  return /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null
}

export type NivelOcupacion = 'sin-limite' | 'libre' | 'casi-lleno' | 'lleno'

type Cifras = Pick<PonenciaAforo, 'cupo' | 'inscritos'>

export function nivelOcupacion({ cupo, inscritos }: Cifras): NivelOcupacion {
  if (cupo === null) return 'sin-limite'
  if (inscritos >= cupo) return 'lleno'
  return inscritos / cupo >= UMBRAL_CASI_LLENO ? 'casi-lleno' : 'libre'
}

/** Ancho de la barra (0–100, entero); sin aforo no hay barra. */
export function porcentajeOcupacion({ cupo, inscritos }: Cifras): number | null {
  if (cupo === null || cupo <= 0) return null
  return Math.min(100, Math.round((inscritos / cupo) * 100))
}

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`

/** «14 de 20 inscritos» o, sin aforo, «14 inscritos». */
export function textoInscritos({ cupo, inscritos }: Cifras): string {
  if (cupo === null) return plural(inscritos, 'inscrito', 'inscritos')
  return `${inscritos} de ${cupo} ${cupo === 1 ? 'inscrito' : 'inscritos'}`
}

/** «6 cupos libres», «1 cupo libre», «Lleno» o «Sin límite de aforo». */
export function textoCuposLibres(ponencia: Pick<PonenciaAforo, 'cupo' | 'inscritos' | 'cuposDisponibles'>): string {
  const nivel = nivelOcupacion(ponencia)
  if (nivel === 'sin-limite') return 'Sin límite de aforo'
  if (nivel === 'lleno') return 'Lleno'
  const libres = ponencia.cuposDisponibles ?? Math.max(0, (ponencia.cupo ?? 0) - ponencia.inscritos)
  return plural(libres, 'cupo libre', 'cupos libres')
}

/** Asistencia marcada en la puerta: «9 asistieron», «1 asistió» o «Aún sin registros». */
export function textoAsistencia({ asistentes }: Pick<PonenciaAforo, 'asistentes'>): string {
  if (asistentes <= 0) return 'Aún sin registros'
  return asistentes === 1 ? '1 asistió' : `${asistentes} asistieron`
}

/** «14 presenciales · 3 virtuales», «1 presencial» o «2 virtuales»: el resumen de la lista de inscritos de un tema. */
export function resumenDeInscritos(personas: readonly Pick<PersonaAforo, 'modo'>[]): string {
  const virtuales = personas.filter(p => p.modo === 'VIRTUAL').length
  const presenciales = personas.length - virtuales
  const partes = [
    presenciales ? plural(presenciales, 'presencial', 'presenciales') : '',
    virtuales ? plural(virtuales, 'virtual', 'virtuales') : '',
  ].filter(Boolean)
  return partes.join(' · ')
}

/** Hora de Lima del instante ISO: «12:05 p. m.» (la última lectura o la llegada de un inscrito). Vacío si no es una fecha válida. */
export function horaLima(instante: string | null | undefined): string {
  if (!instante) return ''
  const fecha = new Date(instante)
  if (Number.isNaN(fecha.getTime())) return ''
  return new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', hour: 'numeric', minute: '2-digit' }).format(fecha)
}
