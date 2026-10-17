import { describe, expect, it } from 'vitest'
import {
  RUTA_SEMANA_SISTEMICA,
  SEMANA_SISTEMICA_MENU,
  actividadPorSlug,
  actividades,
} from '../app/data/semana-sistemica'
import { inscripcionAbierta, rutaEnGrupo } from '../app/utils/semana-sistemica'
import { schedule } from '../app/data/cronograma'
import { etiquetaDia, formatoHora12 } from '../app/utils/ponencias-especializadas'

describe('datos de la Semana Sistémica', () => {
  it('tiene las seis actividades en orden cronológico', () => {
    expect(actividades.map(actividad => actividad.slug)).toEqual(['comparsa', 'programacion', 'esports', 'reinado', 'hackathon', 'deportes'])
    const fechas = actividades.map(actividad => actividad.fecha)
    expect([...fechas].sort()).toEqual(fechas)
  })

  it('cada actividad cae en el día de la semana publicado en los flyers', () => {
    expect(etiquetaDia(actividadPorSlug('comparsa').fecha)).toBe('Lunes 26 de octubre')
    expect(etiquetaDia(actividadPorSlug('programacion').fecha)).toBe('Martes 27 de octubre')
    expect(etiquetaDia(actividadPorSlug('esports').fecha)).toBe('Martes 27 de octubre')
    expect(etiquetaDia(actividadPorSlug('reinado').fecha)).toBe('Miércoles 28 de octubre')
    expect(etiquetaDia(actividadPorSlug('hackathon').fecha)).toBe('Jueves 29 de octubre')
    expect(etiquetaDia(actividadPorSlug('deportes').fecha)).toBe('Viernes 30 de octubre')
  })

  it('los slugs y las rutas son únicos y cuelgan de /semana-sistemica', () => {
    expect(new Set(actividades.map(actividad => actividad.slug)).size).toBe(actividades.length)
    expect(new Set(actividades.map(actividad => actividad.ruta)).size).toBe(actividades.length)
    for (const actividad of actividades) expect(actividad.ruta).toBe(`${RUTA_SEMANA_SISTEMICA}/${actividad.slug}`)
  })

  it('los enlaces de inscripción y de bases son https y se abren sin parámetros de cuenta', () => {
    for (const actividad of actividades) {
      for (const url of [actividad.inscripcion.url, actividad.bases.url]) {
        expect(url, `${actividad.slug}: ${url}`).toMatch(/^https:\/\//)
        expect(url, `${actividad.slug}: ${url}`).not.toMatch(/ouid=|rtpof=/)
      }
    }
  })

  it('las horas son HH:mm y la hora mostrada coincide con la de inicio', () => {
    for (const actividad of actividades) {
      expect(actividad.horaInicio).toMatch(/^\d{2}:\d{2}$/)
      if (actividad.horaFin) expect(actividad.horaFin > actividad.horaInicio).toBe(true)
      expect(actividad.horaTexto, actividad.slug).toContain(formatoHora12(actividad.horaInicio))
    }
  })

  it('cada actividad tiene portada, afiche y texto alternativo en las imágenes', () => {
    for (const actividad of actividades) {
      for (const imagen of [actividad.portada, actividad.afiche, ...actividad.galeria]) {
        // La portada con crédito externo es la única imagen remota permitida.
        if (imagen === actividad.portada && actividad.creditoPortada) {
          expect(imagen.src, actividad.slug).toMatch(/^https:\/\//)
        } else {
          expect(imagen.src, actividad.slug).toMatch(/^\/images\/.+\.webp$/)
        }
        expect(imagen.alt.length).toBeGreaterThan(10)
      }
      if (actividad.creditoPortada) {
        expect(actividad.creditoPortada.href, actividad.slug).toMatch(/^https:\/\//)
        expect(actividad.creditoPortada.texto.length).toBeGreaterThan(0)
      }
    }
  })

  it('el cierre de inscripción es un instante válido con el offset de Lima y no pasa del día de la actividad', () => {
    for (const actividad of actividades) {
      const { cierre } = actividad.inscripcion
      expect(cierre, actividad.slug).toMatch(/-05:00$/)
      expect(Number.isNaN(Date.parse(cierre)), actividad.slug).toBe(false)
      expect(cierre.slice(0, 10) <= actividad.fecha, actividad.slug).toBe(true)
    }
  })

  it('el submenú tiene un item por actividad con su ruta', () => {
    expect(SEMANA_SISTEMICA_MENU.map(item => item.href)).toEqual(actividades.map(actividad => actividad.ruta))
    expect(SEMANA_SISTEMICA_MENU.map(item => item.label)).toEqual(['Comparsa', 'Programación', 'eSports', 'Reinado', 'Hackathon', 'Deportes'])
    expect(new Set(SEMANA_SISTEMICA_MENU.map(item => item.id)).size).toBe(SEMANA_SISTEMICA_MENU.length)
  })

  it('actividadPorSlug rechaza un slug desconocido', () => {
    expect(() => actividadPorSlug('natacion' as never)).toThrow('Actividad desconocida')
  })
})

describe('rutaEnGrupo', () => {
  const grupo = [RUTA_SEMANA_SISTEMICA]

  it('reconoce la ruta del grupo y sus páginas hijas', () => {
    expect(rutaEnGrupo('/semana-sistemica', grupo)).toBe(true)
    expect(rutaEnGrupo('/semana-sistemica/comparsa', grupo)).toBe(true)
    expect(rutaEnGrupo('/semana-sistemica/', grupo)).toBe(true)
  })

  it('no confunde rutas con el mismo comienzo', () => {
    expect(rutaEnGrupo('/semana-sistemica-2025', grupo)).toBe(false)
    expect(rutaEnGrupo('/semana', grupo)).toBe(false)
    expect(rutaEnGrupo('/sede', grupo)).toBe(false)
    expect(rutaEnGrupo('/', grupo)).toBe(false)
  })

  it('acepta varias rutas, como el grupo «Ponencias»', () => {
    const ponencias = ['/ponentes', '/ponencias-especializadas']
    expect(rutaEnGrupo('/ponentes', ponencias)).toBe(true)
    expect(rutaEnGrupo('/ponencias-especializadas/x', ponencias)).toBe(true)
    expect(rutaEnGrupo('/semana-sistemica/comparsa', ponencias)).toBe(false)
  })
})

describe('inscripcionAbierta', () => {
  const cierre = '2026-10-15T23:59:59-05:00'
  const instante = (iso: string) => Date.parse(iso)

  it('está abierta hasta el último segundo del cierre en hora de Lima', () => {
    expect(inscripcionAbierta(cierre, instante('2026-10-15T09:00:00-05:00'))).toBe(true)
    expect(inscripcionAbierta(cierre, instante('2026-10-15T23:59:59-05:00'))).toBe(true)
  })

  it('se cierra pasada la medianoche de Lima', () => {
    expect(inscripcionAbierta(cierre, instante('2026-10-16T00:00:00-05:00'))).toBe(false)
    expect(inscripcionAbierta(cierre, instante('2026-10-20T12:00:00-05:00'))).toBe(false)
  })

  it('usa la hora de Lima y no la del servidor: 23:30 en Lima sigue abierto aunque en UTC ya sea el 16', () => {
    expect(inscripcionAbierta(cierre, instante('2026-10-16T04:30:00Z'))).toBe(true)
    expect(inscripcionAbierta(cierre, instante('2026-10-16T05:00:00Z'))).toBe(false)
  })

  it('con un cierre ausente o ilegible deja la inscripción abierta', () => {
    expect(inscripcionAbierta(undefined, Date.now())).toBe(true)
    expect(inscripcionAbierta('', Date.now())).toBe(true)
    expect(inscripcionAbierta('pronto', Date.now())).toBe(true)
  })

  it('el Reinado ya cerró después del 15 de octubre y Deportes sigue abierto a mitad de mes', () => {
    const reinado = actividadPorSlug('reinado').inscripcion.cierre
    const deportes = actividadPorSlug('deportes').inscripcion.cierre
    expect(inscripcionAbierta(reinado, instante('2026-10-16T08:00:00-05:00'))).toBe(false)
    expect(inscripcionAbierta(deportes, instante('2026-10-16T08:00:00-05:00'))).toBe(true)
    expect(inscripcionAbierta(deportes, instante('2026-10-26T00:00:00-05:00'))).toBe(false)
  })
})

describe('cronograma y actividades de la Semana Sistémica', () => {
  const diaDelCronograma = (fecha: string) => {
    const [anio, mes, dia] = fecha.split('-')
    return schedule.find(item => item.date === `${dia}/${mes}` && anio === '2026')
  }

  it('cada actividad tiene su día en el cronograma y el primer evento enlazado empieza a su hora', () => {
    for (const actividad of actividades) {
      const dia = diaDelCronograma(actividad.fecha)
      expect(dia, actividad.slug).toBeDefined()
      const enlazado = dia?.events.find(event => event.href === actividad.ruta)
      expect(enlazado, actividad.slug).toBeDefined()
      expect(enlazado?.time.startsWith(actividad.horaInicio), `${actividad.slug}: ${enlazado?.time}`).toBe(true)
    }
  })

  it('el viernes de deportes cierra con la premiación a la hora final de la actividad', () => {
    const deportes = actividadPorSlug('deportes')
    const eventos = diaDelCronograma(deportes.fecha)?.events ?? []
    expect(eventos.at(-1)?.title).toBe('Premiación')
    expect(eventos.at(-1)?.time.startsWith(deportes.horaFin ?? '')).toBe(true)
  })
})
