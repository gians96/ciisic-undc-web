import { describe, expect, it } from 'vitest'
import type { FormularioInscripcionIndividual, PagoFormulario, PlanVisible } from '../app/types/delegaciones'
import {
  CAMPO_VOUCHERS, cantidadesPorPlan, construirFormDataPagos, correoCompleto, documentoLimpio, erroresInscripcionIndividual, erroresPorIntegrante, estimarGrupo,
  filaEnBlanco, filaVacia, inscripcionIndividualParaEnviar, inscripcionIndividualVacia, integrantesParaEnviar, mensajeErrorDelegacion, normalizarDni, pagosParaEnviar,
  pagoVacio, planesActivos, planPorDefecto, precioUnitarioPlan, prefijoDeCorreo, textoPrecioPlan, textoSaldo, validarInscripcionIndividual, validarIntegrantes, validarPago,
} from '../app/utils/delegaciones'
import { parsearListaIntegrantes } from '../app/utils/lista-integrantes'
import { codigoLinkValido, LIMITE_DELEGACION_BYTES, LIMITE_MULTIPART_BYTES } from '../server/utils/api-sitio'

const archivo = (nombre = 'voucher.pdf', tamano = 1024) => new File([new Uint8Array(tamano)], nombre, { type: 'application/pdf' })

const pago = (extra: Partial<PagoFormulario> = {}): PagoFormulario => ({
  ...pagoVacio(), billeteraDigital: 'yape', numeroOperacion: 'OP-123', fechaPago: '2026-10-15', monto: 250, archivo: archivo(), ...extra,
})

const plan = (codigo: PlanVisible['codigo'], precio: number, extra: Partial<PlanVisible> = {}): PlanVisible => ({
  codigo, etiqueta: codigo, modalidad: codigo === 'VIRTUAL' ? 'VIRTUAL' : 'PRESENCIAL', activo: true, precio, precioPromocional: null, precioUnitario: precio, integrantes: 0, ...extra,
})
const CON_KIT = plan('CON_KIT', 80)
const SIN_KIT = plan('SIN_KIT', 60, { precioPromocional: 50 })
const VIRTUAL = plan('VIRTUAL', 30)

describe('precio y estimado por plan', () => {
  it.each([[0, 60], [9, 60], [10, 50], [24, 50]])('con %i integrantes un plan con promocional cobra %i', (total, esperado) => {
    expect(precioUnitarioPlan(60, 50, 10, total)).toBe(esperado)
  })

  it('sin promocional, o con uno que no rebaja, cobra siempre el precio', () => {
    expect(precioUnitarioPlan(80, null, 10, 40)).toBe(80)
    expect(precioUnitarioPlan(60, 60, 10, 40)).toBe(60)
  })

  it('un grupo mixto cobra a cada integrante el precio de su plan', () => {
    const planes = [CON_KIT, SIN_KIT, VIRTUAL]
    expect(estimarGrupo(planes, { CON_KIT: 2, SIN_KIT: 3, VIRTUAL: 1 }, 10)).toMatchObject({ integrantes: 6, total: 2 * 80 + 3 * 60 + 30, faltan: 4 })
    const alto = estimarGrupo(planes, { CON_KIT: 2, SIN_KIT: 8, VIRTUAL: 0 }, 10)
    // Al llegar al mínimo solo el plan con promocional baja
    expect(alto).toMatchObject({ integrantes: 10, total: 2 * 80 + 8 * 50, faltan: null })
    expect(alto.unitarios).toEqual({ CON_KIT: 80, SIN_KIT: 50, VIRTUAL: 30 })
  })

  it('sin escala no avisa cuántos faltan; una cantidad inválida cuenta como cero', () => {
    expect(estimarGrupo([CON_KIT, VIRTUAL], { CON_KIT: 1 }, 10).faltan).toBeNull()
    expect(estimarGrupo([CON_KIT], { CON_KIT: -3 }, 10)).toMatchObject({ integrantes: 0, total: 0 })
    expect(estimarGrupo([CON_KIT], { CON_KIT: 2.9 }, 10)).toMatchObject({ integrantes: 2, total: 160 })
  })

  it('lista los planes activos y precarga el único; con varios hay que elegir', () => {
    expect(planesActivos([CON_KIT, { ...SIN_KIT, activo: false }]).map(p => p.codigo)).toEqual(['CON_KIT'])
    expect(planPorDefecto([CON_KIT, { ...SIN_KIT, activo: false }, { ...VIRTUAL, activo: false }])).toBe('CON_KIT')
    expect(planPorDefecto([CON_KIT, SIN_KIT])).toBe('')
    expect(planPorDefecto([])).toBe('')
  })

  it('cuenta los integrantes por plan; sin plan elegido toman el único activo', () => {
    const filas = [{ ...filaVacia('CON_KIT'), numeroDocumento: '70000001' }, { ...filaVacia(), numeroDocumento: '70000002' }, filaVacia('SIN_KIT')]
    expect(cantidadesPorPlan(filas, 'SIN_KIT')).toEqual({ CON_KIT: 1, SIN_KIT: 1 })
    expect(cantidadesPorPlan(filas, '')).toEqual({ CON_KIT: 1 })
  })

  it('describe el precio de un plan con su escala', () => {
    expect(textoPrecioPlan({ precio: 80, precioPromocional: null }, 10)).toBe('S/ 80.00')
    expect(textoPrecioPlan({ precio: 60, precioPromocional: 50 }, 10)).toBe('S/ 60.00 · S/ 50.00 desde 10 integrantes')
    expect(textoPrecioPlan({ precio: 60, precioPromocional: 60 }, 10)).toBe('S/ 60.00')
  })

  it('el saldo se describe como falta, sobra o al día', () => {
    expect(textoSaldo(0)).toBe('Al día')
    expect(textoSaldo(120)).toBe('Falta declarar S/ 120.00')
    expect(textoSaldo(-30)).toBe('Declaraste S/ 30.00 de más')
  })
})

