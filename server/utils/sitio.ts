// ============================================================================
// CAPA h3 DEL BFF: configuración privada, IP del visitante, cuerpo y estado HTTP.
// La lógica (encabezados, errores, límites) está en ./api-sitio.ts y tiene pruebas.
// ============================================================================
import type { Buffer } from 'node:buffer'
import type { H3Event } from 'h3'
import {
  CuerpoDemasiadoGrande,
  LIMITE_JSON_BYTES,
  LIMITE_MULTIPART_BYTES,
  configuracionFaltante,
  errorSitio,
  excedeLongitudDeclarada,
  ipDelVisitante,
  leerCuerpoLimitado,
  llamarApiSitio,
  type ContextoSitio,
  type CuerpoAdaptado,
  type FetchSitio,
  type PeticionSitio,
} from './api-sitio'

const AVISO_CADA_MS = 60_000
let ultimoAviso = 0

/** Registra (como máximo una vez por minuto) qué variables faltan; nunca sus valores. */
function avisarConfiguracionFaltante(faltantes: string[]) {
  const ahora = Date.now()
  if (ahora - ultimoAviso < AVISO_CADA_MS) return
  ultimoAviso = ahora
  console.error(`[bff] Falta configurar ${faltantes.join(' y ')}: la landing no puede consultar backend-ciisic y responde 503 SITE_NOT_CONFIGURED.`)
}

function contextoSitio(event: H3Event): ContextoSitio {
  const config = useRuntimeConfig(event)
  return {
    baseUrl: String(config.backendBaseUrl ?? ''),
    token: String(config.backendEventToken ?? ''),
    ipCliente: ipDelVisitante(getRequestHeader(event, 'x-forwarded-for'), event.node.req.socket?.remoteAddress),
  }
}

const fetchSitio: FetchSitio = async (url, opciones) => {
  const respuesta = await $fetch.raw(url, opciones)
  return { status: respuesta.status, _data: respuesta._data }
}

/** Llama a la API del sitio con el token del evento y responde con su estado y cuerpo. */
export async function responderSitio(event: H3Event, peticion: PeticionSitio): Promise<unknown> {
  const contexto = contextoSitio(event)
  const faltantes = configuracionFaltante(contexto)
  if (faltantes.length) avisarConfiguracionFaltante(faltantes)

  const { status, cuerpo } = await llamarApiSitio(contexto, peticion, fetchSitio)
  setResponseStatus(event, status)
  return cuerpo
}

export interface OpcionesReenvio {
  formato: 'json' | 'multipart'
  timeoutMs: number
  /** Límite propio del cuerpo (por defecto, el del formato). */
  limiteBytes?: number
  /** Cambia el cuerpo antes de reenviarlo (p. ej. `credential` → `idToken`) o lo rechaza. */
  adaptar?: (cuerpo: Uint8Array) => CuerpoAdaptado
}

/**
 * Reenvía el cuerpo de una acción del visitante tal cual (mismo `Content-Type`, incluido el
 * `boundary` del multipart) o adaptado, sin caché y con límite de tamaño.
 */
export async function reenviarCuerpoSitio(event: H3Event, ruta: string, opciones: OpcionesReenvio): Promise<unknown> {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const multipart = opciones.formato === 'multipart'
  const tipoContenido = getRequestHeader(event, 'content-type') ?? ''
  const tipoAceptado = multipart ? /^multipart\/form-data;\s*boundary=/i : /^application\/json\b/i
  if (!tipoAceptado.test(tipoContenido)) {
    setResponseStatus(event, 415)
    return errorSitio('UNSUPPORTED_MEDIA_TYPE', multipart ? 'Envía el formulario como multipart/form-data.' : 'Envía los datos como JSON.')
  }

  const limite = opciones.limiteBytes ?? (multipart ? LIMITE_MULTIPART_BYTES : LIMITE_JSON_BYTES)
  const demasiadoGrande = multipart
    ? errorSitio('UPLOAD_LIMIT_EXCEEDED', 'El archivo supera el límite permitido (5 MB).')
    : errorSitio('PAYLOAD_TOO_LARGE', 'Los datos enviados superan el tamaño permitido.')
  if (excedeLongitudDeclarada(getRequestHeader(event, 'content-length'), limite)) {
    setResponseStatus(event, 413)
    return demasiadoGrande
  }

  let cuerpo: Buffer
  try {
    cuerpo = await leerCuerpoLimitado(event.node.req, limite)
  } catch (error) {
    if (error instanceof CuerpoDemasiadoGrande) {
      setResponseStatus(event, 413)
      return demasiadoGrande
    }
    throw error
  }

  const peticion: PeticionSitio = { metodo: 'POST', ruta, cuerpo, tipoContenido, timeoutMs: opciones.timeoutMs }
  if (opciones.adaptar) {
    const adaptado = opciones.adaptar(cuerpo)
    if (!adaptado.ok) {
      setResponseStatus(event, adaptado.status)
      return adaptado.error
    }
    peticion.cuerpo = adaptado.cuerpo
    peticion.tipoContenido = adaptado.tipoContenido
  }

  return responderSitio(event, peticion)
}
