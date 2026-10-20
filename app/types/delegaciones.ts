// ============================================================================
// DELEGACIONES: registro público de una delegación con representante y pago conjunto
// backend-ciisic `POST /api/v1/site/delegations` — contrato en
// backend-ciisic/specs/018-delegaciones/contracts/api-delegaciones.md y
// specs/019-tipos-delegacion/contracts/api-tipos-delegacion.md
// ============================================================================

export type TipoDocumentoDelegacion = 'dni' | 'ce'
export type ModalidadPagoDelegacion = 'banco' | 'billetera'

/** Datos de la delegación: nombre e institución (el representante va aparte). */
export interface DatosDelegacion {
  nombre: string
  institucion: string
}

/** El representante: contacto del grupo y, si marca la casilla, su primer integrante. */
export interface RepresentanteDelegacion {
  nombres: string
  apellidos: string
  tipoDocumento: TipoDocumentoDelegacion
  numeroDocumento: string
  correo: string
  celular: string
  /** Si además integra el grupo, el backend lo pone primero en la lista. */
  esIntegrante: boolean
}

/** Integrante de la delegación, en la forma que espera el backend. */
export interface ParticipanteDelegacion {
  tipoDocumento: TipoDocumentoDelegacion
  numeroDocumento: string
  nombres: string
  apellidos: string
  correo: string
  celular: string
}

/** Fila del formulario de la landing (puede estar incompleta mientras se escribe). */
export type FilaParticipante = ParticipanteDelegacion

/** Pago único de toda la delegación (un solo voucher para el total). */
export interface PagoDelegacion {
  modalidadPago: ModalidadPagoDelegacion
  banco: string | null
  tipoOperacion: string | null
  billeteraDigital: string | null
  numeroOperacion: string
  fechaPago: string
  voucher: File
}

/** Registro completo de la delegación (payload del contrato). */
export interface RegistroDelegacion {
  /** Link de una delegación ya creada por el staff: el registro se suma a ese grupo. */
  codigoLink?: string | null
  /** Tipo elegido en la tarjeta (spec 019): lo guarda el backend en la delegación y en el grupo. */
  tipoInscripcionId?: number | null
  delegacion: DatosDelegacion
  representante: RepresentanteDelegacion
  participantes: FilaParticipante[]
  pago: PagoDelegacion
}

/** Tipo de delegación elegido en la tarjeta (Delegación General / Promocional; spec 019). */
export interface TipoDelegacionResumido {
  id: number
  codigo: string
  nombre: string
  etiqueta: string | null
}

/** Tarifa por defecto de las delegaciones del evento (la muestra el formulario). */
export interface TarifaDelegaciones {
  minIntegrantes: number
  precioEstandar: number
  precioPromocional: number
}

/** Datos de una delegación por su link (para abrir el formulario ya con ella cargada). */
export interface DelegacionPorLink {
  id: number
  nombre: string
  codigoLink: string
  institucion: string | null
  representanteNombre: string | null
  minIntegrantes: number
  precioEstandar: number
  precioPromocional: number
  precioUnitario: number
  totalIntegrantes: number
  /** Tipo ya elegido al crearla (spec 019): precarga la tarjeta correspondiente. */
  tipoInscripcion: TipoDelegacionResumido | null
}

/** Respuesta del registro (`201`): el monto total lo calcula el backend. */
export interface RegistroDelegacionCreado {
  id: number
  nombre: string
  codigoLink: string
  institucion: string | null
  minIntegrantes: number
  precioEstandar: number
  precioPromocional: number
  precioUnitario: number
  totalIntegrantes: number
  montoTotal: number
  tarifaUnitaria: number
  registrados: number
}
