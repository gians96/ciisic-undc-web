// POST /api/publico/ponencias-especializadas/inscripciones (JSON { asistente, ponenciaIds })
// → POST {backend}/api/v1/site/specialized-talk-registrations. Todo o nada; sin caché.
export default defineEventHandler(event =>
  reenviarCuerpoSitio(event, '/specialized-talk-registrations', { formato: 'json', timeoutMs: 20000 }),
)
