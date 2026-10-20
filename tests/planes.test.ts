import { describe, expect, it } from 'vitest'
import type { CategoriaInscripcionApi } from '../app/types/evento'
import {
  agruparPlanesPorModalidad, aModalidad, aplicaPrecioInstitucional, avisoCorreoInstitucional, avisoPlanesOcultos, categoriasConPlanesVirtuales,
  claseBadgePlan, debeLimpiarPlan, esCorreoDelDominio, etiquetaAccesiblePlan, hayDescuentoInstitucional, hayPlanesPresenciales,
  hayPlanesVirtuales, mapearPlanes, planDisponible, precioDesdeVirtual, precioPlan, resumirOfertaVirtual, tituloPlan,
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

// Tipos virtuales (spec 018 del backend) dentro de las categorías existentes: precio == precio institucional
// y disponibles para todos. Constante APARTE: otros casos dependen del orden y el contenido de `categorias`.
const categoriasVirtual: CategoriaInscripcionApi[] = [
  {
    codigo: 'ESTUDIANTES',
    nombre: 'ESTUDIANTES',
    descripcion: null,
    esEstudiantil: true,
    precioDesde: null,
    caracteristicas: null,
    tipos: [
      {
        id: 5,
        codigo: 'estudiantes_virtual',
        nombre: 'ESTUDIANTES',
        etiqueta: 'VIRTUAL',
        descripcion: null,
        caracteristicas: [
          { icon: 'heroicons:computer-desktop', text: 'Participación virtual en las ponencias transmitidas' },
          { icon: 'heroicons:x-mark', text: 'No incluye kit ni ingreso presencial' },
        ],
        precio: '30.00',
        precioInstitucional: '30.00',
        disponiblePara: 'TODOS',
        modalidad: 'VIRTUAL',
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
        id: 6,
        codigo: 'general_virtual',
        nombre: 'PROFESIONALES Y PUBLICO EN GENERAL',
        etiqueta: 'VIRTUAL',
        descripcion: null,
        caracteristicas: null,
        precio: '50.00',
        precioInstitucional: '50.00',
        disponiblePara: 'TODOS',
        modalidad: 'VIRTUAL',
      },
    ],
  },
]

/** Respuesta del backend con los tipos virtuales dentro de cada categoría, después de los presenciales. */
const categoriasMixtas: CategoriaInscripcionApi[] = categorias.map(categoria => ({
  ...categoria,
  tipos: [...categoria.tipos, ...(categoriasVirtual.find(virtual => virtual.codigo === categoria.codigo)?.tipos ?? [])],
}))

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
      // sin el campo (backend anterior) la asistencia es presencial
      modalidad: 'PRESENCIAL',
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

describe('modalidad de asistencia (spec 018 del backend)', () => {
  it.each([
    [undefined, 'PRESENCIAL'],
    [null, 'PRESENCIAL'],
    ['', 'PRESENCIAL'],
    ['HIBRIDA', 'PRESENCIAL'],
    ['virtual', 'PRESENCIAL'],
    [1, 'PRESENCIAL'],
    ['PRESENCIAL', 'PRESENCIAL'],
    ['VIRTUAL', 'VIRTUAL'],
  ])('aModalidad(%j) → %s', (valor, esperado) => {
    expect(aModalidad(valor)).toBe(esperado)
  })

  it('un backend sin el campo deja todos los planes como PRESENCIAL (nada cambia)', () => {
    const planes = mapearPlanes(categorias)
    expect(planes).toHaveLength(4)
    expect(planes.every(plan => plan.modalidad === 'PRESENCIAL')).toBe(true)
  })

  it('null o un valor desconocido también es PRESENCIAL', () => {
    const [tipo] = categorias[0]!.tipos
    const planes = mapearPlanes([{
      ...categorias[0]!,
      tipos: [
        { ...tipo!, id: 21, modalidad: null },
        { ...tipo!, id: 22, modalidad: 'HIBRIDA' as never },
        { ...tipo!, id: 23, modalidad: 'VIRTUAL' },
      ],
    }])
    expect(planes.map(plan => plan.modalidad)).toEqual(['PRESENCIAL', 'PRESENCIAL', 'VIRTUAL'])
  })

  it('conserva la modalidad VIRTUAL con su categoría y su insignia', () => {
    const planes = mapearPlanes(categoriasVirtual)
    expect(planes).toHaveLength(2)
    expect(planes[0]).toEqual({
      id: 5,
      codigo: 'estudiantes_virtual',
      title: 'ESTUDIANTES VIRTUAL',
      badge: 'VIRTUAL',
      basePrice: 30,
      institutionalPrice: 30,
      description: '',
      features: [
        { icon: 'heroicons:computer-desktop', text: 'Participación virtual en las ponencias transmitidas' },
        { icon: 'heroicons:x-mark', text: 'No incluye kit ni ingreso presencial' },
      ],
      categoria: 'ESTUDIANTES',
      esEstudiantil: true,
      disponiblePara: 'TODOS',
      modalidad: 'VIRTUAL',
    })
    expect(planes[1]).toMatchObject({
      codigo: 'general_virtual',
      title: 'PROFESIONALES Y PUBLICO EN GENERAL VIRTUAL',
      basePrice: 50,
      institutionalPrice: 50,
      categoria: 'PUBLICO_GENERAL',
      esEstudiantil: false,
    })
  })

  it('tituloPlan no duplica VIRTUAL si el nombre ya lo trae', () => {
    expect(tituloPlan('ESTUDIANTES', 'VIRTUAL')).toBe('ESTUDIANTES VIRTUAL')
    expect(tituloPlan('ESTUDIANTES VIRTUAL', 'virtual')).toBe('ESTUDIANTES VIRTUAL')
  })

  it('el precio es el mismo con cualquier condición UNDC y ningún plan virtual se oculta', () => {
    const virtuales = mapearPlanes(categoriasVirtual)
    for (const plan of virtuales) {
      for (const esEstudianteUndc of [true, false]) {
        for (const correoInstitucional of [true, false]) {
          const institucional = aplicaPrecioInstitucional({ esEstudiantil: plan.esEstudiantil, esEstudianteUndc, correoInstitucional })
          expect(precioPlan(plan, institucional)).toBe(plan.basePrice)
          expect(planDisponible(plan, institucional)).toBe(true)
        }
      }
      expect(precioPlan(plan, true)).toBe(precioPlan(plan, false))
    }
    // sin planes ocultos no hay aviso que explicar
    const ocultos = virtuales.filter(plan => !planDisponible(plan, true) || !planDisponible(plan, false))
    expect(avisoPlanesOcultos({ ocultos, dominio: 'undc.edu.pe' })).toBeNull()
  })

  it('hayDescuentoInstitucional: falso con 30/30 y 50/50, verdadero si algún plan cuesta menos para la comunidad UNDC', () => {
    expect(hayDescuentoInstitucional(mapearPlanes(categoriasVirtual))).toBe(false)
    expect(hayDescuentoInstitucional([])).toBe(false)
    expect(hayDescuentoInstitucional(mapearPlanes([categorias[0]!]))).toBe(true) // 120 / 100
    expect(hayDescuentoInstitucional(mapearPlanes([categorias[1]!]))).toBe(false) // 140 sin institucional y 80 / 80
    expect(hayDescuentoInstitucional(mapearPlanes(categoriasMixtas))).toBe(true)
  })

  it('claseBadgePlan: VIRTUAL es de éxito aunque la etiqueta contenga «SIN»; en lo presencial se conserva la regla', () => {
    expect(claseBadgePlan({ badge: 'VIRTUAL', modalidad: 'VIRTUAL' })).toBe('badge-success')
    expect(claseBadgePlan({ badge: 'SINCRÓNICO', modalidad: 'VIRTUAL' })).toBe('badge-success')
    expect(claseBadgePlan({ badge: 'SINCRÓNICO', modalidad: 'PRESENCIAL' })).toBe('badge-warning')
    expect(claseBadgePlan({ badge: 'SIN KIT', modalidad: 'PRESENCIAL' })).toBe('badge-warning')
    expect(claseBadgePlan({ badge: 'CON KIT', modalidad: 'PRESENCIAL' })).toBe('badge-success')
  })
})

describe('aviso del correo institucional (SC-001: lo presencial no cambia)', () => {
  const CON_DESCUENTO = 'Correo institucional - Se aplicará descuento UNDC'

  /** Lo que ve alguien con correo @undc.edu.pe: los planes de las categorías, filtrados como el formulario. */
  const visiblesConCorreoUndc = (respuesta: CategoriaInscripcionApi[]) => {
    const planes = mapearPlanes(respuesta)
    return planes.filter(plan => planDisponible(plan, aplicaPrecioInstitucional({
      esEstudiantil: plan.esEstudiantil,
      esEstudianteUndc: false,
      correoInstitucional: true,
    })))
  }

  it('solo presencial: el texto de siempre aunque ningún plan visible tenga descuento (respuesta real de /general)', () => {
    const visibles = visiblesConCorreoUndc([categorias[1]!]) // CON KIT 140 sin institucional; SIN KIT es solo para externos
    expect(visibles.map(plan => plan.codigo)).toEqual(['general_con_kit'])
    expect(hayDescuentoInstitucional(visibles)).toBe(false)
    expect(avisoCorreoInstitucional(visibles)).toBe(CON_DESCUENTO)
  })

  it('solo presencial con descuento y sin planes: el texto de siempre', () => {
    expect(avisoCorreoInstitucional(visiblesConCorreoUndc([categorias[0]!]))).toBe(CON_DESCUENTO)
    expect(avisoCorreoInstitucional([])).toBe(CON_DESCUENTO)
  })

  it('con planes virtuales y ningún descuento a la vista: reconoce el dominio sin prometer un descuento', () => {
    const general = visiblesConCorreoUndc([{ ...categorias[1]!, tipos: [...categorias[1]!.tipos, ...categoriasVirtual[1]!.tipos] }])
    expect(general.map(plan => plan.codigo)).toEqual(['general_con_kit', 'general_virtual'])
    expect(avisoCorreoInstitucional(general)).toBe('Correo institucional')
    expect(avisoCorreoInstitucional(visiblesConCorreoUndc(categoriasVirtual))).toBe('Correo institucional')
  })

  it('con planes virtuales pero algún plan presencial con descuento: sigue anunciándolo', () => {
    expect(avisoCorreoInstitucional(visiblesConCorreoUndc(categoriasMixtas))).toBe(CON_DESCUENTO)
  })
})

describe('etiqueta accesible de la tarjeta', () => {
  it('lo presencial queda como siempre: «título, precio»', () => {
    const [conKit] = mapearPlanes(categorias)
    expect(etiquetaAccesiblePlan({ ...conKit!, price: 'S/ 120.00' })).toBe('ESTUDIANTES CON KIT, S/ 120.00')
    expect(etiquetaAccesiblePlan({ title: 'X VIRTUAL', modalidad: 'PRESENCIAL', price: 'S/ 1.00' })).toBe('X VIRTUAL, S/ 1.00')
  })

  it('un plan virtual cuyo título ya dice «virtual» no lo repite', () => {
    const [virtual] = mapearPlanes(categoriasVirtual)
    expect(etiquetaAccesiblePlan({ ...virtual!, price: 'S/ 30.00' })).toBe('ESTUDIANTES VIRTUAL, S/ 30.00')
  })

  it('un plan virtual cuyo título no lo dice lo añade (el encabezado del grupo está oculto a los lectores de pantalla)', () => {
    const etiquetaSinVirtual = { ...categoriasVirtual[0]!.tipos[0]!, etiqueta: 'ONLINE' }
    const [virtual] = mapearPlanes([{ ...categoriasVirtual[0]!, tipos: [etiquetaSinVirtual] }])
    expect(virtual!.title).toBe('ESTUDIANTES ONLINE')
    expect(etiquetaAccesiblePlan({ ...virtual!, price: 'S/ 30.00' })).toBe('ESTUDIANTES ONLINE, S/ 30.00, modalidad virtual')
  })
})

describe('agrupación de planes por modalidad', () => {
  const codigos = (planes: { codigo: string }[]) => planes.map(plan => plan.codigo)

  it('solo presencial (hoy): un único grupo sin encabezado y en el mismo orden', () => {
    const planes = mapearPlanes(categorias)
    const grupos = agruparPlanesPorModalidad(planes)
    expect(grupos).toHaveLength(1)
    expect(grupos[0]).toMatchObject({ modalidad: 'PRESENCIAL', titulo: null })
    expect(codigos(grupos[0]!.planes)).toEqual(codigos(planes))
  })

  it('con las dos modalidades: Presencial primero y luego Virtual (en línea), cada una con su encabezado', () => {
    const grupos = agruparPlanesPorModalidad(mapearPlanes(categoriasMixtas))
    expect(grupos.map(grupo => [grupo.modalidad, grupo.titulo])).toEqual([
      ['PRESENCIAL', 'Presencial'],
      ['VIRTUAL', 'Virtual (en línea)'],
    ])
    expect(codigos(grupos[0]!.planes)).toEqual(['estudiantes_con_kit', 'estudiantes_sin_kit', 'general_con_kit', 'general_sin_kit'])
    expect(codigos(grupos[1]!.planes)).toEqual(['estudiantes_virtual', 'general_virtual'])
  })

  it('lo presencial va primero aunque el backend entregue antes lo virtual', () => {
    const virtualPrimero = [...mapearPlanes(categoriasVirtual), ...mapearPlanes(categorias)]
    const grupos = agruparPlanesPorModalidad(virtualPrimero)
    expect(grupos.map(grupo => grupo.modalidad)).toEqual(['PRESENCIAL', 'VIRTUAL'])
    expect(codigos(grupos[1]!.planes)).toEqual(['estudiantes_virtual', 'general_virtual'])
  })

  it('solo virtual (p. ej. una sola modalidad a la vista): un grupo sin encabezado', () => {
    const grupos = agruparPlanesPorModalidad(mapearPlanes(categoriasVirtual))
    expect(grupos).toHaveLength(1)
    expect(grupos[0]).toMatchObject({ modalidad: 'VIRTUAL', titulo: null })
  })

  it('sin planes no hay grupos, y conserva las propiedades extra de cada plan (p. ej. el precio mostrado)', () => {
    expect(agruparPlanesPorModalidad([])).toEqual([])
    const [plan] = mapearPlanes(categoriasVirtual)
    const [grupo] = agruparPlanesPorModalidad([{ ...plan!, price: 'S/ 30.00' }])
    expect(grupo!.planes[0]!.price).toBe('S/ 30.00')
  })

  it('hayPlanesVirtuales y hayPlanesPresenciales (el kit solo se ofrece si hay algo presencial)', () => {
    expect(hayPlanesVirtuales(mapearPlanes(categorias))).toBe(false)
    expect(hayPlanesVirtuales(mapearPlanes(categoriasMixtas))).toBe(true)
    expect(hayPlanesVirtuales([])).toBe(false)
    expect(hayPlanesPresenciales(mapearPlanes(categorias))).toBe(true)
    expect(hayPlanesPresenciales(mapearPlanes(categoriasMixtas))).toBe(true)
    expect(hayPlanesPresenciales(mapearPlanes(categoriasVirtual))).toBe(false)
    expect(hayPlanesPresenciales([])).toBe(false)
  })
})

describe('oferta virtual en /planes', () => {
  it('precioDesdeVirtual toma el mínimo entre los planes virtuales e ignora los presenciales', () => {
    expect(precioDesdeVirtual(mapearPlanes(categoriasVirtual))).toBe(30)
    expect(precioDesdeVirtual([
      { modalidad: 'PRESENCIAL', basePrice: 10 },
      { modalidad: 'VIRTUAL', basePrice: 50 },
      { modalidad: 'VIRTUAL', basePrice: 70 },
    ])).toBe(50)
  })

  it('el monto sale de la API: si cambia el precio, cambia el mínimo', () => {
    const baratos = categoriasVirtual.map(categoria => ({
      ...categoria,
      tipos: categoria.tipos.map(tipo => ({ ...tipo, precio: 25, precioInstitucional: 25 })),
    }))
    expect(precioDesdeVirtual(mapearPlanes(baratos))).toBe(25)
  })

  it('sin planes virtuales no hay precio ni resumen (la franja se oculta)', () => {
    expect(precioDesdeVirtual(mapearPlanes(categorias))).toBeNull()
    expect(precioDesdeVirtual([])).toBeNull()
    expect(resumirOfertaVirtual(mapearPlanes(categorias))).toBeNull()
    expect(resumirOfertaVirtual([])).toBeNull()
  })

  it('categoriasConPlanesVirtuales no repite categorías y respeta el orden recibido', () => {
    expect(categoriasConPlanesVirtuales(mapearPlanes(categoriasMixtas))).toEqual(['ESTUDIANTES', 'PUBLICO_GENERAL'])
    expect(categoriasConPlanesVirtuales(mapearPlanes([categoriasVirtual[1]!]))).toEqual(['PUBLICO_GENERAL'])
    expect(categoriasConPlanesVirtuales([...mapearPlanes(categoriasVirtual), ...mapearPlanes(categoriasVirtual)])).toEqual(['ESTUDIANTES', 'PUBLICO_GENERAL'])
    expect(categoriasConPlanesVirtuales(mapearPlanes(categorias))).toEqual([])
  })

  it('resumirOfertaVirtual junta el mínimo y las categorías con planes virtuales', () => {
    expect(resumirOfertaVirtual(mapearPlanes(categoriasMixtas))).toEqual({ desde: 30, categorias: ['ESTUDIANTES', 'PUBLICO_GENERAL'] })
    // si falla la carga de una categoría solo suma la otra
    expect(resumirOfertaVirtual(mapearPlanes([categoriasVirtual[1]!]))).toEqual({ desde: 50, categorias: ['PUBLICO_GENERAL'] })
  })
})
