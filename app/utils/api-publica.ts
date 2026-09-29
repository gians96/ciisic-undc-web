// ============================================================================
// RUTAS DE LA API PÚBLICA (backend-ciisic, prefijo /api/v1/public)
// ============================================================================

const BASE_PUBLICA = '/api/v1/public'

const segmento = (valor: string) => encodeURIComponent(String(valor).trim())

const rutaEvento = (codigo: string) => `${BASE_PUBLICA}/events/${segmento(codigo)}`

export const rutasApiPublica = {
  evento: rutaEvento,
  tiposInscripcion: (codigo: string) => `${rutaEvento(codigo)}/registration-types`,
  inscripciones: (codigo: string) => `${rutaEvento(codigo)}/inscriptions`,
  verificacionEstudiante: (codigo: string) => `${rutaEvento(codigo)}/student-verification`,
  papers: (codigo: string) => `${rutaEvento(codigo)}/papers`,
  contacto: (codigo: string) => `${rutaEvento(codigo)}/contact`,
  consultaDni: (numero: string) => `${BASE_PUBLICA}/document-lookup/dni/${segmento(numero)}`,
} as const
