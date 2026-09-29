// ============================================================================
// RUTAS DEL BFF DE ESTA LANDING (mismo origen)
// El navegador nunca llama a backend-ciisic: Nitro (server/api/publico/*) agrega el token del
// evento y la IP del visitante. Contrato: specs/001-landing-multi-evento/contracts/bff-landing.md
// ============================================================================

export const rutasSitio = {
  evento: '/api/publico/evento',
  planes: '/api/publico/planes',
  catalogos: '/api/publico/catalogos',
  consultaDni: (numero: string) => `/api/publico/consulta-dni/${encodeURIComponent(String(numero).trim())}`,
  verificacionEstudiante: '/api/publico/verificacion-estudiante',
  inscripciones: '/api/publico/inscripciones',
  ponencias: '/api/publico/ponencias',
  contacto: '/api/publico/contacto',
} as const
