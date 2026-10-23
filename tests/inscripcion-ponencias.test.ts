import { describe, expect, it } from 'vitest'
import type { PonenciaEspecializadaPublica } from '../app/types/ponencias-especializadas'
import {
  accesoLibreDe,
  alternarSeleccion,
  cuerpoInscripcion,
  cuerpoVerificacion,
  depurarSeleccion,
  destinoTrasElegir,
  esErrorDeCongreso,
  etiquetaModoAsistencia,
  filtrarPonencias,
  ponentesDeLaPonencia,
  formularioVacio,
  mensajeErrorInscripcionPonencias,
  motivoNoDisponible,
  nivelDeCupos,
  normalizarDocumento,
  pideNombres,
  ponenciaEnConflicto,
  ponenciasPorDia,
  ponenciasVisibles,
  programaNoDisponible,
  seCruzan,
  textoCupos,
  validarFormulario,
  validarVerificacion,
} from '../app/utils/inscripcion-ponencias'

const ponencia = (datos: Partial<PonenciaEspecializadaPublica> = {}): PonenciaEspecializadaPublica => ({
  id: 1, tema: 'Bases de datos vectoriales', fecha: '2026-10-27', horaInicio: '12:00', horaFin: '12:45', duracionMin: 45, ambiente: 'Laboratorio 2',
  modalidad: 'PRESENCIAL', precio: 0, esGratuita: true, cupo: 20, cuposDisponibles: 15, llena: false,
  ponente: { nombre: 'Ph.D. Edwin Roque Tito', bio: null, foto: null, externo: false }, orden: 2, ...datos,
})

const MARTES_1 = ponencia({ id: 1, ambiente: 'Laboratorio 1', orden: 1 })
const MARTES_2 = ponencia({ id: 2, ambiente: 'Laboratorio 2', orden: 2 })
const MARTES_TARDE = ponencia({ id: 3, horaInicio: '15:00', horaFin: '15:45', ambiente: 'Aula 3', orden: 3 })
const MIERCOLES = ponencia({ id: 4, fecha: '2026-10-28', ambiente: 'Laboratorio 1', orden: 4 })
const TODAS = [MARTES_1, MARTES_2, MARTES_TARDE, MIERCOLES]

describe('programa', () => {
  it('agrupa por día y ordena por hora, orden y ambiente numérico', () => {
    const dias = ponenciasPorDia([
      ponencia({ id: 9, fecha: '2026-10-28', ambiente: 'Aula 3' }),
      ponencia({ id: 8, ambiente: 'Laboratorio 10', orden: 5 }),
      ponencia({ id: 7, ambiente: 'Laboratorio 2', orden: 5 }),
      ponencia({ id: 6, ambiente: 'Aula 5', horaInicio: '11:00', horaFin: '11:45' }),
    ])
    expect(dias.map(d => d.fecha)).toEqual(['2026-10-27', '2026-10-28'])
    expect(dias[0]!.etiqueta).toBe('Martes 27 de octubre')
    expect(dias[0]!.ponencias.map(p => p.id)).toEqual([6, 7, 8])
  })

  it('dos ponencias se cruzan solo el mismo día y con horarios solapados', () => {
    expect(seCruzan(MARTES_1, MARTES_2)).toBe(true)
    expect(seCruzan(MARTES_1, MARTES_TARDE)).toBe(false)
    expect(seCruzan(MARTES_1, MIERCOLES)).toBe(false)
    expect(seCruzan(ponencia({ horaInicio: '12:45', horaFin: '13:30' }), MARTES_1)).toBe(false)
    expect(seCruzan(ponencia({ horaInicio: '12:30', horaFin: '13:15' }), MARTES_1)).toBe(true)
  })

  it('solo se pueden elegir las gratuitas con cupo', () => {
    expect(motivoNoDisponible(MARTES_1)).toBeNull()
    expect(motivoNoDisponible(ponencia({ llena: true, cuposDisponibles: 0 }))).toBe('AGOTADA')
    expect(motivoNoDisponible(ponencia({ esGratuita: false, precio: 10 }))).toBe('DE_PAGO')
    // De pago manda sobre agotada: no se ofrece de ninguna manera
    expect(motivoNoDisponible(ponencia({ esGratuita: false, precio: 10, llena: true }))).toBe('DE_PAGO')
  })

  it('textos y niveles de los cupos', () => {
    expect(textoCupos(ponencia({ cuposDisponibles: 15 }))).toBe('Quedan 15 de 20')
    expect(textoCupos(ponencia({ cuposDisponibles: 1 }))).toBe('Último cupo')
    expect(textoCupos(ponencia({ cuposDisponibles: 0 }))).toBe('Sin cupos')
    expect(textoCupos(ponencia({ cupo: null, cuposDisponibles: null }))).toBe('Sin límite de cupos')
    expect(nivelDeCupos(ponencia({ cuposDisponibles: 15 }))).toBe('ok')
    expect(nivelDeCupos(ponencia({ cuposDisponibles: 6 }))).toBe('poco')
    expect(nivelDeCupos(ponencia({ cuposDisponibles: 0 }))).toBe('agotada')
    expect(nivelDeCupos(ponencia({ cupo: null, cuposDisponibles: null }))).toBe('libre')
  })
})

