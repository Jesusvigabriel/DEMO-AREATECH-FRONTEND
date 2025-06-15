<template>
  <!-- El template va envuelto en un único div raíz -->
  <div>
    <!-- ================= BARRA PRINCIPAL (DESKTOP/MOBILE) ================= -->
    <v-app-bar v-if="estaLoggeado" app color="primary" dark dense>
      <!-- Ícono hamburguesa SOLO en mobile (<960px) -->
      <v-app-bar-nav-icon
        class="d-md-none"
        @click.stop="drawer = true"
      ></v-app-bar-nav-icon>

      <!-- Logo alineado a la izquierda -->
      <router-link to="/">
        <v-toolbar-title class="logo-container">
          <v-img
            :src="nombreLogo"
            contain
            width="30"
            height="30"
            alt="AreaTech"
          />
        </v-toolbar-title>
      </router-link>

      <!-- Menús horizontales SOLO en desktop (>=960px), compactos -->
      <v-toolbar-items class="ml-4 d-none d-md-flex menu-horizontal-compacta">
        <!-- STOCK SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusStock.length > 0">
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
        <!-- ÓRDENES SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusOrdenes.length > 0">
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
        <!-- SEGUIMIENTOS SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusSeguimientos.length > 0">
          <template #activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              <v-icon left small>mdi-radar</v-icon> <!-- Puedes cambiar el ícono si lo deseas -->
              SEGUIMIENTOS
              <v-icon right small>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusSeguimientos"
              :key="menu.ruta"
              :to="menu.ruta"
              link
            >
              <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- GUÍAS SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusGuias.length > 0">
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
        <!-- INFORMES SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusInformes.length > 0">
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
        <!-- EMPRESAS SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusEmpresas.length > 0">
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
        <!-- SEGURIDAD SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusSeguridad.length > 0">
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
        <!-- TRANSPORTES SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusTransportes.length > 0">
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
        <!-- Menú lateral: acordéon, solo expande un grupo -->
        <v-list-group
          v-for="(grupo, i) in gruposMobile"
          :key="grupo.titulo"
          v-model="grupo.expanded"
          no-action
          @click="expandirSoloGrupo(i)" 
        >
          <template #activator>
            <v-list-item-content> <!-- Envuelve el título para el click -->
              <v-list-item-title>{{ grupo.titulo }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="menu in grupo.items"
            :key="menu.ruta"
            :to="menu.ruta"
            link
            @click="drawer = false"
          >
            <v-list-item-title class="pl-4">{{ menu.nombre }}</v-list-item-title> <!-- Añadido padding para indentar subitems -->
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
import roles from '@/store/roles' // Asegúrate que la ruta a tu store de roles sea correcta

export default {
  name: 'MenuPrincipal',
  data() {
    return {
      drawer: false, // Controla el Drawer (mobile)
      nombreLogo: require(`@/assets/IsoLogo_${process.env.VUE_APP_Quien_Soy}.png`),
      // Arrays de menús por tipo
      ListaDeMenusStock: [],
      ListaDeMenusOrdenes: [],
      ListaDeMenusSeguimientos: [], // Para el nuevo menú de Seguimientos
      ListaDeMenusGuias: [],
      ListaDeMenusInformes: [],
      ListaDeMenusEmpresas: [],
      ListaDeMenusSeguridad: [],
      ListaDeMenusTransportes: [],
      gruposMobile: [] // Para el Drawer mobile
    }
  },
  computed: {
    // Si está logueado (de Vuex)
    estaLoggeado() {
      return store.state.usuarios.usuarioActual.Loggeado
    },
    nombreUsuario() {
      return store.state.usuarios.usuarioActual.Nombre
    },
    usuarioId() {
      return store.state.usuarios.usuarioActual.Id
    },
    themeIcon() {
      return this.$vuetify.theme.dark
        ? 'mdi-white-balance-sunny'
        : 'mdi-moon-waning-crescent'
    },
    // Evita bugs de carga
    estaLogueadoConId() {
      return this.estaLoggeado && !!this.usuarioId
    }
  },
  watch: {
    // Si cambia el usuario (login), recarga menús
    estaLogueadoConId: {
      immediate: true,
      async handler(val) { // Convertido a async para esperar cargarYAgruparMenus
        console.log('Watcher estaLogueadoConId disparado con valor:', val);
        if (val) {
          await this.cargarYAgruparMenus(); // Esperar a que los menús se carguen
        } else {
          this.limpiarMenus();
        }
      }
    }
  },
  methods: {
    // Cambia tema oscuro/claro y lo guarda en localStorage
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('modoOscuro', this.$vuetify.theme.dark)
    },
    // Limpia todos los menús
    limpiarMenus() {
      this.ListaDeMenusStock = []
      this.ListaDeMenusOrdenes = []
      this.ListaDeMenusSeguimientos = [] // Limpiar la nueva lista
      this.ListaDeMenusGuias = []
      this.ListaDeMenusInformes = []
      this.ListaDeMenusEmpresas = []
      this.ListaDeMenusSeguridad = []
      this.ListaDeMenusTransportes = []
      this.gruposMobile = []
    },
    // Trae menús y los agrupa según el "modulo"
    async cargarYAgruparMenus() { // Convertido a async
      console.log('Entrando a cargarYAgruparMenus con usuario ID:', this.usuarioId);
      this.limpiarMenus(); // Limpia al inicio de la carga
      if (!this.estaLogueadoConId) return;

      try {
        const menusDelBackend = await roles.getAllMenuUser(this.usuarioId);
        console.log('Menús obtenidos del backend:', menusDelBackend);
        // Limpiar de nuevo aquí puede ser redundante si la primera limpieza es suficiente,
        // pero no daña y asegura un estado limpio si hay llamadas concurrentes o reintentos.
        this.limpiarMenus(); 

        menusDelBackend.forEach(m => {
          if (m.modulo.includes('stock')) this.ListaDeMenusStock.push(m);
          else if (m.modulo.includes('ordenes')) this.ListaDeMenusOrdenes.push(m);
          else if (m.modulo.includes('guias')) this.ListaDeMenusGuias.push(m);
          else if (m.modulo.includes('informes')) this.ListaDeMenusInformes.push(m);
          else if (m.modulo.includes('empresas')) this.ListaDeMenusEmpresas.push(m);
          else if (m.modulo.includes('seguridad')) this.ListaDeMenusSeguridad.push(m);
          else if (m.modulo.includes('transportes')) this.ListaDeMenusTransportes.push(m);
          // Comprobación para el módulo de seguimientos (si viene del backend para algunos roles)
          else if (m.modulo.includes('seguimientos')) this.ListaDeMenusSeguimientos.push(m);
        });
        
        // Lógica para añadir el menú "Seguimientos" si el usuario es administrador
        let esAdmin = false;
        if (!store.state.usuarios.usuarioActual.IdEmpresa) { // Condición: Sin empresa asignada
          try {
            const userRoles = await roles.getUserRolesById(this.usuarioId);
            // Condición: Rol ID es 1 (asumiendo que 1 es administrador)
            if (userRoles && userRoles.length > 0 && userRoles[0].IdRole === 1) {
              esAdmin = true;
            }
          } catch (roleError) {
            console.error("Error al obtener roles de usuario para menú:", roleError);
            // Decidir cómo manejar este error. Si falla, no se marcará como admin.
          }
        }

        // Si es administrador y el menú de seguimientos aún no existe (no vino del backend para este admin)
        if (esAdmin) {
          const seguimientosMenuExists = this.ListaDeMenusSeguimientos.some(menu => menu.ruta === '/seguimientos');
          if (!seguimientosMenuExists) {
            this.ListaDeMenusSeguimientos.push({
              nombre: "Panel de Seguimientos", // Nombre que se mostrará en el submenú
              ruta: "/seguimientos",           // Ruta definida en Vue Router
              modulo: "seguimientos"           // Identificador del módulo
            });
            console.log('Se añadió "Panel de Seguimientos" al menú');
          } else {
            console.log('El menú "Panel de Seguimientos" ya existía');
          }
        }

        const todosGrupos = [
          { titulo: "STOCK", items: this.ListaDeMenusStock },
          { titulo: "ÓRDENES", items: this.ListaDeMenusOrdenes },
          { titulo: "SEGUIMIENTOS", items: this.ListaDeMenusSeguimientos }, // Añadido para el menú móvil
          { titulo: "GUÍAS", items: this.ListaDeMenusGuias },
          { titulo: "INFORMES", items: this.ListaDeMenusInformes },
          { titulo: "EMPRESAS", items: this.ListaDeMenusEmpresas },
          { titulo: "SEGURIDAD", items: this.ListaDeMenusSeguridad },
          { titulo: "TRANSPORTES", items: this.ListaDeMenusTransportes }
        ];

        this.gruposMobile = todosGrupos
          .filter(g => g.items.length > 0) // Solo grupos con items
          .map(g => ({ ...g, expanded: false })); // Inicializar como no expandidos

      } catch (error) {
        console.error("Error al cargar y agrupar los menús:", error);
        console.log('Error capturado en cargarYAgruparMenus:', error);
        this.limpiarMenus(); // En caso de error, limpiar menús para evitar estado inconsistente
      }
    },
    // Expande solo un grupo a la vez en mobile
    expandirSoloGrupo(indexClickeado) {
      this.gruposMobile.forEach((grupo, index) => {
        // Si es el grupo clickeado, invierte su estado 'expanded'
        // Si no es el grupo clickeado, ciérralo (setea 'expanded' a false)
        if (index === indexClickeado) {
          grupo.expanded = !grupo.expanded;
        } else {
          grupo.expanded = false;
        }
      });
    }
  },
  mounted() {
    // Cuando se monta, recupera modo oscuro guardado
    const pref = localStorage.getItem('modoOscuro');
    if (pref !== null) {
      this.$vuetify.theme.dark = pref === 'true';
    }
    // Cargar menús inmediatamente por si la página se recarga
    this.cargarYAgruparMenus();
    // La carga inicial también la maneja el watcher `estaLogueadoConId` como salvaguarda
  }
}
</script>

