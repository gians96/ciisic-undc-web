// ============================================================================
// EVENTO PÚBLICO (GET /api/publico/evento → backend GET /api/v1/site/event)
// ============================================================================
import type { NuxtApp } from '#app'
import type { ApiExito, EventoPublico } from '~/types/evento'
import { rutasSitio } from '~/utils/rutas-sitio'

/**
 * Reutiliza los datos ya cargados (payload de SSR o navegación anterior) salvo en un refresco
 * manual, para que "Reintentar" siempre vuelva a pedirlos.
 */
export function datosEnCache(key: string, nuxtApp: NuxtApp, contexto: { cause: string }) {
  if (contexto.cause === 'refresh:manual' || contexto.cause === 'refresh:hook') return undefined
  return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
}

/**
 * Datos públicos del evento (el que define el token configurado en el servidor), compartidos por
 * clave entre componentes y entre SSR e hidratación. Nitro los cachea 60 s.
 */
export const useEvento = () => {
  const { request } = useApi()

  const { data, status, error, refresh } = useAsyncData(
    'evento',
    () => request<ApiExito<EventoPublico>>(rutasSitio.evento, { timeout: 12000 }).then(respuesta => respuesta.data),
    { getCachedData: datosEnCache },
  )

  const evento = computed<EventoPublico | null>(() => data.value ?? null)

  return {
    evento,
    error,
    cargando: computed(() => !evento.value && !error.value && status.value !== 'success'),
    inscripcionesAbiertas: computed(() => evento.value?.inscripciones?.abiertas === true),
    contacto: computed(() => evento.value?.contacto ?? null),
    datosPago: computed(() => evento.value?.datosPago ?? null),
    recargar: () => refresh(),
  }
}
