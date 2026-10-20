// ============================================================================
// INSCRIPCIÓN A PONENCIAS ESPECIALIZADAS (funciones puras)
// BFF /api/publico/ponencias-especializadas → backend /api/v1/site/specialized-talks (spec 018)
// El servidor es la autoridad (cupos, cruces, precio); aquí solo se evita pedir lo que ya se sabe que
// no procede y se traducen los errores.
// ============================================================================
import type { ApiErrorShape } from '../composables/useApi'
import type {
  InscripcionPonenciasCuerpo,
  PonenciaEspecializadaPublica,
  ProcedenciaAsistente,
} from '../types/ponencias-especializadas'
import { mensajeErrorApi } from './errores-api'
import { etiquetaDia } from './ponencias-especializadas'

type Ponencia = PonenciaEspecializadaPublica

export const MAX_PONENCIAS_POR_INSCRIPCION = 4

// ─── Programa ───────────────────────────────────────────────────────────────

export interface DiaDePonenciasApi {
  fecha: string
  etiqueta: string
  ponencias: Ponencia[]
}

/** Agrupa por día (cronológico) y ordena por hora, `orden` y ambiente (laboratorios y aulas por número). */
export function ponenciasPorDia(ponencias: readonly Ponencia[]): DiaDePonenciasApi[] {
  const dias = new Map<string, Ponencia[]>()
  for (const ponencia of ponencias) dias.set(ponencia.fecha, [...(dias.get(ponencia.fecha) ?? []), ponencia])
  return [...dias.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, delDia]) => ({
      fecha,
      etiqueta: etiquetaDia(fecha),
      ponencias: [...delDia].sort((a, b) =>
        a.horaInicio.localeCompare(b.horaInicio) || a.orden - b.orden || a.ambiente.localeCompare(b.ambiente, 'es', { numeric: true })),
    }))
}

/** Dos ponencias se cruzan si son del mismo día y una empieza antes de que termine la otra. */
export function seCruzan(a: Pick<Ponencia, 'fecha' | 'horaInicio' | 'horaFin'>, b: Pick<Ponencia, 'fecha' | 'horaInicio' | 'horaFin'>): boolean {
  return a.fecha === b.fecha && a.horaInicio < b.horaFin && b.horaInicio < a.horaFin
}

/** Motivo por el que no se puede elegir, o `null` si se puede (la landing solo inscribe a gratuitas con cupo). */
export function motivoNoDisponible(ponencia: Ponencia): 'AGOTADA' | 'DE_PAGO' | null {
  if (!ponencia.esGratuita) return 'DE_PAGO'
  if (ponencia.llena) return 'AGOTADA'
  return null
}

export const TEXTO_NO_DISPONIBLE = {
  AGOTADA: 'Agotada',
  DE_PAGO: 'De pago: se inscribe con la organización',
} as const

/** «Quedan 12 de 20», «Último cupo», «Sin límite de cupos». */
export function textoCupos(ponencia: Pick<Ponencia, 'cupo' | 'cuposDisponibles'>): string {
  if (ponencia.cupo === null || ponencia.cuposDisponibles === null) return 'Sin límite de cupos'
  if (ponencia.cuposDisponibles === 0) return 'Sin cupos'
  if (ponencia.cuposDisponibles === 1) return 'Último cupo'
  return `Quedan ${ponencia.cuposDisponibles} de ${ponencia.cupo}`
}

/** `ok` con más del 30 % libre, `poco` hasta ese punto y `agotada` sin cupos; `libre` sin límite. */
export function nivelDeCupos(ponencia: Pick<Ponencia, 'cupo' | 'cuposDisponibles'>): 'libre' | 'ok' | 'poco' | 'agotada' {
  if (ponencia.cupo === null || ponencia.cuposDisponibles === null) return 'libre'
  if (ponencia.cuposDisponibles === 0) return 'agotada'
  return ponencia.cuposDisponibles / ponencia.cupo > 0.3 ? 'ok' : 'poco'
}

// ─── Selección ──────────────────────────────────────────────────────────────

/** Ponencia elegida con la que se cruza `ponencia` (otra distinta), si la hay. */
export function ponenciaEnConflicto(ponencia: Ponencia, seleccion: readonly number[], todas: readonly Ponencia[]): Ponencia | null {
  return todas.find(otra => otra.id !== ponencia.id && seleccion.includes(otra.id) && seCruzan(otra, ponencia)) ?? null
}

