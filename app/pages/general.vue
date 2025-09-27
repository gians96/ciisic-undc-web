<template>
    <div>
        <!-- ===========================================================================
        ENCABEZADO DE PÁGINA
        ============================================================================ -->
        <section class="breadcrumb-area">
            <div class="breadcrumb-container">
                <h1 class="page-title">REGISTRO GENERAL - VII CIISIC</h1>
                <p class="page-subtitle">Completa tu inscripción al VII Congreso Internacional de Ingeniería de Sistemas
                    e Investigación Científica</p>
            </div>
        </section>

        <!-- ===========================================================================
        SISTEMA DE NOTIFICACIONES
        ============================================================================ -->
        <NotificationSystem :error-message="errorMessage" :success-message="successMessage"
            @clear-error="errorMessage = ''" @clear-success="successMessage = ''" />

        <!-- ===========================================================================
        SECCIÓN DEL FORMULARIO
        ============================================================================ -->
        <section class="form-section">
            <div class="form-container">
                <form @submit.prevent="handleSubmit" class="registration-form">

                    <!-- Fila 1: Documento (Tipo + Número), Nombres, Apellidos -->
                    <div class="form-group col-span-6 md:col-span-3 lg:col-span-2">
                        <label for="documentType" class="form-label">Documento de identidad</label>
                        <div class="document-input-group">
                            <div class="document-type-container">
                                <select id="documentType" v-model="documentType" class="document-type-select" required>
                                    <option v-for="type in documentTypes" :key="type.value" :value="type.value">
                                        {{ type.value }}
                                    </option>
                                </select>
                                <Icon name="heroicons:chevron-down" class="document-type-arrow" />
                            </div>
                            <div class="document-number-container">
                                <input id="documentNumber" v-model="documentNumber" type="text"
                                    :placeholder="getSelectedDocumentType()?.placeholder || 'Número de documento'"
                                    :maxlength="getSelectedDocumentType()?.maxLength || 8"
                                    :pattern="getSelectedDocumentType()?.pattern || '[0-9]{8}'"
                                    @input="handleDocumentInput" required class="document-number-input">
                                <button type="button" @click="handleDocumentSearch"
                                    :disabled="isSearchingDni || !isDocumentNumberComplete()"
                                    class="document-search-button" aria-label="Buscar documento">
                                    <Icon v-if="isSearchingDni" name="heroicons:arrow-path"
                                        class="h-5 w-5 animate-spin" />
                                    <Icon v-else name="heroicons:magnifying-glass" class="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <small class="form-hint">
                            {{ getSelectedDocumentType()?.maxLength || 8 }} dígitos.
                            {{ isDocumentNumberComplete() ? 'Presiona la lupa para buscar.' : `Faltan
                            ${getRemainingDigits()} dígitos.` }}
                        </small>
                    </div>

                    <div class="form-group col-span-6 md:col-span-3 lg:col-span-2">
                        <label for="nombres" class="form-label">Nombres</label>
                        <input id="nombres" v-model="nombres" type="text" 
                            :placeholder="nombresEncontrados ? 'Nombres (encontrados automáticamente)' : 'Ingresa tus nombres'"
                            class="form-input" 
                            :class="{ 'input-filled': nombres, 'input-readonly': nombresEncontrados }" 
                            :readonly="nombresEncontrados"
                            required>
                    </div>

                    <div class="form-group col-span-6 md:col-span-3 lg:col-span-2">
                        <label for="apellidos" class="form-label">Apellidos</label>
                        <input id="apellidos" v-model="apellidos" type="text" 
                            :placeholder="nombresEncontrados ? 'Apellidos (encontrados automáticamente)' : 'Ingresa tus apellidos'"
                            class="form-input" 
                            :class="{ 'input-filled': apellidos, 'input-readonly': nombresEncontrados }" 
                            :readonly="nombresEncontrados"
                            required>
                    </div>

                    <!-- Fila 2: Correo, Celular -->
                    <div class="form-group col-span-6 md:col-span-3">
                        <label for="email" class="form-label">Correo electrónico</label>
                        <input id="email" v-model="email" type="email" placeholder="Tu correo electrónico" required
                            class="form-input">
                        <small class="form-hint">{{ getEmailHint() }}</small>
                    </div>

                    <div class="form-group col-span-6 md:col-span-3">
                        <label for="celular" class="form-label">Celular</label>
                        <input id="celular" v-model="celular" type="tel" placeholder="Tu número de celular" required
                            class="form-input" pattern="[9][0-9]{8}" maxlength="9">
                        <small class="form-hint">9 dígitos sin espacios</small>
                    </div>


                    <!-- Selección de Tipo de Inscripción - Cards Simples -->
                    <div class="form-group col-span-6 form-section-below-classification">
                        <label class="form-label">Tipo de inscripción</label>
                        <div class="plan-cards-container">
                            <div v-for="plan in availablePlans" :key="plan.id" @click="selectPlan(plan.id)"
                                class="plan-card-simple" 
                                :class="{ 
                                    'selected': planId === plan.id, 
                                    'disabled': !isEmailValid 
                                }">
                                <div class="plan-card-header">
                                    <h4 class="plan-card-title">{{ plan.title }}</h4>
                                    <span class="plan-card-badge" :class="getBadgeClass(plan.badge)">{{ plan.badge
                                    }}</span>
                                </div>
                                <div class="plan-card-price">{{ plan.price }}</div>
                                <div class="plan-card-description">{{ plan.description }}</div>

                                <!-- Lista de características -->
                                <ul class="plan-features-list">
                                    <li v-for="feature in plan.features" :key="feature.text" class="plan-feature-item">
                                        <Icon :name="feature.icon"
                                            :class="feature.icon === 'heroicons:x-mark' ? 'plan-feature-icon excluded' : 'plan-feature-icon included'" />
                                        <span
                                            :class="feature.icon === 'heroicons:x-mark' ? 'plan-feature-text excluded' : 'plan-feature-text'">
                                            {{ feature.text }}
                                        </span>
                                    </li>
                                </ul>
                                <div class="plan-card-selector">
                                    <div class="plan-selector-radio" :class="{ 'selected': planId === plan.id }">
                                        <div v-if="planId === plan.id" class="plan-selector-dot"></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <small class="form-hint">
                            <template v-if="!isEmailValid">
                                Completa los campos anteriores para habilitar la selección de planes
                            </template>
                            <template v-else>
                                Selecciona el plan que mejor se adapte a tus necesidades
                            </template>
                        </small>
                    </div>

                    <!-- Línea Divisoria -->
                    <div class="col-span-6 form-section-below-classification">
                        <div class="w-full border-t border-slate-700"></div>
                    </div>

                    <!-- Sección de Pago -->
                    <div
                        class="col-span-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 form-section-below-classification">

                        <!-- Columna Izquierda: Modalidad de Pago -->
                        <div class="conditional-section flex flex-col justify-center">
                            <div class="form-group">
                                <label class="form-label">Modalidad de Depósito</label>
                                <div class="radio-group-horizontal">
                                    <label for="bancoBcp" class="radio-label">
                                        <input id="bancoBcp" v-model="bancoSeleccionado" type="radio" value="bcp"
                                            @change="modalidadDeposito = 'banco'" class="sr-only">
                                        <div class="radio-custom-indicator"
                                            :class="{ 'selected': bancoSeleccionado === 'bcp' }">
                                            <div v-if="bancoSeleccionado === 'bcp'" class="radio-dot"></div>
                                        </div>
                                        <div class="relative flex items-center group">
                                            <span>Banco BCP</span>
                                            <div class="tooltip">
                                                <div>- N° Cuenta: 255-10957977-0-98</div>
                                                <div>- CCI: 002-25511095797709881</div>
                                                <div>(Josemaria Caballa Garay)</div>
                                                <div class="tooltip-arrow"></div>
                                            </div>
                                        </div>
                                    </label>
                                    <label for="bancoInterbank" class="radio-label">
                                        <input id="bancoInterbank" v-model="bancoSeleccionado" type="radio"
                                            value="interbank" @change="modalidadDeposito = 'banco'" class="sr-only">
                                        <div class="radio-custom-indicator"
                                            :class="{ 'selected': bancoSeleccionado === 'interbank' }">
                                            <div v-if="bancoSeleccionado === 'interbank'" class="radio-dot"></div>
                                        </div>
                                        <div class="relative flex items-center group">
                                            <span>Banco Interbank</span>
                                            <div class="tooltip">
                                                <div>- N° Cuenta: 898 3483201070</div>
                                                <div>- CCI: 003-898-01348320107043</div>
                                                <div>(Josemaria Caballa Garay)</div>
                                                <div class="tooltip-arrow"></div>
                                            </div>
                                        </div>
                                    </label>
                                    <label for="billeteraDigital" class="radio-label">
                                        <input id="billeteraDigital" v-model="modalidadDeposito" type="radio"
                                            value="billetera" @change="bancoSeleccionado = null" class="sr-only">
                                        <div class="radio-custom-indicator"
                                            :class="{ 'selected': modalidadDeposito === 'billetera' }">
                                            <div v-if="modalidadDeposito === 'billetera'" class="radio-dot"></div>
                                        </div>
                                        <div class="relative flex items-center group">
                                            <span>Billetera Digital</span>
                                        </div>
                                    </label>
                                </div>
                                <small class="form-hint">Selecciona el medio de pago</small>
                            </div>

                            <Transition name="fade" mode="out-in">
                                <div v-if="modalidadDeposito === 'banco' && bancoSeleccionado" class="form-group mt-4">
                                    <label class="form-label">Tipo de Pago</label>
                                    <div class="radio-group-horizontal">
                                        <label for="pagoDirecto" class="radio-label">
                                            <input id="pagoDirecto" v-model="tipoPago" type="radio" value="directo"
                                                class="sr-only">
                                            <div class="radio-custom-indicator"
                                                :class="{ 'selected': tipoPago === 'directo' }">
                                                <div v-if="tipoPago === 'directo'" class="radio-dot"></div>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span>Pago Directo</span>
                                                <Icon @click.prevent.stop="copiarNumeroCuenta"
                                                    name="heroicons:clipboard-document"
                                                    class="text-green-400 hover:text-green-300 cursor-pointer h-5 w-5"
                                                    title="Copiar número de cuenta" />
                                            </div>
                                        </label>
                                        <label for="pagoInterbancario" class="radio-label">
                                            <input id="pagoInterbancario" v-model="tipoPago" type="radio"
                                                value="interbancario" class="sr-only">
                                            <div class="radio-custom-indicator"
                                                :class="{ 'selected': tipoPago === 'interbancario' }">
                                                <div v-if="tipoPago === 'interbancario'" class="radio-dot"></div>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span>Pago interbancario</span>
                                                <Icon @click.prevent.stop="copiarCCI"
                                                    name="heroicons:clipboard-document"
                                                    class="text-green-400 hover:text-green-300 cursor-pointer h-5 w-5"
                                                    title="Copiar CCI" />
                                            </div>
                                        </label>
                                    </div>
                                    <small class="form-hint">Selecciona el tipo de pago</small>
                                </div>
                                <div v-else-if="modalidadDeposito === 'billetera'" class="form-group mt-4">
                                    <label class="form-label">Aplicativo</label>
                                    <div class="radio-group-with-qr">
                                        <div class="radio-group-horizontal">
                                            <label for="yape" class="radio-label">
                                                <input id="yape" v-model="aplicativo" type="radio" value="yape"
                                                    class="sr-only">
                                                <div class="radio-custom-indicator"
                                                    :class="{ 'selected': aplicativo === 'yape' }">
                                                    <div v-if="aplicativo === 'yape'" class="radio-dot"></div>
                                                </div>
                                                <span>Yape</span>
                                            </label>
                                            <label for="plin" class="radio-label">
                                                <input id="plin" v-model="aplicativo" type="radio" value="plin"
                                                    class="sr-only">
                                                <div class="radio-custom-indicator"
                                                    :class="{ 'selected': aplicativo === 'plin' }">
                                                    <div v-if="aplicativo === 'plin'" class="radio-dot"></div>
                                                </div>
                                                <span>Plin</span>
                                            </label>
                                        </div>

                                        <!-- Botón QR al lado de los radio buttons -->
                                        <button type="button" @click="showQrModal = true" class="qr-button-inline">
                                            <Icon name="heroicons:qr-code" class="h-4 w-4" />
                                        </button>
                                    </div>
                                    <small class="form-hint">Selecciona el aplicativo</small>
                                </div>
                            </Transition>
                        </div>

                        <!-- Columna Derecha: Información del Pago -->
                        <div class="flex flex-col justify-between gap-y-8">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                <div class="form-group">
                                    <label for="codigoVoucher" class="form-label">Código del voucher de pago</label>
                                    <input id="codigoVoucher" v-model="codigoVoucher" type="text"
                                        placeholder="Código de operación" required class="form-input">
                                    <small class="form-hint">Digita el código de pago</small>
                                </div>
                                <div class="form-group">
                                    <label for="fechaPago" class="form-label">Fecha de Pago</label>
                                    <input id="fechaPago" v-model="fechaPago" type="date" required class="form-input">
                                    <small class="form-hint">Indica la fecha de pago</small>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Adjuntar voucher de pago</label>
                                <label for="archivoVoucher" class="file-input-wrapper"
                                    :class="{ 'file-input-completed': archivoVoucher }">
                                    <div class="file-input-button">Seleccionar archivo</div>
                                    <div class="file-input-text-area">
                                        {{ archivoVoucher ? archivoVoucher.name : 'Sin archivos seleccionados' }}
                                    </div>
                                </label>
                                <input id="archivoVoucher" type="file" @change="handleFileChange" required
                                    class="sr-only" accept="image/jpeg,image/png,image/jpg,application/pdf">
                                <small class="form-hint">Sube el voucher en JPG, JPEG, PNG o PDF (máx. 5MB)</small>
                            </div>
                        </div>
                    </div>

                    <!-- Botón de Envío -->
                    <div class="col-span-6 form-section-below-classification">
                        <button 
                            type="submit" 
                            class="submit-button" 
                            :disabled="isSubmitting || apiSubmitting"
                            @click.prevent="handleSubmit"
                        >
                            <Icon v-if="isSubmitting || apiSubmitting" name="heroicons:arrow-path" class="h-5 w-5 animate-spin mr-2" />
                            {{ (isSubmitting || apiSubmitting) ? 'Procesando...' : 'Completar Inscripción' }}
                        </button>
                    </div>
                </form>
            </div>
        </section>

        <!-- Modal para mostrar QR -->
        <Transition name="modal" appear>
            <div v-if="showQrModal" class="qr-modal-overlay" @click="showQrModal = false">
                <div class="qr-modal-container" @click.stop>
                    <div class="qr-modal-header">
                        <h3 class="qr-modal-title">
                            <Icon name="heroicons:qr-code" class="h-6 w-6 mr-2" />
                            Código QR para Billetera Digital
                        </h3>
                        <button @click="showQrModal = false" class="qr-modal-close">
                            <Icon name="heroicons:x-mark" class="h-6 w-6" />
                        </button>
                    </div>

                    <div class="qr-modal-content">
                        <div class="qr-modal-image-container">
                            <img src="/images/qr/plin.webp" alt="Código QR para billetera digital"
                                class="qr-modal-image">
                        </div>

                        <div class="qr-modal-info">
                            <p class="qr-modal-name">
                                <strong>Nombre:</strong> Josemaria Caballa Garay
                            </p>
                            <p class="qr-modal-instructions">
                                Escanea el código QR con tu aplicación Yape o Plin
                                para realizar el pago de forma rápida y segura.
                            </p>
                        </div>
                    </div>

                    <div class="qr-modal-footer">
                        <button @click="showQrModal = false" class="qr-modal-button">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