describe('selección', () => {
  it('elegir una ponencia la agrega y volver a pulsarla la quita', () => {
    const una = alternarSeleccion([], MARTES_1, TODAS)
    expect(una).toEqual([1])
    expect(alternarSeleccion(una, MARTES_1, TODAS)).toEqual([])
  })

  it('elegir una del mismo horario reemplaza a la anterior; una de otro horario o día se suma', () => {
    expect(alternarSeleccion([1], MARTES_2, TODAS)).toEqual([2])
    expect(alternarSeleccion([1], MARTES_TARDE, TODAS)).toEqual([1, 3])
    expect(alternarSeleccion([1, 3], MIERCOLES, TODAS)).toEqual([1, 3, 4])
  })

  it('no agrega las no disponibles y no pasa del máximo por inscripción', () => {
    const agotada = ponencia({ id: 5, horaInicio: '17:00', horaFin: '17:45', llena: true, cuposDisponibles: 0 })
    expect(alternarSeleccion([1], agotada, [...TODAS, agotada])).toEqual([1])
    const muchas = [1, 2, 3, 4, 5].map(i => ponencia({ id: 10 + i, fecha: `2026-11-0${i}` }))
    let seleccion: number[] = []
    for (const p of muchas) seleccion = alternarSeleccion(seleccion, p, muchas)
    expect(seleccion).toHaveLength(4)
    expect(seleccion).toEqual([12, 13, 14, 15])
  })

  it('quitar una agotada que ya estaba elegida sí se permite', () => {
    const agotada = ponencia({ id: 5, llena: true, cuposDisponibles: 0 })
    expect(alternarSeleccion([5], agotada, [agotada])).toEqual([])
  })

  it('avisa a cuál reemplazaría', () => {
    expect(ponenciaEnConflicto(MARTES_2, [1], TODAS)?.id).toBe(1)
    expect(ponenciaEnConflicto(MARTES_1, [1], TODAS)).toBeNull()
    expect(ponenciaEnConflicto(MARTES_TARDE, [1], TODAS)).toBeNull()
  })

  it('al recargar el programa se descartan las que ya no existen o se agotaron', () => {
    const recargadas = [MARTES_1, ponencia({ id: 2, llena: true, cuposDisponibles: 0 }), MARTES_TARDE]
    expect(depurarSeleccion([1, 2, 3, 99], recargadas)).toEqual([1, 3])
  })
})

