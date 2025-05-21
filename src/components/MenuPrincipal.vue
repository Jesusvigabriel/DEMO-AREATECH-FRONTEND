<template>
  <!-- Todo el template va envuelto en un único div por requerimiento de Vue -->
  <div>
    <!-- ================= BARRA PRINCIPAL (DESKTOP/MOBILE) ================= -->
    <v-app-bar v-if="estaLoggeado" app color="primary" dark dense>
      <!-- Ícono hamburguesa SOLO en mobile (d-md-none) -->
      <v-app-bar-nav-icon
        class="d-md-none"
        @click.stop="drawer = true"
      ></v-app-bar-nav-icon>

      <!-- Logo a la izquierda -->
      <v-toolbar-title class="logo-container">
        <v-img
          :src="nombreLogo"
          contain
          width="30"
          height="30"
          alt="AreaTech"
        />
      </v-toolbar-title>

      <!-- Menús horizontales: solo aparecen en desktop (d-none d-md-flex) -->
      <v-toolbar-items class="ml-4 d-none d-md-flex">
        <!-- HOME -->
        <v-btn text to="/">
          <v-icon left small>mdi-home-outline</v-icon>
          HOME
        </v-btn>
        <!-- STOCK -->
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
        <!-- ÓRDENES -->
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
        <!-- GUÍAS -->
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
        <!-- INFORMES -->
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
        <!-- EMPRESAS -->
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
        <!-- SEGURIDAD -->
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
        <!-- TRANSPORTES (AGREGADO POR MI PARA TENERLO COMO EN EL VIEJO MENU) -->
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              <v-icon left small>mdi-truck</v-icon>
              TRANSPORTES
              <v-icon right small>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusTransportes"
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

      <!-- ================= SWITCH SOL/LUNA ANIMADO =================== -->
      <div
        class="theme-switch-wide"
        :class="{ 'theme-switch--dark': $vuetify.theme.dark }"
        @click="toggleTheme"
        tabindex="0"
        aria-label="Cambiar tema"
      >
        <div class="theme-switch__circle">
          <!-- Sol -->
          <svg class="theme-switch__icon sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
          <!-- Luna -->
          <svg class="theme-switch__icon moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      <!-- =============================================================== -->

      <!-- Menú usuario con logout -->
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

    <!-- =============== DRAWER RESPONSIVE: MOBILE ONLY =============== -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
      class="d-md-none"
      v-if="estaLoggeado"
    >
      <v-list>
        <!-- Encabezado drawer: logo + usuario -->
        <v-list-item>
          <v-img :src="nombreLogo" width="40" class="mr-2"></v-img>
          <v-list-item-title>{{ nombreUsuario }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <!-- Menú lateral: secciones igual a la barra principal -->
        <v-list-group value="true" no-action>
          <template #activator>
            <v-list-item-title>STOCK</v-list-item-title>
          </template>
          <v-list-item
            v-for="menu in ListaDeMenusStock"
            :key="menu.ruta"
            :to="menu.ruta"
            link
            @click="drawer = false"
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="true" no-action>
          <template #activator>
            <v-list-item-title>ÓRDENES</v-list-item-title>
          </template>
          <v-list-item
            v-for="menu in ListaDeMenusOrdenes"
            :key="menu.ruta"
            :to="menu.ruta"
            link
            @click="drawer = false"
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="true" no-action>
          <template #activator>
            <v-list-item-title>GUÍAS</v-list-item-title>
          </template>
          <v-list-item
            v-for="menu in ListaDeMenusGuias"
            :key="menu.ruta"
            :to="menu.ruta"
            link
            @click="drawer = false"
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="true" no-action>
          <template #activator>
            <v-list-item-title>INFORMES</v-list-item-title>
          </template>
          <v-list-item
            v-for="menu in ListaDeMenusInformes"
            :key="menu.ruta"
            :to="menu.ruta"
            link
            @click="drawer = false"
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="true" no-action>
          <template #activator>
            <v-list-item-title>EMPRESAS</v-list-item-title>
          </template>
          <v-list-item
            v-for="menu in ListaDeMenusEmpresas"
            :key="menu.ruta"
            :to="menu.ruta"
            link
            @click="drawer = false"
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group value="true" no-action>
          <template #activator>
            <v-list-item-title>SEGURIDAD</v-list-item-title>
          </template>
          <v-list-item
            v-for="menu in ListaDeMenusSeguridad"
            :key="menu.ruta"
            :to="menu.ruta"
            link
            @click="drawer = false"
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <!-- TRANSPORTES (MOBILE) - AGREGADO POR MI -->
        <v-list-group value="true" no-action>
          <template #activator>
            <v-list-item-title>TRANSPORTES</v-list-item-title>
          </template>
          <v-list-item
            v-for="menu in ListaDeMenusTransportes"
            :key="menu.ruta"
            :to="menu.ruta"
            link
            @click="drawer = false"
          >
            <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-divider></v-divider>
        <!-- Logout en el drawer -->
        <v-list-item to="/Logout" link @click="drawer=false">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
// Importa el store global de Vuex y el helper de roles
import store from '@/store'
import roles from '@/store/roles'

export default {
  name: 'MenuPrincipal',
  data() {
    return {
      drawer: false, // <-- Controla la visibilidad del Drawer (mobile)
      nombreLogo: require(`@/assets/IsoLogo_${process.env.VUE_APP_Quien_Soy}.png`),
      // Arrays donde se agrupan los menús por tipo
      ListaDeMenusStock: [],
      ListaDeMenusOrdenes: [],
      ListaDeMenusGuias: [],
      ListaDeMenusInformes: [],
      ListaDeMenusEmpresas: [],
      ListaDeMenusSeguridad: [],
      ListaDeMenusTransportes: [] // <--- NUEVO ARRAY PARA TRANSPORTES (POR MI)
    }
  },
  computed: {
    // Si el usuario está logueado (de Vuex)
    estaLoggeado() {
      return store.state.usuarios.usuarioActual.Loggeado
    },
    nombreUsuario() {
      return store.state.usuarios.usuarioActual.Nombre
    },
    usuarioId() {
      return store.state.usuarios.usuarioActual.Id
    },
    // Ícono de modo oscuro/tema claro
    themeIcon() {
      return this.$vuetify.theme.dark
        ? 'mdi-white-balance-sunny'
        : 'mdi-moon-waning-crescent'
    },
    // Combina logueo e ID para evitar bugs de carga
    estaLogueadoConId() {
      return this.estaLoggeado && !!this.usuarioId
    }
  },
  watch: {
    // Cuando cambia el usuario (logueo), recarga menús (evita duplicados)
    estaLogueadoConId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.cargarYAgruparMenus()
        } else {
          this.limpiarMenus()
        }
      }
    }
  },
  methods: {
    // Cambia tema oscuro/claro y lo persiste en localStorage
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('modoOscuro', this.$vuetify.theme.dark)
    },
    // Limpia todos los arrays de menús antes de recargar
    limpiarMenus() {
      this.ListaDeMenusStock = []
      this.ListaDeMenusOrdenes = []
      this.ListaDeMenusGuias = []
      this.ListaDeMenusInformes = []
      this.ListaDeMenusEmpresas = []
      this.ListaDeMenusSeguridad = []
      this.ListaDeMenusTransportes = [] // <--- LIMPIO TRANSPORTES TAMBIÉN (POR MI)
    },
    // Trae menús del backend y los agrupa según "modulo"
    cargarYAgruparMenus() {
      this.limpiarMenus() // Evita duplicados
      if (!this.estaLogueadoConId) return

      roles.getAllMenuUser(this.usuarioId)
        .then(menus => {
          console.log("Recibí los siguientes menús del backend:", menus)
          this.limpiarMenus()
          menus.forEach(m => {
            if (m.modulo.includes('stock')) this.ListaDeMenusStock.push(m)
            else if (m.modulo.includes('ordenes')) this.ListaDeMenusOrdenes.push(m)
            else if (m.modulo.includes('guias')) this.ListaDeMenusGuias.push(m)
            else if (m.modulo.includes('informes')) this.ListaDeMenusInformes.push(m)
            else if (m.modulo.includes('empresas')) this.ListaDeMenusEmpresas.push(m)
            else if (m.modulo.includes('seguridad')) this.ListaDeMenusSeguridad.push(m)
            else if (m.modulo.includes('transportes')) this.ListaDeMenusTransportes.push(m) // <--- AGRUPA TRANSPORTES (POR MI)
          })
        })
        .catch(() => {
          this.limpiarMenus()
        })
    }
  },
  mounted() {
    // Cuando se monta, recupera modo oscuro de localStorage
    const pref = localStorage.getItem('modoOscuro')
    if (pref !== null) {
      this.$vuetify.theme.dark = pref === 'true'
    }
    // Los menús los maneja el watcher, no es necesario llamar a cargarYAgruparMenus() acá
  }
}
</script>

