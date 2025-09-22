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
      nombre: "Gera Flores Sempertegui",
      imagen: "/images/ponentes/yera_flores.png",
      descripcion: "Ejecutiva senior con más de 12 años de experiencia liderando áreas de analítica avanzada, inteligencia artificial e inteligencia comercial.",
      linkedin: "https://www.linkedin.com/in/gflores1092/",
      empresa: "Miss Yera",
      especialidades: ["Gestión", "Estrategia", "Educación"]
    },
    {
      id: 2,
      nombre: "Jim Dios Luna",
      imagen: "/images/ponentes/diosluna.png",
      descripcion: "Máster en Ingeniería Informática por la Universidad Autónoma de Madrid, con amplia experiencia participando y gestionando proyectos multidisciplinarios a corto y mediano plazo.",
      linkedin: "https://www.linkedin.com/in/jimdios/",
      empresa: "Universidad de Lima",
      especialidades: ["Investigación", "Sistemas de Información", "Ciencias de la Computación"]
    },
    {
      id: 3,
      nombre: "Jowel Cabrera Padilla",
      imagen: "/images/ponentes/cabrera.png",
      descripcion: "Docente Universitario en Gestión de TI, Cibernética Organizacional y Pensamiento Sistémico Blando. Aficionado al Software Libre y procura difundir su Uso.",
      linkedin: "https://www.linkedin.com/in/jowel-cabrera-padilla-b5a85470/",
      empresa: "Universidad Técnica de Georgia",
      especialidades: ["Investigación", "Sistemas Computacionales", "Tecnologías Emergentes"]
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
