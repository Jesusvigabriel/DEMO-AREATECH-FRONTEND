<template>
  <v-app>
    <!--
    <PreventUnload :when="huboCambios"></PreventUnload>
    -->
    <v-main>
      <LSIMensajes />
      <MenuPrincipal :tituloPrincipal="TituloMenuPrincipal" class="py-0"></MenuPrincipal>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// import PreventUnload from 'vue-prevent-unload';
import MenuPrincipal from './components/MenuPrincipal'
import LSIMensajes from 'vue-lsi-util'
import { mapState } from 'vuex'
import store from './store'
import router from './router'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    MenuPrincipal,
    LSIMensajes  // PreventUnload
  },
  methods: {
    alertDialogOcultar(cualBotonApretado) {
      store.dispatch('alertDialog/ocultar', cualBotonApretado)
    }
  },
  computed: {
    ...mapState(['TituloPrincipal']),
    textoAMostrar() {
      return store.state.snackbar.textoAMostrar
    },
    cartelAMostrar() {
      return store.state.loading.cartelAMostrar
    },
    TituloMenuPrincipal() {
      return this.TituloPrincipal
    },
    alertDialog() {
      return store.state.alertDialog.textoAMostrar
    }
  },
  data() {
    return {
      huboCambios: true
    }
  },
  created() {
    const DatosAPI = JSON.parse(process.env.VUE_APP_API)
    store.dispatch('usuarios/actualizarDatosAPI', DatosAPI)

    // axios.defaults.baseURL = store.state.usuarios.API.URL
    axios.defaults.baseURL = "https://apiv2.area54sa.com.ar:8123/apiv2/"
    // axios.defaults.baseURL = "http://127.0.0.1:8080/apiv2/"

    if (typeof sessionStorage.usuarioLoggeado !== 'undefined') {
      store.dispatch('usuarios/actualizar', {
        Loggeado: true,
        Nombre: sessionStorage.usuarioNombre,
        Id: sessionStorage.usuarioId,
        IdEmpresa: sessionStorage.idEmpresa
      })
      router.replace('/home')
    }
  },
  watch: {
    '$route' (to) {
      document.title = to.meta.tituloPagina || process.env.VUE_APP_Nombre
    }
  }
}
</script>
