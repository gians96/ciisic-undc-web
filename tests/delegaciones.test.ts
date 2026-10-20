import { describe, expect, it } from 'vitest'
import type { FilaParticipante, RepresentanteDelegacion } from '../app/types/delegaciones'
import type { PlanInscripcion } from '../app/utils/planes'
import {
  MAXIMO_PARTICIPANTES_DELEGACION,
  aRegistroDelegacion,
  erroresDatosDelegacion,
  erroresParticipante,
  erroresRepresentante,
  estimadoTotal,
  mensajeTiposDelegacionFaltantes,
  normalizarParticipantes,
  normalizarRepresentante,
  parsearParticipantesDelegacion,
  precioUnitarioDelegacion,
  tarjetasDelegacion,
  tiposDelegacionCompletos,
  validarDatosDelegacion,
  validarFilasParticipantes,
  validarPagoDelegacion,
  validarRepresentante,
  validarTipoDelegacion,
} from '../app/utils/delegaciones'

// Forma de una fila completa y válida (mismas reglas que el backend)
const fila = (cambios: Partial<FilaParticipante> = {}): FilaParticipante => ({
  tipoDocumento: 'dni',
  numeroDocumento: '12345678',
  nombres: 'Ana',
  apellidos: 'Torres',
  correo: 'ana@example.com',
  celular: '999888777',
  ...cambios,
})

const representante = (cambios: Partial<RepresentanteDelegacion> = {}): RepresentanteDelegacion => ({
  nombres: 'Rosa',
  apellidos: 'Quispe',
  tipoDocumento: 'dni',
  numeroDocumento: '87654321',
  correo: 'rosa@example.com',
  celular: '999888777',
  esIntegrante: true,
  ...cambios,
})

const datosDelegacion = {
  nombre: 'Delegación Ingeniería',
  institucion: 'UNDC',
}

const pago = (cambios: Record<string, unknown> = {}) => ({
  modalidadPago: 'banco' as const,
  banco: 'bcp',
  tipoOperacion: 'directo',
  billeteraDigital: null,
  numeroOperacion: 'OP-12345',
  fechaPago: '2026-01-15',
  voucher: { name: 'voucher.pdf', size: 1024, type: 'application/pdf' },
  ...cambios,
})

const archivo = () => new File(['contenido'], 'voucher.pdf', { type: 'application/pdf' })

describe('erroresParticipante', () => {
  it('una fila completa y válida no tiene errores', () => {
    expect(erroresParticipante(fila())).toEqual({})
    expect(erroresParticipante(fila({ tipoDocumento: 'ce', numeroDocumento: 'ABCDE1234', celular: '' }))).toEqual({})
    expect(erroresParticipante(fila({ celular: '+51999888777' }))).toEqual({})
  })

  it('valida el documento según el tipo (igual que el backend)', () => {
    expect(erroresParticipante(fila({ numeroDocumento: '1234567' })).numeroDocumento).toBe('El DNI debe tener 8 dígitos')
    expect(erroresParticipante(fila({ numeroDocumento: '1234567a' })).numeroDocumento).toBe('El DNI debe tener 8 dígitos')
    expect(erroresParticipante(fila({ tipoDocumento: 'ce', numeroDocumento: 'ABCDE123' })).numeroDocumento).toBe('El carné debe tener entre 9 y 12 caracteres')
    expect(erroresParticipante(fila({ tipoDocumento: 'ce', numeroDocumento: 'ABCDE12345678' })).numeroDocumento).toBe('El carné debe tener entre 9 y 12 caracteres')
  })

  it('valida nombres, apellidos, correo y celular', () => {
    expect(erroresParticipante(fila({ nombres: 'A' })).nombres).toBe('Entre 2 y 120 caracteres')
    expect(erroresParticipante(fila({ apellidos: '' })).apellidos).toBe('Entre 2 y 120 caracteres')
    expect(erroresParticipante(fila({ correo: 'no-es-correo' })).correo).toBe('Ingresa un correo válido')
    expect(erroresParticipante(fila({ celular: '123' })).celular).toBe('El celular debe tener entre 9 y 15 dígitos')
    // El celular vacío es válido: la carga solo exige documento, nombres y correo
    expect(erroresParticipante(fila({ celular: '' })).celular).toBeUndefined()
  })
})

