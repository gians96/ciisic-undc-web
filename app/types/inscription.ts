// ============================================================================
// INSCRIPCIÓN — POST /api/v1/public/events/:codigo/inscriptions
// Contrato: backend-ciisic/specs/002-multi-evento/contracts/api-publica.md
// ============================================================================

export type TipoDocumentoApi = 'dni' | 'ce'
export type ModalidadPago = 'banco' | 'billetera'
export type TipoOperacion = 'directo' | 'interbancario'

/** Campo `participante` (JSON) del multipart. */
export interface ParticipanteInscripcion {
    tipoDocumento: TipoDocumentoApi
    numeroDocumento: string
    nombres: string
    apellidos: string
    correo: string
    celular: string
}

/** Datos listos para enviar (ver `construirFormDataInscripcion`); nunca incluyen montos ni estados. */
export interface DatosInscripcion {
    participante: ParticipanteInscripcion
    tipoInscripcionId: number
    clasificacionId: number | null
    modalidadPago: ModalidadPago
    banco: string | null
    tipoOperacion: TipoOperacion | null
    billeteraDigital: string | null
    numeroOperacion: string
    /** `YYYY-MM-DD` tal como viene del selector de fecha. */
    fechaPago: string
    verificacionToken: string | null
    voucher: File | Blob
}

/** Valores tal como los manejan los formularios de /estudiantes y /general. */
export interface FormularioInscripcion {
    documentType: 'DNI' | 'CE'
    documentNumber: string
    nombres: string
    apellidos: string
    email: string
    celular: string
    planId: number | null
    clasificacion?: string | number | null
    modalidadDeposito: ModalidadPago
    bancoSeleccionado?: string | null
    tipoPago?: TipoOperacion | null
    aplicativo?: string | null
    fechaPago: string
    codigoVoucher: string
    archivoVoucher: File | Blob | null
    verificacionToken?: string | null
}

/** `data` de la respuesta `201`. */
export interface InscripcionCreada {
    id: number
    evento: { codigo: string; nombreCorto: string }
    participante: ParticipanteInscripcion
    tipoInscripcion: { id: number; nombre: string; etiqueta: string | null; categoria: string | null } | null
    clasificacion: { id: number; nombre: string } | null
    monto: number
    precioRegular: number
    descuento: number
    esEstudianteUndc: boolean
    modalidadPago: ModalidadPago
    banco: string | null
    tipoOperacion: TipoOperacion | null
    billeteraDigital: string | null
    numeroOperacion: string
    fechaPago: string
    estado: { codigo: string; nombre: string }
    creadoEn: string
}