/**
 * Alterna una ponencia. Al elegir una que se cruza con otra ya elegida, reemplaza a la anterior (en
 * cada horario se asiste a una sola); al quitar la elegida, la deja fuera. Ignora las no disponibles.
 */
export function alternarSeleccion(seleccion: readonly number[], ponencia: Ponencia, todas: readonly Ponencia[]): number[] {
  if (seleccion.includes(ponencia.id)) return seleccion.filter(id => id !== ponencia.id)
  if (motivoNoDisponible(ponencia)) return [...seleccion]
  const cruzadas = new Set(todas.filter(otra => seleccion.includes(otra.id) && seCruzan(otra, ponencia)).map(otra => otra.id))
  return [...seleccion.filter(id => !cruzadas.has(id)), ponencia.id].slice(-MAX_PONENCIAS_POR_INSCRIPCION)
}

/** Ponencias elegidas que ya no existen o dejaron de estar disponibles tras recargar el programa. */
export function depurarSeleccion(seleccion: readonly number[], todas: readonly Ponencia[]): number[] {
  return seleccion.filter(id => {
    const ponencia = todas.find(p => p.id === id)
    return ponencia !== undefined && motivoNoDisponible(ponencia) === null
  })
}

// ─── Formulario ─────────────────────────────────────────────────────────────

export type TipoDocumentoPonencia = 'DNI' | 'CE'

export interface FormularioPonencias {
  tipoDocumento: TipoDocumentoPonencia
  numeroDocumento: string
  nombres: string
  apellidos: string
  correo: string
  celular: string
  procedencia: '' | ProcedenciaAsistente
}

export function formularioVacio(): FormularioPonencias {
  return { tipoDocumento: 'DNI', numeroDocumento: '', nombres: '', apellidos: '', correo: '', celular: '', procedencia: '' }
}

/** Lo escrito en el número: el DNI solo con dígitos (8) y el carné con letras y dígitos (12). */
export function normalizarDocumento(tipo: TipoDocumentoPonencia, texto: string): string {
  return (tipo === 'DNI' ? texto.replace(/\D/g, '').slice(0, 8) : texto.replace(/[^0-9A-Za-z]/g, '').slice(0, 12))
}

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CELULAR = /^\+?\d{9,15}$/

export interface ErroresFormulario {
  numeroDocumento?: string
  nombres?: string
  apellidos?: string
  correo?: string
  celular?: string
  ponencias?: string
}

/**
 * Errores antes de enviar. Los nombres se exigen si el DNI no los trajo (o con carné); correo y celular
 * son opcionales y solo se validan si se escriben.
 */
export function validarFormulario(form: FormularioPonencias, seleccion: readonly number[], opciones: { nombresObligatorios: boolean }): ErroresFormulario {
  const errores: ErroresFormulario = {}
  const numero = form.numeroDocumento.trim()
  if (!numero) errores.numeroDocumento = 'Ingresa tu número de documento.'
  else if (form.tipoDocumento === 'DNI' ? !/^\d{8}$/.test(numero) : !/^[A-Za-z0-9]{9,12}$/.test(numero)) {
    errores.numeroDocumento = form.tipoDocumento === 'DNI' ? 'El DNI debe tener 8 dígitos.' : 'El carné de extranjería debe tener entre 9 y 12 caracteres.'
  }
  for (const [campo, etiqueta] of [['nombres', 'tus nombres'], ['apellidos', 'tus apellidos']] as const) {
    const valor = form[campo].trim()
    if (!valor && opciones.nombresObligatorios) errores[campo] = `Ingresa ${etiqueta}.`
    else if (valor && (valor.length < 2 || valor.length > 120)) errores[campo] = 'Debe tener entre 2 y 120 caracteres.'
  }
  const correo = form.correo.trim()
  if (correo && (!CORREO.test(correo) || correo.length > 191)) errores.correo = 'Ingresa un correo válido.'
  const celular = form.celular.replace(/[\s\-()]/g, '')
  if (celular && !CELULAR.test(celular)) errores.celular = 'El celular debe tener entre 9 y 15 dígitos.'
  if (!seleccion.length) errores.ponencias = 'Elige al menos una ponencia.'
  else if (seleccion.length > MAX_PONENCIAS_POR_INSCRIPCION) errores.ponencias = `Puedes elegir hasta ${MAX_PONENCIAS_POR_INSCRIPCION} ponencias a la vez.`
  return errores
}

