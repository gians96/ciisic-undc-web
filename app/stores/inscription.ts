// stores/inscription.ts
import { defineStore } from 'pinia'

export const useInscriptionStore = defineStore('inscription', {
    state: () => ({
        currentInscription: null as any | null,
    }),
    
    actions: {
        setInscription(inscription: any) {
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
