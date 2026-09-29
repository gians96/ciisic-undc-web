// ============================================================================
// PLANES DE INSCRIPCIÓN: API → TARJETAS Y REGLA DE PRECIO (funciones puras)
// ============================================================================
import type { CaracteristicaPlan, CategoriaInscripcionApi, TipoInscripcionApi } from '../types/evento'

/** Forma de la tarjeta de plan que usan /estudiantes y /general. */
export interface PlanInscripcion {
  id: number
  codigo: string
  title: string
  badge: string
  basePrice: number
  institutionalPrice: number
  description: string
  features: CaracteristicaPlan[]
  categoria: string
  esEstudiantil: boolean
}

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase()

/** `ESTUDIANTES` + `CON KIT` → `ESTUDIANTES CON KIT`; no repite la etiqueta si el nombre ya la trae. */
export function tituloPlan(nombre: string | null | undefined, etiqueta?: string | null): string {
  const base = String(nombre ?? '').trim()
  const extra = String(etiqueta ?? '').trim()
  if (!extra) return base
  if (!base) return extra
  return normalizar(base).includes(normalizar(extra)) ? base : `${base} ${extra}`
}

const aMonto = (valor: unknown): number | null => {
  if (valor === null || valor === undefined || valor === '') return null
  const numero = Number(valor)
  return Number.isFinite(numero) && numero >= 0 ? numero : null
}

const caracteristicasValidas = (lista: unknown): CaracteristicaPlan[] =>
  Array.isArray(lista)
    ? lista
        .filter((item): item is CaracteristicaPlan => Boolean(item) && typeof item.icon === 'string' && typeof item.text === 'string' && item.text.trim() !== '')
        .map(item => ({ icon: item.icon.trim() || 'heroicons:check', text: item.text.trim() }))
    : []

function aPlan(tipo: TipoInscripcionApi, categoria: CategoriaInscripcionApi): PlanInscripcion | null {
  const id = Number(tipo?.id)
  const precio = aMonto(tipo?.precio)
  if (!Number.isInteger(id) || id < 1 || precio === null) return null
  const institucional = aMonto(tipo.precioInstitucional)
  return {
    id,
    codigo: String(tipo.codigo ?? ''),
    title: tituloPlan(tipo.nombre, tipo.etiqueta),
    badge: String(tipo.etiqueta ?? '').trim(),
    basePrice: precio,
    // Sin precio institucional se muestra el regular
    institutionalPrice: institucional ?? precio,
    description: String(tipo.descripcion ?? '').trim(),
    features: caracteristicasValidas(tipo.caracteristicas),
    categoria: categoria.codigo,
    esEstudiantil: categoria.esEstudiantil === true,
  }
}

/** Aplana las categorías (ya ordenadas por el backend) en tarjetas de plan. */
export function mapearPlanes(categorias: CategoriaInscripcionApi[] | null | undefined): PlanInscripcion[] {
  if (!Array.isArray(categorias)) return []
  return categorias.flatMap(categoria =>
    (Array.isArray(categoria?.tipos) ? categoria.tipos : [])
      .map(tipo => aPlan(tipo, categoria))
      .filter((plan): plan is PlanInscripcion => plan !== null),
  )
}

/**
 * Réplica informativa de `calcularPrecio` del backend (spec 002 FR-005):
 * categoría estudiantil → precio institucional solo con estudiante UNDC verificado;
 * categoría general → precio institucional si el correo es del dominio institucional.
 */
export function aplicaPrecioInstitucional(entrada: { esEstudiantil: boolean; esEstudianteUndc: boolean; correoInstitucional: boolean }): boolean {
  return entrada.esEstudiantil ? entrada.esEstudianteUndc === true : entrada.correoInstitucional === true
}

export function precioPlan(plan: Pick<PlanInscripcion, 'basePrice' | 'institutionalPrice'>, institucional: boolean): number {
  return institucional ? plan.institutionalPrice : plan.basePrice
}

/** `ana@undc.edu.pe` pertenece a `undc.edu.pe` (sin subdominios ni mayúsculas). */
export function esCorreoDelDominio(correo: string | null | undefined, dominio: string | null | undefined): boolean {
  const partes = String(correo ?? '').trim().toLowerCase().split('@')
  const esperado = String(dominio ?? '').trim().toLowerCase()
  return Boolean(esperado) && partes.length === 2 && Boolean(partes[0]) && partes[1] === esperado
}
