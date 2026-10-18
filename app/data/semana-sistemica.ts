// ============================================================================
// SEMANA SISTÉMICA: COMPARSA, REINADO, TALLERES Y DEPORTES (contenido estático)
// Fuente de bases y flyers: comisiones de cada actividad, octubre de 2026.
// ============================================================================

export type ActividadSlug = 'comparsa' | 'reinado' | 'talleres' | 'deportes'

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

/** En orden cronológico: lunes 26, miércoles 28, jueves 29 y viernes 30 de octubre de 2026. */
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
    // ⚠️ CONTENIDO PENDIENTE: fecha, horario, lugar, cuotas, enlaces, contactos e imágenes son
    // provisionales. La comisión de Talleres debe confirmar cada valor y subir los WebP
    // (talleres-01.webp y flyer-talleres.webp) antes de publicar.
    slug: 'talleres',
    nombre: 'Talleres sistémicos',
    etiqueta: 'Talleres',
    icono: 'heroicons:academic-cap',
    ruta: `${RUTA_SEMANA_SISTEMICA}/talleres`,
    fecha: '2026-10-29',
    horaInicio: '18:00',
    horaFin: '20:00',
    horaTexto: '6:00 p. m. a 8:00 p. m.',
    lugar: 'Campus UNDC · Ambientes por confirmar',
    acento: '#2dd4bf',
    portada: imagen(`${IMAGENES}/talleres-01.webp`, 1600, 900, 'Estudiantes en una sesión práctica de taller de una edición anterior de la Semana Sistémica'),
    galeria: [],
    afiche: imagen(`${IMAGENES}/flyer-talleres.webp`, 1080, 1440, 'Afiche oficial de los Talleres sistémicos: jueves 29 de octubre de 2026 en el campus de la UNDC'),
    inscripcion: {
      // TODO(comisión): reemplazar con el formulario oficial de inscripción.
      url: 'https://forms.gle/pendiente',
      texto: 'Inscribirme al taller',
      cierre: '2026-10-26T23:59:59-05:00',
      titulo: 'Reserva tu cupo en los talleres',
      descripcion: 'Completa el formulario de la comisión para elegir taller y turno. Los cupos son limitados.',
      filas: [
        { label: 'Fecha', valor: '29 de octubre de 2026' },
        { label: 'Horario', valor: '6:00 p. m. a 8:00 p. m.' },
        { label: 'Cupos', valor: 'Limitados por taller' },
        { label: 'Certificado', valor: 'Por confirmar' },
      ],
    },
    bases: {
      // TODO(comisión): reemplazar con las bases oficiales.
      url: 'https://drive.google.com/pendiente',
      texto: 'Ver bases oficiales',
    },
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

/** Submenú «Semana Sistémica»: lo consumen el header, el menú móvil y el pie de página. */
export const SEMANA_SISTEMICA_MENU: readonly ItemMenuSemana[] = actividades.map(actividad => ({
  id: `semana-${actividad.slug}`,
  label: actividad.etiqueta,
  href: actividad.ruta,
  icon: actividad.icono,
}))

export function actividadPorSlug(slug: ActividadSlug): ActividadSemanaSistemica {
  const actividad = actividades.find(item => item.slug === slug)
  if (!actividad) throw new Error(`Actividad desconocida: ${slug}`)
  return actividad
}