/** Cuerpo del POST: sin los opcionales vacíos; el tipo de documento va en minúsculas como lo pide el backend. */
export function cuerpoInscripcion(form: FormularioPonencias, seleccion: readonly number[]): InscripcionPonenciasCuerpo {
  const asistente: InscripcionPonenciasCuerpo['asistente'] = {
    tipoDocumento: form.tipoDocumento === 'DNI' ? 'dni' : 'ce',
    numeroDocumento: form.numeroDocumento.trim(),
  }
  const nombres = form.nombres.trim()
  const apellidos = form.apellidos.trim()
  const correo = form.correo.trim().toLowerCase()
  const celular = form.celular.replace(/[\s\-()]/g, '')
  if (nombres) asistente.nombres = nombres
  if (apellidos) asistente.apellidos = apellidos
  if (correo) asistente.correo = correo
  if (celular) asistente.celular = celular
  if (form.procedencia) asistente.procedencia = form.procedencia
  return { asistente, ponenciaIds: [...seleccion] }
}

// ─── Errores ────────────────────────────────────────────────────────────────

type ErrorApi = Pick<ApiErrorShape, 'statusCode' | 'code'> & Partial<Pick<ApiErrorShape, 'message' | 'fields'>>

/** Los mensajes del backend nombran la ponencia en conflicto: se muestran tal cual. */
const CON_DETALLE_DEL_SERVIDOR = ['TALK_FULL', 'SCHEDULE_CONFLICT', 'TALK_ENDED', 'PAID_TALK_UNAVAILABLE'] as const

const MENSAJES_PONENCIAS: Record<string, string> = {
  TALK_FULL: 'Una de las ponencias elegidas se quedó sin cupos. Elige otra.',
  SCHEDULE_CONFLICT: 'Dos de las ponencias elegidas se dictan a la misma hora. Elige solo una por horario.',
  TALK_ENDED: 'Una de las ponencias elegidas ya terminó.',
  PAID_TALK_UNAVAILABLE: 'Una de las ponencias elegidas es de pago: la inscripción se realiza con la organización.',
  TALK_NOT_FOUND: 'Alguna de las ponencias elegidas ya no está disponible. Actualizamos la lista: revisa tu elección.',
  NAMES_REQUIRED: 'No pudimos obtener tus nombres con ese documento. Escríbelos para continuar.',
  RATE_LIMITED: 'Hiciste varios intentos seguidos. Espera unos minutos e inténtalo nuevamente.',
  VALIDATION_ERROR: 'Revisa tus datos: documento válido y, si los escribes, correo y celular correctos.',
  EVENT_NOT_FOUND: 'El evento no está disponible en este momento. Recarga la página o comunícate con la organización.',
}

/** Mensaje para el formulario de inscripción a ponencias según el `code` del backend. */
export function mensajeErrorInscripcionPonencias(error: ErrorApi): string {
  const mensajes = { ...MENSAJES_PONENCIAS }
  for (const codigo of CON_DETALLE_DEL_SERVIDOR) {
    if (error.code === codigo && error.message) mensajes[codigo] = error.message
  }
  return mensajeErrorApi(error, mensajes, 'No pudimos registrar tu inscripción. Revisa los datos e inténtalo nuevamente; no se guardó nada.')
}

/** `NAMES_REQUIRED`: el formulario debe pedir nombres y apellidos. */
export function pideNombres(error: Pick<ApiErrorShape, 'code'>): boolean {
  return error.code === 'NAMES_REQUIRED'
}

/** El programa no se pudo leer porque el servidor aún no tiene el módulo o no responde. */
export function programaNoDisponible(error: Pick<ApiErrorShape, 'statusCode' | 'code'> | null | undefined): boolean {
  return Boolean(error) && (error?.statusCode === 404 || error?.statusCode === 502 || error?.statusCode === 503 || error?.code === 'NETWORK_ERROR')
}