// ===========================================================================
// SEO Y META TAGS
// ===========================================================================
useHead({
    title: 'Registro | VII CIISIC',
    meta: [
        { name: 'description', content: 'Formulario de registro para el VII CIISIC la UNDC.' }
    ]
})

// ===========================================================================
// COMPOSABLES Y ROUTER
// ===========================================================================
const { consultDni, documentTypes } = useConsultation()
const {
    createInscription,
    initializeCatalogs,
    mapFormDataToApiData,
    isSubmitting: apiSubmitting,
    error: apiError,
    clearError,
    registrationTypes,
    classifications,
    depositMethods,
    paymentTypes
} = useInscription()
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const searchConsultation = async (number: string) => {
    if (import.meta.server) {
        const documentType = number.length === 8 ? 'DNI' : 'CE'
        // / Hacer la petición a la API externa desde el servidor
        const endpoint = documentType === 'DNI' ? 'dni' : 'ce'
        const requestUrl = `${config.xApiUrl}/${endpoint}/${number}`
        const response = await $fetch(requestUrl, {
            headers: {
                'X-API-Token': config.xApiToken,
                'Content-Type': 'application/json'
            }
        })
    }
}

// ===========================================================================
// PLANES DE INSCRIPCIÓN
// ===========================================================================
const inscriptionPlans = [
    {
        id: 3,
        title: 'PROFESIONALES Y PUBLICO EN GENERAL CON KIT',
        badge: 'CON KIT',
        basePrice: 140.00,
        institutionalPrice: 120.00,
        value: 'general_con_kit',
        description: 'La experiencia completa para profesionales y público en general con kit de merchandising oficial.',
        features: [
            { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
            { icon: 'heroicons:gift', text: 'Kit de Merchandising Oficial' },
            { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
            { icon: 'heroicons:ticket', text: 'Acceso a todas las ponencias' },
        ]
    },
    {
        id: 4,
        title: 'PROFESIONALES Y PUBLICO EN GENERAL SIN KIT',
        badge: 'SIN KIT',
        basePrice: 80.00,
        institutionalPrice: 60.00,
        value: 'general_sin_kit',
        description: 'La opción económica para profesionales y público en general, con acceso a todas las ponencias.',
        features: [
            { icon: 'heroicons:academic-cap', text: 'Certificado Digital (100h)' },
            { icon: 'heroicons:identification', text: 'Carnet de Identificación' },
            { icon: 'heroicons:ticket', text: 'Acceso a todas las ponencias' },
            { icon: 'heroicons:x-mark', text: 'No incluye Kit' },
        ]
    },
]

// ===========================================================================
// COMPUTED Y REACTIVOS
// ===========================================================================
const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return email.value && emailRegex.test(email.value)
})

