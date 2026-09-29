// GET /api/publico/planes?categoria=ESTUDIANTES|PUBLICO_GENERAL
// → GET {backend}/api/v1/public/events/:codigo/registration-types con caché de 60 s por categoría.
import type { H3Event } from 'h3'

/** Solo las categorías que usa la landing: otras claves no llegan al backend ni a la caché. */
const CATEGORIAS = new Set(['ESTUDIANTES', 'PUBLICO_GENERAL'])

const categoriaDe = (event: H3Event) => String(getQuery(event).categoria ?? '').trim().toUpperCase()

export default defineCachedEventHandler(
  (event) => {
    const categoria = categoriaDe(event)
    if (categoria && !CATEGORIAS.has(categoria)) {
      setResponseStatus(event, 400)
      return { success: false, code: 'INVALID_CATEGORY', message: 'Categoría de inscripción no válida.' }
    }
    const ruta = `/api/v1/public/events/${encodeURIComponent(codigoEventoConfigurado(event))}/registration-types`
    return leerApiPublica(event, ruta, categoria ? { categoria } : undefined)
  },
  {
    name: 'publico-planes',
    maxAge: 60,
    swr: true,
    getKey: event => `planes-${codigoEventoConfigurado(event)}-${categoriaDe(event) || 'todas'}`,
  },
)
