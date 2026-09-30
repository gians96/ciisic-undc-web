// ============================================================================
// NÚCLEO DEL BFF: API DEL SITIO DE backend-ciisic (/api/v1/site) CON EL TOKEN DEL EVENTO
// Sin globals de Nitro para poder probarlo con `fetch` simulado (tests/bff.test.ts).
// Contrato de las rutas: specs/001-landing-multi-evento/contracts/bff-landing.md
// ============================================================================
import { Buffer } from 'node:buffer'
import { isIP } from 'node:net'

export const PREFIJO_API_SITIO = '/api/v1/site'

/** JSON (verificación, contacto): holgado para los campos del contrato. */
export const LIMITE_JSON_BYTES = 100 * 1024
/** Multipart: 5 MB del voucher o del PDF + margen para los demás campos y los separadores. */
export const LIMITE_MULTIPART_BYTES = 5 * 1024 * 1024 + 512 * 1024
/** Verificación con Google: `{ "credential": "…" }` con una credencial de hasta 4096 caracteres. */
export const LIMITE_VERIFICACION_GOOGLE_BYTES = 8 * 1024
/** Longitud máxima del ID token de Google que acepta el backend. */
export const LONGITUD_MAXIMA_CREDENCIAL_GOOGLE = 4096

export interface ErrorSitio {
  success: false
  code: string
  message: string
}

export const errorSitio = (code: string, message: string): ErrorSitio => ({ success: false, code, message })

export const SITIO_NO_CONFIGURADO = errorSitio('SITE_NOT_CONFIGURED', 'El sitio no está configurado para conectarse con el servidor del congreso.')
export const BACKEND_NO_DISPONIBLE = errorSitio('BACKEND_UNAVAILABLE', 'No se pudo conectar con el servidor del congreso.')
export const CREDENCIAL_GOOGLE_INVALIDA = errorSitio('INVALID_GOOGLE_CREDENTIAL', 'La credencial de Google no es válida.')

export interface ContextoSitio {
  /** `NUXT_BACKEND_BASE_URL` (sin `/api/v1/site`). */
  baseUrl: string
  /** `NUXT_BACKEND_EVENT_TOKEN`: nunca sale del servidor. */
  token: string
  /** IP del visitante ya validada (o `null` si no hay una válida). */
  ipCliente: string | null
}

export interface PeticionSitio {
  metodo?: 'GET' | 'POST'
  /** Ruta relativa a `/api/v1/site`, p. ej. `/event`. */
  ruta: string
  query?: Record<string, string>
  cuerpo?: Uint8Array
  tipoContenido?: string
  timeoutMs?: number
}

export interface RespuestaSitio {
  status: number
  cuerpo: unknown
}

export interface OpcionesFetchSitio {
  method: 'GET' | 'POST'
  headers: Record<string, string>
  query?: Record<string, string>
  body?: Uint8Array
  timeout: number
  retry: 0
  ignoreResponseError: true
}

/** Firma mínima de `$fetch.raw` (ofetch) que usa el BFF; en pruebas se reemplaza por un doble. */
export type FetchSitio = (url: string, opciones: OpcionesFetchSitio) => Promise<{ status: number, _data?: unknown }>

function normalizarIp(valor: string | null | undefined): string | null {
  let ip = String(valor ?? '').trim()
  if (!ip) return null
  // IPv4 mapeada en IPv6 (socket de Node en modo dual)
  if (/^::ffff:/i.test(ip) && isIP(ip.slice(7)) === 4) ip = ip.slice(7)
  return isIP(ip) ? ip : null
}

/**
 * IP del visitante: la **última** de `X-Forwarded-For` (Traefik la agrega al final, las anteriores
 * las puede enviar el cliente) o, si no hay una válida, la del socket.
 */
export function ipDelVisitante(xForwardedFor: string | string[] | null | undefined, ipSocket: string | null | undefined): string | null {
  const encabezado = Array.isArray(xForwardedFor) ? xForwardedFor.join(',') : String(xForwardedFor ?? '')
  const ultima = encabezado.split(',').map(parte => parte.trim()).filter(Boolean).at(-1)
  return normalizarIp(ultima) ?? normalizarIp(ipSocket)
}

