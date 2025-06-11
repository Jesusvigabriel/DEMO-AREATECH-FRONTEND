<template>
  <div>
    <v-toolbar flat dense color="primary" dark>
      <v-toolbar-title class="subtitle-1 font-weight-medium">
        Seguimiento de Guías
      </v-toolbar-title>
    </v-toolbar>

    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate size="40" color="primary" />
      <div class="mt-2">
        <span class="body-2 text--secondary">Cargando guías...</span>
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
          Seleccione una empresa para ver sus guías.
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
            label="Buscar guías..."
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
        item-key="Id"
        :items-per-page="itemsPerPage"
        class="elevation-1"
        dense
        hide-default-footer
        header-class="blue-header"
      >
        <template v-slot:item.Comprobante="{ item }">
          <span class="body-2 font-weight-bold">{{ item.Comprobante }}</span>
        </template>
        <template v-slot:item.NombreCliente="{ item }">
          <span class="body-2">{{ item.NombreCliente }}</span>
        </template>
        <template v-slot:item.NombreDestino="{ item }">
          <span class="body-2">{{ item.NombreDestino }}</span>
        </template>
        <template v-slot:item.Remitos="{ item }">
          <span class="body-2">{{ item.Remitos }}</span>
        </template>
        <template v-slot:item.FechaOriginal="{ item }">
          <span class="body-2">{{ item.FechaOriginal }}</span>
        </template>
        <template v-slot:item.Estado="{ item }">
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
            @click="$emit('open-modal', 'guia', item)"
            :aria-label="`Ver detalles guía ${item.Comprobante}`"
          >
            <v-icon color="primary">mdi-eye-outline</v-icon>
          </v-btn>
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
            No se encontraron guías para los filtros seleccionados.
          </v-alert>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuidesTable',
  props: {
    loading: Boolean,
    error: String,
    idEmpresa: Number,
    textoBusqueda: String,
    itemsPerPage: Number,
    itemsPerPageOptions: Array,
    cabeceras: Array,
    items: Array,
    page: Number,
    pageCount: Number,
    paginationInfo: String,
    statusChipColorFn: Function,
    statusChipTextColorFn: Function
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
