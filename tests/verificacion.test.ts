import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  MENSAJE_VERIFICADO,
  crearCoordinadorVerificacion,
  esCorreoValido,
  mensajeEstadoVerificacion,
  mensajeFallaVerificacion,
  mensajeVerificacion,
  puedeVerificarEstudiante,
  type SolicitudVerificacion,
} from '../app/utils/verificacion'

describe('condición para verificar', () => {
  it('requiere DNI de 8 dígitos y correo válido', () => {
    expect(puedeVerificarEstudiante('DNI', '71234567', 'ana@undc.edu.pe')).toBe(true)
    expect(puedeVerificarEstudiante('DNI', '71234567', 'ana@gmail.com')).toBe(true)
    expect(puedeVerificarEstudiante('DNI', '7123456', 'ana@undc.edu.pe')).toBe(false)
    expect(puedeVerificarEstudiante('CE', '123456789', 'ana@undc.edu.pe')).toBe(false)
    expect(puedeVerificarEstudiante('DNI', '71234567', 'ana@undc')).toBe(false)
    expect(esCorreoValido(' ana@undc.edu.pe ')).toBe(true)
  })
})

describe('mensajes del contrato 004', () => {
  it('verificado', () => {
    expect(mensajeVerificacion(null)).toEqual({ tono: 'exito', texto: MENSAJE_VERIFICADO, reintentable: false })
    expect(MENSAJE_VERIFICADO).toBe('Estudiante UNDC verificado ✓ — se aplica el precio UNDC.')
  })

  it.each([
    ['CORREO_NO_INSTITUCIONAL', 'Para el precio UNDC usa tu correo institucional @undc.edu.pe.', false],
    ['IDENTIDAD_NO_COINCIDE', 'El correo institucional no corresponde al DNI ingresado.', false],
    ['NO_ES_ESTUDIANTE', 'No encontramos una matrícula UNDC vigente; puedes inscribirte a precio regular.', false],
    ['EGRESADO', 'No encontramos una matrícula UNDC vigente; puedes inscribirte a precio regular.', false],
    ['SERVICIO_NO_DISPONIBLE', 'No pudimos verificarte ahora; puedes continuar a precio regular o intentarlo más tarde.', true],
    ['SIN_DATOS_IDENTIDAD', 'No pudimos verificarte ahora; puedes continuar a precio regular o intentarlo más tarde.', true],
  ])('%s → mensaje sugerido', (motivo, texto, reintentable) => {
    expect(mensajeVerificacion(motivo)).toMatchObject({ texto, reintentable })
  })

  it('usa el dominio institucional del evento', () => {
    expect(mensajeVerificacion('CORREO_NO_INSTITUCIONAL', 'unf.edu.pe').texto).toBe('Para el precio UNDC usa tu correo institucional @unf.edu.pe.')
  })

  it('mensajes por estado del chip', () => {
    expect(mensajeEstadoVerificacion('inactivo')).toBeNull()
    expect(mensajeEstadoVerificacion('verificando')?.texto).toMatch(/Verificando/)
    expect(mensajeEstadoVerificacion('verificado')?.tono).toBe('exito')
    expect(mensajeEstadoVerificacion('no_verificado', { motivo: 'EGRESADO' })?.texto).toMatch(/matrícula UNDC vigente/)
    // una respuesta sin motivo nunca se presenta como verificada
    expect(mensajeEstadoVerificacion('no_verificado', { motivo: null })?.tono).toBe('aviso')
    expect(mensajeEstadoVerificacion('no_soportado')?.texto).toMatch(/requiere DNI/)
    expect(mensajeEstadoVerificacion('error', { codigoFalla: 'RATE_LIMITED' })?.texto).toMatch(/espera un minuto/)
    expect(mensajeFallaVerificacion('NETWORK_ERROR').reintentable).toBe(true)
  })
})

describe('crearCoordinadorVerificacion', () => {
  const solicitud = (numeroDocumento: string): SolicitudVerificacion => ({ correo: 'ana@undc.edu.pe', tipoDocumento: 'dni', numeroDocumento })

  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('espera a que el usuario deje de escribir y consulta solo la última solicitud', async () => {
    const consultar = vi.fn(async (s: SolicitudVerificacion) => s.numeroDocumento)
    const alResultado = vi.fn()
    const coordinador = crearCoordinadorVerificacion({ esperaMs: 600, consultar, alResultado, alFallar: vi.fn() })

    coordinador.programar(solicitud('71234561'))
    await vi.advanceTimersByTimeAsync(300)
    coordinador.programar(solicitud('71234562'))
    await vi.advanceTimersByTimeAsync(599)
    expect(consultar).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(consultar).toHaveBeenCalledTimes(1)
    expect(consultar.mock.calls[0]![0]).toEqual(solicitud('71234562'))
    expect(alResultado).toHaveBeenCalledWith('71234562')
  })

  it('descarta la respuesta tardía de una solicitud anterior y cancela su petición', async () => {
    const pendientes: Array<{ resolver: (valor: string) => void; senal: AbortSignal }> = []
    const consultar = vi.fn((_: SolicitudVerificacion, senal: AbortSignal) => new Promise<string>((resolver) => { pendientes.push({ resolver, senal }) }))
    const alResultado = vi.fn()
    const coordinador = crearCoordinadorVerificacion({ esperaMs: 600, consultar, alResultado, alFallar: vi.fn() })

    coordinador.programar(solicitud('71234561'))
    await vi.advanceTimersByTimeAsync(600)
    coordinador.programar(solicitud('71234562'), true)
    await vi.advanceTimersByTimeAsync(0)
    expect(pendientes).toHaveLength(2)
    expect(pendientes[0]!.senal.aborted).toBe(true)

    pendientes[1]!.resolver('nuevo')
    pendientes[0]!.resolver('viejo')
    await vi.advanceTimersByTimeAsync(0)
    expect(alResultado).toHaveBeenCalledTimes(1)
    expect(alResultado).toHaveBeenCalledWith('nuevo')
  })

  it('cancelar ignora la respuesta en curso y los errores obsoletos', async () => {
    let fallar: (error: Error) => void = () => {}
    const consultar = vi.fn(() => new Promise<string>((_, rechazar) => { fallar = rechazar }))
    const alResultado = vi.fn()
    const alFallar = vi.fn()
    const coordinador = crearCoordinadorVerificacion({ esperaMs: 10, consultar, alResultado, alFallar })

    coordinador.programar(solicitud('71234561'))
    await vi.advanceTimersByTimeAsync(10)
    coordinador.cancelar()
    fallar(new Error('red'))
    await vi.advanceTimersByTimeAsync(0)
    expect(alFallar).not.toHaveBeenCalled()
    expect(alResultado).not.toHaveBeenCalled()
  })

  it('informa el error de la solicitud vigente', async () => {
    const alFallar = vi.fn()
    const coordinador = crearCoordinadorVerificacion({
      esperaMs: 10,
      consultar: async () => { throw new Error('503') },
      alResultado: vi.fn(),
      alFallar,
    })
    coordinador.programar(solicitud('71234561'))
    await vi.advanceTimersByTimeAsync(10)
    expect(alFallar).toHaveBeenCalledTimes(1)
  })
})
