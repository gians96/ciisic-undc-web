// ============================================================================
// CONFIRMACIÓN DE LA INSCRIPCIÓN: PRÓXIMOS PASOS SEGÚN LA MODALIDAD DE ASISTENCIA
// ============================================================================
import { aModalidad } from './planes'

/**
 * Próximos pasos que ve el participante al inscribirse. El correo llega **después** de la
 * revisión del voucher (no «en los próximos minutos»): por eso el paso de aprobación va tras la
 * verificación. Los textos de la modalidad virtual son neutros a propósito: sin enlaces, sin
 * carnet físico, sin credencial y sin promesas de horas ni de certificado (la organización aún
 * no define la entrega del acceso, la asistencia ni los certificados).
 * Modalidad ausente, `null` o desconocida (backend anterior) = presencial, los pasos de siempre.
 */
export function proximosPasos(modalidad: unknown): string[] {
  if (aModalidad(modalidad) === 'VIRTUAL') {
    return [
      '🔍 Nuestro equipo verificará tu voucher de pago',
      '📧 Te avisaremos por correo cuando tu inscripción sea aprobada',
      '💻 La organización te compartirá las indicaciones para conectarte a la transmisión del congreso',
      '📅 Te notificaremos sobre el cronograma de actividades',
    ]
  }
  return [
    '🔍 Nuestro equipo verificará tu voucher de pago',
    '📧 Al aprobarla recibirás el correo con tu credencial digital y su enlace',
    '📅 Te notificaremos sobre el cronograma de actividades',
  ]
}
