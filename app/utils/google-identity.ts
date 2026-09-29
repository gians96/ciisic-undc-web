// ============================================================================
// GOOGLE IDENTITY SERVICES: SCRIPT, INICIALIZACIÓN Y BOTÓN (sin Vue ni Nuxt)
// El DOM se inyecta (en pruebas, dobles); en la app lo pasa useGoogleIdentity(), solo en el
// navegador. Solo el botón en ventana emergente: sin One Tap (nunca se llama a prompt()).
// ============================================================================

export const URL_SCRIPT_GOOGLE = 'https://accounts.google.com/gsi/client'

/** Google dibuja el botón con un ancho de 200 a 400 px. */
const ANCHO_MINIMO = 200
const ANCHO_MAXIMO = 400

/** Lo que se usa del `<script>` (un `HTMLScriptElement` lo cumple). */
export interface ScriptGoogle {
  src: string
  async: boolean
  defer: boolean
  addEventListener(tipo: 'load' | 'error', oyente: () => void, opciones?: { once?: boolean }): void
  remove(): void
}

/** Acceso mínimo al documento y a la ventana. */
export interface EntornoGoogleIdentity {
  crearScript(): ScriptGoogle
  buscarScript(src: string): ScriptGoogle | null
  insertarScript(script: ScriptGoogle): void
  ventana: { google?: { accounts?: { id?: GoogleAccountsId } } }
}

/** Recibe el ID token (`credential`) que entrega Google al elegir una cuenta. */
export type ReceptorCredencial = (credencial: string) => void

export interface ClienteGoogleIdentity {
  /** Inserta el script una sola vez por página y espera su `load` (sin sondeo). */
  cargar(): Promise<GoogleAccountsId>
  /**
   * Inicializa GIS (una vez por client ID), deja a `alRecibirCredencial` como receptor y dibuja el
   * botón en el contenedor con el ancho indicado (por defecto, el del contenedor). Devuelve el
   * ancho con que se dibujó o `null` si `senal` se abortó mientras cargaba el script.
   */
  renderizarBoton(
    contenedor: HTMLElement,
    opciones: { clientId: string, alRecibirCredencial: ReceptorCredencial, senal?: AbortSignal, anchoContenedor?: number },
  ): Promise<number | null>
  /** Suelta el receptor (si sigue siendo el indicado) y cancela el flujo de Google en curso. */
  liberar(alRecibirCredencial: ReceptorCredencial | null): void
}

/** Ancho del botón a partir del ancho del contenedor (entre 200 y 400 px). */
export function anchoBotonGoogle(anchoContenedor: number): number {
  const ancho = Number.isFinite(anchoContenedor) ? Math.floor(anchoContenedor) : 0
  return Math.min(ANCHO_MAXIMO, Math.max(ANCHO_MINIMO, ancho))
}

/** Botón «Continuar con Google» en español, con forma de píldora y el ancho del contenedor. */
export function opcionesBotonGoogle(anchoContenedor: number): GoogleButtonConfiguration {
  return {
    type: 'standard',
    theme: 'filled_black',
    size: 'large',
    text: 'continue_with',
    shape: 'pill',
    logo_alignment: 'left',
    locale: 'es',
    width: anchoBotonGoogle(anchoContenedor),
  }
}

export function crearClienteGoogleIdentity(entorno: EntornoGoogleIdentity): ClienteGoogleIdentity {
  let carga: Promise<GoogleAccountsId> | null = null
  let clientIdInicializado: string | null = null
  let receptor: ReceptorCredencial | null = null

  const disponible = () => entorno.ventana.google?.accounts?.id ?? null

  const cargar = (): Promise<GoogleAccountsId> => {
    const id = disponible()
    if (id) return Promise.resolve(id)
    carga ??= new Promise<GoogleAccountsId>((resolver, rechazar) => {
      const existente = entorno.buscarScript(URL_SCRIPT_GOOGLE)
      const script = existente ?? entorno.crearScript()
      const fallar = () => {
        // Se quita el <script> para que un intento posterior lo vuelva a insertar
        carga = null
        script.remove()
        rechazar(new Error('No se pudo cargar Google Identity Services'))
      }
      script.addEventListener('load', () => {
        const cargado = disponible()
        if (cargado) resolver(cargado)
        else fallar()
      }, { once: true })
      script.addEventListener('error', fallar, { once: true })
      if (!existente) {
        script.src = URL_SCRIPT_GOOGLE
        script.async = true
        script.defer = true
        entorno.insertarScript(script)
      }
    })
    return carga
  }

  const renderizarBoton: ClienteGoogleIdentity['renderizarBoton'] = async (contenedor, { clientId, alRecibirCredencial, senal, anchoContenedor }) => {
    const id = await cargar()
    if (senal?.aborted) return null
    if (clientIdInicializado !== clientId) {
      id.initialize({
        client_id: clientId,
        // Callback fijo que delega en el receptor vigente: cada formulario lo reemplaza
        callback: (respuesta) => {
          const credencial = respuesta?.credential
          if (typeof credencial === 'string' && credencial) receptor?.(credencial)
        },
        auto_select: false,
        ux_mode: 'popup',
      })
      clientIdInicializado = clientId
    }
    receptor = alRecibirCredencial
    const opciones = opcionesBotonGoogle(anchoContenedor ?? contenedor.clientWidth)
    contenedor.replaceChildren()
    id.renderButton(contenedor, opciones)
    return opciones.width ?? null
  }

  const liberar = (alRecibirCredencial: ReceptorCredencial | null) => {
    if (alRecibirCredencial && receptor === alRecibirCredencial) receptor = null
    disponible()?.cancel()
  }

  return { cargar, renderizarBoton, liberar }
}
