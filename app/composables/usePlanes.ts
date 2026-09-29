// ============================================================================
// TIPOS DE INSCRIPCIÓN (GET /api/publico/planes?categoria= → backend GET /registration-types)
// ============================================================================
import type { ApiExito, CategoriaInscripcionApi, CodigoCategoria } from '~/types/evento'
import { mapearPlanes, type PlanInscripcion } from '~/utils/planes'
import { rutasSitio } from '~/utils/rutas-sitio'

/** Planes de una categoría con la forma de tarjeta de los formularios; compartidos por clave. */
export const usePlanes = (categoria: CodigoCategoria) => {
  const { request } = useApi()

  const { data, status, error, refresh } = useAsyncData(
    `planes:${categoria}`,
    () => request<ApiExito<CategoriaInscripcionApi[]>>(rutasSitio.planes, { query: { categoria }, timeout: 12000 })
      .then(respuesta => mapearPlanes(respuesta.data)),
    { getCachedData: datosEnCache },
  )

  return {
    planes: computed<PlanInscripcion[]>(() => data.value ?? []),
    error,
    cargando: computed(() => data.value === undefined && !error.value && status.value !== 'success'),
    recargar: () => refresh(),
  }
}
