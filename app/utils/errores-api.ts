// ============================================================================
// ERRORES DE LA API → MENSAJES EN ESPAÑOL (funciones puras)
// Códigos: backend-ciisic/specs/002-multi-evento/contracts/api-publica.md, los del token del
// evento y del BFF, y los de la verificación con Google (specs/001-landing-multi-evento/contracts/bff-landing.md)
// ============================================================================
import type { ApiErrorShape } from '../composables/useApi'

type ErrorApi = Pick<ApiErrorShape, 'statusCode' | 'code'> & Partial<Pick<ApiErrorShape, 'message' | 'fields'>>

const SIN_CONEXION = 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente; tus datos se conservan.'
const ESPERA = 'Hiciste varios intentos seguidos. Espera unos minutos e inténtalo nuevamente.'
const VOUCHER_MUY_GRANDE = 'El voucher supera el tamaño máximo de 5 MB.'
export const SERVICIO_NO_DISPONIBLE = 'El servicio no está disponible en este momento. Inténtalo más tarde o comunícate con la organización.'

/** Errores del token del evento o del BFF: no dependen del usuario ni muestran detalles técnicos. */
const ERRORES_DEL_SITIO: Record<string, string> = {
  SITE_NOT_CONFIGURED: SERVICIO_NO_DISPONIBLE,
  EVENT_TOKEN_REQUIRED: SERVICIO_NO_DISPONIBLE,
  INVALID_EVENT_TOKEN: SERVICIO_NO_DISPONIBLE,
  BACKEND_UNAVAILABLE: 'No pudimos conectar con el servidor del congreso. Inténtalo nuevamente en unos minutos; tus datos se conservan.',
}

/** Mensaje por `code`; si no hay uno específico, uno según el estado HTTP. */
export function mensajeErrorApi(error: ErrorApi, porCodigo: Record<string, string>, porDefecto: string): string {
  const especifico = porCodigo[error.code] ?? ERRORES_DEL_SITIO[error.code]
  if (especifico) return especifico
  if (error.code === 'NETWORK_ERROR' || error.statusCode === 0) return SIN_CONEXION
  if (error.code === 'RATE_LIMITED' || error.statusCode === 429) return ESPERA
  if (error.statusCode >= 500) return 'El servidor no pudo completar la solicitud. Inténtalo nuevamente en unos minutos; tus datos se conservan.'
  return porDefecto
}

const MENSAJES_INSCRIPCION: Record<string, string> = {
  ALREADY_REGISTERED: 'Ya tienes una inscripción registrada en este evento con este documento. Si necesitas cambiarla, comunícate con la organización.',
  EMAIL_IN_USE: 'Este correo ya está registrado por otra persona. Usa un correo distinto.',
  OPERATION_ALREADY_REGISTERED: 'Ese número de operación ya fue registrado. Revisa el código de tu voucher.',
  REGISTRATION_CLOSED: 'Las inscripciones para este evento están cerradas.',
  REGISTRATION_TYPE_INVALID: 'El tipo de inscripción elegido ya no está disponible. Elige otro plan.',
  // Spec 016 del backend: plan solo para la comunidad UNDC o solo para externos
  REGISTRATION_TYPE_NOT_AVAILABLE: 'Ese plan no está disponible para tu tipo de participante (comunidad UNDC o externo). Si ya participaste antes, cuenta el correo con el que te registraste. Elige otro plan.',
  CLASSIFICATION_INVALID: 'La clasificación (ciclo) seleccionada no es válida. Elige otra opción.',
  VOUCHER_REQUIRED: 'Adjunta el voucher de pago.',
  INVALID_FILE_CONTENT: 'El archivo del voucher está dañado o no coincide con su formato. Sube un PDF, JPG, PNG o WebP válido.',
  INVALID_FILE_TYPE: 'Formato de voucher no permitido. Usa PDF, JPG, PNG o WebP.',
  UPLOAD_INVALID: 'El archivo del voucher no es válido. Vuelve a adjuntarlo.',
  UPLOAD_LIMIT_EXCEEDED: VOUCHER_MUY_GRANDE,
  RATE_LIMITED: 'Hiciste varios intentos de inscripción seguidos. Espera 15 minutos e inténtalo nuevamente.',
  EVENT_NOT_FOUND: 'El evento no está disponible en este momento. Recarga la página o comunícate con la organización.',
  DUPLICATE_RECORD: 'Ya existe una inscripción con estos datos.',
  NETWORK_ERROR: SIN_CONEXION,
}

