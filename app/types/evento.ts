// ============================================================================
// TIPOS DE LA API PÚBLICA MULTI-EVENTO (backend-ciisic)
// Contratos: backend-ciisic/specs/002-multi-evento/contracts/api-publica.md,
// 003-consultas-dni/contracts/api-consultas.md y 004-verificacion-estudiante/contracts/api-verificacion.md
// ============================================================================

/** Respuesta de éxito de la API pública: `{ success: true, data }`. */
export interface ApiExito<T> {
  success: true
  data: T
}

export interface CuentaBancaria {
  codigo: string
  nombre: string
  numeroCuenta: string
  cci?: string | null
}

export interface BilleteraDigital {
  codigo: string
  nombre: string
  telefono: string
  qrUrl?: string | null
  /** Imagen subida en el panel; tiene prioridad sobre `qrUrl`. */
  qrArchivo?: string | null
}

export interface DatosPago {
  titular?: string | null
  bancos?: CuentaBancaria[] | null
  billeteras?: BilleteraDigital[] | null
}

export interface ContactoEvento {
  correo?: string | null
  telefono?: string | null
}

export interface VentanaInscripciones {
  abiertas: boolean
  inicio: string | null
  fin: string | null
}

export interface EventoPublico {
  codigo: string
  nombre: string
  nombreCorto: string
  descripcion: string | null
  sede: string | null
  fechaInicio: string
  fechaFin: string
  estado: string
  inscripciones: VentanaInscripciones
  dominioInstitucional: string
  contacto: ContactoEvento | null
  datosPago: DatosPago | null
}

export type CodigoCategoria = 'ESTUDIANTES' | 'PUBLICO_GENERAL'

export interface CaracteristicaPlan {
  icon: string
  text: string
}

/**
 * A quién se ofrece un tipo (spec 016 de backend-ciisic): a todos, solo a quien recibe el precio
 * institucional (comunidad UNDC) o solo a quien no lo recibe (externos).
 */
export type DisponiblePara = 'TODOS' | 'INSTITUCIONAL' | 'EXTERNOS'

export interface TipoInscripcionApi {
  id: number
  codigo: string
  nombre: string
  etiqueta: string | null
  descripcion: string | null
  caracteristicas: CaracteristicaPlan[] | null
  precio: number | string
  precioInstitucional: number | string | null
  /** Ausente en un backend anterior: equivale a `TODOS`. */
  disponiblePara?: DisponiblePara | null
}

export interface CategoriaInscripcionApi {
  codigo: string
  nombre: string
  descripcion: string | null
  esEstudiantil: boolean
  precioDesde: number | null
  caracteristicas: CaracteristicaPlan[] | null
  tipos: TipoInscripcionApi[]
}

export type MotivoVerificacion =
  | 'CORREO_NO_INSTITUCIONAL'
  | 'DOCUMENTO_NO_SOPORTADO'
  | 'NO_ES_ESTUDIANTE'
  | 'EGRESADO'
  | 'IDENTIDAD_NO_COINCIDE'
  | 'SIN_DATOS_IDENTIDAD'
  | 'SERVICIO_NO_DISPONIBLE'

export interface VerificacionEstudiante {
  esEstudianteUndc: boolean
  codigoEstudiante: string | null
  motivo: MotivoVerificacion | null
  verificacionToken: string | null
}

export interface ConsultaDni {
  numero: string
  nombres: string
  apellidoPaterno: string | null
  apellidoMaterno: string | null
  apellidos: string | null
}

export interface ClasificacionCatalogo {
  id: number
  nombre: string
}

export interface TipoDocumentoCatalogo {
  id: string
  nombre: string
  abreviatura: string
}

/** `GET /api/v1/site/catalogs` (vía `/api/publico/catalogos`). */
export interface CatalogosSitio {
  clasificaciones: ClasificacionCatalogo[]
  tiposDocumento: TipoDocumentoCatalogo[]
}

/**
 * `GET /api/v1/site/config` (vía `/api/publico/configuracion`): lo que el navegador necesita de
 * las integraciones, definido en el backend (no hay variables `NUXT_PUBLIC_*`).
 */
export interface ConfiguracionSitioApi {
  google: { clientId: string | null } | null
  /** Panel (administradores y participantes); `/login` redirige aquí. */
  urlPanel: string | null
}

/**
 * Tipo de cuenta según el correo (regla fija del backend): `undc.edu.pe` con parte local numérica
 * de 8 a 12 dígitos = estudiante; otra parte local del dominio = personal; otro dominio = externo.
 */
export type TipoCuentaCorreo = 'ESTUDIANTE' | 'PERSONAL' | 'EXTERNO'

/** `POST /api/v1/site/google-verification` (vía `/api/publico/verificacion-google`). */
export interface VerificacionCorreoGoogle {
  correo: string
  nombres: string | null
  apellidos: string | null
  tipoCuenta: TipoCuentaCorreo
  esInstitucional: boolean
  /** Prueba firmada de la verificación (24 h, atada al evento y al correo); solo en memoria. */
  verificacionCorreoToken: string
}
