import { describe, expect, it } from 'vitest'
import { etiquetaClasificacion, mapearClasificaciones } from '../app/utils/catalogos'

describe('clasificaciones del catálogo', () => {
  it('muestra el ciclo sin el prefijo "ESTUDIANTE - "', () => {
    expect(etiquetaClasificacion('ESTUDIANTE - IV CICLO')).toBe('IV CICLO')
    expect(etiquetaClasificacion('estudiante -  X CICLO')).toBe('X CICLO')
    expect(etiquetaClasificacion('EGRESADO')).toBe('EGRESADO')
  })

  it('convierte el catálogo en opciones y descarta entradas inválidas', () => {
    expect(mapearClasificaciones([
      { id: 1, nombre: 'ESTUDIANTE - I CICLO' },
      { id: 0, nombre: 'CERO' },
      { id: 2, nombre: '  ' },
      { id: 10, nombre: 'ESTUDIANTE - X CICLO' },
    ])).toEqual([{ id: 1, etiqueta: 'I CICLO' }, { id: 10, etiqueta: 'X CICLO' }])
    expect(mapearClasificaciones(null)).toEqual([])
  })
})
