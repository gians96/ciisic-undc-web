// ============================================================================
// DELEGACIONES: estimado, validación y multipart (funciones puras, con pruebas en tests/delegaciones.test.ts)
// Contrato: backend-ciisic/specs/023-delegaciones-convenio/contracts/api-delegaciones-convenio.md
// El tipo, el precio y el monto los decide el backend: aquí solo se estima para mostrarlo en vivo.
// ============================================================================
import type { ApiErrorShape } from '../composables/useApi'
import type { ModalidadAsistencia } from '../types/evento'
import type {
  DelegacionVisible, ErroresFormulario, FilaIntegrante, FormularioDelegado, PagoFormulario, TarifaDelegaciones,
} from '../types/delegaciones'
import { mensajeErrorApi } from './errores-api'
import { esCelularValido, fechaHoyLima, validarArchivoVoucher } from './inscripcion'

export const MAX_INTEGRANTES = 200
export const MAX_VOUCHERS_POR_ENVIO = 6
export const CAMPO_VOUCHERS = 'vouchers'

export const ETIQUETA_MODALIDAD: Readonly<Record<ModalidadAsistencia, string>> = { PRESENCIAL: 'Presencial', VIRTUAL: 'Virtual' }

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const espacios = (texto: string) => String(texto ?? '').replace(/\s+/g, ' ').trim()

/** Excel pierde el cero inicial de un DNI: un número de 7 dígitos se completa a 8 (07969419). */
export function normalizarDni(numero: string): string {
  const limpio = String(numero ?? '').trim()
  return /^\d{7}$/.test(limpio) ? `0${limpio}` : limpio
}

/** Documento tal como lo espera el backend: DNI de 8 dígitos o carné en mayúsculas. */
export function documentoLimpio(tipo: 'dni' | 'ce', numero: string): string {
  return (tipo === 'dni' ? normalizarDni(numero) : String(numero ?? '').trim()).toUpperCase()
}

// ─── Estimado en vivo ───────────────────────────────────────────────────────

export interface EstimadoGrupo {
  precioUnitario: number
  total: number
  /** Cuántos faltan para la tarifa promocional; `null` si ya aplica o la modalidad no tiene escala. */
  faltan: number | null
  /** La tarifa promocional ya aplica (solo presencial). */
  promocional: boolean
}

const redondear = (valor: number) => Math.round(valor * 100) / 100

/**
 * Lo que costará un grupo según la modalidad: presencial paga el estándar y, desde el mínimo, el
 * promocional; virtual paga una tarifa única. Es un estimado: el servidor calcula el monto definitivo.
 */
export function estimarGrupo(modalidad: ModalidadAsistencia, integrantes: number, tarifa: TarifaDelegaciones): EstimadoGrupo {
  const cantidad = Math.max(0, Math.trunc(integrantes) || 0)
  if (modalidad === 'VIRTUAL') {
    const precio = tarifa.virtual?.precio ?? 0
    return { precioUnitario: precio, total: redondear(precio * cantidad), faltan: null, promocional: false }
  }
  const promocional = cantidad >= tarifa.minIntegrantes
  const unitario = promocional ? tarifa.precioPromocional : tarifa.precioEstandar
  const hayEscala = tarifa.precioPromocional < tarifa.precioEstandar
  return {
    precioUnitario: unitario,
    total: redondear(unitario * cantidad),
    faltan: hayEscala && !promocional ? tarifa.minIntegrantes - cantidad : null,
    promocional: promocional && hayEscala,
  }
}

/** La tarifa de una delegación ya registrada (cada una copia la suya al crearse), para estimar lo que agrega. */
export function tarifaDeVista(vista: Pick<DelegacionVisible, 'modalidad' | 'minIntegrantes' | 'precioEstandar' | 'precioPromocional'>): TarifaDelegaciones {
  return {
    minIntegrantes: vista.minIntegrantes,
    precioEstandar: vista.precioEstandar,
    precioPromocional: vista.precioPromocional,
    virtual: vista.modalidad === 'VIRTUAL' ? { precio: vista.precioEstandar } : null,
  }
}