describe('búsqueda', () => {
  const kali = ponencia({ id: 7, tema: 'Ciberseguridad con Kali Linux', ambiente: 'Laboratorio 3', ponente: { nombre: 'M.Sc. Daniel Alejandro Yucra Sotomayor', bio: null, foto: null, externo: false } })
  const lista = [MARTES_1, kali, MIERCOLES]

  it('sin texto devuelve todas y no modifica el arreglo original', () => {
    expect(filtrarPonencias(lista, '')).toEqual(lista)
    expect(filtrarPonencias(lista, '   ')).toEqual(lista)
    expect(filtrarPonencias(lista, '')).not.toBe(lista)
  })

  it('busca por tema, ponente, ambiente, hora y día, sin tildes ni mayúsculas', () => {
    expect(filtrarPonencias(lista, 'KALI').map(p => p.id)).toEqual([7])
    expect(filtrarPonencias(lista, 'yucra').map(p => p.id)).toEqual([7])
    expect(filtrarPonencias(lista, 'laboratorio 3').map(p => p.id)).toEqual([7])
    expect(filtrarPonencias(lista, 'miercoles').map(p => p.id)).toEqual([4])
    expect(filtrarPonencias(lista, 'miércoles').map(p => p.id)).toEqual([4])
    expect(filtrarPonencias(lista, '12:00')).toHaveLength(3)
  })

  it('exige todas las palabras y no encuentra lo que no existe', () => {
    expect(filtrarPonencias(lista, 'kali daniel').map(p => p.id)).toEqual([7])
    expect(filtrarPonencias(lista, 'kali edwin')).toEqual([])
    expect(filtrarPonencias(lista, 'blockchain')).toEqual([])
  })

  it('un tema compartido se encuentra también por el nombre de cualquiera de sus ponentes', () => {
    const compartido = ponencia({
      id: 9, tema: 'Automatización y control', ambiente: 'Aula 2',
      ponente: { nombre: 'Dr. Ángel Almidón Elescano', bio: null, foto: null, externo: true },
      coponentes: [{ nombre: 'Dr. Javier Camilo Poma Palacios', bio: null, foto: null, externo: true }],
    })
    const todas = [...lista, compartido]
    expect(filtrarPonencias(todas, 'elescano').map(p => p.id)).toEqual([9])
    expect(filtrarPonencias(todas, 'poma palacios').map(p => p.id)).toEqual([9])
    expect(filtrarPonencias(todas, 'angel poma').map(p => p.id)).toEqual([9])
  })
})

describe('ponentesDeLaPonencia', () => {
  it('lista al principal y, si el tema es compartido, a los demás; un backend anterior no envía coponentes', () => {
    const otro = { nombre: 'Dra. Karen Michel Alcos Flores', bio: null, foto: null, externo: true }
    expect(ponentesDeLaPonencia(ponencia()).map(p => p.nombre)).toEqual(['Ph.D. Edwin Roque Tito'])
    expect(ponentesDeLaPonencia(ponencia({ coponentes: [] })).map(p => p.nombre)).toEqual(['Ph.D. Edwin Roque Tito'])
    expect(ponentesDeLaPonencia(ponencia({ coponentes: [otro] })).map(p => p.nombre)).toEqual(['Ph.D. Edwin Roque Tito', 'Dra. Karen Michel Alcos Flores'])
  })
})

