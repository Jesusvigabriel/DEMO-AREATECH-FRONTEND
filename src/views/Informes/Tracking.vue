<template>
  <v-container>
    <v-row justify="center">
      <v-col class="py-3" cols="12" sm="auto" md="2" align="start">
        <v-checkbox label="Una empresa" v-model="elegirEmpresa" class="py-0 my-0" v-show="empresaLoggeada() <= 0"></v-checkbox>
      </v-col>
      <v-col cols="12" sm="auto" md="4" v-show="elegirEmpresa && empresaLoggeada() <= 0">
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" :idEmpresaInicialmenteSeleccionada="idEmpresa"></SelectorEmpresa>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Desde" v-model="fechaDesde" dense outlined hint="Fecha de inicio del período"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Hasta" v-model="fechaHasta" dense outlined hint="Fecha de fin del período"></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-4">
      <v-col class="py-0" cols="12" sm="8" md="3">
        <v-btn @click="handleObtenerInformacion" color="success" block :loading="loadingInformacion" large>
          Obtener información
          <v-icon right>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-expand-transition>
      <div v-show="informacionAExportar.length > 0 && !loadingInformacion" class="mt-5">
        <v-row justify="center" class="mb-3">
          <v-col cols="12">
            <h2 class="text-h5 font-weight-light mb-1 text-center">Resumen del Período</h2>
            <p class="text-center caption grey--text text--darken-1">
              Mostrando datos para {{ idEmpresa !== -1 && elegirEmpresa ? 'la empresa seleccionada' : 'todas las empresas' }}
              desde <strong>{{ formatDate(fechaDesde) }}</strong> hasta <strong>{{ formatDate(fechaHasta) }}</strong>.
            </p>
          </v-col>
        </v-row>

        <v-row>
          <v-col md="3" sm="6" cols="12">
            <v-card class="pa-3 text-center" outlined hover>
              <div class="text-h4 font-weight-bold primary--text">{{ kpiTotalGuias }}</div>
              <div class="text-overline mt-1">Total de Guías</div>
            </v-card>
          </v-col>
          <v-col md="3" sm="6" cols="12">
            <v-card class="pa-3 text-center" outlined hover :class="{'red lighten-5': kpiTotalNoEntregadas > 0}">
              <div class="text-h4 font-weight-bold" :class="{'error--text': kpiTotalNoEntregadas > 0}">{{ kpiTotalNoEntregadas }}</div>
              <div class="text-overline mt-1">Guías No Entregadas
                 <v-icon v-if="kpiTotalNoEntregadas > 0" color="red" small class="ml-1">mdi-alert-circle</v-icon>
              </div>
            </v-card>
          </v-col>
          <v-col md="3" sm="6" cols="12">
            <v-card class="pa-3 text-center" outlined hover>
              <div class="text-h4 font-weight-bold">{{ formatCurrency(kpiImporteTotalTransporte) }}</div>
              <div class="text-overline mt-1">Total Transporte</div>
            </v-card>
          </v-col>
          <v-col md="3" sm="6" cols="12">
            <v-card class="pa-3 text-center" outlined hover>
              <div class="text-h4 font-weight-bold">{{ formatCurrency(kpiImporteTotalGeneral) }}</div>
              <div class="text-overline mt-1">Importe Total General</div>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-3">
          <v-col md="7" cols="12">
            <v-card class="pa-3" outlined>
              <v-card-title class="subtitle-1 font-weight-medium">Distribución por Estado</v-card-title>
              <v-responsive :aspect-ratio="16/7" min-height="250">
                <PieChart v-if="pieChartData.datasets[0].data.length > 0 && !loadingInformacion" :chart-data="pieChartData" :chart-options="pieChartOptions" />
                <p v-else-if="!loadingInformacion" class="text-center pa-5 grey--text">No hay datos suficientes para el gráfico de estados.</p>
                <v-skeleton-loader v-if="loadingInformacion" type="image" height="250"></v-skeleton-loader>
              </v-responsive>
            </v-card>
          </v-col>
          <v-col md="5" cols="12">
            <v-card class="pa-3 fill-height" outlined>
              <v-card-title class="subtitle-1 font-weight-medium">Puntos de Atención</v-card-title>
              <v-list dense v-if="!loadingInformacion && (kpiTotalNoEntregadas > 0 || kpiTotalEntregasParciales > 0 || kpiGuiasConReenvio > 0)">
                <v-list-item v-if="kpiTotalNoEntregadas > 0">
                  <v-list-item-icon><v-icon color="red">mdi-close-octagon-outline</v-icon></v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title><strong>{{ kpiTotalNoEntregadas }}</strong> guías en estado "NO ENTREGADO".</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="kpiTotalEntregasParciales > 0">
                  <v-list-item-icon><v-icon color="orange">mdi-alert-outline</v-icon></v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title><strong>{{ kpiTotalEntregasParciales }}</strong> guías con "ENTREGA PARCIAL".</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                 <v-list-item v-if="kpiGuiasConReenvio > 0">
                  <v-list-item-icon><v-icon color="blue">mdi-truck-delivery-outline</v-icon></v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title><strong>{{ kpiGuiasConReenvio }}</strong> guías con intentos de reenvío.</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div v-else-if="!loadingInformacion" class="text-center pa-5 grey--text">
                <v-icon large color="green lighten-1">mdi-check-circle-outline</v-icon>
                <p class="mt-2">Todo en orden por ahora.</p>
              </div>
               <v-skeleton-loader v-if="loadingInformacion" type="list-item-avatar-three-line@2"></v-skeleton-loader>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>

    <v-row v-show="informacionAExportar.length > 0 && !loadingInformacion" class="mt-6 pb-0 mb-0" align="center">
      <v-col cols="12" md="8" class="py-0 my-0">
        <v-card-title class="py-1 my-0 px-0">
          <v-text-field 
            v-model="textoBusqueda" 
            append-icon="mdi-magnify" 
            label="Búsqueda en resultados..." 
            single-line 
            dense 
            hide-details 
            outlined 
            clearable
          ></v-text-field>
        </v-card-title>
      </v-col>
      <v-col cols="12" md="4" class="py-0 my-0 text-right">
        <v-btn 
          color="blue-grey" 
          class="white--text" 
          @click="handleExportarExcel" 
          :disabled="loadingInformacion || informacionAExportar.length === 0"
          large
        >
          <v-icon left>mdi-microsoft-excel</v-icon>
          Exportar a Excel
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="informacionAExportar.length > 0 && !loadingInformacion" class="mt-2">
      <v-col class="py-0">
        <v-data-table
          :headers="cabeceras"
          :search="textoBusqueda"
          item-key="Id"
          :singleSelect="false"
          show-select
          v-model="guiasSeleccionadas"
          :items="informacionAExportar"
          :footer-props="{ itemsPerPageOptions: [10, 30, 50, 100, -1], 'items-per-page-text':'Guías por página:' }"
          :items-per-page="30"
          class="elevation-2"
          :loading="loadingInformacion"
          loading-text="Cargando datos de guías..."
        >
          <template v-slot:item.Estado="{ item }">
            <v-chip :color="getColorForEstado(item.Estado)" :text-color="getTextColorForEstadoChip(item.Estado)" small>{{ item.Estado }}</v-chip>
          </template>

          <template v-slot:item.Acciones="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small color="blue lighten-1" v-bind="attrs" v-on="on" @click="verDocumentacionGuia(item)" class="mr-1" :disabled="item.Estado && item.Estado.trim().toUpperCase() === 'NO ENTREGADO'">
                    <v-icon>mdi-clipboard-text-search-outline</v-icon>
                </v-btn>
              </template>
              <span>Ver Documento Guía</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                 <v-btn icon small color="green lighten-1" v-bind="attrs" v-on="on" @click="aperturaDeSeguimiento(item)">
                    <v-icon>mdi-timeline-text-outline</v-icon>
                 </v-btn>
              </template>
              <span>Ver Seguimiento</span>
            </v-tooltip>
          </template>
           <template v-slot:no-data>
            <v-alert :value="true" color="info" icon="mdi-information-outline" dense>
              No hay guías para mostrar con los filtros actuales.
            </v-alert>
          </template>
          <template v-slot:no-results>
            <v-alert :value="true" color="warning" icon="mdi-alert-circle-outline" dense>
              No se encontraron resultados para "{{ textoBusqueda }}".
            </v-alert>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row v-else-if="!loadingInformacion && initialLoadDone" class="text-center mt-10">
        <v-col>
            <v-icon size="70" color="grey lighten-1">mdi-text-box-search-outline</v-icon>
            <p class="mt-4 title font-weight-light grey--text">No se encontraron resultados.</p>
            <p class="caption grey--text">Intenta ajustar los filtros o verifica el rango de fechas.</p>
        </v-col>
    </v-row>
    <v-row v-if="loadingInformacion && !initialLoadDone" class="text-center mt-10"> <v-col>
             <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
             <p class="mt-3 grey--text">Cargando información...</p>
        </v-col>
    </v-row>


    <v-dialog v-model="seguimientoDialog" persistent max-width="1000px" scrollable>
      <v-card>
        <v-card-title class="headline grey lighten-3">
          <v-icon left>mdi-truck-delivery</v-icon>
          Seguimiento Envío: {{ seguimientoInfo.Comprobante || 'N/A' }}
          <span class="caption ml-2">(Remito: {{ seguimientoInfo.Remitos || 'N/A' }})</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="cierreDeSeguimiento()"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
            <v-row>
                <v-col cols="12" md="4">
                    <v-card outlined class="pa-3 fill-height">
                        <div class="overline mb-2">Información del Envío</div>
                        <p v-if="seguimientoInfo.NombreDestino"><strong>Destino:</strong> {{ seguimientoInfo.NombreDestino }}</p>
                        <p v-if="seguimientoInfo.Domicilio"><strong>Domicilio:</strong> {{ seguimientoInfo.Domicilio }}</p>
                        <p v-if="seguimientoInfo.Fecha"><strong>Fecha Estado:</strong> {{ formatDate(seguimientoInfo.Fecha) }}</p>
                        <p v-if="seguimientoInfo.Estado"><strong>Estado Actual:</strong> <v-chip :color="getColorForEstado(seguimientoInfo.Estado)" :text-color="getTextColorForEstadoChip(seguimientoInfo.Estado)" small>{{ seguimientoInfo.Estado }}</v-chip></p>
                         <v-btn small color="blue-grey" outlined block class="mt-3" @click="verTurnoDeSeguimiento()" v-if="seguimientoInfo.Comprobante && seguimientoInfo.TokenAccesoTracking">
                            <v-icon left small>mdi-map-marker-path</v-icon>
                            Ver turno en mapa
                        </v-btn>
                    </v-card>
                </v-col>
                <v-col cols="12" md="8">
                    <v-timeline align-top dense v-if="ordenTraking.length > 0">
                    <v-timeline-item
                        v-for="(evento, i) in ordenTraking"
                        :key="i"
                        :color="evento.color"
                        :icon="evento.icon || 'mdi-history'"
                        fill-dot
                        large
                    >
                        <v-card class="elevation-2" :color="evento.color" :dark="!evento.color.includes('lighten') && evento.color !== 'grey'">
                            <v-card-title class="text-subtitle-1 py-2">
                                {{ evento.estado }}
                            </v-card-title>
                            <v-card-text :class="{'white text--primary': !evento.color.includes('lighten') && evento.color !== 'grey', 'black--text': evento.color.includes('lighten') || evento.color === 'grey'}" class="py-3">
                                <p class="mb-0">{{ evento.descripcion }}</p>
                                <div v-if="evento.fecha" class="caption grey--text mt-1">{{ evento.fecha }}</div>
                            </v-card-text>
                        </v-card>
                    </v-timeline-item>
                    </v-timeline>
                    <p v-else class="text-center grey--text pa-5">No hay información de tracking detallada disponible.</p>
                </v-col>
            </v-row>
        </v-card-text>

        <div v-if="seguimientoInfo.Reenvio && seguimientoInfo.Reenvio !== ''" class="pa-3 grey lighten-4">
          <v-row justify="center" align="center">
            <v-col cols="auto" class="font-weight-medium">
                <v-icon left color="blue darken-2">mdi-information-outline</v-icon>
                {{ seguimientoInfo.intentos }}: {{ seguimientoInfo.Reenvio }}
            </v-col>
            <v-col cols="auto">
              <v-btn small color="primary" @click="verReenvio()">
                <v-icon left small>mdi-truck-delivery-outline</v-icon> Ver Detalles del Reenvío
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-divider></v-divider>
        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cierreDeSeguimiento()">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import store from "../../store";
