import { createApp } from 'vue'
import { createPinia } from 'pinia'
import createPersistedState from 'pinia-persistedstate'
import VueGapi from 'vue-gapi'
import router from './router'
import App from './App.vue'

import { api } from 'config/google-config.json'

import './styles.css'

const app = createApp(App)
const state = createPinia()
state.use(createPersistedState())

app.use(state)
app.use(router)
app.use(VueGapi, api)
app.provide('gapi', app.config.globalProperties.$gapi)
app.mount('#app')
