export interface SpecializedSpeaker {
  id: string
  name: string
  image: string
  /** Perfil profesional; los párrafos se separan con una línea en blanco (`\n\n`). */
  bio: string
  /** Ponente que no pertenece a la comunidad UNDC. */
  external: boolean
}

export type SpecializedDate = '2026-10-27' | '2026-10-28'

export interface SpecializedTalk {
  id: number
  speakerId: string
  topic: string
  date: SpecializedDate
  /** Hora de inicio y fin en formato 24 h (HH:mm). */
  start: string
  end: string
  room: string
}

const FOTOS = '/images/ponentes/2026/especializados'

/** Ponentes externos primero; el resto en el orden en que aparecen en el programa. */
export const specializedSpeakers: SpecializedSpeaker[] = [
  {
    id: 'janeth-marino',
    name: 'Dra. Janeth Bertha Mariño Arroyo',
    image: `${FOTOS}/janeth-marino.webp`,
    external: true,
    bio: 'Doctora en Ingeniería de Sistemas, Magíster en Administración con mención en Finanzas e Ingeniera Industrial. Actualmente se desempeña como Docente Principal en la Universidad Nacional Autónoma de Tayacaja, destacando por su trayectoria en docencia universitaria, investigación y gestión académica.\n\nCuenta con una amplia experiencia en el desarrollo e implementación de sistemas de gestión de la calidad, transformación digital, gestión por procesos e innovación educativa. Su labor académica e investigadora se orienta a la aplicación de tecnologías de la información para la mejora continua de organizaciones e instituciones de educación superior, contribuyendo al fortalecimiento de la calidad educativa y la generación de conocimiento científico.',
  },
  {
    id: 'mario-ormachea',
    name: 'M.Sc. Mario Jesús Ormachea Mejía',
    image: `${FOTOS}/mario-ormachea.webp`,
    external: true,
    bio: 'Ingeniero de Sistemas con Maestría en Gestión de TIC por la Universidad Nacional de Huancavelica y estudios de Doctorado en Ciencias de la Educación (UAC). Posee más de dos décadas de experiencia liderando proyectos de conectividad, infraestructura de redes, servidores y soluciones TIC. Actualmente es docente en la Universidad Nacional Amazónica de Madre de Dios, directivo empresarial, investigador con publicaciones científicas indexadas y ponente en congresos internacionales de computación e innovación tecnológica.',
  },
  {
    id: 'richard-condori',
    name: 'Dr. Richard Condori Cruz',
    image: `${FOTOS}/richard-condori.webp`,
    external: false,
    bio: 'Ingeniero de Sistemas, doctor en Ingeniería de Sistemas, maestro en Informática, bachiller en Derecho y abogado. Cuenta con estudios de maestría en Derecho con mención en Derecho Procesal Penal y estudios concluidos de segunda especialidad en Didáctica e Investigación en Docencia Superior.',
  },
  {
    id: 'edwin-roque',
    name: 'Ph.D. Edwin Roque Tito',
    image: `${FOTOS}/edwin-roque.webp`,
    external: false,
    bio: 'Investigador RENACYT, Ph. D. en Investigación por la UPEL de Venezuela, doctor en Ingeniería de Sistemas por la Universidad Nacional Federico Villarreal, candidato a magíster en Innovación e Integración de TI por la Pontificia Universidad Católica del Perú, magíster scientiae en Informática por la Universidad Nacional del Altiplano e ingeniero de Sistemas. Es docente principal de la Universidad Nacional de Cañete y realizó una pasantía en el Laboratorio Cavendish de la Universidad de Cambridge, en el Reino Unido. Cuenta con experiencia en proyectos de desarrollo de software e implementación de sistemas de información en la nube para organizaciones.',
  },
  {
    id: 'jhancarlo-silva',
    name: 'Mg. Jhancarlo Florencio Silva Ochoa',
    image: `${FOTOS}/jhancarlo-silva.webp`,
    external: false,
    bio: 'Ingeniero de Sistemas, maestro en Ingeniería Informática con mención en Ingeniería de Software, máster universitario en Ciberseguridad y doctorando en Ciencias de la Computación. Cuenta con más de diez años de experiencia en desarrollo de software y una sólida trayectoria en desarrollo móvil y multiplataforma. Está especializado en Android con Java y Kotlin, arquitecturas MVC, MVP y MVVM, APIs REST, integración de servicios externos, persistencia local, Kotlin Multiplatform y Compose Multiplatform. Es fundador y gerente general de CODELAB TECH E.I.R.L., donde ha diseñado, publicado y mantenido aplicaciones para escenarios reales de negocio, entre ellas InvoFact, una plataforma de gestión empresarial y facturación electrónica con integración a SUNAT, RENIEC, APIs REST, geolocalización e impresión mediante Bluetooth, Wi-Fi y USB.',
  },
  {
    id: 'marisol-daga',
    name: 'Dra. Marisol Daga Chaca',
    image: `${FOTOS}/marisol-daga.webp`,
    external: false,
    bio: 'Doctora en Ciencias de la Educación, maestra en Gestión Empresarial e ingeniera de Sistemas. Cuenta con estudios de doctorado en Ingeniería de Sistemas y licenciatura en Educación, especialidad de Computación e Informática. Tiene experiencia en docencia universitaria y dirección de procesos empresariales.',
  },
  {
    id: 'joel-vilca',
    name: 'Mg. Joel Linder Vilca Pizarro',
    image: `${FOTOS}/joel-vilca.webp`,
    external: false,
    bio: 'Profesional de Informática y Sistemas, magíster en Telecomunicaciones con mención en Redes y Servicios de Banda Ancha. Cuenta con experiencia profesional en docencia universitaria, investigación, desarrollo e innovación tecnológica en redes y telecomunicaciones, así como en tecnologías de información y gestión de proyectos.',
  },
  {
    id: 'claudio-huancahuire',
    name: 'Mg. Claudio Isaías Huancahuire Bravo',
    image: `${FOTOS}/claudio-huancahuire.webp`,
    external: false,
    bio: 'Ingeniero de Sistemas e Informática, maestro en Ciencias con mención en Informática y estudiante de doctorado en Ingeniería de Sistemas en la Universidad Nacional del Callao. Su perfil reúne experiencia académica, investigación y ejercicio profesional en PHP, Python, Big Data, Linux, cloud computing e inteligencia artificial. Es docente ordinario de la Universidad Nacional de Cañete y también ha ejercido docencia en otras universidades. Ha participado como ponente en eventos académicos y científicos y cuenta con producción vinculada al procesamiento distribuido de grandes volúmenes de datos, las arquitecturas de sistemas y Big Data. Obtuvo el grado de bachiller y el título de ingeniero en la Universidad Tecnológica de los Andes, y el grado de maestro en la Universidad Nacional de San Antonio Abad del Cusco.',
  },
  {
    id: 'jhonatan-echaccaya',
    name: 'Mg. Jhonatan Edilfonso Echaccaya Anyosa',
    image: `${FOTOS}/jhonatan-echaccaya.webp`,
    external: false,
    bio: 'Ingeniero de Sistemas y maestro en Gestión de la Tecnología de la Información, con estudios de doctorado en Ingeniería de Sistemas. Su perfil se orienta a la transformación digital, automatización de procesos, RPA/RDA, inteligencia artificial, desarrollo de software, liderazgo tecnológico y docencia universitaria. Se desempeña como líder técnico RDA y RPA en Indra/Minsait para BBVA Perú, donde lidera equipos, diseña arquitecturas de automatización, analiza la viabilidad técnica, gestiona iniciativas y pruebas de concepto, controla indicadores y aplica lineamientos de gobierno, seguridad y arquitectura. Trabaja con UiPath, Automation Anywhere, Power Platform, Python, Selenium, Playwright, machine learning, TensorFlow, Keras, APIs REST, Git y herramientas de analítica.',
  },
  {
    id: 'carlos-almidon',
    name: 'Dr. Carlos Alcides Almidon Ortiz',
    image: `${FOTOS}/carlos-almidon.webp`,
    external: false,
    bio: 'Doctor en Sistemas de Ingeniería, egresado del doctorado en Ingeniería de Sistemas, magíster en Ingeniería de Sistemas e ingeniero de Sistemas colegiado. Cuenta con experiencia como docente de posgrado y universitario, además de formación especializada en infraestructura tecnológica, telecomunicaciones y gestión académica. Su trayectoria incluye certificaciones y estudios en redes, ciberseguridad, domótica, diseño de centros de datos, cableado estructurado, gestión por procesos, configuración de servidores, gerencia, didáctica universitaria, inversión pública, modelamiento de software e investigación formativa. Se desempeña como consultor y capacitador en tecnologías de información, infraestructuras de comunicaciones, seguridad informática y gestión de procesos para instituciones públicas y privadas.',
  },
  {
    id: 'abraham-gamarra',
    name: 'Dr. Abraham Esteban Gamarra Moreno',
    image: '/images/ponentes/2026/abraham-gamarra-enhanced.webp',
    external: false,
    bio: 'Doctor en Ingeniería. Docente de pregrado y posgrado, investigador y conferencista internacional con formación en informática, inteligencia artificial, robótica y aprendizaje automático.',
  },
  {
    id: 'guido-larico',
    name: 'Dr. Guido Raúl Larico Uchumaco',
    image: `${FOTOS}/guido-larico.webp`,
    external: false,
    bio: 'Docente ordinario de la Universidad Nacional de Cañete. Doctor en Ingeniería de Sistemas por la Universidad Nacional Federico Villarreal, doctor en Educación, magíster en Docencia Universitaria por la Universidad Nacional de Educación Enrique Guzmán y Valle y magíster en Informática con mención en Gerencia de Tecnologías de Información y Comunicaciones por la Universidad Nacional del Altiplano. Durante su carrera profesional ha desempeñado diversos cargos y trabajado como consultor y desarrollador de tecnologías libres y abiertas en proyectos de software para empresas privadas y públicas.',
  },
  {
    id: 'daniel-yucra',
    name: 'M.Sc. Daniel Alejandro Yucra Sotomayor',
    image: '/images/ponentes/2026/daniel-yucra-enhanced.webp',
    external: false,
    bio: 'Máster universitario en Administración y Gestión Avanzada de Proyectos. Especialista y docente en seguridad de la información, gestión de riesgos tecnológicos, gobierno digital y transformación digital.',
  },
  {
    id: 'amanda-duran',
    name: 'Dra. Amanda Duran Carhuamaca',
    image: `${FOTOS}/amanda-duran.webp`,
    external: false,
    bio: 'Profesional orientada al logro de objetivos mediante el uso de tecnología. Magíster en Informática por la Pontificia Universidad Católica del Perú, ingeniera de Sistemas, candidata a doctora en Ingeniería de Sistemas y con doctorado en Docencia Universitaria. Cuenta con experiencia en gestión y dirección de proyectos, análisis funcional de software y trece años de docencia universitaria. Ha sido directora de una escuela profesional de Ingeniería de Sistemas, docente investigadora en más de diez universidades y expositora de temas de vanguardia en investigación y tecnología.',
  },
  {
    id: 'percy-salcedo',
    name: 'Mg. Percy Ismael Salcedo Rodas',
    image: `${FOTOS}/percy-salcedo.webp`,
    external: false,
    bio: 'Ingeniero en Computación e Informática, maestro en Docencia Universitaria e Investigación Educativa y estudiante de doctorado en Ingeniería de Sistemas. Su trayectoria integra ingeniería, tecnologías de la información, docencia universitaria, investigación y gestión académica. Ha desarrollado actividades en la Universidad Nacional de Cañete, Universidad Autónoma del Perú, Universidad Autónoma de Ica, Universidad Nacional de Educación Enrique Guzmán y Valle, Universidad César Vallejo, Universidad Politécnica Amazónica y Universidad Nacional Pedro Ruiz Gallo. Su formación complementaria comprende inteligencia artificial, ciberseguridad, Internet de las Cosas, arquitectura de computadoras, tecnologías educativas, servicios cloud, herramientas digitales y gestión pública; además, participa de manera constante como asistente, ponente y organizador de actividades académicas.',
  },
  {
    id: 'miriam-angoma',
    name: 'Dra. Miriam Angoma Astucuri',
    image: `${FOTOS}/miriam-angoma.webp`,
    external: false,
    bio: 'Docente ordinaria de la Universidad Nacional de Cañete, adscrita a la Facultad de Ingeniería y a la Escuela Profesional de Ingeniería de Sistemas. Doctora en Sistemas de Ingeniería y magíster en Administración de Empresas con mención en Gestión de Proyectos. Cuenta con estudios de maestría en Docencia en Educación Superior y de segunda especialización en Didáctica Universitaria.',
  },
  {
    id: 'jair-ferreyros',
    name: 'Dr. Jair Emerson Ferreyros Yucra',
    image: `${FOTOS}/jair-ferreyros.webp`,
    external: false,
    bio: 'Doctor en Ingeniería de Sistemas, magíster scientiae en Informática, ingeniero de Sistemas y licenciado en Matemáticas. Cuenta con estudios concluidos de segunda especialidad centrada en investigación, didáctica y docencia en educación superior, así como estudios concluidos de doctorado en Administración. Sus habilidades comprenden el análisis de sistemas y la gestión de proyectos de tecnologías de la información. Destaca por su capacidad para resolver problemas técnicos y por una comunicación sólida con el personal de las organizaciones y los usuarios finales.',
  },
  {
    id: 'wagner-vicente',
    name: 'Dr. Wagner Enoc Vicente Ramos',
    image: `${FOTOS}/wagner-vicente.webp`,
    external: false,
    bio: 'Docente universitario e investigador de la Universidad Nacional de Cañete con más de quince años de experiencia en pregrado y posgrado. Ingeniero de Sistemas, maestro en Gestión Educativa y doctor en Sistemas de Ingeniería. Se ha desempeñado como director de escuela profesional de Ingeniería de Sistemas y Computación, coordinador de investigación de Ciencias de la Empresa, coordinador de facultad de Ingeniería y director de escuela de posgrado. Es investigador RENACYT y miembro del Institute for Systems and Technologies of Information, Control and Communication; participa como conferencista y par evaluador en congresos nacionales e internacionales sobre ciencias de las organizaciones, transformación digital e inteligencia artificial.',
  },
]

