// ============================================================================
// API ENDPOINT PARA CONSULTA DE DOCUMENTOS (SERVIDOR) - CON SEGURIDAD
// ============================================================================

// Cache para rate limiting (en producción usar Redis)
const requestCache = new Map<string, { count: number, lastReset: number }>()
const RATE_LIMIT = 10 // máximo 10 requests por minuto por IP
const RATE_WINDOW = 60 * 1000 // 1 minuto en millisegundos

export default defineEventHandler(async (event) => {
  try {
    // ========================================
    // VERIFICACIÓN DE CONFIGURACIÓN AL INICIO
    // ========================================
    
    // Intentar obtener variables de múltiples fuentes
    let apiToken = process.env.X_API_TOKEN || 
                   process.env.NUXT_X_API_TOKEN || 
                   process.env.RUNTIME_X_API_TOKEN
    
    let apiUrl = process.env.X_API_URL || 
                 process.env.NUXT_X_API_URL || 
                 process.env.RUNTIME_X_API_URL || 
                 'https://api-test.nube-tec.com/api/v1/consultation'
    
    // Log para debugging en producción
    console.log('=== API CONSULTATION DEBUG ===')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('API Token exists:', !!apiToken)
    console.log('API URL:', apiUrl)
    console.log('Token source:', apiToken ? 'FOUND' : 'NOT_FOUND')
    
    // Verificar variables de entorno
    if (!apiToken || apiToken === '') {
      console.error('ERROR: No se encontró token de API en ninguna variable')
      console.error('Checked variables: X_API_TOKEN, NUXT_X_API_TOKEN, RUNTIME_X_API_TOKEN')
      throw createError({
        statusCode: 500,
        statusMessage: 'Server configuration error: API token not found'
      })
    }
    
    if (!apiUrl || apiUrl === '') {
      console.error('ERROR: No se encontró URL de API')
      throw createError({
        statusCode: 500,
        statusMessage: 'Server configuration error: API URL not found'
      })
    }

    // Solo permitir métodos POST
    if (getMethod(event) !== 'POST') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method Not Allowed'
      })
    }

    // ========================================
    // RATE LIMITING POR IP
    // ========================================
    const clientIP = getHeader(event, 'x-forwarded-for') || 
                     getHeader(event, 'x-real-ip') || 
                     event.node.req.socket.remoteAddress || 
                     'unknown'
    const now = Date.now()
    
    // Limpiar cache viejo y verificar rate limit
    const userCache = requestCache.get(clientIP)
    if (userCache) {
      // Si ha pasado más de 1 minuto, resetear contador
      if (now - userCache.lastReset > RATE_WINDOW) {
        userCache.count = 0
        userCache.lastReset = now
      }
      
      // Verificar si excede el límite
      if (userCache.count >= RATE_LIMIT) {
        throw createError({
          statusCode: 429,
          statusMessage: `Demasiadas consultas desde esta IP. Límite: ${RATE_LIMIT} por minuto. Intente nuevamente más tarde.`
        })
      }
      
      userCache.count++
    } else {
      // Primera consulta de esta IP
      requestCache.set(clientIP, { count: 1, lastReset: now })
    }

    // ========================================
    // VALIDACIÓN DE ORIGEN (OPCIONAL)
    // ========================================
    const origin = getHeader(event, 'origin')
    const referer = getHeader(event, 'referer')
    
    // En desarrollo permitir localhost, en producción validar dominio
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = [
        'https://ciisic-vii.episundc.pe', 
        'https://ciisic.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001'
      ]
      if (origin && !allowedOrigins.includes(origin)) {
        console.warn(`Origen no autorizado detectado: ${origin} desde IP: ${clientIP}`)
        throw createError({
          statusCode: 403,
          statusMessage: 'Origen no autorizado'
        })
      }
    }

    // ========================================
    // VALIDACIÓN DE DATOS DE ENTRADA
    // ========================================
    const body = await readBody(event)
    const { documentNumber, documentType = 'DNI' } = body

    console.log(`[${clientIP}] Consulta: ${documentType} ${documentNumber}`)

    // Validaciones básicas
    if (!documentNumber) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Número de documento es requerido'
      })
    }

    if (!['DNI', 'CE'].includes(documentType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tipo de documento no válido. Solo se permiten DNI o CE.'
      })
    }

    const expectedLength = documentType === 'DNI' ? 8 : 9
    
    if (documentNumber.length !== expectedLength || !/^\d+$/.test(documentNumber)) {
      throw createError({
        statusCode: 400,
        statusMessage: `${documentType} debe tener ${expectedLength} dígitos numéricos`
      })
    }

    // Validar que no sea un número obviamente falso
    const invalidNumbers = ['00000000', '12345678', '11111111', '87654321', '123456789']
    if (invalidNumbers.includes(documentNumber)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Número de documento no válido'
      })
    }

    // Construir la URL según el tipo de documento
    const endpoint = documentType === 'DNI' ? 'dni' : 'ce'
    const requestUrl = `${apiUrl}/${endpoint}/${documentNumber}`
    
    console.log('Making request to:', requestUrl)

    // Hacer la petición a la API externa desde el servidor
    const response = await $fetch(requestUrl, {
      headers: {
        'X-API-Token': apiToken,
        'Content-Type': 'application/json'
      }
    })

    // Log de consulta exitosa (para monitoreo)
    console.log(`[${clientIP}] ✅ Consulta exitosa: ${documentType} ${documentNumber}`)

    // Retornar la respuesta
    return response
    
  } catch (error: any) {
    const clientIP = getHeader(event, 'x-forwarded-for') || 
                     getHeader(event, 'x-real-ip') || 
                     event.node.req.socket.remoteAddress || 
                     'unknown'
    
    // Log de errores para monitoreo de seguridad
    if (error.statusCode === 429) {
      console.warn(`[SECURITY] Rate limit exceeded from IP: ${clientIP}`)
    } else if (error.statusCode === 403) {
      console.warn(`[SECURITY] Unauthorized access attempt from IP: ${clientIP}`)
    } else {
      console.error(`[${clientIP}] ❌ Error in document consultation:`, error.message)
    }
    
    // Si es un error de $fetch, mantener el código de estado
    if (error.status || error.statusCode) {
      throw createError({
        statusCode: error.status || error.statusCode,
        statusMessage: error.message || 'External API error'
      })
    }
    
    // Error genérico del servidor
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})