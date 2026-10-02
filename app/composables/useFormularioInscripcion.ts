// ============================================================================
// FORMULARIO DE INSCRIPCIÓN (lógica compartida de /estudiantes y /general)
// Cada página conserva su template y sus estilos; aquí vive el estado y el comportamiento.
// ============================================================================
import type { BilleteraDigital, CodigoCategoria, CuentaBancaria } from '~/types/evento'
import type { ModalidadPago, TipoOperacion } from '~/types/inscription'
import { mensajeFallaConsultaDni } from '~/utils/consulta-dni'
import { formatearSoles, nombreBilletera, nombreDescargaQr, titularBilletera, urlQrBilletera } from '~/utils/formato'
import { nombresDesdeGoogle, tokenCorreoParaEnvio } from '~/utils/google'
import { VOUCHER_ACCEPT, esCelularValido, fechaHoyLima, validarArchivoVoucher } from '~/utils/inscripcion'
import { modalidadesDisponibles, resolverMedioPago, type EleccionPago } from '~/utils/medios-pago'
import { aplicaPrecioInstitucional, avisoPlanesOcultos, debeLimpiarPlan, esCorreoDelDominio, planDisponible, precioPlan } from '~/utils/planes'
import { esCorreoValido } from '~/utils/verificacion'

export type EstadoPaginaInscripcion = 'cargando' | 'error' | 'cerradas' | 'abiertas'

interface OpcionesFormulario {
  categoria: CodigoCategoria
  /** `/estudiantes`: verificación de estudiante UNDC y selector de ciclo. */
  verificarEstudiante?: boolean
}

const DOMINIO_POR_DEFECTO = 'undc.edu.pe'

