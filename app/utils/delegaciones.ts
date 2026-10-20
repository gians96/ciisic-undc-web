// ============================================================================
// DELEGACIONES: validación y multipart del registro de una delegación (funciones puras)
// Réplica de las reglas del backend (`registroDelegacionSchema` de
// backend-ciisic/src/api/delegation/validation.ts); el backend vuelve a validar,
// calcula la tarifa por persona y el monto total: aquí solo se avisa antes de enviar.
// ============================================================================
import type {
  DatosDelegacion,
  FilaParticipante,
  ParticipanteDelegacion,
  PagoDelegacion,
  RegistroDelegacion,
  RepresentanteDelegacion,
  TarifaDelegaciones,
} from '../types/delegaciones'
import type { CaracteristicaPlan } from '../types/evento'
import type { PlanInscripcion } from './planes'
import { CAMPO_VOUCHER, fechaHoyLima, normalizarFechaPago, validarArchivoVoucher } from './inscripcion'
import { esCorreoValido } from './verificacion'

/** Máximo de participantes por carga (regla del backend). */
export const MAXIMO_PARTICIPANTES_DELEGACION = 200

const DNI = /^\d{8}$/
const CARNE = /^[A-Za-z0-9]{9,12}$/
const CELULAR = /^\+?\d{9,15}$/

export type ErroresParticipante = Partial<Record<'numeroDocumento' | 'nombres' | 'apellidos' | 'correo' | 'celular', string>>

/** Errores por campo de un integrante; `{}` si está completo y es válido. */
export function erroresParticipante(fila: FilaParticipante): ErroresParticipante {
  const errores: ErroresParticipante = {}
  const numeroDocumento = String(fila.numeroDocumento ?? '').trim()
  const nombres = String(fila.nombres ?? '').trim()
  const apellidos = String(fila.apellidos ?? '').trim()
  const correo = String(fila.correo ?? '').trim()
  const celular = String(fila.celular ?? '').trim()

  if (fila.tipoDocumento === 'dni' ? !DNI.test(numeroDocumento) : !CARNE.test(numeroDocumento)) {
    errores.numeroDocumento = fila.tipoDocumento === 'dni' ? 'El DNI debe tener 8 dígitos' : 'El carné debe tener entre 9 y 12 caracteres'
  }
  if (nombres.length < 2 || nombres.length > 120) errores.nombres = 'Entre 2 y 120 caracteres'
  if (apellidos.length < 2 || apellidos.length > 120) errores.apellidos = 'Entre 2 y 120 caracteres'
  if (!esCorreoValido(correo)) errores.correo = 'Ingresa un correo válido'
  if (celular && !CELULAR.test(celular)) errores.celular = 'El celular debe tener entre 9 y 15 dígitos'
  return errores
}

export type ErroresRepresentante = ErroresParticipante

/** Errores por campo del representante; `{}` si está completo y es válido. */
export function erroresRepresentante(representante: RepresentanteDelegacion): ErroresRepresentante {
  return erroresParticipante({
    tipoDocumento: representante.tipoDocumento,
    numeroDocumento: representante.numeroDocumento,
    nombres: representante.nombres,
    apellidos: representante.apellidos,
    correo: representante.correo,
    celular: representante.celular,
  })
}

const documento = (fila: FilaParticipante) => `${fila.tipoDocumento}:${String(fila.numeroDocumento ?? '').trim()}`

/**
 * Validación de la lista completa: al menos un integrante, sin superar el máximo, sin documentos
 * ni correos repetidos y con todos los campos válidos. Devuelve el primer problema en español.
 */
export function validarFilasParticipantes(filas: FilaParticipante[]): string | null {
  if (!filas.length) return 'Agrega al menos un integrante.'
  if (filas.length > MAXIMO_PARTICIPANTES_DELEGACION) return `Puedes registrar hasta ${MAXIMO_PARTICIPANTES_DELEGACION} integrantes por carga.`

  const vistosDocumento = new Set<string>()
  const vistosCorreo = new Set<string>()
  for (const [indice, fila] of filas.entries()) {
    const claveDocumento = documento(fila)
    if (vistosDocumento.has(claveDocumento)) return `Fila ${indice + 1}: el documento ${String(fila.numeroDocumento ?? '').trim()} está repetido en la lista.`
    vistosDocumento.add(claveDocumento)

    const correo = String(fila.correo ?? '').trim().toLowerCase()
    if (vistosCorreo.has(correo)) return `Fila ${indice + 1}: el correo ${correo} está repetido en la lista.`
    vistosCorreo.add(correo)

    const errores = erroresParticipante(fila)
    const campo = Object.keys(errores)[0] as keyof ErroresParticipante | undefined
    if (campo) return `Fila ${indice + 1}: ${errores[campo]}`
  }
  return null
}

