export interface ImagenEncuentroEgresados {
  src: string
  alt: string
  ancho: number
  alto: number
}

/**
 * Fotografías del II Reencuentro de Egresados de Ingeniería de Sistemas (2024).
 * Fuente institucional de referencia: publicación de la Facultad de Ingeniería UNDC.
 * https://www.facebook.com/FIUNDC/posts/435859309543643/
 *
 * Son copias WebP optimizadas de los JPG entregados por el usuario. Antes de una
 * publicación oficial debe confirmarse la autorización editorial y de imagen.
 */
const imagen = (archivo: string, alt: string, ancho = 1600, alto = 1066): ImagenEncuentroEgresados => ({
  src: `/images/encuentro-egresados/2024/${archivo}`,
  alt,
  ancho,
  alto,
})

export const encuentroEgresados = {
  nombre: 'Encuentro de Egresados 2026',
  ruta: '/semana-sistemica/encuentro-egresados',
  fecha: 'Martes 27 de octubre de 2026',
  fechaCorta: 'Martes 27 de octubre',
  horario: '6:00 p. m. – 8:00 p. m.',
  lugar: 'Casa de la Cultura',
  participacion: 'Inscripción gratuita',
  dirigidoA: 'Egresados de Ingeniería de Sistemas de la UNDC',
  portada: imagen(
    '2024-portada-auditorio.webp',
    'Participantes y representantes reunidos en un aula durante un encuentro anterior de egresados de Ingeniería de Sistemas',
    1920,
    1280,
  ),
  portadaLanding: imagen(
    '2024-grupo-campus.webp',
    'Grupo de participantes de un encuentro anterior de egresados de Ingeniería de Sistemas reunido en el campus de la UNDC',
  ),
  galeria: [
    imagen(
      '2024-portada-auditorio.webp',
      'Vista general de un encuentro anterior de egresados de Ingeniería de Sistemas',
      1920,
      1280,
    ),
    imagen(
      '2024-grupo-campus.webp',
      'Grupo de participantes del reencuentro de egresados reunido en el campus de la UNDC',
    ),
    imagen(
      '2024-grupo-comunidad.webp',
      'Egresados y miembros de la comunidad de Ingeniería de Sistemas posando juntos en el campus',
    ),
    imagen(
      '2024-participacion.webp',
      'Participante compartiendo una intervención frente a los asistentes del reencuentro',
    ),
    imagen(
      '2024-presentacion.webp',
      'Participante realizando una presentación durante el reencuentro de egresados',
    ),
    imagen(
      '2024-momento-compartido.webp',
      'Participantes compartiendo un momento de integración durante el encuentro',
    ),
  ] as readonly ImagenEncuentroEgresados[],
  experienciaAnterior: [
    {
      titulo: 'Charlas y conversación',
      descripcion: 'Espacios de diálogo dirigidos a la comunidad de egresados.',
      icono: 'heroicons:chat-bubble-left-right',
    },
    {
      titulo: 'Trayectorias profesionales',
      descripcion: 'Testimonios de egresados sobre sus logros y desarrollo profesional.',
      icono: 'heroicons:briefcase',
    },
    {
      titulo: 'Memoria universitaria',
      descripcion: 'Videos con recuerdos de la etapa universitaria de los participantes.',
      icono: 'heroicons:video-camera',
    },
    {
      titulo: 'Dinámicas participativas',
      descripcion: 'Kahoot y encuestas relacionadas con la carrera de Ingeniería de Sistemas.',
      icono: 'heroicons:cursor-arrow-rays',
    },
    {
      titulo: 'Reconocimiento de la participación',
      descripcion: 'En aquella edición se entregaron certificados a sus participantes.',
      icono: 'heroicons:document-check',
    },
  ] as const,
} as const
