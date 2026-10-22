// POST /api/publico/delegaciones/unirse/:codigo/participante (JSON, una persona)
// → POST {backend}/api/v1/site/delegations/join/:codigo/participants. Cada integrante se inscribe solo, sin Google.
export default defineEventHandler((event) => {
  const codigo = codigoDelegacion(event)
  if (!codigo) {
    setResponseHeader(event, 'Cache-Control', 'no-store')
    setResponseStatus(event, 404)
    return errorSitio('DELEGATION_NOT_FOUND', 'El link no existe o ya no está activo.')
  }
  return reenviarCuerpoSitio(event, `/delegations/join/${codigo}/participants`, { formato: 'json', timeoutMs: 30000, limiteBytes: 64 * 1024 })
})
