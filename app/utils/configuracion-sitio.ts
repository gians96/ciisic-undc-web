// ============================================================================
// CONFIGURACIÓN PÚBLICA DEL SITIO (BFF GET /api/publico/configuracion → backend GET /api/v1/site/config)
// El client ID de Google y la URL del panel vienen de la API, no de variables NUXT_PUBLIC_*.
// Un valor mal configurado equivale a «no configurado». Funciones puras.
// ============================================================================
import type { ConfiguracionSitioApi } from '../types/evento'

export interface ConfiguracionPublica {
  /** Client ID web de Google Identity Services o `null` (sin botón de Google). */
  clientIdGoogle: string | null
  /** URL base del panel, sin `/` final, o `null` (sin panel). */
  urlPanel: string | null
}

/** Formato de los client ID web de Google: `<número>-<id>.apps.googleusercontent.com`. */
const CLIENT_ID_GOOGLE = /^[\w.-]+\.apps\.googleusercontent\.com$/

/** Client ID de Google válido o `null`. */
export function clientIdGoogleValido(valor: unknown): string | null {
  const texto = typeof valor === 'string' ? valor.trim() : ''
  return texto.length <= 255 && CLIENT_ID_GOOGLE.test(texto) ? texto : null
}

/**
 * URL del panel apta para redirigir: absoluta, http(s) y sin credenciales. Se descartan la consulta,
 * el fragmento y la `/` final (`https://panel.undc.edu.pe/` → `https://panel.undc.edu.pe`).
 */
export function urlPanelValida(valor: unknown): string | null {
  const texto = typeof valor === 'string' ? valor.trim() : ''
  if (!texto) return null
  try {
    const url = new URL(texto)
    if ((url.protocol !== 'https:' && url.protocol !== 'http:') || url.username || url.password) return null
    return `${url.origin}${url.pathname}`.replace(/\/+$/, '')
  } catch {
    return null
  }
}

/** Respuesta de `/config` → valores que usa la landing. */
export function normalizarConfiguracionSitio(datos: Partial<ConfiguracionSitioApi> | null | undefined): ConfiguracionPublica {
  return {
    clientIdGoogle: clientIdGoogleValido(datos?.google?.clientId),
    urlPanel: urlPanelValida(datos?.urlPanel),
  }
}

/** Página del panel donde el participante ve el estado de sus inscripciones (`null` sin panel). */
export function urlMisInscripciones(urlPanel: string | null | undefined): string | null {
  const base = urlPanelValida(urlPanel)
  return base ? `${base}/mis-inscripciones` : null
}
