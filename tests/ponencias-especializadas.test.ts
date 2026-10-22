import { describe, expect, it } from 'vitest'
import { specializedSpeakers, specializedTalks } from '../app/data/ponencias-especializadas'
import {
  duracionMin,
  duracionTexto,
  etiquetaDia,
  formatoHora12,
  parrafosDelPerfil,
  ponentesOrdenados,
  ponentesPorId,
  rangoHorario,
  temasPorDia,
} from '../app/utils/ponencias-especializadas'

describe('datos de las ponencias especializadas', () => {
  it('tiene 18 ponentes únicos y 18 temas', () => {
    expect(specializedSpeakers).toHaveLength(18)
    expect(new Set(specializedSpeakers.map(speaker => speaker.id)).size).toBe(18)
    expect(new Set(specializedSpeakers.map(speaker => speaker.name)).size).toBe(18)
    expect(specializedTalks).toHaveLength(18)
    expect(new Set(specializedTalks.map(talk => talk.id)).size).toBe(18)
  })

  it('cada tema apunta a un ponente existente y cada ponente dicta al menos un tema', () => {
    const ids = new Set(specializedSpeakers.map(speaker => speaker.id))
    for (const talk of specializedTalks) expect(ids.has(talk.speakerId)).toBe(true)
    const conTema = new Set(specializedTalks.map(talk => talk.speakerId))
    for (const speaker of specializedSpeakers) expect(conTema.has(speaker.id)).toBe(true)
  })

  it('todos los ponentes tienen foto, perfil y los temas tienen título y ambiente', () => {
    for (const speaker of specializedSpeakers) {
      expect(speaker.image).toMatch(/^\/images\/ponentes\/2026\/(especializados\/)?.+\.webp$/)
      expect(speaker.bio.trim().length).toBeGreaterThan(40)
    }
    for (const talk of specializedTalks) {
      expect(talk.topic.trim().length).toBeGreaterThan(5)
      expect(talk.room).toMatch(/^(Laboratorio|Aula) \d+$/)
    }
  })

  it('marca como externos solo a Janeth Mariño y Mario Ormachea', () => {
    const externos = specializedSpeakers.filter(speaker => speaker.external).map(speaker => speaker.id)
    expect(externos).toEqual(['janeth-marino', 'mario-ormachea'])
  })

  it('no repite ponente ni ambiente en la misma fecha y hora', () => {
    const porPonente = new Set<string>()
    const porAmbiente = new Set<string>()
    for (const talk of specializedTalks) {
      const turno = `${talk.date} ${talk.start}`
      const ponente = `${turno} ${talk.speakerId}`
      const ambiente = `${turno} ${talk.room}`
      expect(porPonente.has(ponente)).toBe(false)
      expect(porAmbiente.has(ambiente)).toBe(false)
      porPonente.add(ponente)
      porAmbiente.add(ambiente)
    }
  })

  it('todas las ponencias duran 45 minutos', () => {
    for (const talk of specializedTalks) expect(duracionMin(talk.start, talk.end)).toBe(45)
  })

  it('Echaccaya dicta un solo tema: laboratorio 4 el miércoles', () => {
    const suyos = specializedTalks.filter(talk => talk.speakerId === 'jhonatan-echaccaya')
    expect(suyos.map(talk => [talk.date, talk.room, talk.topic])).toEqual([
      ['2026-10-28', 'Laboratorio 4', 'De robots a agentes de IA: automatiza como en el futuro'],
    ])
  })

  it('Almidon y Yucra dictan el miércoles en las aulas 2 y 3, y Angoma en el aula 1', () => {
    const ambiente = (id: string) => specializedTalks.filter(talk => talk.speakerId === id).map(talk => [talk.date, talk.room])
    expect(ambiente('carlos-almidon')).toEqual([['2026-10-28', 'Aula 2']])
    expect(ambiente('daniel-yucra')).toEqual([['2026-10-28', 'Aula 3']])
    expect(ambiente('miriam-angoma')).toEqual([['2026-10-28', 'Aula 1']])
  })
})

describe('ponentesOrdenados', () => {
  it('pone primero a los externos y conserva el orden del resto', () => {
    const ordenados = ponentesOrdenados([
      { id: 'a', name: 'A', image: '', bio: '', external: false },
      { id: 'b', name: 'B', image: '', bio: '', external: true },
      { id: 'c', name: 'C', image: '', bio: '', external: false },
      { id: 'd', name: 'D', image: '', bio: '', external: true },
    ])
    expect(ordenados.map(speaker => speaker.id)).toEqual(['b', 'd', 'a', 'c'])
  })

  it('muestra a cada persona una sola vez, con Echaccaya incluido', () => {
    const ordenados = ponentesOrdenados(specializedSpeakers)
    expect(ordenados).toHaveLength(18)
    expect(ordenados.slice(0, 2).map(speaker => speaker.id)).toEqual(['janeth-marino', 'mario-ormachea'])
    expect(ordenados.filter(speaker => speaker.id === 'jhonatan-echaccaya')).toHaveLength(1)
  })

  it('no modifica el arreglo original', () => {
    const original = [...specializedSpeakers]
    ponentesOrdenados(specializedSpeakers)
    expect(specializedSpeakers).toEqual(original)
  })
})

