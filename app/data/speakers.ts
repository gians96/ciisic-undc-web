export interface Speaker {
  name: string
  degreeLevel: string
  degree: string
  country: string
  flag: string
  image: string
  summary: string
  areas: string[]
}

const speakerProfiles: Speaker[] = [
  {
    name: 'Abraham Esteban Gamarra Moreno',
    degreeLevel: 'Doctor',
    degree: 'Doctor en Ingeniería',
    country: 'Perú',
    flag: '🇵🇪',
    image: '/images/ponentes/2026/abraham-gamarra-enhanced.webp',
    summary: 'Docente de pregrado y posgrado, investigador y conferencista internacional con formación en informática, inteligencia artificial, robótica y aprendizaje automático.',
    areas: ['Inteligencia artificial', 'Robótica', 'Machine learning'],
  },
  {
    name: 'Daniel Yucra Sotomayor',
    degreeLevel: 'Magíster',
    degree: 'Máster universitario en Administración y Gestión Avanzada de Proyectos',
    country: 'Perú',
    flag: '🇵🇪',
    image: '/images/ponentes/2026/daniel-yucra-enhanced.webp',
    summary: 'Especialista y docente en seguridad de la información, gestión de riesgos tecnológicos, gobierno digital y transformación digital.',
    areas: ['Ciberseguridad', 'Gestión de riesgos', 'Transformación digital'],
  },
  {
    name: 'María Fernanda Díaz Velásquez',
    degreeLevel: 'Doctora',
    degree: 'Doctora en Ciencias Aplicadas',
    country: 'Colombia',
    flag: '🇨🇴',
    image: '/images/ponentes/2026/maria-fernanda-diaz-enhanced.webp',
    summary: 'Ingeniera y líder académica con experiencia en arquitectura empresarial, Industria 4.0 y 5.0, agentes inteligentes y toma de decisiones estratégicas.',
    areas: ['Arquitectura empresarial', 'Industria 5.0', 'Agentes inteligentes'],
  },
  {
    name: 'Patricio Ramírez Correa',
    degreeLevel: 'Ph.D.',
    degree: 'Doctor en Economía y Administración de Empresas',
    country: 'Chile',
    flag: '🇨🇱',
    image: '/images/ponentes/2026/patricio-ramirez-enhanced.webp',
    summary: 'Profesor titular e investigador en sistemas de información, adopción tecnológica, salud digital, comercio electrónico y analítica de datos.',
    areas: ['Sistemas de información', 'Adopción tecnológica', 'Analítica de datos'],
  },
  {
    name: 'Hugo David Calderón Vilca',
    degreeLevel: 'Doctor',
    degree: 'Doctor en Ciencia de la Computación',
    country: 'Perú',
    flag: '🇵🇪',
    image: '/images/ponentes/2026/hugo-calderon-enhanced.webp',
    summary: 'Profesor investigador dedicado a inteligencia artificial, aprendizaje automático, minería de datos y procesamiento de lenguaje natural.',
    areas: ['Inteligencia artificial', 'Minería de datos', 'Lenguaje natural'],
  },
  {
    name: 'Jorge Risco Becerra',
    degreeLevel: 'Doctor',
    degree: 'Doctor por la Escuela Politécnica de la Universidad de São Paulo',
    country: 'Brasil',
    flag: '🇧🇷',
    image: '/images/ponentes/2026/jorge-risco-enhanced.webp',
    summary: 'Profesor de la Universidad de São Paulo y coordinador del Grupo de Arquitectura de Software, con experiencia en ingeniería de software, procesos productivos e Industria 4.0.',
    areas: ['Arquitectura de software', 'Industria 4.0', 'Ingeniería de software'],
  },
  {
    name: 'Javier Gamboa Cruzado',
    degreeLevel: 'Doctor',
    degree: 'Doctor en Ingeniería de Sistemas y Doctor en Administración',
    country: 'Perú',
    flag: '🇵🇪',
    image: '/images/ponentes/2026/javier-gamboa-enhanced.webp',
    summary: 'Docente universitario, consultor e investigador especializado en inteligencia de negocios, minería de datos, Big Data, Six Sigma y asesoría de tesis.',
    areas: ['Business Intelligence', 'Data Mining', 'Big Data'],
  },
]


// Mantener el orden editorial dentro de cada grupo.
export const speakers = [
  ...speakerProfiles.filter(speaker => speaker.country !== 'Perú'),
  ...speakerProfiles.filter(speaker => speaker.country === 'Perú'),
]
