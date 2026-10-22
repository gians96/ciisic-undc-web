// ============================================================================
// DELEGACIONES: planes, estimado, validación y multipart (funciones puras, con pruebas en tests/delegaciones.test.ts)
// Contrato: backend-ciisic/specs/029-delegaciones-planes/contracts/api-delegaciones-planes.md
// El plan lo elige cada integrante; el tipo, el precio y el monto los decide el backend: aquí solo se estima para mostrarlo.
// ============================================================================
import type { ApiErrorShape } from '../composables/useApi'
import type {
  CodigoPlan, ErroresFormulario, FilaIntegrante, FormularioInscripcionIndividual, PagoFormulario, PlanPublico, PlanVisible,
} from '../types/delegaciones'
import { mensajeErrorApi } from './errores-api'
import { esCelularValido, fechaHoyLima, validarArchivoVoucher } from './inscripcion'

export const MAX_INTEGRANTES = 200
export const MAX_VOUCHERS_POR_ENVIO = 6
export const CAMPO_VOUCHERS = 'vouchers'

/** Los tres planes, en el orden en que se muestran. */
export const PLANES: readonly CodigoPlan[] = ['CON_KIT', 'SIN_KIT', 'VIRTUAL']
export const ETIQUETA_PLAN: Readonly<Record<CodigoPlan, string>> = { CON_KIT: 'Con kit', SIN_KIT: 'Sin kit', VIRTUAL: 'Virtual' }
export const DESCRIPCION_PLAN: Readonly<Record<CodigoPlan, string>> = {
  CON_KIT: 'Asistencia presencial con kit de merchandising',
  SIN_KIT: 'Asistencia presencial sin kit',
  VIRTUAL: 'Participación virtual',
}

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PREFIJO = /^[a-z0-9._%+-]{1,64}$/
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

// ─── Planes y estimado en vivo ──────────────────────────────────────────────

/** Los planes que admiten integrantes (activos), en orden. */
export function planesActivos<T extends { activo: boolean }>(planes: readonly T[]): T[] {
  return planes.filter(plan => plan.activo)
}

/** El plan con el que se precarga una fila: el único activo; con varios, ninguno (cada integrante elige). */
export function planPorDefecto(planes: readonly Pick<PlanVisible, 'codigo' | 'activo'>[]): CodigoPlan | '' {
  const activos = planesActivos(planes)
  return activos.length === 1 ? (activos[0]?.codigo ?? '') : ''
}

const redondear = (valor: number) => Math.round(valor * 100) / 100

/** Precio por persona de un plan: el promocional (si lo tiene) desde el mínimo de integrantes. */
export function precioUnitarioPlan(precio: number, precioPromocional: number | null, minIntegrantes: number, totalIntegrantes: number): number {
  return precioPromocional !== null && precioPromocional < precio && totalIntegrantes >= minIntegrantes ? precioPromocional : precio
}

export interface EstimadoGrupo {
  integrantes: number
  total: number
  /** Cuántos faltan para el precio promocional; `null` si ningún plan lo tiene o ya aplica. */
  faltan: number | null
  /** Lo que paga cada integrante de cada plan con ese total. */
  unitarios: Partial<Record<CodigoPlan, number>>
}

/**
 * Lo que costará un grupo según cuántos integrantes hay en cada plan. Es un estimado: el servidor calcula el
 * monto definitivo con el total final.
 */
export function estimarGrupo(
  planes: ReadonlyArray<Pick<PlanVisible, 'codigo' | 'activo' | 'precio' | 'precioPromocional'>>,
  cantidades: Partial<Record<CodigoPlan, number>>,
  minIntegrantes: number,
): EstimadoGrupo {
  const entero = (codigo: CodigoPlan) => Math.max(0, Math.trunc(cantidades[codigo] ?? 0))
  const integrantes = PLANES.reduce((suma, codigo) => suma + entero(codigo), 0)
  const unitarios: Partial<Record<CodigoPlan, number>> = {}
  let total = 0
  for (const plan of planes) {
    const unitario = precioUnitarioPlan(plan.precio, plan.precioPromocional, minIntegrantes, integrantes)
    unitarios[plan.codigo] = unitario
    total += redondear(unitario * entero(plan.codigo))
  }
  const hayEscala = planes.some(plan => plan.activo && plan.precioPromocional !== null && plan.precioPromocional < plan.precio)
  return { integrantes, total: redondear(total), faltan: hayEscala && integrantes < minIntegrantes ? minIntegrantes - integrantes : null, unitarios }
}