describe('vista de la elección', () => {
  const delMartes = [MARTES_1, MARTES_2, MARTES_TARDE]

  it('sin elección muestra todas, o solo las que coinciden con la búsqueda', () => {
    expect(ponenciasVisibles(delMartes, [], TODAS, '').map(p => p.id)).toEqual([1, 2, 3])
    expect(ponenciasVisibles(delMartes, [], TODAS, 'aula').map(p => p.id)).toEqual([3])
  })

  it('al elegir una se ocultan las demás de su horario y se conservan las de otro horario', () => {
    expect(ponenciasVisibles(delMartes, [1], TODAS, '').map(p => p.id)).toEqual([1, 3])
    // La de la tarde no se cruza con las del mediodía: elegirla no oculta ninguna
    expect(ponenciasVisibles(delMartes, [3], TODAS, '').map(p => p.id)).toEqual([1, 2, 3])
  })

  it('la elegida sigue visible aunque no coincida con la búsqueda, y al quitarla vuelven todas', () => {
    expect(ponenciasVisibles(delMartes, [1], TODAS, 'aula').map(p => p.id)).toEqual([1, 3])
    expect(ponenciasVisibles(delMartes, [], TODAS, '').map(p => p.id)).toEqual([1, 2, 3])
  })

  it('pasa al siguiente día que aún tenga algo por elegir y, si no hay, a los datos', () => {
    const dias = ponenciasPorDia(TODAS)
    expect(destinoTrasElegir(dias, [1], '2026-10-27')).toBe('dia-2026-10-28')
    expect(destinoTrasElegir(dias, [1, 4], '2026-10-27')).toBe('titulo-datos')
    expect(destinoTrasElegir(dias, [4], '2026-10-28')).toBe('titulo-datos')
  })

  it('no manda a un día sin ponencias disponibles', () => {
    const agotada = ponencia({ id: 8, fecha: '2026-10-28', llena: true, cuposDisponibles: 0 })
    expect(destinoTrasElegir(ponenciasPorDia([MARTES_1, agotada]), [1], '2026-10-27')).toBe('titulo-datos')
  })
})

describe('modo de asistencia (el cupo es el aforo presencial)', () => {
  const llena = ponencia({ id: 5, horaInicio: '17:00', horaFin: '17:45', llena: true, cuposDisponibles: 0 })

  it('un congresista virtual puede elegir una ponencia llena; el presencial no', () => {
    expect(motivoNoDisponible(llena)).toBe('AGOTADA')
    expect(motivoNoDisponible(llena, 'PRESENCIAL')).toBe('AGOTADA')
    expect(motivoNoDisponible(llena, 'VIRTUAL')).toBeNull()
    // Las de pago no se ofrecen a nadie
    expect(motivoNoDisponible(ponencia({ esGratuita: false, precio: 10, llena: true }), 'VIRTUAL')).toBe('DE_PAGO')
  })

  it('para el virtual el cupo se muestra sin límite', () => {
    expect(textoCupos(ponencia({ cuposDisponibles: 3 }), 'VIRTUAL')).toBe('Virtual · sin límite')
    expect(textoCupos(llena, 'VIRTUAL')).toBe('Virtual · sin límite')
    expect(nivelDeCupos(llena, 'VIRTUAL')).toBe('libre')
    expect(textoCupos(llena, 'PRESENCIAL')).toBe('Sin cupos')
    expect(nivelDeCupos(llena, 'PRESENCIAL')).toBe('agotada')
  })

  it('la selección respeta el modo: el virtual agrega y conserva las llenas, el presencial las descarta', () => {
    expect(alternarSeleccion([1], llena, [...TODAS, llena], 'VIRTUAL')).toEqual([1, 5])
    expect(alternarSeleccion([1], llena, [...TODAS, llena], 'PRESENCIAL')).toEqual([1])
    const recargadas = [MARTES_1, ponencia({ id: 2, llena: true, cuposDisponibles: 0 }), MARTES_TARDE]
    expect(depurarSeleccion([1, 2, 3], recargadas, 'VIRTUAL')).toEqual([1, 2, 3])
    expect(depurarSeleccion([1, 2, 3], recargadas, 'PRESENCIAL')).toEqual([1, 3])
  })

  it('tras elegir va al siguiente día con algo disponible según el modo', () => {
    const miercolesLleno = ponencia({ id: 8, fecha: '2026-10-28', llena: true, cuposDisponibles: 0 })
    const dias = ponenciasPorDia([MARTES_1, miercolesLleno])
    expect(destinoTrasElegir(dias, [1], '2026-10-27', 'PRESENCIAL')).toBe('titulo-datos')
    expect(destinoTrasElegir(dias, [1], '2026-10-27', 'VIRTUAL')).toBe('dia-2026-10-28')
  })

  it('el nombre del modo', () => {
    expect(etiquetaModoAsistencia('VIRTUAL')).toBe('Virtual')
    expect(etiquetaModoAsistencia('PRESENCIAL')).toBe('Presencial')
  })

  it('un backend anterior no envía el interruptor: se trata como acceso libre', () => {
    expect(accesoLibreDe({})).toBe(true)
    expect(accesoLibreDe({ meta: {} })).toBe(true)
    expect(accesoLibreDe({ meta: { accesoLibre: false } })).toBe(false)
    expect(accesoLibreDe({ meta: { accesoLibre: true } })).toBe(true)
  })
})

