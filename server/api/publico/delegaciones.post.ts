// POST /api/publico/delegaciones → POST {backend}/api/v1/site/delegations
// Registro completo de una delegación (representante + integrantes + un solo pago con voucher).
// Contrato: backend-ciisic/specs/018-delegaciones/contracts/api-delegaciones.md.
// Multipart como /inscripciones (voucher ≤ 5 MB).
export default defineEventHandler(event =>
  reenviarCuerpoSitio(event, '/delegations', { formato: 'multipart', timeoutMs: 60000 }),
)
