// ============================================================================
// OFERTA VIRTUAL EN /planes (spec 005): ¿hay planes VIRTUAL y desde cuánto?
// ============================================================================
import { resumirOfertaVirtual } from '~/utils/planes'

/** Categorías que pueden tener planes virtuales y la página donde se inscribe cada una. */
const PAGINAS_CON_VIRTUAL = [
  { categoria: 'ESTUDIANTES', ruta: '/estudiantes', texto: 'Estudiantes' },
  { categoria: 'PUBLICO_GENERAL', ruta: '/general', texto: 'Profesionales y público general' },
] as const

/**
 * Lee de la API los planes de ESTUDIANTES y PUBLICO_GENERAL (mismas claves que los formularios, así
 * que no se piden dos veces) y resume la oferta virtual. Si una carga falla, esa categoría no suma:
 * sin planes virtuales `oferta` es `null` y la página no muestra nada.
 */
export const useOfertaVirtual = () => {
  const estudiantes = usePlanes('ESTUDIANTES')
  const general = usePlanes('PUBLICO_GENERAL')

  const oferta = computed(() => {
    const resumen = resumirOfertaVirtual([...estudiantes.planes.value, ...general.planes.value])
    if (!resumen) return null
    return {
      desde: resumen.desde,
      enlaces: PAGINAS_CON_VIRTUAL.filter(pagina => resumen.categorias.includes(pagina.categoria)),
      // Spec 020 del backend: los estudiantes de la UNDC asisten de forma presencial
      sinEstudiantesUndc: resumen.sinEstudiantesUndc === true,
    }
  })

  return { oferta }
}
