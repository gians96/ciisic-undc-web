// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clientIdGoogleValido,
  normalizarConfiguracionSitio,
  urlMisInscripciones,
  urlPanelValida,
} from '../app/utils/configuracion-sitio'

interface ConfigNuxt {
  runtimeConfig: Record<string, unknown> & { public: Record<string, unknown> }
}

const CLIENT_ID = '123456789012-abcdefghijklmnop0123456789.apps.googleusercontent.com'

async function cargarConfigNuxt(): Promise<ConfigNuxt> {
  vi.stubGlobal('defineNuxtConfig', (config: ConfigNuxt) => config)
  const { default: config } = await import('../nuxt.config') as unknown as { default: ConfigNuxt }
  return config
}

describe('nuxt.config: configuración del BFF', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('el token del evento y la dirección del backend son privados y no se leen en el build', async () => {
    // Aunque el entorno del build tenga el token, no debe quedar en la configuración generada
    vi.stubEnv('NUXT_BACKEND_EVENT_TOKEN', 'evt_no-debe-quedar-en-el-build')
    vi.stubEnv('NUXT_BACKEND_BASE_URL', 'http://backend.interno:3010')

    const { runtimeConfig } = await cargarConfigNuxt()

    expect(runtimeConfig.backendEventToken).toBe('')
    expect(runtimeConfig.backendBaseUrl).toBe('')
    expect(Object.keys(runtimeConfig.public)).not.toContain('backendEventToken')
    expect(Object.keys(runtimeConfig.public)).not.toContain('apiBaseUrl')
    expect(Object.keys(runtimeConfig.public)).not.toContain('eventoCodigo')
    expect(JSON.stringify(runtimeConfig)).not.toContain('evt_no-debe-quedar-en-el-build')
  })

  it('no hay client ID de Google ni URL del panel en runtimeConfig: se leen de la API del sitio', async () => {
    // Variables de la versión anterior (o que alguien podría intentar definir) no tienen efecto
    vi.stubEnv('NUXT_PUBLIC_ADMIN_URL', 'https://panel.no-debe-quedar.test')
    vi.stubEnv('NUXT_PUBLIC_URL_PANEL', 'https://panel.no-debe-quedar.test')
    vi.stubEnv('NUXT_PUBLIC_GOOGLE_CLIENT_ID', `no-debe-quedar-${CLIENT_ID}`)

    const { runtimeConfig } = await cargarConfigNuxt()
    const claves = [...Object.keys(runtimeConfig), ...Object.keys(runtimeConfig.public)]

    for (const clave of claves) expect(clave).not.toMatch(/admin|panel|google|client/i)
    expect(runtimeConfig.public).not.toHaveProperty('adminUrl')
    expect(JSON.stringify(runtimeConfig)).not.toContain('no-debe-quedar')
    expect(JSON.stringify(runtimeConfig)).not.toContain('googleusercontent')
  })
})

describe('configuración del sitio (GET /config)', () => {
  it('toma el client ID de Google y la URL del panel de la respuesta', () => {
    expect(normalizarConfiguracionSitio({ google: { clientId: ` ${CLIENT_ID} ` }, urlPanel: 'https://panel.ciisic.undc.edu.pe/' }))
      .toEqual({ clientIdGoogle: CLIENT_ID, urlPanel: 'https://panel.ciisic.undc.edu.pe' })
  })

  it('sin Google o sin panel configurados devuelve null', () => {
    expect(normalizarConfiguracionSitio({ google: { clientId: null }, urlPanel: null })).toEqual({ clientIdGoogle: null, urlPanel: null })
    expect(normalizarConfiguracionSitio({ google: null, urlPanel: '' })).toEqual({ clientIdGoogle: null, urlPanel: null })
    expect(normalizarConfiguracionSitio(undefined)).toEqual({ clientIdGoogle: null, urlPanel: null })
  })

  it('un client ID con otro formato se trata como no configurado', () => {
    expect(clientIdGoogleValido(CLIENT_ID)).toBe(CLIENT_ID)
    expect(clientIdGoogleValido('mi-client-id')).toBeNull()
    expect(clientIdGoogleValido('<script>.apps.googleusercontent.com')).toBeNull()
    expect(clientIdGoogleValido(`${'a'.repeat(250)}.apps.googleusercontent.com`)).toBeNull()
    expect(clientIdGoogleValido(123)).toBeNull()
  })

  it('la URL del panel debe ser http(s) absoluta y sin credenciales', () => {
    expect(urlPanelValida('http://localhost:3001')).toBe('http://localhost:3001')
    expect(urlPanelValida('https://ciisic.undc.edu.pe/panel/?x=1#inicio')).toBe('https://ciisic.undc.edu.pe/panel')
    for (const invalida of ['javascript:alert(1)', 'data:text/html,hola', '/panel', '//panel.undc.edu.pe', 'ftp://panel.undc.edu.pe', 'https://usuario:clave@panel.undc.edu.pe', 'no es url', null, 42]) {
      expect(urlPanelValida(invalida)).toBeNull()
    }
  })

  it('enlace al estado de la inscripción en el panel', () => {
    expect(urlMisInscripciones('https://panel.ciisic.undc.edu.pe')).toBe('https://panel.ciisic.undc.edu.pe/mis-inscripciones')
    expect(urlMisInscripciones('https://ciisic.undc.edu.pe/panel/')).toBe('https://ciisic.undc.edu.pe/panel/mis-inscripciones')
    expect(urlMisInscripciones(null)).toBeNull()
    expect(urlMisInscripciones('javascript:alert(1)')).toBeNull()
  })
})
