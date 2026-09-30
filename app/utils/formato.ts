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

/** Nombre de un QR subido en el panel (lo genera backend-ciisic). */
const ARCHIVO_QR = /^qr-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp)$/

/** Imagen del QR de una billetera: la subida en el panel (servida por el BFF) o la URL configurada. */
export function urlQrBilletera(billetera?: { qrArchivo?: string | null, qrUrl?: string | null } | null): string {
  const archivo = billetera?.qrArchivo?.trim() ?? ''
  if (ARCHIVO_QR.test(archivo)) return `/api/publico/qr/${archivo}`
  return urlSegura(billetera?.qrUrl)
}

/** Nombre visible de los aplicativos conocidos, por su código en los datos de pago. */
const APLICATIVOS: Readonly<Record<string, string>> = { yape: 'Yape', plin: 'Plin', tunki: 'Tunki', bim: 'BIM', agora: 'Agora' }

const sinTildes = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

interface BilleteraVisible {
  codigo?: string | null
  nombre?: string | null
}

/**
 * Nombre del medio de pago que ve el visitante. En el panel, «Nombre» a veces guarda el del
 * titular (p. ej. el de la persona dueña del Yape): si el código es un aplicativo conocido y el
 * nombre no lo menciona, se muestra el aplicativo.
 */
export function nombreBilletera(billetera?: BilleteraVisible | null): string {
  const codigo = String(billetera?.codigo ?? '').trim()
  const nombre = String(billetera?.nombre ?? '').trim()
  const aplicativo = APLICATIVOS[codigo.toLowerCase()]
  if (aplicativo && !sinTildes(nombre).includes(sinTildes(aplicativo))) return aplicativo
  return nombre || codigo.charAt(0).toUpperCase() + codigo.slice(1)
}

/** Titular de la billetera: su «Nombre» cuando es el de una persona; si no, el titular general. */
export function titularBilletera(billetera: BilleteraVisible | null | undefined, titularGeneral: string): string {
  const nombre = String(billetera?.nombre ?? '').trim()
  return nombre && nombreBilletera(billetera) !== nombre ? nombre : titularGeneral
}

/** Nombre sugerido al descargar el QR (misma extensión que la imagen). */
export function nombreDescargaQr(codigo: string | null | undefined, url: string): string {
  const extension = /\.(png|jpe?g|webp)(?:[?#].*)?$/i.exec(url)?.[1]?.toLowerCase() ?? 'png'
  const base = String(codigo ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '') || 'billetera'
  return `qr-${base}.${extension === 'jpeg' ? 'jpg' : extension}`
}
