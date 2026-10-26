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
  /** Datos de la credencial 3D por su código: enlace del correo (backend `GET /credential/:codigo`, spec 038). */
  credencial: (codigo: string) => `/api/publico/credencial/${encodeURIComponent(String(codigo).trim().toUpperCase())}`,
  /** Guarda las tecnologías elegidas en la credencial (backend `POST /credential/:codigo/technologies`, spec 038). */
  tecnologiasCredencial: (codigo: string) => `/api/publico/credencial/${encodeURIComponent(String(codigo).trim().toUpperCase())}/tecnologias`,
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
  /** Verifica el documento y el correo de un congresista con el pago aprobado y dice su modo (backend `POST /specialized-talk-eligibility`). */
  verificacionPonenciasEspecializadas: '/api/publico/ponencias-especializadas/elegibilidad',
  /** Aforo por tema con el enlace público del Owner; el token va en el cuerpo (backend `GET /specialized-talk-occupancy`, spec 036). */
  aforoPonenciasEspecializadas: '/api/publico/ponencias-especializadas/aforo',
  /** La delegación de un link (backend `GET /delegations/link/:codigo`). */
  delegacion: (codigo: string) => `/api/publico/delegaciones/${encodeURIComponent(codigo)}`,
  /** El delegado suma integrantes con su link (backend `POST …/link/:codigo/participants`). */
  delegacionIntegrantes: (codigo: string) => `/api/publico/delegaciones/${encodeURIComponent(codigo)}/integrantes`,
  /** El delegado suma vouchers con su link (backend `POST …/link/:codigo/payments`). */
  delegacionPagos: (codigo: string) => `/api/publico/delegaciones/${encodeURIComponent(codigo)}/pagos`,
  /** El link individual: el grupo, el dominio y los planes activos (backend `GET …/join/:codigo`). */
  delegacionUnirse: (codigo: string) => `/api/publico/delegaciones/unirse/${encodeURIComponent(codigo)}`,
  /** El link individual: un integrante se inscribe solo (backend `POST …/join/:codigo/participants`). */
  delegacionInscribirme: (codigo: string) => `/api/publico/delegaciones/unirse/${encodeURIComponent(codigo)}/participante`,
} as const
