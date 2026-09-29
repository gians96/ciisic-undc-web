// POST /api/publico/contacto (JSON { nombres, apellidos, correo, asunto, mensaje })
// → POST {backend}/api/v1/site/contact
export default defineEventHandler(event =>
  reenviarCuerpoSitio(event, '/contact', { formato: 'json', timeoutMs: 15000 }),
)