const isFormValid = computed(() => {
    return documentNumber.value && 
           nombres.value && 
           apellidos.value && 
           isEmailValid.value && 
           celular.value
})

const isInstitutionalEmail = computed(() => {
    return email.value && email.value.toLowerCase().endsWith('@undc.edu.pe')
})

const availablePlans = computed(() => {
    return inscriptionPlans.map(plan => ({
        ...plan,
        price: isInstitutionalEmail.value
            ? `S/ ${plan.institutionalPrice.toFixed(2)}`
            : `S/ ${plan.basePrice.toFixed(2)}`
    }))
})

const selectedPlan = computed(() => planId.value ? availablePlans.value.find(plan => plan.id === planId.value) : null)
const isStudentPlan = computed(() => planId.value === 1 || planId.value === 2)

// ===========================================================================
// ESTADO DEL FORMULARIO
// ===========================================================================
const documentType = ref<'DNI' | 'CE'>('DNI')
const documentNumber = ref<string>('')
const nombres = ref<string>('')
const apellidos = ref<string>('')
const nombresEncontrados = ref<boolean>(false) // Nueva variable para controlar si se encontraron los nombres
const email = ref<string>('')
const celular = ref<string>('')
const clasificacion = ref<string>('')
const tipoInscripcion = ref<string>('')
const planId = ref<number | null>(null) // Sin plan preseleccionado
const modalidadDeposito = ref<'banco' | 'billetera'>('banco')
const bancoSeleccionado = ref<'bcp' | 'interbank' | null>('bcp')
const tipoPago = ref<'directo' | 'interbancario' | null>(null)
const aplicativo = ref<'yape' | 'plin' | null>(null)
const fechaPago = ref<string>('')
const codigoVoucher = ref<string>('')
const archivoVoucher = ref<File | null>(null)
const isSearchingDni = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref<string>('')
const successMessage = ref<string>('')
const showQrModal = ref(false)

