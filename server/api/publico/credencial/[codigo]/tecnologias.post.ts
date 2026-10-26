// POST /api/publico/credencial/:codigo/tecnologias (JSON { tecnologias }) → POST {backend}/api/v1/site/credential/:codigo/technologies
// Guarda las tecnologías que la persona eligió en su credencial 3D (spec 038 del backend). El código viaja en la ruta tal cual se
// imprimió ([0-9A-Z] de 10) y se normaliza a mayúsculas; sin caché y con un tope de tamaño propio (una lista de a lo sumo 8 ids).
export default defineEventHandler((event) => {
  const codigo = String(getRouterParam(event, 'codigo') ?? '').trim().toUpperCase()
  if (!/^[0-9A-Z]{10}$/.test(codigo)) {
    setResponseHeader(event, 'Cache-Control', 'no-store')
    setResponseStatus(event, 422)
    return errorSitio('INVALID_CODE', 'El código de la credencial no es válido.')
  }
  return reenviarCuerpoSitio(event, `/credential/${codigo}/technologies`, { formato: 'json', timeoutMs: 15000, limiteBytes: 2048 })
})