/** Texto del saldo: lo que falta, lo que sobra o que está al día. */
export function textoSaldo(saldo: number): string {
  if (Math.abs(saldo) < 0.005) return 'Al día'
  return saldo > 0 ? `Falta declarar S/ ${saldo.toFixed(2)}` : `Declaraste S/ ${Math.abs(saldo).toFixed(2)} de más`
}

// ─── Filas del formulario ───────────────────────────────────────────────────

let contador = 0
const siguienteClave = () => (contador += 1)

export function filaVacia(): FilaIntegrante {
  return { clave: siguienteClave(), tipoDocumento: 'dni', numeroDocumento: '', nombres: '', apellidos: '', correo: '', celular: '', aviso: '', buscando: false }
}

export function pagoVacio(): PagoFormulario {
  return { clave: siguienteClave(), modalidadPago: 'billetera', banco: '', tipoOperacion: 'directo', billeteraDigital: '', numeroOperacion: '', fechaPago: '', monto: '', archivo: null }
}

export function delegadoVacio(): FormularioDelegado {
  return { tipoDocumento: 'dni', numeroDocumento: '', nombres: '', apellidos: '', correo: '', celular: '', esIntegrante: true }
}

/** Una fila está en blanco si no tiene ningún dato (se ignora al enviar). */
export function filaEnBlanco(fila: Pick<FilaIntegrante, 'numeroDocumento' | 'nombres' | 'apellidos' | 'correo' | 'celular'>): boolean {
  return !fila.numeroDocumento.trim() && !fila.nombres.trim() && !fila.apellidos.trim() && !fila.correo.trim() && !fila.celular.trim()
}

/** Las filas con datos, limpias y listas para enviar al backend. */
export function integrantesParaEnviar(filas: readonly FilaIntegrante[]) {
  return filas.filter(fila => !filaEnBlanco(fila)).map(fila => ({
    tipoDocumento: fila.tipoDocumento,
    numeroDocumento: documentoLimpio(fila.tipoDocumento, fila.numeroDocumento),
    nombres: espacios(fila.nombres),
    apellidos: espacios(fila.apellidos),
    correo: fila.correo.trim().toLowerCase(),
    celular: fila.celular.replace(/\D/g, ''),
  }))
}

// ─── Validación ─────────────────────────────────────────────────────────────

function errorDocumento(tipo: 'dni' | 'ce', numero: string): string {
  const limpio = documentoLimpio(tipo, numero)
  if (!limpio) return 'Ingresa el documento.'
  if (tipo === 'dni' && !/^\d{8}$/.test(limpio)) return 'El DNI debe tener 8 dígitos.'
  if (tipo === 'ce' && !/^[A-Z0-9]{9,12}$/.test(limpio)) return 'El carné debe tener entre 9 y 12 caracteres.'
  return ''
}

/** Errores del delegado por campo (vacío si es válido). */
export function validarDelegado(delegado: FormularioDelegado): ErroresFormulario {
  const errores: ErroresFormulario = {}
  const documento = errorDocumento(delegado.tipoDocumento, delegado.numeroDocumento)
  if (documento) errores.numeroDocumento = documento
  if (espacios(delegado.nombres).length < 2) errores.nombres = 'Ingresa tus nombres.'
  if (espacios(delegado.apellidos).length < 2) errores.apellidos = 'Ingresa tus apellidos.'
  if (!CORREO.test(delegado.correo.trim())) errores.correo = 'Ingresa un correo válido.'
  if (!esCelularValido(delegado.celular.replace(/\D/g, ''))) errores.celular = 'El celular debe tener 9 dígitos y empezar con 9.'
  return errores
}