// ===========================================================================
// WATCHERS
// ===========================================================================
watch(planId, () => {
    // Preseleccionar el tipo de inscripción basado en el planId
    if (selectedPlan.value) {
        tipoInscripcion.value = selectedPlan.value.value
    } else {
        tipoInscripcion.value = ''
    }
}, { immediate: true })

watch(modalidadDeposito, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        tipoPago.value = null
        aplicativo.value = null
    }
})

watch(documentType, () => {
    documentNumber.value = ''
    nombres.value = ''
    apellidos.value = ''
    nombresEncontrados.value = false
})

watch(documentNumber, (newValue) => {
    if (isDocumentNumberComplete() && newValue.length === getSelectedDocumentType()?.maxLength) {
        handleDocumentSearch()
    }
})

// ===========================================================================
// MÉTODOS AUXILIARES
// ===========================================================================
const getBadgeClass = (badge: string) => {
    return badge.includes('SIN') ? 'badge-warning' : 'badge-success'
}

const getEmailHint = () => {
    if (!email.value) return 'Ingresa tu correo electrónico'
    if (isInstitutionalEmail.value) {
        return 'Correo institucional - Se aplicará descuento UNDC'
    }
    return 'Correo válido'
}

const getSelectedDocumentType = () => {
    return documentTypes.find(type => type.value === documentType.value)
}

const isDocumentNumberComplete = () => {
    const expectedLength = getSelectedDocumentType()?.maxLength || 8
    return documentNumber.value.length === expectedLength
}

const getRemainingDigits = () => {
    const expectedLength = getSelectedDocumentType()?.maxLength || 8
    return Math.max(0, expectedLength - documentNumber.value.length)
}

const selectPlan = (id: number) => {
    if (!isFormValid.value) {
        showError('❌ Por favor completa todos los campos anteriores antes de seleccionar un plan')
        return
    }
    planId.value = id
}

const showError = (message: string) => {
    errorMessage.value = message
    successMessage.value = ''
    console.error('🔴 Error:', message)

    // Auto-limpiar después de 5 segundos
    setTimeout(() => {
        errorMessage.value = ''
    }, 5000)
}

const showSuccess = (message: string) => {
    successMessage.value = message
    errorMessage.value = ''
    console.log('✅ Success:', message)

    // Auto-limpiar después de 3 segundos
    setTimeout(() => {
        successMessage.value = ''
    }, 3000)
}

// ===========================================================================
// FUNCIONES DE PORTAPAPELES
// ===========================================================================

const copiarNumeroCuenta = async () => {
    try {
        let numeroCuenta = ''

        if (bancoSeleccionado.value === 'bcp') {
            numeroCuenta = '255-10957977-0-98'
        } else if (bancoSeleccionado.value === 'interbank') {
            numeroCuenta = '898 3483201070'
        }

        await navigator.clipboard.writeText(numeroCuenta)
        showSuccess(`✅ Número de cuenta copiado al portapapeles: ${numeroCuenta}`)
    } catch (error) {
        showError('❌ Error al copiar al portapapeles')
    }
}

const copiarCCI = async () => {
    try {
        let cci = ''

        if (bancoSeleccionado.value === 'bcp') {
            cci = '002-25511095797709881'
        } else if (bancoSeleccionado.value === 'interbank') {
            cci = '003-898-01348320107043'
        }

        await navigator.clipboard.writeText(cci)
        showSuccess(`✅ CCI copiado al portapapeles: ${cci}`)
    } catch (error) {
        showError('❌ Error al copiar al portapapeles')
    }
}

// ===========================================================================
// MANEJADORES DE EVENTOS
// ===========================================================================

const handleDocumentInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const numericValue = target.value.replace(/\D/g, '')
    const maxLength = getSelectedDocumentType()?.maxLength || 8

    errorMessage.value = ''
    documentNumber.value = numericValue.slice(0, maxLength)
    target.value = documentNumber.value
}

