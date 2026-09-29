import { describe, expect, it } from 'vitest'
import { enlaceWhatsApp, formatearFechaHoraLima, formatearFechaSoloDia, formatearSoles, urlSegura } from '../app/utils/formato'

describe('formatearSoles', () => {
  it('formatea montos numéricos o en texto', () => {
    expect(formatearSoles(120)).toBe('S/ 120.00')
    expect(formatearSoles('40')).toBe('S/ 40.00')
    expect(formatearSoles(null)).toBe('S/ 0.00')
  })
})

describe('fechas', () => {
  it('muestra la fecha de pago sin corrimiento de zona horaria', () => {
    // es-PE escribe "setiembre" (algunos motores, "septiembre")
    expect(formatearFechaSoloDia('2026-09-29')).toMatch(/^29 de sep?tiembre de 2026$/)
    expect(formatearFechaSoloDia('2026-01-01')).toMatch(/^1 de enero de 2026$/)
  })

  it('devuelve el texto original si no es YYYY-MM-DD', () => {
    expect(formatearFechaSoloDia('mañana')).toBe('mañana')
    expect(formatearFechaSoloDia(null)).toBe('')
  })

  it('muestra la fecha de registro en hora de Lima', () => {
    expect(formatearFechaHoraLima('2026-09-29T15:04:05.000Z')).toMatch(/29 de sep?tiembre de 2026.*10:04/)
    expect(formatearFechaHoraLima('')).toBe('')
  })
})

describe('enlaces', () => {
  it('arma el enlace de WhatsApp con el código de país', () => {
    expect(enlaceWhatsApp('+51 949 026 908')).toBe('https://wa.me/51949026908')
    expect(enlaceWhatsApp('949026908')).toBe('https://wa.me/51949026908')
    expect(enlaceWhatsApp('')).toBe('')
  })

  it('solo acepta rutas del sitio o URLs http(s)', () => {
    expect(urlSegura('/images/qr/yape-2026.png')).toBe('/images/qr/yape-2026.png')
    expect(urlSegura('https://cdn.example.com/qr.png')).toBe('https://cdn.example.com/qr.png')
    expect(urlSegura('javascript:alert(1)')).toBe('')
    expect(urlSegura('//evil.example.com/qr.png')).toBe('')
    expect(urlSegura('data:image/png;base64,AAAA')).toBe('')
    expect(urlSegura(null)).toBe('')
  })
})
