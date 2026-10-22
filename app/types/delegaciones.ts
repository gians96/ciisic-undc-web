// ============================================================================
// DELEGACIONES — BFF /api/publico/delegaciones/* → backend /api/v1/site/delegations/*
// Contrato: backend-ciisic/specs/029-delegaciones-planes/contracts/api-delegaciones-planes.md
// ============================================================================
import type { ModalidadAsistencia } from './evento'
import type { ModalidadPago, TipoDocumentoApi, TipoOperacion } from './inscription'

/** Planes de una delegación (spec 029): cada integrante elige uno. */
export type CodigoPlan = 'CON_KIT' | 'SIN_KIT' | 'VIRTUAL'

/** Un plan en la vista del delegado (con su estado y cuántos integrantes lo tienen). */
export interface PlanVisible {
  codigo: CodigoPlan
  etiqueta: string | null
  modalidad: ModalidadAsistencia
  activo: boolean
  precio: number
  /** `null` = sin escala. Desde `minIntegrantes` el plan cobra este precio. */
  precioPromocional: number | null
  /** Lo que paga hoy cada integrante de este plan. */
  precioUnitario: number
  integrantes: number
}

/** Un plan activo en la vista del link individual. */
export interface PlanPublico {
  codigo: CodigoPlan
  etiqueta: string | null
  modalidad: ModalidadAsistencia
  precio: number
  precioPromocional: number | null
}

export type EstadoPagoDelegacion = 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO'

export interface ResumenPagoDelegacion {
  totalAPagar: number
  declarado: number
  verificado: number
  /** Positivo: falta pagar; negativo: se declaró de más. */
  saldo: number
  cantidad: number
}

export interface IntegranteVisible {
  nombres: string
  apellidos: string
  /** Enmascarado: solo se ven los últimos dígitos. */
  documento: string
  estado: string
  plan: CodigoPlan | null
}

export interface PagoVisible {
  id: number
  medio: string | null
  /** Enmascarado. */
  numeroOperacion: string
  fechaPago: string | null
  monto: number
  estado: EstadoPagoDelegacion
  creadoEn: string
}

export interface EventoDelegacion {
  id: number
  codigo: string
  nombre: string
  nombreCorto?: string
  inscripcionesAbiertas: boolean
  estado: string
}

/** Lo que ve el delegado con su link (sin el correo ni el teléfono del delegado). */
export interface DelegacionVisible {
  id: number
  nombre: string
  codigoLink: string
  /** Link individual para compartirlo con el grupo; `null` si está apagado. */
  codigoInscripcion: string | null
  institucion: string | null
  representanteNombre: string | null
  evento: EventoDelegacion
  /** Dominio de los correos (`unac.edu.pe`); `null` = cualquiera. */
  dominioCorreo: string | null
  minIntegrantes: number
  planes: PlanVisible[]
  totalIntegrantes: number
  montoTotal: number
  faltanParaPromocional: number | null
  pago: ResumenPagoDelegacion
  integrantes: IntegranteVisible[]
  pagos: PagoVisible[]
  /** Solo en la respuesta de una carga de integrantes. */
  registrados?: number
  omitidos?: number
}

/** Lo que ve quien abre el link individual: el grupo, el dominio y los planes activos. */
export interface DelegacionPublica {
  nombre: string
  institucion: string | null
  evento: EventoDelegacion & { fechaInicio?: string, fechaFin?: string }
  dominioCorreo: string | null
  minIntegrantes: number
  planes: PlanPublico[]
}

/** Respuesta de la inscripción individual. */
export interface InscripcionIndividualRespuesta {
  delegacion: { nombre: string }
  plan: { codigo: CodigoPlan, etiqueta: string | null, modalidad: ModalidadAsistencia }
  registrados: number
  omitidos: number
}

/** Un integrante del formulario del delegado. */
export interface FilaIntegrante {
  /** Clave estable para `v-for`. */
  clave: number
  tipoDocumento: TipoDocumentoApi
  numeroDocumento: string
  nombres: string
  apellidos: string
  correo: string
  celular: string
  /** Plan elegido; `''` mientras no se elige (el servidor asume el único plan activo). */
  plan: CodigoPlan | ''
  /** Mensaje de la última consulta DNI (vacío si se completó). */
  aviso: string
  buscando: boolean
}

/** Un voucher del formulario, con su archivo. */
export interface PagoFormulario {
  clave: number
  modalidadPago: ModalidadPago
  banco: string
  tipoOperacion: TipoOperacion
  billeteraDigital: string
  numeroOperacion: string
  fechaPago: string
  monto: number | ''
  archivo: File | null
}

/** El integrante que se inscribe solo con el link individual. */
export interface FormularioInscripcionIndividual {
  tipoDocumento: TipoDocumentoApi
  numeroDocumento: string
  nombres: string
  apellidos: string
  /** Con dominio: solo lo que va antes de la `@`. Sin dominio: el correo completo. */
  correo: string
  celular: string
  plan: CodigoPlan | ''
}

export type ErroresFormulario = Record<string, string>
