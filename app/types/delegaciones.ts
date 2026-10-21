// ============================================================================
// DELEGACIONES — BFF /api/publico/delegaciones/* → backend /api/v1/site/delegations/*
// Contrato: backend-ciisic/specs/023-delegaciones-convenio/contracts/api-delegaciones-convenio.md
// ============================================================================
import type { ModalidadAsistencia } from './evento'
import type { ModalidadPago, TipoDocumentoApi, TipoOperacion } from './inscription'

/** `GET /delegations/tarifa`: la tarifa virtual es `null` mientras el evento no tenga su tipo. */
export interface TarifaDelegaciones {
  minIntegrantes: number
  precioEstandar: number
  precioPromocional: number
  virtual: { precio: number } | null
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

/** Lo que ve el delegado con su link (sin el correo ni el teléfono del delegado). */
export interface DelegacionVisible {
  id: number
  nombre: string
  codigoLink: string
  institucion: string | null
  modalidad: ModalidadAsistencia
  representanteNombre: string | null
  evento: { id: number, codigo: string, nombre: string, nombreCorto?: string, inscripcionesAbiertas: boolean, estado: string }
  minIntegrantes: number
  precioEstandar: number
  precioPromocional: number
  precioUnitario: number
  totalIntegrantes: number
  montoTotal: number
  faltanParaPromocional: number | null
  tipoInscripcion: { id: number, codigo: string, nombre: string, etiqueta: string | null } | null
  pago: ResumenPagoDelegacion
  integrantes: IntegranteVisible[]
  pagos: PagoVisible[]
  /** Solo en la respuesta de un registro o de una carga de integrantes. */
  registrados?: number
  omitidos?: number
}

/** Un integrante del formulario. */
export interface FilaIntegrante {
  /** Clave estable para `v-for`. */
  clave: number
  tipoDocumento: TipoDocumentoApi
  numeroDocumento: string
  nombres: string
  apellidos: string
  correo: string
  celular: string
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

/** El delegado del formulario. */
export interface FormularioDelegado {
  tipoDocumento: TipoDocumentoApi
  numeroDocumento: string
  nombres: string
  apellidos: string
  correo: string
  celular: string
  esIntegrante: boolean
}

export type ErroresFormulario = Record<string, string>
