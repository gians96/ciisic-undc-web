import { describe, expect, it } from 'vitest'
import type { FormularioInscripcion } from '../app/types/inscription'
import { tokenCorreoParaEnvio } from '../app/utils/google'
import {
  CAMPO_VOUCHER,
  VOUCHER_MAX_BYTES,
  construirFormDataInscripcion,
  esCelularValido,
  fechaHoyLima,
  mapearFormularioInscripcion,
  normalizarFechaPago,
  validarArchivoVoucher,
} from '../app/utils/inscripcion'

const voucherPng = () => new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'voucher.png', { type: 'image/png' })

const formulario = (cambios: Partial<FormularioInscripcion> = {}): FormularioInscripcion => ({
  documentType: 'DNI',
  documentNumber: '71234567',
  nombres: '  Ana   María ',
  apellidos: 'Pérez  Díaz',
  email: ' Ana.Perez@Gmail.com ',
  celular: '987654321',
  planId: 1,
  clasificacion: '4',
  modalidadDeposito: 'banco',
  bancoSeleccionado: 'bcp',
  tipoPago: 'directo',
  aplicativo: null,
  fechaPago: '2026-09-29',
  codigoVoucher: ' 123456 ',
  archivoVoucher: voucherPng(),
  verificacionToken: null,
  ...cambios,
})

describe('mapearFormularioInscripcion', () => {
  it('arma el participante y los ids del contrato', () => {
    const datos = mapearFormularioInscripcion(formulario())
    expect(datos.participante).toEqual({
      tipoDocumento: 'dni',
      numeroDocumento: '71234567',
      nombres: 'Ana María',
      apellidos: 'Pérez Díaz',
      correo: 'ana.perez@gmail.com',
      celular: '987654321',
    })
    expect(datos).toMatchObject({
      tipoInscripcionId: 1,
      clasificacionId: 4,
      modalidadPago: 'banco',
      banco: 'bcp',
      tipoOperacion: 'directo',
      billeteraDigital: null,
      numeroOperacion: '123456',
      fechaPago: '2026-09-29',
      verificacionToken: null,
    })
  })

  it('con billetera no envía banco ni tipo de operación', () => {
    const datos = mapearFormularioInscripcion(formulario({ modalidadDeposito: 'billetera', aplicativo: 'yape' }))
    expect(datos).toMatchObject({ modalidadPago: 'billetera', banco: null, tipoOperacion: null, billeteraDigital: 'yape' })
  })

  it('normaliza el carné de extranjería y omite la clasificación vacía', () => {
    const datos = mapearFormularioInscripcion(formulario({ documentType: 'CE', documentNumber: 'ab1234567', clasificacion: '' }))
    expect(datos.participante).toMatchObject({ tipoDocumento: 'ce', numeroDocumento: 'AB1234567' })
    expect(datos.clasificacionId).toBeNull()
  })

  it('conserva el token de verificación', () => {
    expect(mapearFormularioInscripcion(formulario({ verificacionToken: 'eyJ.token' })).verificacionToken).toBe('eyJ.token')
  })

  it('exige plan y voucher', () => {
    expect(() => mapearFormularioInscripcion(formulario({ planId: null }))).toThrow('plan')
    expect(() => mapearFormularioInscripcion(formulario({ archivoVoucher: null }))).toThrow('voucher')
  })
})

describe('construirFormDataInscripcion', () => {
  it('envía exactamente los campos del contrato, con el archivo en "voucher"', () => {
    const cuerpo = construirFormDataInscripcion(mapearFormularioInscripcion(formulario({ verificacionToken: 'eyJ.token' })))
    expect([...cuerpo.keys()]).toEqual([
      'participante', 'tipoInscripcionId', 'clasificacionId', 'modalidadPago', 'banco', 'tipoOperacion',
      'numeroOperacion', 'fechaPago', 'verificacionToken', 'voucher',
    ])
    expect(CAMPO_VOUCHER).toBe('voucher')
    const voucher = cuerpo.get('voucher') as File
    expect(voucher.name).toBe('voucher.png')
    expect(cuerpo.get('participante')).toBe(
      '{"tipoDocumento":"dni","numeroDocumento":"71234567","nombres":"Ana María","apellidos":"Pérez Díaz","correo":"ana.perez@gmail.com","celular":"987654321"}',
    )
    expect(cuerpo.get('tipoInscripcionId')).toBe('1')
    expect(cuerpo.get('fechaPago')).toBe('2026-09-29')
  })

  it('nunca envía estadoId, pago, monto, descuento, hasDiscount ni file', () => {
    const cuerpo = construirFormDataInscripcion(mapearFormularioInscripcion(formulario()))
    for (const campo of ['estadoId', 'pago', 'monto', 'descuento', 'hasDiscount', 'esEmailInstitucional', 'file', 'usuario']) {
      expect(cuerpo.has(campo)).toBe(false)
    }
  })

  it('omite los opcionales vacíos y usa billeteraDigital con billetera', () => {
    const cuerpo = construirFormDataInscripcion(mapearFormularioInscripcion(
      formulario({ modalidadDeposito: 'billetera', aplicativo: 'yape', clasificacion: null }),
    ))
    expect([...cuerpo.keys()]).toEqual(['participante', 'tipoInscripcionId', 'modalidadPago', 'billeteraDigital', 'numeroOperacion', 'fechaPago', 'voucher'])
    expect(cuerpo.get('billeteraDigital')).toBe('yape')
  })
})

