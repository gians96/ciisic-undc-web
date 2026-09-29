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

/** Cambio de ancho (px) a partir del cual se vuelve a dibujar el botón. */
const CAMBIO_MINIMO_ANCHO = 8

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

  /**
   * Dibuja el botón en `contenedor` con su ancho y lo vuelve a dibujar si el ancho cambia (p. ej. al
   * girar el teléfono). Mientras el contenedor no tenga ancho (aún sin diseño) se espera al
   * `ResizeObserver`. `alRecibirCredencial` recibe el ID token que entrega Google.
   */
  const mostrarBoton = async (contenedor: HTMLElement, clientId: string, alRecibirCredencial: ReceptorCredencial) => {
    if (!import.meta.client || controlador.signal.aborted) return
    receptor = alRecibirCredencial
    estado.value = 'cargando'
    observador?.disconnect()
    clearTimeout(espera)

    const noDisponible = () => {
      if (!controlador.signal.aborted) estado.value = 'no_disponible'
    }
    try {
      await clienteGoogle().cargar()
    } catch {
      // Script bloqueado o sin red: el formulario sigue funcionando sin Google
      noDisponible()
      return
    }

    let anchoDibujado: number | null = null
    const dibujar = async () => {
      const anchoContenedor = contenedor.clientWidth
      if (!anchoContenedor || controlador.signal.aborted) return
      if (anchoDibujado !== null && Math.abs(anchoBotonGoogle(anchoContenedor) - anchoDibujado) < CAMBIO_MINIMO_ANCHO) return
      try {
        const ancho = await clienteGoogle().renderizarBoton(contenedor, { clientId, alRecibirCredencial, senal: controlador.signal, anchoContenedor })
        if (ancho === null) return
        anchoDibujado = ancho
        estado.value = 'listo'
      } catch {
        noDisponible()
      }
    }

    await dibujar()
    if (typeof ResizeObserver === 'undefined' || controlador.signal.aborted) return
    observador = new ResizeObserver(() => {
      clearTimeout(espera)
      // El primer dibujo (contenedor que recién tiene ancho) va sin espera
      espera = setTimeout(dibujar, anchoDibujado === null ? 0 : 200)
    })
    observador.observe(contenedor)
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
