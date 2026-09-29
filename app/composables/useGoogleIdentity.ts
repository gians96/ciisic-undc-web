// ============================================================================
// BOTÓN «CONTINUAR CON GOOGLE» (Google Identity Services) — SOLO CLIENTE
// Lo usa InscripcionBotonGoogle, que se monta dentro de <ClientOnly>. El script
// https://accounts.google.com/gsi/client se inserta una vez por página y GIS se inicializa una vez
// por client ID (ventana emergente, sin selección automática ni One Tap). Al desmontar se cancela
// el flujo y el callback deja de apuntar a este formulario.
// ============================================================================
import {
  anchoBotonGoogle,
  crearClienteGoogleIdentity,
  type ClienteGoogleIdentity,
  type ReceptorCredencial,
} from '~/utils/google-identity'

export type EstadoBotonGoogle = 'cargando' | 'listo' | 'no_disponible'

let cliente: ClienteGoogleIdentity | null = null

/** Un solo cliente por página: el script y `initialize` de Google son globales. */
function clienteGoogle(): ClienteGoogleIdentity {
  cliente ??= crearClienteGoogleIdentity({
    crearScript: () => document.createElement('script'),
    buscarScript: src => document.querySelector<HTMLScriptElement>(`script[src="${src}"]`),
    insertarScript: (script) => { document.head.appendChild(script as HTMLScriptElement) },
    ventana: window,
  })
  return cliente
}

export const useGoogleIdentity = () => {
  const estado = ref<EstadoBotonGoogle>('cargando')
  const controlador = new AbortController()
  let receptor: ReceptorCredencial | null = null
  let observador: ResizeObserver | undefined
  let espera: ReturnType<typeof setTimeout> | undefined

  const dibujar = (contenedor: HTMLElement, clientId: string, alRecibirCredencial: ReceptorCredencial) =>
    clienteGoogle().renderizarBoton(contenedor, { clientId, alRecibirCredencial, senal: controlador.signal })

  // El ancho sigue al contenedor (p. ej. al girar el teléfono): se redibuja si cambia 8 px o más
  const seguirAncho = (contenedor: HTMLElement, clientId: string, alRecibirCredencial: ReceptorCredencial) => {
    observador?.disconnect()
    if (typeof ResizeObserver === 'undefined') return
    let ancho = anchoBotonGoogle(contenedor.clientWidth)
    observador = new ResizeObserver(() => {
      clearTimeout(espera)
      espera = setTimeout(() => {
        const nuevo = anchoBotonGoogle(contenedor.clientWidth)
        if (Math.abs(nuevo - ancho) < 8) return
        ancho = nuevo
        dibujar(contenedor, clientId, alRecibirCredencial).catch(() => {})
      }, 200)
    })
    observador.observe(contenedor)
  }

  /** Dibuja el botón en `contenedor`; `alRecibirCredencial` recibe el ID token de Google. */
  const mostrarBoton = async (contenedor: HTMLElement, clientId: string, alRecibirCredencial: ReceptorCredencial) => {
    if (!import.meta.client || controlador.signal.aborted) return
    receptor = alRecibirCredencial
    estado.value = 'cargando'
    try {
      if (!(await dibujar(contenedor, clientId, alRecibirCredencial))) return
      estado.value = 'listo'
      seguirAncho(contenedor, clientId, alRecibirCredencial)
    } catch {
      // Script bloqueado o sin red: el formulario sigue funcionando sin Google
      if (!controlador.signal.aborted) estado.value = 'no_disponible'
    }
  }

  onBeforeUnmount(() => {
    controlador.abort()
    observador?.disconnect()
    clearTimeout(espera)
    // cancel() y el callback deja de entregar credenciales a este formulario
    cliente?.liberar(receptor)
  })

  return { estado: readonly(estado), mostrarBoton }
}