const handleDocumentSearch = async () => {
    if (!isDocumentNumberComplete()) {
        const expectedLength = getSelectedDocumentType()?.maxLength || 8
        showError(`Por favor, ingrese un ${documentType.value} válido de ${expectedLength} dígitos.`)
        return
    }

    isSearchingDni.value = true
    nombres.value = ''
    apellidos.value = ''
    nombresEncontrados.value = false
    errorMessage.value = ''

    try {
        console.log(`🔍 Consultando ${documentType.value}: ${documentNumber.value}`)

        const result = await consultDni(documentNumber.value, documentType.value)

        console.log('📥 Resultado recibido:', result)

        if (result && result.success && result.data) {
            if (result.data.names && (result.data.paternalSurname || result.data.maternalSurname)) {
                nombres.value = result.data.names.trim()

                const paternal = result.data.paternalSurname?.trim() || ''
                const maternal = result.data.maternalSurname?.trim() || ''
                apellidos.value = `${paternal} ${maternal}`.trim()

                nombresEncontrados.value = true // Marcar que se encontraron los nombres

                showSuccess(`✅ ${documentType.value} encontrado: ${result.data.fullName || `${nombres.value} ${apellidos.value}`}`)

                console.log('📋 Datos cargados:', {
                    nombres: nombres.value,
                    apellidos: apellidos.value,
                    documentType: documentType.value,
                    documentNumber: documentNumber.value
                })
            } else {
                nombresEncontrados.value = false // No se encontraron nombres completos
                showError(`⚠️ ${documentType.value} encontrado, pero faltan datos personales. Complete manualmente.`)
            }
        } else {
            nombresEncontrados.value = false // No se encontraron datos
            showError(`❌ No se encontraron datos para el ${documentType.value} ${documentNumber.value}`)
        }
    } catch (error: any) {
        console.error(`💥 Error en la búsqueda de ${documentType.value}:`, error)

        if (error.statusCode === 400) {
            showError(`❌ ${documentType.value} inválido. Debe tener ${getSelectedDocumentType()?.maxLength} dígitos numéricos.`)
        } else if (error.statusCode === 429) {
            showError('⏳ Demasiadas consultas. Espere un momento antes de intentar nuevamente.')
        } else if (error.statusCode === 500) {
            showError('🔧 Error del servidor. Inténtelo más tarde.')
        } else if (error.statusCode === 403) {
            showError('🚫 Acceso no autorizado. Contacte al administrador.')
        } else {
            showError(`🌐 Error de conexión. Verifique su internet e inténtelo nuevamente.`)
        }
    } finally {
        isSearchingDni.value = false
    }
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files ? target.files.item(0) : null

    if (file && !['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
        showError('📎 Solo se permiten archivos JPG, PNG o PDF')
        target.value = ''
        return
    }

    if (file && file.size > 5 * 1024 * 1024) {
        showError('📏 El archivo no debe superar los 5MB')
        target.value = ''
        return
    }

    archivoVoucher.value = file
    if (file) {
        showSuccess(`📎 Archivo cargado: ${file.name}`)
    }
}

const handleSubmit = async () => {
    // Prevenir múltiples envíos
    if (isSubmitting.value || apiSubmitting.value) return
    
    if (!planId.value) {
        showError('❌ Por favor selecciona un plan de inscripción')
        return
    }

    if (!selectedPlan.value) {
        showError('❌ Plan no válido')
        return
    }

    if (!tipoInscripcion.value) {
        showError('❌ Por favor selecciona un tipo de inscripción')
        return
    }

    if (!modalidadDeposito.value) {
        showError('❌ Por favor selecciona la modalidad de depósito')
        return
    }

    const metodoDePago = modalidadDeposito.value === 'banco' ? tipoPago.value : aplicativo.value
    if (!metodoDePago) {
        showError('❌ Por favor selecciona el método de pago')
        return
    }

    if (!fechaPago.value) {
        showError('❌ Por favor indica la fecha de pago')
        return
    }

    if (!codigoVoucher.value) {
        showError('❌ Por favor ingresa el código del voucher')
        return
    }

    if (!archivoVoucher.value) {
        showError('❌ Por favor adjunta el voucher de pago')
        return
    }

    isSubmitting.value = true
    clearError()

    try {
        // Verificar que los catálogos necesarios estén cargados (solo classifications para general)
        if (!classifications.value?.length) {
            console.warn('⚠️ Catálogos no cargados, intentando reinicializar...')
            await initializeCatalogs()

            // Dar un momento para que se carguen
            await new Promise(resolve => setTimeout(resolve, 100))

            if (!classifications.value?.length) {
                throw new Error('No se pudieron cargar los datos necesarios. Recargue la página e intente nuevamente.')
            }
        }

        // Calcular el precio final basado en el plan seleccionado
        const selectedPlanData = selectedPlan.value
        const basePrice = isInstitutionalEmail.value ? selectedPlanData?.institutionalPrice || 0 : selectedPlanData?.basePrice || 0
        const originalPrice = selectedPlanData?.basePrice || 0
        const discount = originalPrice - basePrice

        // Preparar los datos del formulario
        const formData = {
            documentType: documentType.value,
            documentNumber: documentNumber.value,
            nombres: nombres.value,
            apellidos: apellidos.value,
            email: email.value,
            celular: celular.value,
            clasificacion: clasificacion.value,
            planId: planId.value, // Usar planId directamente
            modalidadDeposito: modalidadDeposito.value,
            bancoSeleccionado: bancoSeleccionado.value,
            tipoPago: tipoPago.value,
            aplicativo: aplicativo.value,
            fechaPago: fechaPago.value,
            codigoVoucher: codigoVoucher.value,
            archivoVoucher: archivoVoucher.value,
            finalPrice: basePrice,
            hasDiscount: discount > 0,
            descuento: discount
        }

        console.log('📤 Datos del formulario:', formData)

        // Mapear datos del formulario a formato de API
        const apiData = mapFormDataToApiData(formData)

        console.log('� Datos mapeados para API:', apiData)

        // Enviar inscripción
        const response = await createInscription(apiData)

        console.log('✅ Inscripción completada:', response)

        // Redirigir inmediatamente a página de confirmación
        if (response.data?.id) {
            router.push(`/confirmation?id=${response.data.id}`)
        } else {
            showSuccess(`🎉 ¡Inscripción completada exitosamente! Recibirás un email de confirmación en: ${email.value}`)
            // Si por alguna razón no hay ID, redirigir a página principal después de un momento
            setTimeout(() => {
                router.push('/')
            }, 2000)
        }

    } catch (error: any) {
        console.error('💥 Error al enviar formulario:', error)

        // Mostrar el error específico del composable si existe
        if (apiError.value) {
            showError(apiError.value)
        } else {
            showError('❌ Error al procesar la inscripción. Inténtelo nuevamente.')
        }
    } finally {
        isSubmitting.value = false
    }
}

// ===========================================================================
// FUNCIONES DE TRANSICIÓN PARA CAMPO DE CLASIFICACIÓN
// ===========================================================================
const onClassificationBeforeEnter = (el: Element) => {
    const htmlEl = el as HTMLElement
    htmlEl.style.height = '0'
    htmlEl.style.opacity = '0'
    htmlEl.style.overflow = 'hidden'
    htmlEl.style.transform = 'translateY(-20px)'
}

const onClassificationEnter = (el: Element, done: () => void) => {
    const htmlEl = el as HTMLElement

    // Forzar un reflow para asegurar que el estado inicial se aplique
    void htmlEl.offsetHeight

    // Obtener la altura natural del elemento
    htmlEl.style.height = 'auto'
    const height = htmlEl.offsetHeight
    htmlEl.style.height = '0'

    // Animar hasta la altura natural
    const animation = htmlEl.animate([
        {
            height: '0px',
            opacity: '0',
            transform: 'translateY(-20px)'
        },
        {
            height: `${height}px`,
            opacity: '1',
            transform: 'translateY(0)'
        }
    ], {
        duration: 600,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fill: 'forwards'
    })

    animation.onfinish = () => {
        htmlEl.style.height = 'auto'
        htmlEl.style.overflow = 'visible'
        done()
    }
}

const onClassificationAfterEnter = (el: Element) => {
    const htmlEl = el as HTMLElement
    htmlEl.style.height = 'auto'
    htmlEl.style.overflow = 'visible'
}

const onClassificationBeforeLeave = (el: Element) => {
    const htmlEl = el as HTMLElement
    const height = htmlEl.offsetHeight
    htmlEl.style.height = `${height}px`
    htmlEl.style.overflow = 'hidden'
}

const onClassificationLeave = (el: Element, done: () => void) => {
    const htmlEl = el as HTMLElement

    const animation = htmlEl.animate([
        {
            height: `${htmlEl.offsetHeight}px`,
            opacity: '1',
            transform: 'translateY(0)'
        },
        {
            height: '0px',
            opacity: '0',
            transform: 'translateY(-20px)'
        }
    ], {
        duration: 500,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fill: 'forwards'
    })

    animation.onfinish = done
}

const onClassificationAfterLeave = (el: Element) => {
    const htmlEl = el as HTMLElement
    htmlEl.style.height = ''
    htmlEl.style.opacity = ''
    htmlEl.style.transform = ''
    htmlEl.style.overflow = ''
}

// ===========================================================================
// INICIALIZACIÓN
// ===========================================================================
onMounted(async () => {
    // Inicializar catálogos de la API
    try {
        await initializeCatalogs()
        console.log('✅ Catálogos cargados desde la API')
    } catch (error) {
        console.error('💥 Error cargando catálogos:', error)
        showError('❌ Error al cargar datos iniciales. Algunas funciones pueden no estar disponibles.')
    }
})
</script>

<style scoped>
/* Page Layout & Banners */
.breadcrumb-area {
    position: relative;
    padding-top: 3.5rem;
    padding-bottom: 3.5rem;
    z-index: 1;
}

.breadcrumb-area::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('/images/bg/breadcrumb_bg01.jpg');
    background-size: cover;
    background-position: center;
    z-index: -1;
}

