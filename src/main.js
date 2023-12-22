import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Particles from "vue3-particles";
import "./utils/axios.config"
import 'element-plus/theme-chalk/dark/css-vars.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


createApp(App)
    .use(Particles)
    .use(router)
    .use(pinia)
    .use(ElementPlus)
    .mount('#app')
