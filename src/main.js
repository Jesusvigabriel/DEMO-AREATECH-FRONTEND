import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import './assets/global.css'
import './assets/theme.css'
// import VueConfirmDialog from 'vue-confirm-dialog'

// Vue.use(VueConfirmDialog)
// Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

// Importa e instala vue-lsi-util para LSIMensajes y LSIDialog
import LSIUtil from 'vue-lsi-util'
Vue.use(LSIUtil)

Vue.config.productionTip = false

// Configuración global de Axios usando la variable limpia
const apiUrl = process.env.VUE_APP_API_URL
if (!apiUrl) {
  console.error('⚠️ VUE_APP_API_URL no está definida en .env')
} else if (apiUrl.includes('localhost')) {
  axios.defaults.baseURL = apiUrl
} else {
  axios.defaults.baseURL = apiUrl.replace(/^http:/, 'https:')
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
