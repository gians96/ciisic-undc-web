import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { specializedSpeakers, specializedTalks } from '../app/data/ponencias-especializadas'
import {
  duracionMin,
  duracionTexto,
  etiquetaDePonentes,
  etiquetaDia,
  formatoHora12,
  parrafosDelPerfil,
  ponentesDelTema,
  ponentesOrdenados,
  ponentesPorId,
  rangoHorario,
  temasPorDia,
} from '../app/utils/ponencias-especializadas'

/** Los ids de quienes dictan un tema, en una sola lista (`speakerIds` de todos los temas). */
const idsDePonentes = () => specializedTalks.flatMap(talk => [...talk.speakerIds])
const dePonente = (id: string) => specializedTalks.filter(talk => talk.speakerIds.includes(id))

describe('datos de las ponencias especializadas', () => {
  it('tiene 24 ponentes únicos y 22 temas', () => {
    expect(specializedSpeakers).toHaveLength(24)
    expect(new Set(specializedSpeakers.map(speaker => speaker.id)).size).toBe(24)
    expect(new Set(specializedSpeakers.map(speaker => speaker.name)).size).toBe(24)
    expect(specializedTalks).toHaveLength(22)
    expect(new Set(specializedTalks.map(talk => talk.id)).size).toBe(22)
  })

  it('cada tema apunta a ponentes existentes y cada ponente dicta exactamente un tema', () => {
    const ids = new Set(specializedSpeakers.map(speaker => speaker.id))
    for (const talk of specializedTalks) {
      expect(talk.speakerIds.length).toBeGreaterThan(0)
      for (const id of talk.speakerIds) expect(ids.has(id), id).toBe(true)
    }
    for (const speaker of specializedSpeakers) expect(dePonente(speaker.id), speaker.id).toHaveLength(1)
    expect(idsDePonentes()).toHaveLength(24)
  })

  it('todos los ponentes tienen foto (y el archivo existe), perfil y los temas tienen título y ambiente', () => {
    for (const speaker of specializedSpeakers) {
      expect(speaker.image).toMatch(/^\/images\/ponentes\/2026\/(especializados\/)?.+\.webp$/)
      expect(existsSync(join(__dirname, '..', 'public', speaker.image)), speaker.image).toBe(true)
      expect(speaker.bio.trim().length).toBeGreaterThan(40)
    }
    for (const talk of specializedTalks) {
      expect(talk.topic.trim().length).toBeGreaterThan(5)
      expect(talk.room).toMatch(/^(Laboratorio \d+|Aula \d+|Auditorio)$/)
    }
  })

  it('marca como externos a Gamarra, Yucra, Mariño, Ormachea y a los cinco ponentes de otras universidades', () => {
    const externos = specializedSpeakers.filter(speaker => speaker.external).map(speaker => speaker.id)
    expect(externos).toEqual([
      'abraham-gamarra', 'daniel-yucra', 'janeth-marino', 'mario-ormachea',
      'saul-arauco', 'karen-alcos', 'jorge-pozo', 'angel-almidon', 'javier-poma',
    ])
  })

  it('no repite ponente ni ambiente en la misma fecha y hora', () => {
    const porPonente = new Set<string>()
    const porAmbiente = new Set<string>()
    for (const talk of specializedTalks) {
      const turno = `${talk.date} ${talk.start}`
      const ambiente = `${turno} ${talk.room}`
      expect(porAmbiente.has(ambiente), ambiente).toBe(false)
      porAmbiente.add(ambiente)
      for (const id of talk.speakerIds) {
        const ponente = `${turno} ${id}`
        expect(porPonente.has(ponente), ponente).toBe(false)
        porPonente.add(ponente)
      }
    }
  })

  it('todas las ponencias duran 45 minutos', () => {
    for (const talk of specializedTalks) expect(duracionMin(talk.start, talk.end)).toBe(45)
  })

  it('Echaccaya dicta un solo tema: laboratorio 4 el miércoles', () => {
    expect(dePonente('jhonatan-echaccaya').map(talk => [talk.date, talk.room, talk.topic])).toEqual([
      ['2026-10-28', 'Laboratorio 4', 'De robots a agentes de IA: automatiza como en el futuro'],
    ])
  })

  it('Roque dicta el martes en el aula 5 e Isuiza el miércoles en el laboratorio 3', () => {
    const ambiente = (id: string) => dePonente(id).map(talk => [talk.date, talk.room])
    expect(ambiente('edwin-roque')).toEqual([['2026-10-27', 'Aula 5']])
    expect(ambiente('dany-isuiza')).toEqual([['2026-10-28', 'Laboratorio 3']])
    expect(specializedSpeakers.find(speaker => speaker.id === 'dany-isuiza')?.image).toBe('/images/ponentes/2026/especializados/dany-isuiza.webp')
  })

  it('Salcedo dicta el martes en el laboratorio 8 y Almidon Ortiz el miércoles en el auditorio', () => {
    const ambiente = (id: string) => dePonente(id).map(talk => [talk.date, talk.room])
    expect(ambiente('percy-salcedo')).toEqual([['2026-10-27', 'Laboratorio 8']])
    expect(ambiente('carlos-almidon')).toEqual([['2026-10-28', 'Auditorio']])
    expect(ambiente('jorge-pozo')).toEqual([['2026-10-28', 'Laboratorio 8']])
    expect(ambiente('daniel-yucra')).toEqual([['2026-10-28', 'Aula 3']])
    expect(ambiente('miriam-angoma')).toEqual([['2026-10-28', 'Aula 1']])
  })

  it('dos temas del miércoles los comparten dos ponentes, en el mismo ambiente y horario', () => {
    const compartidos = specializedTalks.filter(talk => talk.speakerIds.length > 1)
    expect(compartidos.map(talk => [talk.date, talk.start, talk.room, [...talk.speakerIds]])).toEqual([
      ['2026-10-28', '12:00', 'Laboratorio 5', ['saul-arauco', 'karen-alcos']],
      ['2026-10-28', '12:00', 'Aula 2', ['angel-almidon', 'javier-poma']],
    ])
  })

  it('cada foto nueva se relaciona con el ponente que lleva su nombre', () => {
    const imagen = (id: string) => specializedSpeakers.find(speaker => speaker.id === id)?.image
    expect(imagen('jorge-pozo')).toBe('/images/ponentes/2026/especializados/jorge-pozo.webp')
    expect(imagen('angel-almidon')).toBe('/images/ponentes/2026/especializados/angel-almidon.webp')
    expect(imagen('javier-poma')).toBe('/images/ponentes/2026/especializados/javier-poma.webp')
    expect(imagen('saul-arauco')).toBe('/images/ponentes/2026/especializados/saul-arauco.webp')
    expect(imagen('karen-alcos')).toBe('/images/ponentes/2026/especializados/karen-alcos.webp')
    const nombre = (id: string) => specializedSpeakers.find(speaker => speaker.id === id)?.name
    expect(nombre('jorge-pozo')).toBe('Dr. Jorge Luis Pozo Malpartida')
    expect(nombre('angel-almidon')).toBe('Dr. Ángel Almidón Elescano')
    expect(nombre('javier-poma')).toBe('Dr. Javier Camilo Poma Palacios')
    expect(nombre('saul-arauco')).toBe('Dr. Saúl Ernesto Arauco Esquivel')
    expect(nombre('karen-alcos')).toBe('Dra. Karen Michel Alcos Flores')
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

  it('ordena a los internos por categoría: principal, asociado, auxiliar, contratado y, al final, el invitado sin categoría', () => {
    const ordenados = ponentesOrdenados([
      { id: 'sin-categoria', name: 'S', image: '', bio: '', external: false },
      { id: 'contratado', name: 'C', image: '', bio: '', external: false, category: 'CONTRATADO' },
      { id: 'auxiliar-1', name: 'X1', image: '', bio: '', external: false, category: 'AUXILIAR' },
      { id: 'externo', name: 'E', image: '', bio: '', external: true },
      { id: 'principal', name: 'P', image: '', bio: '', external: false, category: 'PRINCIPAL' },
      { id: 'auxiliar-2', name: 'X2', image: '', bio: '', external: false, category: 'AUXILIAR' },
      { id: 'asociado', name: 'A', image: '', bio: '', external: false, category: 'ASOCIADO' },
    ])
    expect(ordenados.map(speaker => speaker.id)).toEqual([
      'externo', 'principal', 'asociado', 'auxiliar-1', 'auxiliar-2', 'contratado', 'sin-categoria',
    ])
  })

  it('con los datos reales: externos, principales, asociados, auxiliares, contratados y, al final, los invitados internos', () => {
    expect(ponentesOrdenados(specializedSpeakers).map(speaker => speaker.id)).toEqual([
      'abraham-gamarra', 'daniel-yucra', 'janeth-marino', 'mario-ormachea',
      'saul-arauco', 'karen-alcos', 'jorge-pozo', 'angel-almidon', 'javier-poma',
      'guido-larico', 'wagner-vicente', 'carlos-almidon', 'edwin-roque',
      'amanda-duran', 'marisol-daga',
      'miriam-angoma', 'jair-ferreyros', 'claudio-huancahuire', 'joel-vilca',
      'percy-salcedo', 'jhonatan-echaccaya', 'jhancarlo-silva',
      'richard-condori', 'dany-isuiza',
    ])
  })

  it('cada docente UNDC con categoría coincide con el directorio de docentes 2026-II', () => {
    const categoria = (id: string) => specializedSpeakers.find(speaker => speaker.id === id)?.category
    expect(['guido-larico', 'wagner-vicente', 'carlos-almidon', 'edwin-roque'].map(categoria)).toEqual(Array(4).fill('PRINCIPAL'))
    expect(['amanda-duran', 'marisol-daga'].map(categoria)).toEqual(Array(2).fill('ASOCIADO'))
    expect(['miriam-angoma', 'jair-ferreyros', 'claudio-huancahuire', 'joel-vilca'].map(categoria)).toEqual(Array(4).fill('AUXILIAR'))
    expect(['percy-salcedo', 'jhonatan-echaccaya', 'jhancarlo-silva'].map(categoria)).toEqual(Array(3).fill('CONTRATADO'))
    for (const speaker of specializedSpeakers.filter(item => item.external)) expect(speaker.category, speaker.id).toBeUndefined()
  })

  it('Condori e Isuiza son invitados internos: no son externos y no tienen categoría docente', () => {
    for (const id of ['richard-condori', 'dany-isuiza']) {
      const speaker = specializedSpeakers.find(item => item.id === id)
      expect(speaker?.external, id).toBe(false)
      expect(speaker?.category, id).toBeUndefined()
    }
  })

  it('muestra a cada persona una sola vez, con Echaccaya incluido', () => {
    const ordenados = ponentesOrdenados(specializedSpeakers)
    expect(ordenados).toHaveLength(24)
    expect(new Set(ordenados.map(speaker => speaker.id)).size).toBe(24)
    expect(ordenados.slice(0, 2).map(speaker => speaker.id)).toEqual(['abraham-gamarra', 'daniel-yucra'])
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

  it('agrupa en martes 27 (8 temas) y miércoles 28 (14 temas), en ese orden', () => {
    expect(dias.map(dia => [dia.etiqueta, dia.talks.length])).toEqual([
      ['Martes 27 de octubre', 8],
      ['Miércoles 28 de octubre', 14],
    ])
  })

  it('ordena por ambiente: laboratorios primero, luego aulas y al final el auditorio', () => {
    expect(dias[0]?.talks.map(talk => talk.room)).toEqual([
      'Laboratorio 1', 'Laboratorio 3', 'Laboratorio 4', 'Laboratorio 5', 'Laboratorio 6',
      'Laboratorio 7', 'Laboratorio 8', 'Aula 5',
    ])
    expect(dias[1]?.talks.map(talk => talk.room)).toEqual([
      'Laboratorio 1', 'Laboratorio 2', 'Laboratorio 3', 'Laboratorio 4', 'Laboratorio 5', 'Laboratorio 6',
      'Laboratorio 7', 'Laboratorio 8', 'Aula 1', 'Aula 2', 'Aula 3', 'Aula 5', 'Aula 6', 'Auditorio',
    ])
  })

  it('cada ponente dicta un solo tema y Echaccaya solo el miércoles', () => {
    const temas = dias.flatMap(dia => dia.talks)
    for (const speaker of specializedSpeakers) expect(temas.filter(talk => talk.speakerIds.includes(speaker.id))).toHaveLength(1)
    expect(dias[0]?.talks.some(talk => talk.speakerIds.includes('jhonatan-echaccaya'))).toBe(false)
    expect(dias[1]?.talks.some(talk => talk.speakerIds.includes('jhonatan-echaccaya'))).toBe(true)
  })

  it('el martes el único externo dicta en el laboratorio 7 y el miércoles lo hacen seis temas, con Gamarra y Yucra', () => {
    const porId = ponentesPorId(specializedSpeakers)
    const conExterno = (dia: number) => dias[dia]?.talks.filter(talk => ponentesDelTema(talk, porId).some(speaker => speaker.external)) ?? []
    expect(conExterno(0).map(talk => talk.room)).toEqual(['Laboratorio 7'])
    expect(conExterno(1).map(talk => talk.room)).toEqual(['Laboratorio 1', 'Laboratorio 5', 'Laboratorio 7', 'Laboratorio 8', 'Aula 2', 'Aula 3'])
  })
})

describe('ponentesDelTema', () => {
  const porId = ponentesPorId(specializedSpeakers)

  it('devuelve a los ponentes en el orden del tema, el principal primero', () => {
    const talk = specializedTalks.find(item => item.room === 'Aula 2')!
    expect(ponentesDelTema(talk, porId).map(speaker => speaker.name)).toEqual(['Dr. Ángel Almidón Elescano', 'Dr. Javier Camilo Poma Palacios'])
  })

  it('un tema de un solo ponente devuelve solo a esa persona y un id desconocido se omite', () => {
    expect(ponentesDelTema({ speakerIds: ['edwin-roque'] }, porId).map(speaker => speaker.id)).toEqual(['edwin-roque'])
    expect(ponentesDelTema({ speakerIds: ['nadie', 'edwin-roque'] }, porId).map(speaker => speaker.id)).toEqual(['edwin-roque'])
  })
})

describe('etiquetaDePonentes', () => {
  it('distingue uno de varios y avisa «externo» solo si todos lo son', () => {
    expect(etiquetaDePonentes([false])).toBe('Ponente')
    expect(etiquetaDePonentes([true])).toBe('Ponente externo')
    expect(etiquetaDePonentes([true, true])).toBe('Ponentes externos')
    expect(etiquetaDePonentes([true, false])).toBe('Ponentes')
    expect(etiquetaDePonentes([false, false])).toBe('Ponentes')
    expect(etiquetaDePonentes([])).toBe('Ponente')
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
