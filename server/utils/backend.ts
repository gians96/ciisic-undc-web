export const SESSION_COOKIE = 'ciisic_session'

export function backendUrl(event: Parameters<typeof useRuntimeConfig>[0], path: string): string {
  const config = useRuntimeConfig(event)
  return `${String(config.backendBaseUrl).replace(/\/$/, '')}${path}`
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60,
  }
}
