import type { FetchOptions } from 'ofetch'

export interface ApiErrorShape {
  statusCode: number
  code: string
  message: string
  fields?: Record<string, string>
}

interface ErrorDeFetch {
  name?: string
  statusCode?: number
  status?: number
  response?: { status?: number }
  data?: { code?: string; message?: string; fields?: Record<string, string> }
  message?: string
}

/** Nombres de error que indican que no hubo respuesta del servidor (red caída, CORS, timeout). */
const ERRORES_SIN_RESPUESTA = new Set(['FetchError', 'AbortError', 'TimeoutError'])

export function normalizeApiError(error: unknown): ApiErrorShape {
  const value = (error ?? {}) as ErrorDeFetch
  const statusCode = value.statusCode || value.status || value.response?.status || 0
  if (!statusCode && ERRORES_SIN_RESPUESTA.has(value.name ?? '')) {
    return { statusCode: 0, code: 'NETWORK_ERROR', message: 'No se pudo conectar con el servidor' }
  }
  return {
    statusCode: statusCode || 500,
    code: value.data?.code || 'REQUEST_ERROR',
    message: value.data?.message || value.message || 'No se pudo completar la solicitud',
    fields: value.data?.fields,
  }
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = String(config.public.apiBaseUrl).replace(/\/$/, '')

  const request = <T>(path: string, options: FetchOptions = {}) =>
    $fetch<T>(path, { baseURL, timeout: 15000, retry: 0, ...options } as Parameters<typeof $fetch>[1])

  return { request }
}