describe('representante', () => {
  it('un representante completo no tiene errores', () => {
    expect(erroresRepresentante(representante())).toEqual({})
    expect(validarRepresentante(representante())).toBeNull()
  })

  it('valida los mismos campos que un integrante', () => {
    expect(erroresRepresentante(representante({ numeroDocumento: '123' })).numeroDocumento).toBe('El DNI debe tener 8 dígitos')
    expect(erroresRepresentante(representante({ correo: 'no-correo' })).correo).toBe('Ingresa un correo válido')
    expect(erroresRepresentante(representante({ celular: '' })).celular).toBeUndefined()
    expect(validarRepresentante(representante({ nombres: '' }))).toContain('Datos del representante')
  })
})

describe('validarFilasParticipantes', () => {
  it('pide al menos un integrante y no superar el máximo', () => {
    expect(validarFilasParticipantes([])).toBe('Agrega al menos un integrante.')
    const muchas = Array.from({ length: MAXIMO_PARTICIPANTES_DELEGACION + 1 }, () => fila())
    expect(validarFilasParticipantes(muchas)).toBe(`Puedes registrar hasta ${MAXIMO_PARTICIPANTES_DELEGACION} integrantes por carga.`)
  })

  it('detecta documentos y correos repetidos en la misma lista', () => {
    expect(validarFilasParticipantes([fila(), fila({ nombres: 'Otra', apellidos: 'Persona' })]))
      .toBe('Fila 2: el documento 12345678 está repetido en la lista.')
    expect(validarFilasParticipantes([fila(), fila({ numeroDocumento: '87654321' })]))
      .toBe('Fila 2: el correo ana@example.com está repetido en la lista.')
  })

  it('señala la fila con el primer campo inválido', () => {
    expect(validarFilasParticipantes([fila(), fila({ numeroDocumento: '87654321', correo: 'b@example.com', nombres: '' })]))
      .toBe('Fila 2: Entre 2 y 120 caracteres')
  })

  it('una lista completa y válida pasa', () => {
    expect(validarFilasParticipantes([
      fila(),
      fila({ tipoDocumento: 'ce', numeroDocumento: 'ABCDE1234', nombres: 'Luis', apellidos: 'Paredes', correo: 'luis@example.com', celular: '' }),
    ])).toBeNull()
  })
})

describe('datos de la delegación', () => {
  it('los datos del ejemplo no tienen errores', () => {
    expect(erroresDatosDelegacion(datosDelegacion)).toEqual({})
    expect(validarDatosDelegacion(datosDelegacion)).toBeNull()
    // La institución puede ir vacía
    expect(erroresDatosDelegacion({ ...datosDelegacion, institucion: '' })).toEqual({})
  })

  it('valida el nombre y la institución', () => {
    expect(erroresDatosDelegacion({ ...datosDelegacion, nombre: 'A' }).nombre).toBe('Entre 2 y 150 caracteres')
    expect(erroresDatosDelegacion({ ...datosDelegacion, institucion: 'x'.repeat(192) }).institucion).toBe('Máximo 191 caracteres')
    expect(validarDatosDelegacion({ ...datosDelegacion, nombre: '' })).toContain('Datos de la delegación')
  })
})

