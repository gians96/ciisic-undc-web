// ============================================================================
// CONSULTA DE DOCUMENTOS (BFF GET /api/publico/consulta-dni/:numero →
// backend GET /api/v1/site/document-lookup/dni/:numero). Los tokens viven en el servidor.
// ============================================================================

import type { DocumentType } from '~/types'
import type { ApiExito, ConsultaDni } from '~/types/evento'
import { mapearConsultaDni, type NombresConsultados } from '~/utils/consulta-dni'
import { rutasSitio } from '~/utils/rutas-sitio'

export const useConsultation = () => {
  const { request } = useApi()

  // Tipos de documento: solo el DNI se consulta; el carné de extranjería se completa a mano
  const documentTypes: DocumentType[] = [
    {
      value: 'DNI',
      label: 'DNI',
      minLength: 8,
      maxLength: 8,
      placeholder: '12345678',
      pattern: '^[0-9]{8}$',
      consultable: true
    },
    {
      value: 'CE',
      label: 'Carnet de Extranjería',
      minLength: 9,
      maxLength: 12,
      placeholder: '9 a 12 caracteres',
      pattern: '^[A-Za-z0-9]{9,12}$',
      consultable: false
    }
  ]

  /**
   * Consulta un DNI en el backend. Devuelve `null` si la respuesta no trae nombres completos y
   * propaga los errores de la API (404, 503, 429…) para que la página ofrezca el ingreso manual.
   */
  const consultDni = async (numero: string, opciones: { signal?: AbortSignal } = {}): Promise<NombresConsultados | null> => {
    if (!/^\d{8}$/.test(numero)) {
      throw new Error('El DNI debe tener 8 dígitos numéricos')
    }
    const respuesta = await request<ApiExito<ConsultaDni>>(rutasSitio.consultaDni(numero), {
      timeout: 15000,
      signal: opciones.signal
    })
    return mapearConsultaDni(respuesta?.data)
  }

  return {
    consultDni,
    documentTypes
  }
}
