// GET /api/publico/delegaciones/tarifa → GET {backend}/api/v1/site/delegations/tarifa
// Tarifa por persona de las delegaciones del evento (estándar, promocional y mínimo).
// Con caché de 60 s: cambia solo desde el panel.
export default defineCachedEventHandler(
  event => responderSitio(event, { ruta: '/delegations/tarifa', timeoutMs: 10000 }),
  {
    name: 'sitio-delegaciones-tarifa',
    maxAge: 60,
    swr: true,
    getKey: () => 'delegaciones-tarifa',
  },
)
