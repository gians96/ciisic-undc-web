// ============================================================================
// TIPOS DE LA API DE PONENCIAS ESPECIALIZADAS (backend-ciisic spec 018)
// Contrato: backend-ciisic/specs/018-ponencias-especializadas/contracts/api-ponencias-especializadas.md
// ============================================================================

export type ModalidadPonencia = 'PRESENCIAL' | 'VIRTUAL'
export type ProcedenciaAsistente = 'INTERNO' | 'EXTERNO'

export interface PonentePublico {
  nombre: string
  bio: string | null
  foto: string | null
  externo: boolean
}

/** Ponencia publicada (`GET /site/specialized-talks`): sin datos de inscritos, solo los cupos que quedan. */
export interface PonenciaEspecializadaPublica {
  id: number
  tema: string
  /** `YYYY-MM-DD`. */
  fecha: string
  /** `HH:mm`, hora de Lima. */
  horaInicio: string
  horaFin: string
  duracionMin: number
  ambiente: string
  modalidad: ModalidadPonencia
  precio: number
  esGratuita: boolean
  /** `null`: sin límite. */
  cupo: number | null
  cuposDisponibles: number | null
  llena: boolean
  ponente: PonentePublico
  /** Los demás ponentes de un tema compartido (backend spec 032); ausente en un backend anterior: un solo ponente. */
  coponentes?: PonentePublico[]
  orden: number
}

/** Ponente en el enlace del aforo: sin biografía. */
export type PonenteAforo = Pick<PonentePublico, 'nombre' | 'foto' | 'externo'>

/** Inscrito vigente en el enlace del aforo: solo su nombre, cómo asiste y cuándo marcó asistencia (nunca documento ni contacto). */
export interface PersonaAforo {
  nombre: string
  modo: ModoAsistencia
  /** Instante ISO; `null` si aún no asistió. */
  asistioEn: string | null
}

/**
 * Ponencia del enlace público del aforo (`GET /site/specialized-talk-occupancy`, backend spec 036). `inscritos` son solo los
 * presenciales vigentes (los que ocupan aforo); `asistentes`, los que ya marcaron asistencia en puerta; `personas`, todos los
 * inscritos vigentes (presenciales y virtuales) por apellido.
 */
export interface PonenciaAforo {
  id: number
  tema: string
  /** `YYYY-MM-DD`. */
  fecha: string
  /** `HH:mm`, hora de Lima. */
  horaInicio: string
  horaFin: string
  duracionMin: number
  ambiente: string
  modalidad: ModalidadPonencia
  ponente: PonenteAforo
  coponentes: PonenteAforo[]
  /** Aforo presencial; `null`: sin límite. */
  cupo: number | null
  inscritos: number
  cuposDisponibles: number | null
  llena: boolean
  asistentes: number
  /** Ausente en un backend anterior: sin lista. */
  personas?: PersonaAforo[]
  orden: number
}

/** `data` de la respuesta del aforo. */
export interface AforoPonencias {
  evento: { nombre: string, nombreCorto: string }
  /** Instante ISO en que el servidor calculó las cifras. */
  generadoEn: string
  ponencias: PonenciaAforo[]
}

/**
 * Cómo se asiste al congreso (backend spec 030): sale del tipo de inscripción. Solo el modo presencial ocupa el
 * aforo de las ponencias; el virtual no tiene límite de cupo.
 */
export type ModoAsistencia = 'PRESENCIAL' | 'VIRTUAL'

/** `GET /site/specialized-talks`: las ponencias y, en `meta`, si el evento está en acceso libre (solo el documento). */
export interface ListaPonenciasRespuesta {
  success: true
  data: PonenciaEspecializadaPublica[]
  /** Ausente en un backend anterior: equivale a acceso libre, como era antes de la spec 030. */
  meta?: { accesoLibre?: boolean }
}

/** Respuesta de `POST /site/specialized-talk-eligibility`: la inscripción al congreso con el pago aprobado. */
export interface VerificacionCongresista {
  nombres: string
  modoAsistencia: ModoAsistencia
  tipo: string | null
  categoria: string | null
}

/** Respuesta de `POST /site/specialized-talk-registrations`. */
export interface InscripcionPonenciasRespuesta {
  asistente: { tipoDocumento: string, numeroDocumento: string, nombres: string, apellidos: string }
  /** `null` con el acceso libre (no se comprobó el congreso); ausente en un backend anterior. */
  modoAsistencia?: ModoAsistencia | null
  inscripciones: Array<{ id: number, yaInscrito: boolean, ponencia: PonenciaEspecializadaPublica }>
}

/** Cuerpo de `POST /site/specialized-talk-eligibility`. */
export interface VerificacionCuerpo {
  tipoDocumento: 'dni' | 'ce'
  numeroDocumento: string
  correo: string
}

/** Cuerpo de `POST /site/specialized-talk-registrations`. */
export interface InscripcionPonenciasCuerpo {
  asistente: {
    tipoDocumento: 'dni' | 'ce'
    numeroDocumento: string
    nombres?: string
    apellidos?: string
    correo?: string
    celular?: string
    procedencia?: ProcedenciaAsistente
  }
  ponenciaIds: number[]
}
