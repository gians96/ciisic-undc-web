// POST /api/publico/ponencias-especializadas/elegibilidad (JSON { tipoDocumento, numeroDocumento, correo })
// → POST {backend}/api/v1/site/specialized-talk-eligibility. Dice si el documento y el correo son de un congresista
// con el pago aprobado y cómo asiste (presencial o virtual). El documento y el correo viajan en el cuerpo, nunca en
// la URL; sin caché.
export default defineEventHandler(event =>
  reenviarCuerpoSitio(event, '/specialized-talk-eligibility', { formato: 'json', timeoutMs: 15000 }),
)
