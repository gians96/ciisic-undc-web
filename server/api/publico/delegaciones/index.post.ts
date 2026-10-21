// POST /api/publico/delegaciones (multipart: delegacion, representante, participantes, modalidad,
// pagos y un archivo por pago en `vouchers`) → POST {backend}/api/v1/site/delegations.
// Hasta 6 vouchers de 5 MB: el límite del cuerpo es el de todos juntos. Sin caché.
export default defineEventHandler(event =>
  reenviarCuerpoSitio(event, '/delegations', { formato: 'multipart', timeoutMs: 120000, limiteBytes: LIMITE_DELEGACION_BYTES }),
)