const MARTES: SpecializedDate = '2026-10-27'
const MIERCOLES: SpecializedDate = '2026-10-28'

/** Todas las ponencias especializadas duran 45 minutos, de 12:00 a 12:45, en ambientes distintos. */
const turno = (date: SpecializedDate) => ({ date, start: '12:00', end: '12:45' })

export const specializedTalks: SpecializedTalk[] = [
  // Martes 27 de octubre
  { id: 1, speakerId: 'richard-condori', ...turno(MARTES), room: 'Laboratorio 1', topic: 'Arquitectura del cibercrimen: el peritaje forense frente a la IA y los delitos informáticos en el Perú' },
  { id: 2, speakerId: 'edwin-roque', ...turno(MARTES), room: 'Laboratorio 2', topic: 'Bases de datos vectoriales' },
  { id: 3, speakerId: 'jhancarlo-silva', ...turno(MARTES), room: 'Laboratorio 3', topic: 'Kotlin Multiplatform: una base de código, múltiples plataformas' },
  { id: 4, speakerId: 'marisol-daga', ...turno(MARTES), room: 'Laboratorio 4', topic: 'La inteligencia artificial generativa como catalizador de la transformación educativa: retos, oportunidades y perspectivas para la ingeniería de sistemas' },
  { id: 5, speakerId: 'joel-vilca', ...turno(MARTES), room: 'Laboratorio 5', topic: 'Implementación de soluciones IoT con simulación, sensores, actuadores y servicios en la nube' },
  { id: 6, speakerId: 'claudio-huancahuire', ...turno(MARTES), room: 'Laboratorio 6', topic: 'Arquitectura Big Data a gran escala: del ecosistema open source a la nube de AWS' },
  { id: 7, speakerId: 'janeth-marino', ...turno(MARTES), room: 'Laboratorio 7', topic: 'Del Technology Scouting al Horizon Scanning: IA para anticipar oportunidades de innovación' },
  { id: 8, speakerId: 'jhonatan-echaccaya', ...turno(MARTES), room: 'Laboratorio 8', topic: 'De robots a agentes de IA: automatiza como en el futuro' },
  { id: 9, speakerId: 'carlos-almidon', ...turno(MARTES), room: 'Aula 5', topic: 'Universidad ciberresiliente 2030: gobernanza, inteligencia artificial y ciberseguridad' },
  // Miércoles 28 de octubre
  { id: 10, speakerId: 'abraham-gamarra', ...turno(MIERCOLES), room: 'Laboratorio 1', topic: 'Implementación de un chatbot con RAG (Retrieval-Augmented Generation)' },
  { id: 11, speakerId: 'guido-larico', ...turno(MIERCOLES), room: 'Laboratorio 2', topic: 'El enunciado del estudio en la investigación científica' },
  { id: 12, speakerId: 'daniel-yucra', ...turno(MIERCOLES), room: 'Laboratorio 3', topic: 'Ciberseguridad con Kali Linux' },
  { id: 13, speakerId: 'jhonatan-echaccaya', ...turno(MIERCOLES), room: 'Laboratorio 4', topic: 'Crea una app empresarial en minutos con Power Apps y Power Automate' },
  { id: 14, speakerId: 'amanda-duran', ...turno(MIERCOLES), room: 'Laboratorio 6', topic: 'De la idea a la aprobación: hackea tu tesis con IA generativa' },
  { id: 15, speakerId: 'mario-ormachea', ...turno(MIERCOLES), room: 'Laboratorio 7', topic: 'Programación con IA: riesgos, retos y oportunidades' },
  { id: 16, speakerId: 'percy-salcedo', ...turno(MIERCOLES), room: 'Laboratorio 8', topic: 'Computación cuántica: del bit al qubit y el nuevo paradigma del procesamiento' },
  { id: 17, speakerId: 'miriam-angoma', ...turno(MIERCOLES), room: 'Aula 3', topic: 'Transformación digital' },
  { id: 18, speakerId: 'jair-ferreyros', ...turno(MIERCOLES), room: 'Aula 5', topic: 'El futuro de la investigación universitaria en el Perú: desafíos, estrategias y oportunidades para una ciencia con impacto' },
  { id: 19, speakerId: 'wagner-vicente', ...turno(MIERCOLES), room: 'Aula 6', topic: 'Niveles de madurez tecnológica' },
]
