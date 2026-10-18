import { specializedTalks } from './ponencias-especializadas'

export type EventCategory = 'academic' | 'institutional' | 'cultural'

export interface ScheduleEvent {
  /** Horario en 24 h con el formato «HH:mm - HH:mm». */
  time: string
  title: string
  detail?: string
  meta?: string
  category: EventCategory
  /** Enlace interno que se muestra en la tarjeta del evento. */
  href?: string
  /** Texto del enlace; sin él es «Ver ponentes y temas» (las ponencias especializadas). */
  etiquetaEnlace?: string
  /** Ponente invitado de este evento: el `name` exacto de `~/data/speakers`. */
  ponente?: string
}

export interface ScheduleDay {
  short: string
  dayNumber: string
  /** Fecha corta «DD/MM». */
  date: string
  events: ScheduleEvent[]
}

const ANIO = '2026'

/** «27/10» → «2026-10-27» (el formato de fecha de `specializedTalks`). */
const fechaIso = (date: string) => {
  const [dia, mes] = date.split('/')
  return `${ANIO}-${mes}-${dia}`
}

/**
 * Bloque «Ponencias Especializadas» de un día. El horario, la cantidad de ponencias y los
 * ambientes salen de `specializedTalks`, así que el cronograma no se desalinea de la página
 * de Ponencias especializadas.
 */
const ponenciasEspecializadas = (date: string): ScheduleEvent => {
  const talks = specializedTalks.filter(talk => talk.date === fechaIso(date))
  const primero = talks[0]
  const hayLaboratorios = talks.some(talk => /^laboratorio/i.test(talk.room))
  const hayAulas = talks.some(talk => /^aula/i.test(talk.room))
  const ambientes = hayLaboratorios && hayAulas ? 'Laboratorios y aulas' : hayLaboratorios ? 'Laboratorios' : 'Aulas'

  return {
    time: primero ? `${primero.start} - ${primero.end}` : '12:00 - 12:45',
    title: 'Ponencias Especializadas',
    detail: talks.length ? `${talks.length} ${talks.length === 1 ? 'ponencia' : 'ponencias simultáneas'} · ${ambientes}` : undefined,
    category: 'academic',
    href: '/ponencias-especializadas',
  }
}

