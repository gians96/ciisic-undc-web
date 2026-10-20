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

/** Respuesta de `POST /site/specialized-talk-registrations`. */
export interface InscripcionPonenciasRespuesta {
  asistente: { tipoDocumento: string, numeroDocumento: string, nombres: string, apellidos: string }
  inscripciones: Array<{ id: number, yaInscrito: boolean, ponencia: PonenciaEspecializadaPublica }>
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
