// ============================================================================
// COMPOSABLE PARA CONSULTA DE DOCUMENTOS
// ============================================================================

import type { DniConsultationResponse, DocumentType } from '~/types'

export const useConsultation = () => {
  
  // Tipos de documento disponibles
  const documentTypes: DocumentType[] = [
    {
      value: 'DNI',
      label: 'DNI',
      maxLength: 8,
      placeholder: '12345678',
      pattern: '^[0-9]{8}$'
    },
    {
      value: 'CE',
      label: 'Carnet de Extranjería',
      maxLength: 9,
      placeholder: '123456789',
      pattern: '^[0-9]{9}$'
    }
  ]

  /**
   * Consulta los datos de una persona mediante su DNI o CE
   * Esta función llama al endpoint del servidor para proteger el token
   */
  const consultDni = async (documentNumber: string, documentType: 'DNI' | 'CE' = 'DNI'): Promise<DniConsultationResponse | null> => {
    try {
      const expectedLength = documentType === 'DNI' ? 8 : 9
      
      // Validación básica del documento
      if (!documentNumber || documentNumber.length !== expectedLength || !/^\d+$/.test(documentNumber)) {
        throw new Error(`${documentType} debe tener ${expectedLength} dígitos numéricos`)
      }

      console.log(`Consultando ${documentType}: ${documentNumber}`)

      // Hacer la petición al endpoint del servidor
      const response = await $fetch<DniConsultationResponse>('/api/consultation', {
        method: 'POST',
        body: {
          documentNumber,
          documentType
        }
      })
      
      console.log('Respuesta del servidor:', response)
      return response
      
    } catch (error) {
      console.error(`Error consultando ${documentType}:`, error)
      throw error
    }
  }

  return {
    consultDni,
    documentTypes
  }
}