describe('documentos', () => {
  it('completa con cero el DNI de 7 dígitos que Excel dejó sin él', () => {
    expect(normalizarDni('7969419')).toBe('07969419')
    expect(normalizarDni(' 7969419 ')).toBe('07969419')
    expect(normalizarDni('23715269')).toBe('23715269')
    expect(normalizarDni('CE1234567')).toBe('CE1234567')
  })

  it('el documento limpio va en mayúsculas y el carné no se rellena', () => {
    expect(documentoLimpio('dni', '7969419')).toBe('07969419')
    expect(documentoLimpio('ce', ' ab1234567 ')).toBe('AB1234567')
  })
})

describe('correo con dominio', () => {
  it('con dominio, un texto sin @ se completa; con @ se respeta; siempre en minúsculas', () => {
    expect(correoCompleto(' AQuispe ', 'unac.edu.pe')).toBe('aquispe@unac.edu.pe')
    expect(correoCompleto('ana@gmail.com', 'unac.edu.pe')).toBe('ana@gmail.com')
    expect(correoCompleto('Ana@Example.com', null)).toBe('ana@example.com')
    expect(correoCompleto('ana', null)).toBe('ana')
    expect(correoCompleto('  ', 'unac.edu.pe')).toBe('')
  })

  it('el prefijo se queda con lo de antes de la @ solo si el correo es del dominio', () => {
    expect(prefijoDeCorreo('AQuispe@UNAC.edu.pe', 'unac.edu.pe')).toBe('aquispe')
    expect(prefijoDeCorreo('ana@gmail.com', 'unac.edu.pe')).toBe('ana@gmail.com')
    expect(prefijoDeCorreo('ana', 'unac.edu.pe')).toBe('ana')
    expect(prefijoDeCorreo('ana@unac.edu.pe', null)).toBe('ana@unac.edu.pe')
  })
})

