// @vitest-environment node
import { Readable } from 'node:stream'
import { getRequestHeader, setResponseHeader, setResponseStatus, type H3Event } from 'h3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  BACKEND_NO_DISPONIBLE,
  CREDENCIAL_GOOGLE_INVALIDA,
  CuerpoDemasiadoGrande,
  LIMITE_MULTIPART_BYTES,
  LIMITE_VERIFICACION_GOOGLE_BYTES,
  PREFIJO_API_SITIO,
  SITIO_NO_CONFIGURADO,
  adaptarVerificacionGoogle,
  configuracionFaltante,
  esCredencialGoogle,
  excedeLongitudDeclarada,
  ipDelVisitante,
  leerCuerpoLimitado,
  llamarApiSitio,
  type ContextoSitio,
  type FetchSitio,
  type OpcionesFetchSitio,
} from '../server/utils/api-sitio'

const TOKEN = 'evt_tok3n-secreto-de-prueba'
const contexto = (cambios: Partial<ContextoSitio> = {}): ContextoSitio => ({
  baseUrl: 'http://backend.interno:3010/',
  token: TOKEN,
  ipCliente: '181.65.10.20',
  ...cambios,
})

/** Doble de `$fetch.raw`: registra la llamada y responde lo indicado. */
function fetchSimulado(respuesta: { status: number, _data?: unknown }) {
  const llamadas: Array<{ url: string, opciones: OpcionesFetchSitio }> = []
  const fetchSitio: FetchSitio = vi.fn(async (url, opciones) => {
    llamadas.push({ url, opciones })
    return respuesta
  })
  return { fetchSitio, llamadas }
}

describe('ipDelVisitante', () => {
  it('toma la última IP de X-Forwarded-For (la agrega Traefik), no la que manda el cliente', () => {
    expect(ipDelVisitante('1.1.1.1, 10.0.0.5, 181.65.10.20', '172.18.0.3')).toBe('181.65.10.20')
    expect(ipDelVisitante('181.65.10.20', '172.18.0.3')).toBe('181.65.10.20')
    expect(ipDelVisitante(['1.1.1.1', '2800:200:e840::1'], null)).toBe('2800:200:e840::1')
  })

  it('usa la del socket si no hay encabezado o la última no es una IP válida', () => {
    expect(ipDelVisitante(undefined, '172.18.0.3')).toBe('172.18.0.3')
    expect(ipDelVisitante('181.65.10.20, no-es-ip', '172.18.0.3')).toBe('172.18.0.3')
    expect(ipDelVisitante('', '::ffff:127.0.0.1')).toBe('127.0.0.1')
  })

  it('devuelve null si no hay ninguna IP válida', () => {
    expect(ipDelVisitante('abc', 'xyz')).toBeNull()
    expect(ipDelVisitante(null, undefined)).toBeNull()
  })
})

