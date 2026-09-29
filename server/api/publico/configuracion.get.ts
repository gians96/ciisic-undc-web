// GET /api/publico/configuracion → GET {backend}/api/v1/site/config
// ({ google: { clientId }, urlPanel }): lo que el navegador necesita, sin variables NUXT_PUBLIC_*.
// Caché de 60 s (stale-while-revalidate); las respuestas con error no se guardan.
export default defineCachedEventHandler(
  event => responderSitio(event, { ruta: '/config', timeoutMs: 10000 }),
  {
    name: 'sitio-configuracion',
    maxAge: 60,
    swr: true,
    getKey: () => 'configuracion',
  },
)
