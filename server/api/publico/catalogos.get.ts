// GET /api/publico/catalogos → GET {backend}/api/v1/site/catalogs
// ({ clasificaciones, tiposDocumento }); cambian poco: caché de 10 min.
export default defineCachedEventHandler(
  event => responderSitio(event, { ruta: '/catalogs', timeoutMs: 10000 }),
  {
    name: 'sitio-catalogos',
    maxAge: 600,
    swr: true,
    getKey: () => 'catalogos',
  },
)
