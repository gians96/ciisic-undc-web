import { describe, expect, it } from 'vitest'
import { respuestaModalidadVirtual } from '../app/utils/preguntas'

// Texto de la FAQ «¿Habrá modalidad virtual?» antes de la modalidad virtual: no debe cambiar sin planes virtuales
const RESPUESTA_ANTERIOR = 'El congreso es presencial, pero las conferencias magistrales principales serán transmitidas en vivo y quedarán disponibles en nuestra plataforma virtual para los participantes registrados. Los talleres prácticos y sesiones de networking son exclusivamente presenciales.'

describe('respuestaModalidadVirtual (FAQ 9)', () => {
  it('sin planes virtuales en la API conserva el texto anterior y no anuncia un plan Virtual', () => {
    const respuesta = respuestaModalidadVirtual(false)
    expect(respuesta).toBe(RESPUESTA_ANTERIOR)
    expect(respuesta).not.toMatch(/plan virtual|inscripción virtual/i)
  })

  it('con planes virtuales anuncia el plan Virtual con un texto neutro', () => {
    const respuesta = respuestaModalidadVirtual(true)
    expect(respuesta).toContain('elige el plan Virtual')
    expect(respuesta).toContain('organización te compartirá las indicaciones para conectarte')
    // preguntas de negocio abiertas: ni montos, ni enlaces, ni horas ni certificado
    expect(respuesta).not.toMatch(/S\/|https?:|certific|\d+\s*h\b|horas/i)
    expect(respuesta).toContain('exclusivamente presenciales')
  })

  it('si la API marca que los virtuales no admiten estudiantes UNDC, la respuesta lo dice (spec 020)', () => {
    const respuesta = respuestaModalidadVirtual(true, true)
    expect(respuesta).toContain('elige el plan Virtual')
    expect(respuesta).toContain('Los estudiantes de la UNDC se inscriben en modalidad presencial.')
    expect(respuestaModalidadVirtual(true, false)).toBe(respuestaModalidadVirtual(true))
    // Sin planes virtuales no se menciona (no hay inscripción virtual de la que excluirlos)
    expect(respuestaModalidadVirtual(false, true)).toBe(respuestaModalidadVirtual(false))
  })

  it('las dos respuestas son distintas', () => {
    expect(respuestaModalidadVirtual(true)).not.toBe(respuestaModalidadVirtual(false))
  })
})