/** Errores por fila (`filas[clave]`): solo valida las filas con datos. Repetidos también cuentan. */
export function validarIntegrantes(filas: readonly FilaIntegrante[], delegado?: Pick<FormularioDelegado, 'tipoDocumento' | 'numeroDocumento' | 'correo'> | null): Record<number, ErroresFormulario> {
  const errores: Record<number, ErroresFormulario> = {}
  const documentos = new Map<string, number>()
  const correos = new Map<string, number>()
  if (delegado) {
    documentos.set(`${delegado.tipoDocumento}:${documentoLimpio(delegado.tipoDocumento, delegado.numeroDocumento)}`, -1)
    correos.set(delegado.correo.trim().toLowerCase(), -1)
  }
  for (const fila of filas) {
    if (filaEnBlanco(fila)) continue
    const campos: ErroresFormulario = {}
    const documento = errorDocumento(fila.tipoDocumento, fila.numeroDocumento)
    if (documento) campos.numeroDocumento = documento
    if (espacios(fila.nombres).length < 2) campos.nombres = 'Ingresa los nombres.'
    if (espacios(fila.apellidos).length < 2) campos.apellidos = 'Ingresa los apellidos.'
    const correo = fila.correo.trim().toLowerCase()
    if (!CORREO.test(correo)) campos.correo = 'Ingresa un correo válido.'
    const celular = fila.celular.replace(/\D/g, '')
    if (celular && !/^\d{9,15}$/.test(celular)) campos.celular = 'El celular debe tener entre 9 y 15 dígitos.'

    const claveDocumento = `${fila.tipoDocumento}:${documentoLimpio(fila.tipoDocumento, fila.numeroDocumento)}`
    if (!campos.numeroDocumento && documentos.has(claveDocumento)) campos.numeroDocumento = 'Este documento está repetido.'
    if (!campos.correo && correos.has(correo)) campos.correo = 'Este correo está repetido.'
    documentos.set(claveDocumento, fila.clave)
    correos.set(correo, fila.clave)
    if (Object.keys(campos).length) errores[fila.clave] = campos
  }
  return errores
}

/** Errores de un voucher por campo (vacío si es válido). `hoy` es `AAAA-MM-DD` en hora de Lima. */
export function validarPago(pago: PagoFormulario, hoy: string = fechaHoyLima()): ErroresFormulario {
  const errores: ErroresFormulario = {}
  if (pago.numeroOperacion.trim().length < 3) errores.numeroOperacion = 'Ingresa el número de operación.'
  if (pago.modalidadPago === 'banco' && !pago.banco) errores.medio = 'Elige el banco.'
  if (pago.modalidadPago === 'billetera' && !pago.billeteraDigital) errores.medio = 'Elige la billetera.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pago.fechaPago)) errores.fechaPago = 'Ingresa la fecha del pago.'
  else if (pago.fechaPago > hoy) errores.fechaPago = 'La fecha de pago no puede ser futura.'
  if (!(Number(pago.monto) > 0)) errores.monto = 'Ingresa el monto que figura en el voucher.'
  const archivo = validarArchivoVoucher(pago.archivo)
  if (archivo) errores.archivo = archivo
  return errores
}

// ─── Multipart ──────────────────────────────────────────────────────────────

/** Los pagos tal como los espera el backend (sin el archivo, que va aparte, en el mismo orden). */
export function pagosParaEnviar(pagos: readonly PagoFormulario[]) {
  return pagos.map(pago => ({
    modalidadPago: pago.modalidadPago,
    ...(pago.modalidadPago === 'banco'
      ? { banco: pago.banco || null, tipoOperacion: pago.tipoOperacion || null }
      : { billeteraDigital: pago.billeteraDigital || null }),
    numeroOperacion: pago.numeroOperacion.trim(),
    fechaPago: pago.fechaPago,
    monto: Number(pago.monto),
  }))
}

function agregarVouchers(cuerpo: FormData, pagos: readonly PagoFormulario[]) {
  cuerpo.append('pagos', JSON.stringify(pagosParaEnviar(pagos)))
  for (const pago of pagos) if (pago.archivo) cuerpo.append(CAMPO_VOUCHERS, pago.archivo, pago.archivo.name || 'voucher')
}

export interface DatosRegistroDelegacion {
  codigoLink?: string | null
  modalidad: ModalidadAsistencia
  delegacion: { nombre: string, institucion: string }
  delegado: FormularioDelegado
  integrantes: readonly FilaIntegrante[]
  pagos: readonly PagoFormulario[]
}

