// ============================================================================
// LECTURAS DE LA API PÚBLICA DESDE NITRO (con caché corta en server/api/publico/*)
// Las acciones del visitante (DNI, verificación, inscripción, papers, contacto) NO pasan por
// aquí: van directo del navegador a NUXT_PUBLIC_API_BASE_URL con su propio límite por IP.
// ============================================================================
import type { H3Event } from 'h3'

/** Código del evento configurado (la caché nunca acepta otro código desde la URL). */
export function codigoEventoConfigurado(event: H3Event): string {
  return String(useRuntimeConfig(event).public.eventoCodigo || '').trim().toLowerCase()
}

/** Base del backend para Nitro: `backendBaseUrl` (red interna) o, si falta, la URL pública. */
export function baseBackend(event: H3Event): string {
  const config = useRuntimeConfig(event)
  return String(config.backendBaseUrl || config.public.apiBaseUrl || '').replace(/\/$/, '')
}

/**
 * GET a la API pública del backend. Conserva el estado HTTP y el cuerpo de error del contrato
 * (`{ success: false, code, message }`) para que el cliente lo trate igual que una llamada
 * directa. Las respuestas con estado >= 400 no se guardan en la caché de Nitro.
 */
export async function leerApiPublica(event: H3Event, ruta: string, query?: Record<string, string>): Promise<unknown> {
  try {
    return await $fetch(ruta, { baseURL: baseBackend(event), query, timeout: 10000, retry: 0 })
  } catch (error) {
    const falla = error as { statusCode?: number; data?: unknown }
    if (falla.statusCode) {
      setResponseStatus(event, falla.statusCode)
      return falla.data ?? { success: false, code: 'REQUEST_ERROR', message: 'No se pudo completar la solicitud.' }
    }
    setResponseStatus(event, 502)
    return { success: false, code: 'BACKEND_UNAVAILABLE', message: 'No se pudo conectar con el servidor del congreso.' }
  }
}
