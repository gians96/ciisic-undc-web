// ============================================================================
// PONENCIAS ESPECIALIZADAS PUBLICADAS (GET /api/publico/ponencias-especializadas →
// backend GET /api/v1/site/specialized-talks). Nitro las cachea 15 s: los cupos cambian a menudo.
// ============================================================================
import type { ApiExito } from '~/types/evento'
import type { PonenciaEspecializadaPublica } from '~/types/ponencias-especializadas'
import { ponenciasPorDia } from '~/utils/inscripcion-ponencias'
import { rutasSitio } from '~/utils/rutas-sitio'

export const usePonenciasEspecializadas = () => {
  const { request } = useApi()

  const { data, status, error, refresh } = useAsyncData(
    'ponencias-especializadas-publicas',
    () => request<ApiExito<PonenciaEspecializadaPublica[]>>(rutasSitio.ponenciasEspecializadas, { timeout: 12000 }).then(respuesta => respuesta.data),
    { getCachedData: datosEnCache },
  )

  const ponencias = computed<PonenciaEspecializadaPublica[]>(() => data.value ?? [])

  return {
    ponencias,
    dias: computed(() => ponenciasPorDia(ponencias.value)),
    error: computed(() => (error.value ? normalizeApiError(error.value) : null)),
    cargando: computed(() => !data.value && !error.value && status.value !== 'success'),
    recargar: () => refresh(),
  }
}