import SelectorEmpresa from '@/components/SelectorEmpresa.vue';
import ordenes from "@/store/ordenesV3";
import guias from "@/store/guias";
import fechas from 'vue-lsi-util/fechas';

// Importaciones para Chart.js
import { Pie as PieChart } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

// Registrar los componentes de Chart.js que vamos a usar
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default {
  name: "Informes_Tracking_Final", // Nombre del componente actualizado
  components: {
    SelectorEmpresa,
    PieChart
  },
  data() {
    return {
      loadingInformacion: false,
      initialLoadDone: false,
      fechaDesde: '', 
      fechaHasta: '',
      idEmpresa: -1,
      elegirEmpresa: false,
      guiasSeleccionadas: [],
      informacionAExportar: [], 
      remito: [], 
      textoBusqueda: '',
      cabeceras: [ 
        { text: 'Número', value: 'Comprobante', sortable: true },
        { text: 'Destino', value: 'NombreDestino', width: '25%', sortable: true },
        { text: 'Bultos', value: 'Bultos', align: 'center', sortable: true },
        { text: 'Remitos', value: 'Remitos', width: '15%', sortable: true },
        { text: 'Fecha', value: 'Fecha', width: '12%', sortable: true },
        { text: 'F.Original', value: 'FechaOriginal', width: '12%', sortable: true },
        { text: 'Estado', value: 'Estado', width: '12%', sortable: true },
        { text: 'Turno Entrega', value: 'OrdenEntrega', width: '5%', align: 'center', sortable: true },
        { text: 'Acciones', value: 'Acciones', sortable: false, align: 'center', width: '10%' },
      ],
      
      seguimientoDialog: false,
      orden: {}, 
      fechaCreacionOrden: '', 
      fechaPreparadoOrden: '', 
      seguimientoInfo: { 
        Comprobante: null, TokenAccesoTracking: null, Remitos: null, Reenvio: '', 
        intentos: '', IdEmpresa: null, IdOrden: null, Domicilio: '', Estado: '', 
        Fecha: '', NombreDestino: '',
      },
      ordenTraking: [], 

      // === Datos para el Dashboard y Gráficos ===
      kpiTotalGuias: 0,
      kpiTotalNoEntregadas: 0,
      kpiTotalEntregasParciales: 0,
      kpiGuiasConReenvio: 0,
      kpiImporteTotalTransporte: 0,
      kpiImporteTotalGeneral: 0,

      pieChartData: {
        labels: [],
        datasets: [ { backgroundColor: [], data: [] } ]
      },
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
          title: { display: false },
          tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.label || '';
                    if (label) { label += ': '; }
                    if (context.parsed !== null) { label += context.parsed; }
                    const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                    const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) + '%' : '0%';
                    label += ` (${percentage})`;
                    return label;
                }
            }
          }
        }
      },
      // === Variables para Exportación a Excel (restauradas del original) ===
      hashExcel: '', // Si la usas para algo después de generar el Excel
      nombreCliente: "", 
      importeTransporteExcel: 0,
      importeComplemento: 0,
      importeSeguroExcel: 0,
      cantidadGuiasExcel: 0,
      importePickingCD: 0,
      importeTotalExcel: 0,
      ContraReembolsoExcel: 0,
    };
  },
  methods: {
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        if (dateString.includes('-') && dateString.length === 10) {
            const parts = dateString.split('-');
            if (parts[0].length === 4) { return `${parts[2]}/${parts[1]}/${parts[0]}`; } // YYYY-MM-DD
            else if (parts[2].length === 4) { return `${parts[0]}/${parts[1]}/${parts[2]}`; } // DD-MM-YYYY
        }
        return dateString; 
    },
    formatCurrency(value) {
        if (typeof value !== 'number') { value = Number(value) || 0; }
        return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    },

    async handleObtenerInformacion() {
      this.loadingInformacion = true;
      this.initialLoadDone = true;
      this.informacionAExportar = []; // Limpiar datos previos
      this.guiasSeleccionadas = []; // Limpiar selección
      try {
        await this.obtenerInformacion(); 
        this.updateDashboardData(); 
      } catch (error) {
        console.error("Error al obtener información:", error);
        this.mostrarError("Ocurrió un error al cargar los datos.");
      } finally {
        this.loadingInformacion = false;
      }
    },

    updateDashboardData() {
      if (!this.informacionAExportar || this.informacionAExportar.length === 0) {
        this.kpiTotalGuias = 0; this.kpiTotalNoEntregadas = 0; this.kpiTotalEntregasParciales = 0;
        this.kpiGuiasConReenvio = 0; this.kpiImporteTotalTransporte = 0; this.kpiImporteTotalGeneral = 0;
        this.pieChartData.labels = []; this.pieChartData.datasets[0].data = []; this.pieChartData.datasets[0].backgroundColor = [];
        return;
      }
      this.kpiTotalGuias = this.informacionAExportar.length;
      let totalTransporte = 0; let totalGeneral = 0;
      const estadosCount = {};
      this.informacionAExportar.forEach(guia => {
        if (guia.Conceptos) {
          totalTransporte += Number(guia.Conceptos.Guia) || 0;
          totalGeneral += Number(guia.Conceptos.Total) || 0;
        }
        const estado = guia.Estado ? guia.Estado.trim().toUpperCase() : "DESCONOCIDO";
        estadosCount[estado] = (estadosCount[estado] || 0) + 1;
      });
      this.kpiGuiasConReenvio = this.informacionAExportar.filter(g => g.Remitos && (g.Remitos.includes('9999') || g.Remitos.includes('9991') || g.Remitos.includes('9992'))).length;
      this.kpiImporteTotalTransporte = totalTransporte;
      this.kpiImporteTotalGeneral = totalGeneral;
      this.kpiTotalNoEntregadas = estadosCount['NO ENTREGADO'] || 0;
      this.kpiTotalEntregasParciales = estadosCount['PARCIAL'] || 0;
      const labels = Object.keys(estadosCount);
      const data = Object.values(estadosCount);
      const backgroundColors = labels.map(label => this.getColorForEstado(label, true));
      this.pieChartData = { labels: labels, datasets: [{ backgroundColor: backgroundColors, data: data }] };
    },

    getColorForEstado(estado, forChart = false) {
      if (!estado) return forChart ? '#BDBDBD' : 'grey';
      const estadoTrim = estado.trim().toUpperCase();
      const chartColorPalette = {
        "ENTREGADO": "#4CAF50", "NO ENTREGADO": "#F44336", "PARCIAL": "#FFC107", 
        "EN DISTRIBUCIÓN": "#2196F3", "DESPACHADO": "#2196F3", "RUTEADO": "#03A9F4",
        "PEDIDO EN PREPARACIÓN": "#00BCD4", "PEDIDO PREPARADO": "#00ACC1", "EN CD": "#009688",
        "EN PLANCHADA": "#26A69A", "PEDIDO RETIRADO": "#607D8B", "RETIRA CLIENTE": "#546E7A",
        "ANULADO": "#757575", "DEFAULT": "#9E9E9E"
      };
      const vuetifyColor = {
        "ENTREGADO": "green", "NO ENTREGADO": "red", "PARCIAL": "amber darken-1",
        "EN DISTRIBUCIÓN": "blue", "DESPACHADO": "blue", "RUTEADO": "light-blue darken-1",
        "PEDIDO EN PREPARACIÓN": "cyan darken-1", "PEDIDO PREPARADO": "cyan", "EN CD": "teal",
        "EN PLANCHADA": "teal lighten-1", "PEDIDO RETIRADO": "blue-grey", "RETIRA CLIENTE": "blue-grey darken-1",
        "ANULADO": "grey darken-2", "DEFAULT": "grey"
      };
      if (forChart) { return chartColorPalette[estadoTrim] || chartColorPalette["DEFAULT"]; }
      return vuetifyColor[estadoTrim] || vuetifyColor["DEFAULT"];
    },
    getTextColorForEstadoChip(estado){
        if (!estado) return 'white';
        const estadoTrim = estado.trim().toUpperCase();
        switch (estadoTrim) {
            case "PARCIAL": case "PEDIDO PREPARADO": case "EN PLANCHADA": return 'rgba(0,0,0,0.87)';
            default: return 'white';
        }
    },

    async verDocumentacionGuia(item) {
      this.mostrarLoading("Cargando documentos...");
      try {
        const results = await guias.getFotosDocumentacionEntrega(item.Id);
        this.ocultarLoading();
        if (results && results.length > 0) {
            for (const unaFoto of results) {
              if (unaFoto.Hash) { // Verificar que Hash exista
                const url = `https://a54-choferes-fotos-documentacion-entrega.s3.amazonaws.com/a54_cfde_${item.Id}_${unaFoto.Hash}`;
                window.open(url, "_blank");
              } else {
                console.warn("Foto sin Hash encontrada para guía ID:", item.Id, unaFoto);
              }
            }
        } else {
            this.mostrarMensaje("No hay documentos disponibles para esta guía.", "Sin Documentos");
        }
      } catch (error) {
        this.ocultarLoading();
        console.error("Error al ver documentación:", error);
        this.mostrarError("Error al cargar documentos de guía.");
      }
    },

    empresaLoggeada() {
      return store.state.usuarios?.usuarioActual?.IdEmpresa || -1;
    },

    cierreDeSeguimiento() {
      this.seguimientoInfo = { Comprobante: null, TokenAccesoTracking: null, Remitos: null, Reenvio: '', intentos: '', IdEmpresa: null, IdOrden: null, Domicilio: '', Estado: '', Fecha: '', NombreDestino: ''};
      this.ordenTraking = [];
      this.seguimientoDialog = false;
    },

    verTurnoDeSeguimiento() {
      if (this.seguimientoInfo.Comprobante && this.seguimientoInfo.TokenAccesoTracking) {
        const URL = `https://seguimiento.area54sa.com.ar/tracking/${this.seguimientoInfo.Comprobante}/${this.seguimientoInfo.TokenAccesoTracking}`;
        window.open(URL, '_blank');
      } else {
        this.mostrarError("No hay información de seguimiento disponible para este envío.");
      }
    },

    async verReenvio() {
        if (!this.seguimientoInfo.Reenvio || !this.remito || this.remito.length === 0) {
            this.mostrarError("No hay información de reenvío para mostrar o no se encontraron detalles.");
            return;
        }
        const itemReenvio = this.remito.find(r => r.Remitos === this.seguimientoInfo.Reenvio);
        if (itemReenvio) {
            this.cierreDeSeguimiento(); 
            setTimeout(() => { this.aperturaDeSeguimiento({...itemReenvio}); }, 100);
        } else {
            this.mostrarError(`No se encontraron los detalles para el remito de reenvío: ${this.seguimientoInfo.Reenvio}`);
        }
    },

    async aperturaDeSeguimiento(item) {
      this.mostrarLoading("Cargando seguimiento...");
      const currentItem = JSON.parse(JSON.stringify(item)); // Evitar mutaciones
      this.seguimientoInfo = { 
        Comprobante: currentItem.Comprobante, TokenAccesoTracking: currentItem.TokenAccesoTracking, Remitos: currentItem.Remitos,
        Reenvio: '', intentos: '', IdEmpresa: currentItem.IdEmpresa, IdOrden: currentItem.IdOrden, Domicilio: currentItem.Domicilio,
        Estado: currentItem.Estado, Fecha: currentItem.Fecha, NombreDestino: currentItem.NombreDestino,
      };
      this.ordenTraking = []; this.remito = [];
      if (currentItem.Remitos && typeof currentItem.Remitos === 'string' ) {
        try {
          let remitosRelacionados = [];
          if (currentItem.Remitos.includes('9999')) {
            remitosRelacionados = await guias.getRemitos(currentItem.IdEmpresa, currentItem.Remitos.slice(-5));
            const reenvioEncontrado = remitosRelacionados.find(r => r.Remitos && r.Remitos.includes('9991'));
            if (reenvioEncontrado) { this.seguimientoInfo.Reenvio = reenvioEncontrado.Remitos; this.seguimientoInfo.intentos = 'Segundo Reenvio';}
          } else if (currentItem.Remitos.includes('9991')) {
            remitosRelacionados = await guias.getRemitos(currentItem.IdEmpresa, currentItem.Remitos);
            const reenvioEncontrado = remitosRelacionados.find(r => r.Remitos && r.Remitos.includes('9992'));
            if (reenvioEncontrado) { this.seguimientoInfo.Reenvio = reenvioEncontrado.Remitos; this.seguimientoInfo.intentos = 'Tercer Reenvio';}
          } else { 
            remitosRelacionados = await guias.getRemitos(currentItem.IdEmpresa, currentItem.Remitos);
            const reenvioEncontrado = remitosRelacionados.find(r => r.Remitos && r.Remitos.includes('9999'));
            if (reenvioEncontrado) { this.seguimientoInfo.Reenvio = reenvioEncontrado.Remitos; this.seguimientoInfo.intentos = 'Primer Reenvio';}
          }
          if (remitosRelacionados && remitosRelacionados.length > 0) { this.remito = remitosRelacionados; }
        } catch (error) { console.warn("Advertencia obteniendo remitos para reenvío:", error); }
      }
      if (currentItem.IdOrden != null) {
        try {
          this.orden = await ordenes.getById(currentItem.IdOrden);
          this.fechaCreacionOrden = this.orden.FechaCreacion ? this.orden.FechaCreacion.substr(0, 10) : '';
          this.fechaPreparadoOrden = this.orden.FechaPreparado ? this.orden.FechaPreparado.substr(0, 10) : '';
        } catch (error) { console.warn("Advertencia obteniendo orden:", error); this.orden = {}; this.fechaCreacionOrden = ''; this.fechaPreparadoOrden = ''; }
      } else { this.orden = {}; this.fechaCreacionOrden = ''; this.fechaPreparadoOrden = ''; }
      this.generaVistaTraking(this.seguimientoInfo); 
      this.ocultarLoading();
      this.seguimientoDialog = true;
    },

    generaVistaTraking(guiaActual) { 
        this.ordenTraking = [];
        const domicilioLowerCase = guiaActual.Domicilio ? guiaActual.Domicilio.toLowerCase() : "";
        const estadoGuia = guiaActual.Estado ? guiaActual.Estado.trim().toUpperCase() : "DESCONOCIDO";
        const fechaCreacionFormateada = this.fechaCreacionOrden ? this.formatDate(this.fechaCreacionOrden) : null;
        const fechaPreparadoFormateada = this.fechaPreparadoOrden ? this.formatDate(this.fechaPreparadoOrden) : null;

        const agregarPaso = (estadoKey, descripcionPredeterminada, fechaPasoOverride = null, esEstadoActual = false) => {
            const estadoObj = this.getEstadoInfo(estadoKey);
            let descripcionFinal = descripcionPredeterminada || estadoObj.descripcionDefault;
            let fechaDelPaso = fechaPasoOverride ? this.formatDate(fechaPasoOverride) : null;
            if (!fechaDelPaso) {
                if (estadoKey === 'PEDIDO EN PREPARACIÓN') fechaDelPaso = fechaCreacionFormateada;
                else if (estadoKey === 'PEDIDO PREPARADO') fechaDelPaso = fechaPreparadoFormateada;
            }
            if (fechaDelPaso && !descripcionFinal.startsWith(fechaDelPaso)) { descripcionFinal = `${fechaDelPaso} - ${descripcionFinal}`; }

            this.ordenTraking.push({
                color: esEstadoActual ? this.getColorForEstado(estadoGuia) : (fechaDelPaso ? estadoObj.color : 'grey lighten-1'),
                estado: estadoObj.texto,
                icon: esEstadoActual && estadoGuia === estadoKey ? estadoObj.icon : (fechaDelPaso ? estadoObj.icon : 'mdi-circle-medium'),
                descripcion: descripcionFinal,
                fecha: fechaDelPaso 
            });
        };
        
        const pasosFlujo = {
            retiroSucursal: ["PEDIDO EN PREPARACIÓN", "PEDIDO PREPARADO", "PEDIDO RETIRADO"],
            estandar: ["PEDIDO EN PREPARACIÓN", "PEDIDO PREPARADO", "EN CD", "EN DISTRIBUCIÓN", "ENTREGADO"]
        };
        let flujoAplicable = domicilioLowerCase.includes("lagos garcia 4470") ? pasosFlujo.retiroSucursal : pasosFlujo.estandar;
        if (estadoGuia === "ANULADO") { agregarPaso("ANULADO", this.getEstadoInfo("ANULADO").descripcionDefault, guiaActual.Fecha, true); return; }

        let indiceEstadoActualEnFlujo = flujoAplicable.indexOf(estadoGuia);
        if (estadoGuia === "RETIRA CLIENTE" && flujoAplicable === pasosFlujo.retiroSucursal) { indiceEstadoActualEnFlujo = flujoAplicable.indexOf("PEDIDO RETIRADO");}
        else if (["NO ENTREGADO", "PARCIAL"].includes(estadoGuia)) { indiceEstadoActualEnFlujo = flujoAplicable.indexOf("EN DISTRIBUCIÓN"); }
        else if (!flujoAplicable.includes(estadoGuia) && ["RUTEADO", "DESPACHADO", "EN PLANCHADA"].includes(estadoGuia)) {
            indiceEstadoActualEnFlujo = flujoAplicable.indexOf(estadoGuia.includes("CD") || estadoGuia.includes("PLANCHADA") ? "EN CD" : "EN DISTRIBUCIÓN");
        }

        for (let i = 0; i < flujoAplicable.length; i++) {
            const pasoKey = flujoAplicable[i];
            const esPasoActualOAnterior = indiceEstadoActualEnFlujo === -1 || i <= indiceEstadoActualEnFlujo;
            if (pasoKey === "ENTREGADO" && ["NO ENTREGADO", "PARCIAL"].includes(estadoGuia)) { continue; }
            let fechaParaPaso = null;
            if (pasoKey === estadoGuia || (pasoKey === "PEDIDO RETIRADO" && estadoGuia === "RETIRA CLIENTE")) { fechaParaPaso = guiaActual.Fecha; }
            else if (pasoKey === "PEDIDO EN PREPARACIÓN") { fechaParaPaso = this.fechaCreacionOrden; }
            else if (pasoKey === "PEDIDO PREPARADO") { fechaParaPaso = this.fechaPreparadoOrden; }
            if(esPasoActualOAnterior || fechaParaPaso){ agregarPaso(pasoKey, this.getEstadoInfo(pasoKey).descripcionDefault, fechaParaPaso, pasoKey === estadoGuia); }
        }
        if (["NO ENTREGADO", "PARCIAL"].includes(estadoGuia)) {
            const existeYa = this.ordenTraking.some(p => p.estado.toUpperCase() === estadoGuia);
            if (!existeYa) { agregarPaso(estadoGuia, this.getEstadoInfo(estadoGuia).descripcionDefault, guiaActual.Fecha, true); }
        }
    },

    getEstadoInfo(estadoKey) {
        const estadoUpper = estadoKey.trim().toUpperCase();
        const baseInfo = {
            "PEDIDO EN PREPARACIÓN": { colorName: 'PEDIDO EN PREPARACIÓN', icon: 'mdi-clipboard-edit-outline', texto: 'Pedido en preparación', descripcionDefault: 'Estamos procesando tu pedido.'},
            "PEDIDO PREPARADO": { colorName: 'PEDIDO PREPARADO', icon: 'mdi-package-variant-closed', texto: 'Pedido preparado', descripcionDefault: 'Listo para el proceso de distribución.'},
            "EN CD": { colorName: 'EN CD', icon: 'mdi-warehouse', texto: 'En Centro de Distribución', descripcionDefault: 'En proceso de Cross Docking.'},
            "PEDIDO RETIRADO": { colorName: 'PEDIDO RETIRADO', icon: 'mdi-human-dolly', texto: 'Pedido retirado', descripcionDefault: 'Retirado de nuestro centro.'},
            "RETIRA CLIENTE": { colorName: 'RETIRA CLIENTE', icon: 'mdi-account-check-outline', texto: 'Retirado por Cliente', descripcionDefault: 'El cliente ha retirado el pedido.'},
            "EN DISTRIBUCIÓN": { colorName: 'EN DISTRIBUCIÓN', icon: 'mdi-truck-fast-outline', texto: 'En distribución', descripcionDefault: '¡Tu pedido ya está en camino!'},
            "ENTREGADO": { colorName: 'ENTREGADO', icon: 'mdi-truck-check-outline', texto: 'Entregado', descripcionDefault: 'Tu pedido fue entregado con éxito.'},
            "NO ENTREGADO": { colorName: 'NO ENTREGADO', icon: 'mdi-truck-alert', texto: 'No entregado', descripcionDefault: 'No se pudo entregar. Se recoordinará.'},
            "PARCIAL": { colorName: 'PARCIAL', icon: 'mdi-package-variant-remove', texto: 'Entrega parcial', descripcionDefault: 'Entregado de forma incompleta.'},
            "ANULADO": { colorName: 'ANULADO', icon: 'mdi-cancel', texto: 'Pedido Anulado', descripcionDefault: 'El pedido ha sido anulado.'},
            "RUTEADO": { colorName: 'RUTEADO', icon: 'mdi-map-marker-path', texto: 'Ruteado', descripcionDefault: 'Asignado a una ruta de entrega.'},
            "DESPACHADO": { colorName: 'DESPACHADO', icon: 'mdi-truck-delivery-outline', texto: 'Despachado', descripcionDefault: 'Despachado desde origen/CD.'},
            "EN PLANCHADA": { colorName: 'EN PLANCHADA', icon: 'mdi-forklift', texto: 'En Planchada (CD)', descripcionDefault: 'En la planchada del CD.'},
            "DEFAULT": { colorName: 'DEFAULT', icon: 'mdi-progress-question', texto: estadoKey, descripcionDefault: 'Estado no especificado.'}
        };
        let info = baseInfo[estadoUpper] || {...baseInfo["DEFAULT"], texto: estadoKey };
        return { ...info, color: this.getColorForEstado(info.colorName) };
    },

    async obtenerInformacion() { 
      if (this.elegirEmpresa && this.idEmpresa === -1) {
        this.mostrarError("No se ha seleccionado Empresa"); this.informacionAExportar = []; return;
      }
      let response;
      try {
        if (!this.elegirEmpresa) { response = await guias.getByPeriodoEmpresa(this.fechaDesde, this.fechaHasta); }
        else { response = await guias.getByPeriodoEmpresa(this.fechaDesde, this.fechaHasta, this.idEmpresa); }

        if (response && response.length > 0) {
          this.informacionAExportar = response.map(e => {
            let fechaFormateada = e.Fecha;
            if (e.Fecha && e.Fecha.includes('-') && e.Fecha.split('-')[0].length === 4) { fechaFormateada = e.Fecha.split('-').reverse().join('-');}
            let fechaOriginalFormateada = e.FechaOriginal;
            if (e.FechaOriginal && e.FechaOriginal.includes('-') && e.FechaOriginal.split('-')[0].length === 4) { fechaOriginalFormateada = e.FechaOriginal.split('-').reverse().join('-');}
            const conceptosProcesados = { Guia: 0, Seguro: 0, Complemento: 0, CTR: 0, PickingCD: 0, Total: 0 };
            let canalProcesado = "N/D"; let servicioProcesado = e.Servicio || "N/D";
            if (e.DetalleCalculo) {
              try {
                const detalleParseado = typeof e.DetalleCalculo === 'string' ? JSON.parse(e.DetalleCalculo) : e.DetalleCalculo;
                if (detalleParseado && Array.isArray(detalleParseado) && detalleParseado.length > 0) {
                    canalProcesado = detalleParseado[0]?.Concepto || "N/D";
                    for (const unDetalle of detalleParseado) {
                      const totalDetalle = Number(unDetalle.Total) || 0;
                      if (unDetalle.Concepto.includes("EntregaRegular")) servicioProcesado = "Entrega";
                      if (unDetalle.Concepto.includes("RecoleccionRegular")) servicioProcesado = "Recolección";
                      if (unDetalle.Concepto.includes("Guia")) conceptosProcesados.Guia += totalDetalle;
                      if (unDetalle.Concepto.includes("Seguro")) conceptosProcesados.Seguro += totalDetalle;
                      if (unDetalle.Concepto.includes("Complemento")) conceptosProcesados.Complemento += totalDetalle;
                      if (unDetalle.Concepto.includes("CTR")) conceptosProcesados.CTR += totalDetalle;
                      if (unDetalle.Concepto.includes("PickingCD")) conceptosProcesados.PickingCD += totalDetalle;
                      conceptosProcesados.Total += totalDetalle;
                    }
                }
              } catch (parseError) { console.warn("Error parseando DetalleCalculo para guía ID:", e.Id, parseError); canalProcesado = "Error Parseo"; }
            }
            return { ...e, Fecha: fechaFormateada, FechaOriginal: fechaOriginalFormateada, Conceptos: conceptosProcesados, Canal: canalProcesado, Servicio: servicioProcesado,
                Comprobante: e.Comprobante || 'N/A', NombreDestino: e.NombreDestino || 'N/A', Bultos: e.Bultos || 0, Remitos: e.Remitos || 'N/A',
                Estado: e.Estado || 'DESCONOCIDO', OrdenEntrega: e.OrdenEntrega || '-', Id: e.Id,
            };
          });
        } else { this.informacionAExportar = []; }
      } catch (error) { console.error("Error en obtenerInformacion:", error); this.mostrarError("Error al recuperar guías."); this.informacionAExportar = []; }
    },
    
    obtenerImporteTotal() { 
        this.importeTransporteExcel = 0; this.importeComplemento = 0; this.importeSeguroExcel = 0;
        this.cantidadGuiasExcel = 0; this.importePickingCD = 0; this.importeTotalExcel = 0; this.ContraReembolsoExcel = 0;
        for (const concepto of this.informacionAExportar) {
          this.nombreCliente = concepto.NombreCliente; this.cantidadGuiasExcel++;
          const addSafe = (currentVal, toAdd) => (typeof toAdd === "string" ? (isNaN(Number(toAdd)) ? 0 : Number(toAdd)) : (toAdd || 0));
          this.importeSeguroExcel += addSafe(this.importeSeguroExcel, concepto.Conceptos.Seguro);
          this.importeTransporteExcel += addSafe(this.importeTransporteExcel, concepto.Conceptos.Guia);
          this.importeComplemento += addSafe(this.importeComplemento, concepto.Conceptos.Complemento);
          this.importePickingCD += addSafe(this.importePickingCD, concepto.Conceptos.PickingCD);
          this.ContraReembolsoExcel += addSafe(this.ContraReembolsoExcel, concepto.Conceptos.CTR); // Usando CTR consistentemente
          this.importeTotalExcel += addSafe(this.importeTotalExcel, concepto.Conceptos.Total);
        }
        this.importeSeguroExcel = Number(this.importeSeguroExcel.toFixed(2));
        this.importeTransporteExcel = Number(this.importeTransporteExcel.toFixed(2));
        this.importeComplemento = Number(this.importeComplemento.toFixed(2));
        this.importePickingCD = Number(this.importePickingCD.toFixed(2));
        this.importeTotalExcel = Number(this.importeTotalExcel.toFixed(2));
        this.ContraReembolsoExcel = Number(this.ContraReembolsoExcel.toFixed(2));
    },

    handleExportarExcel() {
        if (this.informacionAExportar.length === 0) { this.mostrarError("No hay información para exportar."); return; }
        this.mostrarLoading("Preparando Excel...");
        try {
          this.obtenerImporteTotal(); // Calcula los totales necesarios para el Excel
          if (typeof this.generarInformeExcel === 'function') {
            // Asumo que generarInformeExcel toma los datos procesados y usa las variables de 'this' para los totales.
            this.generarInformeExcel(this.informacionAExportar); 
          } else {
            console.error("La función 'generarInformeExcel' no está definida.");
            this.mostrarError("Error: Funcionalidad de exportar Excel no configurada.");
          }
        } catch (error) {
            console.error("Error al generar el informe Excel:", error);
            this.mostrarError("Ocurrió un error al generar el Excel.");
        } finally {
            this.ocultarLoading();
        }
    },

    eligioEmpresa(idEmpresaElegida) {
      this.idEmpresa = idEmpresaElegida;
      if (this.initialLoadDone) { // Solo limpiar si ya se hizo una carga inicial
        this.informacionAExportar = []; this.guiasSeleccionadas = [];
        this.updateDashboardData(); 
      }
    },

    mostrarMensaje(mensaje, titulo = "Información") { store.dispatch("alertDialog/mostrar", { titulo, mensaje, botonPrimario: "Entendido" }); },
    mostrarError(mensaje) { store.dispatch("snackbar/mostrar", mensaje); },
    mostrarLoading(texto = "Procesando...") { store.dispatch("loading/mostrar", texto); },
    ocultarLoading() { store.dispatch("loading/ocultar"); },
  },
  watch: {
    // Estos watchers pueden ser útiles para resetear el estado si el usuario cambia filtros y no busca de nuevo.
    // fechaDesde() { if(this.initialLoadDone && this.informacionAExportar.length > 0) { this.informacionAExportar = []; this.updateDashboardData(); }},
    // fechaHasta() { if(this.initialLoadDone && this.informacionAExportar.length > 0) { this.informacionAExportar = []; this.updateDashboardData(); }},
    // idEmpresa() { if(this.initialLoadDone && this.elegirEmpresa && this.informacionAExportar.length > 0) { this.informacionAExportar = []; this.updateDashboardData(); }},
  },
  created() {
    store.dispatch('actualizarTituloPrincipal', 'Tracking de Envíos');
    store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas');

    if (process.env.NODE_ENV === "development") {
      this.fechaDesde = '2024-01-02'; this.fechaHasta = '2024-01-02';
      this.elegirEmpresa = true; this.idEmpresa = 163;
    } else {
      const hoy = new Date();
      const ayer = fechas.getSumarDiasFecha(new Date(), -1); // Asume que el primer arg es la fecha base
      this.fechaDesde = fechas.dateToString(ayer); 
      this.fechaHasta = fechas.dateToString(hoy);
    }
    const idEmpresaUsuarioLoggeado = this.empresaLoggeada();
    if (idEmpresaUsuarioLoggeado > 0) {
      this.idEmpresa = idEmpresaUsuarioLoggeado;
      this.elegirEmpresa = true;
    }
  },
};
</script>

