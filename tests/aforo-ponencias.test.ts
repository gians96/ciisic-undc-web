import { describe, expect, it } from 'vitest'
import type { PonenciaAforo } from '../app/types/ponencias-especializadas'
import {
  horaDeActualizacion,
  nivelOcupacion,
  porcentajeOcupacion,
  textoAsistencia,
  textoCuposLibres,
  textoInscritos,
  tokenDelHash,
} from '../app/utils/aforo-ponencias'
import { ponenciasPorDia, ponentesDeLaPonencia } from '../app/utils/inscripcion-ponencias'

const TOKEN = 'Ab3_-'.repeat(8) + 'xyz'

const ponencia = (datos: Partial<PonenciaAforo> = {}): PonenciaAforo => ({
  id: 1, tema: 'Big Data', fecha: '2026-10-27', horaInicio: '12:00', horaFin: '12:45', duracionMin: 45, ambiente: 'Laboratorio 6', modalidad: 'PRESENCIAL',
  ponente: { nombre: 'Mg. Claudio', foto: null, externo: false }, coponentes: [], cupo: 20, inscritos: 14, cuposDisponibles: 6, llena: false, asistentes: 9, orden: 0,
  ...datos,
})

describe('tokenDelHash', () => {
  it('lee el token de 43 caracteres tras el #', () => {
    expect(TOKEN).toHaveLength(43)
    expect(tokenDelHash(`#${TOKEN}`)).toBe(TOKEN)
    expect(tokenDelHash(` #${TOKEN} `)).toBe(TOKEN)
  })

  it('descarta lo que no tiene la forma del backend', () => {
    for (const hash of ['', '#', null, undefined, '#corto', `#${TOKEN}x`, `#${TOKEN.slice(1)}=`, '#' + 'á'.repeat(43)]) expect(tokenDelHash(hash)).toBeNull()
  })
})

describe('ocupación', () => {
  it('libre, casi lleno desde el 80 %, lleno y sin límite', () => {
    expect(nivelOcupacion({ cupo: 20, inscritos: 15 })).toBe('libre')
    expect(nivelOcupacion({ cupo: 20, inscritos: 16 })).toBe('casi-lleno')
    expect(nivelOcupacion({ cupo: 20, inscritos: 20 })).toBe('lleno')
    expect(nivelOcupacion({ cupo: 20, inscritos: 23 })).toBe('lleno')
    expect(nivelOcupacion({ cupo: null, inscritos: 50 })).toBe('sin-limite')
  })

  it('el ancho de la barra va de 0 a 100 y no existe sin aforo', () => {
    expect(porcentajeOcupacion({ cupo: 20, inscritos: 14 })).toBe(70)
    expect(porcentajeOcupacion({ cupo: 3, inscritos: 1 })).toBe(33)
    expect(porcentajeOcupacion({ cupo: 20, inscritos: 0 })).toBe(0)
    expect(porcentajeOcupacion({ cupo: 20, inscritos: 25 })).toBe(100)
    expect(porcentajeOcupacion({ cupo: null, inscritos: 5 })).toBeNull()
  })
})

describe('textos', () => {
  it('inscritos con y sin aforo', () => {
    expect(textoInscritos(ponencia())).toBe('14 de 20 inscritos')
    expect(textoInscritos(ponencia({ cupo: null, inscritos: 1 }))).toBe('1 inscrito')
    expect(textoInscritos(ponencia({ cupo: null, inscritos: 3 }))).toBe('3 inscritos')
  })

  it('cupos libres, lleno y sin límite', () => {
    expect(textoCuposLibres(ponencia())).toBe('6 cupos libres')
    expect(textoCuposLibres(ponencia({ inscritos: 19, cuposDisponibles: 1 }))).toBe('1 cupo libre')
    expect(textoCuposLibres(ponencia({ inscritos: 20, cuposDisponibles: 0, llena: true }))).toBe('Lleno')
    expect(textoCuposLibres(ponencia({ cupo: null, cuposDisponibles: null }))).toBe('Sin límite de aforo')
  })

  it('asistencia en puerta', () => {
    expect(textoAsistencia({ asistentes: 0 })).toBe('Aún sin registros')
    expect(textoAsistencia({ asistentes: 1 })).toBe('1 asistió')
    expect(textoAsistencia({ asistentes: 9 })).toBe('9 asistieron')
  })

  it('hora de la última lectura en Lima', () => {
    expect(horaDeActualizacion('2026-10-27T17:05:00.000Z')).toMatch(/^12:05\s?p\.\s?m\.$/)
    expect(horaDeActualizacion('no es fecha')).toBe('')
    expect(horaDeActualizacion(null)).toBe('')
  })
})

describe('agrupación del aforo', () => {
  it('reutiliza el orden del programa: por día y, dentro, por hora y ambiente', () => {
    const dias = ponenciasPorDia([
      ponencia({ id: 3, fecha: '2026-10-28', ambiente: 'Laboratorio 1' }),
      ponencia({ id: 2, ambiente: 'Laboratorio 10' }),
      ponencia({ id: 1, ambiente: 'Laboratorio 2' }),
    ])
    expect(dias.map(d => [d.fecha, d.etiqueta, d.ponencias.map(p => p.id)])).toEqual([
      ['2026-10-27', 'Martes 27 de octubre', [1, 2]],
      ['2026-10-28', 'Miércoles 28 de octubre', [3]],
    ])
  })

  it('lista al ponente principal y a los coponentes', () => {
    const tema = ponencia({ coponentes: [{ nombre: 'Dr. Javier', foto: null, externo: true }] })
    expect(ponentesDeLaPonencia(tema).map(p => p.nombre)).toEqual(['Mg. Claudio', 'Dr. Javier'])
  })
})