export type ErroresDatosDelegacion = Partial<Record<keyof DatosDelegacion, string>>

/** Errores por campo de la delegación; `{}` si los datos son válidos. */
export function erroresDatosDelegacion(datos: DatosDelegacion): ErroresDatosDelegacion {
  const errores: ErroresDatosDelegacion = {}
  const nombre = String(datos.nombre ?? '').trim()
  if (nombre.length < 2 || nombre.length > 150) errores.nombre = 'Entre 2 y 150 caracteres'
  if (String(datos.institucion ?? '').trim().length > 191) errores.institucion = 'Máximo 191 caracteres'
  return errores
}

/** Valida los datos de la delegación (mismas reglas que el backend). */
export function validarDatosDelegacion(datos: DatosDelegacion): string | null {
  const errores = erroresDatosDelegacion(datos)
  const campo = Object.values(errores)[0]
  return campo ? `Datos de la delegación: ${campo}.` : null
}

/** Valida los datos del representante; `null` si están completos y son válidos. */
export function validarRepresentante(representante: RepresentanteDelegacion): string | null {
  const errores = erroresRepresentante(representante)
  const campo = Object.keys(errores)[0] as keyof ErroresRepresentante | undefined
  return campo ? `Datos del representante: ${errores[campo]}` : null
}

/** Valida el pago único (código del voucher, fecha no futura en Lima y archivo). */
export function validarPagoDelegacion(pago: Omit<PagoDelegacion, 'voucher'> & { voucher?: Pick<File, 'name' | 'size' | 'type'> | null }): string | null {
  const numeroOperacion = String(pago.numeroOperacion ?? '').trim()
  if (numeroOperacion.length < 3 || numeroOperacion.length > 100) return 'Escribe el código del voucher (entre 3 y 100 caracteres).'
  try {
    if (normalizarFechaPago(pago.fechaPago) > fechaHoyLima()) return 'La fecha de pago no puede ser futura.'
  } catch {
    return 'Ingresa una fecha de pago válida.'
  }
  return validarArchivoVoucher(pago.voucher) || null
}

/**
 * Tarifa por persona: la promocional en cuanto la delegación alcanza el mínimo. Es la misma
 * regla que el backend (`precioUnitario`), para que el estimado coincida con el monto real.
 */
export function precioUnitarioDelegacion(
  precioEstandar: number,
  precioPromocional: number,
  minIntegrantes: number,
  totalIntegrantes: number,
): number {
  return totalIntegrantes >= minIntegrantes ? precioPromocional : precioEstandar
}

/**
 * Estimado para mostrar en pantalla (tarifa vigente × cantidad); el monto definitivo siempre lo
 * calcula y confirma el backend al registrar.
 */
export function estimadoTotal(tarifa: TarifaDelegaciones, cantidad: number): number {
  const unitario = precioUnitarioDelegacion(tarifa.precioEstandar, tarifa.precioPromocional, tarifa.minIntegrantes, cantidad)
  return Math.round(unitario * cantidad * 100) / 100
}

// ─── Tarjetas de tipo de delegación (spec 019) ─────────────────────────────

/** Códigos de contrato de la categoría `DELEGACIONES` (spec 019 de backend-ciisic). */
export const CODIGOS_TIPO_DELEGACION = {
  general: 'delegacion_general',
  promocional: 'delegacion_grupal',
} as const

/** Tarjeta que ofrece el formulario para elegir el tipo de delegación. */
export interface TarjetaTipoDelegacion {
  id: number
  codigo: string
  titulo: string
  badge: string
  precio: number
  descripcion: string
  caracteristicas: CaracteristicaPlan[]
}

type PlanTipoDelegacion = Pick<PlanInscripcion, 'id' | 'codigo' | 'title' | 'badge' | 'basePrice' | 'description' | 'features'>

/**
 * Las dos tarjetas del contrato, en su orden (General → Promocional), tomadas de los planes de
 * la categoría `DELEGACIONES`. Si falta alguna, no aparece: la vista avisa por separado.
 */
