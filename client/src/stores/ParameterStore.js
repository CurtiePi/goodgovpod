import { defineStore } from 'pinia'

export const useParameterStore = defineStore("ParameterStore", {

    state: () => {

        return {
            payload: null 
        }
    },
   
    actions: {
        loadPayload(parameters) {
            this.payload = parameters
        },

        clearPayload() {
            this.payload = null
        }
    },

    getters: {
        notEmpty: (state) => (state.payload != null),
    }
})
