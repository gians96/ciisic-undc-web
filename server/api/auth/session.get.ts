import { backendUrl, SESSION_COOKIE } from '../../utils/backend'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return { authenticated: false, user: null }

  try {
    const response = await $fetch<{ user: Record<string, unknown> }>(backendUrl(event, '/api/v1/auth/session'), {
      headers: { Authorization: `Bearer ${token}` },
    })
    return { authenticated: true, user: response.user }
  } catch {
    deleteCookie(event, SESSION_COOKIE, { path: '/' })
    return { authenticated: false, user: null }
  }
})