describe('llamarApiSitio', () => {
  it('agrega X-Api-Key y X-Client-Ip y llama a /api/v1/site con el método, cuerpo y tipo originales', async () => {
    const { fetchSitio, llamadas } = fetchSimulado({ status: 201, _data: { success: true, data: { id: 7 } } })
    const cuerpo = new TextEncoder().encode('--limite\r\ncontenido\r\n--limite--')
    const respuesta = await llamarApiSitio(contexto(), {
      metodo: 'POST',
      ruta: '/inscriptions',
      cuerpo,
      tipoContenido: 'multipart/form-data; boundary=limite',
      timeoutMs: 60000,
    }, fetchSitio)

    expect(respuesta).toEqual({ status: 201, cuerpo: { success: true, data: { id: 7 } } })
    expect(llamadas).toHaveLength(1)
    const [{ url, opciones }] = llamadas as [{ url: string, opciones: OpcionesFetchSitio }]
    expect(url).toBe(`http://backend.interno:3010${PREFIJO_API_SITIO}/inscriptions`)
    expect(opciones).toMatchObject({ method: 'POST', body: cuerpo, timeout: 60000, retry: 0, ignoreResponseError: true })
    expect(opciones.headers).toEqual({
      'Accept': 'application/json',
      'X-Api-Key': TOKEN,
      'X-Client-Ip': '181.65.10.20',
      'Content-Type': 'multipart/form-data; boundary=limite',
    })
  })

  it('pasa la consulta (query) y omite X-Client-Ip si no hay una IP válida', async () => {
    const { fetchSitio, llamadas } = fetchSimulado({ status: 200, _data: { success: true, data: [] } })
    await llamarApiSitio(contexto({ ipCliente: null }), { ruta: '/registration-types', query: { categoria: 'ESTUDIANTES' } }, fetchSitio)
    expect(llamadas[0]!.opciones.method).toBe('GET')
    expect(llamadas[0]!.opciones.query).toEqual({ categoria: 'ESTUDIANTES' })
    expect(llamadas[0]!.opciones.headers).not.toHaveProperty('X-Client-Ip')
    expect(llamadas[0]!.opciones.headers).not.toHaveProperty('Content-Type')
  })

  it('sin token o sin dirección del backend responde 503 SITE_NOT_CONFIGURED sin llamar al backend', async () => {
    const { fetchSitio } = fetchSimulado({ status: 200 })
    expect(await llamarApiSitio(contexto({ token: '  ' }), { ruta: '/event' }, fetchSitio)).toEqual({ status: 503, cuerpo: SITIO_NO_CONFIGURADO })
    expect(await llamarApiSitio(contexto({ baseUrl: '' }), { ruta: '/event' }, fetchSitio)).toEqual({ status: 503, cuerpo: SITIO_NO_CONFIGURADO })
    expect(fetchSitio).not.toHaveBeenCalled()
    expect(SITIO_NO_CONFIGURADO.code).toBe('SITE_NOT_CONFIGURED')
    expect(configuracionFaltante({ baseUrl: '', token: '' })).toEqual(['NUXT_BACKEND_BASE_URL', 'NUXT_BACKEND_EVENT_TOKEN'])
  })

  it.each([
    [401, { success: false, code: 'INVALID_EVENT_TOKEN', message: 'Token inválido' }],
    [401, { success: false, code: 'EVENT_TOKEN_REQUIRED', message: 'Falta el token' }],
    [404, { success: false, code: 'EVENT_NOT_FOUND', message: 'Evento archivado' }],
    [409, { success: false, code: 'ALREADY_REGISTERED', message: 'Ya inscrito' }],
    [422, { success: false, code: 'VALIDATION_ERROR', message: 'Datos inválidos', fields: { fechaPago: 'futura' } }],
    [429, { success: false, code: 'RATE_LIMITED', message: 'Espera' }],
    [503, { success: false, code: 'LOOKUP_UNAVAILABLE', message: 'Sin tokens' }],
  ])('propaga sin cambios el estado %i y el cuerpo de error del backend', async (status, cuerpo) => {
    const { fetchSitio } = fetchSimulado({ status, _data: cuerpo })
    expect(await llamarApiSitio(contexto(), { ruta: '/event' }, fetchSitio)).toEqual({ status, cuerpo })
  })

  it('si el backend no responde devuelve 502 BACKEND_UNAVAILABLE sin exponer URL ni token', async () => {
    const fetchSitio: FetchSitio = async () => {
      throw new Error(`[GET] "http://backend.interno:3010/api/v1/site/event" X-Api-Key=${TOKEN}: fetch failed`)
    }
    const respuesta = await llamarApiSitio(contexto(), { ruta: '/event' }, fetchSitio)
    expect(respuesta).toEqual({ status: 502, cuerpo: BACKEND_NO_DISPONIBLE })
    expect(JSON.stringify(respuesta)).not.toContain(TOKEN)
    expect(JSON.stringify(respuesta)).not.toContain('backend.interno')
  })

  it('reemplaza un error sin cuerpo JSON (p. ej. HTML de un proxy) conservando el estado', async () => {
    const html = '<html>Bad Gateway</html>'
    expect(await llamarApiSitio(contexto(), { ruta: '/event' }, fetchSimulado({ status: 502, _data: html }).fetchSitio))
      .toEqual({ status: 502, cuerpo: BACKEND_NO_DISPONIBLE })
    const demasiadoGrande = await llamarApiSitio(contexto(), { ruta: '/papers' }, fetchSimulado({ status: 413, _data: html }).fetchSitio)
    expect(demasiadoGrande.status).toBe(413)
    expect(demasiadoGrande.cuerpo).toMatchObject({ success: false, code: 'REQUEST_ERROR' })
  })

  it('el token nunca aparece en el cuerpo devuelto al navegador', async () => {
    const casos = [
      await llamarApiSitio(contexto({ baseUrl: '' }), { ruta: '/event' }, fetchSimulado({ status: 200 }).fetchSitio),
      await llamarApiSitio(contexto(), { ruta: '/event' }, fetchSimulado({ status: 200, _data: { success: true, data: { codigo: 'ciisic' } } }).fetchSitio),
      await llamarApiSitio(contexto(), { ruta: '/event' }, fetchSimulado({ status: 500 }).fetchSitio),
    ]
    for (const caso of casos) expect(JSON.stringify(caso)).not.toContain(TOKEN)
  })
})

