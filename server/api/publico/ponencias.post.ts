// POST /api/publico/ponencias (multipart: data JSON + file PDF) → POST {backend}/api/v1/site/papers
export default defineEventHandler(event =>
  reenviarCuerpoSitio(event, '/papers', { formato: 'multipart', timeoutMs: 60000 }),
)