/** Etiqueta de cada campo del contrato para explicar un `VALIDATION_ERROR`. */
const CAMPOS: Record<string, string> = {
  'participante': 'Datos personales',
  'participante.tipoDocumento': 'Tipo de documento',
  'participante.numeroDocumento': 'Número de documento',
  'participante.nombres': 'Nombres',
  'participante.apellidos': 'Apellidos',
  'participante.correo': 'Correo electrónico',
  'participante.celular': 'Celular',
  'tipoInscripcionId': 'Tipo de inscripción',
  'clasificacionId': 'Clasificación',
  'modalidadPago': 'Modalidad de pago',
  'banco': 'Banco',
  'tipoOperacion': 'Tipo de pago',
  'billeteraDigital': 'Billetera digital',
  'numeroOperacion': 'Código del voucher',
  'fechaPago': 'Fecha de pago',
  'verificacionToken': 'Verificación de estudiante',
  'verificacionCorreoToken': 'Verificación del correo con Google',
}

/** Qué corregir (los mensajes de validación del backend pueden venir en inglés). */
const INDICACIONES: Record<string, string> = {
  'participante.numeroDocumento': 'DNI de 8 dígitos o carné de 9 a 12 caracteres',
  'participante.nombres': 'entre 2 y 120 caracteres',
  'participante.apellidos': 'entre 2 y 120 caracteres',
  'participante.correo': 'ingresa un correo válido',
  'participante.celular': '9 dígitos que empiezan con 9',
  'numeroOperacion': 'entre 3 y 100 caracteres',
  'fechaPago': 'una fecha válida que no sea futura',
}

/** `{ 'participante.celular': '…' }` → `['Celular (9 dígitos que empiezan con 9)']`. */
export function camposConError(fields?: Record<string, string>): string[] {
  if (!fields) return []
  return Object.keys(fields).map((campo) => {
    const etiqueta = CAMPOS[campo] ?? campo
    const indicacion = INDICACIONES[campo]
    return indicacion ? `${etiqueta} (${indicacion})` : etiqueta
  })
}

/** Mensaje para el formulario de inscripción según el `code` del backend. */
export function mensajeErrorInscripcion(error: ErrorApi): string {
  if (error.code === 'VALIDATION_ERROR') {
    const detalle = camposConError(error.fields)
    return detalle.length ? `Revisa estos datos: ${detalle.join('; ')}.` : 'Algunos datos no son válidos. Revisa el formulario.'
  }
  // 413 también puede venir del proxy (sin cuerpo del contrato)
  if (error.statusCode === 413) return VOUCHER_MUY_GRANDE
  return mensajeErrorApi(error, MENSAJES_INSCRIPCION, 'No pudimos registrar tu inscripción. Revisa los datos e inténtalo nuevamente.')
}

const MENSAJES_PONENCIA: Record<string, string> = {
  INVALID_PDF: 'Adjunta un archivo PDF válido y no vacío.',
  INVALID_PAPER: 'Completa título, nombres, apellidos y universidad de cada autor. Se permiten hasta tres coautores.',
  UPLOAD_LIMIT_EXCEEDED: 'El PDF supera el máximo de 5 MB.',
  RATE_LIMITED: 'Hiciste varios envíos seguidos. Espera 15 minutos e inténtalo nuevamente.',
  EVENT_NOT_FOUND: SERVICIO_NO_DISPONIBLE,
}

