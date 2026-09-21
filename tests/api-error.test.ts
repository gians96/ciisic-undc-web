import { describe, expect, it } from 'vitest'
import { normalizeApiError } from '../app/composables/useApi'

describe('normalizeApiError', () => {
  it('normaliza el contrato de error del backend', () => {
    expect(normalizeApiError({
      statusCode: 409,
      data: { code: 'DUPLICATE_OPERATION', message: 'Operación duplicada' },
    })).toMatchObject({ statusCode: 409, code: 'DUPLICATE_OPERATION', message: 'Operación duplicada' })
  })

  it('usa un error seguro cuando la respuesta no tiene contrato', () => {
    expect(normalizeApiError(new Error('falló'))).toMatchObject({ statusCode: 500, code: 'REQUEST_ERROR', message: 'falló' })
  })
})
