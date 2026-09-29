// GET /api/publico/evento → GET {backend}/api/v1/site/event (el evento lo define el token).
// Caché de 60 s (stale-while-revalidate); las respuestas con error no se guardan.
export default defineCachedEventHandler(
  event => responderSitio(event, { ruta: '/event', timeoutMs: 10000 }),
  {
    name: 'sitio-evento',
    maxAge: 60,
    swr: true,
    getKey: () => 'evento',
  },
)
