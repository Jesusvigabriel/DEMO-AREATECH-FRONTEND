import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

import usuarios from './usuarios'
import empresas from './empresas'
import remitos from './remitos'

import snackbar from 'vue-lsi-util/snackbar'
import loading from 'vue-lsi-util/loading'
import alertDialog from 'vue-lsi-util/alertDialog'
import sonidos from 'vue-lsi-util/sonidos'

Vue.use(Vuex)


axios.defaults.baseURL=JSON.parse(process.env.VUE_APP_API).URL
axios.defaults.auth=JSON.parse(process.env.VUE_APP_API).Credenciales

export default new Vuex.Store({
  modules: {
    usuarios,
    empresas,
    remitos,
    snackbar,
    loading,
    alertDialog,
    sonidos

  },
  state: {
    TituloPrincipal: null,
  },
  mutations: {
    actualizarTituloPrincipal(state, payload) {
      state.TituloPrincipal=payload
    },
  },
  actions: {
    actualizarTituloPrincipal(state, payload) {
      this.commit('actualizarTituloPrincipal', payload)
    }
  },
})