describe('temasPorDia', () => {
  const dias = temasPorDia(specializedTalks)

  it('agrupa en martes 27 (7 temas) y miércoles 28 (11 temas), en ese orden', () => {
    expect(dias.map(dia => [dia.etiqueta, dia.talks.length])).toEqual([
      ['Martes 27 de octubre', 7],
      ['Miércoles 28 de octubre', 11],
    ])
  })

  it('ordena por ambiente: laboratorios primero y aulas al final', () => {
    expect(dias[0]?.talks.map(talk => talk.room)).toEqual([
      'Laboratorio 1', 'Laboratorio 2', 'Laboratorio 3', 'Laboratorio 4', 'Laboratorio 5',
      'Laboratorio 6', 'Laboratorio 7',
    ])
    expect(dias[1]?.talks.map(talk => talk.room)).toEqual([
      'Laboratorio 1', 'Laboratorio 2', 'Laboratorio 4', 'Laboratorio 6', 'Laboratorio 7',
      'Laboratorio 8', 'Aula 1', 'Aula 2', 'Aula 3', 'Aula 5', 'Aula 6',
    ])
  })

  it('cada ponente dicta un solo tema y Echaccaya solo el miércoles', () => {
    const temas = dias.flatMap(dia => dia.talks)
    for (const speaker of specializedSpeakers) expect(temas.filter(talk => talk.speakerId === speaker.id)).toHaveLength(1)
    expect(dias[0]?.talks.some(talk => talk.speakerId === 'jhonatan-echaccaya')).toBe(false)
    expect(dias[1]?.talks.some(talk => talk.speakerId === 'jhonatan-echaccaya')).toBe(true)
  })

  it('el externo de cada día dicta en el laboratorio 7', () => {
    const externos = ponentesPorId(specializedSpeakers)
    for (const dia of dias) {
      const talk = dia.talks.find(item => externos.get(item.speakerId)?.external)
      expect(talk?.room).toBe('Laboratorio 7')
    }
  })
})

describe('horas y fechas', () => {
  it('formatea la hora en 12 h con «a. m.» y «p. m.»', () => {
    expect(formatoHora12('12:00')).toBe('12:00 p. m.')
    expect(formatoHora12('12:45')).toBe('12:45 p. m.')
    expect(formatoHora12('09:05')).toBe('9:05 a. m.')
    expect(formatoHora12('00:30')).toBe('12:30 a. m.')
    expect(formatoHora12('15:10')).toBe('3:10 p. m.')
  })

  it('arma el rango horario compartiendo el sufijo cuando es el mismo turno', () => {
    expect(rangoHorario('12:00', '12:45')).toBe('12:00 – 12:45 p. m.')
    expect(rangoHorario('11:15', '12:00')).toBe('11:15 a. m. – 12:00 p. m.')
  })

  it('calcula la duración y la escribe en texto', () => {
    expect(duracionMin('12:00', '12:45')).toBe(45)
    expect(duracionTexto(45)).toBe('45 min')
    expect(duracionTexto(60)).toBe('1 h')
    expect(duracionTexto(90)).toBe('1 h 30 min')
  })

  it('escribe el día de la semana y la fecha sin depender del entorno', () => {
    expect(etiquetaDia('2026-10-27')).toBe('Martes 27 de octubre')
    expect(etiquetaDia('2026-10-28')).toBe('Miércoles 28 de octubre')
    expect(etiquetaDia('mañana')).toBe('mañana')
  })
})

describe('parrafosDelPerfil', () => {
  it('separa los párrafos por línea en blanco y descarta los vacíos', () => {
    expect(parrafosDelPerfil('Uno.\n\nDos.\n\n\n  \nTres.')).toEqual(['Uno.', 'Dos.', 'Tres.'])
    expect(parrafosDelPerfil('Solo uno.')).toEqual(['Solo uno.'])
    expect(parrafosDelPerfil('  ')).toEqual([])
  })

  it('el perfil de Janeth Mariño tiene dos párrafos', () => {
    const janeth = specializedSpeakers.find(speaker => speaker.id === 'janeth-marino')
    expect(parrafosDelPerfil(janeth?.bio ?? '')).toHaveLength(2)
  })
})
