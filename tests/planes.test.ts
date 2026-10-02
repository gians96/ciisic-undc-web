import { describe, expect, it } from 'vitest'
import type { CategoriaInscripcionApi } from '../app/types/evento'
import {
  aplicaPrecioInstitucional, avisoPlanesOcultos, debeLimpiarPlan, esCorreoDelDominio, mapearPlanes, planDisponible, precioPlan, tituloPlan,
} from '../app/utils/planes'

// Respuesta real de GET /api/v1/public/events/ciisic-viii-2026/registration-types (recortada)
const categorias: CategoriaInscripcionApi[] = [
  {
    codigo: 'ESTUDIANTES',
    nombre: 'ESTUDIANTES',
    descripcion: null,
    esEstudiantil: true,
    precioDesde: null,
    caracteristicas: null,
    tipos: [
      {
        id: 1,
        codigo: 'estudiantes_con_kit',
        nombre: 'ESTUDIANTES',
        etiqueta: 'CON KIT',
        descripcion: 'La experiencia completa para estudiantes con kit de merchandising oficial.',
        caracteristicas: [
          { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
          { icon: 'heroicons:gift', text: 'Kit de Merchandising Oficial' },
        ],
        precio: 120,
        precioInstitucional: 100,
      },
      {
        id: 2,
        codigo: 'estudiantes_sin_kit',
        nombre: 'ESTUDIANTES',
        etiqueta: 'SIN KIT',
        descripcion: null,
        caracteristicas: [{ icon: 'heroicons:x-mark', text: 'No incluye Kit' }],
        precio: '60.00',
        precioInstitucional: '40.00',
      },
    ],
  },
  {
    codigo: 'PUBLICO_GENERAL',
    nombre: 'PROFESIONALES Y PUBLICO EN GENERAL',
    descripcion: null,
    esEstudiantil: false,
    precioDesde: null,
    caracteristicas: null,
    tipos: [
      {
        id: 3,
        codigo: 'general_con_kit',
        nombre: 'PROFESIONALES Y PUBLICO EN GENERAL CON KIT',
        etiqueta: 'CON KIT',
        descripcion: 'La experiencia completa para profesionales y público en general.',
        caracteristicas: null,
        precio: 140,
        precioInstitucional: null,
      },
      {
        id: 4,
        codigo: 'general_sin_kit',
        nombre: 'PROFESIONALES Y PUBLICO EN GENERAL',
        etiqueta: 'SIN KIT',
        descripcion: null,
        caracteristicas: null,
        precio: 80,
        precioInstitucional: 80,
        disponiblePara: 'EXTERNOS',
      },
    ],
  },
]

describe('mapearPlanes', () => {
  it('convierte los tipos de la API en tarjetas con la forma actual', () => {
    const [conKit, sinKit, general] = mapearPlanes(categorias)
    expect(conKit).toEqual({
      id: 1,
      codigo: 'estudiantes_con_kit',
      title: 'ESTUDIANTES CON KIT',
      badge: 'CON KIT',
      basePrice: 120,
      institutionalPrice: 100,
      description: 'La experiencia completa para estudiantes con kit de merchandising oficial.',
      features: [
        { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
        { icon: 'heroicons:gift', text: 'Kit de Merchandising Oficial' },
      ],
      categoria: 'ESTUDIANTES',
      esEstudiantil: true,
      // sin el campo (backend anterior) el plan se ofrece a todos
      disponiblePara: 'TODOS',
    })
    expect(sinKit).toMatchObject({ title: 'ESTUDIANTES SIN KIT', basePrice: 60, institutionalPrice: 40, description: '' })
    expect(general).toMatchObject({
      title: 'PROFESIONALES Y PUBLICO EN GENERAL CON KIT',
      features: [],
      esEstudiantil: false,
      // sin precio institucional se muestra el regular
      institutionalPrice: 140,
    })
  })

  it('descarta tipos sin id o sin precio válido y características mal formadas', () => {
    const planes = mapearPlanes([{
      ...categorias[0]!,
      tipos: [
        { id: 0, codigo: 'x', nombre: 'X', etiqueta: null, descripcion: null, caracteristicas: null, precio: 10, precioInstitucional: 5 },
        { id: 9, codigo: 'y', nombre: 'Y', etiqueta: null, descripcion: null, caracteristicas: null, precio: 'gratis', precioInstitucional: 5 },
        {
          id: 10, codigo: 'z', nombre: 'Z', etiqueta: '', descripcion: null, precio: 0, precioInstitucional: 0,
          caracteristicas: [{ icon: 'heroicons:ticket', text: '  Acceso  ' }, { icon: 'heroicons:ticket', text: '' }, null as never],
        },
      ],
    }])
    expect(planes).toHaveLength(1)
    expect(planes[0]).toMatchObject({ id: 10, title: 'Z', badge: '', basePrice: 0, features: [{ icon: 'heroicons:ticket', text: 'Acceso' }] })
  })

  it('conserva a quién se ofrece el plan y trata un valor desconocido como TODOS', () => {
    expect(mapearPlanes(categorias).find(plan => plan.codigo === 'general_sin_kit')).toMatchObject({ badge: 'SIN KIT', disponiblePara: 'EXTERNOS' })
    const [desconocido] = mapearPlanes([{ ...categorias[1]!, tipos: [{ ...categorias[1]!.tipos[0]!, disponiblePara: 'SOLO_UNDC' as never }] }])
    expect(desconocido?.disponiblePara).toBe('TODOS')
  })

  it('tolera respuestas vacías', () => {
    expect(mapearPlanes(null)).toEqual([])
    expect(mapearPlanes([{ ...categorias[0]!, tipos: [] }])).toEqual([])
  })
})

describe('tituloPlan', () => {
  it('agrega la etiqueta solo si el nombre no la contiene (sin importar tildes)', () => {
    expect(tituloPlan('ESTUDIANTES', 'CON KIT')).toBe('ESTUDIANTES CON KIT')
    expect(tituloPlan('PÚBLICO GENERAL SIN KIT', 'sin kit')).toBe('PÚBLICO GENERAL SIN KIT')
    expect(tituloPlan('ESTUDIANTES', null)).toBe('ESTUDIANTES')
  })
})

describe('regla de precio (réplica informativa del backend)', () => {
  it('estudiantil: precio UNDC solo con estudiante verificado', () => {
    expect(aplicaPrecioInstitucional({ esEstudiantil: true, esEstudianteUndc: true, correoInstitucional: false })).toBe(true)
    expect(aplicaPrecioInstitucional({ esEstudiantil: true, esEstudianteUndc: false, correoInstitucional: true })).toBe(false)
  })

  it('general: precio institucional por dominio del correo', () => {
    expect(aplicaPrecioInstitucional({ esEstudiantil: false, esEstudianteUndc: false, correoInstitucional: true })).toBe(true)
    expect(aplicaPrecioInstitucional({ esEstudiantil: false, esEstudianteUndc: true, correoInstitucional: false })).toBe(false)
  })

  it('precioPlan elige el monto correspondiente', () => {
    expect(precioPlan({ basePrice: 120, institutionalPrice: 100 }, true)).toBe(100)
    expect(precioPlan({ basePrice: 120, institutionalPrice: 100 }, false)).toBe(120)
  })

  it('esCorreoDelDominio compara el dominio exacto', () => {
    expect(esCorreoDelDominio('Ana@UNDC.edu.pe', 'undc.edu.pe')).toBe(true)
    expect(esCorreoDelDominio('ana@alumnos.undc.edu.pe', 'undc.edu.pe')).toBe(false)
    expect(esCorreoDelDominio('ana@undc.edu.pe.com', 'undc.edu.pe')).toBe(false)
    expect(esCorreoDelDominio('@undc.edu.pe', 'undc.edu.pe')).toBe(false)
    expect(esCorreoDelDominio('ana@undc.edu.pe', '')).toBe(false)
  })
})

describe('disponibilidad del plan (spec 016 del backend)', () => {
  it.each([
    ['TODOS', true, true],
    ['TODOS', false, true],
    ['INSTITUCIONAL', true, true],
    ['INSTITUCIONAL', false, false],
    ['EXTERNOS', true, false],
    ['EXTERNOS', false, true],
  ] as const)('%s con precio institucional=%s → se muestra=%s', (disponiblePara, institucional, esperado) => {
    expect(planDisponible({ disponiblePara }, institucional)).toBe(esperado)
  })

  it('con correo UNDC en /general solo queda el plan con kit (a su precio UNDC)', () => {
    const planes = mapearPlanes([categorias[1]!])
    const visibles = (institucional: boolean) => planes.filter(plan => planDisponible(plan, institucional)).map(plan => plan.codigo)
    expect(visibles(true)).toEqual(['general_con_kit'])
    expect(visibles(false)).toEqual(['general_con_kit', 'general_sin_kit'])
  })

  it('limpia la selección si el plan ya no se ofrece, salvo durante una verificación', () => {
    expect(debeLimpiarPlan({ planId: 4, disponibles: [3], verificando: false })).toBe(true)
    expect(debeLimpiarPlan({ planId: 4, disponibles: [3], verificando: true })).toBe(false)
    expect(debeLimpiarPlan({ planId: 3, disponibles: [3], verificando: false })).toBe(false)
    expect(debeLimpiarPlan({ planId: null, disponibles: [], verificando: false })).toBe(false)
  })

  it('explica por qué no se ven todos los planes', () => {
    expect(avisoPlanesOcultos({ ocultos: [], dominio: 'undc.edu.pe' })).toBeNull()
    expect(avisoPlanesOcultos({ ocultos: [{ disponiblePara: 'EXTERNOS', esEstudiantil: false }], dominio: 'undc.edu.pe' }))
      .toBe('Con un correo @undc.edu.pe solo se muestran los planes para la comunidad UNDC.')
    expect(avisoPlanesOcultos({ ocultos: [{ disponiblePara: 'EXTERNOS', esEstudiantil: true }], dominio: 'undc.edu.pe' }))
      .toContain('estudiante UNDC verificado')
    expect(avisoPlanesOcultos({ ocultos: [{ disponiblePara: 'INSTITUCIONAL', esEstudiantil: false }], dominio: 'undc.edu.pe' }))
      .toContain('aparecen al escribir un correo @undc.edu.pe')
    expect(avisoPlanesOcultos({ ocultos: [{ disponiblePara: 'INSTITUCIONAL', esEstudiantil: true }], dominio: 'undc.edu.pe' }))
      .toContain('usa tu correo @undc.edu.pe para verificarte')
  })
})