/** Variables de entorno que faltan para hablar con el backend (solo nombres, nunca valores). */
export function configuracionFaltante(contexto: Pick<ContextoSitio, 'baseUrl' | 'token'>): string[] {
  const faltantes: string[] = []
  if (!contexto.baseUrl.trim()) faltantes.push('NUXT_BACKEND_BASE_URL')
  if (!contexto.token.trim()) faltantes.push('NUXT_BACKEND_EVENT_TOKEN')
  return faltantes
}

const esObjeto = (valor: unknown): valor is Record<string, unknown> => typeof valor === 'object' && valor !== null

/**
 * Llama a la API del sitio con el token del evento y devuelve el estado y el cuerpo del backend
 * sin cambios. Los errores propios (sin configuración, sin respuesta) usan la misma forma
 * `{ success: false, code, message }` y nunca incluyen el token ni la URL interna.
 */
export async function llamarApiSitio(contexto: ContextoSitio, peticion: PeticionSitio, fetchSitio: FetchSitio): Promise<RespuestaSitio> {
  if (configuracionFaltante(contexto).length) return { status: 503, cuerpo: SITIO_NO_CONFIGURADO }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'X-Api-Key': contexto.token.trim(),
  }
  if (contexto.ipCliente) headers['X-Client-Ip'] = contexto.ipCliente
  if (peticion.tipoContenido) headers['Content-Type'] = peticion.tipoContenido

  let respuesta: Awaited<ReturnType<FetchSitio>>
  try {
    respuesta = await fetchSitio(`${contexto.baseUrl.trim().replace(/\/+$/, '')}${PREFIJO_API_SITIO}${peticion.ruta}`, {
      method: peticion.metodo ?? 'GET',
      headers,
      query: peticion.query,
      body: peticion.cuerpo,
      timeout: peticion.timeoutMs ?? 15000,
      retry: 0,
      ignoreResponseError: true,
    })
  } catch {
    // Red caída, DNS, timeout: el detalle (con la URL interna) no se expone
    return { status: 502, cuerpo: BACKEND_NO_DISPONIBLE }
  }

  if (respuesta.status >= 400 && !esObjeto(respuesta._data)) {
    // Error sin cuerpo del contrato (p. ej. HTML de un proxy): se conserva el estado
    return {
      status: respuesta.status,
      cuerpo: respuesta.status >= 500 ? BACKEND_NO_DISPONIBLE : errorSitio('REQUEST_ERROR', 'No se pudo completar la solicitud.'),
    }
  }
  return { status: respuesta.status, cuerpo: respuesta._data ?? null }
}

/** Nombre de un QR subido en el panel (lo genera backend-ciisic): `qr-<uuid>.<png|jpg|webp>`. */
export const ARCHIVO_QR = /^qr-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp)$/
export const QR_NO_EXISTE = errorSitio('QR_NOT_FOUND', 'La imagen del QR no existe.')
const TIPOS_IMAGEN = new Set(['image/png', 'image/jpeg', 'image/webp'])

export interface OpcionesFetchImagen {
  headers: Record<string, string>
  responseType: 'arrayBuffer'
  timeout: number
  retry: 0
  ignoreResponseError: true
}

/** Firma mínima de `$fetch.raw` para binarios; en pruebas se reemplaza por un doble. */
export type FetchImagenSitio = (url: string, opciones: OpcionesFetchImagen) => Promise<{
  status: number
  headers: { get: (nombre: string) => string | null }
  _data?: ArrayBuffer
}>

export type ImagenSitio =
  | { status: 200, tipo: string, bytes: Uint8Array }
  | { status: number, cuerpo: ErrorSitio }

/**
 * Imagen del QR de una billetera (`GET /api/v1/site/payment-qr/:archivo`). Solo pide nombres con
 * el formato del backend y solo devuelve respuestas que de verdad son PNG, JPG o WebP.
 */
