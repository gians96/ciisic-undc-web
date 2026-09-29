// ============================================================================
// FORMATO DE MONTOS, FECHAS Y ENLACES (funciones puras)
// ============================================================================

const ZONA_LIMA = 'America/Lima'
const FECHA_ISO = /^(\d{4})-(\d{2})-(\d{2})$/

/** `120` → `S/ 120.00`. */
export function formatearSoles(monto: number | string | null | undefined): string {
  const valor = Number(monto)
  return `S/ ${(Number.isFinite(valor) ? valor : 0).toFixed(2)}`
}

/**
 * Fecha sin hora (`YYYY-MM-DD`) en texto largo, sin pasar por UTC:
 * `2026-09-29` → `29 de septiembre de 2026` (nunca "28 de septiembre" por zona horaria).
 */
export function formatearFechaSoloDia(fecha: string | null | undefined): string {
  const partes = FECHA_ISO.exec(String(fecha ?? '').trim())
  if (!partes) return fecha ? String(fecha) : ''
  const [, anio, mes, dia] = partes
  const instante = new Date(Date.UTC(Number(anio), Number(mes) - 1, Number(dia), 12))
  return new Intl.DateTimeFormat('es-PE', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }).format(instante)
}

/** Instante ISO en fecha y hora de Lima: `29 de septiembre de 2026, 10:04 a. m.`. */
export function formatearFechaHoraLima(instante: string | null | undefined): string {
  if (!instante) return ''
  const fecha = new Date(instante)
  if (Number.isNaN(fecha.getTime())) return String(instante)
  return new Intl.DateTimeFormat('es-PE', {
    timeZone: ZONA_LIMA, day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(fecha)
}

/** Enlace de WhatsApp para un teléfono peruano (`+51 949 026 908` → `https://wa.me/51949026908`). */
export function enlaceWhatsApp(telefono: string | null | undefined): string {
  const digitos = String(telefono ?? '').replace(/\D/g, '')
  if (!digitos) return ''
  const conPais = digitos.length === 9 && digitos.startsWith('9') ? `51${digitos}` : digitos
  return `https://wa.me/${conPais}`
}

/** Solo acepta rutas relativas al sitio (`/images/…`) o URLs http(s); cualquier otra cosa → `''`. */
export function urlSegura(url: string | null | undefined): string {
  const valor = String(url ?? '').trim()
  if (/^\/(?!\/)/.test(valor)) return valor
  try {
    const parsed = new URL(valor)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : ''
  } catch {
    return ''
  }
}