describe('validarPagoDelegacion', () => {
  it('un pago completo y no futuro es válido', () => {
    expect(validarPagoDelegacion(pago())).toBeNull()
    expect(validarPagoDelegacion(pago({ billeteraDigital: 'yape', banco: null, tipoOperacion: null }))).toBeNull()
  })

  it('pide el voucher, el código y una fecha válida no futura', () => {
    expect(validarPagoDelegacion(pago({ voucher: null }))).toBe('Adjunta el voucher de pago.')
    expect(validarPagoDelegacion(pago({ voucher: { name: 'v.pdf', size: 6 * 1024 * 1024, type: 'application/pdf' } }))).toBe('El voucher no debe superar los 5 MB.')
    expect(validarPagoDelegacion(pago({ numeroOperacion: 'ab' }))).toBe('Escribe el código del voucher (entre 3 y 100 caracteres).')
    expect(validarPagoDelegacion(pago({ fechaPago: 'no-es-fecha' }))).toBe('Ingresa una fecha de pago válida.')
    expect(validarPagoDelegacion(pago({ fechaPago: '2999-01-01' }))).toBe('La fecha de pago no puede ser futura.')
  })
})

describe('precioUnitarioDelegacion', () => {
  it('aplica la promocional al cruzar el mínimo (misma regla que el backend)', () => {
    expect(precioUnitarioDelegacion(60, 50, 10, 9)).toBe(60)
    expect(precioUnitarioDelegacion(60, 50, 10, 10)).toBe(50)
    expect(precioUnitarioDelegacion(80, 65, 5, 4)).toBe(80)
    expect(precioUnitarioDelegacion(80, 65, 5, 5)).toBe(65)
  })
})

describe('estimadoTotal', () => {
  it('multiplica la tarifa vigente por la cantidad, solo para mostrar', () => {
    const tarifa = { minIntegrantes: 10, precioEstandar: 60, precioPromocional: 50 }
    expect(estimadoTotal(tarifa, 12)).toBe(600)
    expect(estimadoTotal(tarifa, 8)).toBe(480)
    expect(estimadoTotal(tarifa, 0)).toBe(0)
  })
})

describe('normalizarParticipantes', () => {
  it('limpia los campos como espera el backend', () => {
    expect(normalizarParticipantes([fila({
      numeroDocumento: ' 12345678 ',
      nombres: '  Ana  ',
      apellidos: ' Torres ',
      correo: ' Ana@Example.com ',
      celular: '999 888 777',
    })])).toEqual([{
      tipoDocumento: 'dni',
      numeroDocumento: '12345678',
      nombres: 'Ana',
      apellidos: 'Torres',
      correo: 'ana@example.com',
      celular: '999888777',
    }])
  })
})

describe('normalizarRepresentante', () => {
  it('limpia los campos y conserva la casilla de integrante', () => {
    expect(normalizarRepresentante({
      ...representante(),
      numeroDocumento: ' 87654321 ',
      nombres: '  Rosa ',
      apellidos: ' Quispe ',
      correo: ' Rosa@Example.com ',
      celular: '999 888 777',
    })).toEqual({
      tipoDocumento: 'dni',
      numeroDocumento: '87654321',
      nombres: 'Rosa',
      apellidos: 'Quispe',
      correo: 'rosa@example.com',
      celular: '999888777',
      esIntegrante: true,
    })
  })
})

