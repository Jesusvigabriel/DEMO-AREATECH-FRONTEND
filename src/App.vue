<template>
  <v-app>
    <v-main>
      <!-- Sólo montamos el snack cuando hay algo que mostrar -->
      <LSIMensajes
        v-if="textoAMostrar"
        :mensaje="textoAMostrar.texto"
        :color="textoAMostrar.color"
        :timeout="textoAMostrar.timeout"
      />

      <MenuPrincipal :tituloPrincipal="TituloMenuPrincipal" class="py-0" />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import MenuPrincipal from './components/MenuPrincipal'
import LSIMensajes from 'vue-lsi-util'
import { mapState } from 'vuex'
import store from './store'
import router from './router'

export default {
  name: 'App',
  components: {
    MenuPrincipal,
    LSIMensajes
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
  methods: {
    alertDialogOcultar(cualBotonApretado) {
      store.dispatch('alertDialog/ocultar', cualBotonApretado)
    }
  },
  data() {
    return {
      huboCambios: true
    }
  },
  created() {
    // Cargamos en Vuex los datos de configuración legacy
    const DatosAPI = JSON.parse(process.env.VUE_APP_API)
    store.dispatch('usuarios/actualizarDatosAPI', DatosAPI)

    // Si ya hay usuario loggeado en sessionStorage, redirigimos a /home
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
    '$route'(to) {
      document.title = to.meta.tituloPagina || process.env.VUE_APP_Nombre
    }
  }
}
</script>

<style scoped>
/* aquí tus estilos scoped para App.vue */
</style>
