// ============================================================================
// ESTADO DE LAS INSCRIPCIONES (según la API del evento: GET /api/publico/evento)
// ============================================================================
import { estadoInscripciones, type EstadoInscripciones } from '~/utils/inscripciones'

/**
 * Estado de las inscripciones calculado con lo que informa la API (`useEvento`, el mismo evento
 * que ya usan las páginas de inscripción: se comparte por clave y Nitro lo cachea 60 s).
 * Es `null` mientras el evento no carga o si falla: ahí no se afirma nada y se muestran los botones
 * de inscripción de siempre.
 */
export const useEstadoInscripciones = () => {
  const { evento } = useEvento()

  // Un solo «ahora» por petición: el servidor y la hidratación comparan con la misma hora.
  const ahora = useState<number>('inscripciones-ahora', () => Date.now())

  const estado = computed<EstadoInscripciones | null>(() =>
    evento.value ? estadoInscripciones(evento.value, ahora.value) : null,
  )

  return {
    estado,
    /** La ventana de inscripciones terminó: los textos dicen «finalizadas» en vez de «cerradas». */
    finalizadas: computed(() => estado.value === 'finalizadas'),
  }
}
