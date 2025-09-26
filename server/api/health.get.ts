// ============================================================================
// HEALTH CHECK ENDPOINT - VERIFICAR CONFIGURACIÓN DEL SERVIDOR
// ============================================================================

export default defineEventHandler(async (event) => {
  try {
    // Obtener runtime config
    const config = useRuntimeConfig(event)
    
    // Leer variables directamente de process.env (como en consultation.post.ts)
    const apiToken = process.env.X_API_TOKEN
    
    const apiUrl = process.env.X_API_URL
    
    // Verificar configuración básica (sin exponer valores sensibles)
    const healthCheck: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      processEnv: {
        xApiToken: process.env.X_API_TOKEN ? true : false,
        xApiUrl: process.env.X_API_URL ? true : false,
        apiBaseUrl: process.env.API_BASE_URL ? true : false
      },
      runtimeConfig: {
        public: config.public,
        server: {
          xApiToken: config.xApiToken ? '***SET***' : 'NOT_SET',
          xApiUrl: config.xApiUrl || 'NOT_SET'
        }
      },
      server: {
        nodeVersion: process.version,
        platform: process.platform
      }
    }

    // Si falta alguna configuración crítica, marcar como unhealthy
    if (!apiToken || !apiUrl || !config.public.apiBaseUrl) {
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