import { describe, expect, it } from 'vitest'
import { schedule } from '../app/data/cronograma'
import type { ScheduleDay } from '../app/data/cronograma'
import { specializedTalks } from '../app/data/ponencias-especializadas'
import { SEMANA_SISTEMICA_MENU } from '../app/data/semana-sistemica'
import { speakers } from '../app/data/speakers'
import { sesionesDePonentes } from '../app/utils/cronograma'

const eventosConPonente = schedule.flatMap(day => day.events.filter(event => event.ponente))

const minutos = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

const rango = (time: string) => {
  const [inicio, fin] = time.split(' - ')
  return { inicio: minutos(inicio ?? ''), fin: minutos(fin ?? '') }
}

const bloqueEspecializado = (day: ScheduleDay) => day.events.find(event => event.title === 'Ponencias Especializadas')

describe('sesiones de los ponentes invitados', () => {
  const sesiones = sesionesDePonentes(schedule)

  it('cada ponente de speakers.ts tiene exactamente una sesión en el cronograma', () => {
    expect(speakers).toHaveLength(9)
    for (const speaker of speakers) {
      expect(eventosConPonente.filter(event => event.ponente === speaker.name), speaker.name).toHaveLength(1)
      expect(sesiones.has(speaker.name), speaker.name).toBe(true)
    }
    expect(sesiones.size).toBe(9)
  })

  it('ningún evento del cronograma apunta a un ponente que no esté en speakers.ts', () => {
    const nombres = new Set(speakers.map(speaker => speaker.name))
    for (const event of eventosConPonente) expect(nombres.has(event.ponente ?? ''), event.ponente).toBe(true)
  })

  it('escribe el día y la hora de cada sesión', () => {
    expect(sesiones.get('Patricio Ramírez Correa')).toEqual({ dia: 'Martes 27 de octubre', hora: '9:00 – 10:30 a. m.' })
    expect(sesiones.get('Jorge Risco Becerra')).toEqual({ dia: 'Miércoles 28 de octubre', hora: '10:00 – 10:50 a. m.' })
    expect(sesiones.get('Enrique Luis Arnáez Braschi')).toEqual({ dia: 'Jueves 29 de octubre', hora: '11:15 a. m. – 12:00 p. m.' })
  })

  it('ignora los eventos sin ponente', () => {
    const dia: ScheduleDay = {
      short: 'Lunes',
      dayNumber: '26',
      date: '26/10',
      events: [
        { time: '08:00 - 09:00', title: 'Registro', category: 'institutional' },
        { time: '09:00 - 10:00', title: 'Charla', category: 'academic', ponente: 'Ana Pérez' },
      ],
    }
    expect([...sesionesDePonentes([dia]).keys()]).toEqual(['Ana Pérez'])
  })
})

describe('bloques «Ponencias Especializadas» del cronograma', () => {
  const dias = [
    { dia: 'Martes', date: '2026-10-27', cantidad: 8, ambientes: 'Laboratorios y aulas' },
    { dia: 'Miércoles', date: '2026-10-28', cantidad: 14, ambientes: 'Laboratorios, aulas y auditorio' },
  ]

  for (const { dia, date, cantidad, ambientes } of dias) {
    describe(dia, () => {
      const bloque = bloqueEspecializado(schedule.find(item => item.short === dia)!)
      const talks = specializedTalks.filter(talk => talk.date === date)

      it('enlaza a la página de ponencias especializadas', () => {
        expect(bloque?.href).toBe('/ponencias-especializadas')
      })

      it('coincide con el horario de las ponencias de ese día', () => {
        expect(talks).toHaveLength(cantidad)
        const [talk] = talks
        expect(bloque?.time).toBe(`${talk?.start} - ${talk?.end}`)
        for (const item of talks) expect([item.start, item.end]).toEqual([talk?.start, talk?.end])
      })

      it(`indica que son ${cantidad} ponencias simultáneas`, () => {
        expect(bloque?.detail).toContain(`${cantidad} ponencias simultáneas`)
        expect(bloque?.detail).toBe(`${cantidad} ponencias simultáneas · ${ambientes}`)
      })
    })
  }

  it('solo llevan enlace las ponencias especializadas y las actividades de la Semana Sistémica', () => {
    const conEnlace = schedule.flatMap(day => day.events.filter(event => event.href))
    expect(conEnlace.map(event => event.title)).toEqual([
      'Comparsa Sistémica',
      'Ponencias Especializadas',
      'E-Sports',
      'Concurso de Programación',
      'Ponencias Especializadas',
      'Reinado',
      'Cyber Clash — Kriptome Cybersecurity',
      'Talleres sistémicos',
      'Hackathon',
      'Recibimiento y pasacalles',
      'Deportes en simultáneo',
    ])
    const rutasSemana = new Set(SEMANA_SISTEMICA_MENU.map(item => item.href))
    for (const event of conEnlace.filter(item => item.title !== 'Ponencias Especializadas')) {
      expect(rutasSemana.has(event.href ?? ''), event.title).toBe(true)
      expect(event.etiquetaEnlace, event.title).toBe('Ver detalles')
    }
  })
})

describe('horarios del cronograma', () => {
  it('cada evento tiene el formato «HH:mm - HH:mm» y termina después de empezar', () => {
    for (const day of schedule) {
      for (const event of day.events) {
        expect(event.time, `${day.short} ${event.title}`).toMatch(/^\d{2}:\d{2} - \d{2}:\d{2}$/)
        const { inicio, fin } = rango(event.time)
        expect(fin, `${day.short} ${event.title}`).toBeGreaterThan(inicio)
      }
    }
  })

  it('no hay eventos que se solapen dentro de un mismo día, salvo simultáneos declarados', () => {
    for (const day of schedule) {
      const ordenados = [...day.events].sort((a, b) => rango(a.time).inicio - rango(b.time).inicio)
      ordenados.slice(1).forEach((event, index) => {
        const anterior = ordenados[index]!
        if (event.simultaneo && anterior.simultaneo) return
        expect(rango(event.time).inicio, `${day.short}: «${anterior.title}» y «${event.title}»`).toBeGreaterThanOrEqual(rango(anterior.time).fin)
      })
    }
  })

  it('todo solape del cronograma está declarado como simultáneo en ambos eventos', () => {
    for (const day of schedule) {
      const eventos = day.events
      eventos.forEach((event, i) => {
        eventos.slice(i + 1).forEach((otro) => {
          const a = rango(event.time)
          const b = rango(otro.time)
          const haySolape = a.inicio < b.fin && b.inicio < a.fin
          if (haySolape) {
            expect(event.simultaneo, `${day.short}: «${event.title}»`).toBe(true)
            expect(otro.simultaneo, `${day.short}: «${otro.title}»`).toBe(true)
          }
        })
      })
    }
  })
})
