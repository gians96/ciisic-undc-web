// ============================================================================
// EVENTO PÚBLICO (GET /api/publico/evento → backend GET /api/v1/public/events/:codigo)
// ============================================================================
import type { NuxtApp } from '#app'
import type { ApiExito, EventoPublico } from '~/types/evento'
import { rutasCachePublica } from '~/utils/api-publica'

/**
 * Reutiliza los datos ya cargados (payload de SSR o navegación anterior) salvo en un refresco
 * manual, para que "Reintentar" siempre vuelva a pedirlos.
 */
export function datosEnCache(key: string, nuxtApp: NuxtApp, contexto: { cause: string }) {
  if (contexto.cause === 'refresh:manual' || contexto.cause === 'refresh:hook') return undefined
  return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
}

/** Código del evento que muestra esta landing (`NUXT_PUBLIC_EVENTO_CODIGO`). */
export const useEventoCodigo = () => String(useRuntimeConfig().public.eventoCodigo || '').trim()

/**
 * Datos públicos del evento, compartidos por clave (`evento:<codigo>`) entre componentes y entre
 * SSR e hidratación. Se leen de la ruta Nitro con caché de 60 s (no del backend en cada visita).
 */
export const useEvento = () => {
  const codigo = useEventoCodigo()

  const { data, status, error, refresh } = useAsyncData(
    `evento:${codigo}`,
    () => $fetch<ApiExito<EventoPublico>>(rutasCachePublica.evento, { timeout: 12000 }).then(respuesta => respuesta.data),
    { getCachedData: datosEnCache },
  )

  const evento = computed<EventoPublico | null>(() => data.value ?? null)

  return {
    codigo,
    evento,
    error,
    cargando: computed(() => !evento.value && !error.value && status.value !== 'success'),
    inscripcionesAbiertas: computed(() => evento.value?.inscripciones?.abiertas === true),
    contacto: computed(() => evento.value?.contacto ?? null),
    datosPago: computed(() => evento.value?.datosPago ?? null),
    recargar: () => refresh(),
  }
}
