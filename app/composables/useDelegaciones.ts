// ============================================================================
// DELEGACIONES (BFF): tarifa del evento y delegación por su link.
// GET /api/publico/delegaciones/tarifa → backend GET /api/v1/site/delegations/tarifa
// GET /api/publico/delegaciones/link/:codigo → backend GET /api/v1/site/delegations/link/:codigo
// ============================================================================
import type { ApiExito } from '~/types/evento'
import type { DelegacionPorLink, TarifaDelegaciones } from '~/types/delegaciones'
import { rutasSitio } from '~/utils/rutas-sitio'

/** Tarifa por persona de las delegaciones del evento (la aplica el backend). */
export const useTarifaDelegaciones = () => {
  const { request } = useApi()

  const { data, status, error, refresh } = useAsyncData(
    'delegaciones:tarifa',
    () => request<ApiExito<TarifaDelegaciones>>(rutasSitio.tarifaDelegaciones, { timeout: 12000 })
      .then(respuesta => respuesta.data),
    { getCachedData: datosEnCache },
  )

  const tarifa = computed<TarifaDelegaciones | null>(() => data.value ?? null)

  return {
    tarifa,
    error,
    cargando: computed(() => !tarifa.value && !error.value && status.value !== 'success'),
    recargar: () => refresh(),
  }
}

/**
 * Una delegación por su link: el formulario se abre con ella ya cargada (nombre, institución y
 * tarifa). Si el link no existe o es de otro evento, el backend responde 404.
 */
export const useDelegacionPorLink = (codigoLink: MaybeRefOrGetter<string | undefined>) => {
  const { request } = useApi()

  const codigo = computed(() => String(toValue(codigoLink) ?? '').trim())

  const { data, status, error, refresh } = useAsyncData(
    () => `delegacion:${codigo.value}`,
    () => {
      if (!codigo.value) return Promise.resolve(null)
      return request<ApiExito<DelegacionPorLink>>(rutasSitio.delegacionLink(codigo.value), { timeout: 12000 })
        .then(respuesta => respuesta.data)
    },
    { getCachedData: datosEnCache, watch: [codigo] },
  )

  const delegacion = computed<DelegacionPorLink | null>(() => data.value ?? null)

  return {
    delegacion,
    error,
    cargando: computed(() => Boolean(codigo.value) && !delegacion.value && !error.value && status.value !== 'success'),
    recargar: () => refresh(),
  }
}
