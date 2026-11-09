import { describe, expect, it } from 'vitest'
import { estadoInscripciones } from '../app/utils/inscripciones'

// 9-nov-2026, 09:00 en Lima
const AHORA = Date.parse('2026-11-09T14:00:00.000Z')

function evento(
  inscripciones: { abiertas: boolean; inicio?: string | null; fin?: string | null },
  fechaFin = '2026-10-30',
) {
  return { inscripciones: { inicio: null, fin: null, ...inscripciones }, fechaFin }
}

describe('estadoInscripciones', () => {
  it('abiertas cuando la API las marca abiertas', () => {
    expect(estadoInscripciones(evento({ abiertas: true }), AHORA)).toBe('abiertas')
  })

  it('abiertas aunque el evento ya haya terminado: manda la API', () => {
    expect(estadoInscripciones(evento({ abiertas: true, fin: '2026-11-02T04:59:00.000Z' }), AHORA)).toBe('abiertas')
  })

  it('finalizadas cuando están cerradas y ya pasó el fin de la ventana (el caso del VIII)', () => {
    const vigenteEnLaApi = evento({ abiertas: false, inicio: null, fin: '2026-11-02T04:59:00.000Z' })
    expect(estadoInscripciones(vigenteEnLaApi, AHORA)).toBe('finalizadas')
  })

  it('cerradas cuando el interruptor está apagado y la ventana aún no termina', () => {
    expect(estadoInscripciones(evento({ abiertas: false, fin: '2026-11-20T04:59:00.000Z' }), AHORA)).toBe('cerradas')
  })

  it('el fin de la ventana manda sobre la fecha del evento', () => {
    // El evento ya terminó, pero la API todavía tiene una ventana vigente: no se afirma «finalizadas».
    expect(estadoInscripciones(evento({ abiertas: false, fin: '2026-11-20T04:59:00.000Z' }, '2026-10-30'), AHORA)).toBe(
      'cerradas',
    )
  })

  it('finalizadas sin fin de ventana si el evento ya terminó', () => {
    expect(estadoInscripciones(evento({ abiertas: false }, '2026-10-30'), AHORA)).toBe('finalizadas')
  })

  it('cerradas sin fin de ventana si el evento todavía no termina', () => {
    expect(estadoInscripciones(evento({ abiertas: false }, '2026-11-20'), AHORA)).toBe('cerradas')
  })

  it('el último día del evento cuenta hasta el final del día en Lima', () => {
    const ultimoDia = evento({ abiertas: false }, '2026-11-09')
    // 9-nov 23:00 en Lima: el evento sigue en su último día
    expect(estadoInscripciones(ultimoDia, Date.parse('2026-11-10T04:00:00.000Z'))).toBe('cerradas')
    // 10-nov 00:01 en Lima: ya terminó
    expect(estadoInscripciones(ultimoDia, Date.parse('2026-11-10T05:01:00.000Z'))).toBe('finalizadas')
  })

  it('con fechas inválidas nunca afirma «finalizadas»', () => {
    expect(estadoInscripciones(evento({ abiertas: false, fin: 'no es una fecha' }, 'tampoco'), AHORA)).toBe('cerradas')
  })

  it('con una respuesta sin ventana de inscripciones queda cerrada', () => {
    const sinVentana = { inscripciones: undefined, fechaFin: '2026-11-20' } as unknown as Parameters<
      typeof estadoInscripciones
    >[0]
    expect(estadoInscripciones(sinVentana, AHORA)).toBe('cerradas')
  })
})
