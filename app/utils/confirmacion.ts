// ============================================================================
// CONFIRMACIÓN DE LA INSCRIPCIÓN: PRÓXIMOS PASOS SEGÚN LA MODALIDAD DE ASISTENCIA
// ============================================================================
import { aModalidad } from './planes'

/**
 * Próximos pasos que ve el participante al inscribirse. Los textos de la modalidad virtual son
 * neutros a propósito: sin enlaces, sin carnet físico y sin promesas de horas ni de certificado
 * (la organización aún no define la entrega del acceso, la asistencia ni los certificados).
 * Modalidad ausente, `null` o desconocida (backend anterior) = presencial, los pasos de siempre.
 */
export function proximosPasos(modalidad: unknown): string[] {
  if (aModalidad(modalidad) === 'VIRTUAL') {
    return [
      '📧 Recibirás un email de confirmación en los próximos minutos',
      '🔍 Nuestro equipo verificará tu voucher de pago',
      '💻 Una vez aprobado, la organización te compartirá las indicaciones para conectarte a la transmisión del congreso',
      '📅 Te notificaremos sobre el cronograma de actividades',
    ]
  }
  return [
    '📧 Recibirás un email de confirmación en los próximos minutos',
    '🔍 Nuestro equipo verificará tu voucher de pago',
    '✅ Una vez aprobado, recibirás tu credencial en PDF y el enlace a tu credencial digital 3D',
    '📅 Te notificaremos sobre el cronograma de actividades',
  ]
}