.breadcrumb-container {
    max-width: 1320px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.page-title {
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-weight: 700;
    color: #ffffff;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 0.5rem;
}

.page-subtitle {
    color: #cbd5e1;
    font-size: 1.125rem;
    max-width: 32rem;
}

/* Plan Info Section */
.plan-info-section {
    padding-top: 2rem;
    padding-bottom: 2rem;
    background-color: #0f172a;
}

.plan-info-container {
    max-width: 1320px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
    display: flex;
    justify-content: center;
}

.plan-card {
    background-color: #1e293b;
    border: 1px solid #475569;
    border-radius: 0.75rem;
    padding: 2rem;
    max-width: 28rem;
    width: 100%;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.plan-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    text-transform: uppercase;
}

.plan-badge {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid;
}

.badge-success {
    border-color: #45f882;
    color: #45f882;
}

.badge-warning {
    border-color: #fbbf24;
    color: #fbbf24;
}

.plan-price {
    font-size: 2.25rem;
    font-weight: 800;
    color: #45f882;
    margin-bottom: 1.5rem;
}

.plan-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.plan-feature {
    display: flex;
    align-items: center;
    color: #cbd5e1;
    margin-bottom: 0.75rem;
}

.feature-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #45f882;
    margin-right: 0.75rem;
    flex-shrink: 0;
}

/* Form Sections */
.form-section {
    padding-top: 3rem;
    padding-bottom: 3rem;
}

.form-container {
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
}

.registration-form {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 1.5rem;
    row-gap: 2rem;
}

/* Mejores transiciones para elementos específicos */
.registration-form>* {
    will-change: transform;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Document Input Group Styling */
.document-input-group {
    display: flex;
    border: 1px solid #475569;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #1e293b;
    transition: all 300ms;
    min-height: 48px;
}

.document-input-group:focus-within {
    border-color: #45f882;
    box-shadow: 0 0 0 2px rgba(69, 248, 130, 0.2);
}

.document-type-container {
    position: relative;
    flex-shrink: 0;
    width: 80px;
    display: flex;
    align-items: center;
}

.document-type-select {
    width: 100%;
    height: 100%;
    padding: 0.75rem 0.5rem;
    padding-right: 1.5rem;
    background-color: #334155;
    border: none;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 600;
    text-align: center;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
}

.document-type-select:focus {
    background-color: #475569;
}

.document-type-arrow {
    position: absolute;
    right: 0.25rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #94a3b8;
    pointer-events: none;
}

.document-number-container {
    display: flex;
    flex: 1;
    position: relative;
}

.document-number-input {
    flex: 1;
    padding: 0.75rem 1rem;
    background-color: transparent;
    border: none;
    color: #ffffff;
    outline: none;
}

.document-number-input::placeholder {
    color: #94a3b8;
}

.document-search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background-color: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    transition: color 300ms;
    min-width: 48px;
    min-height: 48px;
    flex-shrink: 0;
    border-radius: 0.375rem;
}

