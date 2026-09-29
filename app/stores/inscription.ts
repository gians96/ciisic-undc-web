// stores/inscription.ts
// Inscripción recién creada (respuesta del POST), solo en memoria: no existe un GET público.
import { defineStore } from 'pinia'
import type { InscripcionCreada } from '~/types/inscription'

export const useInscriptionStore = defineStore('inscription', {
    state: () => ({
        currentInscription: null as InscripcionCreada | null,
    }),

    actions: {
        setInscription(inscription: InscripcionCreada) {
            this.currentInscription = inscription
        },

        clearInscription() {
            this.currentInscription = null
        }
    },

    getters: {
        hasInscription: (state) => state.currentInscription !== null
    }
})
