// ============================================================================
// PREGUNTAS FRECUENTES: RESPUESTAS QUE DEPENDEN DE LOS DATOS (funciones puras)
// ============================================================================

/** Respuesta de siempre a «¿Habrá modalidad virtual?» (sin planes virtuales en la API). */
const RESPUESTA_SIN_PLAN_VIRTUAL
  = 'El congreso es presencial, pero las conferencias magistrales principales serán transmitidas en vivo y quedarán disponibles en nuestra plataforma virtual para los participantes registrados. Los talleres prácticos y sesiones de networking son exclusivamente presenciales.'

/**
 * Texto neutro (spec 005): sin montos, enlaces, horas ni certificado; la organización aún no define cómo se
 * entrega el acceso a la transmisión. No repite «quedarán disponibles en la plataforma» para no prometer
 * contenido grabado a quien se inscribe en la modalidad virtual.
 */
const RESPUESTA_CON_PLAN_VIRTUAL
  = 'Sí. Además de la asistencia presencial, existe la inscripción virtual: al inscribirte, elige el plan Virtual. La organización te compartirá las indicaciones para conectarte a la transmisión del congreso. Los talleres prácticos y sesiones de networking son exclusivamente presenciales.'

/** Spec 020 del backend: la inscripción virtual no admite estudiantes UNDC (la API lo marca en el plan). */
const AVISO_ESTUDIANTES_UNDC = 'Los estudiantes de la UNDC se inscriben en modalidad presencial.'

/**
 * Respuesta a «¿Habrá modalidad virtual?». Solo anuncia el plan Virtual si la API devuelve planes
 * virtuales; sin ellos (datos aún no cargados, backend anterior o fallo de carga) conserva el texto anterior,
 * para que la FAQ no contradiga a `/estudiantes`, `/general` ni `/planes`.
 */
export const respuestaModalidadVirtual = (hayPlanesVirtuales: boolean, sinEstudiantesUndc = false): string =>
  hayPlanesVirtuales ? (sinEstudiantesUndc ? `${RESPUESTA_CON_PLAN_VIRTUAL} ${AVISO_ESTUDIANTES_UNDC}` : RESPUESTA_CON_PLAN_VIRTUAL) : RESPUESTA_SIN_PLAN_VIRTUAL