<style scoped>
.logo-container {
  cursor: pointer;
  margin-left: 0 !important;
  padding-left: 0 !important;
}
.user-btn {
  text-transform: none;
  font-weight: 500;
}

/* Barra horizontal súper compacta: nunca hace overflow, los botones se achican */
.menu-horizontal-compacta {
  display: flex !important;
  flex-wrap: wrap !important; /* permite que los elementos bajen a otra línea */
  overflow-x: auto !important; /* añade scroll si aún así no entran */
  gap: 1px !important;
  align-items: center;
  max-width: 100%;
}
.menu-horizontal-compacta > * {
  flex-shrink: 0 !important; /* evita que los botones se encojan demasiado */
}

/* Botones más chicos */
.v-btn {
  font-size: 12px !important;
  padding: 0 7px !important;
  margin: 0 !important;
  min-width: 0 !important;
  min-height: 30px !important;
  height: 30px !important;
  line-height: 30px !important;
  border-radius: 7px !important;
}

/* Fuente y compactado en los dropdowns */
.v-toolbar__content {
  font-size: 13px !important;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0;
  line-height: 1.1;
  padding-left: 0 !important;
}
.v-list-item-title {
  font-size: 13px !important;
  padding: 0 2px !important;
}

/* Menú horizontal solo visible en desktop >= 960px */
.d-none.d-md-flex {
  display: none !important;
}
@media (min-width: 960px) {
  .d-none.d-md-flex {
    display: flex !important;
  }
}

/* ==== SWITCH SOL/LUNA ANIMADO ==== */
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