.document-search-button:hover:not(:disabled) {
    color: #45f882;
    background-color: rgba(69, 248, 130, 0.1);
}

.document-search-button:disabled {
    color: #64748b;
    cursor: not-allowed;
}

.form-group {
    width: 100%;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.form-label {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 0.5rem;
}

.form-input,
select.form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: #1e293b;
    border: 1px solid #475569;
    border-radius: 0.5rem;
    color: #ffffff;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}

.form-input::placeholder {
    color: #94a3b8;
}

.form-input:focus,
select.form-input:focus {
    outline: none;
    border-color: #45f882;
    box-shadow: 0 0 0 2px rgba(69, 248, 130, 0.2);
}

select.form-input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
}

.form-input[readonly] {
    cursor: not-allowed;
}

.input-readonly {
    background-color: #334155 !important;
    color: #ffffff !important;
    cursor: not-allowed !important;
    opacity: 0.8;
}

.input-filled {
    background-color: #334155;
}

.form-input:valid {
    background-color: #334155;
}

select.form-input:valid {
    background-color: #334155;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #334155 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    transition: background-color 5000s ease-in-out 0s;
}

input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
}

select.form-input:not(:valid) {
    color: #94a3b8;
}

input[type="date"]:not(:valid) {
    color: #94a3b8;
}

select.form-input:valid,
input[type="date"]:valid {
    color: #ffffff;
}

.form-hint {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #94a3b8;
    font-style: italic;
}

/* Plan Cards Compact Styling - Similar a Digital Ocean */
.plan-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    /* Permitir overflow para tooltips */
    overflow: visible;
}

.plan-card-simple {
    position: relative;
    background-color: #1e293b;
    border: 2px solid #475569;
    border-radius: 0.75rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 300ms ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.plan-card-simple:hover:not(.disabled) {
    border-color: #64748b;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.plan-card-simple.selected {
    border-color: #45f882;
    background-color: rgba(69, 248, 130, 0.05);
    box-shadow: 0 0 0 1px rgba(69, 248, 130, 0.2);
}

.plan-card-simple.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
    filter: grayscale(0.3);
}

.plan-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.plan-card-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
    text-transform: uppercase;
    margin: 0;
    line-height: 1.2;
}

.plan-card-price {
    font-size: 1.75rem;
    font-weight: 800;
    color: #45f882;
    line-height: 1;
    margin: 0;
}

.plan-card-badge {
    font-size: 0.5rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.1rem 0.25rem;
    border-radius: 0.2rem;
    border: 1px solid;
    white-space: nowrap;
    flex-shrink: 0;
    align-self: flex-start;
    line-height: 1;
    margin-top: 0.1rem;
    transform: translateY(-0.2rem);
}

.plan-card-description {
    font-size: 0.85rem;
    color: #94a3b8;
    line-height: 1.4;
}

/* Lista de características del plan */
.plan-features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.plan-feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.plan-feature-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
}

.plan-feature-icon.included {
    color: #45f882;
}

.plan-feature-icon.excluded {
    color: #ef4444;
}

.plan-feature-text {
    font-size: 0.875rem;
    color: #cbd5e1;
    line-height: 1.3;
}

.plan-feature-text.excluded {
    color: #94a3b8;
}

.plan-card-selector {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.plan-selector-radio {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #475569;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 300ms;
    background-color: #1e293b;
}

.plan-selector-radio.selected {
    background-color: #45f882;
    border-color: #45f882;
}

.plan-selector-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background-color: #000000;
}

/* Radio Button Styling */
.radio-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.radio-group-horizontal {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.5rem;
}

.radio-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 0.875rem;
    color: #cbd5e1;
}

.radio-custom-indicator {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #475569;
    border-radius: 9999px;
    margin-right: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 300ms;
}

.radio-custom-indicator.selected {
    background-color: #45f882;
    border-color: #45f882;
}

.radio-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background-color: #000000;
}

/* File Input Styling */
.file-input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: #1e293b;
    border: 1px solid #475569;
    border-radius: 0.5rem;
    transition: all 300ms;
    cursor: pointer;
    overflow: hidden;
}

.file-input-wrapper:hover {
    border-color: #45f882;
}

.file-input-wrapper.file-input-completed {
    background-color: #334155;
}

.file-input-button {
    background-color: #475569;
    color: #ffffff;
    padding: 0.75rem 1rem;
    white-space: nowrap;
    transition: background-color 300ms;
}

.file-input-wrapper:hover .file-input-button {
    background-color: #5a6a7e;
}

.file-input-text-area {
    padding: 0.75rem 1rem;
    color: #94a3b8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
}

.file-input-wrapper.file-input-completed .file-input-text-area {
    color: #ffffff;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

/* Submit Button */
.submit-button {
    width: 100%;
    background-color: #45f882;
    color: #000000;
    font-weight: 600;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    transition: all 300ms;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.submit-button:hover:not(:disabled) {
    background-color: #34d399;
    transform: translateY(-1px);
}

.submit-button:disabled {
    background-color: #64748b;
    cursor: not-allowed;
}

/* Tooltip Styling */
.tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0.75rem;
    padding: 0.5rem 0.75rem;
    background-color: #111827;
    color: #ffffff;
    font-size: 0.75rem;
    border-radius: 0.375rem;
    text-align: left;
    min-width: max-content;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
    z-index: 10;
}

.group:hover .tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(-5px);
}

.tooltip-arrow {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #111827;
}

/* Conditional Section Styling */
.conditional-section {
    background-color: rgba(30, 41, 59, 0.5);
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #475569;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.height-expand-enter-active {
    transition: none;
    /* Las transiciones se manejan con JS */
}

.height-expand-leave-active {
    transition: none;
    /* Las transiciones se manejan con JS */
}

/* Mejores transiciones para elementos que siguen al campo de clasificación */
.form-section-below-classification {
    transition:
        transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
        margin-top 0.5s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.4s ease-out;
    will-change: transform, margin-top;
    transform-origin: top center;
}

