// POST /api/publico/verificacion-google (JSON { credential }, respuesta de Google Identity Services)
// → POST {backend}/api/v1/site/google-verification con { idToken }. Sin caché; con la IP del
// visitante para su límite de intentos. Una credencial sin forma de JWT → 422 sin llamar al backend.
export default defineEventHandler(event =>
  reenviarCuerpoSitio(event, '/google-verification', {
    formato: 'json',
    timeoutMs: 15000,
    limiteBytes: LIMITE_VERIFICACION_GOOGLE_BYTES,
    adaptar: adaptarVerificacionGoogle,
  }),
)
