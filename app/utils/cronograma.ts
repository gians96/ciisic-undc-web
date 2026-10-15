import type { ScheduleDay } from '../data/cronograma'
import { rangoHorario } from './ponencias-especializadas'

export interface SesionPonente {
  /** Ej.: «Martes 27 de octubre». */
  dia: string
  /** Ej.: «9:00 – 10:30 a. m.». */
  hora: string
}

/**
 * Día y hora de cada ponente invitado, tomados del cronograma: la clave es el `name` del
 * ponente (`event.ponente`). Los eventos sin ponente se ignoran. El congreso es en octubre.
 */
export function sesionesDePonentes(schedule: readonly ScheduleDay[]): Map<string, SesionPonente> {
  const sesiones = new Map<string, SesionPonente>()

  for (const day of schedule) {
    for (const event of day.events) {
      if (!event.ponente) continue
      const [inicio, fin] = event.time.split(' - ').map(parte => parte.trim())
      if (!inicio || !fin) continue
      sesiones.set(event.ponente, {
        dia: `${day.short} ${day.dayNumber} de octubre`,
        hora: rangoHorario(inicio, fin),
      })
    }
  }

  return sesiones
}
