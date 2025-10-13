<template>
    <div>
        <!-- ===========================================================================
        ENCABEZADO DE PÁGINA
        ============================================================================ -->
        
        <section v-if="!error" class="breadcrumb-area">
        <div class="breadcrumb-container">
                <h1 class="page-title">¡INSCRIPCIÓN COMPLETADA!</h1>
                <p class="page-subtitle">Tu registro ha sido procesado exitosamente</p>
            </div>
        </section>

        <!-- ===========================================================================
        SECCIÓN DE CONFIRMACIÓN
        ============================================================================ -->
        <section class="confirmation-section">
            <div class="confirmation-container">
                
                <!-- Estado de carga -->
                <div v-if="isLoading" class="loading-state">
                    <Icon name="heroicons:arrow-path" class="animate-spin h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p class="text-gray-300">Cargando información de tu inscripción...</p>
                </div>

                <!-- Error al cargar -->
                <div v-else-if="error" class="error-state">
                    <div class="error-content">
                        <div class="error-icon">
                            <Icon :name="getErrorContent(error).icon" class="h-16 w-16 mx-auto mb-4" />
                        </div>
                        
                        <div class="error-text">
                            <h2 class="error-title">{{ getErrorContent(error).title }}</h2>
                            <p class="error-message">{{ getErrorContent(error).message }}</p>
                            <p class="error-suggestion">{{ getErrorContent(error).suggestion }}</p>
                        </div>

                        <div class="error-actions">
                            <NuxtLink 
                                :to="getErrorContent(error).actionLink || '/'"
                                class="btn-primary"
                            >
                                <Icon name="heroicons:arrow-right" class="h-5 w-5 mr-2" />
                                {{ getErrorContent(error).actionText }}
                            </NuxtLink>

                            <NuxtLink 
                                to="/planes"
                                class="btn-secondary"
                            >
                                <Icon name="heroicons:arrow-path" class="h-5 w-5 mr-2" />
                                Nueva inscripción
                            </NuxtLink>
                        </div>

                        <!-- Información de contacto -->
                        <div class="error-help">
                            <p class="help-text">¿Necesitas ayuda?</p>
                            <div class="help-options">
                                <a href="mailto:congreso@undc.edu.pe" class="help-link">
                                    <Icon name="heroicons:envelope" class="h-4 w-4 mr-1" />
                                    congreso@undc.edu.pe
                                </a>
                                <a href="https://wa.me/51949026908" class="help-link">
                                    <Icon name="heroicons:phone" class="h-4 w-4 mr-1" />
                                    +51 949 026 908
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Información de la inscripción -->
                <div v-else-if="inscription" class="confirmation-card">
                    <!-- Ícono de éxito -->
                    <div class="success-icon">
                        <Icon name="heroicons:check-circle" class="h-16 w-16 text-green-500" />
                    </div>

                    <!-- Información principal -->
                    <div class="confirmation-info">
                        <h2 class="confirmation-title">
                            ¡Inscripción Exitosa!
                        </h2>
                        
                        <div class="inscription-number">
                            <span class="label">Número de Inscripción:</span>
                            <span class="number">#{{ inscription.id }}</span>
                        </div>

                        <p class="confirmation-message">
                            Hola <strong>{{ inscription.usuario.nombres }} {{ inscription.usuario.apellidos }}</strong>, 
                            tu inscripción al <strong>VII CIISIC</strong> ha sido registrada exitosamente.
                        </p>
                    </div>

                    <!-- Detalles de la inscripción -->
                    <div class="inscription-details">
                        <h3 class="details-title">Detalles de tu inscripción:</h3>
                        
                        <div class="details-grid">
                            <div class="detail-item">
                                <span class="detail-label">Tipo de inscripción:</span>
                                <span class="detail-value">{{ inscription.tipoInscripcion.nombre }}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Monto pagado:</span>
                                <span class="detail-value">S/ {{ parseFloat(inscription.pago).toFixed(2) }}</span>
                            </div>
                            
                            <div v-if="inscription.clasificacion" class="detail-item">
                                <span class="detail-label">Clasificación:</span>
                                <span class="detail-value">{{ inscription.clasificacion.nombre }}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">{{ inscription.usuario.correoElectronico }}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Celular:</span>
                                <span class="detail-value">{{ inscription.usuario.celular }}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Modalidad de pago:</span>
                                <span class="detail-value">{{ inscription.modalidadDeposito === 'banco' ? 'Depósito Bancario' : 'Billetera Digital' }}</span>
                            </div>
                            
                            <div v-if="inscription.modalidadDeposito === 'banco'" class="detail-item">
                                <span class="detail-label">Banco:</span>
                                <span class="detail-value">{{ inscription.bancoSeleccionado === 'bcp' ? 'BCP' : 'Interbank' }}</span>
                            </div>
                            
                            <div v-if="inscription.modalidadDeposito === 'banco'" class="detail-item">
                                <span class="detail-label">Tipo de operación:</span>
                                <span class="detail-value">{{ inscription.tipoOperacion === 'directo' ? 'Depósito Directo' : 'Transferencia Interbancaria' }}</span>
                            </div>
                            
                            <div v-if="inscription.modalidadDeposito === 'billetera'" class="detail-item">
                                <span class="detail-label">Aplicativo:</span>
                                <span class="detail-value">{{ inscription.billeteraDigital === 'yape' ? 'Yape' : 'Plin' }}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Código del voucher:</span>
                                <span class="detail-value">{{ inscription.numeroOperacion }}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Fecha de pago:</span>
                                <span class="detail-value">{{ formatDate(inscription.fechaPago) }}</span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Estado:</span>
                                <span class="detail-value status" :class="getStatusClass(inscription.estado.nombre)">
                                    {{ inscription.estado.nombre }}
                                </span>
                            </div>
                            
                            <div class="detail-item">
                                <span class="detail-label">Fecha de registro:</span>
                                <span class="detail-value">{{ formatDate(inscription.creadoEn) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Próximos pasos -->
                    <div class="next-steps">
                        <h3 class="steps-title">Próximos pasos:</h3>
                        <ul class="steps-list">
                            <li>📧 Recibirás un email de confirmación en los próximos minutos</li>
                            <li>🔍 Nuestro equipo verificará tu voucher de pago</li>
                            <li>✅ Una vez aprobado, recibirás tu certificado y carnet digital</li>
                            <li>📅 Te notificaremos sobre el cronograma de actividades</li>
                        </ul>
                    </div>

                    <!-- Acciones -->
                    <div class="confirmation-actions">
                        <!-- <button @click="downloadPDF" class="btn-secondary">
                            <Icon name="heroicons:document-arrow-down" class="h-5 w-5 mr-2" />
                            Descargar comprobante
                        </button> -->
                        
                        <NuxtLink to="/" class="btn-primary">
                            <Icon name="heroicons:home" class="h-5 w-5 mr-2" />
                            Volver al inicio
                        </NuxtLink>
                    </div>
                </div>

                <!-- Estado por defecto -->
                <div v-else class="default-state">
                    <Icon name="heroicons:document-magnifying-glass" class="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h2 class="text-xl font-bold text-white mb-2">No se encontró información</h2>
                    <p class="text-gray-300 mb-6">No se pudo cargar la información de la inscripción</p>
                    <NuxtLink to="/planes" class="btn-primary">
                        Hacer nueva inscripción
                    </NuxtLink>
                </div>

            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
// ===========================================================================
// SEO Y META TAGS
// ===========================================================================
useHead({
    title: 'Confirmación | VII CIISIC',
    meta: [
        { name: 'description', content: 'Confirmación de inscripción exitosa al VII CIISIC de la UNDC.' }
    ]
})

// ===========================================================================
// COMPOSABLES
// ===========================================================================
const route = useRoute()
const inscriptionStore = useInscriptionStore()
const isLoading = ref(false)

// ===========================================================================
// ESTADO REACTIVO
// ===========================================================================
const inscription = ref<any>(null)
const error = ref<string | null>(null)
const inscriptionId = computed(() => route.query.id as string)

// ===========================================================================
// MÉTODOS
// ===========================================================================
const loadInscription = async () => {
    // Primero intentar cargar desde el store (datos recién creados)
    if (inscriptionStore.hasInscription) {
        inscription.value = inscriptionStore.currentInscription
        console.log('✅ Inscripción cargada desde el store:', inscription.value)
        return
    }

    // Si no hay datos en el store, mostrar error
    if (!inscriptionId.value) {
        error.value = 'no_id'
        return
    }

    // Si llegamos aquí es porque no hay datos en el store y hay un ID en la URL
    // Esto significa que el usuario recargó la página o llegó por link directo
    error.value = 'no_data'
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pendiente':
            return 'status-pending'
        case 'aprobado':
            return 'status-approved'
        case 'rechazado':
            return 'status-rejected'
        case 'en revisión':
            return 'status-reviewing'
        case 'cancelado':
            return 'status-cancelled'
        default:
            return 'status-default'
    }
}

const getErrorContent = (errorType: string) => {
    switch (errorType) {
        case 'no_id':
            return {
                icon: 'heroicons:question-mark-circle',
                title: '¿Dónde está tu inscripción?',
                message: 'Parece que llegaste aquí sin un número de inscripción válido.',
                suggestion: 'Intenta acceder desde el enlace en tu confirmación de registro.',
                actionText: 'Ir a registro',
                actionLink: '/planes'
            }
        case 'not_found':
            return {
                icon: 'heroicons:magnifying-glass',
                title: 'Inscripción no encontrada',
                message: `No pudimos encontrar la inscripción #${inscriptionId.value}`,
                suggestion: 'Verifica que el número de inscripción sea correcto o que tu registro se haya completado exitosamente.',
                actionText: 'Verificar registro',
                actionLink: '/planes'
            }
        case 'no_connection':
            return {
                icon: 'heroicons:wifi',
                title: 'Sin conexión a internet',
                message: 'No hay conexión a internet disponible.',
                suggestion: 'Verifica tu conexión y vuelve a intentarlo.',
                actionText: 'Volver a planes',
                actionLink: '/planes'
            }
        case 'server_error':
            return {
                icon: 'heroicons:server',
                title: 'Error del servidor',
                message: 'Hay un problema temporal en nuestros servidores.',
                suggestion: 'Por favor, intenta nuevamente en unos minutos.',
                actionText: 'Volver a planes',
                actionLink: '/planes'
            }
        case 'no_data':
            return {
                icon: 'heroicons:arrow-path',
                title: 'Sesión expirada',
                message: 'Los datos de tu inscripción ya no están disponibles en esta sesión.',
                suggestion: 'Si acabas de registrarte, por favor verifica tu email para la confirmación. Si necesitas consultar tu inscripción, contacta con soporte.',
                actionText: 'Ir al inicio',
                actionLink: '/'
            }
        default:
            return {
                icon: 'heroicons:exclamation-triangle',
                title: 'Oops, algo salió mal',
                message: 'Ocurrió un error inesperado al cargar tu inscripción.',
                suggestion: 'Intenta recargar la página o contacta con soporte si el problema persiste.',
                actionText: 'Reintentar',
                actionLink: null
            }
    }
}

const downloadPDF = () => {
    // TODO: Implementar descarga de PDF
    console.log('Descargando comprobante PDF...')
}

// ===========================================================================
// INICIALIZACIÓN
// ===========================================================================
onMounted(() => {
    loadInscription()
})
</script>

<style scoped>
/* Page Layout */
.breadcrumb-area {
    position: relative;
    padding-top: 3.5rem;
    padding-bottom: 3.5rem;
    background-image: url('/images/bg/breadcrumb_bg01.jpg');
    background-size: cover;
    background-position: center;
}

.breadcrumb-container {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
}

.page-title {
    font-size: 2.25rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.5rem;
}

.page-subtitle {
    color: #cbd5e1;
    font-size: 1.125rem;
}

/* Confirmation Section */
.confirmation-section {
    padding: 3rem 0;
    min-height: 70vh;
    display: flex;
    align-items: center;
}

.confirmation-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* States */
.loading-state,
.error-state,
.default-state {
    text-align: center;
    padding: 3rem;
}

/* Error State Styles */
.error-content {
    max-width: 500px;
    margin: 0 auto;
    background-color: #1e293b;
    border: 1px solid #ef4444;
    border-radius: 1rem;
    padding: 2.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.error-icon {
    margin-bottom: 1.5rem;
}

.error-icon .iconify {
    color: #ef4444;
}

.error-text {
    margin-bottom: 2rem;
}

.error-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 0.75rem;
}

.error-message {
    color: #f87171;
    font-size: 1.125rem;
    margin-bottom: 0.75rem;
}

.error-suggestion {
    color: #cbd5e1;
    font-size: 1rem;
    line-height: 1.5;
}

.error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2rem;
}

