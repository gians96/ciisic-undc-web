// GET /api/publico/delegaciones/unirse/:codigo → GET {backend}/api/v1/site/delegations/join/:codigo
// Lo que ve quien abre el link individual: el grupo, el dominio del correo y los planes activos. Sin caché.
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const codigo = codigoDelegacion(event)
  if (!codigo) {
    setResponseStatus(event, 404)
    return errorSitio('DELEGATION_NOT_FOUND', 'El link no existe o ya no está activo.')
  }
  return responderSitio(event, { ruta: `/delegations/join/${codigo}`, timeoutMs: 15000 })
})
