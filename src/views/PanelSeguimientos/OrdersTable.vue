<template>
  <div>
    <v-toolbar flat dense color="grey lighten-4">
      <v-toolbar-title class="subtitle-1 font-weight-medium text--primary">
        Seguimiento de Órdenes
      </v-toolbar-title>
    </v-toolbar>

    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate size="40" color="primary" />
      <div class="mt-2">
        <span class="body-2 text--secondary">Cargando órdenes...</span>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-10">
      <v-icon size="36" color="error">mdi-alert-circle-outline</v-icon>
      <div class="mt-2">
        <span class="body-2 text--error">{{ error }}</span>
      </div>
    </div>

    <div v-else-if="idEmpresa <= 0" class="text-center py-10">
      <v-icon size="36" color="grey">mdi-office-building</v-icon>
      <div class="mt-2">
        <span class="body-2 text--secondary">
          Seleccione una empresa para ver sus órdenes.
        </span>
      </div>
    </div>

    <div v-else>
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col cols="12" md="6">
          <v-text-field
            :value="textoBusqueda"
            @input="$emit('update:textoBusqueda', $event)"
            append-icon="mdi-magnify"
            label="Buscar órdenes..."
            dense
            outlined
            clearable
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            :value="itemsPerPage"
            @change="$emit('update:itemsPerPage', $event)"
            :items="itemsPerPageOptions"
            label="Filas por página"
            dense
            outlined
            hide-details
          />
        </v-col>
      </v-row>

      <v-data-table
        :headers="cabeceras"
        :items="items"
        :search="textoBusqueda"
        item-key="IdOrden"
        :items-per-page="itemsPerPage"
        class="elevation-1"
        dense
        hide-default-footer
        header-class="blue-header"
      >
        <template v-slot:item.numero="{ item }">
          <span class="body-2 font-weight-bold">{{ item.numero }}</span>
        </template>
        <template v-slot:item.nombreEmpresa="{ item }">
          <span class="body-2">{{ item.nombre }}</span>
        </template>
        <template v-slot:item.nombreCliente="{ item }">
          <span class="body-2">{{ item.nombreDestino }}</span>
        </template>
        <template v-slot:item.fechaCreacion="{ item }">
          <span class="body-2">{{ item.Creada }}</span>
        </template>
        <template v-slot:item.estadoActual="{ item }">
          <v-chip
            :color="statusChipColorFn(item.Estado)"
            :text-color="statusChipTextColorFn(item.Estado)"
            small
          >
            {{ item.Estado }}
          </v-chip>
        </template>
        <template v-slot:item.acciones="{ item }">
          <v-btn
            icon
            small
            @click="$emit('open-modal', 'orden', item.IdOrden)"
            :aria-label="`Ver detalles orden ${item.numero}`"
          >
            <v-icon color="primary">mdi-eye-outline</v-icon>
          </v-btn>
          <v-chip
            v-if="item.Estado === 'A distribución' && item.IdGuia > 0"
            small
            class="ml-2"
            color="green lighten-4"
            text-color="green darken-4"
            @click="$emit('ver-guia', item)"
            title="Haz clic para ver el seguimiento de la guía asociada"
            label
          >
            Seguimiento aquí
            <v-icon right small>mdi-truck-check-outline</v-icon>
          </v-chip>
        </template>
        <template v-slot:footer.prepend>
          <v-row align="center" justify="space-between" class="px-4">
            <v-col cols="12" md="6">
              <v-pagination
                :value="page"
                @input="$emit('update:page', $event)"
                :length="pageCount"
                prev-icon="mdi-chevron-left"
                next-icon="mdi-chevron-right"
                circle
                dense
              />
            </v-col>
            <v-col cols="12" md="6" class="text-right">
              <span class="caption text--secondary">
                Mostrando {{ paginationInfo }}
              </span>
            </v-col>
          </v-row>
        </template>
        <template v-slot:no-data>
          <v-alert type="warning" dense text>
            No se encontraron órdenes para los filtros seleccionados.
          </v-alert>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrdersTable',
  props: {
    loading: Boolean,
    error: String,
    idEmpresa: Number,
    textoBusqueda: String,
    itemsPerPage: Number,
    itemsPerPageOptions: Array,
    cabeceras: Array,
    items: Array, // Este array DEBE contener los datos ya formateados y listos.
    page: Number,
    pageCount: Number,
    paginationInfo: String,
    statusChipColorFn: Function,
    statusChipTextColorFn: Function
  },
  watch: {
    // Agregamos watchers para ver qué props está recibiendo y si cambian
    idEmpresa(newVal, oldVal) {
      console.log(`[OrdersTable] idEmpresa cambió de ${oldVal} a ${newVal}`);
    },
    loading(newVal, oldVal) {
      console.log(`[OrdersTable] loading cambió de ${oldVal} a ${newVal}`);
    },
    error(newVal, oldVal) {
      console.log(`[OrdersTable] error cambió de ${oldVal} a ${newVal}`);
    },
    items: {
      handler(newVal, oldVal) {
        console.log(`[OrdersTable] items actualizados. Cantidad: ${newVal ? newVal.length : 0}`);
        if (newVal && newVal.length > 0) {
          console.log('[OrdersTable] Primer item recibido:', newVal[0]);
        }
      },
      deep: true, // Para observar cambios dentro del array de items
      immediate: true // Para que se ejecute al inicio
    },
    page(newVal) {
      console.log(`[OrdersTable] Página actual: ${newVal}`);
    },
    itemsPerPage(newVal) {
      console.log(`[OrdersTable] Ítems por página: ${newVal}`);
    }
  },
  created() {
    console.log('[OrdersTable] Componente OrdersTable creado.');
    // Los valores iniciales de las props se pueden ver aquí, pero los watchers son más útiles para cambios.
  }
}
</script>

<style scoped>
.blue-header th {
  background-color: #e3f2fd;
  color: #1a237e;
  font-weight: 600;
}
</style>