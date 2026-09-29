// ============================================================================
// INSCRIPCIÓN: FORMULARIO → CONTRATO Y MULTIPART (funciones puras)
// Contrato: POST /api/v1/public/events/:codigo/inscriptions (backend-ciisic spec 002)
// ============================================================================
import type { DatosInscripcion, FormularioInscripcion } from '../types/inscription'

/** Nombre del campo de archivo que espera el backend (`upload.single('voucher')`). */
export const CAMPO_VOUCHER = 'voucher'

export const VOUCHER_MAX_BYTES = 5 * 1024 * 1024
const VOUCHER_TIPOS = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
const VOUCHER_EXTENSIONES = /\.(pdf|jpe?g|png|webp)$/i
export const VOUCHER_ACCEPT = 'application/pdf,image/jpeg,image/png,image/webp,.pdf,.jpg,.jpeg,.png,.webp'

const FECHA_ISO = /^(\d{4})-(\d{2})-(\d{2})$/
const formatoFechaLima = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' })

const dosDigitos = (valor: number) => String(valor).padStart(2, '0')
const espacios = (texto: string) => String(texto ?? '').replace(/\s+/g, ' ').trim()

/** Celular peruano: 9 dígitos que empiezan con 9. */
export function esCelularValido(celular: string | null | undefined): boolean {
  return /^9\d{8}$/.test(String(celular ?? '').trim())
}

/** Hoy (`YYYY-MM-DD`) en hora de Lima, igual que el backend al validar que el pago no sea futuro. */
export function fechaHoyLima(ahora: Date = new Date()): string {
  return formatoFechaLima.format(ahora)
}

/**
 * Normaliza la fecha de pago a `YYYY-MM-DD` sin conversión UTC: el valor de un
 * `<input type="date">` se valida y se devuelve tal cual; un `Date` usa sus componentes locales.
 */
export function normalizarFechaPago(valor: string | Date | null | undefined): string {
  if (valor instanceof Date) {
    if (Number.isNaN(valor.getTime())) throw new Error('Fecha de pago inválida')
    return `${valor.getFullYear()}-${dosDigitos(valor.getMonth() + 1)}-${dosDigitos(valor.getDate())}`
  }
  const texto = String(valor ?? '').trim()
  const partes = FECHA_ISO.exec(texto)
  if (!partes) throw new Error('Fecha de pago inválida')
  const [anio, mes, dia] = [Number(partes[1]), Number(partes[2]), Number(partes[3])]
  const calendario = new Date(Date.UTC(anio, mes - 1, dia))
  if (calendario.getUTCFullYear() !== anio || calendario.getUTCMonth() !== mes - 1 || calendario.getUTCDate() !== dia) {
    throw new Error('Fecha de pago inválida')
  }
  return texto
}

/** Mensaje de error del voucher o `''` si es válido (PDF/JPG/PNG/WebP de hasta 5 MB). */
export function validarArchivoVoucher(archivo: Pick<File, 'name' | 'size' | 'type'> | null | undefined): string {
  if (!archivo) return 'Adjunta el voucher de pago.'
  const tipoValido = archivo.type ? VOUCHER_TIPOS.has(archivo.type) : true
  if (!tipoValido || !VOUCHER_EXTENSIONES.test(archivo.name)) return 'Solo se permiten archivos PDF, JPG, PNG o WebP.'
  if (!archivo.size) return 'El archivo del voucher está vacío.'
  if (archivo.size > VOUCHER_MAX_BYTES) return 'El voucher no debe superar los 5 MB.'
  return ''
}

const enteroPositivo = (valor: unknown): number | null => {
  if (valor === null || valor === undefined || valor === '') return null
  const numero = Number(valor)
  return Number.isInteger(numero) && numero > 0 ? numero : null
}

/** Valores del formulario → datos del contrato (sin montos, descuentos ni estados). */
export function mapearFormularioInscripcion(form: FormularioInscripcion): DatosInscripcion {
  const tipoInscripcionId = enteroPositivo(form.planId)
  if (!tipoInscripcionId) throw new Error('Debe seleccionar un plan de inscripción')
  if (!form.archivoVoucher) throw new Error('Adjunta el voucher de pago')

  const tipoDocumento = form.documentType === 'CE' ? 'ce' : 'dni'
  const modalidadPago = form.modalidadDeposito === 'billetera' ? 'billetera' : 'banco'

  return {
    participante: {
      tipoDocumento,
      numeroDocumento: String(form.documentNumber ?? '').trim().toUpperCase(),
      nombres: espacios(form.nombres),
      apellidos: espacios(form.apellidos),
      correo: String(form.email ?? '').trim().toLowerCase(),
      celular: String(form.celular ?? '').replace(/\D/g, ''),
    },
    tipoInscripcionId,
    clasificacionId: enteroPositivo(form.clasificacion),
    modalidadPago,
    banco: modalidadPago === 'banco' ? form.bancoSeleccionado || null : null,
    tipoOperacion: modalidadPago === 'banco' ? form.tipoPago || null : null,
    billeteraDigital: modalidadPago === 'billetera' ? form.aplicativo || null : null,
    numeroOperacion: String(form.codigoVoucher ?? '').trim(),
    fechaPago: normalizarFechaPago(form.fechaPago),
    verificacionToken: form.verificacionToken || null,
    voucher: form.archivoVoucher,
  }
}

/** Cuerpo `multipart/form-data` con exactamente los campos del contrato (archivo en `voucher`). */
export function construirFormDataInscripcion(datos: DatosInscripcion): FormData {
  const cuerpo = new FormData()
  const { tipoDocumento, numeroDocumento, nombres, apellidos, correo, celular } = datos.participante
  cuerpo.append('participante', JSON.stringify({ tipoDocumento, numeroDocumento, nombres, apellidos, correo, celular }))
  cuerpo.append('tipoInscripcionId', String(datos.tipoInscripcionId))
  if (datos.clasificacionId) cuerpo.append('clasificacionId', String(datos.clasificacionId))
  cuerpo.append('modalidadPago', datos.modalidadPago)
  if (datos.modalidadPago === 'banco') {
    if (datos.banco) cuerpo.append('banco', datos.banco)
    if (datos.tipoOperacion) cuerpo.append('tipoOperacion', datos.tipoOperacion)
  } else if (datos.billeteraDigital) {
    cuerpo.append('billeteraDigital', datos.billeteraDigital)
  }
  cuerpo.append('numeroOperacion', datos.numeroOperacion)
  cuerpo.append('fechaPago', datos.fechaPago)
  if (datos.verificacionToken) cuerpo.append('verificacionToken', datos.verificacionToken)
  const nombreArchivo = 'name' in datos.voucher && datos.voucher.name ? datos.voucher.name : 'voucher'
  cuerpo.append(CAMPO_VOUCHER, datos.voucher, nombreArchivo)
  return cuerpo
}
