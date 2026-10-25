// ============================================================================
// INSCRIPCIÓN A PONENCIAS ESPECIALIZADAS (funciones puras)
// BFF /api/publico/ponencias-especializadas → backend /api/v1/site/specialized-talks (spec 018)
// El servidor es la autoridad (cupos, cruces, precio); aquí solo se evita pedir lo que ya se sabe que
// no procede y se traducen los errores.
// ============================================================================
import type { ApiErrorShape } from '../composables/useApi'
import type {
  InscripcionPonenciasCuerpo,
  ListaPonenciasRespuesta,
  ModoAsistencia,
  PonenciaEspecializadaPublica,
  PonentePublico,
  ProcedenciaAsistente,
  VerificacionCuerpo,
} from '../types/ponencias-especializadas'
import { mensajeErrorApi } from './errores-api'
import { etiquetaDia } from './ponencias-especializadas'

type Ponencia = PonenciaEspecializadaPublica

export const MAX_PONENCIAS_POR_INSCRIPCION = 4

// ─── Acceso ─────────────────────────────────────────────────────────────────

/**
 * Si el evento está en acceso libre (se inscribe cualquiera solo con su documento). Un backend anterior no envía
 * `meta`: era libre, así que se trata como tal.
 */
export function accesoLibreDe(respuesta: Pick<ListaPonenciasRespuesta, 'meta'>): boolean {
  return respuesta.meta?.accesoLibre ?? true
}

/** «Presencial» o «Virtual». */
export function etiquetaModoAsistencia(modo: ModoAsistencia): string {
  return modo === 'VIRTUAL' ? 'Virtual' : 'Presencial'
}

// ─── Programa ───────────────────────────────────────────────────────────────

export interface DiaDePonenciasApi<T = Ponencia> {
  fecha: string
  etiqueta: string
  ponencias: T[]
}

/**
 * Agrupa por día (cronológico) y ordena por hora, `orden` y ambiente (laboratorios y aulas por número). Sirve también
 * para las ponencias del enlace del aforo, que traen los mismos campos.
 */
