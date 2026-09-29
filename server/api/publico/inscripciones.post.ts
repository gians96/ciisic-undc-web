// POST /api/publico/inscripciones (multipart: participante JSON + campos + voucher)
// → POST {backend}/api/v1/site/inscriptions. El cuerpo se reenvía tal cual (límite 5 MB + margen).
export default defineEventHandler(event =>
  reenviarCuerpoSitio(event, '/inscriptions', { formato: 'multipart', timeoutMs: 60000 }),
)
