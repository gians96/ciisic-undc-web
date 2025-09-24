// composables/useInscription.ts
import type {
    InscriptionData,
    InscriptionResponse,
    RegistrationType,
    Classification,
    DepositMethod,
    PaymentType,
    InscriptionState,
    ApiResponse
} from '@/types/inscription'

export const useInscription = () => {
    const config = useRuntimeConfig()
    const baseURL = config.public.apiBaseUrl || 'http://localhost:3000'

    // Estado reactivo
    const isSubmitting = ref(false)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Datos de catálogos
    const registrationTypes = ref<RegistrationType[]>([])
    const classifications = ref<Classification[]>([])
    const depositMethods = ref<DepositMethod[]>([])
    const paymentTypes = ref<PaymentType[]>([])
    const inscriptionStates = ref<InscriptionState[]>([])

    // ===========================================================================
    // OBTENER DATOS DE CATÁLOGOS
    // ===========================================================================

    /**
     * Obtiene todos los tipos de inscripción disponibles
     */
    const getRegistrationTypes = async () => {
        try {
            const response = await $fetch<ApiResponse<RegistrationType[]>>(`${baseURL}/api/v1/registration-types`)
            registrationTypes.value = response.data
            return response.data
        } catch (err: any) {
            console.error('Error obteniendo tipos de inscripción:', err)
            error.value = 'Error al cargar tipos de inscripción'
            throw err
        }
    }

    /**
     * Obtiene todas las clasificaciones disponibles
     */
    const getClassifications = async () => {
        try {
            const response = await $fetch<ApiResponse<Classification[]>>(`${baseURL}/api/v1/classification`)
            classifications.value = response.data
            return response.data
        } catch (err: any) {
            console.error('Error obteniendo clasificaciones:', err)
            error.value = 'Error al cargar clasificaciones'
            throw err
        }
    }

    /**
     * Obtiene todos los métodos de depósito disponibles
     */
    const getDepositMethods = async () => {
        try {
            const response = await $fetch<ApiResponse<DepositMethod[]>>(`${baseURL}/api/v1/deposit-method`)
            depositMethods.value = response.data
            return response.data
        } catch (err: any) {
            console.error('Error obteniendo métodos de depósito:', err)
            error.value = 'Error al cargar métodos de depósito'
            throw err
        }
    }

    /**
     * Obtiene todos los tipos de pago disponibles para un método de depósito
     */
    const getPaymentTypes = async (depositMethodId?: number) => {
        try {
            const url = depositMethodId
                ? `${baseURL}/api/v1/payment-type?depositMethodId=${depositMethodId}`
                : `${baseURL}/api/v1/payment-type`

            const response = await $fetch<ApiResponse<PaymentType[]>>(url)
            paymentTypes.value = response.data
            return response.data
        } catch (err: any) {
            console.error('Error obteniendo tipos de pago:', err)
            error.value = 'Error al cargar tipos de pago'
            throw err
        }
    }

    /**
     * Obtiene todos los estados de inscripción
     */
    const getInscriptionStates = async () => {
        try {
            const response = await $fetch<ApiResponse<InscriptionState[]>>(`${baseURL}/api/v1/inscription-state`)
            inscriptionStates.value = response.data
            return response.data
        } catch (err: any) {
            console.error('Error obteniendo estados de inscripción:', err)
            error.value = 'Error al cargar estados de inscripción'
            throw err
        }
    }

    // ===========================================================================
    // CREAR INSCRIPCIÓN COMPLETA
    // ===========================================================================

    /**
     * Crea una inscripción completa con usuario, voucher y datos de pago
     */
    const createInscription = async (data: InscriptionData): Promise<InscriptionResponse> => {
        isSubmitting.value = true
        error.value = null

        try {
            console.log('📤 Enviando inscripción:', data)

            // Crear FormData para incluir el archivo del voucher
            const formData = new FormData()

            // Datos del usuario
            formData.append('documentType', data.documentType)
            formData.append('documentNumber', data.documentNumber)
            formData.append('nombres', data.nombres)
            formData.append('apellidos', data.apellidos)
            formData.append('email', data.email)
            formData.append('celular', data.celular)

            // Datos de inscripción
            formData.append('tipoInscripcionId', data.tipoInscripcionId.toString())

            if (data.clasificacionId) {
                formData.append('clasificacionId', data.clasificacionId.toString())
            }

            formData.append('metodoDepositoId', data.metodoDepositoId.toString())
            formData.append('tipoPagoId', data.tipoPagoId.toString())

            // Datos del voucher
            formData.append('codigoVoucher', data.codigoVoucher)
            formData.append('fechaPago', data.fechaPago)

            if (data.archivoVoucher) {
                formData.append('voucherFile', data.archivoVoucher)
            }

            // Metadata adicional
            formData.append('timestamp', new Date().toISOString())
            formData.append('userAgent', navigator.userAgent)

            const response = await $fetch<InscriptionResponse>(`${baseURL}/api/v1/inscriptions`, {
                method: 'POST',
                body: formData
            })

            console.log('✅ Inscripción creada exitosamente:', response)
            return response

        } catch (err: any) {
            console.error('💥 Error al crear inscripción:', err)

            // Manejo específico de errores
            if (err.statusCode === 400) {
                error.value = 'Datos de inscripción inválidos. Verifique la información.'
            } else if (err.statusCode === 409) {
                error.value = 'Ya existe una inscripción con este documento o email.'
            } else if (err.statusCode === 422) {
                error.value = 'Error de validación. Verifique todos los campos obligatorios.'
            } else if (err.statusCode === 500) {
                error.value = 'Error del servidor. Inténtelo más tarde.'
            } else {
                error.value = 'Error de conexión. Verifique su internet e inténtelo nuevamente.'
            }

            throw err

        } finally {
            isSubmitting.value = false
        }
    }

    // ===========================================================================
    // OBTENER INSCRIPCIÓN POR ID
    // ===========================================================================

    /**
     * Obtiene una inscripción específica por su ID
     */
    const getInscriptionById = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await $fetch(`${baseURL}/api/v1/inscriptions/${id}`)
            return response
        } catch (err: any) {
            console.error('Error obteniendo inscripción:', err)
            error.value = 'Error al obtener la inscripción'
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // ===========================================================================
    // UTILIDADES
    // ===========================================================================

    /**
     * Limpia todos los errores
     */
    const clearError = () => {
        error.value = null
    }

    /**
     * Inicializa todos los catálogos necesarios
     */
    const initializeCatalogs = async () => {
        isLoading.value = true
        error.value = null

        try {
            await Promise.all([
                getRegistrationTypes(),
                getClassifications(),
                getDepositMethods(),
                getPaymentTypes(),
                getInscriptionStates()
            ])

            console.log('✅ Catálogos inicializados correctamente')
        } catch (err) {
            console.error('💥 Error inicializando catálogos:', err)
            error.value = 'Error al cargar datos iniciales'
        } finally {
            isLoading.value = false
        }
    }

    /**
     * Mapea los valores del formulario a los IDs de la base de datos
     */
    const mapFormDataToApiData = (formData: any): InscriptionData => {
        console.log('🔍 Mapeando datos del formulario:', formData)
        console.log('📚 Catálogos disponibles:', {
            registrationTypes: registrationTypes.value?.length || 0,
            classifications: classifications.value?.length || 0,
            depositMethods: depositMethods.value?.length || 0,
            paymentTypes: paymentTypes.value?.length || 0
        })

        // Validar que los catálogos estén cargados
        if (!registrationTypes.value?.length) {
            throw new Error('Los tipos de inscripción no están cargados. Recargue la página e intente nuevamente.')
        }

        if (!depositMethods.value?.length) {
            throw new Error('Los métodos de depósito no están cargados. Recargue la página e intente nuevamente.')
        }

        if (!paymentTypes.value?.length) {
            throw new Error('Los tipos de pago no están cargados. Recargue la página e intente nuevamente.')
        }

        // Buscar los IDs correspondientes en los catálogos cargados
        const tipoInscripcion = registrationTypes.value.find((t: RegistrationType) => t.nombre === formData.tipoInscripcion)
        const clasificacion = formData.clasificacion && classifications.value?.length
            ? classifications.value.find((c: Classification) => c.nombre === formData.clasificacion)
            : null
        const metodoDeposito = depositMethods.value.find((m: DepositMethod) => m.nombre === formData.modalidadDeposito)
        const tipoPago = paymentTypes.value.find((p: PaymentType) => p.nombre === formData.metodoDePago)

        // Validar que se encontraron los registros necesarios
        if (!tipoInscripcion) {
            throw new Error(`Tipo de inscripción "${formData.tipoInscripcion}" no encontrado`)
        }

        if (!metodoDeposito) {
            throw new Error(`Método de depósito "${formData.modalidadDeposito}" no encontrado`)
        }

        if (!tipoPago) {
            throw new Error(`Tipo de pago "${formData.metodoDePago}" no encontrado`)
        }

        const mappedData: InscriptionData = {
            // Datos del usuario
            documentType: formData.documentType,
            documentNumber: formData.documentNumber,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            email: formData.email,
            celular: formData.celular,

            // IDs para relaciones
            tipoInscripcionId: tipoInscripcion.id,
            clasificacionId: clasificacion?.id || null,
            metodoDepositoId: metodoDeposito.id,
            tipoPagoId: tipoPago.id,

            // Datos del voucher
            codigoVoucher: formData.codigoVoucher,
            fechaPago: formData.fechaPago,
            archivoVoucher: formData.archivoVoucher
        }

        console.log('✅ Datos mapeados correctamente:', mappedData)
        return mappedData
    }

    return {
        // Estado
        isSubmitting: readonly(isSubmitting),
        isLoading: readonly(isLoading),
        error: readonly(error),

        // Datos
        registrationTypes: readonly(registrationTypes),
        classifications: readonly(classifications),
        depositMethods: readonly(depositMethods),
        paymentTypes: readonly(paymentTypes),
        inscriptionStates: readonly(inscriptionStates),

        // Métodos principales
        createInscription,
        getInscriptionById,

        // Métodos de catálogos
        getRegistrationTypes,
        getClassifications,
        getDepositMethods,
        getPaymentTypes,
        getInscriptionStates,

        // Utilidades
        clearError,
        initializeCatalogs,
        mapFormDataToApiData
    }
}