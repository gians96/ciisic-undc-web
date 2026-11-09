// ============================================================================
// ESTADO DE LAS INSCRIPCIONES SEGÚN LA API DEL EVENTO
// (GET /api/publico/evento → `inscripciones` y `fechaFin`). Lógica pura y probada.
// ============================================================================
import type { EventoPublico } from '../types/evento'

/**
 * - `abiertas`: la API las marca abiertas (interruptor del panel y ventana de fechas).
 * - `finalizadas`: están cerradas y ya pasó el fin de la ventana de inscripciones o, si la API no
 *   define uno, el último día del evento.
 * - `cerradas`: están cerradas por otro motivo (interruptor manual con la ventana vigente, etc.).
 */
export type EstadoInscripciones = 'abiertas' | 'finalizadas' | 'cerradas'

/** Último instante del día de una fecha `YYYY-MM-DD` del evento, en hora de Lima (UTC-5). */
function finDelDiaLima(fecha: string): number {
  return Date.parse(`${fecha}T23:59:59.999-05:00`)
}

/**
 * Decide qué estado de inscripciones informa la API en el instante `ahora` (ms desde epoch).
 * Con la API sin datos de fecha válidos nunca afirma «finalizadas»: queda en `cerradas`.
 */
export function estadoInscripciones(
  evento: Pick<EventoPublico, 'inscripciones' | 'fechaFin'>,
  ahora: number,
): EstadoInscripciones {
  const ventana = evento.inscripciones
  if (ventana?.abiertas === true) return 'abiertas'

  const finVentana = ventana?.fin ? Date.parse(ventana.fin) : Number.NaN
  if (!Number.isNaN(finVentana)) return finVentana <= ahora ? 'finalizadas' : 'cerradas'

  // La API no define fin de ventana: se considera finalizada cuando el evento ya terminó.
  const finEvento = evento.fechaFin ? finDelDiaLima(evento.fechaFin) : Number.NaN
  return !Number.isNaN(finEvento) && finEvento <= ahora ? 'finalizadas' : 'cerradas'
}
