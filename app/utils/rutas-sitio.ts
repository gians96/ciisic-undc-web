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
  /** Registro completo de una delegación (representante + integrantes + un solo pago). */
  delegaciones: '/api/publico/delegaciones',
  /** Tarifa por persona de las delegaciones del evento. */
  tarifaDelegaciones: '/api/publico/delegaciones/tarifa',
  /** Una delegación por su link (para abrir el formulario ya con ella cargada). */
  delegacionLink: (codigo: string) => `/api/publico/delegaciones/link/${encodeURIComponent(String(codigo).trim())}`,
  ponencias: '/api/publico/ponencias',
  contacto: '/api/publico/contacto',
} as const
