<template>
  <v-dialog :value="show" scrollable max-width="650px" @input="$emit('update:show', $event)">
    <v-card>
      <v-card-title class="justify-space-between">
        <span class="text-h6">
          Detalle de {{ modalType === 'orden' ? 'Orden' : 'Guía' }}: {{ modalData?.Numero || modalData?.Comprobante || '' }}
        </span>
        <v-btn icon @click="$emit('close')" aria-label="Cerrar detalle">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div v-if="loading && !modalData" class="text-center py-6">
          <v-progress-circular indeterminate size="36" color="primary" />
          <div class="mt-2">
            <span class="body-2 text--secondary">Cargando detalles...</span>
          </div>
        </div>

        <div v-else-if="error && !modalData" class="text-center py-6">
          <v-icon size="36" color="error">mdi-alert-circle-outline</v-icon>
          <div class="mt-2">
            <span class="body-2 text--error">{{ error }}</span>
          </div>
        </div>

        <div v-else-if="modalData">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      N° {{ modalType === 'orden' ? 'Orden' : 'Guía' }}:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.Numero || modalData.Comprobante }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Empresa:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.Empresa?.RazonSocial || modalData.NombreCliente || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Cliente/Destino:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.Destino?.Nombre || modalData.NombreDestino || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="modalType === 'orden'">
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Email Cliente:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.EmailDestinatario || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-else>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Remito:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalData.Remitos || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Fecha Creación:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ modalType === 'orden' ? (modalData.FechaCreacion ? new Date(modalData.FechaCreacion).toLocaleDateString() : 'N/A') : modalData.FechaOriginal || 'N/A' }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="modalType === 'orden'">
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Preparado:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <span v-if="modalData.FechaPreparado">{{ new Date(modalData.FechaPreparado).toLocaleDateString() }}</span>
                      <span v-else>N/A</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="modalType === 'orden'">
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Fecha Distribución/Retiro:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <span v-if="modalData.Fecha">{{ new Date(modalData.Fecha).toLocaleDateString() }}</span>
                      <span v-else>N/A</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="subtitle-2 font-weight-medium">
                      Estado Actual:
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip :class="statusChipClassFn(modalData.NombreEstado || modalData.Estado)" small>
                        {{ modalData.NombreEstado || modalData.Estado }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="12" md="6">
              <span class="subtitle-1 font-weight-medium mb-2">
                Progreso de la {{ modalType === 'orden' ? 'Orden' : 'Guía' }}:
              </span>
              <v-sheet elevation="0">
                <div
                  v-for="(paso, index) in timelineSteps"
                  :key="paso.id + index"
                  class="timeline-step"
                >
                  <div :class="['timeline-icon-container', paso.statusClass]">
                    <v-icon class="timeline-icon">{{ paso.icon }}</v-icon>
                  </div>
                  <div class="timeline-content">
                    <span class="subtitle-2 font-weight-medium">{{ paso.nombre }}</span>
                    <span v-if="paso.fecha" class="caption text--secondary">– {{ paso.fecha }}</span>
                    <span v-if="paso.descripcion" class="caption mt-1 text--secondary">{{ paso.descripcion }}</span>
                  </div>
                  <div v-if="index < timelineSteps.length - 1" class="timeline-line"></div>
                </div>
              </v-sheet>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <span class="subtitle-1 font-weight-medium mb-2">Detalle de Productos:</span>
          <div v-if="modalData.productosDetalle && modalData.productosDetalle.length > 0">
            <v-list dense>
              <v-list-item v-for="(prod, prodIndex) in modalData.productosDetalle" :key="prodIndex">
                <v-list-item-content>
                  <span class="body-2">
                    {{ prod.Unidades }} x {{ prod.Productos }}
                    <span v-if="prod.Barcode"> (Código: {{ prod.Barcode }})</span>
                    <span v-if="prod.CodeEmpresa"> (Cod.Empresa: {{ prod.CodeEmpresa }})</span>
                    <span v-if="prod.lote"> (Box: {{ prod.lote }})</span>
                    <span v-if="prod.Partida"> (Partida: {{ prod.Partida }})</span>
                  </span>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
          <div v-else>
            <span class="body-2 text--secondary">No hay productos en esta orden.</span>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn text color="primary" @click="$emit('close')">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SeguimientoModal',
  props: {
    show: Boolean,
    loading: Boolean,
    error: String,
    modalType: String,
    modalData: Object,
    timelineSteps: Array,
    statusChipClassFn: Function
  }
}
</script>

<style scoped>
.timeline-step {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-bottom: 1.5rem;
}
.timeline-step:last-child {
  padding-bottom: 0;
}
.timeline-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-right: 1rem;
  z-index: 1;
}
.timeline-icon {
  font-size: 1.25rem;
}
.timeline-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 17px;
  top: 36px;
  bottom: 0;
  width: 2px;
  background-color: rgba(0, 0, 0, 0.12);
}
.timeline-content {
  flex: 1;
  padding-top: 0.5rem;
}
.timeline-step.completed .timeline-icon-container {
  background-color: #e8f5e9;
  color: #388e3c;
}
.timeline-step.completed::before {
  background-color: #388e3c;
}
.timeline-step.current .timeline-icon-container {
  background-color: #e3f2fd;
  color: #1976d2;
}
.timeline-step.current-bad .timeline-icon-container {
  background-color: #ffebee;
  color: #d32f2f;
}
.timeline-step.pending .timeline-icon-container {
  background-color: #f5f5f5;
  color: #757575;
}
</style>