describe('verificacionCorreoToken (correo verificado con Google)', () => {
  const CAMPOS_CON_TOKENS = [
    'participante', 'tipoInscripcionId', 'clasificacionId', 'modalidadPago', 'banco', 'tipoOperacion',
    'numeroOperacion', 'fechaPago', 'verificacionToken', 'verificacionCorreoToken', 'voucher',
  ]

  it('mapearFormularioInscripcion lo conserva y usa null sin token', () => {
    expect(mapearFormularioInscripcion(formulario({ verificacionCorreoToken: 'eyJ.correo' })).verificacionCorreoToken).toBe('eyJ.correo')
    expect(mapearFormularioInscripcion(formulario()).verificacionCorreoToken).toBeNull()
    expect(mapearFormularioInscripcion(formulario({ verificacionCorreoToken: '' })).verificacionCorreoToken).toBeNull()
  })

  it('el multipart lo incluye (antes del archivo) cuando el correo está verificado', () => {
    const cuerpo = construirFormDataInscripcion(mapearFormularioInscripcion(
      formulario({ verificacionToken: 'eyJ.token', verificacionCorreoToken: 'eyJ.correo' }),
    ))
    expect([...cuerpo.keys()]).toEqual(CAMPOS_CON_TOKENS)
    expect(cuerpo.get('verificacionCorreoToken')).toBe('eyJ.correo')
    expect(cuerpo.get('verificacionToken')).toBe('eyJ.token')
  })

  it('el multipart lo omite sin token (sin Google o después de «Usar otro correo»)', () => {
    for (const verificacionCorreoToken of [null, undefined, '']) {
      const cuerpo = construirFormDataInscripcion(mapearFormularioInscripcion(formulario({ verificacionCorreoToken })))
      expect(cuerpo.has('verificacionCorreoToken')).toBe(false)
    }
  })

  it('con la regla del formulario: solo se envía mientras el correo está bloqueado', () => {
    const enviar = (bloqueado: boolean, correoFormulario = ' Ana.Perez@Gmail.com ') => construirFormDataInscripcion(mapearFormularioInscripcion(formulario({
      email: correoFormulario,
      verificacionCorreoToken: tokenCorreoParaEnvio({ bloqueado, token: 'eyJ.correo', correoVerificado: 'ana.perez@gmail.com', correoFormulario }),
    })))
    expect(enviar(true).get('verificacionCorreoToken')).toBe('eyJ.correo')
    expect(enviar(false).has('verificacionCorreoToken')).toBe(false)
    expect(enviar(true, 'otra@gmail.com').has('verificacionCorreoToken')).toBe(false)
  })
})

describe('fecha de pago', () => {
  it('usa el valor del selector tal cual (sin pasar por UTC)', () => {
    expect(normalizarFechaPago('2026-09-29')).toBe('2026-09-29')
    expect(normalizarFechaPago(' 2026-01-01 ')).toBe('2026-01-01')
  })

  it('con un Date usa la fecha local, no la de UTC', () => {
    expect(normalizarFechaPago(new Date(2026, 8, 29, 23, 30))).toBe('2026-09-29')
    expect(normalizarFechaPago(new Date(2026, 8, 29, 0, 5))).toBe('2026-09-29')
  })

  it('rechaza formatos o fechas inexistentes', () => {
    expect(() => normalizarFechaPago('29/09/2026')).toThrow('Fecha de pago inválida')
    expect(() => normalizarFechaPago('2026-02-30')).toThrow('Fecha de pago inválida')
    expect(() => normalizarFechaPago('')).toThrow('Fecha de pago inválida')
    expect(() => normalizarFechaPago(new Date('no es fecha'))).toThrow('Fecha de pago inválida')
  })

  it('calcula "hoy" en hora de Lima (UTC-5)', () => {
    expect(fechaHoyLima(new Date('2026-09-30T03:00:00Z'))).toBe('2026-09-29')
    expect(fechaHoyLima(new Date('2026-09-30T05:00:00Z'))).toBe('2026-09-30')
  })
})

describe('validaciones del formulario', () => {
  it('celular: 9 dígitos que empiezan con 9', () => {
    expect(esCelularValido('987654321')).toBe(true)
    expect(esCelularValido('887654321')).toBe(false)
    expect(esCelularValido('98765432')).toBe(false)
    expect(esCelularValido('9876543210')).toBe(false)
    expect(esCelularValido('98765432a')).toBe(false)
  })

  it('voucher: PDF, JPG, PNG o WebP de hasta 5 MB', () => {
    expect(validarArchivoVoucher({ name: 'pago.webp', type: 'image/webp', size: 10 })).toBe('')
    expect(validarArchivoVoucher({ name: 'pago.PDF', type: '', size: 10 })).toBe('')
    expect(validarArchivoVoucher({ name: 'pago.gif', type: 'image/gif', size: 10 })).not.toBe('')
    expect(validarArchivoVoucher({ name: 'pago.png', type: 'image/png', size: 0 })).not.toBe('')
    expect(validarArchivoVoucher({ name: 'pago.png', type: 'image/png', size: VOUCHER_MAX_BYTES + 1 })).not.toBe('')
    expect(validarArchivoVoucher(null)).toBe('Adjunta el voucher de pago.')
  })
})
