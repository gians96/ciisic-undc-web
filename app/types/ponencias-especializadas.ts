// ============================================================================
// TIPOS DE LA API DE PONENCIAS ESPECIALIZADAS (backend-ciisic spec 018)
// Contrato: backend-ciisic/specs/018-ponencias-especializadas/contracts/api-ponencias-especializadas.md
// ============================================================================

export type ModalidadPonencia = 'PRESENCIAL' | 'VIRTUAL'
export type ProcedenciaAsistente = 'INTERNO' | 'EXTERNO'

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
  ponente: { nombre: string, bio: string | null, foto: string | null, externo: boolean }
  orden: number
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
