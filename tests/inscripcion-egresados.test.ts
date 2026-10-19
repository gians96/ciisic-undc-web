import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  cierreInscripcionEgresadosValido,
  demoraHastaCierreInscripcionEgresados,
  estadoInscripcionEgresados,
  formatearCierreInscripcionEgresados,
  normalizarConfiguracionInscripcionEgresados,
  urlFormularioEgresadosValida,
} from '../app/utils/inscripcion-egresados'
import { encuentroEgresados } from '../app/data/encuentro-egresados'

describe('inscripción del Encuentro de Egresados mediante Google Forms', () => {
  afterEach(() => vi.useRealTimers())

  it('mantiene el estado próximamente mientras no exista el enlace público', () => {
    const sinEnlace = normalizarConfiguracionInscripcionEgresados({
      alumniFormUrl: '',
      alumniRegistrationDeadline: '2026-10-24T00:00:00-05:00',
    })

    expect(estadoInscripcionEgresados(sinEnlace)).toBe('proximamente')
  })

  it('abre con un URL público válido antes del corte confirmado', () => {
    const configuracion = normalizarConfiguracionInscripcionEgresados({
      alumniFormUrl: 'https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=sf_link',
      alumniRegistrationDeadline: '2026-10-24T00:00:00-05:00',
    })

    expect(estadoInscripcionEgresados(configuracion, Date.parse('2026-10-23T23:59:59.999-05:00'))).toBe('abierta')
    expect(configuracion.url).toContain('/viewform')
  })

  it('cierra exactamente en el instante exclusivo confirmado en hora de Lima', () => {
    const configuracion = normalizarConfiguracionInscripcionEgresados({
      alumniFormUrl: 'https://forms.gle/AbCdEf123456',
      alumniRegistrationDeadline: '2026-10-24T00:00:00-05:00',
    })

    expect(estadoInscripcionEgresados(configuracion, Date.parse('2026-10-23T23:59:59.999-05:00'))).toBe('abierta')
    expect(estadoInscripcionEgresados(configuracion, Date.parse('2026-10-24T00:00:00-05:00'))).toBe('cerrada')
  })

  it('actualiza el estado sin un segundo adicional antes, durante y después del corte', async () => {
    vi.useFakeTimers()
    const cierre = '2026-10-24T00:00:00-05:00'
    const configuracion = normalizarConfiguracionInscripcionEgresados({
      alumniFormUrl: 'https://forms.gle/AbCdEf123456',
      alumniRegistrationDeadline: cierre,
    })

    vi.setSystemTime('2026-10-23T23:59:59.999-05:00')
    expect(estadoInscripcionEgresados(configuracion)).toBe('abierta')
    expect(demoraHastaCierreInscripcionEgresados(cierre)).toBe(1)

    const alCierre = vi.fn()
    setTimeout(alCierre, demoraHastaCierreInscripcionEgresados(cierre)!)
    await vi.advanceTimersByTimeAsync(1)
    expect(alCierre).toHaveBeenCalledOnce()
    expect(estadoInscripcionEgresados(configuracion)).toBe('cerrada')
    expect(demoraHastaCierreInscripcionEgresados(cierre)).toBeNull()

    vi.setSystemTime('2026-10-24T00:00:00.001-05:00')
    expect(estadoInscripcionEgresados(configuracion)).toBe('cerrada')
    expect(demoraHastaCierreInscripcionEgresados(cierre)).toBeNull()
  })

  it('rechaza dominios ajenos, esquemas peligrosos y enlaces de edición o envío', () => {
    expect(urlFormularioEgresadosValida('https://forms.gle/AbCdEf123456')).toMatch(/^https:\/\/forms\.gle\//)
    expect(urlFormularioEgresadosValida('https://docs.google.com/forms/d/e/FORM_ID/viewform')).toContain('/viewform')

    for (const invalida of [
      'javascript:alert(1)',
      'https://ejemplo.com/forms/viewform',
      'https://docs.google.com/forms/d/FORM_ID/edit',
      'https://docs.google.com/forms/d/e/FORM_ID/formResponse',
      'https://usuario:clave@forms.gle/AbCdEf123456',
      '',
      null,
    ]) {
      expect(urlFormularioEgresadosValida(invalida)).toBeNull()
    }
  })

  it('acepta solo cierres con offset explícito de Lima y falla de forma segura', () => {
    expect(cierreInscripcionEgresadosValido('2026-10-24T00:00:00-05:00')).toBe('2026-10-24T00:00:00-05:00')
    expect(cierreInscripcionEgresadosValido('2026-10-27T04:59:59Z')).toBeNull()
    expect(cierreInscripcionEgresadosValido('por confirmar')).toBeNull()

    const invalida = normalizarConfiguracionInscripcionEgresados({
      alumniFormUrl: 'https://forms.gle/AbCdEf123456',
      alumniRegistrationDeadline: '2026-10-27T04:59:59Z',
    })
    expect(estadoInscripcionEgresados(invalida)).toBe('proximamente')
  })

  it('muestra el último minuto disponible del 23 de octubre', () => {
    expect(formatearCierreInscripcionEgresados(null)).toBe('No disponible')
    expect(formatearCierreInscripcionEgresados('2026-10-24T00:00:00-05:00'))
      .toBe('23 de octubre de 2026 · 11:59 p. m.')
  })
})

describe('contenido confirmado y archivo fotográfico', () => {
  it('publica el lugar confirmado sin alterar la procedencia interna de las fotos', () => {
    expect(encuentroEgresados.lugar).toBe('Casa de la Cultura')

    for (const imagen of [
      encuentroEgresados.portada,
      encuentroEgresados.portadaLanding,
      ...encuentroEgresados.galeria,
    ]) {
      expect(imagen.src).toContain('/encuentro-egresados/2024/')
      expect(imagen.alt).not.toMatch(/\b2024\b/)
      expect(imagen.alt).not.toMatch(/evento actual|2026/i)
    }
  })
})
