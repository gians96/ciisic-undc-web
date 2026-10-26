import { describe, expect, it } from 'vitest'
import { MAXIMO_TECNOLOGIAS, TECNOLOGIAS } from '../app/data/tecnologias'
import {
  acentoDe,
  ACENTO_POR_DEFECTO,
  alternarTecnologia,
  esCodigoCredencial,
  filtrarCatalogo,
  hacerPrincipal,
  mensajeCredencial,
  mensajeGuardado,
  mismaSeleccion,
  nombreCompleto,
  normalizarSeleccion,
  REGEX_CODIGO_CREDENCIAL,
  rolDeCredencial,
  tecnologiasDe,
} from '../app/utils/credencial'

const datos = {
  nombres: ' Ana María ',
  apellidos: 'Pérez  López',
  codigo: 'K7Q2M9X4TB',
  clasificacion: null,
  tipo: { nombre: 'General', etiqueta: 'CON KIT' },
  evento: { nombre: 'VIII Congreso', nombreCorto: 'VIII CIISIC 2026' },
}

describe('código de la credencial', () => {
  it.each([
    ['K7Q2M9X4TB'],
    ['k7q2m9x4tb'], // el enlace tecleado a mano se normaliza
    ['  K7Q2M9X4TB  '],
  ])('reconoce el código %j', (codigo) => {
    expect(esCodigoCredencial(codigo)).toBe(true)
  })

  it.each([
    ['K7Q2M9X4T'], // de menos
    ['K7Q2M9X4TBB'], // de más
    ['K7Q2M9X4T-B'], // guion
    ['K7Q2M9X4T0!'], // carácter inválido
    [''],
    [null],
    [undefined],
    [42],
  ])('rechaza %j', (codigo) => {
    expect(esCodigoCredencial(codigo)).toBe(false)
  })

  it('usa el mismo formato que el backend (10 en mayúsculas)', () => {
    expect(REGEX_CODIGO_CREDENCIAL.test('K7Q2M9X4TB')).toBe(true)
    expect(REGEX_CODIGO_CREDENCIAL.source).toBe('^[0-9A-Z]{10}$')
  })
})

describe('datos de la credencial', () => {
  it('arma el nombre completo normalizando espacios', () => {
    expect(nombreCompleto(datos)).toBe('Ana María Pérez López')
    expect(nombreCompleto({ nombres: '', apellidos: '  ' })).toBe('')
  })

  it('el rol es la clasificación, si no el tipo, y si no «Asistente»', () => {
    expect(rolDeCredencial({ clasificacion: 'ESTUDIANTE - IV CICLO', tipo: datos.tipo })).toBe('ESTUDIANTE - IV CICLO')
    expect(rolDeCredencial({ clasificacion: null, tipo: datos.tipo })).toBe('General')
    expect(rolDeCredencial({ clasificacion: null, tipo: null })).toBe('Asistente')
    expect(rolDeCredencial({ clasificacion: '   ', tipo: { nombre: '', etiqueta: '' } })).toBe('Asistente')
  })
})

describe('mensaje cuando la credencial no carga', () => {
  it('distingue enlace inválido, no encontrada, red y error del servidor', () => {
    expect(mensajeCredencial({ statusCode: 422, code: 'INVALID_CODE' })).toMatch(/enlace.*no es válido/i)
    expect(mensajeCredencial({ statusCode: 404, code: 'CREDENTIAL_NOT_FOUND' })).toMatch(/No encontramos/i)
    expect(mensajeCredencial({ statusCode: 0, code: 'NETWORK_ERROR' })).toMatch(/conectar/i)
    expect(mensajeCredencial({ statusCode: 503, code: 'BACKEND_UNAVAILABLE' })).toMatch(/Intenta de nuevo/i)
  })
})

describe('mensaje cuando no se pudo guardar', () => {
  it('distingue el límite de peticiones, la falta de conexión y el resto', () => {
    expect(mensajeGuardado({ statusCode: 429, code: 'RATE_LIMITED' })).toMatch(/muchos cambios/i)
    expect(mensajeGuardado({ statusCode: 0, code: 'NETWORK_ERROR' })).toMatch(/Sin conexión/i)
    expect(mensajeGuardado({ statusCode: 500, code: 'REQUEST_ERROR' })).toMatch(/No pudimos guardar/i)
  })
})

