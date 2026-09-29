// ============================================================================
// CATÁLOGOS DEL SITIO (GET /api/publico/catalogos → backend GET /catalogs)
// ============================================================================
import type { ApiExito, CatalogosSitio } from '~/types/evento'
import { mapearClasificaciones, type OpcionClasificacion } from '~/utils/catalogos'
import { rutasSitio } from '~/utils/rutas-sitio'

/** Clasificaciones (ciclos) y tipos de documento; Nitro los cachea 10 min. */
export const useCatalogos = () => {
  const { request } = useApi()

  const { data, status, error, refresh } = useAsyncData(
    'catalogos',
    () => request<ApiExito<CatalogosSitio>>(rutasSitio.catalogos, { timeout: 12000 }).then(respuesta => respuesta.data),
    { getCachedData: datosEnCache },
  )

  return {
    clasificaciones: computed<OpcionClasificacion[]>(() => mapearClasificaciones(data.value?.clasificaciones)),
    error,
    cargando: computed(() => !data.value && !error.value && status.value !== 'success'),
    recargar: () => refresh(),
  }
}
