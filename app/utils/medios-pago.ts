// ============================================================================
// MEDIOS DE PAGO DEL FORMULARIO (lógica pura, con pruebas en tests/medios-pago.test.ts)
// ============================================================================
import type { BilleteraDigital, CuentaBancaria } from '~/types/evento'
import type { ModalidadPago } from '~/types/inscription'

/** Grupos de medios de pago, con los mismos nombres que el panel (Eventos → Datos de pago). */
export const ETIQUETAS_MODALIDAD: Readonly<Record<ModalidadPago, string>> = {
  billetera: 'Billeteras digitales',
  banco: 'Cuentas bancarias',
}

export interface OpcionModalidad {
  valor: ModalidadPago
  etiqueta: string
}

/** Modalidades que tienen al menos un medio; primero las billeteras digitales, que son las más usadas. */
export function modalidadesDisponibles(bancos: readonly CuentaBancaria[], billeteras: readonly BilleteraDigital[]): OpcionModalidad[] {
  const modalidades: ModalidadPago[] = []
  if (billeteras.length) modalidades.push('billetera')
  if (bancos.length) modalidades.push('banco')
  return modalidades.map(valor => ({ valor, etiqueta: ETIQUETAS_MODALIDAD[valor] }))
}

/** Lo que eligió el visitante (cada grupo recuerda su medio al cambiar de modalidad). */
export interface EleccionPago {
  modalidad: ModalidadPago | null
  banco: string | null
  billetera: string | null
}

export interface MedioPagoVigente {
  /** `null` solo cuando el evento no tiene medios de pago. */
  modalidad: ModalidadPago | null
  /** Solo cuando la modalidad es `banco`. */
  banco: CuentaBancaria | null
  /** Solo cuando la modalidad es `billetera`. */
  billetera: BilleteraDigital | null
}

/**
 * Medio de pago vigente: lo elegido si sigue disponible; si no, la primera billetera digital
 * (la opción por defecto) y, cuando el evento no tiene billeteras, la primera cuenta bancaria.
 */
export function resolverMedioPago(
  bancos: readonly CuentaBancaria[],
  billeteras: readonly BilleteraDigital[],
  eleccion: EleccionPago,
): MedioPagoVigente {
  const banco = bancos.find(cuenta => cuenta.codigo === eleccion.banco) ?? bancos[0] ?? null
  const billetera = billeteras.find(medio => medio.codigo === eleccion.billetera) ?? billeteras[0] ?? null

  let modalidad: ModalidadPago | null = null
  if (eleccion.modalidad === 'banco' && banco) modalidad = 'banco'
  else if (eleccion.modalidad === 'billetera' && billetera) modalidad = 'billetera'
  else if (billetera) modalidad = 'billetera'
  else if (banco) modalidad = 'banco'

  return {
    modalidad,
    banco: modalidad === 'banco' ? banco : null,
    billetera: modalidad === 'billetera' ? billetera : null,
  }
}
