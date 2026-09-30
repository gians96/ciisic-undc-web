import { describe, expect, it } from 'vitest'
import type { BilleteraDigital, CuentaBancaria } from '../app/types/evento'
import { modalidadesDisponibles, resolverMedioPago, type EleccionPago } from '../app/utils/medios-pago'

const BCP: CuentaBancaria = { codigo: 'bcp', nombre: 'BCP', numeroCuenta: '19100000000001', cci: '00219100000000000155' }
const BBVA: CuentaBancaria = { codigo: 'bbva', nombre: 'BBVA', numeroCuenta: '0011-0123-0100012345' }
const YAPE: BilleteraDigital = { codigo: 'yape', nombre: 'María Quispe Rojas', telefono: '999888777' }
const PLIN: BilleteraDigital = { codigo: 'plin', nombre: 'Plin', telefono: '987654321' }

const SIN_ELECCION: EleccionPago = { modalidad: null, banco: null, billetera: null }

describe('modalidadesDisponibles', () => {
  it('usa los nombres del panel y pone primero las billeteras digitales', () => {
    expect(modalidadesDisponibles([BCP], [YAPE])).toEqual([
      { valor: 'billetera', etiqueta: 'Billeteras digitales' },
      { valor: 'banco', etiqueta: 'Cuentas bancarias' },
    ])
  })

  it('omite el grupo que no tiene medios', () => {
    expect(modalidadesDisponibles([BCP], [])).toEqual([{ valor: 'banco', etiqueta: 'Cuentas bancarias' }])
    expect(modalidadesDisponibles([], [YAPE])).toEqual([{ valor: 'billetera', etiqueta: 'Billeteras digitales' }])
    expect(modalidadesDisponibles([], [])).toEqual([])
  })
})

describe('resolverMedioPago', () => {
  it('por defecto elige la primera billetera digital, aunque haya cuentas bancarias', () => {
    expect(resolverMedioPago([BCP], [YAPE, PLIN], SIN_ELECCION)).toEqual({ modalidad: 'billetera', banco: null, billetera: YAPE })
  })

  it('sin billeteras elige la primera cuenta bancaria', () => {
    expect(resolverMedioPago([BCP, BBVA], [], SIN_ELECCION)).toEqual({ modalidad: 'banco', banco: BCP, billetera: null })
  })

  it('sin medios de pago no elige nada', () => {
    expect(resolverMedioPago([], [], SIN_ELECCION)).toEqual({ modalidad: null, banco: null, billetera: null })
  })

  it('respeta la modalidad y el medio elegidos', () => {
    expect(resolverMedioPago([BCP, BBVA], [YAPE], { modalidad: 'banco', banco: 'bbva', billetera: null }))
      .toEqual({ modalidad: 'banco', banco: BBVA, billetera: null })
    expect(resolverMedioPago([BCP], [YAPE, PLIN], { modalidad: 'billetera', banco: null, billetera: 'plin' }))
      .toEqual({ modalidad: 'billetera', banco: null, billetera: PLIN })
  })

  it('al pasar a cuentas bancarias sin elegir banco toma el primero', () => {
    expect(resolverMedioPago([BCP, BBVA], [YAPE], { modalidad: 'banco', banco: null, billetera: 'yape' }))
      .toEqual({ modalidad: 'banco', banco: BCP, billetera: null })
  })

  it('cada grupo recuerda su medio al volver a él', () => {
    const eleccion: EleccionPago = { modalidad: 'billetera', banco: 'bbva', billetera: 'plin' }
    expect(resolverMedioPago([BCP, BBVA], [YAPE, PLIN], eleccion).billetera).toEqual(PLIN)
    expect(resolverMedioPago([BCP, BBVA], [YAPE, PLIN], { ...eleccion, modalidad: 'banco' }).banco).toEqual(BBVA)
  })

  it('si el medio elegido deja de existir vuelve al primero del grupo', () => {
    expect(resolverMedioPago([BCP], [YAPE], { modalidad: 'banco', banco: 'interbank', billetera: null }))
      .toEqual({ modalidad: 'banco', banco: BCP, billetera: null })
  })

  it('si la modalidad elegida se queda sin medios vuelve a la disponible', () => {
    expect(resolverMedioPago([], [YAPE], { modalidad: 'banco', banco: 'bcp', billetera: null }))
      .toEqual({ modalidad: 'billetera', banco: null, billetera: YAPE })
    expect(resolverMedioPago([BCP], [], { modalidad: 'billetera', banco: null, billetera: 'yape' }))
      .toEqual({ modalidad: 'banco', banco: BCP, billetera: null })
  })
})
