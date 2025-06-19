<template>
  <v-container>
    <!-- KPI Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 text-center" :style="{backgroundColor: 'var(--primary)', color: '#fff'}">
          <div>Total registros</div>
          <div class="text-h5 font-weight-bold">{{ totalRegistros }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 text-center" :style="{backgroundColor: 'var(--vaciar-verde)', color: '#000'}">
          <div>Última acción</div>
          <div class="text-h5 font-weight-bold">{{ ultimaAccion }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mt-4">
      <v-col cols="12" sm="3">
        <v-select v-model="entidadSeleccionada" :items="entidades" label="Entidad"></v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field type="date" v-model="fechaDesde" label="Desde"></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-text-field type="date" v-model="fechaHasta" label="Hasta"></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" class="d-flex align-end">
        <v-btn color="primary" @click="filtrar">Filtrar</v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de resultados -->
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="filtrados"
          item-key="id"
          @click:row="verHistorial"
        ></v-data-table>
      </v-col>
    </v-row>

    <!-- Historial -->
    <v-row v-if="historial.length">
      <v-col cols="12">
        <v-timeline>
          <v-timeline-item
            v-for="(h, idx) in historial"
            :key="idx"
            :color="'var(--accent)'"
            :icon="h.icon || 'mdi-history'"
          >
            <div>{{ h.fecha }} - {{ h.accion }}</div>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Auditoria',
  data() {
    return {
      registros: [],
      entidades: ['Usuarios', 'Roles', 'Productos'],
      entidadSeleccionada: null,
      fechaDesde: null,
      fechaHasta: null,
      historial: [],
      headers: [
        { text: 'Entidad', value: 'entidad' },
        { text: 'Acción', value: 'accion' },
        { text: 'Usuario', value: 'usuario' },
        { text: 'Fecha', value: 'fecha' }
      ]
    }
  },
  computed: {
    totalRegistros() {
      return this.registros.length
    },
    ultimaAccion() {
      if (!this.registros.length) return '-'
      return this.registros[this.registros.length - 1].accion
    },
    filtrados() {
      return this.registros.filter(r => {
        let ok = true
        if (this.entidadSeleccionada) ok = ok && r.entidad === this.entidadSeleccionada
        if (this.fechaDesde) ok = ok && r.fecha >= this.fechaDesde
        if (this.fechaHasta) ok = ok && r.fecha <= this.fechaHasta
        return ok
      })
    }
  },
  methods: {
    filtrar() {
      // Computed already updates
    },
    verHistorial(item) {
      this.historial = item.historial || []
    },
    cargarDatos() {
      this.registros = [
        {
          id: 1,
          entidad: 'Usuarios',
          accion: 'CREAR',
          usuario: 'admin',
          fecha: '2024-05-01',
          historial: [
            { fecha: '2024-05-01', accion: 'CREAR', icon: 'mdi-account-plus' },
            { fecha: '2024-05-02', accion: 'EDITAR', icon: 'mdi-account-edit' }
          ]
        },
        {
          id: 2,
          entidad: 'Productos',
          accion: 'ELIMINAR',
          usuario: 'editor',
          fecha: '2024-05-03',
          historial: [
            { fecha: '2024-04-20', accion: 'CREAR', icon: 'mdi-plus' },
            { fecha: '2024-05-03', accion: 'ELIMINAR', icon: 'mdi-delete' }
          ]
        }
      ]
    }
  },
  mounted() {
    this.cargarDatos()
  }
}
</script>
</style>

