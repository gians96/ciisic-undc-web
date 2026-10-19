// ============================================================================
// PLANES DE INSCRIPCIÓN: API → TARJETAS Y REGLA DE PRECIO (funciones puras)
// ============================================================================
import type { CaracteristicaPlan, CategoriaInscripcionApi, DisponiblePara, ModalidadAsistencia, TipoInscripcionApi } from '../types/evento'

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
  disponiblePara: DisponiblePara
  /** Modalidad de asistencia del tipo (spec 018 del backend); sin el dato (backend anterior) es `PRESENCIAL`. */
  modalidad: ModalidadAsistencia
}

const DISPONIBILIDADES: readonly DisponiblePara[] = ['TODOS', 'INSTITUCIONAL', 'EXTERNOS']

/** Valor desconocido o ausente (backend anterior) → `TODOS`, el comportamiento de siempre. */
const aDisponibilidad = (valor: unknown): DisponiblePara =>
  DISPONIBILIDADES.includes(valor as DisponiblePara) ? valor as DisponiblePara : 'TODOS'

/** Orden de presentación: lo presencial primero y luego lo virtual. */
const MODALIDADES: readonly ModalidadAsistencia[] = ['PRESENCIAL', 'VIRTUAL']

/**
 * Valor ausente, `null` (p. ej. cortesía sin tipo) o desconocido (backend anterior) → `PRESENCIAL`,
 * el comportamiento de siempre. Es la modalidad de asistencia, no la de pago.
 */
export const aModalidad = (valor: unknown): ModalidadAsistencia =>
  MODALIDADES.includes(valor as ModalidadAsistencia) ? valor as ModalidadAsistencia : 'PRESENCIAL'

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
    disponiblePara: aDisponibilidad(tipo.disponiblePara),
    modalidad: aModalidad(tipo.modalidad),
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

/**
 * Réplica de `tipoDisponible` del backend (spec 016): con la misma condición del precio
 * institucional, un plan «solo comunidad UNDC» o «solo externos» se oculta a quien no corresponde.
 * El backend igual rechaza la inscripción (`REGISTRATION_TYPE_NOT_AVAILABLE`).
 */
export function planDisponible(plan: Pick<PlanInscripcion, 'disponiblePara'>, institucional: boolean): boolean {
  if (plan.disponiblePara === 'INSTITUCIONAL') return institucional
  if (plan.disponiblePara === 'EXTERNOS') return !institucional
  return true
}

/**
 * Si el plan elegido dejó de ofrecerse (planes recargados o cambió la condición UNDC) se limpia la
 * selección, salvo mientras una verificación está en curso: su resultado puede volver a mostrarlo.
 */
export function debeLimpiarPlan(entrada: { planId: number | null; disponibles: readonly number[]; verificando: boolean }): boolean {
  return entrada.planId !== null && !entrada.verificando && !entrada.disponibles.includes(entrada.planId)
}

/** Por qué no se ven todos los planes (los ocultos son de una sola categoría por página). */
export function avisoPlanesOcultos(entrada: {
  ocultos: readonly Pick<PlanInscripcion, 'disponiblePara' | 'esEstudiantil'>[]
  dominio: string
}): string | null {
  const [oculto] = entrada.ocultos
  if (!oculto) return null
  if (oculto.disponiblePara === 'EXTERNOS') {
    return oculto.esEstudiantil
      ? 'Como estudiante UNDC verificado, solo se muestran los planes para la comunidad UNDC.'
      : `Con un correo @${entrada.dominio} solo se muestran los planes para la comunidad UNDC.`
  }
  return oculto.esEstudiantil
    ? `Hay planes solo para estudiantes UNDC verificados: usa tu correo @${entrada.dominio} para verificarte.`
    : `Hay planes solo para la comunidad UNDC: aparecen al escribir un correo @${entrada.dominio}.`
}

/** `ana@undc.edu.pe` pertenece a `undc.edu.pe` (sin subdominios ni mayúsculas). */
export function esCorreoDelDominio(correo: string | null | undefined, dominio: string | null | undefined): boolean {
  const partes = String(correo ?? '').trim().toLowerCase().split('@')
  const esperado = String(dominio ?? '').trim().toLowerCase()
  return Boolean(esperado) && partes.length === 2 && Boolean(partes[0]) && partes[1] === esperado
}

// ============================================================================
// MODALIDAD DE ASISTENCIA (spec 005): presencial o virtual, un atributo del tipo
// ============================================================================

