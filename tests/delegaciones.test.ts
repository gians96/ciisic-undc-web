import { describe, expect, it } from 'vitest'
import type { FormularioDelegado, PagoFormulario, TarifaDelegaciones } from '../app/types/delegaciones'
import {
  CAMPO_VOUCHERS, construirFormDataPagos, construirFormDataRegistro, delegadoVacio, documentoLimpio, erroresPorIntegrante, estimarGrupo,
  filaEnBlanco, filaVacia, integrantesParaEnviar, mensajeErrorDelegacion, normalizarDni, pagosParaEnviar, pagoVacio, tarifaDeVista, textoSaldo,
  validarDelegado, validarIntegrantes, validarPago,
} from '../app/utils/delegaciones'
import { parsearListaIntegrantes } from '../app/utils/lista-integrantes'
import { codigoLinkValido, LIMITE_DELEGACION_BYTES, LIMITE_MULTIPART_BYTES } from '../server/utils/api-sitio'

const TARIFA: TarifaDelegaciones = { minIntegrantes: 10, precioEstandar: 60, precioPromocional: 50, virtual: { precio: 30 } }

const archivo = (nombre = 'voucher.pdf', tamano = 1024) => new File([new Uint8Array(tamano)], nombre, { type: 'application/pdf' })

const delegado = (extra: Partial<FormularioDelegado> = {}): FormularioDelegado => ({
  tipoDocumento: 'dni', numeroDocumento: '23715269', nombres: 'Ángel', apellidos: 'Almidón Elescano', correo: 'Angel.Almidon@unh.edu.pe', celular: '990866060', esIntegrante: true, ...extra,
})

const pago = (extra: Partial<PagoFormulario> = {}): PagoFormulario => ({
  ...pagoVacio(), billeteraDigital: 'yape', numeroOperacion: 'OP-123', fechaPago: '2026-10-15', monto: 250, archivo: archivo(), ...extra,
})

