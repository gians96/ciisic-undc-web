// GET /api/publico/delegaciones/link/:codigoLink → GET {backend}/api/v1/site/delegations/link/:codigoLink
// Datos de una delegación por su link: el formulario se abre con ella ya cargada.
// El backend exige el token del evento: un link de otro evento responde 404.
import type { H3Event } from 'h3'

const codigoDe = (event: H3Event) => String(getRouterParam(event, 'codigoLink') ?? '').trim()

export default defineCachedEventHandler(
  (event) => responderSitio(event, { ruta: `/delegations/link/${encodeURIComponent(codigoDe(event))}`, timeoutMs: 10000 }),
  {
    name: 'sitio-delegacion-link',
    maxAge: 60,
    swr: true,
    getKey: event => `delegacion-link-${codigoDe(event)}`,
  },
)