export function tarjetasDelegacion(planes: readonly PlanTipoDelegacion[]): TarjetaTipoDelegacion[] {
  const porCodigo = new Map(planes.map(plan => [plan.codigo, plan]))
  return [CODIGOS_TIPO_DELEGACION.general, CODIGOS_TIPO_DELEGACION.promocional]
    .flatMap((codigo) => {
      const plan = porCodigo.get(codigo)
      return plan ? [{
        id: plan.id,
        codigo: plan.codigo,
        titulo: plan.title,
        badge: plan.badge,
        precio: plan.basePrice,
        descripcion: plan.description,
        caracteristicas: plan.features,
      }] : []
    })
}

/** El evento ofrece las dos tarjetas obligatorias (spec 019). */
export function tiposDelegacionCompletos(tarjetas: readonly TarjetaTipoDelegacion[]): boolean {
  return tarjetas.length === 2
}

/** Qué falta configurar, con los códigos que el staff debe activar en el panel. */
export function mensajeTiposDelegacionFaltantes(tarjetas: readonly TarjetaTipoDelegacion[]): string {
  const faltantes = [CODIGOS_TIPO_DELEGACION.general, CODIGOS_TIPO_DELEGACION.promocional]
    .filter(codigo => !tarjetas.some(tarjeta => tarjeta.codigo === codigo))
  return `Los tipos de delegación aún no están disponibles en el sistema (${faltantes.join(' y ')}, categoría DELEGACIONES). Pídeselo a la organización antes de registrar el grupo.`
}

/** El tipo elegido tiene que ser una de las tarjetas ofrecidas; `null` si aún no se elige. */
export function validarTipoDelegacion(tarjetas: readonly TarjetaTipoDelegacion[], elegido: number | null): string | null {
  if (elegido === null) return 'Elige el tipo de delegación.'
  return tarjetas.some(tarjeta => tarjeta.id === elegido) ? null : 'Elige un tipo de delegación válido.'
}

const espacios = (texto: string) => String(texto ?? '').replace(/\s+/g, ' ').trim()

// ─── Carga masiva por texto ────────────────────────────────────────────────

const SEPARADOR = /\s*[,;\t]\s*/
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CELULAR_CARGA = /^\+?\d{9,15}$/

export interface ResultadoCargaDelegacion {
  filas: FilaParticipante[]
  errores: string[]
}

/** Reparte un nombre completo en nombres y apellidos (la última palabra es el apellido). */
function partirNombre(completo: string): { nombres: string, apellidos: string } {
  const partes = completo.trim().split(/\s+/).filter(Boolean)
  if (partes.length < 2) return { nombres: completo.trim(), apellidos: '' }
  return { nombres: partes.slice(0, -1).join(' '), apellidos: partes[partes.length - 1] ?? '' }
}

function esEncabezado(campos: string[]): boolean {
  return /^(dni|documento|doc|numero|número|nro\.?)$/i.test((campos[0] ?? '').trim())
}

/**
 * Lee una carga masiva (una persona por línea) con estos formatos:
 * - `DNI, Nombres, Apellidos, Correo, Celular`
 * - `DNI, Nombres, Apellidos, Correo`
 * - `DNI, Nombres completos, Correo` (la última palabra pasa a ser el apellido)
 * Acepta coma, punto y coma o tabulador. Ignora líneas vacías y una cabecera. Los errores se
 * informan con el número de línea para poder corregir el texto antes de enviarlo.
 */
export function parsearParticipantesDelegacion(texto: string): ResultadoCargaDelegacion {
  const lineas = texto.split(/\r?\n/).map((linea) => linea.trim()).filter(Boolean)
  const filas: FilaParticipante[] = []
  const errores: string[] = []

  lineas.forEach((linea, indice) => {
    const campos = linea.split(SEPARADOR).map((campo) => campo.trim())
    if (indice === 0 && esEncabezado(campos)) return
    const numeroLinea = indice + 1
    if (campos.length < 3 || campos.length > 5) {
      errores.push(`Línea ${numeroLinea}: usa 3, 4 o 5 columnas separadas por coma.`)
      return
    }

    const [numeroDocumento, primerNombre, segundo, tercero, cuarto] = campos
    let nombres = primerNombre ?? ''
    let apellidos: string
    let correo: string
    let celular = ''
    if (campos.length === 3) {
      const partes = partirNombre(primerNombre ?? '')
      nombres = partes.nombres
      apellidos = partes.apellidos
      correo = segundo ?? ''
    } else if (campos.length === 4) {
      apellidos = segundo ?? ''
      correo = tercero ?? ''
    } else {
      apellidos = segundo ?? ''
      correo = tercero ?? ''
      celular = cuarto ?? ''
    }

    if (!numeroDocumento) errores.push(`Línea ${numeroLinea}: falta el documento.`)
    if (!nombres.trim()) errores.push(`Línea ${numeroLinea}: falta el nombre.`)
    if (!apellidos.trim()) errores.push(`Línea ${numeroLinea}: faltan los apellidos (puedes escribir el nombre completo en una sola columna).`)
    if (!CORREO.test(correo)) errores.push(`Línea ${numeroLinea}: el correo «${correo}» no es válido.`)
    if (celular && !CELULAR_CARGA.test(celular)) errores.push(`Línea ${numeroLinea}: el celular «${celular}» no es válido.`)
    if (!numeroDocumento || !nombres.trim() || !apellidos.trim() || !CORREO.test(correo) || (celular && !CELULAR_CARGA.test(celular))) return

    filas.push({
      tipoDocumento: /^\d{8}$/.test(numeroDocumento) ? 'dni' : 'ce',
      numeroDocumento,
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correo: correo.toLowerCase(),
      celular,
    })
  })

  return { filas, errores }
}