<style scoped>
.logo-container {
  cursor: pointer;
}
.user-btn {
  text-transform: none;
  font-weight: 500;
}
/* Menús de barra y dropdowns con fuente más chica y compacta */
.v-toolbar__content, .v-toolbar-items, .v-btn, .v-list-item-title {
  font-size: 13px !important;
  font-family: "Segoe UI", Arial, sans-serif;
  letter-spacing: 0;
  line-height: 1.1;
}
/* Mejora la experiencia mobile si hay overflow de menús horizontales */
.v-toolbar__content {
  overflow-x: auto !important;
}

/* ==== SWITCH SOL/LUNA ANIMADO (más ancho y suave) ==== */
.theme-switch-wide {
  width: 70px;
  height: 38px;
  margin: 0 6px;
  border-radius: 99px;
  background: #f3f3f3;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06) inset;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  transition: background 0.3s, box-shadow 0.3s;
  outline: none;
  vertical-align: middle;
}
.theme-switch-wide:focus {
  box-shadow: 0 0 0 3px #ffe06650;
}
.theme-switch__circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: white;
  box-shadow: 4px 4px 14px rgba(0,0,0,0.05), -4px -4px 10px rgba(0,0,0,0.05) inset;
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: left 0.45s cubic-bezier(0.65,0,0.35,1), background 0.3s;
}
.theme-switch--dark .theme-switch__circle {
  left: 32px;  /* Empuja la "luna" a la derecha */
  background: #23232a;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.13), -2px -2px 18px rgba(0,0,0,0.16) inset;
}
.theme-switch__icon {
  width: 22px;
  height: 22px;
  position: absolute;
  left: 6px;
  top: 6px;
  transition: margin 0.45s cubic-bezier(0.65,0,0.35,1), opacity 0.5s;
  opacity: 1;
}
.theme-switch__icon.sun {
  color: #FFD600;
  margin-top: 0%;
  opacity: 1;
}
.theme-switch__icon.moon {
  color: #B0CBF9;
  margin-top: -150%;
  opacity: 0;
}
.theme-switch--dark .theme-switch__icon.sun {
  margin-top: 150%;
  opacity: 0;
}
.theme-switch--dark .theme-switch__icon.moon {
  margin-top: 0%;
  opacity: 1;
}
</style>
