// ============================================================================
// ERRORES DE LA API → MENSAJES EN ESPAÑOL (funciones puras)
// Códigos: backend-ciisic/specs/002-multi-evento/contracts/api-publica.md
// ============================================================================
import type { ApiErrorShape } from '../composables/useApi'

type ErrorApi = Pick<ApiErrorShape, 'statusCode' | 'code'> & Partial<Pick<ApiErrorShape, 'message' | 'fields'>>

const SIN_CONEXION = 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo nuevamente; tus datos se conservan.'
const ESPERA = 'Hiciste varios intentos seguidos. Espera unos minutos e inténtalo nuevamente.'
const VOUCHER_MUY_GRANDE = 'El voucher supera el tamaño máximo de 5 MB.'

/** Mensaje por `code`; si no hay uno específico, uno según el estado HTTP. */
export function mensajeErrorApi(error: ErrorApi, porCodigo: Record<string, string>, porDefecto: string): string {
  const especifico = porCodigo[error.code]
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
