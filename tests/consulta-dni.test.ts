import { describe, expect, it } from 'vitest'
import { mapearConsultaDni, mensajeFallaConsultaDni } from '../app/utils/consulta-dni'

describe('mapearConsultaDni', () => {
  it('usa nombres y apellidos de la respuesta del backend', () => {
    expect(mapearConsultaDni({
      numero: '12345678', nombres: ' JUAN  CARLOS ', apellidoPaterno: 'PEREZ', apellidoMaterno: 'GARCIA', apellidos: 'PEREZ GARCIA',
    })).toEqual({ nombres: 'JUAN CARLOS', apellidos: 'PEREZ GARCIA' })
  })

  it('arma los apellidos desde paterno y materno si no vienen unidos', () => {
    expect(mapearConsultaDni({ nombres: 'ANA', apellidoPaterno: 'RIOS', apellidoMaterno: null, apellidos: null }))
      .toEqual({ nombres: 'ANA', apellidos: 'RIOS' })
  })

  it('devuelve null cuando faltan datos personales', () => {
    expect(mapearConsultaDni({ nombres: 'ANA', apellidos: '' })).toBeNull()
    expect(mapearConsultaDni(null)).toBeNull()
  })
})

describe('mensajeFallaConsultaDni', () => {
  it('permite el ingreso manual en 404, 503 y 429', () => {
    expect(mensajeFallaConsultaDni({ statusCode: 404, code: 'DOCUMENT_NOT_FOUND' }, '71234567')).toBe(
      'No encontramos datos para el DNI 71234567. Ingresa tus nombres y apellidos manualmente.',
    )
    expect(mensajeFallaConsultaDni({ statusCode: 503, code: 'LOOKUP_UNAVAILABLE' })).toMatch(/no está disponible.*manualmente/)
    expect(mensajeFallaConsultaDni({ statusCode: 429, code: 'RATE_LIMITED' })).toMatch(/Espera un minuto/)
  })

  it('explica el DNI inválido y los problemas de conexión', () => {
    expect(mensajeFallaConsultaDni({ statusCode: 422, code: 'INVALID_DNI' })).toBe('El DNI debe tener 8 dígitos numéricos.')
    expect(mensajeFallaConsultaDni({ statusCode: 0, code: 'NETWORK_ERROR' })).toMatch(/No pudimos conectar/)
    expect(mensajeFallaConsultaDni({ statusCode: 500, code: 'INTERNAL_ERROR' })).toMatch(/No pudimos consultar el DNI/)
  })
})
