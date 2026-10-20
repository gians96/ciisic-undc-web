// ============================================================================
// SEMANA SISTÉMICA: COMPARSA, REINADO Y DEPORTES (contenido estático)
// Fuente de bases y flyers: comisiones de cada actividad, octubre de 2026.
// ============================================================================

export type ActividadSlug = 'comparsa' | 'programacion' | 'esports' | 'reinado' | 'cyber-clash' | 'hackathon' | 'deportes'

export interface ImagenActividad {
  src: string
  alt: string
  /** Tamaño real en píxeles: reserva el espacio y evita saltos de diseño al cargar. */
  ancho: number
  alto: number
}

export interface FilaDato {
  label: string
  valor: string
}

export interface ActividadSemanaSistemica {
  slug: ActividadSlug
  /** Nombre completo, p. ej. «Comparsa Sistémica». */
  nombre: string
  /** Etiqueta corta del menú y del pie de página. */
  etiqueta: string
  icono: string
  /** Ruta de la página, p. ej. `/semana-sistemica/comparsa`. */
  ruta: string
  /** Día de la actividad (`YYYY-MM-DD`). */
  fecha: string
  /** Hora en 24 h (`HH:mm`). */
  horaInicio: string
  horaFin?: string
  /** Hora tal como se muestra al visitante (puede ser «Concentración 2:30 p. m.»). */
  horaTexto: string
  lugar: string
  /** Color de acento de la página (hex); no cambia la identidad visual del sitio. */
  acento: string
  portada: ImagenActividad
  galeria: ImagenActividad[]
  afiche: ImagenActividad
  /**
   * Crédito de la portada cuando la imagen es externa (sin licencia propia).
   * Si está ausente se muestra la insignia «Imagen de edición anterior».
   */
  creditoPortada?: { texto: string, href: string }
  inscripcion: {
    url: string
    /** Texto del botón de inscripción. */
    texto: string
    /** Último instante para inscribirse (ISO con offset de Lima, `-05:00`). */
    cierre: string
    titulo: string
    descripcion: string
    filas: FilaDato[]
  }
  bases: { url: string, texto: string }
  contacto?: { texto: string, href: string }
}

export const RUTA_SEMANA_SISTEMICA = '/semana-sistemica'

const IMAGENES = '/images/semana-sistemica'

const imagen = (src: string, ancho: number, alto: number, alt: string): ImagenActividad => ({ src, ancho, alto, alt })