describe('estimado en vivo', () => {
  it.each([
    [0, 60, 0, 10, false], [1, 60, 60, 9, false], [9, 60, 540, 1, false], [10, 50, 500, null, true], [24, 50, 1200, null, true],
  ])('presencial con %i integrantes: S/ %i c/u, total %i', (cantidad, unitario, total, faltan, promocional) => {
    expect(estimarGrupo('PRESENCIAL', cantidad, TARIFA)).toEqual({ precioUnitario: unitario, total, faltan, promocional })
  })

  it('virtual paga la tarifa única sin escalas', () => {
    expect(estimarGrupo('VIRTUAL', 3, TARIFA)).toEqual({ precioUnitario: 30, total: 90, faltan: null, promocional: false })
    expect(estimarGrupo('VIRTUAL', 24, TARIFA)).toEqual({ precioUnitario: 30, total: 720, faltan: null, promocional: false })
  })

  it('una cantidad inválida cuenta como cero', () => {
    expect(estimarGrupo('PRESENCIAL', Number.NaN, TARIFA).total).toBe(0)
    expect(estimarGrupo('PRESENCIAL', -2, TARIFA).total).toBe(0)
  })

  it('una delegación ya registrada estima con su propia tarifa', () => {
    const tarifa = tarifaDeVista({ modalidad: 'VIRTUAL', minIntegrantes: 10, precioEstandar: 30, precioPromocional: 30 })
    expect(tarifa.virtual).toEqual({ precio: 30 })
    expect(estimarGrupo('VIRTUAL', 5, tarifa).total).toBe(150)
    expect(tarifaDeVista({ modalidad: 'PRESENCIAL', minIntegrantes: 10, precioEstandar: 60, precioPromocional: 50 }).virtual).toBeNull()
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

describe('validación del delegado', () => {
  it('un delegado completo no tiene errores', () => {
    expect(validarDelegado(delegado())).toEqual({})
  })

  it('el DNI de 7 dígitos se acepta (se completa a 8)', () => {
    expect(validarDelegado(delegado({ numeroDocumento: '7969419' }))).toEqual({})
  })

  it('exige documento, nombres, apellidos, correo y celular', () => {
    const errores = validarDelegado(delegadoVacio())
    expect(Object.keys(errores).sort()).toEqual(['apellidos', 'celular', 'correo', 'nombres', 'numeroDocumento'])
  })

  it('el celular peruano tiene 9 dígitos y empieza con 9', () => {
    expect(validarDelegado(delegado({ celular: '812345678' })).celular).toBeTruthy()
    expect(validarDelegado(delegado({ celular: '990 866 060' })).celular).toBeUndefined()
  })
})

describe('validación de integrantes', () => {
  const fila = (extra: Record<string, string> = {}) => ({ ...filaVacia(), numeroDocumento: '70000001', nombres: 'Ana', apellidos: 'Ríos', correo: 'ana@example.com', ...extra })

  it('ignora las filas en blanco', () => {
    expect(filaEnBlanco(filaVacia())).toBe(true)
    expect(validarIntegrantes([filaVacia(), filaVacia()])).toEqual({})
  })

  it('señala los campos que faltan en una fila con datos', () => {
    const incompleta = { ...filaVacia(), numeroDocumento: '123' }
    expect(Object.keys(validarIntegrantes([incompleta])[incompleta.clave] ?? {}).sort()).toEqual(['apellidos', 'correo', 'nombres', 'numeroDocumento'])
  })

  it('detecta documentos y correos repetidos, también contra el delegado', () => {
    const a = fila()
    const b = fila({ nombres: 'Luis' })
    const errores = validarIntegrantes([a, b])
    expect(errores[b.clave]?.numeroDocumento).toMatch(/repetido/)
    expect(errores[b.clave]?.correo).toMatch(/repetido/)
    expect(errores[a.clave]).toBeUndefined()

    const contraDelegado = validarIntegrantes([fila({ numeroDocumento: '23715269', correo: 'otro@example.com' })], delegado())
    expect(Object.values(contraDelegado)[0]?.numeroDocumento).toMatch(/repetido/)
    const correoDelegado = validarIntegrantes([fila({ correo: 'angel.almidon@unh.edu.pe' })], delegado())
    expect(Object.values(correoDelegado)[0]?.correo).toMatch(/repetido/)
  })

  it('limpia las filas para enviar: DNI de 7 dígitos, correo en minúsculas y celular solo con dígitos', () => {
    const con = { ...filaVacia(), numeroDocumento: ' 7969419 ', nombres: ' Janeth  Bertha ', apellidos: 'Mariño', correo: ' JANETH@unat.edu.pe ', celular: '954 825 216' }
    expect(integrantesParaEnviar([filaVacia(), con])).toEqual([{
      tipoDocumento: 'dni', numeroDocumento: '07969419', nombres: 'Janeth Bertha', apellidos: 'Mariño', correo: 'janeth@unat.edu.pe', celular: '954825216',
    }])
  })

  it('traduce los errores del backend por posición a la fila correspondiente', () => {
    const errores = erroresPorIntegrante({ 'participantes[1].correo': 'Correo de otra persona', 'participantes[0].numeroDocumento': 'Ya inscrito', 'representante.correo': 'x' }, 1)
    // Con el delegado como integrante 1, la posición 1 del backend es la fila 0 del formulario y la posición 0 es el delegado
    expect(errores).toEqual({ 0: { correo: 'Correo de otra persona' } })
    expect(erroresPorIntegrante({ 'participantes[2].correo': 'x' })).toEqual({ 2: { correo: 'x' } })
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

describe('multipart', () => {
  const datos = () => ({
    modalidad: 'VIRTUAL' as const,
    delegacion: { nombre: ' Ing.   de Sistemas ', institucion: 'UNAT' },
    delegado: delegado(),
    integrantes: [{ ...filaVacia(), numeroDocumento: '70000001', nombres: 'Ana', apellidos: 'Ríos', correo: 'ana@example.com', celular: '' }, filaVacia()],
    pagos: [pago(), pago({ modalidadPago: 'banco', banco: 'bcp', tipoOperacion: 'interbancario', numeroOperacion: 'BCP-9', monto: 100, archivo: archivo('dos.pdf') })],
  })

  it('el registro lleva los campos del contrato y nunca precios ni tipos', () => {
    const cuerpo = construirFormDataRegistro(datos())
    expect([...cuerpo.keys()].filter(clave => clave !== CAMPO_VOUCHERS).sort()).toEqual(['delegacion', 'modalidad', 'pagos', 'participantes', 'representante'])
    expect(cuerpo.get('modalidad')).toBe('VIRTUAL')
    expect(JSON.parse(String(cuerpo.get('delegacion')))).toEqual({ nombre: 'Ing. de Sistemas', institucion: 'UNAT' })
    expect(JSON.parse(String(cuerpo.get('representante')))).toEqual({
      nombres: 'Ángel', apellidos: 'Almidón Elescano', tipoDocumento: 'dni', numeroDocumento: '23715269', correo: 'angel.almidon@unh.edu.pe', celular: '990866060', esIntegrante: true,
    })
    // La fila en blanco no se envía
    expect(JSON.parse(String(cuerpo.get('participantes')))).toHaveLength(1)
    const texto = JSON.stringify([...cuerpo.entries()].filter(([clave]) => clave !== CAMPO_VOUCHERS))
    // El monto de cada voucher es lo que dice el voucher; el precio, el total y el tipo los decide el servidor
    expect(texto).not.toMatch(/precio|tipoInscripcion|montoTotal/i)
  })

  it('lleva un archivo por pago, en el mismo orden', () => {
    const cuerpo = construirFormDataRegistro(datos())
    const pagos = JSON.parse(String(cuerpo.get('pagos'))) as Array<Record<string, unknown>>
    expect(pagos).toEqual([
      { modalidadPago: 'billetera', billeteraDigital: 'yape', numeroOperacion: 'OP-123', fechaPago: '2026-10-15', monto: 250 },
      { modalidadPago: 'banco', banco: 'bcp', tipoOperacion: 'interbancario', numeroOperacion: 'BCP-9', fechaPago: '2026-10-15', monto: 100 },
    ])
    const archivos = cuerpo.getAll(CAMPO_VOUCHERS) as File[]
    expect(archivos.map(a => a.name)).toEqual(['voucher.pdf', 'dos.pdf'])
  })

  it('con el link va el código; sin él, no', () => {
    expect(construirFormDataRegistro({ ...datos(), codigoLink: 'abc123def456' }).get('codigoLink')).toBe('abc123def456')
    expect(construirFormDataRegistro(datos()).has('codigoLink')).toBe(false)
  })

  it('los vouchers de un link llevan solo pagos y archivos', () => {
    const cuerpo = construirFormDataPagos([pago()])
    expect([...cuerpo.keys()].sort()).toEqual(['pagos', CAMPO_VOUCHERS].sort())
    expect(pagosParaEnviar([pago({ monto: '' })])[0]?.monto).toBe(0)
  })
})

describe('errores de la API', () => {
  it.each([
    ['DELEGATION_NOT_FOUND', /link/],
    ['OPERATION_ALREADY_REGISTERED', /operación/],
    ['REGISTRATION_CLOSED', /cerradas/],
    ['DELEGATION_MODALITY_NOT_AVAILABLE', /virtual/],
    ['EMAIL_IN_USE', /correo/],
  ])('%s tiene su mensaje', (code, patron) => {
    expect(mensajeErrorDelegacion({ statusCode: 409, code })).toMatch(patron)
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