export function ponenciasPorDia<T extends Pick<Ponencia, 'fecha' | 'horaInicio' | 'orden' | 'ambiente'> = Ponencia>(ponencias: readonly T[]): DiaDePonenciasApi<T>[] {
  const dias = new Map<string, T[]>()
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

/**
 * Motivo por el que no se puede elegir, o `null` si se puede (la landing solo inscribe a gratuitas con cupo).
 * El cupo es el aforo presencial: un congresista virtual (`modo`) no tiene límite y puede elegir una ponencia llena.
 */
export function motivoNoDisponible(ponencia: Ponencia, modo: ModoAsistencia | null = null): 'AGOTADA' | 'DE_PAGO' | null {
  if (!ponencia.esGratuita) return 'DE_PAGO'
  if (ponencia.llena && modo !== 'VIRTUAL') return 'AGOTADA'
  return null
}

export const TEXTO_NO_DISPONIBLE = {
  AGOTADA: 'Agotada',
  DE_PAGO: 'De pago: se inscribe con la organización',
} as const

/** «Quedan 12 de 20», «Último cupo», «Sin límite de cupos»; para un congresista virtual, «Virtual · sin límite». */
export function textoCupos(ponencia: Pick<Ponencia, 'cupo' | 'cuposDisponibles'>, modo: ModoAsistencia | null = null): string {
  if (modo === 'VIRTUAL') return 'Virtual · sin límite'
  if (ponencia.cupo === null || ponencia.cuposDisponibles === null) return 'Sin límite de cupos'
  if (ponencia.cuposDisponibles === 0) return 'Sin cupos'
  if (ponencia.cuposDisponibles === 1) return 'Último cupo'
  return `Quedan ${ponencia.cuposDisponibles} de ${ponencia.cupo}`
}

/** `ok` con más del 30 % libre, `poco` hasta ese punto y `agotada` sin cupos; `libre` sin límite (y siempre para un virtual). */
export function nivelDeCupos(ponencia: Pick<Ponencia, 'cupo' | 'cuposDisponibles'>, modo: ModoAsistencia | null = null): 'libre' | 'ok' | 'poco' | 'agotada' {
  if (modo === 'VIRTUAL') return 'libre'
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
export function alternarSeleccion(seleccion: readonly number[], ponencia: Ponencia, todas: readonly Ponencia[], modo: ModoAsistencia | null = null): number[] {
  if (seleccion.includes(ponencia.id)) return seleccion.filter(id => id !== ponencia.id)
  if (motivoNoDisponible(ponencia, modo)) return [...seleccion]
  const cruzadas = new Set(todas.filter(otra => seleccion.includes(otra.id) && seCruzan(otra, ponencia)).map(otra => otra.id))
  return [...seleccion.filter(id => !cruzadas.has(id)), ponencia.id].slice(-MAX_PONENCIAS_POR_INSCRIPCION)
}

/** Ponencias elegidas que ya no existen o dejaron de estar disponibles tras recargar el programa. */
export function depurarSeleccion(seleccion: readonly number[], todas: readonly Ponencia[], modo: ModoAsistencia | null = null): number[] {
  return seleccion.filter(id => {
    const ponencia = todas.find(p => p.id === id)
    return ponencia !== undefined && motivoNoDisponible(ponencia, modo) === null
  })
}

// ─── Búsqueda y vista de la elección ────────────────────────────────────────

/** Minúsculas y sin tildes, para comparar «Miércoles» con «miercoles». */
function sinTildes(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Todos los ponentes del tema: el principal y, si lo comparten, los demás (un backend anterior no envía `coponentes`). */
export function ponentesDeLaPonencia<P = PonentePublico>(ponencia: { ponente: P, coponentes?: P[] }): P[] {
  return [ponencia.ponente, ...(ponencia.coponentes ?? [])]
}

/**
 * Ponencias que contienen todas las palabras buscadas en el tema, los ponentes, el ambiente, la hora o el
 * día («miércoles», «27 de octubre»); sin tildes ni mayúsculas. Sin texto devuelve todas.
 */
export function filtrarPonencias(ponencias: readonly Ponencia[], busqueda: string): Ponencia[] {
  const palabras = sinTildes(busqueda).split(/\s+/).filter(Boolean)
  if (!palabras.length) return [...ponencias]
  return ponencias.filter(ponencia => {
    const texto = sinTildes([ponencia.tema, ...ponentesDeLaPonencia(ponencia).map(ponente => ponente.nombre), ponencia.ambiente, ponencia.horaInicio, etiquetaDia(ponencia.fecha)].join(' '))
    return palabras.every(palabra => texto.includes(palabra))
  })
}

/**
 * Lo que se muestra de un día: la ponencia elegida de cada horario siempre (para poder quitarla) y, de los
 * horarios sin elección, solo las que coinciden con la búsqueda. Al elegir una se ocultan las demás de su
 * horario; al quitarla vuelven a verse.
 */
export function ponenciasVisibles(delDia: readonly Ponencia[], seleccion: readonly number[], todas: readonly Ponencia[], busqueda: string): Ponencia[] {
  const coinciden = new Set(filtrarPonencias(delDia, busqueda).map(ponencia => ponencia.id))
  return delDia.filter(ponencia =>
    seleccion.includes(ponencia.id) || (!ponenciaEnConflicto(ponencia, seleccion, todas) && coinciden.has(ponencia.id)))
}

/**
 * A dónde pasar tras elegir una ponencia del día `fecha`: el siguiente día que aún tenga algo por elegir
 * (alguna ponencia disponible y ninguna elegida) o, si no queda ninguno, el título del formulario de datos.
 * Devuelve el `id` del elemento al que desplazarse.
 */
export function destinoTrasElegir(dias: readonly Pick<DiaDePonenciasApi, 'fecha' | 'ponencias'>[], seleccion: readonly number[], fecha: string, modo: ModoAsistencia | null = null): string {
  const pendiente = dias
    .filter(dia => dia.fecha > fecha)
    .find(dia => dia.ponencias.some(p => motivoNoDisponible(p, modo) === null) && !dia.ponencias.some(p => seleccion.includes(p.id)))
  return pendiente ? `dia-${pendiente.fecha}` : 'titulo-datos'
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

function errorDeDocumento(form: Pick<FormularioPonencias, 'tipoDocumento' | 'numeroDocumento'>): string | undefined {
  const numero = form.numeroDocumento.trim()
  if (!numero) return 'Ingresa tu número de documento.'
  if (form.tipoDocumento === 'DNI' ? !/^\d{8}$/.test(numero) : !/^[A-Za-z0-9]{9,12}$/.test(numero)) {
    return form.tipoDocumento === 'DNI' ? 'El DNI debe tener 8 dígitos.' : 'El carné de extranjería debe tener entre 9 y 12 caracteres.'
  }
  return undefined
}

/**
 * Errores de la verificación previa (sin acceso libre): el documento y el correo con los que la persona se
 * inscribió al congreso, ambos obligatorios. El backend decide si son de un congresista con el pago aprobado.
 */
export function validarVerificacion(form: Pick<FormularioPonencias, 'tipoDocumento' | 'numeroDocumento' | 'correo'>): Pick<ErroresFormulario, 'numeroDocumento' | 'correo'> {
  const errores: Pick<ErroresFormulario, 'numeroDocumento' | 'correo'> = {}
  const documento = errorDeDocumento(form)
  if (documento) errores.numeroDocumento = documento
  const correo = form.correo.trim()
  if (!correo) errores.correo = 'Ingresa el correo con el que te inscribiste al congreso.'
  else if (!CORREO.test(correo) || correo.length > 191) errores.correo = 'Ingresa un correo válido.'
  return errores
}

/** Cuerpo de la verificación: el tipo de documento va en minúsculas como lo pide el backend. */
export function cuerpoVerificacion(form: Pick<FormularioPonencias, 'tipoDocumento' | 'numeroDocumento' | 'correo'>): VerificacionCuerpo {
  return {
    tipoDocumento: form.tipoDocumento === 'DNI' ? 'dni' : 'ce',
    numeroDocumento: form.numeroDocumento.trim(),
    correo: form.correo.trim().toLowerCase(),
  }
}

/**
 * Errores antes de enviar. Con el acceso libre basta el documento (los nombres se exigen si el DNI no los
 * trajo, o con carné; el correo y el celular son opcionales pero, si se escriben, válidos). Sin acceso libre
 * el documento y el correo son obligatorios y lo demás sale de la inscripción al congreso.
 */
export function validarFormulario(form: FormularioPonencias, seleccion: readonly number[], opciones: { nombresObligatorios: boolean, accesoLibre?: boolean }): ErroresFormulario {
  const accesoLibre = opciones.accesoLibre === true
  const errores: ErroresFormulario = {}
  const documento = errorDeDocumento(form)
  if (documento) errores.numeroDocumento = documento
  const correo = form.correo.trim()
  if (!correo) {
    if (!accesoLibre) errores.correo = 'Ingresa el correo con el que te inscribiste al congreso.'
  } else if (!CORREO.test(correo) || correo.length > 191) errores.correo = 'Ingresa un correo válido.'
  if (accesoLibre) {
    for (const [campo, etiqueta] of [['nombres', 'tus nombres'], ['apellidos', 'tus apellidos']] as const) {
      const valor = form[campo].trim()
      if (!valor && opciones.nombresObligatorios) errores[campo] = `Ingresa ${etiqueta}.`
      else if (valor && (valor.length < 2 || valor.length > 120)) errores[campo] = 'Debe tener entre 2 y 120 caracteres.'
    }
    const celular = form.celular.replace(/[\s\-()]/g, '')
    if (celular && !CELULAR.test(celular)) errores.celular = 'El celular debe tener entre 9 y 15 dígitos.'
  }
  if (!seleccion.length) errores.ponencias = 'Elige al menos una ponencia.'
  else if (seleccion.length > MAX_PONENCIAS_POR_INSCRIPCION) errores.ponencias = `Puedes elegir hasta ${MAX_PONENCIAS_POR_INSCRIPCION} ponencias a la vez.`
  return errores
}

/**
 * Cuerpo del POST: sin los opcionales vacíos; el tipo de documento va en minúsculas como lo pide el backend.
 * Sin acceso libre solo viajan el documento y el correo: nombres, celular y procedencia salen del congreso.
 */
export function cuerpoInscripcion(form: FormularioPonencias, seleccion: readonly number[], opciones: { accesoLibre?: boolean } = {}): InscripcionPonenciasCuerpo {
  const asistente: InscripcionPonenciasCuerpo['asistente'] = {
    tipoDocumento: form.tipoDocumento === 'DNI' ? 'dni' : 'ce',
    numeroDocumento: form.numeroDocumento.trim(),
  }
  if (opciones.accesoLibre !== true) {
    asistente.correo = form.correo.trim().toLowerCase()
    return { asistente, ponenciaIds: [...seleccion] }
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
const CON_DETALLE_DEL_SERVIDOR = ['TALK_FULL', 'SCHEDULE_CONFLICT', 'TALK_ENDED', 'PAID_TALK_UNAVAILABLE', 'CONGRESS_REGISTRATION_NOT_FOUND', 'CONGRESS_PAYMENT_PENDING', 'CONGRESS_REGISTRATION_REJECTED'] as const

const MENSAJES_PONENCIAS: Record<string, string> = {
  TALK_FULL: 'Una de las ponencias elegidas se quedó sin cupos. Elige otra.',
  SCHEDULE_CONFLICT: 'Dos de las ponencias elegidas se dictan a la misma hora. Elige solo una por horario.',
  TALK_ENDED: 'Una de las ponencias elegidas ya terminó.',
  PAID_TALK_UNAVAILABLE: 'Una de las ponencias elegidas es de pago: la inscripción se realiza con la organización.',
  TALK_NOT_FOUND: 'Alguna de las ponencias elegidas ya no está disponible. Actualizamos la lista: revisa tu elección.',
  // Solo congresistas con el pago aprobado (backend spec 030): el servidor trae el mensaje; estos son el respaldo
  CONGRESS_REGISTRATION_NOT_FOUND: 'No encontramos una inscripción al congreso con ese documento y correo. Escribe los mismos datos con los que te inscribiste.',
  CONGRESS_PAYMENT_PENDING: 'Tu inscripción al congreso aún no tiene el pago aprobado. Cuando se valide podrás inscribirte a las ponencias.',
  CONGRESS_REGISTRATION_REJECTED: 'Tu inscripción al congreso fue rechazada o cancelada, por eso no puedes inscribirte a las ponencias.',
  FREE_ACCESS_ENABLED: 'La inscripción a las ponencias cambió a acceso libre. Recarga la página para continuar solo con tu DNI.',
  NAMES_REQUIRED: 'No pudimos obtener tus nombres con ese documento. Escríbelos para continuar.',
  RATE_LIMITED: 'Hiciste varios intentos seguidos. Espera unos minutos e inténtalo nuevamente.',
  VALIDATION_ERROR: 'Revisa tus datos: documento, correo y celular válidos.',
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

/** El documento y el correo no son de un congresista con el pago aprobado: hay que verificar de nuevo. */
export function esErrorDeCongreso(error: Pick<ApiErrorShape, 'code'>): boolean {
  return error.code.startsWith('CONGRESS_')
}

/** `NAMES_REQUIRED`: el formulario debe pedir nombres y apellidos. */
export function pideNombres(error: Pick<ApiErrorShape, 'code'>): boolean {
  return error.code === 'NAMES_REQUIRED'
}

/** El programa no se pudo leer porque el servidor aún no tiene el módulo o no responde. */
export function programaNoDisponible(error: Pick<ApiErrorShape, 'statusCode' | 'code'> | null | undefined): boolean {
  return Boolean(error) && (error?.statusCode === 404 || error?.statusCode === 502 || error?.statusCode === 503 || error?.code === 'NETWORK_ERROR')
}