/** En orden cronológico: lunes 26, martes 27 (programación y eSports), miércoles 28, jueves 29 (Cyber Clash y Hackathon) y viernes 30 de octubre de 2026. */
export const actividades: readonly ActividadSemanaSistemica[] = [
  {
    slug: 'comparsa',
    nombre: 'Comparsa Sistémica',
    etiqueta: 'Comparsa',
    icono: 'heroicons:megaphone',
    ruta: `${RUTA_SEMANA_SISTEMICA}/comparsa`,
    fecha: '2026-10-26',
    horaInicio: '14:30',
    horaTexto: 'Concentración 2:30 p. m.',
    lugar: 'Casa de la Cultura → Plaza de Armas, San Vicente de Cañete',
    acento: '#fbbf24',
    portada: imagen(`${IMAGENES}/comparsa-01.webp`, 1920, 1078, 'Estudiantes y mascotas bailando en la plaza durante la comparsa sistémica de la edición anterior'),
    galeria: [
      imagen(`${IMAGENES}/comparsa-02.webp`, 1600, 898, 'Delegación con disfraces de cartón y arco de globos en la comparsa de la edición anterior'),
      imagen(`${IMAGENES}/comparsa-03.webp`, 1600, 898, 'Estudiantes con máscaras y un dragón azul en la comparsa de la edición anterior'),
      imagen(`${IMAGENES}/comparsa-04.webp`, 1600, 898, 'Foto de grupo de una delegación con polos blanco y morado en la comparsa de la edición anterior'),
    ],
    afiche: imagen(`${IMAGENES}/flyer-comparsa.webp`, 1080, 1440, 'Afiche oficial de la Comparsa Sistémica: lunes 26 de octubre, de la Casa de la Cultura a la Plaza de Armas'),
    inscripcion: {
      url: 'https://forms.gle/CtvPThWie2uBRA9NA',
      texto: 'Inscribir a mi delegación',
      cierre: '2026-10-21T23:59:59-05:00',
      titulo: 'Inscribe a tu delegación',
      descripcion: 'El delegado registra la subtemática, el nombre de la propuesta, la frase de la banderola, el carro alegórico y a los representantes Miss y Míster.',
      filas: [
        { label: 'Inscripciones', valor: 'Del 12 al 21 de octubre de 2026' },
        { label: 'Cuota por salón', valor: 'S/ 30' },
        { label: 'Cuota por ciclo', valor: 'S/ 50' },
        { label: 'Modalidad', valor: 'Delegación por salón o ciclo' },
      ],
    },
    bases: {
      url: 'https://drive.google.com/file/d/1dkGn6y7a5o2riNo3bCJ0OQOX3uLqaDQN/view?usp=sharing',
      texto: 'Ver bases oficiales',
    },
    contacto: { texto: '941 844 379', href: 'tel:+51941844379' },
  },
  {
    slug: 'programacion',
    nombre: 'Concurso de Programación',
    etiqueta: 'Programación',
    icono: 'heroicons:code-bracket',
    ruta: `${RUTA_SEMANA_SISTEMICA}/programacion`,
    fecha: '2026-10-27',
    horaInicio: '17:00',
    horaFin: '19:00',
    horaTexto: '5:00 p. m. a 7:00 p. m. (sustentación desde las 7:00 p. m.)',
    lugar: 'Laboratorios de cómputo del Pabellón Académico de la EPIS, UNDC',
    acento: '#38bdf8',
    portada: imagen('/images/eventos/programacion.webp', 1920, 1570, 'Participantes con computadoras en un concurso de programación anterior'),
    galeria: [],
    afiche: imagen('/images/eventos/programacion.webp', 1920, 1570, 'Imagen del Concurso de Programación de una edición anterior'),
    inscripcion: {
      url: 'https://forms.gle/GgiuzeX27gH74KCJA',
      texto: 'Inscribir a mi equipo',
      cierre: '2026-10-23T20:00:00-05:00',
      titulo: 'Inscribe a tu equipo',
      descripcion: 'Equipos de 2 o 3 estudiantes. La inscripción se completa cuando el Comité de Eventos Académicos verifica el pago.',
      filas: [
        { label: 'Periodo', valor: 'Del 9 al 23 de octubre de 2026' },
        { label: 'Cierre', valor: '23 de octubre, 8:00 p. m.' },
        { label: 'Costo por equipo', valor: 'S/ 15' },
        { label: 'Equipos', valor: 'De 2 o 3 estudiantes' },
      ],
    },
    bases: {
      url: 'https://docs.google.com/document/d/1xw4APHNpu7sVMawPsijbvxIJmEMj9Csy/',
      texto: 'Ver bases oficiales',
    },
    contacto: { texto: '2301010334@undc.edu.pe', href: 'mailto:2301010334@undc.edu.pe' },
  },
  {
    slug: 'esports',
    nombre: 'eSports',
    etiqueta: 'eSports',
    icono: 'heroicons:bolt',
    ruta: `${RUTA_SEMANA_SISTEMICA}/esports`,
    fecha: '2026-10-27',
    horaInicio: '15:00',
    horaFin: '20:00',
    horaTexto: '3:00 p. m. a 8:00 p. m.',
    lugar: 'Instalaciones de la Facultad de Ingeniería de Sistemas, UNDC',
    acento: '#f472b6',
    portada: imagen('/images/eventos/esports.webp', 1920, 1168, 'Participantes jugando en computadoras durante un torneo de eSports anterior'),
    galeria: [],
    afiche: imagen('/images/eventos/esports.webp', 1920, 1168, 'Imagen del torneo de eSports de una edición anterior'),
    inscripcion: {
      url: 'https://forms.gle/QjtNoWLqSdzEXduEA',
      texto: 'Inscribirme al torneo',
      cierre: '2026-10-23T23:59:59-05:00',
      titulo: 'Inscríbete al torneo',
      descripcion: 'Cuatro torneos presenciales. Revisa el costo y el cierre de cada videojuego antes de registrarte.',
      filas: [
        { label: 'Juegos', valor: 'L4D2 · Clash Royale · FIFA 25 · Dragon Ball' },
        { label: 'Cierre general', valor: '23 de octubre, 11:59 p. m.' },
        { label: 'Dragon Ball', valor: 'Cierra el 22 de octubre' },
      ],
    },
    bases: {
      url: 'https://docs.google.com/document/d/14HODTeJ27d4gdEgNZaTEK1DcaolteqVZ/',
      texto: 'Ver bases oficiales',
    },
  },
  {
    slug: 'reinado',
    nombre: 'Miss & Míster Sistemas 2026',
    etiqueta: 'Reinado',
    icono: 'heroicons:sparkles',
    ruta: `${RUTA_SEMANA_SISTEMICA}/reinado`,
    fecha: '2026-10-28',
    horaInicio: '15:00',
    horaTexto: '3:00 p. m.',
    lugar: 'Auditorio de la Casa de la Cultura, San Vicente de Cañete',
    acento: '#e879f9',
    portada: imagen('/images/eventos/reinado.webp', 2400, 1347, 'Ganadores y estudiantes reunidos durante el Reinado Sistémico de la edición anterior'),
    galeria: [
      imagen(`${IMAGENES}/reinado-01.webp`, 1600, 1067, 'Mister y Miss Sistemas de la edición anterior con sus bandas y ramos de flores'),
      imagen(`${IMAGENES}/reinado-02.webp`, 1600, 1067, 'Candidatas y candidatos del reinado de la edición anterior con ramos de flores'),
      imagen(`${IMAGENES}/reinado-03.webp`, 1600, 1067, 'Candidatas y candidatos en el escenario del reinado de la edición anterior'),
    ],
    afiche: imagen(`${IMAGENES}/flyer-reinado.webp`, 1080, 1440, 'Afiche oficial de Miss & Mister Sistemas 2026: miércoles 28 de octubre, 3:00 p. m., Auditorio de la Casa de la Cultura'),
    inscripcion: {
      url: 'https://forms.gle/iS2ab99EJiPBPrEA8',
      texto: 'Inscribirme ahora',
      cierre: '2026-10-15T23:59:59-05:00',
      titulo: 'Participa en el Reinado Sistémico',
      descripcion: 'Completa tus datos en el formulario de Google y espera la confirmación de la comisión organizadora.',
      filas: [
        { label: 'Cierre', valor: '15 de octubre de 2026' },
        { label: 'Inscripción', valor: 'S/ 50 por participante' },
        { label: 'Modalidad', valor: 'Registro individual' },
      ],
    },
    bases: {
      url: 'https://drive.google.com/file/d/1rEXAvwl2drmOpiFOk2zw-B62kw6LRaJy/view?usp=sharing',
      texto: 'Ver bases oficiales',
    },
    contacto: { texto: '+51 955 204 231', href: 'https://wa.me/51955204231' },
  },
  {
    slug: 'cyber-clash',
    nombre: 'Cyber Clash — Kriptome Cybersecurity',
    etiqueta: 'Cyber Clash',
    icono: 'heroicons:shield-check',
    ruta: `${RUTA_SEMANA_SISTEMICA}/cyber-clash`,
    fecha: '2026-10-29',
    horaInicio: '15:00',
    horaFin: '18:00',
    horaTexto: '3:00 p. m.',
    lugar: 'Casa de la Cultura, San Vicente de Cañete',
    acento: '#06b6d4',
    portada: imagen(`${IMAGENES}/cyber-clash-01.webp`, 1920, 1080, 'Auditorio de ciberseguridad con expositores y pantallas de defensa digital'),
    galeria: [],
    afiche: imagen(`${IMAGENES}/flyer-cyber-clash.webp`, 819, 1024, 'Afiche oficial de Cyber Clash - Kriptome Cybersecurity: jueves 29 de octubre, 3:00 p. m., Casa de la Cultura'),
    inscripcion: {
      url: 'https://forms.gle/D1axfaofKhsTr9c56',
      texto: 'Inscribirme en Cyber Clash',
      cierre: '2026-10-29T23:59:59-05:00',
      titulo: 'Inscripción a Cyber Clash',
      descripcion: 'Regístrate en el formulario oficial de Google para asegurar tu vacante y la emisión de tu certificado de asistente.',
      filas: [
        { label: 'Fecha y hora', valor: 'Jueves 29 de octubre de 2026 · 3:00 p. m.' },
        { label: 'Lugar', valor: 'Casa de la Cultura' },
        { label: 'Precio de inscripción', valor: 'S/ 4.00' },
        { label: 'Dirigido a', valor: 'Estudiantes de la EPIS y público en general' },
        { label: 'Certificación', valor: 'Certificado de asistente' },
      ],
    },
    bases: {
      url: 'https://forms.gle/D1axfaofKhsTr9c56',
      texto: 'Ver formulario de inscripción',
    },
  },
  {
    slug: 'hackathon',
    nombre: 'Hackathon',
    etiqueta: 'Hackathon',
    icono: 'heroicons:light-bulb',
    ruta: `${RUTA_SEMANA_SISTEMICA}/hackathon`,
    fecha: '2026-10-29',
    horaInicio: '18:00',
    horaFin: '23:30',
    horaTexto: '6:00 p. m. a 11:30 p. m. (inauguración 5:40 p. m.)',
    lugar: 'Laboratorios y ambientes habilitados de la UNDC',
    acento: '#a78bfa',
    // Imagen externa con crédito visible (sin licencia propia): se recomienda
    // reemplazarla por una foto propia en cuanto esté disponible.
    portada: imagen('https://www.futurx.pe/revista/fotos/vrday_grupo.webp', 1400, 933, 'Grupo de participantes en un evento de tecnología'),
    creditoPortada: { texto: 'Imagen: FuturX', href: 'https://www.futurx.pe' },
    galeria: [],
    afiche: imagen('/images/eventos/hackathon.webp', 1920, 1399, 'Participante trabajando en una computadora durante un hackathon anterior'),
    inscripcion: {
      url: 'https://forms.gle/bfaEY4AjX3dWajrP7',
      texto: 'Inscribir a mi equipo',
      cierre: '2026-10-23T20:00:00-05:00',
      titulo: 'Inscribe a tu equipo',
      descripcion: 'Equipos de 2 a 5 integrantes. La inscripción queda completa al verificarse los datos y el pago, hasta cubrir las vacantes.',
      filas: [
        { label: 'Costo por equipo', valor: 'S/ 30' },
        { label: 'Equipos', valor: 'De 2 a 5 integrantes' },
        { label: 'Cierre', valor: '23 de octubre, 8:00 p. m.' },
        { label: 'Pago', valor: 'Efectivo, Yape o Plin' },
      ],
    },
    bases: {
      url: 'https://docs.google.com/document/d/1vtq4BGQXXgDz5kM8cbJHmI-buFLylmug',
      texto: 'Ver bases oficiales',
    },
    contacto: { texto: '2201080337@undc.edu.pe', href: 'mailto:2201080337@undc.edu.pe' },
  },
  {
    slug: 'deportes',
    nombre: 'Torneo deportivo',
    etiqueta: 'Deportes',
    icono: 'heroicons:trophy',
    ruta: `${RUTA_SEMANA_SISTEMICA}/deportes`,
    fecha: '2026-10-30',
    horaInicio: '08:00',
    horaFin: '20:00',
    horaTexto: '8:00 a. m. a 8:00 p. m.',
    lugar: 'Campus UNDC, canchas deportivas',
    acento: '#a3e635',
    portada: imagen(`${IMAGENES}/deportes-01.webp`, 1600, 1322, 'Estudiantes jugando vóley en las canchas del campus de la UNDC'),
    galeria: [],
    afiche: imagen(`${IMAGENES}/flyer-deportes.webp`, 1080, 1365, 'Afiche oficial del torneo deportivo de la Semana Sistémica: 30 de octubre de 2026 en el campus universitario'),
    inscripcion: {
      url: 'https://deportes.episundc.pe/eventos/2',
      texto: 'Inscribir a mi equipo',
      // Las bases escriben «25/10/2025»; es un error de año: el evento es de 2026.
      cierre: '2026-10-25T23:59:59-05:00',
      titulo: 'Forma tu equipo',
      descripcion: 'La nómina oficial se presenta por salón o ciclo, con DNI y código de cada participante, y la designación de capitán y delegado.',
      filas: [
        { label: 'Inscripciones', valor: 'Del 13 al 25 de octubre de 2026' },
        { label: 'Pago por salón', valor: 'S/ 100 (incluye una caja de agua)' },
        { label: 'Equipo adicional', valor: 'S/ 20' },
        { label: 'Ciclo completo', valor: 'S/ 150' },
      ],
    },
    bases: {
      url: 'https://docs.google.com/document/d/17ovO-8uxiY0GNGAN2nDNrNA2FvP8-Htg/edit?usp=sharing',
      texto: 'Ver bases oficiales',
    },
  },
]

export interface ItemMenuSemana {
  id: string
  label: string
  href: string
  icon: string
}

const itemEncuentroEgresados: ItemMenuSemana = {
  id: 'semana-encuentro-egresados',
  label: 'Encuentro de Egresados',
  href: `${RUTA_SEMANA_SISTEMICA}/encuentro-egresados`,
  icon: 'heroicons:academic-cap',
}

/** Submenú «Semana Sistémica»: lo consumen el header, el menú móvil y el pie de página. */
export const SEMANA_SISTEMICA_MENU: readonly ItemMenuSemana[] = actividades.flatMap((actividad) => {
  const item = {
    id: `semana-${actividad.slug}`,
    label: actividad.etiqueta,
    href: actividad.ruta,
    icon: actividad.icono,
  }

  // El encuentro (martes 27) se intercala entre Comparsa (lunes) y Reinado (miércoles).
  return actividad.slug === 'reinado' ? [itemEncuentroEgresados, item] : [item]
})

export function actividadPorSlug(slug: ActividadSlug): ActividadSemanaSistemica {
  const actividad = actividades.find(item => item.slug === slug)
  if (!actividad) throw new Error(`Actividad desconocida: ${slug}`)
  return actividad
}
