// ============================================================================
// DELEGACIONES (BFF /api/publico/delegaciones/*): la delegación de un link, el link individual y los envíos.
// El plan lo elige cada integrante; el tipo, el precio y el monto los calcula el backend y aquí nunca se envían.
// ============================================================================
import type { ApiExito } from '~/types/evento'
import type {
  DelegacionPublica, DelegacionVisible, FilaIntegrante, FormularioInscripcionIndividual, InscripcionIndividualRespuesta, PagoFormulario,
} from '~/types/delegaciones'
import { construirFormDataPagos, inscripcionIndividualParaEnviar, integrantesParaEnviar } from '~/utils/delegaciones'
import { rutasSitio } from '~/utils/rutas-sitio'

/** Cuerpos de hasta 6 vouchers de 5 MB en conexiones lentas: el tiempo de espera es largo. */
const TIEMPO_ENVIO_MS = 120000

export const useDelegacion = () => {
  const { request } = useApi()

  /** La delegación de un link del delegado. */
  const porCodigo = async (codigo: string): Promise<DelegacionVisible> =>
    (await request<ApiExito<DelegacionVisible>>(rutasSitio.delegacion(codigo), { timeout: 15000 })).data

  /** Con el link: suma integrantes con su plan (los que ya estaban se omiten). Con dominio, un correo sin `@` se completa. */
  const agregarIntegrantes = async (codigo: string, filas: readonly FilaIntegrante[], dominio: string | null): Promise<DelegacionVisible> =>
    (await request<ApiExito<DelegacionVisible>>(rutasSitio.delegacionIntegrantes(codigo), {
      method: 'POST', body: { participantes: integrantesParaEnviar(filas, dominio) }, timeout: 30000,
    })).data

  /** Con el link: suma vouchers. */
  const agregarPagos = async (codigo: string, pagos: readonly PagoFormulario[]): Promise<DelegacionVisible> =>
    (await request<ApiExito<DelegacionVisible>>(rutasSitio.delegacionPagos(codigo), {
      method: 'POST', body: construirFormDataPagos(pagos), timeout: TIEMPO_ENVIO_MS,
    })).data

  /** El link individual: el grupo, el dominio del correo y los planes activos. */
  const publica = async (codigo: string): Promise<DelegacionPublica> =>
    (await request<ApiExito<DelegacionPublica>>(rutasSitio.delegacionUnirse(codigo), { timeout: 15000 })).data

  /** El link individual: un integrante se inscribe solo (con dominio, solo el prefijo del correo; sin Google). */
  const inscribirme = async (codigo: string, form: FormularioInscripcionIndividual, dominio: string | null): Promise<InscripcionIndividualRespuesta> =>
    (await request<ApiExito<InscripcionIndividualRespuesta>>(rutasSitio.delegacionInscribirme(codigo), {
      method: 'POST', body: inscripcionIndividualParaEnviar(form, dominio), timeout: 30000,
    })).data

  return { porCodigo, agregarIntegrantes, agregarPagos, publica, inscribirme }
}
