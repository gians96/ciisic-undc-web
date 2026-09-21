import { backendUrl, SESSION_COOKIE, sessionCookieOptions } from '../../utils/backend'

interface LoginResponse { jwt: string }

export default defineEventHandler(async (event) => {
  const body = await readBody<{ correoElectronico?: string; contrasena?: string }>(event)
  if (!body?.correoElectronico || !body?.contrasena) {
    throw createError({ statusCode: 400, statusMessage: 'Correo y contraseña son obligatorios' })
  }

  try {
    const response = await $fetch<LoginResponse>(backendUrl(event, '/api/v1/auth/login'), {
      method: 'POST',
      body: { correoElectronico: body.correoElectronico, contrasena: body.contrasena },
    })
    setCookie(event, SESSION_COOKIE, response.jwt, sessionCookieOptions())
    return { success: true }
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode === 429 ? 429 : 401,
      statusMessage: error?.statusCode === 429 ? 'Demasiados intentos. Intente más tarde.' : 'Credenciales incorrectas',
    })
  }
})
