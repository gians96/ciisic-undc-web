// ============================================================================
// HEALTH CHECK ENDPOINT - VERIFICAR CONFIGURACIÓN DEL SERVIDOR
// ============================================================================

export default defineEventHandler(async (event) => {
  try {
    // Leer variables directamente de process.env (como en consultation.post.ts)
    const apiToken = process.env.X_API_TOKEN || 
                     process.env.NUXT_X_API_TOKEN || 
                     process.env.RUNTIME_X_API_TOKEN
    
    const apiUrl = process.env.X_API_URL || 
                   process.env.NUXT_X_API_URL || 
                   process.env.RUNTIME_X_API_URL || 
                   'https://api-test.nube-tec.com/api/v1/consultation'
    
    // Verificar configuración básica (sin exponer valores sensibles)
    const healthCheck: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      configuration: {
        hasApiToken: !!apiToken,
        hasApiUrl: !!apiUrl,
        apiUrlHost: apiUrl ? new URL(apiUrl).hostname : 'not-configured'
      },
      server: {
        nodeVersion: process.version,
        platform: process.platform
      }
    }

    // Si falta alguna configuración crítica, marcar como unhealthy
    if (!apiToken || !apiUrl) {
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