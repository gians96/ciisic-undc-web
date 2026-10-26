// GET /api/publico/credencial/:codigo → GET {backend}/api/v1/site/credential/:codigo
// Enlace del correo de aprobación (spec 020 del backend): sin caché y con la IP del visitante.
// El código viaja en el enlace tal cual se imprimió ([0-9A-Z] de 10); se normaliza a mayúsculas
// para que un enlace tecleado a mano también sirva.
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')
  const codigo = String(getRouterParam(event, 'codigo') ?? '').trim().toUpperCase()
  if (!/^[0-9A-Z]{10}$/.test(codigo)) {
    setResponseStatus(event, 422)
    return errorSitio('INVALID_CODE', 'El código de la credencial no es válido.')
  }
  return responderSitio(event, { ruta: `/credential/${codigo}`, timeoutMs: 15000 })
})
