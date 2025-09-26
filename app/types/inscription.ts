// types/inscription.ts

export interface InscriptionData {
    // Datos del usuario
    documentType: 'DNI' | 'CE'
    documentNumber: string
    nombres: string
    apellidos: string
    email: string
    celular: string

    // IDs para relaciones con la base de datos
    tipoInscripcionId: number
    clasificacionId?: number | null
    metodoDepositoId: number
    tipoPagoId: number

    // Datos del voucher
    codigoVoucher: string
    fechaPago: string
    archivoVoucher?: File | null
}

export interface InscriptionResponse {
    success: boolean
    message: string
    data?: {
        id: number
        usuario: {
            id: number
            nombres: string
            apellidos: string
            correoElectronico: string
            celular: string
            numero: string
            dni: string
        }
        tipoInscripcion: {
            id: number
            nombre: string
            precio: number
        }
        clasificacion?: {
            id: number
            nombre: string
        }
        voucher: {
            id: number
            codigo: string
            fechaPago: string
            filename?: string
        }
        estado: {
            id: number
            nombre: string
        }
        creadoEn: string
    }
    error?: string
}

// Tipos para catálogos
export interface RegistrationType {
    id: number
    nombre: string
    badge?: string
    precio: number
    descripcion?: string
    activo: boolean
    caracteristicas?: Array<{icon: string, text: string}> | null
    value?: string
}

export interface Classification {
    id: number
    nombre: string
}

export interface DepositMethod {
    id: number
    nombre: string
    opciones: PaymentType[]
}

export interface PaymentType {
    id: number
    nombre: string
    metodoDepositoId: number
}

export interface InscriptionState {
    id: number
    nombre: string
}

export interface DocumentType {
    id: string
    nombre: string
    abreviatura: string
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    error?: string
}

// Tipos para formulario
export interface FormData {
    documentType: 'DNI' | 'CE'
    documentNumber: string
    nombres: string
    apellidos: string
    email: string
    celular: string
    clasificacion: string
    tipoInscripcion: string
    modalidadDeposito: 'banco' | 'billetera'
    metodoDePago: string
    fechaPago: string
    codigoVoucher: string
    archivoVoucher: File | null
}