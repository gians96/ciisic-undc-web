// POST /api/publico/verificacion-estudiante (JSON) → POST {backend}/api/v1/site/student-verification
export default defineEventHandler(event =>
  reenviarCuerpoSitio(event, '/student-verification', { formato: 'json', timeoutMs: 20000 }),
)
