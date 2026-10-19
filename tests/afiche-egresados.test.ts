import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { encuentroEgresados } from '../app/data/encuentro-egresados'

const resolverRutaPublica = (ruta: string) => resolve(process.cwd(), 'public', ruta.replace(/^\//, ''))
const resolverRutaProyecto = (ruta: string) => resolve(process.cwd(), ruta)

describe('afiche oficial del Encuentro de Egresados', () => {
  it('declara los recursos finales con la proporción intrínseca y descarga descriptiva', () => {
    const { afiche } = encuentroEgresados

    expect(afiche).toMatchObject({
      original: '/images/encuentro-egresados/afiche-oficial-encuentro-egresados-2026.png',
      preview: '/images/encuentro-egresados/afiche-oficial-encuentro-egresados-2026.webp',
      nombreDescarga: 'Afiche-oficial-Encuentro-de-Egresados-2026.png',
      ancho: 1122,
      alto: 1402,
    })
    expect(afiche.ancho / afiche.alto).not.toBeCloseTo(1 / Math.sqrt(2), 3)
  })

  it('incluye un PNG original y una previsualización WebP válida y más liviana', () => {
    const original = resolverRutaPublica(encuentroEgresados.afiche.original)
    const preview = resolverRutaPublica(encuentroEgresados.afiche.preview)

    expect(existsSync(original)).toBe(true)
    expect(existsSync(preview)).toBe(true)
    expect(readFileSync(original).subarray(1, 4).toString()).toBe('PNG')

    const cabeceraWebp = readFileSync(preview).subarray(0, 12)
    expect(cabeceraWebp.subarray(0, 4).toString()).toBe('RIFF')
    expect(cabeceraWebp.subarray(8, 12).toString()).toBe('WEBP')
    expect(statSync(preview).size).toBeLessThan(statSync(original).size)
  })

  it('ubica la sección antes de la memoria y la galería histórica', () => {
    const pagina = readFileSync(resolverRutaProyecto('app/pages/semana-sistemica/encuentro-egresados.vue'), 'utf8')
    const posicionAfiche = pagina.indexOf('<EncuentroEgresadosAficheOficial')
    const posicionMemoria = pagina.indexOf('experiencia-anterior-title')
    const posicionGaleria = pagina.indexOf('<EncuentroEgresadosGaleria')

    expect(posicionAfiche).toBeGreaterThan(-1)
    expect(posicionAfiche).toBeLessThan(posicionMemoria)
    expect(posicionAfiche).toBeLessThan(posicionGaleria)
  })

  it('ofrece visor accesible y descarga del mismo recurso oficial', () => {
    const componente = readFileSync(resolverRutaProyecto('app/components/encuentro-egresados/AficheOficial.vue'), 'utf8')

    expect(componente).toContain('Ampliar afiche')
    expect(componente).toContain('<source :srcset="afiche.preview" type="image/webp">')
    expect(componente.match(/:src="afiche.original"/g)).toHaveLength(2)
    expect(componente).toContain(':download="afiche.nombreDescarga"')
    expect(componente).toContain('role="dialog"')
    expect(componente).toContain('aria-modal="true"')
    expect(componente).toContain("event.key === 'Escape'")
    expect(componente).not.toContain('useInscripcionEgresados')
    expect(componente).not.toContain('https://forms.gle/')
  })

  it('simplifica la sección del afiche sin retirar la información ni la inscripción principal', () => {
    const componente = readFileSync(resolverRutaProyecto('app/components/encuentro-egresados/AficheOficial.vue'), 'utf8')
    const pagina = readFileSync(resolverRutaProyecto('app/pages/semana-sistemica/encuentro-egresados.vue'), 'utf8')
    const tarjeta = readFileSync(resolverRutaProyecto('app/components/encuentro-egresados/TarjetaInscripcion.vue'), 'utf8')

    expect(componente).toContain('Afiche del Encuentro de Egresados 2026')
    expect(componente).toContain('Conoce el afiche del encuentro y compártelo con otros egresados.')
    expect(componente).not.toContain('Información oficial en un solo vistazo')
    expect(componente).not.toContain('27 de octubre de 2026')
    expect(componente).not.toContain('Casa de la Cultura')
    expect(componente).not.toContain('Inscribirme gratuitamente')
    expect(pagina).toContain('encuentroEgresados.fecha')
    expect(pagina).toContain('encuentroEgresados.lugar')
    expect(tarjeta).toContain('Inscribirme gratuitamente')
  })
})
