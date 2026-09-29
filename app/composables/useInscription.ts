// composables/useInscription.ts
// Envío de inscripciones a POST /api/v1/public/events/:codigo/inscriptions (multipart).
// El monto, el descuento y el estado los calcula el backend: aquí nunca se envían.
import type { ApiExito } from '~/types/evento'
import type { DatosInscripcion, FormularioInscripcion, InscripcionCreada } from '~/types/inscription'
import { rutasApiPublica } from '~/utils/api-publica'
import { mensajeErrorInscripcion } from '~/utils/errores-api'
import { construirFormDataInscripcion, mapearFormularioInscripcion } from '~/utils/inscripcion'

export const useInscription = () => {
    const { request } = useApi()
    const codigoEvento = useEventoCodigo()
    const inscriptionStore = useInscriptionStore()

    // Estado reactivo
    const isSubmitting = ref(false)
    const error = ref<string | null>(null)
    const errorCode = ref<string | null>(null)

    /**
     * Mapea los valores del formulario a los datos del contrato
     * (lanza un Error con mensaje en español si falta el plan, el voucher o la fecha es inválida)
     */
    const mapFormDataToApiData = (formulario: FormularioInscripcion): DatosInscripcion => mapearFormularioInscripcion(formulario)

    /**
     * Crea la inscripción y guarda la respuesta en el store para la página de confirmación
     */
    const createInscription = async (datos: DatosInscripcion): Promise<InscripcionCreada> => {
        isSubmitting.value = true
        error.value = null
        errorCode.value = null

        try {
            const respuesta = await request<ApiExito<InscripcionCreada>>(rutasApiPublica.inscripciones(codigoEvento), {
                method: 'POST',
                body: construirFormDataInscripcion(datos),
                // El voucher puede pesar hasta 5 MB en conexiones lentas
                timeout: 60000
            })

            if (!respuesta?.success || !respuesta.data?.id) {
                throw new Error('Respuesta del servidor con formato inválido')
            }

            inscriptionStore.setInscription(respuesta.data)
            return respuesta.data
        } catch (err) {
            const normalizado = normalizeApiError(err)
            errorCode.value = normalizado.code
            error.value = mensajeErrorInscripcion(normalizado)
            throw err
        } finally {
            isSubmitting.value = false
        }
    }

    const clearError = () => {
        error.value = null
        errorCode.value = null
    }

    return {
        // Estado
        isSubmitting: readonly(isSubmitting),
        error: readonly(error),
        errorCode: readonly(errorCode),

        // Métodos
        createInscription,
        mapFormDataToApiData,
        clearError
    }
}
