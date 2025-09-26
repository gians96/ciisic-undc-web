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
    const config = useRuntimeConfig() //En el contenedor no funcion
    const baseURL = config.public.apiBaseUrl
    // const baseURL = process.env.API_BASE_URL

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
            const response = await $fetch<RegistrationType[]>(`${baseURL}/api/v1/registration-types`)
            registrationTypes.value = response
            return response
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
            const response = await $fetch<Classification[]>(`${baseURL}/api/v1/classification`)
            classifications.value = response
            return response
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
            const response = await $fetch<DepositMethod[]>(`${baseURL}/api/v1/deposit-method`)
            depositMethods.value = response
            return response
        } catch (err: any) {
            console.error('Error obteniendo métodos de depósito:', err)
            error.value = 'Error al cargar métodos de depósito'
            throw err
        }
    }

    /**
     * Obtiene todos los tipos de pago disponibles
     */
    const getPaymentTypes = async () => {
        try {
            const response = await $fetch<PaymentType[]>(`${baseURL}/api/v1/payment-type`)
            paymentTypes.value = response
            return response
        } catch (err: any) {
            console.error('Error obteniendo tipos de pago:', err)
            error.value = 'Error al cargar tipos de pago'
            throw err
        }
    }

    /**
     * Obtiene todos los estados de inscripción disponibles
     */
    const getInscriptionStates = async () => {
        try {
            const response = await $fetch<InscriptionState[]>(`${baseURL}/api/v1/inscription-state`)
            inscriptionStates.value = response
            return response
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

            // Datos del usuario (como JSON string)
            const usuarioData = {
                dni: data.documentNumber,
                nombres: data.nombres,
                apellidos: data.apellidos,
                correoElectronico: data.email,
                celular: data.celular
            }
            formData.append('usuario', JSON.stringify(usuarioData))

            // Datos del voucher
            formData.append('codigo', data.codigoVoucher)
            formData.append('fechaPago', data.fechaPago)

            // Archivo del voucher
            if (data.archivoVoucher) {
                formData.append('file', data.archivoVoucher)
            }

            // IDs de relaciones
            formData.append('tipoInscripcionId', data.tipoInscripcionId.toString())

            if (data.clasificacionId) {
                formData.append('clasificacionId', data.clasificacionId.toString())
            }

            formData.append('metodoDepositoId', data.metodoDepositoId.toString())
            formData.append('tipoPagoId', data.tipoPagoId.toString())

            console.log('📤 FormData preparado para envío')

            const response = await $fetch<InscriptionResponse>(`${baseURL}/api/v1/inscription`, {
                method: 'POST',
                body: formData
            })

            console.log('✅ Inscripción creada exitosamente:', response)

            // Verificar que la respuesta tenga el formato esperado
            if (!response || typeof response.success !== 'boolean') {
                console.error('⚠️ Respuesta con formato inesperado:', response)
                throw new Error('Respuesta del servidor con formato inválido')
            }

            return response

        } catch (err: any) {
            console.error('💥 Error al crear inscripción:', err)

            // Manejo específico de errores
            if (err.statusCode === 409) {
                // Obtener el mensaje específico del servidor
                const serverMessage = err.data?.message || err.data?.error
                if (serverMessage && serverMessage.includes('código de voucher')) {
                    error.value = serverMessage
                } else if (serverMessage && serverMessage.includes('Ya existe una inscripción registrada')) {
                    error.value = serverMessage
                } else {
                    error.value = 'Ya existe una inscripción con este documento, email o código de voucher.'
                }
            } else if (err.statusCode === 400) {
                // Obtener el mensaje específico del servidor si está disponible
                const serverMessage = err.data?.message || err.data?.details
                if (serverMessage) {
                    error.value = serverMessage
                } else {
                    error.value = 'Datos de inscripción inválidos. Verifique la información.'
                }
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
    const checkVoucherCode = async (codigo: string) => {
        try {
            const response = await $fetch<{ exists: boolean }>(`${baseURL}/api/v1/voucher/check/${codigo}`)
            return response.exists
        } catch (err) {
            console.error('Error al verificar código de voucher:', err)
            return false // En caso de error, asumir que no existe
        }
    }

    const getInscriptionById = async (id: number) => {
        isLoading.value = true
        error.value = null

        try {
            const response = await $fetch(`${baseURL}/api/v1/inscription/${id}`)
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
        const tipoInscripcion = registrationTypes.value.find((t: RegistrationType) =>
            t.value === formData.tipoInscripcion
        )

        const clasificacion = formData.clasificacion && classifications.value?.length
            ? classifications.value.find((c: Classification) => c.nombre === formData.clasificacion)
            : null

        const metodoDeposito = depositMethods.value.find((m: DepositMethod) =>
            m.nombre === formData.modalidadDeposito
        )

        const tipoPago = paymentTypes.value.find((p: PaymentType) =>
            p.nombre === formData.metodoDePago
        )

        // Validar que se encontraron los registros necesarios
        if (!tipoInscripcion) {
            console.error('Tipos disponibles por nombre:', registrationTypes.value.map(t => t.nombre))
            console.error('Tipos disponibles por value:', registrationTypes.value.map(t => t.value))
            console.error('Buscando tipo:', formData.tipoInscripcion)
            throw new Error(`Tipo de inscripción "${formData.tipoInscripcion}" no encontrado`)
        }

        if (!metodoDeposito) {
            console.error('Métodos disponibles:', depositMethods.value.map(m => m.nombre))
            throw new Error(`Método de depósito "${formData.modalidadDeposito}" no encontrado`)
        }

        if (!tipoPago) {
            console.error('Tipos disponibles:', paymentTypes.value.map(p => p.nombre))
            throw new Error(`Tipo de pago "${formData.metodoDePago}" no encontrado`)
        }

        const mappedData: InscriptionData = {
            // Datos del usuario
            documentType: formData.documentType.toUpperCase() as 'DNI' | 'CE',
            documentNumber: formData.documentNumber,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            email: formData.email,
            celular: formData.celular,

            // IDs para relaciones (asegurar que sean números enteros)
            tipoInscripcionId: parseInt(tipoInscripcion.id.toString(), 10),
            clasificacionId: clasificacion?.id ? parseInt(clasificacion.id.toString(), 10) : null,
            metodoDepositoId: parseInt(metodoDeposito.id.toString(), 10),
            tipoPagoId: parseInt(tipoPago.id.toString(), 10),

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
        checkVoucherCode,

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