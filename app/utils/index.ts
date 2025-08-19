// ============================================================================
// UTILIDADES DE FORMATEO - PRINCIPIO DE RESPONSABILIDAD ÚNICA (SRP)
// ============================================================================

/**
 * Formatea un número como moneda
 */
export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Formatea una fecha de manera legible
 */
export const formatDate = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

/**
 * Formatea una fecha con hora
 */
export const formatDateTime = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

/**
 * Formatea un número de manera compacta (1K, 1M, etc.)
 */
export const formatCompactNumber = (num: number, locale: string = 'es-ES'): string => {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num)
}

/**
 * Formatea un tiempo de lectura estimado
 */
export const formatReadTime = (minutes: number): string => {
  if (minutes < 1) return 'Menos de 1 min'
  if (minutes === 1) return '1 min de lectura'
  return `${minutes} min de lectura`
}

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

// ============================================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================================

/**
 * Valida un email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida una contraseña fuerte
 */
export const isStrongPassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongPasswordRegex.test(password)
}

/**
 * Valida un URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valida un nombre de usuario
 */
export const isValidUsername = (username: string): boolean => {
  // 3-20 caracteres, solo letras, números y guiones bajos
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

// ============================================================================
// UTILIDADES DE TEXTO
// ============================================================================

/**
 * Convierte texto a slug (URL-friendly)
 */
export const textToSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
}

/**
 * Capitaliza la primera letra de una palabra
 */
export const capitalize = (text: string): string => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (text: string): string => {
  return text.split(' ').map(capitalize).join(' ')
}

/**
 * Trunca texto a una longitud específica
 */
export const truncateText = (text: string, length: number, suffix: string = '...'): string => {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + suffix
}

/**
 * Extrae texto plano de HTML
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * Calcula el tiempo de lectura estimado
 */
export const calculateReadTime = (text: string, wordsPerMinute: number = 200): number => {
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// ============================================================================
// UTILIDADES DE ARRAYS Y OBJETOS
// ============================================================================

/**
 * Elimina duplicados de un array
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

/**
 * Ordena un array de objetos por una propiedad
 */
export const sortByProperty = <T>(array: T[], property: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[property]
    const bVal = b[property]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Agrupa un array de objetos por una propiedad
 */
export const groupBy = <T, K extends keyof T>(array: T[], property: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const key = String(item[property])
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Filtra propiedades vacías de un objeto
 */
export const removeEmptyProperties = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => 
      value !== null && value !== undefined && value !== ''
    )
  ) as Partial<T>
}

/**
 * Clona profundamente un objeto
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

// ============================================================================
// UTILIDADES DE NAVEGADOR
// ============================================================================

/**
 * Copia texto al portapapeles
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback para navegadores que no soportan la API de clipboard
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch {
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * Detecta si es un dispositivo móvil
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Obtiene el tamaño de la ventana
 */
export const getViewportSize = (): { width: number; height: number } => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

/**
 * Descargar un archivo
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ============================================================================
// UTILIDADES DE TIEMPO
// ============================================================================

/**
 * Formatea tiempo transcurrido (tiempo relativo)
 */
export const timeAgo = (date: Date | string, locale: string = 'es-ES'): string => {
  const now = new Date()
  const past = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  const intervals = [
    { label: 'año', seconds: 31536000 },
    { label: 'mes', seconds: 2592000 },
    { label: 'semana', seconds: 604800 },
    { label: 'día', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 }
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return count === 1 
        ? `hace 1 ${interval.label}`
        : `hace ${count} ${interval.label}${count > 1 ? 's' : ''}`
    }
  }

  return 'hace un momento'
}

/**
 * Formatea duración en segundos
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Pausa/delay asíncrono
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================================
// UTILIDADES DE COLORES
// ============================================================================

/**
 * Convierte HEX a RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16)
  } : null
}

/**
 * Genera un color aleatorio
 */
export const randomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}
