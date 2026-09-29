// GET /api/publico/evento → GET {backend}/api/v1/public/events/:codigo con caché de 60 s.
// Evita que el SSR de cada visita consuma el límite de lectura por IP del backend.
export default defineCachedEventHandler(
  event => leerApiPublica(event, `/api/v1/public/events/${encodeURIComponent(codigoEventoConfigurado(event))}`),
  {
    name: 'publico-evento',
    maxAge: 60,
    swr: true,
    getKey: event => `evento-${codigoEventoConfigurado(event)}`,
  },
)
