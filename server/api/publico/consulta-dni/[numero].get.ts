// GET /api/publico/consulta-dni/:numero → GET {backend}/api/v1/site/document-lookup/dni/:numero
// Sin caché; con la IP del visitante para su límite de consultas.
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const numero = String(getRouterParam(event, 'numero') ?? '')
  if (!/^\d{8}$/.test(numero)) {
    setResponseStatus(event, 422)
    return errorSitio('INVALID_DNI', 'El DNI debe tener 8 dígitos.')
  }
  return responderSitio(event, { ruta: `/document-lookup/dni/${numero}`, timeoutMs: 15000 })
})
