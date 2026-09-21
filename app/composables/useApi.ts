import type { FetchOptions } from 'ofetch'

export interface ApiErrorShape {
  statusCode: number
  code: string
  message: string
  fields?: Record<string, string>
}

export function normalizeApiError(error: unknown): ApiErrorShape {
  const value = error as { statusCode?: number; status?: number; data?: { code?: string; message?: string; fields?: Record<string, string> }; message?: string }
  return {
    statusCode: value.statusCode || value.status || 500,
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
