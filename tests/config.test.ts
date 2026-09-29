// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

interface ConfigNuxt {
  runtimeConfig: Record<string, unknown> & { public: Record<string, unknown> }
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
    vi.stubGlobal('defineNuxtConfig', (config: ConfigNuxt) => config)

    const { default: config } = await import('../nuxt.config') as unknown as { default: ConfigNuxt }
    const { runtimeConfig } = config

    expect(runtimeConfig.backendEventToken).toBe('')
    expect(runtimeConfig.backendBaseUrl).toBe('')
    expect(Object.keys(runtimeConfig.public)).not.toContain('backendEventToken')
    expect(Object.keys(runtimeConfig.public)).not.toContain('apiBaseUrl')
    expect(Object.keys(runtimeConfig.public)).not.toContain('eventoCodigo')
    expect(JSON.stringify(runtimeConfig)).not.toContain('evt_no-debe-quedar-en-el-build')
  })
})