describe('parsearParticipantesDelegacion', () => {
  it('lee una persona por línea con 3, 4 o 5 columnas', () => {
    const { filas, errores } = parsearParticipantesDelegacion([
      '70000001, Ana, Torres, ana@example.com, 999888777',
      '70000002, Luis, Paredes, luis@example.com',
      '70000003, Pedro Soto, pedro@example.com',
    ].join('\n'))
    expect(errores).toEqual([])
    expect(filas).toHaveLength(3)
    expect(filas[0]).toEqual({
      tipoDocumento: 'dni', numeroDocumento: '70000001', nombres: 'Ana', apellidos: 'Torres',
      correo: 'ana@example.com', celular: '999888777',
    })
    expect(filas[1].celular).toBe('')
    // El nombre completo en una columna: la última palabra es el apellido
    expect(filas[2]).toMatchObject({ nombres: 'Pedro', apellidos: 'Soto' })
  })

  it('acepta coma, punto y coma o tabulador, e ignora la cabecera', () => {
    const { filas, errores } = parsearParticipantesDelegacion([
      'DNI\tNombres\tApellidos\tCorreo',
      '70000001; Ana; Torres; ana@example.com',
    ].join('\n'))
    expect(errores).toEqual([])
    expect(filas).toHaveLength(1)
    expect(filas[0].numeroDocumento).toBe('70000001')
  })

  it('informa el número de línea de cada error', () => {
    const { filas, errores } = parsearParticipantesDelegacion([
      '70000001, Ana, Torres, ana@example.com',
      'esto, no, son, cuatro, campos, de, mas',
      '70000003, Pedro, Soto, no-es-correo',
    ].join('\n'))
    expect(filas).toHaveLength(1)
    expect(errores).toHaveLength(2)
    expect(errores[0]).toContain('Línea 2')
    expect(errores[1]).toContain('Línea 3')
  })

  it('un carné de extranjería no es un DNI', () => {
    const { filas } = parsearParticipantesDelegacion('ABCDE1234, Ana, Torres, ana@example.com')
    expect(filas[0].tipoDocumento).toBe('ce')
  })
})

describe('aRegistroDelegacion', () => {
  const registro = () => ({
    delegacion: { ...datosDelegacion, institucion: '' },
    representante: representante(),
    participantes: [fila({ celular: '' })],
    pago: { ...pago(), voucher: archivo() } as never,
  })

  it('arma el multipart del contrato (delegación, representante y participantes en JSON)', () => {
    const cuerpo = aRegistroDelegacion(registro())
    expect(JSON.parse(String(cuerpo.get('delegacion')))).toEqual({
      nombre: 'Delegación Ingeniería',
      institucion: null,
    })
    expect(JSON.parse(String(cuerpo.get('representante')))).toMatchObject({
      nombres: 'Rosa',
      apellidos: 'Quispe',
      tipoDocumento: 'dni',
      numeroDocumento: '87654321',
      correo: 'rosa@example.com',
      celular: '999888777',
      esIntegrante: true,
    })
    expect(JSON.parse(String(cuerpo.get('participantes')))).toEqual([{
      tipoDocumento: 'dni',
      numeroDocumento: '12345678',
      nombres: 'Ana',
      apellidos: 'Torres',
      correo: 'ana@example.com',
      celular: '',
    }])
    expect(cuerpo.get('modalidadPago')).toBe('banco')
    expect(cuerpo.get('banco')).toBe('bcp')
    expect(cuerpo.get('tipoOperacion')).toBe('directo')
    expect(cuerpo.get('numeroOperacion')).toBe('OP-12345')
    expect(cuerpo.get('fechaPago')).toBe('2026-01-15')
    const archivoVoucher = cuerpo.get('voucher') as File
    expect(archivoVoucher.name).toBe('voucher.pdf')
  })

  it('sin el tipo elegido no manda tipoInscripcionId (cliente antiguo sigue funcionando)', () => {
    expect(aRegistroDelegacion(registro()).get('tipoInscripcionId')).toBeNull()
  })

  it('con el tipo elegido manda tipoInscripcionId (spec 019)', () => {
    expect(aRegistroDelegacion({ ...registro(), tipoInscripcionId: 31 }).get('tipoInscripcionId')).toBe('31')
    // Un id absurdo no se manda: el backend validaría y respondería 422
    expect(aRegistroDelegacion({ ...registro(), tipoInscripcionId: 0 }).get('tipoInscripcionId')).toBeNull()
  })

  it('con link manda el código para que el registro se sume a esa delegación', () => {
    const cuerpo = aRegistroDelegacion({ ...registro(), codigoLink: 'abc123def456' })
    expect(cuerpo.get('codigoLink')).toBe('abc123def456')
  })

  it('sin link no manda el campo del código', () => {
    expect(aRegistroDelegacion(registro()).get('codigoLink')).toBeNull()
    expect(aRegistroDelegacion({ ...registro(), codigoLink: '  ' }).get('codigoLink')).toBeNull()
  })

  it('con billetera envía billeteraDigital y omite los campos de banco', () => {
    const cuerpo = aRegistroDelegacion({
      ...registro(),
      pago: { ...pago({ modalidadPago: 'billetera', banco: null, tipoOperacion: null, billeteraDigital: 'yape' }), voucher: archivo() } as never,
    })
    expect(cuerpo.get('billeteraDigital')).toBe('yape')
    expect(cuerpo.get('banco')).toBeNull()
    expect(cuerpo.get('tipoOperacion')).toBeNull()
  })
})

