<template>
  <v-container fluid>
    <!-- 1) Botón de login mientras no esté loggeado -->
    <v-row justify="center" v-if="!usuarioActual.Loggeado">
      <v-btn x-large color="success" @click="irALogin">
        Iniciar sesión
      </v-btn>
    </v-row>

    <!-- 2) Dashboard: todas las tarjetas -->
    <v-row v-else justify="start">
      <!-- Órdenes Pendientes -->
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card outlined class="card-card pending-card" @click="irAPendientes">
          <v-card-title class="amber--text text--darken-2 align-center pa-4">
            <v-icon left color="amber darken-2">mdi-alert-circle-outline</v-icon>
            <span class="subtitle-1 font-weight-bold">Órdenes Pendientes</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="display-1 font-weight-bold amber--text text--darken-2">{{ pendientesCount }}</div>
            <div class="body-2">Órdenes que aún no han sido liberadas para preparación.</div>
            <div class="caption grey--text mt-2">Actualizado: {{ lastUpdated }}</div>
          </v-card-text>
          <v-card-actions class="pa-4 pt-0">
            <v-spacer />
            <v-btn text color="amber darken-2" @click.stop="irAPendientes">Ver detalle →</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Stock Crítico -->
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card
          outlined
          class="card-card critical-card"
          :class="{'critical-alert': stockCritico > 0}"
          @click="verStockCritico"
        >
          <v-card-title class="red--text align-center pa-4">
            <v-icon left color="red">mdi-alert-decagram</v-icon>
            <span class="subtitle-1 font-weight-bold">Stock Crítico</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="display-1 font-weight-bold red--text">{{ stockCritico }}</div>
            <div class="body-2">Ítems bajo punto de reorden.</div>
            <div class="caption grey--text mt-2">Actualizado: {{ lastUpdated }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Rotación 7 días -->
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card outlined class="card-card rotation-card">
          <v-card-title class="blue--text align-center pa-4">
            <v-icon left color="blue">mdi-chart-line</v-icon>
            <span class="subtitle-1 font-weight-bold">Rotación 7d</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="display-1 font-weight-bold blue--text">{{ rotacion7d }}%</div>
            <div class="body-2">% inventario movido últimos 7 días.</div>
            <div class="caption grey--text mt-2">Actualizado: {{ lastUpdated }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Días de Inventario -->
      <v-col cols="12" sm="6" md="4" lg="3" xl="2">
        <v-card outlined class="card-card dio-card">
          <v-card-title class="purple--text align-center pa-4">
            <v-icon left color="purple">mdi-timer-sand</v-icon>
            <span class="subtitle-1 font-weight-bold">Días de Inventario</span>
          </v-card-title>
          <v-card-text class="pa-4">
            <div class="display-1 font-weight-bold purple--text">{{ dio }}</div>
            <div class="body-2">Días para agotar stock al ritmo actual.</div>
            <div class="caption grey--text mt-2">Actualizado: {{ lastUpdated }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from '../store'
import router from '../router'
import ordenesModule from '@/store/ordenesV3'
import productosV3 from '@/store/productosV3'
import posicionesV3 from '@/store/posicionesV3'
import fechas from 'vue-lsi-util/fechas'

export default {
  name: 'Home',
  data() {
    return {
      pendientesCount: 0,
      stockCritico: 0,
      rotacion7d: 0,
      dio: 0,
      lastUpdated: ''
    }
  },
  computed: {
    usuarioActual() {
      return store.state.usuarios.usuarioActual
    }
  },
  methods: {
    irALogin() {
      router.replace('/Login')
    },
    irAPendientes() {
      router.push({ name: 'OrdenesPendientes' })
    },
    async cargarPendientes() {
      const lista = await ordenesModule.getPendientes()
      this.pendientesCount = lista.length
    },
    async cargarStockCritico() {
      const empresa = this.usuarioActual.IdEmpresa
      const productos = await productosV3.getAllProductosByEmpresa(empresa)
      const DEFAULT_PUNTO_REORDEN = 10
      this.stockCritico = productos.filter(p => {
        const punto = Number(p.minimo) || DEFAULT_PUNTO_REORDEN
        const totalStock = Number(p.stock_unitario || 0)
        return totalStock <= punto
      }).length
    },
    async verStockCritico() {
      const empresa = this.usuarioActual.IdEmpresa
      const productos = await productosV3.getAllProductosByEmpresa(empresa)
      const DEFAULT_PUNTO_REORDEN = 10
      const criticos = productos
        .filter(p => Number(p.stock_unitario || 0) <= (Number(p.minimo) || DEFAULT_PUNTO_REORDEN))
      let mensaje = '<table border="0" width="100%"><tr><th>ID</th><th>Producto</th><th>Stock</th><th>Mínimo</th></tr>'
      criticos.forEach(p => {
        mensaje += `<tr><td>${p.id}</td><td>${p.descripcion}</td><td align="right">${p.stock_unitario}</td><td align="right">${p.minimo}</td></tr>`
      })
      mensaje += '</table>'
      store.dispatch('alertDialog/mostrar', { titulo: 'Stock Crítico', mensaje })
    },
    async cargarRotacion7d() {
      const empresa = this.usuarioActual.IdEmpresa
      const hoy = fechas.getHoy()
      const desde = new Date()
      desde.setDate(desde.getDate() - 7)
      const fecha7d = desde.toISOString().substr(0, 10)
      const productos = await productosV3.getAllProductosByEmpresa(empresa)
      let totalMov = 0
      for (const p of productos) {
        const movs = await posicionesV3.getMovimientosByPeriodoAndEmpresaAndArticulo(
          empresa, fecha7d, hoy, p.Id
        )
        totalMov += movs.reduce((sum, m) => sum + Math.abs(m.unidades), 0)
      }
      const stockTotal = productos.reduce((sum, p) => sum + Number(p.stock_unitario || 0), 0)
      this.rotacion7d = ((totalMov / (stockTotal || 1)) * 100).toFixed(1)
    },
    async cargarDio() {
      const empresa = this.usuarioActual.IdEmpresa
      const hoy = fechas.getHoy()
      const desde = new Date()
      desde.setDate(desde.getDate() - 7)
      const fecha7d = desde.toISOString().substr(0, 10)
      const productos = await productosV3.getAllProductosByEmpresa(empresa)
      let totalEgresos = 0
      for (const p of productos) {
        const movs = await posicionesV3.getMovimientosByPeriodoAndEmpresaAndArticulo(
          empresa, fecha7d, hoy, p.Id
        )
        totalEgresos += movs
          .filter(m => m.signo === -1)
          .reduce((sum, m) => sum + m.unidades, 0)
      }
      const stockTotal = productos.reduce((sum, p) => sum + Number(p.stock_unitario || 0), 0)
      const avgEgreso = totalEgresos / 7 || 1
      this.dio = (stockTotal / avgEgreso).toFixed(1)
    }
  },
  async created() {
    store.dispatch('actualizarTituloPrincipal', process.env.VUE_APP_Nombre)
    if (!this.usuarioActual.Loggeado) {
      router.replace('/Login')
      return
    }
    this.lastUpdated = new Date().toLocaleTimeString()
    await Promise.all([
      this.cargarPendientes(),
      this.cargarStockCritico(),
      this.cargarRotacion7d(),
      this.cargarDio()
    ])
  }
}
</script>

<style scoped>
.card-card {
  cursor: default;
  transition: box-shadow 0.2s ease;
}

/* Órdenes Pendientes: ámbar */
.pending-card {
  border: 2px solid #ffb300;
  background-color: rgba(255, 179, 0, 0.05);
  box-shadow: 0 2px 8px rgba(255, 179, 0, 0.1);
}
.pending-card:hover {
  box-shadow: 0 4px 16px rgba(255, 179, 0, 0.2);
}

/* Stock Crítico */
.critical-card {
  border: 2px solid #e53935;
  background-color: rgba(229, 57, 53, 0.05);
  box-shadow: 0 2px 8px rgba(229, 57, 53, 0.1);
}
.critical-card:hover {
  box-shadow: 0 4px 16px rgba(229, 57, 53, 0.2);
}

/* Alerta pulsante */
.critical-alert {
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 2px 8px rgba(229, 57, 53, 0.1); }
  50% { box-shadow: 0 2px 16px rgba(229, 57, 53, 0.3); }
  100% { box-shadow: 0 2px 8px rgba(229, 57, 53, 0.1); }
}

/* Rotación 7 días */
.rotation-card {
  border: 2px solid #1e88e5;
  background-color: rgba(30, 136, 229, 0.05);
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.1);
}
.rotation-card:hover {
  box-shadow: 0 4px 16px rgba(30, 136, 229, 0.2);
}

/* Días de Inventario */
.dio-card {
  border: 2px solid #8e24aa;
  background-color: rgba(142, 36, 170, 0.05);
  box-shadow: 0 2px 8px rgba(142, 36, 170, 0.1);
}
.dio-card:hover {
  box-shadow: 0 4px 16px rgba(142, 36, 170, 0.2);
}
</style>
