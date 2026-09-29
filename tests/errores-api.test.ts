import { describe, expect, it } from 'vitest'
import {
  SERVICIO_NO_DISPONIBLE,
  camposConError,
  mensajeErrorApi,
  mensajeErrorContacto,
  mensajeErrorInscripcion,
  mensajeErrorPonencia,
} from '../app/utils/errores-api'

const GENERICO = 'No pudimos registrar tu inscripción. Revisa los datos e inténtalo nuevamente.'

describe('mensajeErrorInscripcion', () => {
  it.each([
    ['ALREADY_REGISTERED', 409, /Ya tienes una inscripción registrada en este evento/],
    ['EMAIL_IN_USE', 409, /correo ya está registrado por otra persona/],
    ['OPERATION_ALREADY_REGISTERED', 409, /número de operación ya fue registrado/],
    ['REGISTRATION_CLOSED', 409, /inscripciones para este evento están cerradas/],
    ['REGISTRATION_TYPE_INVALID', 422, /tipo de inscripción elegido ya no está disponible/],
    ['VOUCHER_REQUIRED', 422, /Adjunta el voucher/],
    ['INVALID_FILE_CONTENT', 422, /no coincide con su formato/],
    ['INVALID_FILE_TYPE', 422, /Formato de voucher no permitido/],
    ['UPLOAD_LIMIT_EXCEEDED', 413, /5 MB/],
    ['RATE_LIMITED', 429, /Espera 15 minutos/],
    ['EVENT_NOT_FOUND', 404, /evento no está disponible/],
  ])('traduce %s a un mensaje en español', (code, statusCode, esperado) => {
    const mensaje = mensajeErrorInscripcion({ statusCode, code, message: 'message from server' })
    expect(mensaje).toMatch(esperado)
    expect(mensaje).not.toBe(GENERICO)
  })

  it('VALIDATION_ERROR indica qué campos corregir', () => {
    const mensaje = mensajeErrorInscripcion({
      statusCode: 422,
      code: 'VALIDATION_ERROR',
      message: 'Los datos enviados no son válidos',
      fields: { 'participante.celular': 'must match', fechaPago: 'La fecha de pago no puede ser futura' },
    })
    expect(mensaje).toBe('Revisa estos datos: Celular (9 dígitos que empiezan con 9); Fecha de pago (una fecha válida que no sea futura).')
  })

  it('VALIDATION_ERROR sin campos usa un mensaje general', () => {
    expect(mensajeErrorInscripcion({ statusCode: 422, code: 'VALIDATION_ERROR' })).toBe('Algunos datos no son válidos. Revisa el formulario.')
  })

  it('413 de un proxy sin cuerpo también es voucher demasiado grande', () => {
    expect(mensajeErrorInscripcion({ statusCode: 413, code: 'REQUEST_ERROR' })).toMatch(/5 MB/)
  })

  it('distingue la falta de conexión y los errores del servidor', () => {
    expect(mensajeErrorInscripcion({ statusCode: 0, code: 'NETWORK_ERROR' })).toMatch(/No pudimos conectar/)
    expect(mensajeErrorInscripcion({ statusCode: 500, code: 'INTERNAL_ERROR' })).toMatch(/servidor no pudo/)
    expect(mensajeErrorInscripcion({ statusCode: 400, code: 'ALGO_NUEVO' })).toBe(GENERICO)
  })
})

describe('camposConError y mensajeErrorApi', () => {
  it('usa el nombre del campo cuando no hay etiqueta conocida', () => {
    expect(camposConError({ campoNuevo: 'x', 'participante.nombres': 'y' })).toEqual(['campoNuevo', 'Nombres (entre 2 y 120 caracteres)'])
    expect(camposConError(undefined)).toEqual([])
  })

  it('prioriza el mensaje del código y cae en el límite de tasa genérico', () => {
    expect(mensajeErrorApi({ statusCode: 429, code: 'RATE_LIMITED' }, {}, 'x')).toMatch(/Espera unos minutos/)
    expect(mensajeErrorApi({ statusCode: 404, code: 'EVENT_NOT_FOUND' }, { EVENT_NOT_FOUND: 'propio' }, 'x')).toBe('propio')
    expect(mensajeErrorApi({ statusCode: 400, code: 'OTRO' }, {}, 'por defecto')).toBe('por defecto')
  })
})

describe('errores del token del evento y del BFF', () => {
  it.each([
    ['SITE_NOT_CONFIGURED', 503],
    ['EVENT_TOKEN_REQUIRED', 401],
    ['INVALID_EVENT_TOKEN', 401],
  ])('%s se muestra como servicio no disponible, sin detalles técnicos', (code, statusCode) => {
    expect(mensajeErrorInscripcion({ statusCode, code })).toBe(SERVICIO_NO_DISPONIBLE)
    expect(mensajeErrorContacto({ statusCode, code })).toBe(SERVICIO_NO_DISPONIBLE)
    expect(mensajeErrorPonencia({ statusCode, code })).toBe(SERVICIO_NO_DISPONIBLE)
  })

  it('BACKEND_UNAVAILABLE indica que no se pudo conectar y que los datos se conservan', () => {
    expect(mensajeErrorInscripcion({ statusCode: 502, code: 'BACKEND_UNAVAILABLE' })).toMatch(/No pudimos conectar con el servidor del congreso.*se conservan/)
  })
})

describe('mensajes de ponencias y contacto', () => {
  it('ponencias: PDF inválido, límite de tamaño y de envíos', () => {
    expect(mensajeErrorPonencia({ statusCode: 422, code: 'INVALID_PDF' })).toBe('Adjunta un archivo PDF válido y no vacío.')
    expect(mensajeErrorPonencia({ statusCode: 413, code: 'UPLOAD_LIMIT_EXCEEDED' })).toBe('El PDF supera el máximo de 5 MB.')
    expect(mensajeErrorPonencia({ statusCode: 429, code: 'RATE_LIMITED' })).toMatch(/Espera 15 minutos/)
    expect(mensajeErrorPonencia({ statusCode: 400, code: 'OTRO' })).toMatch(/No pudimos confirmar la recepción/)
  })

  it('contacto: límite de mensajes y validación', () => {
    expect(mensajeErrorContacto({ statusCode: 429, code: 'RATE_LIMITED' })).toMatch(/15 minutos/)
    expect(mensajeErrorContacto({ statusCode: 422, code: 'VALIDATION_ERROR' })).toMatch(/Revisa el formulario/)
    expect(mensajeErrorContacto({ statusCode: 400, code: 'OTRO' })).toBe('Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.')
  })
})
