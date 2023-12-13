import { defineStore } from "pinia"
import { ref } from 'vue'

export const useRightsStore = defineStore("rights", () => {
    const rightsList = ref([])
    const changeRights = (value) => {
        rightsList.value = value
    }

    return {
        rightsList,
        changeRights
    }
},{
    persist: false // If you want to persist state
})