describe('verificación del congreso', () => {
  it('el documento y el correo son obligatorios y el correo debe ser válido', () => {
    expect(validarVerificacion({ ...formularioVacio(), numeroDocumento: '12345678', correo: 'ana@gmail.com' })).toEqual({})
    expect(validarVerificacion(formularioVacio())).toEqual({
      numeroDocumento: 'Ingresa tu número de documento.',
      correo: 'Ingresa el correo con el que te inscribiste al congreso.',
    })
    expect(validarVerificacion({ ...formularioVacio(), numeroDocumento: '1234', correo: 'no-es-correo' })).toEqual({
      numeroDocumento: 'El DNI debe tener 8 dígitos.',
      correo: 'Ingresa un correo válido.',
    })
    expect(validarVerificacion({ ...formularioVacio(), tipoDocumento: 'CE', numeroDocumento: 'AB1234567', correo: 'ana@gmail.com' })).toEqual({})
  })

  it('el cuerpo usa el tipo en minúsculas y el correo normalizado, sin nada más', () => {
    expect(cuerpoVerificacion({ tipoDocumento: 'DNI', numeroDocumento: ' 12345678 ', correo: ' Ana@Gmail.COM ' }))
      .toEqual({ tipoDocumento: 'dni', numeroDocumento: '12345678', correo: 'ana@gmail.com' })
    expect(cuerpoVerificacion({ tipoDocumento: 'CE', numeroDocumento: 'AB1234567', correo: 'a@b.pe' }).tipoDocumento).toBe('ce')
  })
})