/* Estilo global para suavizar transiciones en toda la grilla */
.registration-form {
    transition: height 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.registration-form>* {
    transition:
        transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.4s ease-out,
        margin 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    will-change: transform;
}

/* Responsive title */
@media (min-width: 640px) {
    .page-title {
        font-size: 3rem;
        line-height: 1;
    }
}

/* Responsive para las cards de planes */
@media (max-width: 768px) {
    .plan-cards-container {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .plan-card-simple {
        padding: 1rem;
    }

    .plan-card-title {
        font-size: 1rem;
    }

    .plan-card-price {
        font-size: 1.5rem;
    }

    .plan-card-badge {
        font-size: 0.45rem;
        padding: 0.08rem 0.2rem;
        margin-top: 0.08rem;
        transform: translateY(-0.15rem);
    }

    .plan-card-description {
        font-size: 0.8rem;
    }

    .plan-card-selector {
        top: 0.75rem;
        right: 0.75rem;
    }

    .plan-price-container {
        align-items: flex-start;
        gap: 0.2rem;
    }
}

@media (min-width: 1024px) {
    .plan-cards-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Plan Tooltip Styling */
.plan-title-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}



/* Responsive para el botón de búsqueda */
@media (max-width: 640px) {
    .document-search-button {
        min-width: 44px;
        min-height: 44px;
        padding: 0.375rem;
    }

    .document-input-group {
        min-height: 44px;
    }

    .document-type-select {
        font-size: 0.8rem;
        padding: 0.5rem 0.25rem;
        padding-right: 1.25rem;
    }

    .document-number-input {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
    }

    .plan-card {
        padding: 1.5rem;
    }

    .plan-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    /* Responsive para tooltips de planes */
    .plan-tooltip {
        min-width: 200px;
        max-width: 90vw;
        left: 50%;
        transform: translateX(-50%);
        margin-left: 0;
        margin-right: 0;
        padding: 0.75rem;
        font-size: 0.75rem;
        background-color: #111827 !important;
        border: 1px solid #374151 !important;
        z-index: 9999 !important;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5) !important;
        opacity: 0;
        backdrop-filter: blur(8px);
    }

    .plan-info-tooltip-container:hover .plan-tooltip {
        transform: translateX(-50%) translateY(8px);
        opacity: 1 !important;
    }

    .plan-tooltip-arrow {
        left: 50%;
        transform: translateX(-50%);
    }

    .plan-tooltip-features {
        gap: 0.5rem;
    }

    .plan-tooltip-feature {
        font-size: 0.75rem;
    }

    .plan-feature-icon {
        width: 0.875rem;
        height: 0.875rem;
        margin-right: 0.375rem;
    }
}

/* Responsive específico para pantallas muy pequeñas */
@media (max-width: 480px) {
    .plan-tooltip {
        min-width: 180px;
        max-width: 85vw;
        padding: 0.625rem;
        font-size: 0.7rem;
        left: 50%;
        transform: translateX(-50%);
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        background-color: #0f172a !important;
        border: 2px solid #374151 !important;
        z-index: 9999 !important;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6) !important;
        backdrop-filter: blur(12px);
        color: #ffffff !important;
    }

    .plan-info-tooltip-container:hover .plan-tooltip {
        transform: translateX(-50%) translateY(6px);
        opacity: 1 !important;
    }

    .plan-tooltip-title {
        font-size: 0.8rem;
        margin-bottom: 0.375rem;
    }

    .plan-tooltip-price {
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
    }

    .plan-tooltip-features {
        gap: 0.4rem;
    }

    .plan-tooltip-feature {
        font-size: 0.7rem;
    }

    .plan-feature-icon {
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.3rem;
    }
}

/* QR Image Styling */
.qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.qr-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem;
    background-color: #334155;
    border: 2px solid #475569;
    border-radius: 0.75rem;
    max-width: 180px;
    width: 100%;
}

.qr-image {
    width: 100%;
    height: auto;
    max-width: 150px;
    aspect-ratio: 1;
    object-fit: contain;
    border-radius: 0.375rem;
}

.qr-description {
    text-align: center;
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 500;
    line-height: 1.3;
    max-width: 180px;
}

/* Responsive para la imagen QR */
@media (max-width: 768px) {
    .qr-image-container {
        max-width: 150px;
        padding: 0.5rem;
    }

    .qr-image {
        max-width: 120px;
    }

    .qr-description {
        font-size: 0.7rem;
        max-width: 150px;
    }
}

/* QR Button Styling */
.qr-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    background-color: #45f882;
    color: #000000;
    font-weight: 600;
    font-size: 0.875rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    transition: all 300ms ease;
}

.qr-button:hover {
    background-color: #34d399;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(69, 248, 130, 0.3);
}

/* QR Button Inline (al lado de radio buttons) */
.radio-group-with-qr {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.qr-button-inline {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background-color: #45f882;
    color: #000000;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: all 300ms ease;
    min-width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
}

.qr-button-inline:hover {
    background-color: #34d399;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(69, 248, 130, 0.3);
}

/* QR Modal Styling */
.qr-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    overflow: hidden;
}

.qr-modal-container {
    background-color: #0f172a;
    border: 2px solid #1e293b;
    border-radius: 1rem;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    position: relative;
}

.qr-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid #1e293b;
}

.qr-modal-title {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
}

.qr-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background-color: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 300ms;
}

.qr-modal-close:hover {
    background-color: #1e293b;
    color: #ffffff;
}

.qr-modal-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.qr-modal-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background-color: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.qr-modal-image {
    width: 100%;
    height: auto;
    max-width: 200px;
    aspect-ratio: 1;
    object-fit: contain;
}

.qr-modal-info {
    text-align: center;
    color: #cbd5e1;
}

.qr-modal-name {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: #ffffff;
}

.qr-modal-instructions {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #94a3b8;
    max-width: 350px;
}

.qr-modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #1e293b;
    display: flex;
    justify-content: center;
}

.qr-modal-button {
    padding: 0.75rem 2rem;
    background-color: #1e293b;
    color: #ffffff;
    font-weight: 500;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 300ms;
}

.qr-modal-button:hover {
    background-color: #334155;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Responsive para el modal */
@media (max-width: 640px) {
    .qr-modal-container {
        margin: 0.5rem;
        max-width: calc(100vw - 1rem);
    }

    .qr-modal-header,
    .qr-modal-content,
    .qr-modal-footer {
        padding: 1rem;
    }

    .qr-modal-image {
        max-width: 200px;
    }

    .qr-button {
        padding: 0.625rem 1.25rem;
        font-size: 0.8rem;
    }
}
</style>