/** Lista del formulario → la de la carga (limpia espacios y normaliza el correo). */
export function normalizarParticipantes(filas: FilaParticipante[]): ParticipanteDelegacion[] {
  return filas.map(fila => ({
    tipoDocumento: fila.tipoDocumento,
    numeroDocumento: String(fila.numeroDocumento ?? '').trim().toUpperCase(),
    nombres: espacios(fila.nombres),
    apellidos: espacios(fila.apellidos),
    correo: String(fila.correo ?? '').trim().toLowerCase(),
    celular: String(fila.celular ?? '').replace(/\D/g, ''),
  }))
}

/** El representante con los espacios limpiados y el correo normalizado. */
export function normalizarRepresentante(representante: RepresentanteDelegacion): RepresentanteDelegacion {
  return {
    tipoDocumento: representante.tipoDocumento,
    numeroDocumento: String(representante.numeroDocumento ?? '').trim().toUpperCase(),
    nombres: espacios(representante.nombres),
    apellidos: espacios(representante.apellidos),
    correo: String(representante.correo ?? '').trim().toLowerCase(),
    celular: String(representante.celular ?? '').replace(/\D/g, ''),
    esIntegrante: representante.esIntegrante,
  }
}

/**
 * Registro completo → `multipart/form-data` del contrato: la delegación, el representante y los
 * participantes como JSON, los campos de pago escalares y el archivo en `voucher`.
 */
export function aRegistroDelegacion(datos: RegistroDelegacion): FormData {
  const cuerpo = new FormData()
  const { nombre, institucion } = datos.delegacion
  // Con link, el registro se suma a la delegación que el staff ya creó (su tarifa y su mínimo).
  const codigoLink = String(datos.codigoLink ?? '').trim()
  if (codigoLink) cuerpo.append('codigoLink', codigoLink)
  // Tipo elegido en la tarjeta (spec 019): lo guarda el backend en la delegación y en el grupo.
  const tipoInscripcionId = Number(datos.tipoInscripcionId)
  if (Number.isInteger(tipoInscripcionId) && tipoInscripcionId > 0) {
    cuerpo.append('tipoInscripcionId', String(tipoInscripcionId))
  }
  cuerpo.append('delegacion', JSON.stringify({
    nombre: espacios(nombre),
    institucion: espacios(institucion) || null,
  }))
  cuerpo.append('representante', JSON.stringify(normalizarRepresentante(datos.representante)))
  cuerpo.append('participantes', JSON.stringify(normalizarParticipantes(datos.participantes)))

  const pago = datos.pago
  cuerpo.append('modalidadPago', pago.modalidadPago)
  if (pago.modalidadPago === 'banco') {
    if (pago.banco) cuerpo.append('banco', pago.banco)
    if (pago.tipoOperacion) cuerpo.append('tipoOperacion', pago.tipoOperacion)
  } else if (pago.billeteraDigital) {
    cuerpo.append('billeteraDigital', pago.billeteraDigital)
  }
  cuerpo.append('numeroOperacion', String(pago.numeroOperacion ?? '').trim())
  cuerpo.append('fechaPago', pago.fechaPago)
  cuerpo.append(CAMPO_VOUCHER, pago.voucher, 'name' in pago.voucher && pago.voucher.name ? pago.voucher.name : 'voucher')
  return cuerpo
}
