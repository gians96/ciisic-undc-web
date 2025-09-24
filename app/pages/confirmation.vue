<template>
    <div>
        <!-- ===========================================================================
        ENCABEZADO DE PÁGINA
        ============================================================================ -->
        <section class="breadcrumb-area">
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
                    <Icon name="heroicons:exclamation-triangle" class="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 class="text-xl font-bold text-white mb-2">Error al cargar la información</h2>
                    <p class="text-gray-300 mb-6">{{ error }}</p>
                    <button 
                        @click="loadInscription"
                        class="btn-primary"
                    >
                        Intentar de nuevo
                    </button>
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
                                <span class="detail-label">Precio:</span>
                                <span class="detail-value">S/ {{ inscription.tipoInscripcion.precio }}.00</span>
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
                                <span class="detail-label">Código del voucher:</span>
                                <span class="detail-value">{{ inscription.voucher.codigo }}</span>
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
                        <button @click="downloadPDF" class="btn-secondary">
                            <Icon name="heroicons:document-arrow-down" class="h-5 w-5 mr-2" />
                            Descargar comprobante
                        </button>
                        
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
                    <NuxtLink to="/register" class="btn-primary">
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
    title: 'Confirmación de Inscripción - VII CIISIC UNDC',
    meta: [
        { name: 'description', content: 'Confirmación de inscripción exitosa al VII Congreso Internacional de Ingeniería de Sistemas e Informática de la UNDC.' }
    ]
})

// ===========================================================================
// COMPOSABLES
// ===========================================================================
const route = useRoute()
const { getInscriptionById, isLoading } = useInscription()

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
    if (!inscriptionId.value) {
        error.value = 'ID de inscripción no proporcionado'
        return
    }

    try {
        const response: any = await getInscriptionById(parseInt(inscriptionId.value))
        inscription.value = response.data
    } catch (err) {
        console.error('Error cargando inscripción:', err)
        error.value = 'No se pudo cargar la información de la inscripción'
    }
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
        case 'confirmado':
            return 'status-approved'
        case 'rechazado':
            return 'status-rejected'
        default:
            return 'status-default'
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
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #334155;
    border-radius: 0.5rem;
}

.detail-label {
    color: #94a3b8;
    font-weight: 500;
}

.detail-value {
    color: #ffffff;
    font-weight: 600;
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
    
    .confirmation-card {
        padding: 1.5rem;
    }
    
    .confirmation-title {
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
    
    .confirmation-actions {
        flex-direction: column;
    }
}
</style>