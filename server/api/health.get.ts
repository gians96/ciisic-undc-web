// ============================================================================
// HEALTH CHECK ENDPOINT - VERIFICAR CONFIGURACIÓN DEL SERVIDOR
// ============================================================================

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Verificar configuración básica (sin exponer valores sensibles)
    const healthCheck: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      configuration: {
        hasApiToken: !!config.xApiToken,
        hasApiUrl: !!config.xApiUrl,
        apiUrlHost: config.xApiUrl ? new URL(config.xApiUrl).hostname : 'not-configured'
      },
      server: {
        nodeVersion: process.version,
        platform: process.platform
      }
    }

    // Si falta alguna configuración crítica, marcar como unhealthy
    if (!config.xApiToken || !config.xApiUrl) {
      healthCheck.status = 'error'
      healthCheck.error = 'Missing critical environment variables'
    }

    return healthCheck
    
  } catch (error: any) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error?.message || 'Unknown error'
    }
  }
})