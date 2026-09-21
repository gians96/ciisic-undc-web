import { SESSION_COOKIE } from '../../utils/backend'

export default defineEventHandler((event) => {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
  return { success: true }
})