describe('formulario', () => {
  const valido = () => ({ ...formularioVacio(), numeroDocumento: '12345678', correo: 'ana@gmail.com', celular: '987654321' })
  const libre = { nombresObligatorios: false, accesoLibre: true }
  const congreso = { nombresObligatorios: false, accesoLibre: false }

  it('el documento se limpia según el tipo', () => {
    expect(normalizarDocumento('DNI', '12 345-678 99')).toBe('12345678')
    expect(normalizarDocumento('CE', 'ab-12 3456789012')).toBe('ab1234567890')
  })

  it('con el acceso apagado el documento, el correo y al menos una ponencia son obligatorios; el celular no', () => {
    expect(validarFormulario(valido(), [1], congreso)).toEqual({})
    expect(validarFormulario({ ...formularioVacio(), numeroDocumento: '12345678', correo: 'ana@gmail.com' }, [1], congreso)).toEqual({})
    expect(validarFormulario(formularioVacio(), [], congreso)).toEqual({
      numeroDocumento: 'Ingresa tu número de documento.',
      correo: 'Ingresa el correo con el que te inscribiste al congreso.',
      ponencias: 'Elige al menos una ponencia.',
    })
    expect(validarFormulario({ ...valido(), correo: '   ' }, [1], congreso)).toEqual({ correo: 'Ingresa el correo con el que te inscribiste al congreso.' })
    expect(validarFormulario({ ...valido(), numeroDocumento: '1234' }, [1], congreso).numeroDocumento).toContain('8 dígitos')
    expect(validarFormulario({ ...valido(), tipoDocumento: 'CE', numeroDocumento: 'AB123' }, [1], { nombresObligatorios: true, accesoLibre: false }).numeroDocumento).toContain('carné')
    expect(validarFormulario(valido(), [1, 2, 3, 4, 5], congreso).ponencias).toContain('hasta 4')
    // Los nombres y el celular salen del congreso: no se piden
    expect(validarFormulario(valido(), [1], { nombresObligatorios: true, accesoLibre: false })).toEqual({})
  })

  it('con el acceso libre basta el documento y una ponencia', () => {
    expect(validarFormulario({ ...formularioVacio(), numeroDocumento: '12345678' }, [1], libre)).toEqual({})
    expect(validarFormulario(formularioVacio(), [], libre)).toEqual({ numeroDocumento: 'Ingresa tu número de documento.', ponencias: 'Elige al menos una ponencia.' })
    expect(validarFormulario({ ...valido(), numeroDocumento: '1234' }, [1], libre).numeroDocumento).toContain('8 dígitos')
  })

  it('con el acceso libre exige nombres solo cuando el documento no los trae', () => {
    expect(validarFormulario(valido(), [1], { nombresObligatorios: true, accesoLibre: true })).toMatchObject({ nombres: 'Ingresa tus nombres.', apellidos: 'Ingresa tus apellidos.' })
    expect(validarFormulario({ ...valido(), nombres: 'A' }, [1], libre).nombres).toBeDefined()
    expect(validarFormulario({ ...valido(), nombres: 'Ana', apellidos: 'Pérez' }, [1], { nombresObligatorios: true, accesoLibre: true })).toEqual({})
  })

  it('con el acceso libre el correo y el celular son opcionales pero, si se escriben, válidos', () => {
    expect(validarFormulario({ ...valido(), correo: 'no-es-correo' }, [1], libre).correo).toBe('Ingresa un correo válido.')
    expect(validarFormulario({ ...valido(), celular: '123' }, [1], libre).celular).toContain('9 y 15 dígitos')
    expect(validarFormulario({ ...valido(), celular: ' - ' }, [1], libre)).toEqual({})
    expect(validarFormulario({ ...valido(), correo: 'ana@gmail.com', celular: '987 654 321' }, [1], libre)).toEqual({})
  })

  it('sin acceso libre el cuerpo solo lleva el documento y el correo: lo demás sale del congreso', () => {
    const completo = { ...valido(), nombres: 'Otro', apellidos: 'Nombre', procedencia: 'EXTERNO' as const }
    expect(cuerpoInscripcion({ ...completo, correo: ' Ana@Gmail.com ' }, [2, 1])).toEqual({ asistente: { tipoDocumento: 'dni', numeroDocumento: '12345678', correo: 'ana@gmail.com' }, ponenciaIds: [2, 1] })
    expect(cuerpoInscripcion(completo, [2, 1], { accesoLibre: false })).toEqual({ asistente: { tipoDocumento: 'dni', numeroDocumento: '12345678', correo: 'ana@gmail.com' }, ponenciaIds: [2, 1] })
  })

  it('con el acceso libre el cuerpo usa el tipo en minúsculas, omite los vacíos y normaliza correo y celular', () => {
    expect(cuerpoInscripcion(valido(), [2, 1], { accesoLibre: true })).toEqual({ asistente: { tipoDocumento: 'dni', numeroDocumento: '12345678', correo: 'ana@gmail.com', celular: '987654321' }, ponenciaIds: [2, 1] })
    expect(cuerpoInscripcion({ ...formularioVacio(), numeroDocumento: '12345678' }, [1], { accesoLibre: true })).toEqual({ asistente: { tipoDocumento: 'dni', numeroDocumento: '12345678' }, ponenciaIds: [1] })
    expect(cuerpoInscripcion({ tipoDocumento: 'CE', numeroDocumento: 'AB1234567', nombres: ' Ana ', apellidos: 'Pérez', correo: ' Ana@Gmail.com ', celular: '987 654-321', procedencia: 'EXTERNO' }, [3], { accesoLibre: true }))
      .toEqual({ asistente: { tipoDocumento: 'ce', numeroDocumento: 'AB1234567', nombres: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com', celular: '987654321', procedencia: 'EXTERNO' }, ponenciaIds: [3] })
  })
})

describe('errores', () => {
  it('muestra el detalle del servidor cuando nombra la ponencia en conflicto', () => {
    expect(mensajeErrorInscripcionPonencias({ statusCode: 409, code: 'TALK_FULL', message: 'La ponencia «Kali» ya no tiene cupos disponibles.' })).toBe('La ponencia «Kali» ya no tiene cupos disponibles.')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 409, code: 'SCHEDULE_CONFLICT', message: '«A» se cruza en horario con «B». Elige una de las dos.' })).toContain('«A» se cruza')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 409, code: 'TALK_FULL' })).toBe('Una de las ponencias elegidas se quedó sin cupos. Elige otra.')
  })

  it('traduce los demás códigos y los del sitio', () => {
    expect(mensajeErrorInscripcionPonencias({ statusCode: 422, code: 'NAMES_REQUIRED', message: 'x' })).toContain('Escríbelos')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 404, code: 'TALK_NOT_FOUND' })).toContain('ya no está disponible')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 429, code: 'RATE_LIMITED' })).toContain('Espera')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 401, code: 'INVALID_EVENT_TOKEN' })).toContain('no está disponible')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 0, code: 'NETWORK_ERROR' })).toContain('conectar')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 500, code: 'X' })).toContain('servidor')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 418, code: 'RARO' })).toContain('no se guardó nada')
  })

  it('los errores del congreso muestran el detalle del servidor y piden verificar de nuevo', () => {
    expect(mensajeErrorInscripcionPonencias({ statusCode: 422, code: 'CONGRESS_PAYMENT_PENDING', message: 'La inscripción al congreso aún no tiene el pago aprobado.' })).toBe('La inscripción al congreso aún no tiene el pago aprobado.')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 422, code: 'CONGRESS_REGISTRATION_NOT_FOUND' })).toContain('mismos datos con los que te inscribiste')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 422, code: 'CONGRESS_PAYMENT_PENDING' })).toContain('pago aprobado')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 422, code: 'CONGRESS_REGISTRATION_REJECTED' })).toContain('rechazada o cancelada')
    expect(mensajeErrorInscripcionPonencias({ statusCode: 409, code: 'FREE_ACCESS_ENABLED' })).toContain('acceso libre')
    expect(esErrorDeCongreso({ code: 'CONGRESS_REGISTRATION_NOT_FOUND' })).toBe(true)
    expect(esErrorDeCongreso({ code: 'CONGRESS_PAYMENT_PENDING' })).toBe(true)
    expect(esErrorDeCongreso({ code: 'TALK_FULL' })).toBe(false)
  })

  it('detecta cuándo pedir los nombres y cuándo el programa no está disponible', () => {
    expect(pideNombres({ code: 'NAMES_REQUIRED' })).toBe(true)
    expect(pideNombres({ code: 'TALK_FULL' })).toBe(false)
    expect(programaNoDisponible({ statusCode: 404, code: 'NOT_FOUND' })).toBe(true)
    expect(programaNoDisponible({ statusCode: 503, code: 'SITE_NOT_CONFIGURED' })).toBe(true)
    expect(programaNoDisponible({ statusCode: 0, code: 'NETWORK_ERROR' })).toBe(true)
    expect(programaNoDisponible({ statusCode: 500, code: 'X' })).toBe(false)
    expect(programaNoDisponible(null)).toBe(false)
  })
})
