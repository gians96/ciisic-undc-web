// @vitest-environment node
import { Readable } from 'node:stream'
import type { H3Event } from 'h3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { errorSitio, type OpcionesFetchSitio } from '../server/utils/api-sitio'
import { responderSitio } from '../server/utils/sitio'

// GET /api/publico/credencial/:codigo → GET {backend}/api/v1/site/credential/:codigo
// Enlace del correo de aprobación (spec 020): la landing valida el formato y delega el resto.
describe('ruta Nitro GET /api/publico/credencial/:codigo', () => {
  const TOKEN = 'evt_tok3n-secreto-de-prueba'
  const DATOS = {
    success: true,
    data: {
      nombres: 'Ana María',
      apellidos: 'Pérez López',
      codigo: 'K7Q2M9X4TB',
      clasificacion: null,
      tipo: { nombre: 'General', etiqueta: 'CON KIT' },
      evento: { nombre: 'VIII Congreso', nombreCorto: 'VIII CIISIC 2026' },
    },
  }
  let respuestaBackend: { status: number, _data?: unknown }
  let parametro: string | undefined
  const llamadas: Array<{ url: string, opciones: OpcionesFetchSitio }> = []

  /** Evento h3 mínimo de solo lectura (sin cuerpo): registra estado y encabezados. */
  function eventoSimulado(cabeceras: Record<string, string> = {}) {
    const req = Object.assign(Readable.from([]), {
      headers: { 'x-forwarded-for': '1.1.1.1, 181.65.10.20', ...cabeceras },
      socket: { remoteAddress: '172.18.0.3' },
    })
    const encabezados: Record<string, string> = {}
    const res = { statusCode: 200, statusMessage: '', encabezados }
    return {
      evento: { node: { req, res }, res, context: {} } as unknown as H3Event,
      res,
      encabezados,
    }
  }

  async function manejador() {
    const { default: ruta } = await import('../server/api/publico/credencial/[codigo].get')
    return ruta as unknown as (evento: H3Event) => Promise<unknown>
  }

  beforeEach(async () => {
    llamadas.length = 0
    respuestaBackend = { status: 200, _data: DATOS }
    parametro = 'K7Q2M9X4TB'
    // Globals que Nitro auto-importa en el servidor
    vi.stubGlobal('useRuntimeConfig', () => ({ backendBaseUrl: 'http://backend.interno:3010', backendEventToken: TOKEN }))
    vi.stubGlobal('$fetch', {
      raw: vi.fn(async (url: string, opciones: OpcionesFetchSitio) => {
        llamadas.push({ url, opciones })
        return respuestaBackend
      }),
    })
    vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
    vi.stubGlobal('getRouterParam', () => parametro)
    vi.stubGlobal('errorSitio', errorSitio)
    vi.stubGlobal('responderSitio', responderSitio)
    // h3 real exige `event.res.headers` (Headers); estos stubs van contra el evento simulado
    vi.stubGlobal('getRequestHeader', (ev: H3Event, nombre: string) => ev.node.req.headers[nombre.toLowerCase()])
    vi.stubGlobal('setResponseStatus', (ev: { res: { statusCode: number } }, codigo: number) => { ev.res.statusCode = codigo })
    vi.stubGlobal('setResponseHeader', (ev: { res: { encabezados: Record<string, string> } }, nombre: string, valor: unknown) => {
      ev.res.encabezados[nombre.toLowerCase()] = String(valor)
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reenvía el código válido al backend con token e IP, sin caché ni token en la respuesta', async () => {
    const { evento, res, encabezados } = eventoSimulado()
    const cuerpo = await (await manejador())(evento)

    expect(cuerpo).toEqual(DATOS)
    expect(res.statusCode).toBe(200)
    expect(encabezados['cache-control']).toBe('no-store')
    expect(llamadas).toHaveLength(1)
    expect(llamadas[0]!.url).toBe('http://backend.interno:3010/api/v1/site/credential/K7Q2M9X4TB')
    expect(llamadas[0]!.opciones.method).toBe('GET')
    expect(llamadas[0]!.opciones.headers).toMatchObject({
      'Accept': 'application/json',
      'X-Api-Key': TOKEN,
      'X-Client-Ip': '181.65.10.20',
    })
    expect(llamadas[0]!.opciones.body).toBeUndefined()
    expect(JSON.stringify(cuerpo)).not.toContain(TOKEN)
  })

  it('normaliza a mayúsculas un enlace tecleado a mano', async () => {
    parametro = '  k7q2m9x4tb '
    const { evento } = eventoSimulado()
    await (await manejador())(evento)
    expect(llamadas[0]!.url).toBe('http://backend.interno:3010/api/v1/site/credential/K7Q2M9X4TB')
  })

  it.each([
    ['de menos', 'K7Q2M9X4T'],
    ['de más', 'K7Q2M9X4TBB'],
    ['con guion', 'K7Q2M9X4T-B'],
    ['con carácter inválido', 'K7Q2M9X4T0!'],
    ['vacío', ''],
  ])('responde 422 INVALID_CODE con código %s sin llamar al backend', async (_, codigo) => {
    parametro = codigo
    const { evento, res } = eventoSimulado()
    const cuerpo = await (await manejador())(evento)
    expect(cuerpo).toMatchObject({ success: false, code: 'INVALID_CODE' })
    expect(res.statusCode).toBe(422)
    expect(llamadas).toHaveLength(0)
  })

  it.each([
    [404, { success: false, code: 'CREDENTIAL_NOT_FOUND', message: 'No encontramos la credencial' }],
    [403, { success: false, code: 'INVALID_EVENT_TOKEN', message: 'Token inválido' }],
    [429, { success: false, code: 'RATE_LIMITED', message: 'Espera' }],
    [503, { success: false, code: 'SERVICE_UNAVAILABLE', message: 'No disponible' }],
  ])('propaga sin cambios el estado %i y el cuerpo de error del backend', async (status, cuerpoError) => {
    respuestaBackend = { status, _data: cuerpoError }
    const { evento, res } = eventoSimulado()
    expect(await (await manejador())(evento)).toEqual(cuerpoError)
    expect(res.statusCode).toBe(status)
  })

  it('sin configuración del backend responde 503 SITE_NOT_CONFIGURED', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({ backendBaseUrl: '', backendEventToken: '' }))
    const { evento, res } = eventoSimulado()
    expect(await (await manejador())(evento)).toMatchObject({ code: 'SITE_NOT_CONFIGURED' })
    expect(res.statusCode).toBe(503)
    expect(llamadas).toHaveLength(0)
  })
})
