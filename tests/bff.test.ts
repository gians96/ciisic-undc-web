// @vitest-environment node
import { Readable } from 'node:stream'
import { describe, expect, it, vi } from 'vitest'
import {
  BACKEND_NO_DISPONIBLE,
  CuerpoDemasiadoGrande,
  LIMITE_MULTIPART_BYTES,
  PREFIJO_API_SITIO,
  SITIO_NO_CONFIGURADO,
  configuracionFaltante,
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