export const schedule: ScheduleDay[] = [
  { short: 'Lunes', dayNumber: '26', date: '26/10', events: [
    { time: '08:00 - 09:00', title: 'Recepción de delegaciones', category: 'institutional' },
    { time: '09:00 - 10:30', title: 'Actividades de integración y socioculturales', category: 'cultural' },
    { time: '14:30 - 17:00', title: 'Comparsa Sistémica', detail: 'Concentración 2:30 p. m. · de la Casa de la Cultura a la Plaza de Armas', category: 'cultural', href: '/semana-sistemica/comparsa', etiquetaEnlace: 'Ver detalles' },
  ] },
  { short: 'Martes', dayNumber: '27', date: '27/10', events: [
    { time: '08:00 - 09:00', title: 'Registro de participantes', category: 'institutional' },
    { time: '09:00 - 10:30', title: '¿QUIÉN ESTÁ PREPARADO PARA USAR IA GENERATIVA EN SALUD? CÓMO MEDIR Y PREDECIR SU ADOPCIÓN CON AYUDA PROPIA DE LA IA', detail: 'Ponente internacional Ph.D. Patricio Ramírez Correa', meta: 'Chile · Presencial', category: 'institutional', ponente: 'Patricio Ramírez Correa' },
    { time: '10:30 - 11:15', title: 'CIBERSEGURIDAD 2030: AMENAZAS EMERGENTES, INTELIGENCIA ARTIFICIAL Y EL FUTURO DE LA PROTECCIÓN DIGITAL', detail: 'M.Sc. Daniel Alejandro Yucra Sotomayor', meta: 'Perú', category: 'academic', ponente: 'Daniel Yucra Sotomayor' },
    { time: '11:15 - 12:00', title: 'GRAPH MACHINE LEARNING: APLICACIONES', detail: 'Dr. César Armando Beltrán Castañón', meta: 'Perú', category: 'academic', ponente: 'Cesar Armando Beltran Castañon' },
    ponenciasEspecializadas('27/10'),
    { time: '13:00 - 14:00', title: 'Break', category: 'cultural' },
    { time: '15:00 - 18:00', title: 'E-Sports / Concurso de Programación / Elevator Pitch', category: 'cultural' },
    { time: '18:00 - 20:00', title: 'Encuentro de Egresados', category: 'cultural' },
  ] },
  { short: 'Miércoles', dayNumber: '28', date: '28/10', events: [
    { time: '08:00 - 09:00', title: 'Registro de participantes', category: 'institutional' },
    { time: '09:00 - 10:00', title: 'IMAGE CAPTIONING CON VISION TRANSFORMERS E IA MULTIMODAL', detail: 'Dr. Abraham Gamarra Moreno', meta: 'Perú', category: 'academic', ponente: 'Abraham Esteban Gamarra Moreno' },
    { time: '10:00 - 10:50', title: 'INGENIERÍA DE SOFTWARE INTELIGENTE: ARQUITECTURAS, AUTOMATIZACIÓN Y NUEVOS DESAFÍOS EN LA ERA DE LA INTELIGENCIA ARTIFICIAL', detail: 'Dr. Jorge Risco Becerra', meta: 'Brasil · Virtual', category: 'academic', ponente: 'Jorge Risco Becerra' },
    { time: '10:50 - 11:40', title: 'DEL PDF AL KNOWLEDGE GRAPH DE CONTRIBUCIONES: UN PIPELINE HÍBRIDO, TRAZABLE Y AUDITABLE CON DOCKER, GROBID Y LLM', detail: 'Dr. Javier Gamboa Cruzado', meta: 'Perú', category: 'academic', ponente: 'Javier Gamboa Cruzado' },
    { time: '11:40 - 12:00', title: 'NASA Space Apps', category: 'academic' },
    ponenciasEspecializadas('28/10'),
    { time: '13:00 - 14:00', title: 'Break', category: 'cultural' },
    { time: '15:00 - 23:00', title: 'Reinado', detail: 'Auditorio de la Casa de la Cultura', category: 'cultural', href: '/semana-sistemica/reinado', etiquetaEnlace: 'Ver detalles' },
  ] },
  { short: 'Jueves', dayNumber: '29', date: '29/10', events: [
    { time: '08:00 - 09:00', title: 'Registro de participantes', category: 'institutional' },
    { time: '09:00 - 10:30', title: 'HUMAN-AI CO-INTELLIGENCE ARTEFACT FOR STRATEGIC DECISION-MAKING IN ENTERPRISE ARCHITECTURE', detail: 'Dra. María Fernanda Díaz Velásquez', meta: 'Colombia · Presencial', category: 'academic', ponente: 'María Fernanda Díaz Velásquez' },
    { time: '10:30 - 11:15', title: 'INTELIGENCIA ARTIFICIAL: UN MUNDO DE OPORTUNIDADES PARA INVESTIGAR, INNOVAR Y TRANSFORMAR', detail: 'Dr. Hugo David Calderón Vilca', meta: 'Perú', category: 'academic', ponente: 'Hugo David Calderón Vilca' },
    { time: '11:15 - 12:00', title: 'BOTS, AGENTES DE IA Y RANSOMWARE EN CIBERSEGURIDAD', detail: 'Contralmte. Mg. Enrique Luis Arnáez Braschi', meta: 'Perú', category: 'academic', ponente: 'Enrique Luis Arnáez Braschi' },
    { time: '12:00 - 12:20', title: 'Ponencias de Investigación', category: 'academic' },
    { time: '12:20 - 12:45', title: 'Clausura', category: 'institutional' },
    { time: '13:00 - 14:00', title: 'Break', category: 'cultural' },
    { time: '14:00 - 15:00', title: 'E-Sports', category: 'cultural' },
    { time: '15:00 - 18:00', title: 'Cyber Clash — Kriptome Cybersecurity', detail: 'Auditorio de la Casa de la Cultura · Ciberseguridad, ransomware y buenas prácticas', category: 'cultural', href: '/semana-sistemica/cyber-clash', etiquetaEnlace: 'Ver detalles' },
    { time: '18:00 - 23:30', title: 'Hackathon', category: 'cultural' },
  ] },
  { short: 'Viernes', dayNumber: '30', date: '30/10', events: [
    { time: '08:00 - 09:00', title: 'Recibimiento y pasacalles', detail: 'Campus UNDC', category: 'cultural', href: '/semana-sistemica/deportes', etiquetaEnlace: 'Ver detalles' },
    { time: '10:00 - 12:00', title: 'Gincana', detail: 'Explanada central', category: 'cultural' },
    { time: '12:00 - 13:30', title: 'Refrigerio', category: 'cultural' },
    { time: '13:30 - 19:00', title: 'Deportes en simultáneo', detail: 'Básquet, futsal, vóley y ajedrez', category: 'cultural', href: '/semana-sistemica/deportes', etiquetaEnlace: 'Ver detalles' },
    { time: '20:00 - 21:00', title: 'Premiación', detail: 'A cargo de las autoridades universitarias', category: 'cultural' },
  ] },
]
