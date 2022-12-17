import { defineStore } from 'pinia'

export const useParameterStore = defineStore("ParameterStore", {

    state: () => {

        return {
            payload: {}
        }
    },
   
    actions: {
        loadPayload(parameters) {
            this.payload = parameters
        },

        clearPayload() {
            this.payload = {}
        }
    }

    //getters
})