/** Cuántos integrantes hay por plan en las filas con datos; sin plan elegido cuentan en `porDefecto`. */
export function cantidadesPorPlan(filas: readonly FilaIntegrante[], porDefecto: CodigoPlan | ''): Partial<Record<CodigoPlan, number>> {
  const cantidades: Partial<Record<CodigoPlan, number>> = {}
  for (const fila of filas) {
    if (filaEnBlanco(fila)) continue
    const plan = fila.plan || porDefecto
    if (plan) cantidades[plan] = (cantidades[plan] ?? 0) + 1
  }
  return cantidades
}

/** Texto del precio de un plan en las tarjetas: «S/ 60.00» o «S/ 60.00 · S/ 50.00 desde 10 integrantes». */
export function textoPrecioPlan(plan: Pick<PlanPublico, 'precio' | 'precioPromocional'>, minIntegrantes: number): string {
  const base = `S/ ${plan.precio.toFixed(2)}`
  return plan.precioPromocional !== null && plan.precioPromocional < plan.precio
    ? `${base} · S/ ${plan.precioPromocional.toFixed(2)} desde ${minIntegrantes} integrantes`
    : base
}

/** Texto del saldo: lo que falta, lo que sobra o que está al día. */
export function textoSaldo(saldo: number): string {
  if (Math.abs(saldo) < 0.005) return 'Al día'
  return saldo > 0 ? `Falta declarar S/ ${saldo.toFixed(2)}` : `Declaraste S/ ${Math.abs(saldo).toFixed(2)} de más`
}

// ─── Correo con dominio ─────────────────────────────────────────────────────

/** El correo que se enviará: con dominio y sin `@` escrito, se completa con él; siempre en minúsculas. */
export function correoCompleto(texto: string, dominio: string | null): string {
  const limpio = texto.trim().toLowerCase()
  if (!limpio) return ''
  return dominio && !limpio.includes('@') ? `${limpio}@${dominio}` : limpio
}

/** Lo que va antes de la `@` de un correo del dominio; si el texto no es de ese dominio, queda como está. */
export function prefijoDeCorreo(texto: string, dominio: string | null): string {
  const limpio = texto.trim().toLowerCase()
  return dominio && limpio.endsWith(`@${dominio}`) ? limpio.slice(0, -(dominio.length + 1)) : limpio
}

const terminaEnDominio = (correo: string, dominio: string | null) => !dominio || correo.endsWith(`@${dominio}`)

// ─── Filas del formulario ───────────────────────────────────────────────────

let contador = 0
const siguienteClave = () => (contador += 1)

export function filaVacia(plan: CodigoPlan | '' = ''): FilaIntegrante {
  return { clave: siguienteClave(), tipoDocumento: 'dni', numeroDocumento: '', nombres: '', apellidos: '', correo: '', celular: '', plan, aviso: '', buscando: false }
}

export function pagoVacio(): PagoFormulario {
  return { clave: siguienteClave(), modalidadPago: 'billetera', banco: '', tipoOperacion: 'directo', billeteraDigital: '', numeroOperacion: '', fechaPago: '', monto: '', archivo: null }
}

export function inscripcionIndividualVacia(plan: CodigoPlan | '' = ''): FormularioInscripcionIndividual {
  return { tipoDocumento: 'dni', numeroDocumento: '', nombres: '', apellidos: '', correo: '', celular: '', plan }
}