describe('catálogo de tecnologías', () => {
  it('cada id tiene la forma que acepta el backend, sin repetir, y un color hexadecimal', () => {
    const ids = TECNOLOGIAS.map(tech => tech.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const tech of TECNOLOGIAS) {
      expect(tech.id).toMatch(/^[a-z0-9][a-z0-9-]{0,29}$/)
      expect(tech.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(tech.icono).toMatch(/^simple-icons:[a-z0-9]+$/)
    }
  })

  it('conserva los ids de la primera versión (quien ya los eligió no los pierde)', () => {
    const ids = TECNOLOGIAS.map(tech => tech.id)
    for (const id of ['vite', 'vue', 'nuxt', 'typescript', 'chatgpt', 'claude', 'github', 'tailwind', 'react', 'figma']) {
      expect(ids).toContain(id)
    }
  })

  it('el máximo coincide con el del backend (8)', () => {
    expect(MAXIMO_TECNOLOGIAS).toBe(8)
  })
})

describe('tecnologías elegidas', () => {
  it('normalizarSeleccion descarta ids desconocidos, repetidos y valores que no son texto, y corta al máximo', () => {
    expect(normalizarSeleccion(['vue', 'tech-borrada', 42, 'vite', 'vue', null])).toEqual(['vue', 'vite'])
    expect(normalizarSeleccion('vue')).toEqual([])
    expect(normalizarSeleccion(undefined)).toEqual([])
    expect(normalizarSeleccion(TECNOLOGIAS.map(tech => tech.id))).toHaveLength(MAXIMO_TECNOLOGIAS)
  })

  it('al agregar una tecnología pasa al frente y define el color; al repetirla se quita', () => {
    const uno = alternarTecnologia([], 'vue')
    expect(uno).toEqual({ ids: ['vue'], lleno: false })
    const dos = alternarTecnologia(uno.ids, 'claude')
    expect(dos.ids).toEqual(['claude', 'vue'])
    expect(alternarTecnologia(dos.ids, 'claude')).toEqual({ ids: ['vue'], lleno: false })
  })

  it('con el máximo no entra otra: avisa que está lleno y no cambia nada; quitar una libera el cupo', () => {
    const ocho = TECNOLOGIAS.slice(0, MAXIMO_TECNOLOGIAS).map(tech => tech.id)
    const extra = TECNOLOGIAS[MAXIMO_TECNOLOGIAS]!.id
    expect(alternarTecnologia(ocho, extra)).toEqual({ ids: ocho, lleno: true })
    const sin = alternarTecnologia(ocho, ocho[3]!)
    expect(sin.ids).toHaveLength(MAXIMO_TECNOLOGIAS - 1)
    expect(alternarTecnologia(sin.ids, extra).ids[0]).toBe(extra)
  })

  it('un id que no está en el catálogo no se agrega', () => {
    expect(alternarTecnologia(['vue'], 'no-existe')).toEqual({ ids: ['vue'], lleno: false })
  })

  it('hacerPrincipal mueve una ya elegida al frente y no inventa las que no están', () => {
    expect(hacerPrincipal(['vue', 'vite', 'claude'], 'claude')).toEqual(['claude', 'vue', 'vite'])
    expect(hacerPrincipal(['vue'], 'vite')).toEqual(['vue'])
  })

  it('mismaSeleccion compara contenido y orden', () => {
    expect(mismaSeleccion(['vue', 'vite'], ['vue', 'vite'])).toBe(true)
    expect(mismaSeleccion(['vue', 'vite'], ['vite', 'vue'])).toBe(false)
    expect(mismaSeleccion([], [])).toBe(true)
    expect(mismaSeleccion(['vue'], [])).toBe(false)
  })

  it('tecnologiasDe resuelve los ids en el orden dado', () => {
    expect(tecnologiasDe(['claude', 'no-existe', 'vue']).map(t => t.id)).toEqual(['claude', 'vue'])
    expect(tecnologiasDe([])).toEqual([])
  })

  it('el acento es el color de la primera; sin ninguna, el cian del congreso', () => {
    expect(acentoDe(['vue', 'claude'])).toBe('#42B883')
    expect(acentoDe([])).toBe(ACENTO_POR_DEFECTO)
    expect(acentoDe(['no-existe'])).toBe(ACENTO_POR_DEFECTO)
  })

  it('el buscador ignora mayúsculas y tildes y pide todas las palabras', () => {
    const ids = (texto: string) => filtrarCatalogo(TECNOLOGIAS, texto).map(tech => tech.id)
    expect(ids('VUE')).toContain('vue')
    expect(ids('vue')).not.toContain('react')
    expect(ids('node js')).toContain('nodejs')
    expect(ids('c#')).toContain('csharp')
    expect(ids('  ')).toHaveLength(TECNOLOGIAS.length)
    expect(ids('zzzzz')).toEqual([])
  })
})
