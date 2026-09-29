import { describe, expect, it } from 'vitest'
import { normalizeApiError } from '../app/composables/useApi'

describe('normalizeApiError', () => {
  it('normaliza el contrato de error del backend', () => {
    expect(normalizeApiError({
      statusCode: 409,
      data: { code: 'DUPLICATE_OPERATION', message: 'Operación duplicada' },
    })).toMatchObject({ statusCode: 409, code: 'DUPLICATE_OPERATION', message: 'Operación duplicada' })
  })

  it('conserva los campos de VALIDATION_ERROR', () => {
    expect(normalizeApiError({
      statusCode: 422,
      data: { code: 'VALIDATION_ERROR', message: 'Los datos enviados no son válidos', fields: { fechaPago: 'La fecha de pago no puede ser futura' } },
    }).fields).toEqual({ fechaPago: 'La fecha de pago no puede ser futura' })
  })

  it('usa un error seguro cuando la respuesta no tiene contrato', () => {
    expect(normalizeApiError(new Error('falló'))).toMatchObject({ statusCode: 500, code: 'REQUEST_ERROR', message: 'falló' })
  })

  it('distingue la falta de respuesta (red, CORS o timeout) de un error del servidor', () => {
    const sinRespuesta = Object.assign(new Error('[POST] "http://api": <no response> fetch failed'), { name: 'FetchError' })
    expect(normalizeApiError(sinRespuesta)).toMatchObject({ statusCode: 0, code: 'NETWORK_ERROR' })
    const conRespuesta = Object.assign(new Error('Too Many Requests'), { name: 'FetchError', statusCode: 429, data: { code: 'RATE_LIMITED', message: 'Espera' } })
    expect(normalizeApiError(conRespuesta)).toMatchObject({ statusCode: 429, code: 'RATE_LIMITED' })
  })
})
