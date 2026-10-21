// ============================================================================
// RUTAS DEL BFF DE ESTA LANDING (mismo origen)
// El navegador nunca llama a backend-ciisic: Nitro (server/api/publico/*) agrega el token del
// evento y la IP del visitante. Contrato: specs/001-landing-multi-evento/contracts/bff-landing.md
// ============================================================================

export const rutasSitio = {
  evento: '/api/publico/evento',
  planes: '/api/publico/planes',
  catalogos: '/api/publico/catalogos',
  /** Client ID de Google y URL del panel (backend `GET /config`). */
  configuracion: '/api/publico/configuracion',
  consultaDni: (numero: string) => `/api/publico/consulta-dni/${encodeURIComponent(String(numero).trim())}`,
  verificacionEstudiante: '/api/publico/verificacion-estudiante',
  /** `{ credential }` de Google → backend `POST /google-verification` con `{ idToken }`. */
  verificacionGoogle: '/api/publico/verificacion-google',
  inscripciones: '/api/publico/inscripciones',
  ponencias: '/api/publico/ponencias',
  contacto: '/api/publico/contacto',
  /** Ponencias especializadas publicadas, con sus cupos (backend `GET /specialized-talks`). */
  ponenciasEspecializadas: '/api/publico/ponencias-especializadas',
  /** Inscripción a 1–4 ponencias, todo o nada (backend `POST /specialized-talk-registrations`). */
  inscripcionPonenciasEspecializadas: '/api/publico/ponencias-especializadas/inscripciones',
  /** Tarifa de las delegaciones por modalidad (backend `GET /delegations/tarifa`). */
  delegacionesTarifa: '/api/publico/delegaciones/tarifa',
  /** Registro de una delegación con sus integrantes y vouchers (backend `POST /delegations`). */
  delegaciones: '/api/publico/delegaciones',
  /** La delegación de un link (backend `GET /delegations/link/:codigo`). */
  delegacion: (codigo: string) => `/api/publico/delegaciones/${encodeURIComponent(codigo)}`,
  /** El delegado suma integrantes con su link (backend `POST …/link/:codigo/participants`). */
  delegacionIntegrantes: (codigo: string) => `/api/publico/delegaciones/${encodeURIComponent(codigo)}/integrantes`,
  /** El delegado suma vouchers con su link (backend `POST …/link/:codigo/payments`). */
  delegacionPagos: (codigo: string) => `/api/publico/delegaciones/${encodeURIComponent(codigo)}/pagos`,
} as const
