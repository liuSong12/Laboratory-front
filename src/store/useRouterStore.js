import { defineStore } from "pinia"
import { ref } from 'vue'

export const useRouterStore = defineStore("router", () => {
    const isGetterRouter = ref(false)
    const changeIsGetterRouter = (value) => {
        isGetterRouter.value = value
    }

    return {
        isGetterRouter,
        changeIsGetterRouter
    }
},{
    persist: false // If you want to persist state
})