describe('lectura del cuerpo con límite', () => {
  it('concatena el cuerpo recibido en partes', async () => {
    const cuerpo = await leerCuerpoLimitado(Readable.from([Buffer.from('hola '), 'mundo']), 100)
    expect(cuerpo.toString()).toBe('hola mundo')
  })

  it('corta con CuerpoDemasiadoGrande apenas se supera el límite', async () => {
    const partes = [Buffer.alloc(6), Buffer.alloc(6)]
    await expect(leerCuerpoLimitado(Readable.from(partes), 10)).rejects.toBeInstanceOf(CuerpoDemasiadoGrande)
    await expect(leerCuerpoLimitado(Readable.from([Buffer.alloc(10)]), 10)).resolves.toHaveLength(10)
  })

  it('rechaza por Content-Length declarado sin leer el cuerpo', () => {
    expect(excedeLongitudDeclarada(String(LIMITE_MULTIPART_BYTES + 1), LIMITE_MULTIPART_BYTES)).toBe(true)
    expect(excedeLongitudDeclarada(String(5 * 1024 * 1024), LIMITE_MULTIPART_BYTES)).toBe(false)
    expect(excedeLongitudDeclarada(undefined, LIMITE_MULTIPART_BYTES)).toBe(false)
  })
})

describe('verificación con Google: credential → idToken', () => {
  // Forma de un ID token de Google (header.payload.firma en base64url); el contenido no importa
  const CREDENCIAL = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFiYyJ9.eyJlbWFpbCI6ImFuYUB1bmRjLmVkdS5wZSJ9.c2lnbmF0dXJhLWRlLXBydWViYQ'
  const json = (valor: unknown) => new TextEncoder().encode(JSON.stringify(valor))
  const leerCuerpo = (cuerpo: Uint8Array | undefined) => JSON.parse(new TextDecoder().decode(cuerpo))
  const VERIFICADO = {
    success: true,
    data: {
      correo: '2021003668@undc.edu.pe',
      nombres: 'Ana María',
      apellidos: 'Pérez Díaz',
      tipoCuenta: 'ESTUDIANTE',
      esInstitucional: true,
      verificacionCorreoToken: 'eyJ.verificacion.correo',
    },
  }

  it('reconoce la forma de un ID token (≤ 4096 caracteres, 3 segmentos base64url)', () => {
    expect(esCredencialGoogle(CREDENCIAL)).toBe(true)
    expect(esCredencialGoogle(`a.b.${'c'.repeat(4092)}`)).toBe(true)
    expect(esCredencialGoogle(`a.b.${'c'.repeat(4093)}`)).toBe(false)
    for (const invalida of ['', 'a.b', 'a.b.c.d', 'a..c', 'a.b.', 'a.b.c=', 'a.b.c d', 'a/b.c.d', 123, null, undefined, { credential: CREDENCIAL }]) {
      expect(esCredencialGoogle(invalida)).toBe(false)
    }
  })

  it('reenvía solo { idToken } como JSON a /google-verification con X-Api-Key y X-Client-Ip', async () => {
    const adaptado = adaptarVerificacionGoogle(json({ credential: CREDENCIAL, select_by: 'btn', idToken: 'otro', extra: 1 }))
    expect(adaptado.ok).toBe(true)
    if (!adaptado.ok) return

    const { fetchSitio, llamadas } = fetchSimulado({ status: 200, _data: VERIFICADO })
    const respuesta = await llamarApiSitio(contexto(), {
      metodo: 'POST',
      ruta: '/google-verification',
      cuerpo: adaptado.cuerpo,
      tipoContenido: adaptado.tipoContenido,
      timeoutMs: 15000,
    }, fetchSitio)

    expect(respuesta).toEqual({ status: 200, cuerpo: VERIFICADO })
    const [{ url, opciones }] = llamadas as [{ url: string, opciones: OpcionesFetchSitio }]
    expect(url).toBe(`http://backend.interno:3010${PREFIJO_API_SITIO}/google-verification`)
    expect(opciones.method).toBe('POST')
    expect(leerCuerpo(opciones.body)).toEqual({ idToken: CREDENCIAL })
    expect(opciones.headers).toEqual({
      'Accept': 'application/json',
      'X-Api-Key': TOKEN,
      'X-Client-Ip': '181.65.10.20',
      'Content-Type': 'application/json',
    })
  })

  it.each([
    ['un cuerpo que no es JSON', new TextEncoder().encode('credential=a.b.c')],
    ['un JSON sin credential', json({ idToken: CREDENCIAL })],
    ['una credencial que no es texto', json({ credential: 42 })],
    ['una credencial con 2 segmentos', json({ credential: 'a.b' })],
    ['una credencial de más de 4096 caracteres', json({ credential: `a.b.${'c'.repeat(4093)}` })],
    ['un arreglo', json([CREDENCIAL])],
  ])('rechaza %s con 422 INVALID_GOOGLE_CREDENTIAL sin llamar al backend', (_, cuerpo) => {
    expect(adaptarVerificacionGoogle(cuerpo)).toEqual({ ok: false, status: 422, error: CREDENCIAL_GOOGLE_INVALIDA })
    expect(CREDENCIAL_GOOGLE_INVALIDA).toMatchObject({ success: false, code: 'INVALID_GOOGLE_CREDENTIAL' })
  })

  it.each([
    [401, { success: false, code: 'INVALID_GOOGLE_TOKEN', message: 'Token de Google inválido' }],
    [403, { success: false, code: 'GOOGLE_EMAIL_NOT_VERIFIED', message: 'Correo no verificado' }],
    [403, { success: false, code: 'GOOGLE_NOT_AUTHORITATIVE', message: 'Usa una cuenta de Gmail o tu cuenta institucional de Google.' }],
    [422, { success: false, code: 'VALIDATION_ERROR', message: 'Datos inválidos', fields: { idToken: 'Token de Google inválido' } }],
    [429, { success: false, code: 'RATE_LIMITED', message: 'Espera' }],
    [503, { success: false, code: 'GOOGLE_NOT_CONFIGURED', message: 'Google no está configurado' }],
    [503, { success: false, code: 'GOOGLE_UNAVAILABLE', message: 'Google no responde' }],
    [401, { success: false, code: 'INVALID_EVENT_TOKEN', message: 'Token inválido' }],
  ])('propaga sin cambios el estado %i y el cuerpo de error del backend', async (status, cuerpo) => {
    const adaptado = adaptarVerificacionGoogle(json({ credential: CREDENCIAL }))
    if (!adaptado.ok) throw new Error('la credencial de prueba debería ser válida')
    const { fetchSitio } = fetchSimulado({ status, _data: cuerpo })
    const respuesta = await llamarApiSitio(contexto(), { metodo: 'POST', ruta: '/google-verification', cuerpo: adaptado.cuerpo, tipoContenido: adaptado.tipoContenido }, fetchSitio)
    expect(respuesta).toEqual({ status, cuerpo })
  })

  describe('ruta Nitro POST /api/publico/verificacion-google', () => {
    let respuestaBackend: { status: number, _data?: unknown }
    const llamadas: Array<{ url: string, opciones: OpcionesFetchSitio }> = []

    /** Evento h3 mínimo: petición con cuerpo en flujo y respuesta que registra estado y encabezados. */
    function eventoSimulado(cuerpo: string, cabeceras: Record<string, string> = {}) {
      const bytes = Buffer.from(cuerpo)
      const req = Object.assign(Readable.from([bytes]), {
        headers: {
          'content-type': 'application/json',
          'content-length': String(bytes.length),
          'x-forwarded-for': '1.1.1.1, 181.65.10.20',
          ...cabeceras,
        },
        socket: { remoteAddress: '172.18.0.3' },
      })
      const encabezados: Record<string, string> = {}
      const res = {
        statusCode: 200,
        statusMessage: '',
        setHeader: (nombre: string, valor: string) => { encabezados[nombre.toLowerCase()] = String(valor) },
      }
      return { evento: { node: { req, res }, context: {} } as unknown as H3Event, res, encabezados }
    }

    async function manejador() {
      const { default: ruta } = await import('../server/api/publico/verificacion-google.post')
      return ruta as unknown as (evento: H3Event) => Promise<unknown>
    }

    beforeEach(async () => {
      llamadas.length = 0
      respuestaBackend = { status: 200, _data: VERIFICADO }
      // Globals que Nitro auto-importa en el servidor
      vi.stubGlobal('useRuntimeConfig', () => ({ backendBaseUrl: 'http://backend.interno:3010', backendEventToken: TOKEN }))
      vi.stubGlobal('getRequestHeader', getRequestHeader)
      vi.stubGlobal('setResponseStatus', setResponseStatus)
      vi.stubGlobal('setResponseHeader', setResponseHeader)
      vi.stubGlobal('$fetch', {
        raw: vi.fn(async (url: string, opciones: OpcionesFetchSitio) => {
          llamadas.push({ url, opciones })
          return respuestaBackend
        }),
      })
      vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
      vi.stubGlobal('adaptarVerificacionGoogle', adaptarVerificacionGoogle)
      vi.stubGlobal('LIMITE_VERIFICACION_GOOGLE_BYTES', LIMITE_VERIFICACION_GOOGLE_BYTES)
      const { reenviarCuerpoSitio } = await import('../server/utils/sitio')
      vi.stubGlobal('reenviarCuerpoSitio', reenviarCuerpoSitio)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('reenvía { idToken } con el token del evento y la IP del visitante, sin caché', async () => {
      const { evento, res, encabezados } = eventoSimulado(JSON.stringify({ credential: CREDENCIAL, select_by: 'btn' }))
      const cuerpo = await (await manejador())(evento)

      expect(cuerpo).toEqual(VERIFICADO)
      expect(res.statusCode).toBe(200)
      expect(encabezados['cache-control']).toBe('no-store')
      expect(llamadas).toHaveLength(1)
      expect(llamadas[0]!.url).toBe(`http://backend.interno:3010${PREFIJO_API_SITIO}/google-verification`)
      expect(llamadas[0]!.opciones.headers).toMatchObject({ 'X-Api-Key': TOKEN, 'X-Client-Ip': '181.65.10.20', 'Content-Type': 'application/json' })
      expect(leerCuerpo(llamadas[0]!.opciones.body)).toEqual({ idToken: CREDENCIAL })
      expect(JSON.stringify(cuerpo)).not.toContain(TOKEN)
    })

    it('propaga el estado y el cuerpo de error del backend', async () => {
      respuestaBackend = { status: 403, _data: { success: false, code: 'GOOGLE_EMAIL_NOT_VERIFIED', message: 'Correo no verificado' } }
      const { evento, res } = eventoSimulado(JSON.stringify({ credential: CREDENCIAL }))
      expect(await (await manejador())(evento)).toEqual(respuestaBackend._data)
      expect(res.statusCode).toBe(403)
    })

    it('responde 422 INVALID_GOOGLE_CREDENTIAL sin llamar al backend', async () => {
      const { evento, res } = eventoSimulado(JSON.stringify({ credential: 'no-es-un-jwt' }))
      expect(await (await manejador())(evento)).toEqual(CREDENCIAL_GOOGLE_INVALIDA)
      expect(res.statusCode).toBe(422)
      expect(llamadas).toHaveLength(0)
    })

    it('rechaza otro Content-Type (415) y un cuerpo mayor a 8 KB (413) sin llamar al backend', async () => {
      const formulario = eventoSimulado(`credential=${CREDENCIAL}`, { 'content-type': 'application/x-www-form-urlencoded' })
      expect(await (await manejador())(formulario.evento)).toMatchObject({ code: 'UNSUPPORTED_MEDIA_TYPE' })
      expect(formulario.res.statusCode).toBe(415)

      const grande = eventoSimulado(JSON.stringify({ credential: CREDENCIAL, relleno: 'x'.repeat(LIMITE_VERIFICACION_GOOGLE_BYTES) }))
      expect(await (await manejador())(grande.evento)).toMatchObject({ code: 'PAYLOAD_TOO_LARGE' })
      expect(grande.res.statusCode).toBe(413)
      expect(llamadas).toHaveLength(0)
    })
  })
})
