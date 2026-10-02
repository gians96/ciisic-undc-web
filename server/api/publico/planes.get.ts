// GET /api/publico/planes?categoria=ESTUDIANTES|PUBLICO_GENERAL|FI_UNDC
// → GET {backend}/api/v1/site/registration-types con caché de 60 s por categoría.
import type { H3Event } from 'h3'

/** Solo las categorías que usa la landing: otras claves no llegan al backend ni a la caché. */
const CATEGORIAS = new Set(['ESTUDIANTES', 'PUBLICO_GENERAL', 'FI_UNDC'])

const categoriaDe = (event: H3Event) => String(getQuery(event).categoria ?? '').trim().toUpperCase()

export default defineCachedEventHandler(
  (event) => {
    const categoria = categoriaDe(event)
    if (categoria && !CATEGORIAS.has(categoria)) {
      setResponseStatus(event, 400)
      return errorSitio('INVALID_CATEGORY', 'Categoría de inscripción no válida.')
    }
    return responderSitio(event, { ruta: '/registration-types', query: categoria ? { categoria } : undefined, timeoutMs: 10000 })
  },
  {
    name: 'sitio-planes',
    maxAge: 60,
    swr: true,
    getKey: event => `planes-${categoriaDe(event) || 'todas'}`,
  },
)
