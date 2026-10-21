// ============================================================================
// DELEGACIONES (BFF /api/publico/delegaciones/*): tarifa, la delegación de un link y los envíos.
// El tipo, el precio y el monto los calcula el backend; aquí nunca se envían.
// ============================================================================
import type { ApiExito } from '~/types/evento'
import type { DelegacionVisible, FilaIntegrante, PagoFormulario, TarifaDelegaciones } from '~/types/delegaciones'
import { construirFormDataPagos, construirFormDataRegistro, integrantesParaEnviar, type DatosRegistroDelegacion } from '~/utils/delegaciones'
import { rutasSitio } from '~/utils/rutas-sitio'

/** Cuerpos de hasta 6 vouchers de 5 MB en conexiones lentas: el tiempo de espera es largo. */
const TIEMPO_ENVIO_MS = 120000

export const useDelegacion = () => {
  const { request } = useApi()

  const tarifa = async (): Promise<TarifaDelegaciones> =>
    (await request<ApiExito<TarifaDelegaciones>>(rutasSitio.delegacionesTarifa, { timeout: 12000 })).data

  const porCodigo = async (codigo: string): Promise<DelegacionVisible> =>
    (await request<ApiExito<DelegacionVisible>>(rutasSitio.delegacion(codigo), { timeout: 15000 })).data

  /** Registra la delegación (o, con `codigoLink`, se suma a la que el staff creó), sus integrantes y sus vouchers. */
  const registrar = async (datos: DatosRegistroDelegacion): Promise<DelegacionVisible> =>
    (await request<ApiExito<DelegacionVisible>>(rutasSitio.delegaciones, {
      method: 'POST', body: construirFormDataRegistro(datos), timeout: TIEMPO_ENVIO_MS,
    })).data

  /** Con el link: suma integrantes (los que ya estaban se omiten). */
  const agregarIntegrantes = async (codigo: string, filas: readonly FilaIntegrante[]): Promise<DelegacionVisible> =>
    (await request<ApiExito<DelegacionVisible>>(rutasSitio.delegacionIntegrantes(codigo), {
      method: 'POST', body: { participantes: integrantesParaEnviar(filas) }, timeout: 30000,
    })).data

  /** Con el link: suma vouchers. */
  const agregarPagos = async (codigo: string, pagos: readonly PagoFormulario[]): Promise<DelegacionVisible> =>
    (await request<ApiExito<DelegacionVisible>>(rutasSitio.delegacionPagos(codigo), {
      method: 'POST', body: construirFormDataPagos(pagos), timeout: TIEMPO_ENVIO_MS,
    })).data

  return { tarifa, porCodigo, registrar, agregarIntegrantes, agregarPagos }
}