describe('validación de integrantes', () => {
  const fila = (extra: Record<string, string> = {}) => ({ ...filaVacia(), numeroDocumento: '70000001', nombres: 'Ana', apellidos: 'Ríos', correo: 'ana@example.com', ...extra })

  it('ignora las filas en blanco, aunque traigan el plan precargado', () => {
    expect(filaEnBlanco(filaVacia('CON_KIT'))).toBe(true)
    expect(validarIntegrantes([filaVacia(), filaVacia('SIN_KIT')], { pedirPlan: true })).toEqual({})
  })

  it('señala los campos que faltan en una fila con datos', () => {
    const incompleta = { ...filaVacia(), numeroDocumento: '123' }
    expect(Object.keys(validarIntegrantes([incompleta])[incompleta.clave] ?? {}).sort()).toEqual(['apellidos', 'correo', 'nombres', 'numeroDocumento'])
  })

  it('detecta documentos y correos repetidos', () => {
    const a = fila()
    const b = fila({ nombres: 'Luis' })
    const errores = validarIntegrantes([a, b])
    expect(errores[b.clave]?.numeroDocumento).toMatch(/repetido/)
    expect(errores[b.clave]?.correo).toMatch(/repetido/)
    expect(errores[a.clave]).toBeUndefined()
  })

  it('con varios planes activos cada integrante debe elegir el suyo', () => {
    const sinPlan = fila()
    expect(validarIntegrantes([sinPlan], { pedirPlan: true })[sinPlan.clave]?.plan).toMatch(/plan/i)
    expect(validarIntegrantes([{ ...sinPlan, plan: 'CON_KIT' }], { pedirPlan: true })).toEqual({})
    // Con un solo plan activo no se pide
    expect(validarIntegrantes([sinPlan], { pedirPlan: false })).toEqual({})
  })

  it('con dominio el correo se completa con él y debe terminar en el dominio', () => {
    const prefijo = fila({ correo: 'aquispe' })
    expect(validarIntegrantes([prefijo], { dominio: 'unac.edu.pe' })).toEqual({})
    const otro = fila({ correo: 'ana@gmail.com' })
    expect(validarIntegrantes([otro], { dominio: 'unac.edu.pe' })[otro.clave]?.correo).toMatch(/@unac\.edu\.pe/)
  })

  it('limpia las filas para enviar: DNI de 7 dígitos, correo completo en minúsculas, celular solo con dígitos y el plan', () => {
    const con = { ...filaVacia('SIN_KIT'), numeroDocumento: ' 7969419 ', nombres: ' Janeth  Bertha ', apellidos: 'Mariño', correo: ' JANETH ', celular: '954 825 216' }
    expect(integrantesParaEnviar([filaVacia(), con], 'unat.edu.pe')).toEqual([{
      tipoDocumento: 'dni', numeroDocumento: '07969419', nombres: 'Janeth Bertha', apellidos: 'Mariño', correo: 'janeth@unat.edu.pe', celular: '954825216', plan: 'SIN_KIT',
    }])
    // Sin plan elegido no se envía la clave (el servidor asume el único plan activo)
    expect(integrantesParaEnviar([{ ...con, plan: '' }], 'unat.edu.pe')[0]).not.toHaveProperty('plan')
  })

  it('traduce los errores del backend por posición a la fila correspondiente', () => {
    const errores = erroresPorIntegrante({ 'participantes[1].correo': 'Correo de otra persona', 'participantes[0].numeroDocumento': 'Ya inscrito', 'representante.correo': 'x' }, 1)
    expect(errores).toEqual({ 0: { correo: 'Correo de otra persona' } })
    expect(erroresPorIntegrante({ 'participantes[2].correo': 'x' })).toEqual({ 2: { correo: 'x' } })
    expect(erroresPorIntegrante({ 'participantes[3].plan': 'Elige un plan' })).toEqual({ 3: { plan: 'Elige un plan' } })
  })
})

