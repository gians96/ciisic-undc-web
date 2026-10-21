// GET /api/publico/delegaciones/:codigo → GET {backend}/api/v1/site/delegations/link/:codigo
// La delegación de un link (integrantes y vouchers enmascarados, saldo). Sin caché.
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const codigo = codigoDelegacion(event)
  if (!codigo) {
    setResponseStatus(event, 404)
    return errorSitio('DELEGATION_NOT_FOUND', 'La delegación no existe o no está activa.')
  }
  return responderSitio(event, { ruta: `/delegations/link/${codigo}`, timeoutMs: 15000 })
})