// ─── Tarjetas de tipo de delegación (spec 019) ──────────────────────────────

const planTipo = (cambios: Partial<PlanInscripcion> = {}): PlanInscripcion => ({
  id: 31,
  codigo: 'delegacion_general',
  title: 'Delegación General',
  badge: '',
  basePrice: 60,
  institutionalPrice: 60,
  description: 'Precio estándar por debajo del mínimo de integrantes.',
  features: [],
  categoria: 'DELEGACIONES',
  esEstudiantil: false,
  disponiblePara: 'TODOS',
  ...cambios,
})

describe('tarjetasDelegacion', () => {
  it('arma las dos tarjetas del contrato en su orden (General → Promocional)', () => {
    const tarjetas = tarjetasDelegacion([
      planTipo({ id: 32, codigo: 'delegacion_grupal', title: 'Delegación Promocional', basePrice: 50 }),
      planTipo(),
    ])
    expect(tarjetas.map(tarjeta => tarjeta.codigo)).toEqual(['delegacion_general', 'delegacion_grupal'])
    expect(tarjetas[0]).toMatchObject({ id: 31, titulo: 'Delegación General', precio: 60 })
    expect(tarjetas[1]).toMatchObject({ id: 32, titulo: 'Delegación Promocional', precio: 50 })
    expect(tiposDelegacionCompletos(tarjetas)).toBe(true)
  })

  it('copia el badge y las características para la tarjeta', () => {
    const [tarjeta] = tarjetasDelegacion([planTipo({ badge: 'GENERAL', features: [{ icon: 'heroicons:users', text: 'Hasta 9 personas al precio estándar' }] })])
    expect(tarjeta).toMatchObject({ badge: 'GENERAL', caracteristicas: [{ icon: 'heroicons:users', text: 'Hasta 9 personas al precio estándar' }] })
  })

  it('omite las tarjetas que falten y avisa con los códigos del contrato', () => {
    const tarjetas = tarjetasDelegacion([planTipo()])
    expect(tarjetas).toHaveLength(1)
    expect(tiposDelegacionCompletos(tarjetas)).toBe(false)
    const mensaje = mensajeTiposDelegacionFaltantes(tarjetas)
    expect(mensaje).toContain('delegacion_grupal')
    expect(mensaje).not.toContain('delegacion_general')
  })

  it('ignora los planes de otras categorías', () => {
    expect(tarjetasDelegacion([planTipo({ codigo: 'general_sin_kit' })])).toEqual([])
    expect(tiposDelegacionCompletos([])).toBe(false)
    expect(mensajeTiposDelegacionFaltantes([])).toContain('delegacion_general y delegacion_grupal')
  })
})

describe('validarTipoDelegacion', () => {
  const tarjetas = tarjetasDelegacion([
    planTipo(),
    planTipo({ id: 32, codigo: 'delegacion_grupal', title: 'Delegación Promocional', basePrice: 50 }),
  ])

  it('pide elegir el tipo y valida que el id sea de las tarjetas ofrecidas', () => {
    expect(validarTipoDelegacion(tarjetas, null)).toBe('Elige el tipo de delegación.')
    expect(validarTipoDelegacion(tarjetas, 31)).toBeNull()
    expect(validarTipoDelegacion(tarjetas, 32)).toBeNull()
    expect(validarTipoDelegacion(tarjetas, 999)).toBe('Elige un tipo de delegación válido.')
  })
})
