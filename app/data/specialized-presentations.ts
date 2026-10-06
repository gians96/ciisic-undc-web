export interface SpecializedPresentation {
  id: number
  speaker: string
  topic: string
  bio: string
  image: string
}

export const specializedPresentations: SpecializedPresentation[] = [
  {
    id: 1,
    speaker: 'Dr. Guido Raúl Larico Uchamaco',
    image: '/images/ponentes/2026/especializados/guido-larico.webp',
    topic: 'El enunciado del estudio en la investigación científica',
    bio: 'Docente ordinario de la Universidad Nacional de Cañete. Doctor en Ingeniería de Sistemas por la Universidad Nacional Federico Villarreal, doctor en Educación, magíster en Docencia Universitaria por la Universidad Nacional de Educación Enrique Guzmán y Valle y magíster en Informática con mención en Gerencia de Tecnologías de Información y Comunicaciones por la Universidad Nacional del Altiplano. Durante su carrera profesional ha desempeñado diversos cargos y trabajado como consultor y desarrollador de tecnologías libres y abiertas en proyectos de software para empresas privadas y públicas.',
  },
  {
    id: 2,
    speaker: 'Ph.D. Edwin Roque Tito',
    image: '/images/ponentes/2026/especializados/edwin-roque.webp',
    topic: 'Bases de datos vectoriales',
    bio: 'Investigador RENACYT, Ph. D. en Investigación por la UPEL de Venezuela, doctor en Ingeniería de Sistemas por la Universidad Nacional Federico Villarreal, candidato a magíster en Innovación e Integración de TI por la Pontificia Universidad Católica del Perú, magíster scientiae en Informática por la Universidad Nacional del Altiplano e ingeniero de Sistemas. Es docente principal de la Universidad Nacional de Cañete y realizó una pasantía en el Laboratorio Cavendish de la Universidad de Cambridge, en el Reino Unido. Cuenta con experiencia en proyectos de desarrollo de software e implementación de sistemas de información en la nube para organizaciones.',
  },
  {
    id: 3,
    speaker: 'Dra. Miriam Angoma Astucuri',
    image: '/images/ponentes/2026/especializados/miriam-angoma.webp',
    topic: 'Transformación digital',
    bio: 'Docente ordinaria de la Universidad Nacional de Cañete, adscrita a la Facultad de Ingeniería y a la Escuela Profesional de Ingeniería de Sistemas. Doctora en Sistemas de Ingeniería y magíster en Administración de Empresas con mención en Gestión de Proyectos. Cuenta con estudios de maestría en Docencia en Educación Superior y de segunda especialización en Didáctica Universitaria.',
  },
  {
    id: 4,
    speaker: 'Dra. Marisol Daga Chaca',
    image: '/images/ponentes/2026/especializados/marisol-daga.webp',
    topic: 'La inteligencia artificial generativa como catalizador de la transformación educativa: retos, oportunidades y perspectivas para la ingeniería de sistemas',
    bio: 'Doctora en Ciencias de la Educación, maestra en Gestión Empresarial e ingeniera de Sistemas. Cuenta con estudios de doctorado en Ingeniería de Sistemas y licenciatura en Educación, especialidad de Computación e Informática. Tiene experiencia en docencia universitaria y dirección de procesos empresariales.',
  },
  {
    id: 5,
    speaker: 'Mg. Claudio Isaías Huancahuire Bravo',
    image: '/images/ponentes/2026/especializados/claudio-huancahuire.webp',
    topic: 'Arquitectura Big Data a gran escala: del ecosistema open source a la nube de AWS',
    bio: 'Ingeniero de Sistemas e Informática, maestro en Ciencias con mención en Informática y estudiante de doctorado en Ingeniería de Sistemas en la Universidad Nacional del Callao. Su perfil reúne experiencia académica, investigación y ejercicio profesional en PHP, Python, Big Data, Linux, cloud computing e inteligencia artificial. Es docente ordinario de la Universidad Nacional de Cañete y también ha ejercido docencia en otras universidades. Ha participado como ponente en eventos académicos y científicos y cuenta con producción vinculada al procesamiento distribuido de grandes volúmenes de datos, las arquitecturas de sistemas y Big Data. Obtuvo el grado de bachiller y el título de ingeniero en la Universidad Tecnológica de los Andes, y el grado de maestro en la Universidad Nacional de San Antonio Abad del Cusco.',
  },
  {
    id: 6,
    speaker: 'Dr. Wagner Enoc Vicente Ramos',
    image: '/images/ponentes/2026/especializados/wagner-vicente.webp',
    topic: 'Niveles de madurez tecnológica',
    bio: 'Docente universitario e investigador de la Universidad Nacional de Cañete con más de quince años de experiencia en pregrado y posgrado. Ingeniero de Sistemas, maestro en Gestión Educativa y doctor en Sistemas de Ingeniería. Se ha desempeñado como director de escuela profesional de Ingeniería de Sistemas y Computación, coordinador de investigación de Ciencias de la Empresa, coordinador de facultad de Ingeniería y director de escuela de posgrado. Es investigador RENACYT y miembro del Institute for Systems and Technologies of Information, Control and Communication; participa como conferencista y par evaluador en congresos nacionales e internacionales sobre ciencias de las organizaciones, transformación digital e inteligencia artificial.',
  },
  {
    id: 7,
    speaker: 'Dra. Amanda Duran Carhuamaca',
    image: '/images/ponentes/2026/especializados/amanda-duran.webp',
    topic: 'De la idea a la aprobación: hackea tu tesis con IA generativa',
    bio: 'Profesional orientada al logro de objetivos mediante el uso de tecnología. Magíster en Informática por la Pontificia Universidad Católica del Perú, ingeniera de Sistemas, candidata a doctora en Ingeniería de Sistemas y con doctorado en Docencia Universitaria. Cuenta con experiencia en gestión y dirección de proyectos, análisis funcional de software y trece años de docencia universitaria. Ha sido directora de una escuela profesional de Ingeniería de Sistemas, docente investigadora en más de diez universidades y expositora de temas de vanguardia en investigación y tecnología.',
  },
  {
    id: 8,
    speaker: 'Mg. Jhonatan Edilfonso Echaccaya Anyosa',
    image: '/images/ponentes/2026/especializados/jhonatan-echaccaya.webp',
    topic: 'De robots a agentes de IA: automatiza como en el futuro',
    bio: 'Ingeniero de Sistemas y maestro en Gestión de la Tecnología de la Información, con estudios de doctorado en Ingeniería de Sistemas. Su perfil se orienta a la transformación digital, automatización de procesos, RPA/RDA, inteligencia artificial, desarrollo de software, liderazgo tecnológico y docencia universitaria. Se desempeña como líder técnico RDA y RPA en Indra/Minsait para BBVA Perú, donde lidera equipos, diseña arquitecturas de automatización, analiza la viabilidad técnica, gestiona iniciativas y pruebas de concepto, controla indicadores y aplica lineamientos de gobierno, seguridad y arquitectura. Trabaja con UiPath, Automation Anywhere, Power Platform, Python, Selenium, Playwright, machine learning, TensorFlow, Keras, APIs REST, Git y herramientas de analítica.',
  },
  {
    id: 9,
    speaker: 'Mg. Jhonatan Edilfonso Echaccaya Anyosa',
    image: '/images/ponentes/2026/especializados/jhonatan-echaccaya.webp',
    topic: 'Crea una app empresarial en minutos con Power Apps y Power Automate',
    bio: 'Ingeniero de Sistemas y maestro en Gestión de la Tecnología de la Información, con estudios de doctorado en Ingeniería de Sistemas. Su perfil se orienta a la transformación digital, automatización de procesos, RPA/RDA, inteligencia artificial, desarrollo de software, liderazgo tecnológico y docencia universitaria. Se desempeña como líder técnico RDA y RPA en Indra/Minsait para BBVA Perú, donde lidera equipos, diseña arquitecturas de automatización, analiza la viabilidad técnica, gestiona iniciativas y pruebas de concepto, controla indicadores y aplica lineamientos de gobierno, seguridad y arquitectura. Trabaja con UiPath, Automation Anywhere, Power Platform, Python, Selenium, Playwright, machine learning, TensorFlow, Keras, APIs REST, Git y herramientas de analítica.',
  },
  {
    id: 10,
    speaker: 'Mg. Jhancarlo Florencio Silva Ochoa',
    image: '/images/ponentes/2026/especializados/jhancarlo-silva.webp',
    topic: 'Kotlin Multiplatform: una base de código, múltiples plataformas',
    bio: 'Ingeniero de Sistemas, maestro en Ingeniería Informática con mención en Ingeniería de Software, máster universitario en Ciberseguridad y doctorando en Ciencias de la Computación. Cuenta con más de diez años de experiencia en desarrollo de software y una sólida trayectoria en desarrollo móvil y multiplataforma. Está especializado en Android con Java y Kotlin, arquitecturas MVC, MVP y MVVM, APIs REST, integración de servicios externos, persistencia local, Kotlin Multiplatform y Compose Multiplatform. Es fundador y gerente general de CODELAB TECH E.I.R.L., donde ha diseñado, publicado y mantenido aplicaciones para escenarios reales de negocio, entre ellas InvoFact, una plataforma de gestión empresarial y facturación electrónica con integración a SUNAT, RENIEC, APIs REST, geolocalización e impresión mediante Bluetooth, Wi-Fi y USB.',
  },
  {
    id: 11,
    speaker: 'Mg. Joel Linder Vilca Pizarro',
    image: '/images/ponentes/2026/especializados/joel-vilca.webp',
    topic: 'Implementación de soluciones IoT con simulación, sensores, actuadores y servicios en la nube',
    bio: 'Profesional de Informática y Sistemas, magíster en Telecomunicaciones con mención en Redes y Servicios de Banda Ancha. Cuenta con experiencia profesional en docencia universitaria, investigación, desarrollo e innovación tecnológica en redes y telecomunicaciones, así como en tecnologías de información y gestión de proyectos.',
  },
  {
    id: 12,
    speaker: 'Dr. Carlos Alcides Almidon Ortiz',
    image: '/images/ponentes/2026/especializados/carlos-almidon.webp',
    topic: 'Universidad ciberresiliente 2030: gobernanza, inteligencia artificial y ciberseguridad',
    bio: 'Doctor en Sistemas de Ingeniería, egresado del doctorado en Ingeniería de Sistemas, magíster en Ingeniería de Sistemas e ingeniero de Sistemas colegiado. Cuenta con experiencia como docente de posgrado y universitario, además de formación especializada en infraestructura tecnológica, telecomunicaciones y gestión académica. Su trayectoria incluye certificaciones y estudios en redes, ciberseguridad, domótica, diseño de centros de datos, cableado estructurado, gestión por procesos, configuración de servidores, gerencia, didáctica universitaria, inversión pública, modelamiento de software e investigación formativa. Se desempeña como consultor y capacitador en tecnologías de información, infraestructuras de comunicaciones, seguridad informática y gestión de procesos para instituciones públicas y privadas.',
  },
  {
    id: 13,
    speaker: 'Dr. Jair Emerson Ferreyros Yucra',
    image: '/images/ponentes/2026/especializados/jair-ferreyros.webp',
    topic: 'El futuro de la investigación universitaria en el Perú: desafíos, estrategias y oportunidades para una ciencia con impacto',
    bio: 'Doctor en Ingeniería de Sistemas, magíster scientiae en Informática, ingeniero de Sistemas y licenciado en Matemáticas. Cuenta con estudios concluidos de segunda especialidad centrada en investigación, didáctica y docencia en educación superior, así como estudios concluidos de doctorado en Administración. Sus habilidades comprenden el análisis de sistemas y la gestión de proyectos de tecnologías de la información. Destaca por su capacidad para resolver problemas técnicos y por una comunicación sólida con el personal de las organizaciones y los usuarios finales.',
  },
  {
    id: 14,
    speaker: 'Dr. Richard Condori Cruz',
    image: '/images/ponentes/2026/especializados/richard-condori.webp',
    topic: 'Arquitectura del cibercrimen: el peritaje forense frente a la IA y los delitos informáticos en el Perú',
    bio: 'Ingeniero de Sistemas, doctor en Ingeniería de Sistemas, maestro en Informática, bachiller en Derecho y abogado. Cuenta con estudios de maestría en Derecho con mención en Derecho Procesal Penal y estudios concluidos de segunda especialidad en Didáctica e Investigación en Docencia Superior.',
  },
  {
    id: 15,
    speaker: 'Mg. Percy Ismael Salcedo Rodas',
    image: '/images/ponentes/2026/especializados/percy-salcedo.webp',
    topic: 'Computación cuántica: del bit al qubit y el nuevo paradigma del procesamiento',
    bio: 'Ingeniero en Computación e Informática, maestro en Docencia Universitaria e Investigación Educativa y estudiante de doctorado en Ingeniería de Sistemas. Su trayectoria integra ingeniería, tecnologías de la información, docencia universitaria, investigación y gestión académica. Ha desarrollado actividades en la Universidad Nacional de Cañete, Universidad Autónoma del Perú, Universidad Autónoma de Ica, Universidad Nacional de Educación Enrique Guzmán y Valle, Universidad César Vallejo, Universidad Politécnica Amazónica y Universidad Nacional Pedro Ruiz Gallo. Su formación complementaria comprende inteligencia artificial, ciberseguridad, Internet de las Cosas, arquitectura de computadoras, tecnologías educativas, servicios cloud, herramientas digitales y gestión pública; además, participa de manera constante como asistente, ponente y organizador de actividades académicas.',
  },
]
