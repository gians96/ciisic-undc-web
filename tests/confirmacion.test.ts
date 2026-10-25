import { describe, expect, it } from 'vitest'
import { proximosPasos } from '../app/utils/confirmacion'

// Los pasos presenciales: primero la verificación, luego el correo de aprobación (el correo
// llega después de revisar el voucher, no «en los próximos minutos»)
const PASOS_PRESENCIAL = [
  '🔍 Nuestro equipo verificará tu voucher de pago',
  '📧 Al aprobarla recibirás el correo con tu credencial digital y su enlace',
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
    expect(pasos).toHaveLength(PASOS_PRESENCIAL.length + 1)
    expect(pasos).toContain('💻 La organización te compartirá las indicaciones para conectarte a la transmisión del congreso')
    // solo cambia el paso del correo y se agrega el de conexión; verificación y cronograma son los mismos
    expect(pasos.filter(paso => PASOS_PRESENCIAL.includes(paso))).toHaveLength(2)
  })

  it('VIRTUAL no promete certificado, carnet, credencial, horas ni enlaces (la organización aún no lo define)', () => {
    const texto = proximosPasos('VIRTUAL').join('\n')
    expect(texto).not.toMatch(/certificad|carnet|credencial|horas|https?:|www\./i)
  })

  it('ningún paso promete el correo «en los próximos minutos»: llega tras la verificación', () => {
    const texto = [...proximosPasos('PRESENCIAL'), ...proximosPasos('VIRTUAL')].join('\n')
    expect(texto).not.toMatch(/próximos minutos/i)
  })
})