export async function obtenerQrSitio(contexto: ContextoSitio, archivo: string, fetchImagen: FetchImagenSitio): Promise<ImagenSitio> {
  if (!ARCHIVO_QR.test(archivo)) return { status: 404, cuerpo: QR_NO_EXISTE }
  if (configuracionFaltante(contexto).length) return { status: 503, cuerpo: SITIO_NO_CONFIGURADO }

  const headers: Record<string, string> = { 'Accept': 'image/png, image/jpeg, image/webp', 'X-Api-Key': contexto.token.trim() }
  if (contexto.ipCliente) headers['X-Client-Ip'] = contexto.ipCliente

  let respuesta: Awaited<ReturnType<FetchImagenSitio>>
  try {
    respuesta = await fetchImagen(`${contexto.baseUrl.trim().replace(/\/+$/, '')}${PREFIJO_API_SITIO}/payment-qr/${archivo}`, {
      headers,
      responseType: 'arrayBuffer',
      timeout: 10000,
      retry: 0,
      ignoreResponseError: true,
    })
  } catch {
    return { status: 502, cuerpo: BACKEND_NO_DISPONIBLE }
  }

  if (respuesta.status === 404) return { status: 404, cuerpo: QR_NO_EXISTE }
  const tipo = (respuesta.headers.get('content-type') ?? '').split(';')[0]!.trim().toLowerCase()
  if (respuesta.status === 200 && TIPOS_IMAGEN.has(tipo) && respuesta._data) {
    return { status: 200, tipo, bytes: new Uint8Array(respuesta._data) }
  }
  if (respuesta.status >= 400 && respuesta.status < 500) return { status: respuesta.status, cuerpo: errorSitio('REQUEST_ERROR', 'No se pudo obtener la imagen.') }
  return { status: 502, cuerpo: BACKEND_NO_DISPONIBLE }
}

/**
 * Resultado de adaptar el cuerpo de una acción antes de reenviarlo: el cuerpo nuevo (con su tipo) o
 * el error que se responde sin llamar al backend.
 */
export type CuerpoAdaptado =
  | { ok: true, cuerpo: Uint8Array, tipoContenido: string }
  | { ok: false, status: number, error: ErrorSitio }

const SEGMENTO_JWT = /^[\w-]+$/

/**
 * `true` si el valor tiene la forma de un ID token de Google (JWT): texto de hasta 4096 caracteres
 * con tres segmentos base64url no vacíos. Es la misma regla que aplica el backend; la firma y el
 * contenido los valida él.
 */
export function esCredencialGoogle(valor: unknown): valor is string {
  if (typeof valor !== 'string' || !valor || valor.length > LONGITUD_MAXIMA_CREDENCIAL_GOOGLE) return false
  const segmentos = valor.split('.')
  return segmentos.length === 3 && segmentos.every(segmento => SEGMENTO_JWT.test(segmento))
}

/**
 * `{ credential }` que envía el navegador (respuesta de Google Identity Services) → `{ idToken }`
 * que espera `POST /google-verification`. Solo se reenvía ese campo; sin una credencial con forma
 * de JWT se responde `422 INVALID_GOOGLE_CREDENTIAL` sin consultar al backend.
 */
export function adaptarVerificacionGoogle(cuerpo: Uint8Array): CuerpoAdaptado {
  let datos: unknown
  try {
    datos = JSON.parse(new TextDecoder().decode(cuerpo))
  } catch {
    return { ok: false, status: 422, error: CREDENCIAL_GOOGLE_INVALIDA }
  }
  const credencial = esObjeto(datos) ? datos.credential : undefined
  if (!esCredencialGoogle(credencial)) return { ok: false, status: 422, error: CREDENCIAL_GOOGLE_INVALIDA }
  return {
    ok: true,
    cuerpo: new TextEncoder().encode(JSON.stringify({ idToken: credencial })),
    tipoContenido: 'application/json',
  }
}

export class CuerpoDemasiadoGrande extends Error {
  constructor() {
    super('El cuerpo de la solicitud supera el límite permitido')
    this.name = 'CuerpoDemasiadoGrande'
  }
}

/** `true` si el `Content-Length` declarado ya supera el límite (se responde 413 sin leer). */
export function excedeLongitudDeclarada(contentLength: string | null | undefined, limiteBytes: number): boolean {
  const declarada = Number(contentLength)
  return Number.isFinite(declarada) && declarada > limiteBytes
}

/** Lee el cuerpo como bytes y corta en cuanto supera el límite (no carga cuerpos gigantes). */
export async function leerCuerpoLimitado(flujo: AsyncIterable<Uint8Array | string>, limiteBytes: number): Promise<Buffer> {
  const partes: Buffer[] = []
  let total = 0
  for await (const parte of flujo) {
    const bytes = typeof parte === 'string' ? Buffer.from(parte) : Buffer.from(parte.buffer, parte.byteOffset, parte.byteLength)
    total += bytes.length
    if (total > limiteBytes) throw new CuerpoDemasiadoGrande()
    partes.push(bytes)
  }
  return Buffer.concat(partes, total)
}