/** Mensaje para el registro de ponencias (papers). */
export function mensajeErrorPonencia(error: ErrorApi): string {
  if (error.statusCode === 413) return 'El PDF supera el máximo de 5 MB.'
  return mensajeErrorApi(error, MENSAJES_PONENCIA, 'No pudimos confirmar la recepción. Tus datos se mantienen; revisa tu conexión antes de volver a intentar.')
}

const MENSAJES_CONTACTO: Record<string, string> = {
  RATE_LIMITED: 'Enviaste varios mensajes seguidos. Intenta nuevamente en 15 minutos.',
  VALIDATION_ERROR: 'Revisa el formulario: nombre y apellido de 2 a 80 caracteres, un correo válido, asunto y un mensaje de 10 a 2000 caracteres.',
  EVENT_NOT_FOUND: SERVICIO_NO_DISPONIBLE,
}

/** Mensaje para el formulario de contacto. */
export function mensajeErrorContacto(error: ErrorApi): string {
  return mensajeErrorApi(error, MENSAJES_CONTACTO, 'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.')
}

// La verificación con Google es opcional: cada mensaje recuerda que se puede seguir escribiendo el correo
const GOOGLE_NO_DISPONIBLE = 'La verificación con Google no está disponible en este momento. Puedes escribir tu correo y continuar con tu inscripción.'
const CUENTA_GOOGLE_NO_VALIDADA = 'No pudimos validar tu cuenta de Google. Vuelve a intentarlo o escribe tu correo.'
const GOOGLE_SIN_CONEXION = 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo, o escribe tu correo.'
const GOOGLE_ESPERA = 'Hiciste varios intentos seguidos. Espera un minuto e inténtalo de nuevo, o escribe tu correo.'

const MENSAJES_GOOGLE: Record<string, string> = {
  GOOGLE_NOT_CONFIGURED: GOOGLE_NO_DISPONIBLE,
  GOOGLE_UNAVAILABLE: 'No pudimos comunicarnos con Google. Inténtalo de nuevo en unos minutos o escribe tu correo.',
  INVALID_GOOGLE_TOKEN: CUENTA_GOOGLE_NO_VALIDADA,
  // Credencial mal formada: la rechaza el BFF (422 INVALID_GOOGLE_CREDENTIAL) o el backend (422 VALIDATION_ERROR)
  INVALID_GOOGLE_CREDENTIAL: CUENTA_GOOGLE_NO_VALIDADA,
  VALIDATION_ERROR: CUENTA_GOOGLE_NO_VALIDADA,
  GOOGLE_EMAIL_NOT_VERIFIED: 'Tu cuenta de Google no tiene el correo verificado. Usa otra cuenta o escribe tu correo.',
  GOOGLE_NOT_AUTHORITATIVE: 'Google no puede confirmar ese correo porque es de otro proveedor. Usa una cuenta de Gmail o tu cuenta @undc.edu.pe, o escribe tu correo.',
  RATE_LIMITED: GOOGLE_ESPERA,
  // Token del evento, BFF o evento no disponible: no dependen del usuario
  SITE_NOT_CONFIGURED: GOOGLE_NO_DISPONIBLE,
  EVENT_TOKEN_REQUIRED: GOOGLE_NO_DISPONIBLE,
  INVALID_EVENT_TOKEN: GOOGLE_NO_DISPONIBLE,
  EVENT_NOT_FOUND: GOOGLE_NO_DISPONIBLE,
  BACKEND_UNAVAILABLE: GOOGLE_NO_DISPONIBLE,
  NETWORK_ERROR: GOOGLE_SIN_CONEXION,
}

/** Mensaje cuando falla la verificación del correo con Google (`POST /api/publico/verificacion-google`). */
export function mensajeErrorGoogle(error: ErrorApi): string {
  const especifico = MENSAJES_GOOGLE[error.code]
  if (especifico) return especifico
  if (error.statusCode === 0) return GOOGLE_SIN_CONEXION
  if (error.statusCode === 429) return GOOGLE_ESPERA
  if (error.statusCode >= 500) return GOOGLE_NO_DISPONIBLE
  return 'No pudimos verificar tu correo con Google. Inténtalo de nuevo o escribe tu correo.'
}
