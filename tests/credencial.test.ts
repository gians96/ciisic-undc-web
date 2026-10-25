import { describe, expect, it } from 'vitest'
import {
  claveDeTecnologias,
  esCodigoCredencial,
  guardarTecnologias,
  mensajeCredencial,
  nombreCompleto,
  REGEX_CODIGO_CREDENCIAL,
  rolDeCredencial,
  tecnologiasDe,
  tecnologiasGuardadas,
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

describe('tecnologías elegidas (solo este dispositivo)', () => {
  /** Almacenamiento simulado con la misma interfaz que usa la página. */
  function almacenInicial(inicial: Record<string, string> = {}) {
    const mapa = new Map(Object.entries(inicial))
    return {
      getItem: (clave: string) => mapa.get(clave) ?? null,
      setItem: (clave: string, valor: string) => { mapa.set(clave, valor) },
      mapa,
    }
  }

  it('la clave se arma con el código en mayúsculas', () => {
    expect(claveDeTecnologias(' k7q2m9x4tb ')).toBe('credencial:K7Q2M9X4TB')
  })

  it('guarda y lee la selección en orden', () => {
    const alm = almacenInicial()
    guardarTecnologias('K7Q2M9X4TB', ['vue', 'claude'], alm)
    expect(tecnologiasGuardadas('K7Q2M9X4TB', alm)).toEqual(['vue', 'claude'])
    expect(alm.mapa.get('credencial:K7Q2M9X4TB')).toBe('["vue","claude"]')
  })

  it('descarta ids que ya no existen en el catálogo (versiones viejas)', () => {
    const alm = almacenInicial({ 'credencial:K7Q2M9X4TB': JSON.stringify(['vue', 'tech-borrada', 42, 'vite']) })
    expect(tecnologiasGuardadas('K7Q2M9X4TB', alm)).toEqual(['vue', 'vite'])
    guardarTecnologias('K7Q2M9X4TB', ['nuxt', 'no-existe'], alm)
    expect(tecnologiasGuardadas('K7Q2M9X4TB', alm)).toEqual(['nuxt'])
  })

  it('con JSON corrupto, sin almacenamiento o con un valor que no es lista, devuelve vacío', () => {
    expect(tecnologiasGuardadas('K7Q2M9X4TB', almacenInicial({ 'credencial:K7Q2M9X4TB': '{corrupto' }))).toEqual([])
    expect(tecnologiasGuardadas('K7Q2M9X4TB', almacenInicial({ 'credencial:K7Q2M9X4TB': '"vue"' }))).toEqual([])
    expect(tecnologiasGuardadas('K7Q2M9X4TB', null)).toEqual([])
    expect(() => guardarTecnologias('K7Q2M9X4TB', ['vue'], null)).not.toThrow()
  })

  it('tecnologiasDe resuelve los ids en el orden dado', () => {
    expect(tecnologiasDe(['claude', 'no-existe', 'vue']).map(t => t.id)).toEqual(['claude', 'vue'])
    expect(tecnologiasDe([])).toEqual([])
  })
})
