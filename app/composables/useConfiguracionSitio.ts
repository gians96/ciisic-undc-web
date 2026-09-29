// ============================================================================
// CONFIGURACIÓN DEL SITIO (GET /api/publico/configuracion → backend GET /api/v1/site/config)
// Client ID de Google y URL del panel: se definen en el backend y se leen en runtime.
// ============================================================================
import type { ApiExito, ConfiguracionSitioApi } from '~/types/evento'
import { normalizarConfiguracionSitio } from '~/utils/configuracion-sitio'
import { rutasSitio } from '~/utils/rutas-sitio'

/**
 * Configuración pública del sitio, compartida por clave entre componentes y entre SSR e
 * hidratación (Nitro la cachea 60 s). Si no carga, la landing funciona sin Google ni panel.
 */
export const useConfiguracionSitio = () => {
  const { request } = useApi()

  // Se normaliza en el handler: el payload de SSR ya lleva los valores validados
  const asyncData = useAsyncData(
    'configuracion',
    () => request<ApiExito<ConfiguracionSitioApi>>(rutasSitio.configuracion, { timeout: 12000 })
      .then(respuesta => normalizarConfiguracionSitio(respuesta?.data)),
    { getCachedData: datosEnCache },
  )
  const { data, status, error, refresh } = asyncData

  return {
    clientIdGoogle: computed(() => data.value?.clientIdGoogle ?? null),
    urlPanel: computed(() => data.value?.urlPanel ?? null),
    error,
    cargando: computed(() => !data.value && !error.value && status.value !== 'success'),
    /** Se resuelve cuando terminó la carga, con o sin error (p. ej. `/login` la espera en SSR). */
    listo: Promise.resolve(asyncData).then(() => undefined),
    recargar: () => refresh(),
  }
}
