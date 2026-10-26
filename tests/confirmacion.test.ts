import { describe, expect, it } from 'vitest'
import { proximosPasos } from '../app/utils/confirmacion'

// Los cuatro pasos de siempre (antes de la modalidad virtual): no deben cambiar para lo presencial
const PASOS_PRESENCIAL = [
  '📧 Recibirás un email de confirmación en los próximos minutos',
  '🔍 Nuestro equipo verificará tu voucher de pago',
  '✅ Una vez aprobado, recibirás tu credencial en PDF y el enlace a tu credencial digital 3D',
  '📅 Te notificaremos sobre el cronograma de actividades',
]

describe('proximosPasos (confirmación de la inscripción)', () => {
  it.each([
    ['PRESENCIAL'],
    [undefined], // backend anterior: la respuesta no trae la modalidad
    [null], // p. ej. una cortesía sin tipo
    ['HIBRIDA'],
    [''],
  ])('modalidad %j → los pasos presenciales de siempre', (modalidad) => {
    expect(proximosPasos(modalidad)).toEqual(PASOS_PRESENCIAL)
  })

  it('VIRTUAL: sin carnet físico y con texto neutro sobre cómo conectarse', () => {
    const pasos = proximosPasos('VIRTUAL')
    expect(pasos).toHaveLength(PASOS_PRESENCIAL.length)
    expect(pasos).toContain('💻 Una vez aprobado, la organización te compartirá las indicaciones para conectarte a la transmisión del congreso')
    // solo cambia el paso de la credencial; los demás son los mismos
    expect(pasos.filter(paso => !PASOS_PRESENCIAL.includes(paso))).toHaveLength(1)
  })

  it('VIRTUAL no promete certificado, carnet, horas ni enlaces (la organización aún no lo define)', () => {
    const texto = proximosPasos('VIRTUAL').join('\n')
    expect(texto).not.toMatch(/certificad|carnet|credencial|horas|https?:|www\./i)
  })
})
