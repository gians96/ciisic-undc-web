// GET /api/publico/delegaciones/tarifa → GET {backend}/api/v1/site/delegations/tarifa
// Tarifa por modalidad (presencial: estándar y promocional; virtual: tarifa única o null). Caché corta.
export default defineCachedEventHandler(
  event => responderSitio(event, { ruta: '/delegations/tarifa', timeoutMs: 10000 }),
  { name: 'sitio-delegaciones-tarifa', maxAge: 60, swr: true, getKey: () => 'delegaciones-tarifa' },
)
