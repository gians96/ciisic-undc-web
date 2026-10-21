// ============================================================================
// LISTA PEGADA DE INTEGRANTES (Excel o texto): una persona por línea, con coma, punto y coma o tabulador
// Formatos: `DNI, Nombres, Apellidos, Correo, Celular` · `DNI, Nombres, Apellidos, Correo` · `DNI, Nombres completos, Correo`
// ============================================================================
import { normalizarDni } from './delegaciones'

export interface FilaLista {
  tipoDocumento: 'dni' | 'ce'
  numeroDocumento: string
  nombres: string
  apellidos: string
  correo: string
  celular: string
}

export interface ResultadoLista {
  filas: FilaLista[]
  errores: string[]
}

const SEPARADOR = /\s*[,;\t]\s*/
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CELULAR = /^\+?\d{9,15}$/

/** Reparte un nombre completo en nombres y apellidos (la última palabra es el apellido). */
function partirNombre(completo: string): { nombres: string, apellidos: string } {
  const partes = completo.trim().split(/\s+/).filter(Boolean)
  if (partes.length < 2) return { nombres: completo.trim(), apellidos: '' }
  return { nombres: partes.slice(0, -1).join(' '), apellidos: partes[partes.length - 1] ?? '' }
}

const esEncabezado = (campos: string[]) => /^(dni|documento|doc|numero|número|nro\.?)$/i.test((campos[0] ?? '').trim())

/** Lee la lista pegada; los errores llevan el número de línea para poder corregir el texto. */
export function parsearListaIntegrantes(texto: string): ResultadoLista {
  const lineas = texto.split(/\r?\n/).map(linea => linea.trim()).filter(Boolean)
  const filas: FilaLista[] = []
  const errores: string[] = []

  lineas.forEach((linea, indice) => {
    const campos = linea.split(SEPARADOR).map(campo => campo.trim())
    if (indice === 0 && esEncabezado(campos)) return
    const numeroLinea = indice + 1
    if (campos.length < 3 || campos.length > 5) {
      errores.push(`Línea ${numeroLinea}: usa 3, 4 o 5 columnas separadas por coma.`)
      return
    }
    const [leido, primero, segundo, tercero, cuarto] = campos
    const numeroDocumento = normalizarDni(leido ?? '')
    let nombres = primero ?? ''
    let apellidos: string
    let correo: string
    let celular = ''
    if (campos.length === 3) {
      const partes = partirNombre(primero ?? '')
      nombres = partes.nombres
      apellidos = partes.apellidos
      correo = segundo ?? ''
    } else if (campos.length === 4) {
      apellidos = segundo ?? ''
      correo = tercero ?? ''
    } else {
      apellidos = segundo ?? ''
      correo = tercero ?? ''
      celular = cuarto ?? ''
    }

    const faltas: string[] = []
    if (!numeroDocumento) faltas.push(`Línea ${numeroLinea}: falta el documento.`)
    if (!nombres.trim()) faltas.push(`Línea ${numeroLinea}: falta el nombre.`)
    if (!apellidos.trim()) faltas.push(`Línea ${numeroLinea}: faltan los apellidos (puedes escribir el nombre completo en una sola columna).`)
    if (!CORREO.test(correo)) faltas.push(`Línea ${numeroLinea}: el correo «${correo}» no es válido.`)
    if (celular && !CELULAR.test(celular)) faltas.push(`Línea ${numeroLinea}: el celular «${celular}» no es válido.`)
    if (faltas.length) {
      errores.push(...faltas)
      return
    }
    filas.push({
      tipoDocumento: /^\d{8}$/.test(numeroDocumento) ? 'dni' : 'ce',
      numeroDocumento,
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      correo: correo.toLowerCase(),
      celular,
    })
  })
  return { filas, errores }
}