describe('inscripción con el link individual', () => {
  const planes = [{ codigo: 'CON_KIT' as const }, { codigo: 'SIN_KIT' as const }]
  const form = (extra: Partial<FormularioInscripcionIndividual> = {}): FormularioInscripcionIndividual => ({
    ...inscripcionIndividualVacia(), tipoDocumento: 'dni', numeroDocumento: '70000001', nombres: 'Ana', apellidos: 'Quispe', correo: 'aquispe', celular: '', plan: 'SIN_KIT', ...extra,
  })

  it('un formulario completo con dominio no tiene errores: basta el prefijo', () => {
    expect(validarInscripcionIndividual(form(), { dominio: 'unac.edu.pe', planes })).toEqual({})
    // Pegar el correo completo del dominio también se acepta
    expect(validarInscripcionIndividual(form({ correo: 'aquispe@unac.edu.pe' }), { dominio: 'unac.edu.pe', planes })).toEqual({})
  })

  it('con dominio rechaza un correo de otro dominio y un prefijo inválido', () => {
    expect(validarInscripcionIndividual(form({ correo: 'ana@gmail.com' }), { dominio: 'unac.edu.pe', planes }).correo).toMatch(/@unac\.edu\.pe/)
    expect(validarInscripcionIndividual(form({ correo: 'a b' }), { dominio: 'unac.edu.pe', planes }).correo).toBeTruthy()
    expect(validarInscripcionIndividual(form({ correo: '' }), { dominio: 'unac.edu.pe', planes }).correo).toBeTruthy()
  })

  it('sin dominio exige el correo completo', () => {
    expect(validarInscripcionIndividual(form({ correo: 'ana@example.com' }), { dominio: null, planes })).toEqual({})
    expect(validarInscripcionIndividual(form({ correo: 'ana' }), { dominio: null, planes }).correo).toBeTruthy()
  })

  it('exige los datos y el plan cuando hay varios; el celular es opcional pero válido', () => {
    expect(Object.keys(validarInscripcionIndividual(inscripcionIndividualVacia(), { dominio: 'unac.edu.pe', planes })).sort()).toEqual(['apellidos', 'correo', 'nombres', 'numeroDocumento', 'plan'])
    expect(validarInscripcionIndividual(form({ plan: '' }), { dominio: 'unac.edu.pe', planes: [planes[0]!] }).plan).toBeUndefined()
    expect(validarInscripcionIndividual(form({ celular: '812345678' }), { dominio: 'unac.edu.pe', planes }).celular).toBeTruthy()
    expect(validarInscripcionIndividual(form({ celular: '990 866 060' }), { dominio: 'unac.edu.pe', planes }).celular).toBeUndefined()
  })

  it('el cuerpo con dominio lleva el prefijo y nunca el correo completo, precios ni tipos', () => {
    const cuerpo = inscripcionIndividualParaEnviar(form({ numeroDocumento: ' 7969419 ', correo: 'AQuispe@UNAC.edu.pe', nombres: ' Ana  María ', celular: '990 866 060' }), 'unac.edu.pe')
    expect(cuerpo).toEqual({ tipoDocumento: 'dni', numeroDocumento: '07969419', nombres: 'Ana María', apellidos: 'Quispe', celular: '990866060', correoPrefijo: 'aquispe', plan: 'SIN_KIT' })
    expect(JSON.stringify(cuerpo)).not.toMatch(/precio|monto|tipoInscripcion|@/)
  })

  it('el cuerpo sin dominio lleva el correo completo y, sin plan elegido, no lleva plan', () => {
    const cuerpo = inscripcionIndividualParaEnviar(form({ correo: ' Ana@Example.com ', plan: '' }), null)
    expect(cuerpo).toMatchObject({ correo: 'ana@example.com' })
    expect(cuerpo).not.toHaveProperty('plan')
    expect(cuerpo).not.toHaveProperty('correoPrefijo')
  })

  it('traduce los errores del backend de la persona a su campo', () => {
    expect(erroresInscripcionIndividual({ 'participantes[0].correo': 'Debe terminar en @unac.edu.pe', 'participantes[0].plan': 'Plan no disponible', correo: 'Escribe tu correo completo' }))
      .toEqual({ correo: 'Escribe tu correo completo', plan: 'Plan no disponible' })
    expect(erroresInscripcionIndividual(undefined)).toEqual({})
  })
})

describe('lista pegada', () => {
  it('completa con cero el DNI de 7 dígitos', () => {
    const { filas, errores } = parsearListaIntegrantes('7969419, Janeth, Mariño, janeth@unat.edu.pe, 954825216')
    expect(errores).toEqual([])
    expect(filas[0]).toMatchObject({ tipoDocumento: 'dni', numeroDocumento: '07969419', correo: 'janeth@unat.edu.pe', celular: '954825216' })
  })

  it('acepta tres columnas con el nombre completo, tabulador y cabecera', () => {
    const { filas, errores } = parsearListaIntegrantes('DNI\tNombres\tCorreo\n70123456\tAna María Pérez\tana@example.com')
    expect(errores).toEqual([])
    expect(filas[0]).toMatchObject({ nombres: 'Ana María', apellidos: 'Pérez' })
  })

  it('señala las líneas incompletas con su número', () => {
    const { filas, errores } = parsearListaIntegrantes('70123456, Ana, ana@example.com\n70123457, Luis, Gómez, correo-malo')
    expect(filas).toHaveLength(0)
    expect(errores).toEqual(expect.arrayContaining([expect.stringContaining('Línea 1: faltan los apellidos'), expect.stringContaining('Línea 2: el correo')]))
  })
})

