// GET /api/publico/ponencias-especializadas → GET {backend}/api/v1/site/specialized-talks
// Ponencias publicadas con sus cupos. Caché corta (15 s): los cupos cambian con cada inscripción.
export default defineCachedEventHandler(
  event => responderSitio(event, { ruta: '/specialized-talks', timeoutMs: 10000 }),
  {
    name: 'sitio-ponencias-especializadas',
    maxAge: 15,
    swr: true,
    getKey: () => 'ponencias-especializadas',
  },
)
