// POST /api/publico/delegaciones/:codigo/pagos (multipart: pagos y un archivo por pago en `vouchers`)
// → POST {backend}/api/v1/site/delegations/link/:codigo/payments. El delegado solo agrega.
export default defineEventHandler((event) => {
  const codigo = codigoDelegacion(event)
  if (!codigo) {
    setResponseHeader(event, 'Cache-Control', 'no-store')
    setResponseStatus(event, 404)
    return errorSitio('DELEGATION_NOT_FOUND', 'La delegación no existe o no está activa.')
  }
  return reenviarCuerpoSitio(event, `/delegations/link/${codigo}/payments`, { formato: 'multipart', timeoutMs: 120000, limiteBytes: LIMITE_DELEGACION_BYTES })
})
