// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { nombreBilletera, nombreDescargaQr, titularBilletera, urlQrBilletera } from '../app/utils/formato'
import {
  BACKEND_NO_DISPONIBLE,
  QR_NO_EXISTE,
  SITIO_NO_CONFIGURADO,
  obtenerQrSitio,
  type ContextoSitio,
  type FetchImagenSitio,
  type OpcionesFetchImagen,
} from '../server/utils/api-sitio'

const ARCHIVO = 'qr-0b6d4c9e-2f7a-4c1e-9d3b-5a8f6e7c1d2e.png'
const TOKEN = 'evt_tok3n-secreto-de-prueba'
const contexto = (cambios: Partial<ContextoSitio> = {}): ContextoSitio => ({ baseUrl: 'http://backend.interno:3010/', token: TOKEN, ipCliente: '181.65.10.20', ...cambios })
const PNG = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 1, 2, 3])

/** Doble de `$fetch.raw` para binarios. */
function fetchImagen(status: number, tipo: string | null, datos?: Uint8Array) {
  const llamadas: Array<{ url: string, opciones: OpcionesFetchImagen }> = []
  const fn: FetchImagenSitio = vi.fn(async (url, opciones) => {
    llamadas.push({ url, opciones })
    return { status, headers: { get: (nombre: string) => (nombre.toLowerCase() === 'content-type' ? tipo : null) }, _data: datos?.slice().buffer }
  })
  return { fn, llamadas }
}

describe('urlQrBilletera', () => {
  it('la imagen subida en el panel se pide al BFF de la landing', () => {
    expect(urlQrBilletera({ qrArchivo: ARCHIVO, qrUrl: '/images/qr/yape-2026.png' })).toBe(`/api/publico/qr/${ARCHIVO}`)
  })

  it('sin imagen subida usa la URL configurada (validada)', () => {
    expect(urlQrBilletera({ qrArchivo: null, qrUrl: '/images/qr/yape-2026.png' })).toBe('/images/qr/yape-2026.png')
    expect(urlQrBilletera({ qrUrl: 'javascript:alert(1)' })).toBe('')
    expect(urlQrBilletera(null)).toBe('')
  })

  it('ignora nombres de archivo con otro formato', () => {
    expect(urlQrBilletera({ qrArchivo: '../../secreto.png', qrUrl: null })).toBe('')
  })
})

describe('nombreBilletera / titularBilletera', () => {
  it('muestra el aplicativo cuando «Nombre» guarda el del titular (caso de producción)', () => {
    const yape = { codigo: 'yape', nombre: 'Jhon Isamel Santiago Rojas' }
    expect(nombreBilletera(yape)).toBe('Yape')
    expect(titularBilletera(yape, 'Titular general')).toBe('Jhon Isamel Santiago Rojas')
  })

  it('respeta un nombre que ya menciona el aplicativo y usa el titular general', () => {
    expect(nombreBilletera({ codigo: 'plin', nombre: 'Plin Interbank' })).toBe('Plin Interbank')
    expect(nombreBilletera({ codigo: 'yape', nombre: 'YAPE' })).toBe('YAPE')
    expect(titularBilletera({ codigo: 'yape', nombre: 'Yape' }, 'UNDC')).toBe('UNDC')
  })

  it('con un código desconocido usa su nombre o el código', () => {
    expect(nombreBilletera({ codigo: 'lukita', nombre: 'Lukita' })).toBe('Lukita')
    expect(nombreBilletera({ codigo: 'lukita', nombre: '' })).toBe('Lukita')
    expect(titularBilletera({ codigo: 'lukita', nombre: 'Lukita' }, 'UNDC')).toBe('UNDC')
    expect(nombreBilletera(null)).toBe('')
  })
})

describe('nombreDescargaQr', () => {
  it('usa el código de la billetera y la extensión de la imagen', () => {
    expect(nombreDescargaQr('yape', `/api/publico/qr/${ARCHIVO}`)).toBe('qr-yape.png')
    expect(nombreDescargaQr('plin', '/images/qr/plin.jpeg')).toBe('qr-plin.jpg')
    expect(nombreDescargaQr('plin', '/images/qr/plin.webp?v=2')).toBe('qr-plin.webp')
    expect(nombreDescargaQr(null, 'https://pagos.example/qr')).toBe('qr-billetera.png')
  })
})

describe('obtenerQrSitio (BFF)', () => {
  it('pide la imagen con el token del evento y devuelve sus bytes', async () => {
    const { fn, llamadas } = fetchImagen(200, 'image/png', PNG)
    const imagen = await obtenerQrSitio(contexto(), ARCHIVO, fn)
    expect(imagen).toEqual({ status: 200, tipo: 'image/png', bytes: PNG })
    expect(llamadas[0]!.url).toBe(`http://backend.interno:3010/api/v1/site/payment-qr/${ARCHIVO}`)
    expect(llamadas[0]!.opciones.headers).toMatchObject({ 'X-Api-Key': TOKEN, 'X-Client-Ip': '181.65.10.20' })
  })

  it.each(['../../.env', 'qr-otro.png', `${ARCHIVO}.svg`, ''])('no llama al backend con nombres ajenos (%s)', async (nombre) => {
    const { fn } = fetchImagen(200, 'image/png', PNG)
    expect(await obtenerQrSitio(contexto(), nombre, fn)).toEqual({ status: 404, cuerpo: QR_NO_EXISTE })
    expect(fn).not.toHaveBeenCalled()
  })

  it('sin configuración responde 503', async () => {
    const { fn } = fetchImagen(200, 'image/png', PNG)
    expect(await obtenerQrSitio(contexto({ token: '' }), ARCHIVO, fn)).toEqual({ status: 503, cuerpo: SITIO_NO_CONFIGURADO })
  })

  it('un 404 del backend es un 404 de la landing', async () => {
    expect(await obtenerQrSitio(contexto(), ARCHIVO, fetchImagen(404, 'application/json').fn)).toEqual({ status: 404, cuerpo: QR_NO_EXISTE })
  })

  it('no reenvía respuestas que no son imágenes', async () => {
    const html = fetchImagen(200, 'text/html', new Uint8Array([60, 104]))
    expect(await obtenerQrSitio(contexto(), ARCHIVO, html.fn)).toEqual({ status: 502, cuerpo: BACKEND_NO_DISPONIBLE })
  })

  it('si el backend no responde, no expone la URL interna', async () => {
    const fn: FetchImagenSitio = vi.fn(async () => {
      throw new Error('connect ECONNREFUSED backend.interno:3010')
    })
    expect(await obtenerQrSitio(contexto(), ARCHIVO, fn)).toEqual({ status: 502, cuerpo: BACKEND_NO_DISPONIBLE })
  })
})