<style scoped>
.v-card--outlined {
  border: 1px solid rgba(0,0,0,0.12) !important;
}
.text-overline {
  color: rgba(0,0,0,0.7);
  font-weight: 500;
  letter-spacing: 0.05em;
}
.v-card .text-h4 {
    line-height: 1.2;
}
.v-timeline-item__dot--large {
    width: 44px; height: 44px;
    border: 2px solid white; 
    box-shadow: 0 2px 4px rgba(0,0,0,0.2); 
}
.v-timeline-item__dot--large .v-icon {
    font-size: 22px; 
}
.v-timeline--dense .v-timeline-item__body > .v-card {
    margin-left: 16px; 
    margin-top: -8px; 
}
.v-timeline-item:not(:last-child)::before {
    width: 3px; 
}
.v-card__title.text-subtitle-1 { 
    font-weight: 500 !important;
}
.v-card__text.white.text--primary { 
    font-size: 0.9rem;
    line-height: 1.5;
}
.v-chip.amber.darken-1,
.v-chip.cyan,
.v-chip.teal.lighten-1 {
    /* color: rgba(0,0,0,0.87) !important; */ /* Manejado por getTextColorForEstadoChip */
}
.fill-height { height: 100%; }

.v-btn--outlined.blue-grey { 
    border-color: #546E7A;
    color: #37474F !important; 
}
.v-btn--outlined.blue-grey:hover {
    background-color: rgba(96, 125, 139, 0.05); 
}
/* Ajuste para que el botón de Excel no se vea tan apretado en mobile */
@media (max-width: 959px) { /* md breakpoint de Vuetify */
    .text-right {
        text-align: left !important;
        margin-top: 8px;
    }
}
</style>