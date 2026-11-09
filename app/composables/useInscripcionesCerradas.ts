// composables/useInscripcionesCerradas.ts
// ============================================================================
// INSCRIPCIONES DEL VII CIISIC: CERRADAS
// Esta rama (ciisic-7) es histórica: el congreso ya terminó y esta landing usa los
// endpoints antiguos, que no informan si las inscripciones están abiertas. Por eso el
// cierre es fijo (runtimeConfig.public.inscripcionesCerradas = true en nuxt.config.ts).
// Solo se levanta con NUXT_PUBLIC_INSCRIPCIONES_CERRADAS=false en el servidor.
// ============================================================================

export const useInscripcionesCerradas = () => {
    const config = useRuntimeConfig()
    return computed(() => config.public.inscripcionesCerradas !== false)
}