/** Una fila está en blanco si no tiene ningún dato (se ignora al enviar; el plan precargado no cuenta). */
export function filaEnBlanco(fila: Pick<FilaIntegrante, 'numeroDocumento' | 'nombres' | 'apellidos' | 'correo' | 'celular'>): boolean {
  return !fila.numeroDocumento.trim() && !fila.nombres.trim() && !fila.apellidos.trim() && !fila.correo.trim() && !fila.celular.trim()
}

/** Las filas con datos, limpias y listas para enviar al backend. Con dominio, un correo sin `@` se completa. */
export function integrantesParaEnviar(filas: readonly FilaIntegrante[], dominio: string | null = null) {
  return filas.filter(fila => !filaEnBlanco(fila)).map(fila => ({
    tipoDocumento: fila.tipoDocumento,
    numeroDocumento: documentoLimpio(fila.tipoDocumento, fila.numeroDocumento),
    nombres: espacios(fila.nombres),
    apellidos: espacios(fila.apellidos),
    correo: correoCompleto(fila.correo, dominio),
    celular: fila.celular.replace(/\D/g, ''),
    ...(fila.plan ? { plan: fila.plan } : {}),
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

export interface OpcionesValidacion {
  /** Dominio de la delegación: los correos deben terminar en él. */
  dominio?: string | null
  /** Hay varios planes activos: cada integrante debe elegir el suyo. */
  pedirPlan?: boolean
}

/** Errores por fila (`filas[clave]`): solo valida las filas con datos. Repetidos también cuentan. */
export function validarIntegrantes(filas: readonly FilaIntegrante[], opciones: OpcionesValidacion = {}): Record<number, ErroresFormulario> {
  const dominio = opciones.dominio ?? null
  const errores: Record<number, ErroresFormulario> = {}
  const documentos = new Map<string, number>()
  const correos = new Map<string, number>()
  for (const fila of filas) {
    if (filaEnBlanco(fila)) continue
    const campos: ErroresFormulario = {}
    const documento = errorDocumento(fila.tipoDocumento, fila.numeroDocumento)
    if (documento) campos.numeroDocumento = documento
    if (espacios(fila.nombres).length < 2) campos.nombres = 'Ingresa los nombres.'
    if (espacios(fila.apellidos).length < 2) campos.apellidos = 'Ingresa los apellidos.'
    const correo = correoCompleto(fila.correo, dominio)
    if (!CORREO.test(correo)) campos.correo = 'Ingresa un correo válido.'
    else if (!terminaEnDominio(correo, dominio)) campos.correo = `El correo debe terminar en @${dominio}.`
    const celular = fila.celular.replace(/\D/g, '')
    if (celular && !/^\d{9,15}$/.test(celular)) campos.celular = 'El celular debe tener entre 9 y 15 dígitos.'
    if (opciones.pedirPlan && !fila.plan) campos.plan = 'Elige el plan.'

    const claveDocumento = `${fila.tipoDocumento}:${documentoLimpio(fila.tipoDocumento, fila.numeroDocumento)}`
    if (!campos.numeroDocumento && documentos.has(claveDocumento)) campos.numeroDocumento = 'Este documento está repetido.'
    if (!campos.correo && correos.has(correo)) campos.correo = 'Este correo está repetido.'
    documentos.set(claveDocumento, fila.clave)
    correos.set(correo, fila.clave)
    if (Object.keys(campos).length) errores[fila.clave] = campos
  }
  return errores
}

/** Errores de quien se inscribe solo con el link individual, por campo (vacío si es válido). */
export function validarInscripcionIndividual(form: FormularioInscripcionIndividual, opciones: { dominio: string | null, planes: readonly Pick<PlanPublico, 'codigo'>[] }): ErroresFormulario {
  const errores: ErroresFormulario = {}
  const documento = errorDocumento(form.tipoDocumento, form.numeroDocumento)
  if (documento) errores.numeroDocumento = documento
  if (espacios(form.nombres).length < 2) errores.nombres = 'Ingresa tus nombres.'
  if (espacios(form.apellidos).length < 2) errores.apellidos = 'Ingresa tus apellidos.'
  if (opciones.dominio) {
    const prefijo = prefijoDeCorreo(form.correo, opciones.dominio)
    if (!prefijo) errores.correo = 'Escribe tu correo.'
    else if (prefijo.includes('@')) errores.correo = `El correo debe terminar en @${opciones.dominio}.`
    else if (!PREFIJO.test(prefijo)) errores.correo = 'Escribe solo lo que va antes de la @.'
  } else if (!CORREO.test(form.correo.trim().toLowerCase())) {
    errores.correo = 'Ingresa un correo válido.'
  }
  const celular = form.celular.replace(/\D/g, '')
  if (celular && !esCelularValido(celular)) errores.celular = 'El celular debe tener 9 dígitos y empezar con 9.'
  if (opciones.planes.length > 1 && !form.plan) errores.plan = 'Elige tu plan.'
  return errores
}

/** Cuerpo de `POST …/join/:codigo/participants`: con dominio va el prefijo; sin dominio, el correo completo. Nunca precios. */
export function inscripcionIndividualParaEnviar(form: FormularioInscripcionIndividual, dominio: string | null) {
  return {
    tipoDocumento: form.tipoDocumento,
    numeroDocumento: documentoLimpio(form.tipoDocumento, form.numeroDocumento),
    nombres: espacios(form.nombres),
    apellidos: espacios(form.apellidos),
    celular: form.celular.replace(/\D/g, ''),
    ...(dominio ? { correoPrefijo: prefijoDeCorreo(form.correo, dominio) } : { correo: form.correo.trim().toLowerCase() }),
    ...(form.plan ? { plan: form.plan } : {}),
  }
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

/** Cuerpo `multipart/form-data` de `POST /delegaciones/:codigo/pagos`. */
export function construirFormDataPagos(pagos: readonly PagoFormulario[]): FormData {
  const cuerpo = new FormData()
  cuerpo.append('pagos', JSON.stringify(pagosParaEnviar(pagos)))
  for (const pago of pagos) if (pago.archivo) cuerpo.append(CAMPO_VOUCHERS, pago.archivo, pago.archivo.name || 'voucher')
  return cuerpo
}

// ─── Errores ────────────────────────────────────────────────────────────────

const MENSAJES_DELEGACION: Record<string, string> = {
  DELEGATION_NOT_FOUND: 'El link no es válido o ya no está activo. Pide un link nuevo a la organización.',
  DELEGATION_INACTIVE: 'La delegación está inactiva. Comunícate con la organización.',
  DELEGATION_WITHOUT_PLANS: 'La delegación aún no tiene planes disponibles. Comunícate con la organización.',
  DELEGATION_PLAN_NOT_AVAILABLE: 'Ese plan ya no está disponible. Elige otro.',
  PLAN_REQUIRED: 'Elige el plan (Con kit, Sin kit o Virtual).',
  EMAIL_DOMAIN_NOT_ALLOWED: 'El correo debe ser del dominio de tu institución.',
  NO_PARTICIPANTS: 'Registra al menos un integrante.',
  REGISTRATION_CLOSED: 'Las inscripciones para este evento están cerradas.',
  VOUCHER_REQUIRED: 'Adjunta un archivo por cada voucher.',
  OPERATION_ALREADY_REGISTERED: 'Uno de los números de operación ya fue registrado. Revisa el código de cada voucher.',
  DUPLICATE_PARTICIPANT: 'Hay documentos o correos repetidos entre los integrantes. Revisa la lista.',
  EMAIL_IN_USE: 'Ese correo ya está registrado por otra persona. Usa un correo distinto.',
  PARTICIPANT_ALREADY_REGISTERED: 'Ya tienes una inscripción en este evento fuera de esta delegación.',
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

/** El primer error del backend de un campo de la inscripción individual (`participantes[0].correo` → `correo`). */
export function erroresInscripcionIndividual(fields: Record<string, string> | undefined): ErroresFormulario {
  const resultado: ErroresFormulario = {}
  for (const [campo, texto] of Object.entries(fields ?? {})) {
    const partes = /^participantes\[0\]\.(\w+)$/.exec(campo)
    resultado[partes ? (partes[1] as string) : campo] = texto
  }
  return resultado
}