describe('validación de vouchers', () => {
  it('un voucher completo no tiene errores', () => {
    expect(validarPago(pago(), '2026-10-20')).toEqual({})
  })

  it('exige número, medio, fecha, monto y archivo', () => {
    expect(Object.keys(validarPago({ ...pagoVacio(), billeteraDigital: '' }, '2026-10-20')).sort()).toEqual(['archivo', 'fechaPago', 'medio', 'monto', 'numeroOperacion'])
  })

  it('con banco exige el banco', () => {
    expect(validarPago(pago({ modalidadPago: 'banco', banco: '' }), '2026-10-20').medio).toBeTruthy()
    expect(validarPago(pago({ modalidadPago: 'banco', banco: 'bcp' }), '2026-10-20').medio).toBeUndefined()
  })

  it('rechaza fecha futura, monto en cero y archivos no permitidos o demasiado grandes', () => {
    expect(validarPago(pago({ fechaPago: '2026-10-21' }), '2026-10-20').fechaPago).toMatch(/futura/)
    expect(validarPago(pago({ monto: 0 }), '2026-10-20').monto).toBeTruthy()
    expect(validarPago(pago({ archivo: archivo('voucher.exe') }), '2026-10-20').archivo).toBeTruthy()
    expect(validarPago(pago({ archivo: archivo('voucher.pdf', 6 * 1024 * 1024) }), '2026-10-20').archivo).toMatch(/5 MB/)
  })
})

describe('multipart de vouchers', () => {
  it('lleva un archivo por pago, en el mismo orden, y solo pagos y archivos', () => {
    const cuerpo = construirFormDataPagos([pago(), pago({ modalidadPago: 'banco', banco: 'bcp', tipoOperacion: 'interbancario', numeroOperacion: 'BCP-9', monto: 100, archivo: archivo('dos.pdf') })])
    expect([...cuerpo.keys()].sort()).toEqual(['pagos', CAMPO_VOUCHERS, CAMPO_VOUCHERS].sort())
    expect(JSON.parse(String(cuerpo.get('pagos')))).toEqual([
      { modalidadPago: 'billetera', billeteraDigital: 'yape', numeroOperacion: 'OP-123', fechaPago: '2026-10-15', monto: 250 },
      { modalidadPago: 'banco', banco: 'bcp', tipoOperacion: 'interbancario', numeroOperacion: 'BCP-9', fechaPago: '2026-10-15', monto: 100 },
    ])
    expect((cuerpo.getAll(CAMPO_VOUCHERS) as File[]).map(a => a.name)).toEqual(['voucher.pdf', 'dos.pdf'])
    expect(pagosParaEnviar([pago({ monto: '' })])[0]?.monto).toBe(0)
  })
})

describe('errores de la API', () => {
  it.each([
    ['DELEGATION_NOT_FOUND', /link/],
    ['OPERATION_ALREADY_REGISTERED', /operación/],
    ['REGISTRATION_CLOSED', /cerradas/],
    ['EMAIL_IN_USE', /correo/],
    ['EMAIL_DOMAIN_NOT_ALLOWED', /dominio/],
    ['PLAN_REQUIRED', /plan/i],
    ['DELEGATION_PLAN_NOT_AVAILABLE', /plan/i],
    ['DELEGATION_WITHOUT_PLANS', /planes/],
  ])('%s tiene su mensaje', (code, patron) => {
    expect(mensajeErrorDelegacion({ statusCode: 422, code })).toMatch(patron)
  })

  it('un código desconocido cae en el mensaje general y la red caída en el de conexión', () => {
    expect(mensajeErrorDelegacion({ statusCode: 400, code: 'OTRA' })).toMatch(/No pudimos completar/)
    expect(mensajeErrorDelegacion({ statusCode: 0, code: 'NETWORK_ERROR' })).toMatch(/conectar/)
  })
})

describe('BFF', () => {
  it('el código del link solo admite caracteres seguros', () => {
    expect(codigoLinkValido('9f3a2b1c4d5e6f70')).toBe('9f3a2b1c4d5e6f70')
    expect(codigoLinkValido(' abc123 ')).toBe('abc123')
    for (const malo of ['', 'abc', '../etc/passwd', 'a b c d e f', 'abc123/../x', 'x'.repeat(101), undefined, null]) expect(codigoLinkValido(malo)).toBeNull()
  })

  it('el límite del cuerpo admite 6 vouchers de 5 MB', () => {
    expect(LIMITE_DELEGACION_BYTES).toBeGreaterThan(6 * 5 * 1024 * 1024)
    expect(LIMITE_DELEGACION_BYTES).toBeGreaterThan(LIMITE_MULTIPART_BYTES)
  })
})
