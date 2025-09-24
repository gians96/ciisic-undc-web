// ============================================================================
// COMPOSABLE PARA MANEJO DE PONENTES
// ============================================================================

import type { Ponente } from '~/types'

export const usePonentes = () => {
  // ============================================================================
  // DATOS DE PONENTES CENTRALIZADOS
  // ============================================================================
  
  const ponentes: Ponente[] = [
    {
      id: 1,
      nombre: "Eric Liu",
      imagen: "/images/ponentes/liu-ciisic.webp",
      descripcion: "Vicepresidente de Relaciones Públicas de Huawei Perú, un cargo desde el cual ha participado en acuerdos de colaboración con universidades peruanas para impulsar el talento digital y el desarrollo de la tecnología en el país. ",
      linkedin: "#",
      empresa: "Huawei Perú",
      especialidades: ["Telecomunicaciones", "IoT", "Cloud Computing"]
    },
    {
      id: 2,
      nombre: "Abigail Kauf",
      imagen: "/images/ponentes/kauf-ciisic.webp",
      descripcion: "Profesional en ciberseguridad con diez años de experiencia. Tiene como objetivo diseñar y aplicar métodos eficientes para optimizar el trabajo diario, convirtiéndolos en un valor agregado para las organizaciones en las que colabora.",
      linkedin: "https://www.linkedin.com/in/abigailkauf/",
      empresa: "UTN Argentina",
      especialidades: ["Sistemas de Información", "Educación"]
    },
    {
      id: 3,
      nombre: "Gera Flores",
      imagen: "/images/ponentes/flores-ciisic.webp",
      descripcion: "Ejecutiva senior con más de 12 años de experiencia liderando áreas de analítica avanzada, inteligencia artificial e inteligencia comercial.",
      linkedin: "https://www.linkedin.com/in/gflores1092/",
      empresa: "CENTRUM PUCP",
      especialidades: ["Gestión", "Estrategia", "Educación"]
    },
    {
      id: 4,
      nombre: "José Verbel",
      imagen: "/images/ponentes/verbel-ciisic.webp",
      descripcion: "Especialista en ingeniería del software, con experiencia y habilidades en el Desarrollo de Software, Arquitecturas orientadas a servicios, así como también en la Administración y gestión en el Desarrollo de Soluciones de Software empleando metodologías ágiles.",
      linkedin: "https://www.linkedin.com/in/jverbel",
      empresa: "Solati SAS",
      especialidades: ["Desarrollo", "Tecnología Empresarial", "Software"]
    },
    {
      id: 5,
      nombre: "Jim Dios",
      imagen: "/images/ponentes/diosluna-ciisic.webp",
      descripcion: "Máster en Ingeniería Informática UAM, con amplia experiencia participando y gestionando proyectos multidisciplinarios a corto y mediano plazo.",
      linkedin: "https://www.linkedin.com/in/jimdios/",
      empresa: "Universidad de Lima",
      especialidades: ["Investigación", "Sistemas de Información"]
    },
    {
      id: 6,
      nombre: "Damián Siré",
      imagen: "/images/ponentes/sire-ciisic.webp",
      descripcion: "My days are dedicated to coding, both professionally and in my personal time, as I genuinely enjoy creating things that others can use.",
      linkedin: "https://www.linkedin.com/in/damiansire/",
      empresa: "Google GDE",
      especialidades: ["Development", "Educación"]
    },
    {
      id: 7,
      nombre: "Ivo Yance",
      imagen: "/images/ponentes/yance-ciisic.webp",
      descripcion: "Hace más de una década, ayudo a universidades e institutos brindándoles a sus estudiantes conocimientos sobre marketing, comunicación y liderazgo.",
      linkedin: "https://www.linkedin.com/in/ivoyance/",
      empresa: "Universidad Continental",
      especialidades: ["Gestión", "Soft Skills", "Educación"]
    },
    {
      id: 8,
      nombre: "Jowel Cabrera",
      imagen: "/images/ponentes/cabrera-ciisic.webp",
      descripcion: "Docente Universitario en Gestión de TI, Cibernética Organizacional y Pensamiento Sistémico Blando. Aficionado al Software Libre y procura difundir su Uso.",
      linkedin: "https://www.linkedin.com/in/jowel-cabrera-padilla-b5a85470/",
      empresa: "Universidad Técnica de Georgia",
      especialidades: ["Investigación", "Tecnologías Emergentes"]
    }
  ]

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================
  
  /**
   * Obtiene todos los ponentes
   */
  const getAllPonentes = computed(() => ponentes)
  
  /**
   * Obtiene un ponente por su ID
   */
  const getPonenteById = (id: number) => {
    return ponentes.find(ponente => ponente.id === id)
  }
  
  /**
   * Obtiene ponentes por especialidad
   */
  const getPonentesByEspecialidad = (especialidad: string) => {
    return ponentes.filter(ponente => 
      ponente.especialidades.some((esp: string) => 
        esp.toLowerCase().includes(especialidad.toLowerCase())
      )
    )
  }
  
  /**
   * Obtiene ponentes destacados (primeros 4)
   */
  const getPonenteDestacados = computed(() => ponentes.slice(0, 4))

  // ============================================================================
  // RETURN
  // ============================================================================
  
  return {
    // Data
    ponentes: getAllPonentes,
    
    // Methods
    getPonenteById,
    getPonentesByEspecialidad,
    
    // Computed
    ponentesDestacados: getPonenteDestacados
  }
}
