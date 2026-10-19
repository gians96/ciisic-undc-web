import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { encuentroEgresados } from '../app/data/encuentro-egresados'

const resolverRutaPublica = (ruta: string) => resolve(process.cwd(), 'public', ruta.replace(/^\//, ''))
const resolverRutaProyecto = (ruta: string) => resolve(process.cwd(), ruta)

describe('afiche oficial del Encuentro de Egresados', () => {
  it('declara los recursos finales con proporción vertical A4 y descarga descriptiva', () => {
    const { afiche } = encuentroEgresados

    expect(afiche).toMatchObject({
      original: '/images/encuentro-egresados/afiche-oficial-encuentro-egresados-2026.png',
      preview: '/images/encuentro-egresados/afiche-oficial-encuentro-egresados-2026.webp',
      nombreDescarga: 'Afiche-oficial-Encuentro-de-Egresados-2026.png',
      ancho: 1414,
      alto: 2000,
    })
    expect(afiche.ancho / afiche.alto).toBeCloseTo(1 / Math.sqrt(2), 3)
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

  it('ofrece visor accesible, descarga y la lógica compartida de inscripción', () => {
    const componente = readFileSync(resolverRutaProyecto('app/components/encuentro-egresados/AficheOficial.vue'), 'utf8')

    expect(componente).toContain('Ver afiche completo')
    expect(componente).toContain(':download="afiche.nombreDescarga"')
    expect(componente).toContain('role="dialog"')
    expect(componente).toContain('aria-modal="true"')
    expect(componente).toContain("event.key === 'Escape'")
    expect(componente).toContain('useInscripcionEgresados()')
    expect(componente).toContain('target="_blank"')
    expect(componente).toContain('rel="noopener noreferrer"')
    expect(componente).not.toContain('https://forms.gle/')
  })
})
