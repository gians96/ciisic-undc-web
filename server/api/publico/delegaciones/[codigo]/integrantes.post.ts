// POST /api/publico/delegaciones/:codigo/integrantes (JSON { participantes })
// → POST {backend}/api/v1/site/delegations/link/:codigo/participants. El delegado solo agrega.
export default defineEventHandler((event) => {
  const codigo = codigoDelegacion(event)
  if (!codigo) {
    setResponseHeader(event, 'Cache-Control', 'no-store')
    setResponseStatus(event, 404)
    return errorSitio('DELEGATION_NOT_FOUND', 'La delegación no existe o no está activa.')
  }
  return reenviarCuerpoSitio(event, `/delegations/link/${codigo}/participants`, { formato: 'json', timeoutMs: 30000, limiteBytes: 512 * 1024 })
})