/** Cuerpo `multipart/form-data` de `POST /delegaciones`: nunca lleva precios, montos totales ni tipos. */
export function construirFormDataRegistro(datos: DatosRegistroDelegacion): FormData {
  const cuerpo = new FormData()
  if (datos.codigoLink) cuerpo.append('codigoLink', datos.codigoLink)
  cuerpo.append('modalidad', datos.modalidad)
  cuerpo.append('delegacion', JSON.stringify({ nombre: espacios(datos.delegacion.nombre), institucion: espacios(datos.delegacion.institucion) || null }))
  const { delegado } = datos
  cuerpo.append('representante', JSON.stringify({
    nombres: espacios(delegado.nombres),
    apellidos: espacios(delegado.apellidos),
    tipoDocumento: delegado.tipoDocumento,
    numeroDocumento: documentoLimpio(delegado.tipoDocumento, delegado.numeroDocumento),
    correo: delegado.correo.trim().toLowerCase(),
    celular: delegado.celular.replace(/\D/g, ''),
    esIntegrante: delegado.esIntegrante,
  }))
  cuerpo.append('participantes', JSON.stringify(integrantesParaEnviar(datos.integrantes)))
  agregarVouchers(cuerpo, datos.pagos)
  return cuerpo
}

/** Cuerpo `multipart/form-data` de `POST /delegaciones/:codigo/pagos`. */
export function construirFormDataPagos(pagos: readonly PagoFormulario[]): FormData {
  const cuerpo = new FormData()
  agregarVouchers(cuerpo, pagos)
  return cuerpo
}

// ─── Errores ────────────────────────────────────────────────────────────────

const MENSAJES_DELEGACION: Record<string, string> = {
  DELEGATION_NOT_FOUND: 'El link de la delegación no es válido o la delegación ya no está activa. Pide un link nuevo a la organización.',
  DELEGATION_INACTIVE: 'La delegación está inactiva. Comunícate con la organización.',
  DELEGATION_MODALITY_NOT_AVAILABLE: 'La modalidad virtual no está disponible por ahora. Comunícate con la organización.',
  NO_PARTICIPANTS: 'Registra al menos un integrante.',
  REGISTRATION_CLOSED: 'Las inscripciones para este evento están cerradas.',
  VOUCHER_REQUIRED: 'Adjunta un archivo por cada voucher.',
  OPERATION_ALREADY_REGISTERED: 'Uno de los números de operación ya fue registrado. Revisa el código de cada voucher.',
  DUPLICATE_PARTICIPANT: 'Hay documentos o correos repetidos entre los integrantes. Revisa la lista.',
  EMAIL_IN_USE: 'Uno de los correos ya está registrado por otra persona. Usa un correo distinto para ese integrante.',
  PARTICIPANT_ALREADY_REGISTERED: 'Una de las personas ya tiene una inscripción en este evento fuera de esta delegación.',
  INVALID_FILE_CONTENT: 'Un voucher está dañado o no coincide con su formato. Sube un PDF, JPG, PNG o WebP válido.',
  INVALID_FILE_TYPE: 'Formato de voucher no permitido. Usa PDF, JPG, PNG o WebP.',
  UPLOAD_LIMIT_EXCEEDED: 'Los vouchers superan el tamaño permitido (5 MB cada uno). Reduce su peso e inténtalo de nuevo.',
  PAYLOAD_TOO_LARGE: 'Los datos enviados superan el tamaño permitido.',
  VALIDATION_ERROR: 'Algunos datos no son válidos. Revisa los campos marcados.',
}

/** Mensaje en español de un error de la API de delegaciones. */
export function mensajeErrorDelegacion(error: Pick<ApiErrorShape, 'statusCode' | 'code'> & Partial<Pick<ApiErrorShape, 'message' | 'fields'>>): string {
  return mensajeErrorApi(error, MENSAJES_DELEGACION, 'No pudimos completar el registro. Revisa los datos e inténtalo nuevamente; tus datos se conservan.')
}

/** Errores de los integrantes del backend (`participantes[i].campo`) por posición en la lista enviada. */
export function erroresPorIntegrante(fields: Record<string, string> | undefined, desfase = 0): Record<number, ErroresFormulario> {
  const resultado: Record<number, ErroresFormulario> = {}
  for (const [campo, texto] of Object.entries(fields ?? {})) {
    const partes = /^participantes\[(\d+)\]\.(\w+)$/.exec(campo)
    if (!partes) continue
    const indice = Number(partes[1]) - desfase
    if (indice < 0) continue
    resultado[indice] = { ...resultado[indice], [partes[2] as string]: texto }
  }
  return resultado
}
