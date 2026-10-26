// @vitest-environment node
import { Buffer } from 'node:buffer'
import { Readable } from 'node:stream'
import type { H3Event } from 'h3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { errorSitio, type OpcionesFetchSitio } from '../server/utils/api-sitio'

// POST /api/publico/credencial/:codigo/tecnologias → POST {backend}/api/v1/site/credential/:codigo/technologies
// (spec 038 del backend): la landing valida el código, limita el tamaño del cuerpo y delega el resto.
describe('ruta Nitro POST /api/publico/credencial/:codigo/tecnologias', () => {
  const TOKEN = 'evt_tok3n-secreto-de-prueba'
  const GUARDADAS = { success: true, data: { tecnologias: ['nuxt', 'vue'] } }
  let respuestaBackend: { status: number, _data?: unknown }
  let parametro: string | undefined
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
    const res = { statusCode: 200, statusMessage: '', encabezados }
    return {
      evento: { node: { req, res }, res, context: {} } as unknown as H3Event,
      res,
      encabezados,
    }
  }

  async function manejador() {
    const { default: ruta } = await import('../server/api/publico/credencial/[codigo]/tecnologias.post')
    return ruta as unknown as (evento: H3Event) => Promise<unknown>
  }

  const leerCuerpo = (cuerpo: unknown) => JSON.parse(Buffer.from(cuerpo as Uint8Array).toString('utf8'))

  beforeEach(async () => {
    llamadas.length = 0
    respuestaBackend = { status: 200, _data: GUARDADAS }
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
    vi.stubGlobal('getRequestHeader', (ev: H3Event, nombre: string) => ev.node.req.headers[nombre.toLowerCase()])
    vi.stubGlobal('setResponseStatus', (ev: { res: { statusCode: number } }, codigo: number) => { ev.res.statusCode = codigo })
    vi.stubGlobal('setResponseHeader', (ev: { res: { encabezados: Record<string, string> } }, nombre: string, valor: unknown) => {
      ev.res.encabezados[nombre.toLowerCase()] = String(valor)
    })
    const { reenviarCuerpoSitio } = await import('../server/utils/sitio')
    vi.stubGlobal('reenviarCuerpoSitio', reenviarCuerpoSitio)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reenvía la lista al backend con token e IP, sin caché ni token en la respuesta', async () => {
    const { evento, res, encabezados } = eventoSimulado(JSON.stringify({ tecnologias: ['nuxt', 'vue'] }))
    const cuerpo = await (await manejador())(evento)

    expect(cuerpo).toEqual(GUARDADAS)
    expect(res.statusCode).toBe(200)
    expect(encabezados['cache-control']).toBe('no-store')
    expect(llamadas).toHaveLength(1)
    expect(llamadas[0]!.url).toBe('http://backend.interno:3010/api/v1/site/credential/K7Q2M9X4TB/technologies')
    expect(llamadas[0]!.opciones.method).toBe('POST')
    expect(llamadas[0]!.opciones.headers).toMatchObject({
      'X-Api-Key': TOKEN,
      'X-Client-Ip': '181.65.10.20',
      'Content-Type': 'application/json',
    })
    expect(leerCuerpo(llamadas[0]!.opciones.body)).toEqual({ tecnologias: ['nuxt', 'vue'] })
    expect(JSON.stringify(cuerpo)).not.toContain(TOKEN)
  })

  it('normaliza a mayúsculas el código de la ruta', async () => {
    parametro = '  k7q2m9x4tb '
    const { evento } = eventoSimulado(JSON.stringify({ tecnologias: [] }))
    await (await manejador())(evento)
    expect(llamadas[0]!.url).toBe('http://backend.interno:3010/api/v1/site/credential/K7Q2M9X4TB/technologies')
  })

  it.each([
    ['de menos', 'K7Q2M9X4T'],
    ['con guion', 'K7Q2M9X4T-B'],
    ['con una ruta', '../../admin'],
    ['vacío', ''],
  ])('responde 422 INVALID_CODE con código %s sin llamar al backend', async (_caso, codigo) => {
    parametro = codigo
    const { evento, res, encabezados } = eventoSimulado(JSON.stringify({ tecnologias: ['vue'] }))
    expect(await (await manejador())(evento)).toMatchObject({ success: false, code: 'INVALID_CODE' })
    expect(res.statusCode).toBe(422)
    expect(encabezados['cache-control']).toBe('no-store')
    expect(llamadas).toHaveLength(0)
  })

  it('rechaza otro Content-Type (415) y un cuerpo mayor a 2 KB (413) sin llamar al backend', async () => {
    const formulario = eventoSimulado('tecnologias=vue', { 'content-type': 'application/x-www-form-urlencoded' })
    expect(await (await manejador())(formulario.evento)).toMatchObject({ code: 'UNSUPPORTED_MEDIA_TYPE' })
    expect(formulario.res.statusCode).toBe(415)

    const grande = eventoSimulado(JSON.stringify({ tecnologias: ['x'.repeat(3000)] }))
    expect(await (await manejador())(grande.evento)).toMatchObject({ code: 'PAYLOAD_TOO_LARGE' })
    expect(grande.res.statusCode).toBe(413)
    expect(llamadas).toHaveLength(0)
  })

  it.each([
    [404, { success: false, code: 'CREDENTIAL_NOT_FOUND', message: 'No encontramos la credencial' }],
    [422, { success: false, code: 'VALIDATION_ERROR', message: 'Los datos enviados no son válidos' }],
    [429, { success: false, code: 'RATE_LIMITED', message: 'Espera' }],
  ])('propaga sin cambios el estado %i y el cuerpo de error del backend', async (status, cuerpoError) => {
    respuestaBackend = { status, _data: cuerpoError }
    const { evento, res } = eventoSimulado(JSON.stringify({ tecnologias: ['vue'] }))
    expect(await (await manejador())(evento)).toEqual(cuerpoError)
    expect(res.statusCode).toBe(status)
  })
})
