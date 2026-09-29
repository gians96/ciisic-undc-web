// ============================================================================
// VERIFICACIÓN DE ESTUDIANTE UNDC: CONDICIONES, MENSAJES Y COORDINACIÓN (sin Vue)
// Mensajes sugeridos: backend-ciisic/specs/004-verificacion-estudiante/contracts/api-verificacion.md
// ============================================================================
import type { MotivoVerificacion } from '../types/evento'

export type EstadoVerificacion = 'inactivo' | 'no_soportado' | 'verificando' | 'verificado' | 'no_verificado' | 'error'

export interface MensajeVerificacion {
  tono: 'exito' | 'info' | 'aviso'
  texto: string
  /** Si tiene sentido ofrecer "Reintentar". */
  reintentable: boolean
}

/** Cuerpo de `POST /events/:codigo/student-verification`. */
export interface SolicitudVerificacion {
  correo: string
  tipoDocumento: 'dni'
  numeroDocumento: string
}

const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function esCorreoValido(correo: string | null | undefined): boolean {
  return REGEX_CORREO.test(String(correo ?? '').trim())
}

/** La verificación se lanza solo con DNI completo (8 dígitos) y un correo válido. */
export function puedeVerificarEstudiante(tipoDocumento: string, numeroDocumento: string, correo: string): boolean {
  return tipoDocumento.toUpperCase() === 'DNI' && /^\d{8}$/.test(numeroDocumento.trim()) && esCorreoValido(correo)
}

export const MENSAJE_VERIFICADO = 'Estudiante UNDC verificado ✓ — se aplica el precio UNDC.'
export const MENSAJE_VERIFICANDO = 'Verificando tu condición de estudiante UNDC…'
const MENSAJE_SIN_SERVICIO = 'No pudimos verificarte ahora; puedes continuar a precio regular o intentarlo más tarde.'

/** Mensaje para el chip según el `motivo` devuelto por `student-verification` (`null` = verificado). */
export function mensajeVerificacion(motivo: MotivoVerificacion | string | null | undefined, dominio = 'undc.edu.pe'): MensajeVerificacion {
  switch (motivo) {
    case null:
    case undefined:
      return { tono: 'exito', texto: MENSAJE_VERIFICADO, reintentable: false }
    case 'CORREO_NO_INSTITUCIONAL':
      return { tono: 'info', texto: `Para el precio UNDC usa tu correo institucional @${dominio}.`, reintentable: false }
    case 'IDENTIDAD_NO_COINCIDE':
      return { tono: 'aviso', texto: 'El correo institucional no corresponde al DNI ingresado.', reintentable: false }
    case 'NO_ES_ESTUDIANTE':
    case 'EGRESADO':
      return { tono: 'info', texto: 'No encontramos una matrícula UNDC vigente; puedes inscribirte a precio regular.', reintentable: false }
    case 'DOCUMENTO_NO_SOPORTADO':
      return { tono: 'info', texto: 'La verificación de estudiante UNDC requiere DNI; con otro documento se aplica el precio regular.', reintentable: false }
    case 'SERVICIO_NO_DISPONIBLE':
    case 'SIN_DATOS_IDENTIDAD':
    default:
      return { tono: 'aviso', texto: MENSAJE_SIN_SERVICIO, reintentable: true }
  }
}

/** Mensaje cuando la petición de verificación falla (red, 429, 5xx). */
export function mensajeFallaVerificacion(codigo: string | null | undefined): MensajeVerificacion {
  if (codigo === 'RATE_LIMITED') {
    return { tono: 'aviso', texto: 'Demasiadas verificaciones seguidas; espera un minuto e inténtalo de nuevo. Puedes continuar a precio regular.', reintentable: true }
  }
  return { tono: 'aviso', texto: MENSAJE_SIN_SERVICIO, reintentable: true }
}

/** Mensaje del chip para cada estado (`null` = no se muestra nada). */
export function mensajeEstadoVerificacion(
  estado: EstadoVerificacion,
  detalle: { motivo?: MotivoVerificacion | string | null; codigoFalla?: string | null; dominio?: string | null } = {},
): MensajeVerificacion | null {
  const dominio = detalle.dominio || 'undc.edu.pe'
  switch (estado) {
    case 'verificando':
      return { tono: 'info', texto: MENSAJE_VERIFICANDO, reintentable: false }
    case 'verificado':
      return mensajeVerificacion(null, dominio)
    case 'no_verificado':
      // Sin motivo (respuesta incompleta) nunca se muestra como verificado
      return mensajeVerificacion(detalle.motivo ?? 'SERVICIO_NO_DISPONIBLE', dominio)
    case 'no_soportado':
      return mensajeVerificacion('DOCUMENTO_NO_SOPORTADO', dominio)
    case 'error':
      return mensajeFallaVerificacion(detalle.codigoFalla)
    default:
      return null
  }
}

/**
 * Coordina las verificaciones: espera a que el usuario deje de escribir (debounce), cancela la
 * petición anterior y descarta cualquier respuesta que no sea la de la última solicitud.
 */
export function crearCoordinadorVerificacion<T>(opciones: {
  esperaMs: number
  consultar: (solicitud: SolicitudVerificacion, senal: AbortSignal) => Promise<T>
  alResultado: (resultado: T) => void
  alFallar: (error: unknown) => void
}) {
  let temporizador: ReturnType<typeof setTimeout> | undefined
  let controlador: AbortController | undefined
  let secuencia = 0

  /** Invalida la solicitud en curso (su respuesta, si llega, se ignora). */
  const cancelar = () => {
    secuencia++
    if (temporizador) clearTimeout(temporizador)
    temporizador = undefined
    controlador?.abort()
    controlador = undefined
  }

  const programar = (solicitud: SolicitudVerificacion, inmediato = false) => {
    cancelar()
    const actual = secuencia
    temporizador = setTimeout(async () => {
      temporizador = undefined
      const propio = new AbortController()
      controlador = propio
      try {
        const resultado = await opciones.consultar(solicitud, propio.signal)
        if (actual === secuencia) opciones.alResultado(resultado)
      } catch (error) {
        if (actual === secuencia) opciones.alFallar(error)
      } finally {
        if (controlador === propio) controlador = undefined
      }
    }, inmediato ? 0 : opciones.esperaMs)
  }

  return { programar, cancelar }
}
