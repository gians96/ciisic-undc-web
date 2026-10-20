export type EstadoInscripcionEgresados = 'proximamente' | 'abierta' | 'cerrada'

export interface ConfiguracionInscripcionEgresados {
  url: string | null
  cierre: string | null
  cierreValido: boolean
}

/** Único formulario aprobado para el Encuentro de Egresados 2026. */
export const URL_FORMULARIO_OFICIAL_EGRESADOS = 'https://forms.gle/BxEHiBNkGf69LdEc7'

/** La fecha de cierre debe declarar expresamente el offset de Lima. */
export function cierreInscripcionEgresadosValido(valor: unknown): string | null {
  if (typeof valor !== 'string' || !valor.trim()) return null
  const cierre = valor.trim()
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?-05:00$/.test(cierre)) return null
  return Number.isNaN(Date.parse(cierre)) ? null : cierre
}

export function normalizarConfiguracionInscripcionEgresados(
  config: Record<string, unknown>,
): ConfiguracionInscripcionEgresados {
  const cierreOriginal = typeof config.alumniRegistrationDeadline === 'string'
    ? config.alumniRegistrationDeadline.trim()
    : ''
  const cierre = cierreInscripcionEgresadosValido(cierreOriginal)

  return {
    // El enlace es parte de esta versión del evento: una variable heredada no debe reemplazarlo.
    url: URL_FORMULARIO_OFICIAL_EGRESADOS,
    cierre,
    cierreValido: Boolean(cierre),
  }
}

export function estadoInscripcionEgresados(
  configuracion: ConfiguracionInscripcionEgresados,
  ahora = Date.now(),
): EstadoInscripcionEgresados {
  if (configuracion.cierre && ahora >= Date.parse(configuracion.cierre)) return 'cerrada'
  if (!configuracion.cierreValido || !configuracion.url) return 'proximamente'
  return 'abierta'
}

const MAXIMA_DEMORA_TEMPORIZADOR = 2_147_483_647

/** Devuelve la demora exacta hasta el corte o `null` si ya venció/no es válido. */
export function demoraHastaCierreInscripcionEgresados(
  cierre: string | null,
  ahora = Date.now(),
): number | null {
  if (!cierre) return null
  const instanteCierre = Date.parse(cierre)
  if (Number.isNaN(instanteCierre)) return null

  const restante = instanteCierre - ahora
  if (restante <= 0) return null
  return Math.min(restante, MAXIMA_DEMORA_TEMPORIZADOR)
}

export function formatearCierreInscripcionEgresados(cierre: string | null): string {
  if (!cierre) return 'No disponible'

  // El corte es exclusivo a medianoche: el último minuto disponible pertenece al día anterior.
  const ultimoMinutoDisponible = new Date(Date.parse(cierre) - 60_000)
  const fecha = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(ultimoMinutoDisponible)
  const hora = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(ultimoMinutoDisponible).replace(/\s+/g, ' ')

  return `${fecha} · ${hora}`
}