/** Encabezados de los grupos cuando se ofrecen las dos modalidades a la vez. */
const TITULOS_MODALIDAD: Record<ModalidadAsistencia, string> = {
  PRESENCIAL: 'Presencial',
  VIRTUAL: 'Virtual (en línea)',
}

/** Planes de una modalidad; `titulo` solo existe si hay más de una modalidad que distinguir. */
export interface GrupoPlanes<T> {
  modalidad: ModalidadAsistencia
  titulo: string | null
  planes: T[]
}

/**
 * Agrupa los planes visibles por modalidad: «Presencial» primero y luego «Virtual (en línea)», cada
 * grupo en el orden en que los entrega el backend. Con una sola modalidad (hoy, mientras no existan
 * tipos virtuales) devuelve un único grupo sin encabezado, de modo que no cambia nada visible.
 */
export function agruparPlanesPorModalidad<T extends Pick<PlanInscripcion, 'modalidad'>>(planes: readonly T[]): GrupoPlanes<T>[] {
  const grupos = MODALIDADES
    .map(modalidad => ({ modalidad, planes: planes.filter(plan => aModalidad(plan.modalidad) === modalidad) }))
    .filter(grupo => grupo.planes.length > 0)
  const conEncabezado = grupos.length > 1
  return grupos.map(grupo => ({ ...grupo, titulo: conEncabezado ? TITULOS_MODALIDAD[grupo.modalidad] : null }))
}

type ConModalidad = Pick<PlanInscripcion, 'modalidad'>

export const hayPlanesVirtuales = (planes: readonly ConModalidad[]): boolean =>
  planes.some(plan => aModalidad(plan.modalidad) === 'VIRTUAL')

/** El kit (y su modal) solo tiene sentido si hay algún plan presencial a la vista. */
export const hayPlanesPresenciales = (planes: readonly ConModalidad[]): boolean =>
  planes.some(plan => aModalidad(plan.modalidad) === 'PRESENCIAL')

/**
 * Precio regular más bajo entre los planes virtuales («desde S/ X»), o `null` si no hay ninguno.
 * El monto sale siempre de la API: ningún texto lo escribe a mano.
 */
export function precioDesdeVirtual(planes: readonly (ConModalidad & Pick<PlanInscripcion, 'basePrice'>)[]): number | null {
  const precios = planes.filter(plan => aModalidad(plan.modalidad) === 'VIRTUAL').map(plan => plan.basePrice)
  return precios.length ? Math.min(...precios) : null
}

/** Categorías (sin repetir, en el orden recibido) que ofrecen al menos un plan virtual. */
export const categoriasConPlanesVirtuales = (planes: readonly (ConModalidad & Pick<PlanInscripcion, 'categoria'>)[]): string[] =>
  [...new Set(planes.filter(plan => aModalidad(plan.modalidad) === 'VIRTUAL').map(plan => plan.categoria))]

/**
 * Resumen de la oferta virtual para `/planes` («También puedes participar de forma virtual, desde
 * S/ X»): precio mínimo y categorías donde se ofrece, o `null` si no hay ningún plan virtual.
 */
export function resumirOfertaVirtual(
  planes: readonly (ConModalidad & Pick<PlanInscripcion, 'basePrice' | 'categoria'>)[],
): { desde: number; categorias: string[] } | null {
  const desde = precioDesdeVirtual(planes)
  return desde === null ? null : { desde, categorias: categoriasConPlanesVirtuales(planes) }
}

/**
 * ¿Algún plan visible cuesta menos para la comunidad UNDC? Solo entonces tiene sentido avisar
 * «Se aplicará descuento UNDC» (los planes virtuales tienen el mismo precio para todos).
 */
export const hayDescuentoInstitucional = (planes: readonly Pick<PlanInscripcion, 'basePrice' | 'institutionalPrice'>[]): boolean =>
  planes.some(plan => plan.institutionalPrice < plan.basePrice)

/** `VIRTUAL` usa el estilo de éxito; en lo presencial se conserva la regla de siempre («SIN KIT» → advertencia). */
export function claseBadgePlan(plan: Pick<PlanInscripcion, 'badge' | 'modalidad'>): 'badge-success' | 'badge-warning' {
  if (aModalidad(plan.modalidad) === 'VIRTUAL') return 'badge-success'
  return plan.badge.includes('SIN') ? 'badge-warning' : 'badge-success'
}
