// stores/inscriptionPlans.ts
import { defineStore } from 'pinia'
interface PlanCharacteristic {
    icon: string
    text: string
}

interface InscriptionPlan {
    id: number
    nombre: string
    precio: number
    value: string
    descripcion: string
    badge: string
    caracteristicas: PlanCharacteristic[]
    activo: boolean
}

interface InscriptionPlansState {
    plans: InscriptionPlan[]
    isLoading: boolean
    error: string | null
    lastFetch: number | null
}

export const useInscriptionPlansStore = defineStore('inscriptionPlans', {
    state: (): InscriptionPlansState => ({
        plans: [
            // Datos por defecto que se cargan inmediatamente
            {
                id: 1,
                nombre: "ESTUDIANTES",
                precio: 120,
                value: "estudiantes_con_kit",
                descripcion: "La experiencia completa para estudiantes con kit de merchandising oficial.",
                badge: "CON KIT",
                caracteristicas: [
                    { icon: "heroicons:academic-cap", text: "Certificado Digital (100h)" },
                    { icon: "heroicons:gift", text: "Kit de Merchandising Oficial" },
                    { icon: "heroicons:identification", text: "Carnet de Identificación" },
                    { icon: "heroicons:ticket", text: "Acceso a todas las ponencias" }
                ],
                activo: true
            },
            {
                id: 2,
                nombre: "ESTUDIANTES",
                precio: 60,
                value: "estudiantes_sin_kit",
                descripcion: "La opción económica para estudiantes, con acceso a todas las ponencias.",
                badge: "SIN KIT",
                caracteristicas: [
                    { icon: "heroicons:academic-cap", text: "Certificado Digital (100h)" },
                    { icon: "heroicons:identification", text: "Carnet de Identificación" },
                    { icon: "heroicons:ticket", text: "Acceso a todas las ponencias" },
                    { icon: "heroicons:x-mark", text: "No incluye Kit" }
                ],
                activo: true
            },
            {
                id: 3,
                nombre: "PÚBLICO GENERAL",
                precio: 140,
                value: "publico_general_con_kit",
                descripcion: "Acceso total con kit para profesionales y cualquier persona interesada.",
                badge: "INCLUYE KIT",
                caracteristicas: [
                    { icon: "heroicons:academic-cap", text: "Certificado Digital (100h)" },
                    { icon: "heroicons:gift", text: "Kit de Merchandising Oficial" },
                    { icon: "heroicons:identification", text: "Carnet de Identificación" },
                    { icon: "heroicons:ticket", text: "Acceso a todas las ponencias" }
                ],
                activo: true
            }
        ],
        isLoading: false,
        error: null,
        lastFetch: null
    }),

    getters: {
        // Obtener todos los planes activos
        activePlans: (state) => state.plans.filter(plan => plan.activo),

        // Obtener plan por ID
        getPlanById: (state) => (id: number) => state.plans.find(plan => plan.id === id),

        // Verificar si hay datos cargados
        hasData: (state) => state.plans.length > 0,

        // Planes transformados para compatibilidad con el código existente
        plansFormatted: (state) => state.plans.map(plan => ({
            id: plan.id,
            title: plan.nombre,
            badge: plan.badge,
            price: `S/ ${plan.precio}.00`,
            value: plan.value,
            description: plan.descripcion,
            features: plan.caracteristicas.map(caracteristica => ({
                icon: caracteristica.icon,
                text: caracteristica.text
            }))
        }))
    },

    actions: {
        // Obtener planes desde la API usando $fetch
        async fetchPlans() {
            this.isLoading = true
            this.error = null
            const { request } = useApi()
            try {
                const plans = await request<InscriptionPlan[]>('/api/v1/registration-types')

                this.plans = plans
                this.lastFetch = Date.now()
                this.error = null

                return plans

            } catch (error: any) {
                this.error = error.message || 'Error al cargar planes de inscripción'

                // Mantener los datos por defecto si hay un error
                // No lanzar el error para que la aplicación continúe funcionando
                return this.plans

            } finally {
                this.isLoading = false
            }
        },

        // Refrescar datos (alias para fetchPlans)
        async refreshPlans() {
            return await this.fetchPlans()
        },

        // Limpiar error
        clearError() {
            this.error = null
        },

        // Establecer planes por defecto (fallback)
        setDefaultPlans() {
            this.plans = [
                {
                    id: 1,
                    nombre: "ESTUDIANTES",
                    precio: 120,
                    value: "estudiantes_con_kit",
                    descripcion: "La experiencia completa para estudiantes con kit de merchandising oficial.",
                    badge: "CON KIT",
                    caracteristicas: [
                        { icon: "heroicons:academic-cap", text: "Certificado Digital (100h)" },
                        { icon: "heroicons:gift", text: "Kit de Merchandising Oficial" },
                        { icon: "heroicons:identification", text: "Carnet de Identificación" },
                        { icon: "heroicons:ticket", text: "Acceso a todas las ponencias" }
                    ],
                    activo: true
                },
                {
                    id: 2,
                    nombre: "ESTUDIANTES",
                    precio: 60,
                    value: "estudiantes_sin_kit",
                    descripcion: "La opción económica para estudiantes, con acceso a todas las ponencias.",
                    badge: "SIN KIT",
                    caracteristicas: [
                        { icon: "heroicons:academic-cap", text: "Certificado Digital (100h)" },
                        { icon: "heroicons:identification", text: "Carnet de Identificación" },
                        { icon: "heroicons:ticket", text: "Acceso a todas las ponencias" },
                        { icon: "heroicons:x-mark", text: "No incluye Kit" }
                    ],
                    activo: true
                },
                {
                    id: 3,
                    nombre: "PÚBLICO GENERAL",
                    precio: 140,
                    value: "publico_general_con_kit",
                    descripcion: "Acceso total con kit para profesionales y cualquier persona interesada.",
                    badge: "INCLUYE KIT",
                    caracteristicas: [
                        { icon: "heroicons:academic-cap", text: "Certificado Digital (100h)" },
                        { icon: "heroicons:gift", text: "Kit de Merchandising Oficial" },
                        { icon: "heroicons:identification", text: "Carnet de Identificación" },
                        { icon: "heroicons:ticket", text: "Acceso a todas las ponencias" }
                    ],
                    activo: true
                }
            ]
        }
    }
})
