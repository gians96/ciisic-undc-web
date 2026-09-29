// ============================================================================
// RUTAS DE LA API PÚBLICA (backend-ciisic, prefijo /api/v1/public)
// ============================================================================

const BASE_PUBLICA = '/api/v1/public'

const segmento = (valor: string) => encodeURIComponent(String(valor).trim())

const rutaEvento = (codigo: string) => `${BASE_PUBLICA}/events/${segmento(codigo)}`

/**
 * Acciones del visitante: van directo del navegador a `NUXT_PUBLIC_API_BASE_URL`, así cada
 * visitante tiene su propio límite por IP en el backend.
 */
export const rutasApiPublica = {
  inscripciones: (codigo: string) => `${rutaEvento(codigo)}/inscriptions`,
  verificacionEstudiante: (codigo: string) => `${rutaEvento(codigo)}/student-verification`,
  papers: (codigo: string) => `${rutaEvento(codigo)}/papers`,
  contacto: (codigo: string) => `${rutaEvento(codigo)}/contact`,
  consultaDni: (numero: string) => `${BASE_PUBLICA}/document-lookup/dni/${segmento(numero)}`,
} as const

/**
 * Lecturas que se renderizan en SSR: pasan por rutas Nitro de esta landing con caché de 60 s
 * (`server/api/publico/*`), que consultan el evento configurado en el backend.
 */
export const rutasCachePublica = {
  evento: '/api/publico/evento',
  planes: '/api/publico/planes',
} as const