export function useFormularioInscripcion(opciones: OpcionesFormulario) {
  const conVerificacion = opciones.verificarEstudiante === true
  const router = useRouter()

  // ===========================================================================
  // DATOS DEL EVENTO (BFF con caché)
  // ===========================================================================
  const {
    evento,
    error: errorEvento,
    inscripcionesAbiertas,
    datosPago,
    recargar: recargarEvento,
  } = useEvento()
  const { planes, error: errorPlanes, cargando: cargandoPlanes, recargar: recargarPlanes } = usePlanes(opciones.categoria)
  const catalogos = conVerificacion ? useCatalogos() : null
  const clasificaciones = computed(() => catalogos?.clasificaciones.value ?? [])

  const { consultDni, documentTypes } = useConsultation()
  const {
    createInscription,
    mapFormDataToApiData,
    isSubmitting: apiSubmitting,
    error: apiError,
    errorCode,
    clearError,
  } = useInscription()

  const dominioInstitucional = computed(() => evento.value?.dominioInstitucional || DOMINIO_POR_DEFECTO)

  /** Qué muestra la página: el formulario solo con evento abierto y planes cargados. */
  const estadoPagina = computed<EstadoPaginaInscripcion>(() => {
    if (evento.value && !inscripcionesAbiertas.value) return 'cerradas'
    if (errorEvento.value || errorPlanes.value || catalogos?.error.value) return 'error'
    if (!evento.value || cargandoPlanes.value || catalogos?.cargando.value) return 'cargando'
    return 'abiertas'
  })

  const recargar = async () => {
    await Promise.all([recargarEvento(), recargarPlanes(), catalogos?.recargar()])
  }

  // ===========================================================================
  // ESTADO DEL FORMULARIO
  // ===========================================================================
  const documentType = ref<'DNI' | 'CE'>('DNI')
  const documentNumber = ref('')
  const nombres = ref('')
  const apellidos = ref('')
  const nombresEncontrados = ref(false)
  const email = ref('')
  const celular = ref('')
  const clasificacion = ref('')
  const planId = ref<number | null>(null)
  const fechaPago = ref('')
  const codigoVoucher = ref('')
  const archivoVoucher = ref<File | null>(null)
  const isSearchingDni = ref(false)
  const consultaDniFallida = ref(false)
  const isSubmitting = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const showQrModal = ref(false)
  // "Hoy" en Lima se calcula en el navegador (evita desajustes de hidratación a medianoche)
  const fechaMaxima = ref('')

  // ===========================================================================
  // NOTIFICACIONES
  // ===========================================================================
  let temporizadorError: ReturnType<typeof setTimeout> | undefined
  let temporizadorExito: ReturnType<typeof setTimeout> | undefined

  const showError = (message: string) => {
    errorMessage.value = message
    successMessage.value = ''
    clearTimeout(temporizadorError)
    temporizadorError = setTimeout(() => { errorMessage.value = '' }, 8000)
  }

  const showSuccess = (message: string) => {
    successMessage.value = message
    errorMessage.value = ''
    clearTimeout(temporizadorExito)
    temporizadorExito = setTimeout(() => { successMessage.value = '' }, 3000)
  }

  onScopeDispose(() => {
    clearTimeout(temporizadorError)
    clearTimeout(temporizadorExito)
  })

  // ===========================================================================
  // DOCUMENTO Y CONSULTA DE DNI
  // ===========================================================================
  const getSelectedDocumentType = () => documentTypes.find(type => type.value === documentType.value)

  const isDocumentNumberComplete = () => {
    const tipo = getSelectedDocumentType()
    return Boolean(tipo) && new RegExp(tipo!.pattern).test(documentNumber.value)
  }

  const getRemainingDigits = () => Math.max(0, (getSelectedDocumentType()?.minLength || 8) - documentNumber.value.length)

  // Solo el DNI se consulta en el backend; el carné de extranjería se completa a mano
  const puedeConsultarDocumento = computed(() => Boolean(getSelectedDocumentType()?.consultable) && isDocumentNumberComplete())

  const documentHint = computed(() => {
    const tipo = getSelectedDocumentType()
    if (!tipo?.consultable) {
      return `${tipo?.minLength ?? 9} a ${tipo?.maxLength ?? 12} caracteres. Ingresa tus nombres y apellidos manualmente.`
    }
    if (!isDocumentNumberComplete()) return `${tipo.maxLength} dígitos. Faltan ${getRemainingDigits()} dígitos.`
    if (consultaDniFallida.value) return `${tipo.maxLength} dígitos. Completa tus nombres y apellidos manualmente.`
    return `${tipo.maxLength} dígitos. Presiona la lupa para buscar.`
  })

  const handleDocumentInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const maxLength = getSelectedDocumentType()?.maxLength || 8
    const limpio = documentType.value === 'DNI'
      ? target.value.replace(/\D/g, '')
      : target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

    errorMessage.value = ''
    documentNumber.value = limpio.slice(0, maxLength)
    target.value = documentNumber.value

    // Los nombres autocompletados pertenecen al documento anterior; los escritos a mano se conservan
    if (nombresEncontrados.value) {
      nombres.value = ''
      apellidos.value = ''
      nombresEncontrados.value = false
    }
  }

  let consultaDniActual = 0

  const handleDocumentSearch = async () => {
    if (!getSelectedDocumentType()?.consultable) return
    if (!isDocumentNumberComplete()) {
      showError('Por favor, ingresa un DNI válido de 8 dígitos.')
      return
    }

    const numero = documentNumber.value
    const consulta = ++consultaDniActual
    isSearchingDni.value = true
    consultaDniFallida.value = false
    errorMessage.value = ''

    try {
      const resultado = await consultDni(numero)
      // Se descarta una respuesta que llega después de cambiar el documento
      if (consulta !== consultaDniActual || numero !== documentNumber.value) return

      if (resultado) {
        nombres.value = resultado.nombres
        apellidos.value = resultado.apellidos
        nombresEncontrados.value = true
        showSuccess(`✅ DNI encontrado: ${resultado.nombres} ${resultado.apellidos}`)
      } else {
        nombresEncontrados.value = false
        consultaDniFallida.value = true
        showError('⚠️ DNI encontrado, pero faltan datos personales. Completa tus nombres manualmente.')
      }
    } catch (error) {
      if (consulta !== consultaDniActual || numero !== documentNumber.value) return
      nombresEncontrados.value = false
      consultaDniFallida.value = true
      showError(mensajeFallaConsultaDni(normalizeApiError(error), numero))
    } finally {
      if (consulta === consultaDniActual) isSearchingDni.value = false
    }
  }

  watch(documentType, () => {
    documentNumber.value = ''
    nombres.value = ''
    apellidos.value = ''
    nombresEncontrados.value = false
    consultaDniFallida.value = false
  })

  watch(documentNumber, () => {
    consultaDniFallida.value = false
    if (puedeConsultarDocumento.value) handleDocumentSearch()
  })

  // ===========================================================================
  // CORREO, CELULAR Y VERIFICACIÓN DE ESTUDIANTE
  // ===========================================================================
  const isEmailValid = computed(() => esCorreoValido(email.value))
  const esCorreoInstitucional = computed(() => esCorreoDelDominio(email.value, dominioInstitucional.value))

  const verificacion = conVerificacion
    ? useVerificacionEstudiante({ correo: email, tipoDocumento: documentType, numeroDocumento: documentNumber, dominio: dominioInstitucional })
    : null
  const estadoVerificacion = computed(() => verificacion?.estado.value ?? 'inactivo')
  const esEstudianteUndc = computed(() => verificacion?.esEstudianteUndc.value === true)
  const verificacionToken = computed(() => verificacion?.verificacionToken.value ?? null)
  const mensajeVerificacionUndc = computed(() => verificacion?.mensaje.value ?? null)
  const reintentarVerificacion = () => verificacion?.reintentar()

  const iconoVerificacion = computed(() => {
    if (estadoVerificacion.value === 'verificando') return 'heroicons:arrow-path'
    switch (mensajeVerificacionUndc.value?.tono) {
      case 'exito': return 'heroicons:check-badge'
      case 'aviso': return 'heroicons:exclamation-triangle'
      default: return 'heroicons:information-circle'
    }
  })

  const getEmailHint = () => {
    if (!email.value) {
      return conVerificacion ? `Si eres estudiante UNDC, usa tu correo institucional @${dominioInstitucional.value}` : 'Ingresa tu correo electrónico'
    }
    if (!isEmailValid.value) return 'Ingresa un correo electrónico válido'
    if (!conVerificacion && esCorreoInstitucional.value) return 'Correo institucional - Se aplicará descuento UNDC'
    return 'Correo válido'
  }

  const celularHint = computed(() => {
    if (!celular.value) return '9 dígitos, empieza con 9'
    if (!celular.value.startsWith('9')) return 'El celular debe empezar con 9'
    if (celular.value.length < 9) return `Faltan ${9 - celular.value.length} dígitos`
    return 'Celular válido'
  })

  const handleCelularInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    celular.value = target.value.replace(/\D/g, '').slice(0, 9)
    target.value = celular.value
  }

  // ===========================================================================
  // VERIFICACIÓN OPCIONAL DEL CORREO CON GOOGLE (no cambia el precio)
  // ===========================================================================
  // Sin client ID en la configuración del sitio no se muestra el botón
  const { clientIdGoogle } = useConfiguracionSitio()
  const correoGoogle = useCorreoGoogle({
    alVerificar: (datos) => {
      // El correo verificado queda fijado (y la verificación de estudiante se relanza con él)
      email.value = datos.correo
      // Nombres de Google solo en campos vacíos y nunca sobre los de la consulta de DNI
      const completar = nombresDesdeGoogle(
        { nombres: nombres.value, apellidos: apellidos.value, desdeDni: nombresEncontrados.value },
        datos,
      )
      if (completar.nombres) nombres.value = completar.nombres
      if (completar.apellidos) apellidos.value = completar.apellidos
    },
  })
  const estadoCorreoGoogle = correoGoogle.estado
  const mensajeCorreoGoogle = correoGoogle.mensaje
  // El correo verificado es de solo lectura hasta que el usuario elija «Usar otro correo»
  const correoBloqueado = computed(() => estadoCorreoGoogle.value === 'verificado')
  const verificarCorreoGoogle = (credencial: string) => correoGoogle.verificar(credencial)
  const usarOtroCorreo = () => correoGoogle.descartar()

  // Un error anterior de Google deja de mostrarse cuando el usuario escribe su correo
  watch(email, () => {
    if (estadoCorreoGoogle.value === 'error') correoGoogle.descartar()
  })

  // ===========================================================================
  // PLANES Y PRECIOS
  // ===========================================================================
  // Misma condición para habilitar los planes en la interfaz y en la lógica
  const camposCompletos = computed(() => Boolean(
    isDocumentNumberComplete()
    && nombres.value.trim()
    && apellidos.value.trim()
    && isEmailValid.value
    && esCelularValido(celular.value),
  ))

  // Réplica informativa de la regla del backend: el monto definitivo lo calcula el servidor. Con la
  // misma condición se ocultan los planes «solo comunidad UNDC» o «solo externos» (spec 016 del backend)
  const planesSegunCondicion = computed(() => planes.value.map((plan) => {
    const institucional = aplicaPrecioInstitucional({
      esEstudiantil: plan.esEstudiantil,
      esEstudianteUndc: esEstudianteUndc.value,
      correoInstitucional: esCorreoInstitucional.value,
    })
    return { plan, institucional, disponible: planDisponible(plan, institucional) }
  }))

  const availablePlans = computed(() => planesSegunCondicion.value
    .filter(item => item.disponible)
    .map(({ plan, institucional }) => ({ ...plan, price: formatearSoles(precioPlan(plan, institucional)) })))

  /** Explica por qué no se ven todos los planes (p. ej. con correo UNDC no se ofrece «sin kit»). */
  const avisoPlanes = computed(() => avisoPlanesOcultos({
    ocultos: planesSegunCondicion.value.filter(item => !item.disponible).map(item => item.plan),
    dominio: dominioInstitucional.value,
  }))

  const selectedPlan = computed(() => availablePlans.value.find(plan => plan.id === planId.value) ?? null)
  // El ciclo solo se pide en /estudiantes y para planes de la categoría estudiantil
  const isStudentPlan = computed(() => conVerificacion && selectedPlan.value?.esEstudiantil === true)

  // Si el plan elegido deja de ofrecerse (planes recargados o cambió la condición UNDC) se limpia la
  // selección; mientras una verificación está en curso se espera su resultado
  watch([availablePlans, estadoVerificacion, estadoCorreoGoogle], ([lista, estado, estadoGoogle]) => {
    if (debeLimpiarPlan({
      planId: planId.value,
      disponibles: lista.map(plan => plan.id),
      verificando: estado === 'verificando' || estadoGoogle === 'verificando',
    })) planId.value = null
  })

  const getBadgeClass = (badge: string) => (badge.includes('SIN') ? 'badge-warning' : 'badge-success')

  const selectPlan = (id: number) => {
    if (!camposCompletos.value) {
      showError('❌ Completa correctamente documento, nombres, apellidos, correo y celular antes de elegir un plan')
      return
    }
    planId.value = id
  }

  // ===========================================================================
  // MEDIOS DE PAGO (datosPago del evento)
  // ===========================================================================
  const bancos = computed<CuentaBancaria[]>(() =>
    (datosPago.value?.bancos ?? []).filter(banco => Boolean(banco?.codigo && banco?.numeroCuenta)))
  const billeteras = computed<BilleteraDigital[]>(() =>
    (datosPago.value?.billeteras ?? []).filter(billetera => Boolean(billetera?.codigo && billetera?.telefono)))
  const titular = computed(() => String(datosPago.value?.titular ?? '').trim())
  const hayMediosDePago = computed(() => bancos.value.length + billeteras.value.length > 0)

  // Grupos como en el panel: «Billeteras digitales» (por defecto, la más usada) y «Cuentas
  // bancarias». La selección vigente se deriva de los datos, no se asigna con un watcher: así el
  // SSR y la hidratación muestran lo mismo.
  const modalidadesPago = computed(() => modalidadesDisponibles(bancos.value, billeteras.value))
  const eleccionPago = ref<EleccionPago>({ modalidad: null, banco: null, billetera: null })
  const tipoPagoElegido = ref<TipoOperacion>('directo')

  const medioPago = computed(() => resolverMedioPago(bancos.value, billeteras.value, eleccionPago.value))
  const modalidadDeposito = computed<ModalidadPago>(() => medioPago.value.modalidad ?? 'billetera')
  const bancoActual = computed(() => medioPago.value.banco)
  const billeteraActual = computed(() => medioPago.value.billetera)
  const bancoSeleccionado = computed(() => bancoActual.value?.codigo ?? null)
  const aplicativo = computed(() => billeteraActual.value?.codigo ?? null)
  const qrBilletera = computed(() => urlQrBilletera(billeteraActual.value))
  const nombreBilleteraActual = computed(() => nombreBilletera(billeteraActual.value))
  const titularBilleteraActual = computed(() => titularBilletera(billeteraActual.value, titular.value))
  const descargaQrBilletera = computed(() => nombreDescargaQr(billeteraActual.value?.codigo, qrBilletera.value))

  // Solo aplica a bancos; sin CCI no hay transferencia interbancaria
  const tipoPago = computed<TipoOperacion | null>({
    get: () => {
      if (!bancoActual.value) return null
      return tipoPagoElegido.value === 'interbancario' && bancoActual.value.cci ? 'interbancario' : 'directo'
    },
    set: (valor) => {
      if (valor) tipoPagoElegido.value = valor
    },
  })

  const seleccionarModalidad = (modalidad: ModalidadPago) => {
    eleccionPago.value = { ...eleccionPago.value, modalidad }
  }

  const seleccionarBanco = (codigo: string) => {
    eleccionPago.value = { ...eleccionPago.value, modalidad: 'banco', banco: codigo }
  }

  const seleccionarBilletera = (codigo: string) => {
    eleccionPago.value = { ...eleccionPago.value, modalidad: 'billetera', billetera: codigo }
  }

  const copiar = async (texto: string | null | undefined, descripcion: string) => {
    if (!texto) return
    try {
      await navigator.clipboard.writeText(texto)
      showSuccess(`✅ ${descripcion} copiado al portapapeles: ${texto}`)
    } catch {
      showError('❌ Error al copiar al portapapeles')
    }
  }

  const copiarNumeroCuenta = () => copiar(bancoActual.value?.numeroCuenta, 'Número de cuenta')
  const copiarCCI = () => copiar(bancoActual.value?.cci, 'CCI')
  const copiarTelefonoBilletera = () => copiar(billeteraActual.value?.telefono, `Número de ${nombreBilleteraActual.value || 'la billetera'}`)

  // ===========================================================================
  // VOUCHER
  // ===========================================================================
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files ? target.files.item(0) : null

    // PDF, JPG, PNG o WebP de hasta 5 MB (el backend valida además el contenido)
    const problema = file ? validarArchivoVoucher(file) : ''
    if (problema) {
      showError(`📎 ${problema}`)
      target.value = ''
      return
    }

    archivoVoucher.value = file
    if (file) showSuccess(`📎 Archivo cargado: ${file.name}`)
  }

  // ===========================================================================
  // ENVÍO
  // ===========================================================================
  /** Primera validación que falla (mensaje para el usuario) o `null`. */
  const validarFormulario = (): string | null => {
    if (!documentType.value || !documentNumber.value) return '❌ El campo Documento de identidad es obligatorio'
    if (!isDocumentNumberComplete()) return `❌ Revisa el número de ${documentType.value === 'DNI' ? 'DNI (8 dígitos)' : 'carné de extranjería (9 a 12 caracteres)'}`
    if (!nombres.value.trim()) return '❌ El campo Nombres es obligatorio'
    if (!apellidos.value.trim()) return '❌ El campo Apellidos es obligatorio'
    if (!email.value) return '❌ El campo Correo electrónico es obligatorio'
    if (!isEmailValid.value) return '❌ Ingresa un correo electrónico válido'
    if (!celular.value) return '❌ El campo Celular es obligatorio'
    if (!esCelularValido(celular.value)) return '❌ El celular debe tener 9 dígitos y empezar con 9'
    if (!planId.value) return '❌ Por favor selecciona un plan de inscripción'
    if (!selectedPlan.value) return '❌ El plan elegido ya no está disponible; selecciona otro'
    if (isStudentPlan.value && !clasificacion.value) return '❌ Por favor selecciona tu clasificación'
    if (!hayMediosDePago.value) return '❌ Los datos de pago no están disponibles; comunícate con la organización'
    if (modalidadDeposito.value === 'banco' && (!bancoActual.value || !tipoPago.value)) return '❌ Por favor selecciona el banco y el tipo de pago'
    if (modalidadDeposito.value === 'billetera' && !billeteraActual.value) return '❌ Por favor selecciona la billetera digital'
    if (!fechaPago.value) return '❌ Por favor indica la fecha de pago'
    // Comparación de cadenas YYYY-MM-DD en hora de Lima, igual que el backend
    if (fechaPago.value > fechaHoyLima()) return '❌ La fecha de pago no puede ser futura'
    if (codigoVoucher.value.trim().length < 3) return '❌ Por favor ingresa el código del voucher (mínimo 3 caracteres)'
    if (!archivoVoucher.value) return '❌ Por favor adjunta el voucher de pago'
    // Sin esperar el resultado se cobraría el precio regular a un estudiante UNDC
    if (estadoVerificacion.value === 'verificando') {
      return '⏳ Estamos verificando tu condición de estudiante UNDC; espera unos segundos y vuelve a intentarlo'
    }
    // Sin esperar, la inscripción saldría sin el correo verificado
    if (estadoCorreoGoogle.value === 'verificando') {
      return '⏳ Estamos verificando tu correo con Google; espera unos segundos y vuelve a intentarlo'
    }
    return null
  }

  const handleSubmit = async () => {
    if (isSubmitting.value || apiSubmitting.value || estadoPagina.value !== 'abiertas') return

    const problema = validarFormulario()
    if (problema) {
      showError(problema)
      return
    }

    isSubmitting.value = true
    clearError()

    try {
      // El monto, el descuento y el estado los calcula el backend: no se envían
      const datos = mapFormDataToApiData({
        documentType: documentType.value,
        documentNumber: documentNumber.value,
        nombres: nombres.value,
        apellidos: apellidos.value,
        email: email.value,
        celular: celular.value,
        planId: planId.value,
        clasificacion: isStudentPlan.value ? clasificacion.value : null,
        modalidadDeposito: modalidadDeposito.value,
        bancoSeleccionado: bancoSeleccionado.value,
        tipoPago: tipoPago.value,
        aplicativo: aplicativo.value,
        fechaPago: fechaPago.value,
        codigoVoucher: codigoVoucher.value,
        archivoVoucher: archivoVoucher.value,
        verificacionToken: verificacionToken.value,
        // Solo mientras el correo siga bloqueado y sea el que verificó Google
        verificacionCorreoToken: tokenCorreoParaEnvio({
          bloqueado: correoBloqueado.value,
          token: correoGoogle.token.value,
          correoVerificado: correoGoogle.datos.value?.correo,
          correoFormulario: email.value,
        }),
      })

      const inscripcion = await createInscription(datos)
      await router.push(`/confirmation?id=${inscripcion.id}`)
    } catch (error) {
      showError(apiError.value || (error instanceof Error && error.message) || '❌ Error al procesar la inscripción. Inténtalo nuevamente.')
      // El estado del evento o los planes cambiaron en el backend: se vuelven a pedir
      if (errorCode.value === 'REGISTRATION_CLOSED') recargarEvento()
      if (errorCode.value === 'REGISTRATION_TYPE_INVALID' || errorCode.value === 'REGISTRATION_TYPE_NOT_AVAILABLE') {
        planId.value = null
        recargarPlanes()
      }
    } finally {
      isSubmitting.value = false
    }
  }

  onMounted(() => {
    fechaMaxima.value = fechaHoyLima()
  })

  return {
    // Página
    estadoPagina,
    recargar,
    // Notificaciones
    errorMessage,
    successMessage,
    // Documento
    documentTypes,
    documentType,
    documentNumber,
    getSelectedDocumentType,
    handleDocumentInput,
    handleDocumentSearch,
    isSearchingDni,
    puedeConsultarDocumento,
    documentHint,
    nombres,
    apellidos,
    nombresEncontrados,
    // Correo, celular y verificación
    email,
    getEmailHint,
    celular,
    celularHint,
    handleCelularInput,
    estadoVerificacion,
    mensajeVerificacionUndc,
    iconoVerificacion,
    reintentarVerificacion,
    // Correo verificado con Google (opcional)
    clientIdGoogle,
    correoBloqueado,
    estadoCorreoGoogle,
    mensajeCorreoGoogle,
    verificarCorreoGoogle,
    usarOtroCorreo,
    // Planes
    availablePlans,
    avisoPlanes,
    planId,
    selectPlan,
    camposCompletos,
    getBadgeClass,
    isStudentPlan,
    clasificacion,
    clasificaciones,
    // Pago
    bancos,
    billeteras,
    titular,
    hayMediosDePago,
    modalidadesPago,
    modalidadDeposito,
    bancoSeleccionado,
    bancoActual,
    billeteraActual,
    qrBilletera,
    nombreBilleteraActual,
    titularBilleteraActual,
    descargaQrBilletera,
    tipoPago,
    seleccionarModalidad,
    seleccionarBanco,
    seleccionarBilletera,
    copiarNumeroCuenta,
    copiarCCI,
    copiarTelefonoBilletera,
    showQrModal,
    // Voucher y envío
    codigoVoucher,
    fechaPago,
    fechaMaxima,
    archivoVoucher,
    handleFileChange,
    VOUCHER_ACCEPT,
    isSubmitting,
    apiSubmitting,
    handleSubmit,
  }
}
