import {
  demoraHastaCierreInscripcionEgresados,
  estadoInscripcionEgresados,
  normalizarConfiguracionInscripcionEgresados,
} from '~/utils/inscripcion-egresados'

export function useInscripcionEgresados() {
  const runtimeConfig = useRuntimeConfig()
  const configuracion = normalizarConfiguracionInscripcionEgresados(
    runtimeConfig.public as unknown as Record<string, unknown>,
  )

  // El instante inicial viaja en el payload SSR y evita diferencias durante la hidratación.
  const ahora = useState<number>('reloj-inscripcion-egresados', () => Date.now())
  const estado = computed(() => estadoInscripcionEgresados(configuracion, ahora.value))
  let temporizador: ReturnType<typeof setTimeout> | undefined

  function actualizarEstadoPorTiempo() {
    ahora.value = Date.now()
    const demora = demoraHastaCierreInscripcionEgresados(configuracion.cierre, ahora.value)
    if (demora !== null) temporizador = setTimeout(actualizarEstadoPorTiempo, demora)
  }

  function validarDisponibilidadAntesDeAbrir(evento: MouseEvent) {
    ahora.value = Date.now()
    if (estadoInscripcionEgresados(configuracion, ahora.value) !== 'abierta') {
      evento.preventDefault()
    }
  }

  onMounted(actualizarEstadoPorTiempo)
  onBeforeUnmount(() => {
    if (temporizador) clearTimeout(temporizador)
  })

  return {
    configuracion,
    estado,
    validarDisponibilidadAntesDeAbrir,
  }
}
