<template>
  <!-- Barra de navegación principal: sólo se muestra si el usuario está autenticado -->
  <v-app-bar v-if="estaLoggeado" app color="primary" dark dense>
    <!-- Logo (solo icono, texto reducido en el alt) -->
    <v-toolbar-title class="logo-container">
      <v-img
        :src="nombreLogo"
        contain
        width="30"
        height="30"
        alt="AreaTech"
      />
    </v-toolbar-title>

    <!-- Menús horizontales -->
    <v-toolbar-items class="ml-4">
      <!-- Home -->
      <v-btn text to="/">
        <v-icon left small>mdi-home-outline</v-icon>
        HOME
      </v-btn>

      <!-- Stock -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left small>mdi-warehouse</v-icon>
            STOCK
            <v-icon right small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="menu in ListaDeMenusStock"
            :key="menu.ruta"
            :to="menu.ruta"
            link
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Órdenes -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left small>mdi-checkbox-marked-outline</v-icon>
            ÓRDENES
            <v-icon right small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="menu in ListaDeMenusOrdenes"
            :key="menu.ruta"
            :to="menu.ruta"
            link
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Guías -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left small>mdi-folder-outline</v-icon>
            GUÍAS
            <v-icon right small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="menu in ListaDeMenusGuias"
            :key="menu.ruta"
            :to="menu.ruta"
            link
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Informes -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left small>mdi-chart-bar</v-icon>
            INFORMES
            <v-icon right small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="menu in ListaDeMenusInformes"
            :key="menu.ruta"
            :to="menu.ruta"
            link
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Empresas -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left small>mdi-office-building</v-icon>
            EMPRESAS
            <v-icon right small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="menu in ListaDeMenusEmpresas"
            :key="menu.ruta"
            :to="menu.ruta"
            link
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Seguridad -->
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left small>mdi-shield-outline</v-icon>
            SEGURIDAD
            <v-icon right small>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="menu in ListaDeMenusSeguridad"
            :key="menu.ruta"
            :to="menu.ruta"
            link
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>

    <v-spacer />

    <!-- Botón de cambio de tema: sol <-> luna -->
    <v-btn icon @click="toggleTheme" class="mx-2">
      <v-icon>{{ themeIcon }}</v-icon>
    </v-btn>

    <!-- Menú de usuario con opción de Cerrar sesión -->
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on" class="user-btn">
          <v-icon left small>mdi-account</v-icon>
          {{ nombreUsuario }}
          <v-icon right small>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/Logout" link>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import store from '@/store'
import roles from '@/store/roles'

export default {
  name: 'MenuPrincipal',
  data() {
    return {
      // Logo dinámico según entorno
      nombreLogo: require(`@/assets/IsoLogo_${process.env.VUE_APP_Quien_Soy}.png`),

      // Arrays donde se almacenarán los menús por categoría
      ListaDeMenusStock: [],
      ListaDeMenusOrdenes: [],
      ListaDeMenusGuias: [],
      ListaDeMenusInformes: [],
      ListaDeMenusEmpresas: [],
      ListaDeMenusSeguridad: []
    }
  },
  computed: {
    // Si el usuario está logueado o no
    estaLoggeado() {
      return store.state.usuarios.usuarioActual.Loggeado
    },
    // Nombre del usuario actual
    nombreUsuario() {
      return store.state.usuarios.usuarioActual.Nombre
    },
    // Icono que se muestra en el toggle de tema
    themeIcon() {
      // Si estamos en dark, muestro sol para volver a claro; al revés, muestro luna
      return this.$vuetify.theme.dark
        ? 'mdi-white-balance-sunny'
        : 'mdi-moon-waning-crescent'
    }
  },
  methods: {
    // Alterna el tema y guarda la preferencia
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('modoOscuro', this.$vuetify.theme.dark)
    },

    // Carga los menús del usuario y los agrupa por módulo
    fetchMenus() {
      if (!this.estaLoggeado) return
      const userId = store.state.usuarios.usuarioActual.Id
      roles.getAllMenuUser(userId)
        .then(menus => {
          menus.forEach(m => {
            if (m.modulo.includes('stock')) this.ListaDeMenusStock.push(m)
            else if (m.modulo.includes('ordenes')) this.ListaDeMenusOrdenes.push(m)
            else if (m.modulo.includes('guias')) this.ListaDeMenusGuias.push(m)
            else if (m.modulo.includes('informes')) this.ListaDeMenusInformes.push(m)
            else if (m.modulo.includes('empresas')) this.ListaDeMenusEmpresas.push(m)
            else if (m.modulo.includes('seguridad')) this.ListaDeMenusSeguridad.push(m)
          })
        })
        .catch(() => {
          // En caso de error, reseteo los arrays
          this.ListaDeMenusStock = []
          this.ListaDeMenusOrdenes = []
          this.ListaDeMenusGuias = []
          this.ListaDeMenusInformes = []
          this.ListaDeMenusEmpresas = []
          this.ListaDeMenusSeguridad = []
        })
    }
  },
  mounted() {
    // Al montar, restauro la preferencia de tema
    const pref = localStorage.getItem('modoOscuro')
    if (pref !== null) {
      this.$vuetify.theme.dark = pref === 'true'
    }
    // Y cargo los menús
    this.fetchMenus()
  }
}
</script>

<style scoped>
/* Contenedor del logo: añade un cursor pointer si quieres enlazarlo a Home */
.logo-container {
  cursor: pointer;
}

/* Botón del nombre de usuario, para evitar mayúsculas forzadas */
.user-btn {
  text-transform: none;
  font-weight: 500;
}
</style>
