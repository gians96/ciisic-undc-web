// ============================================================================
// PONENCIAS ESPECIALIZADAS PUBLICADAS (GET /api/publico/ponencias-especializadas →
// backend GET /api/v1/site/specialized-talks). Nitro las cachea 15 s: los cupos cambian a menudo.
// ============================================================================
import type { ListaPonenciasRespuesta, PonenciaEspecializadaPublica } from '~/types/ponencias-especializadas'
import { ponenciasPorDia } from '~/utils/inscripcion-ponencias'
import { rutasSitio } from '~/utils/rutas-sitio'

export const usePonenciasEspecializadas = () => {
  const { request } = useApi()

  const { data, status, error, refresh } = useAsyncData(
    'ponencias-especializadas-publicas',
    () => request<ListaPonenciasRespuesta>(rutasSitio.ponenciasEspecializadas, { timeout: 12000 })
      .then(respuesta => ({ ponencias: respuesta.data, accesoLibre: accesoLibreDe(respuesta) })),
    { getCachedData: datosEnCache },
  )

  const ponencias = computed<PonenciaEspecializadaPublica[]>(() => data.value?.ponencias ?? [])

  return {
    ponencias,
    /** Encendido en el panel: se inscribe cualquiera solo con su documento; apagado, solo congresistas con el pago aprobado. */
    accesoLibre: computed(() => data.value?.accesoLibre ?? false),
    dias: computed(() => ponenciasPorDia(ponencias.value)),
    error: computed(() => (error.value ? normalizeApiError(error.value) : null)),
    cargando: computed(() => !data.value && !error.value && status.value !== 'success'),
    recargar: () => refresh(),
  }
}