.error-help {
    border-top: 1px solid #374151;
    padding-top: 1.5rem;
}

.help-text {
    color: #9ca3af;
    font-size: 0.875rem;
    margin-bottom: 1rem;
}

.help-options {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.help-link {
    display: inline-flex;
    align-items: center;
    color: #60a5fa;
    text-decoration: none;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border: 1px solid #374151;
    border-radius: 0.5rem;
    transition: all 300ms;
}

.help-link:hover {
    background-color: #374151;
    border-color: #60a5fa;
    transform: translateY(-1px);
}

/* Confirmation Card */
.confirmation-card {
    background-color: #1e293b;
    border: 1px solid #475569;
    border-radius: 1rem;
    padding: 2.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.success-icon {
    text-align: center;
    margin-bottom: 2rem;
}

.confirmation-info {
    text-align: center;
    margin-bottom: 2.5rem;
}

.confirmation-title {
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 1rem;
}

.inscription-number {
    display: inline-flex;
    align-items: center;
    background-color: #059669;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.inscription-number .label {
    margin-right: 0.5rem;
}

.inscription-number .number {
    font-size: 1.25rem;
    font-weight: 800;
}

.confirmation-message {
    color: #cbd5e1;
    font-size: 1.125rem;
    line-height: 1.6;
}

/* Details */
.inscription-details {
    margin-bottom: 2.5rem;
}

.details-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 1.5rem;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1rem;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    background-color: #334155;
    border-radius: 0.5rem;
    gap: 1rem;
    min-height: 60px;
}

.detail-label {
    color: #94a3b8;
    font-weight: 500;
    min-width: 120px;
    flex-shrink: 0;
}

.detail-value {
    color: #ffffff;
    font-weight: 600;
    word-break: break-word;
    overflow-wrap: break-word;
    max-width: 300px;
}

.detail-value.status {
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    text-transform: uppercase;
}

.status-pending {
    background-color: #fbbf24;
    color: #000000;
}

.status-approved {
    background-color: #059669;
    color: #ffffff;
}

.status-rejected {
    background-color: #dc2626;
    color: #ffffff;
}

.status-reviewing {
    background-color: #3b82f6;
    color: #ffffff;
}

.status-cancelled {
    background-color: #6b7280;
    color: #ffffff;
}

.status-default {
    background-color: #64748b;
    color: #ffffff;
}

/* Next Steps */
.next-steps {
    margin-bottom: 2.5rem;
}

.steps-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 1rem;
}

.steps-list {
    list-style: none;
    padding: 0;
}

.steps-list li {
    color: #cbd5e1;
    margin-bottom: 0.75rem;
    padding-left: 0.5rem;
}

/* Actions */
.confirmation-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    background-color: #45f882;
    color: #000000;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 300ms;
    border: none;
    cursor: pointer;
}

.btn-primary:hover {
    background-color: #34d399;
    transform: translateY(-1px);
}

.btn-secondary {
    display: inline-flex;
    align-items: center;
    background-color: #475569;
    color: #ffffff;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 300ms;
    border: none;
    cursor: pointer;
}

.btn-secondary:hover {
    background-color: #64748b;
    transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 640px) {
    .page-title {
        font-size: 1.75rem;
    }
    
    .confirmation-card,
    .error-content {
        padding: 1.5rem;
    }
    
    .confirmation-title,
    .error-title {
        font-size: 1.5rem;
    }
    
    .details-grid {
        grid-template-columns: 1fr;
    }
    
    .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .confirmation-actions,
    .error-actions {
        flex-direction: column;
    }
    
    .help-options {
        flex-direction: column;
        align-items: center;
    }
    
    .error-icon .iconify {
        height: 12rem !important;
        width: 12rem !important;
    }
}
</style>