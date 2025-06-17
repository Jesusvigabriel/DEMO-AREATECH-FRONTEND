<template>
    <v-container fluid class="pa-4">
      <v-row>
        <v-col>
          <v-sheet elevation="0" class="mb-6">
            <v-row align="center" justify="space-between">
              <v-col cols="12" md="6">
                <span class="text-h4 font-weight-semibold">
                  Seguimiento
                </span>
              </v-col>
            </v-row>
          </v-sheet>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" class="mb-6">
            <v-card-text>
              <v-row dense align="center" no-gutters>
                <v-col cols="12" md="4" class="pr-4">
                  <v-row>
                    <v-col cols="12">
                      <span class="subtitle-2 font-weight-medium mb-1">
                        Seleccionar empresa
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <SelectorEmpresa
                        @eligioEmpresa="eligioEmpresa"
                        :idEmpresaInicialmenteSeleccionada="idEmpresa"
                        :listaEmpresas="listaEmpresas"
                        outlined
                        dense
                        hide-details
                      />
                    </v-col>
                  </v-row>
                </v-col>
  
                <v-col cols="12" md="4" class="pr-4">
                  <v-row>
                    <v-col cols="12">
                      <span class="subtitle-2 font-weight-medium mb-1">
                        Fecha Desde
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="fechaDesde"
                        type="date"
                        outlined
                        dense
                        hide-details
                        @change="popularAmbasListas"
                      />
                    </v-col>
                  </v-row>
                </v-col>
  
                <v-col cols="12" md="4">
                  <v-row>
                    <v-col cols="12">
                      <span class="subtitle-2 font-weight-medium mb-1">
                        Fecha Hasta
                      </span>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="fechaHasta"
                        type="date"
                        outlined
                        dense
                        hide-details
                        @change="popularAmbasListas"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <v-row>
        <v-col cols="12">
          <v-card elevation="2">
            <v-tabs v-model="tab" :style="{ 'background-color': 'var(--surface)' }" show-arrows>
              <v-tab href="#tab-ordenes">
                Órdenes
              </v-tab>
              <v-tab href="#tab-guias">
                Guías
              </v-tab>
              <v-tab href="#tab-guias-empresa">
                Conforme de entrega
              </v-tab>
            </v-tabs>
  
            <v-tabs-items v-model="tab">
              <v-tab-item value="tab-ordenes">
                <OrdenesTab
                  :cabecerasOrdenes="cabecerasOrdenes"
                  :ordenesFiltradasParaTabla="ordenesFiltradasParaTabla"
                  :pageOrdenes.sync="pageOrdenes"
                  :pageCountOrdenes="pageCountOrdenes"
                  :paginationInfoOrdenes="paginationInfoOrdenes"
                  :itemsPerPage.sync="itemsPerPage"
                  :itemsPerPageOptions="itemsPerPageOptions"
                  :textoBusqueda.sync="textoBusqueda"
                  :idEmpresa="idEmpresa"
                  :loading="loading"
                  :errorAlCargar="errorAlCargar"
                  :getStatusChipClassTextual="getStatusChipClassTextual"
                  @open-modal="openModal"
                  @ver-guia-asociada="verGuiaAsociada"
                  @descargar-ordenes-excel="descargarOrdenesExcel"
                />
              </v-tab-item>
  
              <v-tab-item value="tab-guias">
                <GuiasTab
                  :cabecerasGuias="cabecerasGuias"
                  :guiasFiltradasParaTabla="guiasFiltradasParaTabla"
                  :pageGuias.sync="pageGuias"
                  :pageCountGuias="pageCountGuias"
                  :paginationInfoGuias="paginationInfoGuias"
                  :itemsPerPageGuias.sync="itemsPerPageGuias"
                  :itemsPerPageOptions="itemsPerPageOptions"
                  :textoBusquedaGuias.sync="textoBusquedaGuias"
                  :idEmpresa="idEmpresa"
                  :loading="loading"
                  :errorAlCargar="errorAlCargar"
                  :getStatusChipClassTextual="getStatusChipClassTextual"
                  @open-modal="openModal"
                />
              </v-tab-item>

              <v-tab-item value="tab-guias-empresa">
                <GuiasEmpresaTab
                  :cabecerasGuiasEmpresa="cabecerasGuiasEmpresa"
                  :guiasEmpresaFiltradasParaTabla="guiasEmpresaFiltradasParaTabla"
                  :pageGuiasEmpresa.sync="pageGuiasEmpresa"
                  :pageCountGuiasEmpresa="pageCountGuiasEmpresa"
                  :paginationInfoGuiasEmpresa="paginationInfoGuiasEmpresa"
                  :itemsPerPageGuiasEmpresa.sync="itemsPerPageGuiasEmpresa"
                  :itemsPerPageOptions="itemsPerPageOptions"
                  :textoBusquedaGuiasEmpresa.sync="textoBusquedaGuiasEmpresa"
                  :idEmpresa="idEmpresa"
                  :loading="loading"
                  :errorAlCargar="errorAlCargar"
                  :getStatusChipClassTextual="getStatusChipClassTextual"
                  @open-modal="openGuiaEmpresaModal"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
  
      <SeguimientoModal
        :show="showModal"
        :modalData="modalData"
        :modalType="modalType"
        :timelineStepsComputed="timelineStepsComputed"
        :loading="loading"
        :errorAlCargar="errorAlCargar"
        :getStatusChipClassTextual="getStatusChipClassTextual"
        @close="closeModal"
        @descargar-orden-excel-individual="descargarOrdenExcelIndividual"
        @descargar-guia-excel-individual="descargarGuiaExcelIndividual"
      />

      <GuiaEmpresaModal
        :show="showGuiaEmpresaModal"
        :guia="guiaEmpresaModalData"
        :getStatusChipClassTextual="getStatusChipClassTextual"
        @close="closeGuiaEmpresaModal"
        @descargar="descargarGuiaEmpresaPDF"
      />
    </v-container>
  </template>
  
  <script>
  /*
    SeguimientosOrdenesGuias.vue
    --------------------------------------------------------------------------
    Componente principal para el seguimiento de órdenes y guías en una interfaz
    unificada. Permite filtrar por empresa y rango de fechas, mostrando los
    resultados en dos pestañas separadas (Órdenes y Guías). Al seleccionar un
    elemento, muestra un modal con detalles y una línea de tiempo de su progreso.
  
    Utiliza Vuex para la gestión de estados (store) y Vuetify para los componentes
    de interfaz de usuario y el layout.
  
    ==========================================================================
    Características y Funcionalidades:
  
    1.  **Filtros de Empresa y Fechas:**
        * Selector de empresa (`SelectorEmpresa`): Componente reutilizable para elegir la empresa.
        * Campos de fecha (`fechaDesde`, `fechaHasta`): Permiten definir un rango de fechas.
        * Las fechas se inicializan por defecto a la "última semana" (7 días atrás hasta hoy).
        * Los filtros se aplican a la carga de datos tanto para órdenes como para guías.
  
    2.  **Pestañas (`v-tabs`):**
        * Organiza la información en dos secciones: "Órdenes" y "Guías".
        * Permite al usuario alternar entre la visualización de órdenes y guías.
  
    3.  **Tablas de Datos (`v-data-table`):**
        * Cada pestaña contiene su propia tabla para mostrar la lista de elementos (órdenes o guías).
        * **Columnas:** `N° Orden/Guía`, `Empresa`, `Cliente/Destino`, `Fecha Creación`, `Estado Actual`, `Acciones`.
        * **Buscador:** Permite buscar dentro de la tabla actual.
        * **Paginación:** Controlada manualmente para ambas tablas.
        * **Chips de Estado:** Los estados se muestran con un `v-chip` con colores dinámicos (definidos en `getStatusChipClassTextual`).
        * **Botón de Acción (`mdi-eye-outline`):** Abre un modal de detalle para el elemento seleccionado.
        * **NUEVA FUNCIONALIDAD:** Para órdenes en estado "A distribución" y con guía asociada, se muestra un chip "Seguimiento aquí" que redirige a la pestaña de guías y abre el modal de la guía directamente.
  
    4.  **Modal de Detalle Unificado (`v-dialog`):**
        * Muestra información detallada de una orden o una guía cuando se hace clic en el botón "ojo".
        * **Datos Generales:** Número, Empresa, Cliente/Destino, Fechas relevantes, Estado actual.
        * **Línea de Tiempo de Progreso:** Visualiza los diferentes estados por los que ha pasado el elemento (orden o guía) con iconos y colores (`_construirTimelineOrden` y `_construirTimelineGuia`). Se muestran todos los estados posibles, y se pintan/destacan los completados y el estado actual.
        * **Detalle de Productos:** Para órdenes, muestra la lista de productos asociados.
  
    5.  **Manejo de Estados (Loading, Error):**
        * `loading`: Indica si alguna operación de carga está en curso (muestra un spinner).
        * `errorAlCargar`: Muestra mensajes de error si la carga de datos falla.
  
    ==========================================================================
    Ajustes y Correcciones Realizadas:
  
    * **Uso del nuevo endpoint `getOrdenesByEmpresaPeriodoConDestinos`:** El método `popularListaDeOrdenes` ahora utiliza este nuevo endpoint para obtener los datos de las órdenes.
    * **Procesamiento de la respuesta para órdenes:** La respuesta del nuevo endpoint se agrupa para consolidar la información de una orden con sus múltiples productos y campos de destino.
    * **Actualización de las cabeceras de la tabla de órdenes:** Se han ajustado para reflejar los nuevos campos disponibles como `NombreDestino` y `Fecha`.
    * **Visualización del modal de órdenes:** Se han añadido y ajustado los campos en el modal de detalle de órdenes para mostrar `DomicilioDestino`, `LocalidadDestino`, `CodigoPostalDestino`, `ObservacionesDestino`, `Valor` y las `Observaciones` de la orden.
    * **Manejo de productos en el modal de órdenes:** Se ha adaptado la sección de productos del modal para mostrar los datos devueltos por el nuevo endpoint (Barcode, CodeEmpresa, Precio, Alto, Ancho, Largo, Peso).
    * **Consistencia en nombres de campos:** Se ha verificado que los nombres de los campos utilizados en la plantilla (`item.Numero`, `item.NombreDestino`, `item.Fecha`, `item.Estado`) coincidan con los nombres de las propiedades en el objeto `item` después del procesamiento de `popularListaDeOrdenes`.
    * Se eliminó la llamada a `_obtenerDetalleProductos` para las órdenes, ya que la nueva API ya devuelve todos los productos anidados.
  
    ==========================================================================
    Dependencias de Vuex (asumidas):
    * `store`: Instancia global del store Vuex.
    * `store/empresas`: Módulo Vuex para cargar `listaEmpresas` y obtener configuración de `empresasV3`.
    * `store/ordenesV3`: Módulo Vuex para obtener y procesar datos de órdenes.
    * `store/guias`: Módulo Vuex para obtener y procesar datos de guías.
    * `store/roles`: Módulo Vuex para obtener roles de usuario (usado para `rolPermitido`).
  
    Componentes Externos:
    * `SelectorEmpresa`: Componente para la selección de empresas (se asume su existencia y funcionalidad).
  */
  
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import OrdenesTab from './components/OrdenesTab.vue'
import GuiasTab from './components/GuiasTab.vue'
import GuiasEmpresaTab from './components/GuiasEmpresaTab.vue'
import GuiaEmpresaModal from './components/GuiaEmpresaModal.vue'
import SeguimientoModal from './components/SeguimientoModal.vue'
import store from '@/store'
import ordenes from '@/store/ordenesV3' // Módulo Vuex para órdenes
import empresasV3 from '@/store/empresasV3' // Módulo Vuex para empresas
import roles from '@/store/roles' // Módulo Vuex para roles de usuario
import guias from '@/store/guias' // Importamos el módulo de guías
import excel from 'exceljs'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
  
  export default {
    name: 'SeguimientosOrdenesGuias', // Nuevo nombre para el componente
    components: { SelectorEmpresa, OrdenesTab, GuiasTab, GuiasEmpresaTab, SeguimientoModal, GuiaEmpresaModal },
    data() {
      return {
        tab: null, // Controla la pestaña activa ('tab-ordenes' o 'tab-guias'). Por defecto, null para que no se seleccione ninguna al inicio o la primera se activa si Vuetify lo hace.
        listaEmpresas: [], // Almacena la lista de empresas disponibles para el filtro.
        idEmpresa: -1, // ID de la empresa seleccionada en el filtro.
        empresaPorLote: false, // Propiedad de configuración de la empresa.
        empresaPosicionado: false, // Propiedad de configuración de la empresa.
        estaEmpresa: {}, // Objeto completo de la empresa seleccionada.
  
        fechaDesde: '', // Fecha de inicio para el filtro de rango.
        fechaHasta: '', // Fecha de fin para el filtro de rango.
  
        todasLasOrdenes: [], // Array que contiene todas las órdenes cargadas para la empresa y fechas.
        todasLasGuias: [], // Array que contiene todas las guías cargadas para la empresa y fechas.
  
        // ---------------------------------------
        // Definición de cabeceras de la tabla de Órdenes
        // Se utiliza para configurar las columnas de la v-data-table de órdenes.
        // ---------------------------------------
        cabecerasOrdenes: [
          { text: 'N° Orden', value: 'Numero', sortable: true }, // Cambiado a 'Numero'
          { text: 'Empresa', value: 'NombreEmpresa', sortable: true }, // Podrías necesitar mapear esto si no viene directamente
          { text: 'Cliente', value: 'NombreDestino', sortable: true }, // Nuevo campo
          { text: 'Fecha Creación', value: 'Fecha', sortable: true }, // Cambiado a 'Fecha' de la orden
          { text: 'Estado Actual', value: 'Estado', sortable: true },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false,
            align: 'center',
            width: '180px', // Ancho ajustado para el nuevo chip de seguimiento
          },
        ],
        // ---------------------------------------
        // Definición de cabeceras de la tabla de Guías
        // Se utiliza para configurar las columnas de la v-data-table de guías.
        // ---------------------------------------
        cabecerasGuias: [
          { text: 'N° Guía', value: 'Comprobante', sortable: true },
          { text: 'Empresa', value: 'NombreCliente', sortable: true },
          { text: 'Destino', value: 'NombreDestino', sortable: true },
          { text: 'Remito', value: 'Remitos', sortable: true },
          { text: 'Fecha Creación', value: 'FechaOriginal', sortable: true },
          { text: 'Estado Actual', value: 'Estado', sortable: true },
          {
            text: 'Acciones',
            value: 'acciones',
            sortable: false,
            align: 'center',
            width: '80px',
          },
        ],

        cabecerasGuiasEmpresa: [
          { text: 'Comprobante', value: 'Comprobante', sortable: true },
          { text: 'Destino', value: 'NombreDestino', sortable: true },
          { text: 'Bultos', value: 'Bultos', sortable: true },
          { text: 'Remitos', value: 'Remitos', sortable: true },
          { text: 'Fecha Entrega', value: 'FechaEntrega', sortable: true },
          { text: 'Fecha Creación', value: 'FechaOriginal', sortable: true },
          { text: 'Estado', value: 'Estado', sortable: true },
          { text: 'Acciones', value: 'acciones', sortable: false, align: 'center', width: '80px' },
        ],
  
        textoBusqueda: '', // Texto para el campo de búsqueda de órdenes.
        textoBusquedaGuias: '', // Texto para el campo de búsqueda de guías.
        loading: false, // Indica si alguna operación de carga está en curso.
        errorAlCargar: null, // Almacena mensajes de error durante la carga de datos.
  
        showModal: false, // Controla la visibilidad del modal de detalle.
        modalType: '', // 'orden' o 'guia', indica qué tipo de elemento se está mostrando en el modal.
        modalData: null, // Objeto con los datos del elemento (orden o guía) que se muestra en el modal.

        showGuiaEmpresaModal: false,
        guiaEmpresaModalData: null,
  
        rolPermitido: false, // Controla permisos basados en el rol del usuario.
        unidadesTotalesEnBase: 0, // Dato específico para clientes textiles (no relacionado con seguimiento general).
  
        // ---------------------------------------
        // Paginación de la tabla de Órdenes
        // ---------------------------------------
        pageOrdenes: 1, // Página actual de la tabla de órdenes.
        itemsPerPage: 30, // Número de ítems por página para órdenes.
        itemsPerPageOptions: [10, 30, 100, { text: 'Todos', value: -1 }], // Opciones para ítems por página.
  
        // ---------------------------------------
        // Paginación de la tabla de Guías
        // ---------------------------------------
        pageGuias: 1, // Página actual de la tabla de guías.
        itemsPerPageGuias: 30, // Número de ítems por página para guías.

        // ---------------------------------------
        // Paginación de la tabla de Guías por Empresa
        // ---------------------------------------
        pageGuiasEmpresa: 1,
        itemsPerPageGuiasEmpresa: 30,

        textoBusquedaGuiasEmpresa: '',
        todasLasGuiasEmpresa: [],
      }
    },
    computed: {
      /**
       * `ordenesFiltradasParaTabla`:
       * Propiedad computada que filtra la lista completa de órdenes (`todasLasOrdenes`)
       * según el campo de búsqueda de texto. Luego aplica la paginación manual.
       * @returns {Array} Array de órdenes filtradas y paginadas.
       */
      ordenesFiltradasParaTabla() {
        // Si no hay empresa seleccionada, no hay órdenes que mostrar.
        if (this.idEmpresa <= 0) return [];
  
        let filteredItems = this.todasLasOrdenes;
  
        // Filtrar por texto de búsqueda
        if (this.textoBusqueda) {
          const searchText = this.textoBusqueda.toLowerCase();
          filteredItems = filteredItems.filter(item => {
            // Busca en Numero, NombreDestino, Observaciones, NombreEstado, productos.NombreProducto
            return (
              item.Numero?.toLowerCase().includes(searchText) ||
              item.NombreDestino?.toLowerCase().includes(searchText) ||
              item.Observaciones?.toLowerCase().includes(searchText) ||
              item.NombreEstado?.toLowerCase().includes(searchText) ||
              item.productos?.some(p => p.NombreProducto?.toLowerCase().includes(searchText))
            );
          });
        }
  
        // Aplicar paginación manual a los resultados filtrados.
        if (this.itemsPerPage > 0) {
          const start = (this.pageOrdenes - 1) * this.itemsPerPage;
          return filteredItems.slice(start, start + this.itemsPerPage);
        } else {
          // Si la opción es "Todos" (value: -1), se devuelve toda la lista filtrada.
          return filteredItems;
        }
      },
  
      /**
       * `pageCountOrdenes`:
       * Calcula el número total de páginas para la paginación de órdenes,
       * basándose en la cantidad total de órdenes filtradas por búsqueda y los ítems por página.
       * @returns {number} Número total de páginas.
       */
      pageCountOrdenes() {
        if (this.itemsPerPage > 0) {
          const totalFilteredBySearch = this.ordenesFiltradasParaTabla.length; // Usar el largo de la lista ya filtrada por búsqueda
          return Math.ceil(totalFilteredBySearch / this.itemsPerPage);
        }
        return 1;
      },
  
      /**
       * `paginationInfoOrdenes`:
       * Genera la cadena de texto para mostrar la información de paginación
       * en el pie de la tabla de órdenes (ej. "Mostrando 1-30 de 100").
       * @returns {string} Información de paginación.
       */
      paginationInfoOrdenes() {
        const total = this.todasLasOrdenes.length; // Total de órdenes cargadas (sin filtros de búsqueda)
        if (this.itemsPerPage > 0) {
          const start = (this.pageOrdenes - 1) * this.itemsPerPage + 1;
          const end = Math.min(start + this.itemsPerPage - 1, total);
          return `${start}-${end} de ${total}`;
        } else {
          // Si se muestran todos los ítems, el rango es de 1 al total.
          return `1-${total} de ${total}`;
        }
      },
  
      /**
       * `guiasFiltradasParaTabla`:
       * Propiedad computada que filtra la lista completa de guías (`todasLasGuias`)
       * según la empresa seleccionada y el rango de fechas. Luego aplica la paginación manual.
       * Esta función solo prepara los datos para la tabla de guías.
       * @returns {Array} Array de guías filtradas y paginadas.
       */
      guiasFiltradasParaTabla() {
        // Si no hay empresa seleccionada, no hay guías que mostrar.
        if (this.idEmpresa <= 0) return []
  
        // 1) Filtrar por empresa seleccionada
        let filtrado = this.todasLasGuias.filter(
          (g) => g.IdEmpresa === this.idEmpresa
        )
  
        // Convertir strings de fecha a objetos Date para comparación.
        const fechaDesdeNormalized = this.normalizeDateToStartOfDay(this.fechaDesde);
        const fechaHastaNormalized = this.normalizeDateToStartOfDay(this.fechaHasta);
  
        // 2) Filtrar por rango de fechas (basado en `FechaOriginalDate` de la guía)
        if (fechaDesdeNormalized) {
          filtrado = filtrado.filter((g) => {
            const guiaDateNormalized = this.normalizeDateToStartOfDay(g.FechaOriginalDate);
            return guiaDateNormalized && guiaDateNormalized.getTime() >= fechaDesdeNormalized.getTime();
          });
        }
        if (fechaHastaNormalized) {
          filtrado = filtrado.filter((g) => {
            const guiaDateNormalized = this.normalizeDateToStartOfDay(g.FechaOriginalDate);
            return guiaDateNormalized && guiaDateNormalized.getTime() <= fechaHastaNormalized.getTime();
          });
        }
        
        // 3) Filtrar por texto de búsqueda para guías
        if (this.textoBusquedaGuias) {
          const searchText = this.textoBusquedaGuias.toLowerCase();
          filtrado = filtrado.filter(item => {
            return (
              item.Comprobante?.toLowerCase().includes(searchText) ||
              item.NombreCliente?.toLowerCase().includes(searchText) ||
              item.NombreDestino?.toLowerCase().includes(searchText) ||
              item.Remitos?.toLowerCase().includes(searchText) ||
              item.Estado?.toLowerCase().includes(searchText)
            );
          });
        }
  
        // 4) Aplicar paginación manual a los resultados filtrados.
        if (this.itemsPerPageGuias > 0) {
          const start = (this.pageGuias - 1) * this.itemsPerPageGuias
          return filtrado.slice(start, start + this.itemsPerPageGuias)
        } else {
          // Si la opción es "Todos" (value: -1), se devuelve toda la lista filtrada.
          return filtrado
        }
      },
  
      /**
       * `pageCountGuias`:
       * Calcula el número total de páginas para la paginación de guías,
       * basándose en la cantidad total de guías filtradas y los ítems por página.
       * @returns {number} Número total de páginas.
       */
      pageCountGuias() {
        if (this.itemsPerPageGuias > 0) {
          // Usa el largo de la lista ya filtrada por búsqueda para calcular las páginas
          const total = this.guiasFiltradasParaTabla.length; 
          return Math.ceil(total / this.itemsPerPageGuias)
        }
        return 1 // Si no hay ítems por página definidos, se asume 1 página.
      },
  
      /**
       * `paginationInfoGuias`:
       * Genera la cadena de texto para mostrar la información de paginación
       * en el pie de la tabla de guías (ej. "Mostrando 1-30 de 100").
       * @returns {string} Información de paginación.
       */
      paginationInfoGuias() {
        // Calcula el total de guías filtradas por empresa y fecha (sin filtro de búsqueda)
        const total = this.todasLasGuias.filter(
          (g) => g.IdEmpresa === this.idEmpresa
        ).length
        if (this.itemsPerPageGuias > 0) {
          const start = (this.pageGuias - 1) * this.itemsPerPageGuias + 1
          const end = Math.min(start + this.itemsPerPageGuias - 1, total)
          return `${start}-${end} de ${total}`
        } else {
          // Si se muestran todos los ítems, el rango es de 1 al total.
          return `1-${total} de ${total}`
        }
      },

      guiasEmpresaFiltradasParaTabla() {
        if (this.idEmpresa <= 0) return []

        let filtrado = this.todasLasGuiasEmpresa

        // Mostrar solo las guías entregadas
        filtrado = filtrado.filter(
          g => String(g.Estado).toUpperCase() === 'ENTREGADO'
        )

        const fechaDesdeNormalized = this.normalizeDateToStartOfDay(this.fechaDesde)
        const fechaHastaNormalized = this.normalizeDateToStartOfDay(this.fechaHasta)

        if (fechaDesdeNormalized) {
          filtrado = filtrado.filter(g => {
            const f = this.normalizeDateToStartOfDay(g.FechaOriginalDate)
            return f && f.getTime() >= fechaDesdeNormalized.getTime()
          })
        }
        if (fechaHastaNormalized) {
          filtrado = filtrado.filter(g => {
            const f = this.normalizeDateToStartOfDay(g.FechaOriginalDate)
            return f && f.getTime() <= fechaHastaNormalized.getTime()
          })
        }

        if (this.textoBusquedaGuiasEmpresa) {
          const searchText = this.textoBusquedaGuiasEmpresa.toLowerCase()
          filtrado = filtrado.filter(item => {
            return (
              item.Comprobante?.toLowerCase().includes(searchText) ||
              item.NombreDestino?.toLowerCase().includes(searchText) ||
              item.Remitos?.toLowerCase().includes(searchText) ||
              item.Estado?.toLowerCase().includes(searchText)
            )
          })
        }

        if (this.itemsPerPageGuiasEmpresa > 0) {
          const start = (this.pageGuiasEmpresa - 1) * this.itemsPerPageGuiasEmpresa
          return filtrado.slice(start, start + this.itemsPerPageGuiasEmpresa)
        }
        return filtrado
      },

      pageCountGuiasEmpresa() {
        if (this.itemsPerPageGuiasEmpresa > 0) {
          const total = this.guiasEmpresaFiltradasParaTabla.length
          return Math.ceil(total / this.itemsPerPageGuiasEmpresa)
        }
        return 1
      },

      paginationInfoGuiasEmpresa() {
        const total = this.todasLasGuiasEmpresa.length
        if (this.itemsPerPageGuiasEmpresa > 0) {
          const start = (this.pageGuiasEmpresa - 1) * this.itemsPerPageGuiasEmpresa + 1
          const end = Math.min(start + this.itemsPerPageGuiasEmpresa - 1, total)
          return `${start}-${end} de ${total}`
        }
        return `1-${total} de ${total}`
      },
  
      /**
       * `timelineStepsComputed`:
       * Propiedad computada que determina qué línea de tiempo se debe construir
       * y mostrar en el modal (si es una orden o una guía), basándose en `modalType`.
       * @returns {Array} Array de pasos de la línea de tiempo.
       */
      timelineStepsComputed() {
        // Si no hay datos en el modal, no hay línea de tiempo que mostrar.
        if (!this.modalData) return [];
        // Si el modal es de tipo 'orden', usa la función de timeline de órdenes.
        if (this.modalType === 'orden') {
          return this._construirTimelineOrden(this.modalData);
        }
        // Si el modal es de tipo 'guia', usa la función de timeline de guías.
        else if (this.modalType === 'guia') {
          return this._construirTimelineGuia(this.modalData);
        }
        return []; // Si no es ni orden ni guía, devuelve un array vacío.
      }
    },
    methods: {
      /**
       * `normalizeDateToStartOfDay`:
       * Método auxiliar para tomar una cadena de fecha o un objeto Date y devolver
       * un nuevo objeto Date normalizado al inicio del día (00:00:00.000).
       * Esto es crucial para realizar comparaciones de fechas precisas sin problemas de zona horaria
       * o la mutación inesperada del objeto original.
       * @param {string|Date} dateInput - La fecha a normalizar.
       * @returns {Date|null} Un nuevo objeto Date normalizado o null si la entrada es inválida.
       */
      normalizeDateToStartOfDay(dateInput) {
        if (!dateInput) return null;
        const date = new Date(dateInput);
        // setHours modifica el objeto Date y devuelve el timestamp.
        // Para evitar el TypeError, simplemente modificamos el objeto y luego lo usamos.
        date.setHours(0, 0, 0, 0);
        return date; // Retorna el objeto Date modificado
      },
  
      /**
       * `fetchEmpresas`:
       * Método asíncrono para cargar la lista de empresas activas desde Vuex.
       * Almacena el resultado en `this.listaEmpresas`.
       */
      async fetchEmpresas() {
        console.log("fetchEmpresas: Iniciando carga de empresas.");
        try {
          // Dispara la acción Vuex para cargar la lista de empresas.
          await store.dispatch('empresas/cargarListaEmpresas', 'SoloActivas');
          // Asigna la lista de empresas del store localmente.
          this.listaEmpresas = store.state.empresas.listaEmpresas || [];
          console.log("fetchEmpresas: Empresas cargadas exitosamente:", this.listaEmpresas.length);
        } catch (error) {
          console.error("fetchEmpresas: Error al cargar empresas:", error);
          this.listaEmpresas = []; // En caso de error, la lista queda vacía.
        }
      },
  
      /**
       * `eligioEmpresa`:
       * Método que se ejecuta cuando el usuario selecciona una empresa del `SelectorEmpresa`.
       * Realiza la configuración inicial para la empresa seleccionada y recarga las listas.
       * @param {number} idEmpresa - El ID de la empresa seleccionada.
       */
      async eligioEmpresa(idEmpresa) {
        console.log("eligioEmpresa: Empresa seleccionada con ID:", idEmpresa);

        const id = Number(idEmpresa)
        if (isNaN(id) || id <= 0) {
          this.mostrarError('Seleccione una empresa válida')
          return
        }
        // Limpia los datos del modal y lo oculta.
        this.modalData = null;
        this.showModal = false;
        this.errorAlCargar = null; // Limpia mensajes de error previos.

        try {
          // Obtiene la configuración detallada de la empresa seleccionada.
          const resp = await empresasV3.getOneById(id);
          console.log("eligioEmpresa: Configuración de empresa recibida:", resp);
          // Asigna propiedades de la empresa (configuración, lote, stock).
          this.estaEmpresa = resp;
          this.empresaPosicionado = resp.StockPosicionado;
          this.empresaPorLote = resp.LOTE;
  
          // Si es un cliente textil, obtiene las unidades totales en base.
          if (resp.ClienteTextil === true) {
            this.unidadesTotalesEnBase = await ordenes.contadorBultosDia(
              idEmpresa,
              this.getHoy()
            );
            console.log("eligioEmpresa: Unidades totales en base (cliente textil):", this.unidadesTotalesEnBase);
          } else {
            this.unidadesTotalesEnBase = 0;
          }
        } catch (error) {
          console.error("eligioEmpresa: Error al configurar empresa:", error);
          // Restablece las propiedades de la empresa en caso de error.
          this.estaEmpresa = {};
          this.empresaPosicionado = false;
          this.empresaPorLote = false;
          this.unidadesTotalesEnBase = 0;
          this.errorAlCargar = "No se pudo cargar la configuración de la empresa.";
        }
  
        // Actualiza el ID de la empresa seleccionada y reinicia las paginaciones.
        this.idEmpresa = id;
        this.pageOrdenes = 1;
        this.pageGuias = 1;
        // Llama a la función para cargar ambas listas (órdenes y guías).
        await this.popularAmbasListas();
      },
  
      /**
       * `popularAmbasListas`:
       * Método asíncrono que coordina la carga de órdenes y guías en paralelo.
       * Se dispara cuando cambian la empresa o las fechas de filtro.
       */
      async popularAmbasListas() {
        console.log("popularAmbasListas: Iniciando carga de datos...");
        console.log("Parámetros actuales:", {
          idEmpresa: this.idEmpresa,
          fechaDesde: this.fechaDesde,
          fechaHasta: this.fechaHasta
        });
        
        // Solo procede si hay una empresa y fechas de filtro válidas.
        if (this.idEmpresa > 0 && this.fechaDesde && this.fechaHasta) {
          console.log("popularAmbasListas: Parámetros válidos, iniciando carga...");
          this.loading = true; // Activa el spinner de carga general.
          this.errorAlCargar = null; // Limpia errores previos.
          
          try {
            console.log("popularAmbasListas: Iniciando carga en paralelo de órdenes y guías...");
            
            // Ejecuta ambas funciones de carga en paralelo usando `Promise.all`.
            await Promise.all([
              this.popularListaDeOrdenes().catch(error => {
                console.error("Error en popularListaDeOrdenes:", error);
                throw error; // Relanza el error para manejarlo en el catch externo
              }),
              this.popularListaDeGuias().catch(error => {
                console.error("Error en popularListaDeGuias:", error);
                throw error; // Relanza el error para manejarlo en el catch externo
              }),
              this.popularListaGuiasEmpresa().catch(error => {
                console.error('Error en popularListaGuiasEmpresa:', error)
                throw error
              })
            ]);
            
            console.log("popularAmbasListas: Carga de órdenes y guías completada exitosamente.");
          } catch (error) {
            console.error("popularAmbasListas: Error al cargar datos:", {
              error: error,
              message: error.message,
              stack: error.stack,
              response: error.response?.data || 'No hay datos de respuesta'
            });
            
            // Muestra un mensaje de error más descriptivo
            const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error al cargar los datos. Intente nuevamente.";
            this.errorAlCargar = errorMessage;
            
            // Si es un error de autenticación, redirigir al login
            if (error.response?.status === 401) {
              console.warn("Sesión expirada, redirigiendo a login...");
              this.$router.push('/login');
            }
            
            // Limpia las listas para asegurar consistencia
            this.todasLasOrdenes = [];
            this.todasLasGuias = [];
          } finally {
            console.log("popularAmbasListas: Finalizando carga, desactivando spinner...");
            this.loading = false; // Desactiva el spinner de carga.
          }
        } else {
          console.log("popularAmbasListas: No hay empresa o fechas seleccionadas, limpiando listas.", {
            tieneEmpresa: this.idEmpresa > 0,
            tieneFechaDesde: !!this.fechaDesde,
            tieneFechaHasta: !!this.fechaHasta
          });
          
          // Si no hay filtros válidos, limpia las listas y los estados de carga/error.
          this.todasLasOrdenes = [];
          this.todasLasGuias = [];
          this.errorAlCargar = null;
          this.loading = false;
        }
      },
  
      /**
       * `popularListaDeOrdenes`:
       * Método asíncrono para cargar y procesar la lista de órdenes usando el nuevo endpoint.
       * Filtra las órdenes por empresa y rango de fechas, las formatea y las ordena.
       */
      async popularListaDeOrdenes() {
        console.log("popularListaDeOrdenes: Iniciando carga de órdenes con el nuevo endpoint.");
        console.log("Parámetros actuales:", {
          idEmpresa: this.idEmpresa,
          fechaDesde: this.fechaDesde,
          fechaHasta: this.fechaHasta,
          usuarioActual: store.state.usuarios.usuarioActual
        });
        
        this.todasLasOrdenes = []; // Limpia la lista de órdenes antes de la carga.
  
        // Bloque para verificar roles de usuario (se mantiene del código original).
        try {
          const userId = store.state.usuarios.usuarioActual?.Id;
          console.log("popularListaDeOrdenes: Obteniendo roles para userId:", userId);
          
          if (!userId) {
            console.error("No se pudo obtener el ID del usuario actual");
            throw new Error('No se pudo identificar al usuario actual');
          }
          
          const rolesUser = await roles.getUserRolesById(userId);
          console.log("Roles del usuario:", rolesUser);
          
          this.rolPermitido =
            !store.state.usuarios.usuarioActual?.IdEmpresa &&
            rolesUser?.[0]?.IdRole === 1;
            
          console.log("popularListaDeOrdenes: rolPermitido:", this.rolPermitido);
        } catch (error) {
          console.error("popularListaDeOrdenes: Error al verificar roles de usuario:", error);
          this.rolPermitido = false;
        }
  
        try {
          console.log(`popularListaDeOrdenes: Llamando a ordenes.getOrdenesByEmpresaPeriodoConDestinos para idEmpresa: ${this.idEmpresa}, fechas: ${this.fechaDesde} a ${this.fechaHasta}`);
          
          console.log("Llamando a getOrdenesByEmpresaPeriodoConDestinos con:", {
            idEmpresa: this.idEmpresa,
            fechaDesde: this.fechaDesde,
            fechaHasta: this.fechaHasta
          });
          
          // Llama al nuevo método del servicio de órdenes
          let response;
          try {
            console.log(`Solicitando órdenes para empresa ${this.idEmpresa} desde ${this.fechaDesde} hasta ${this.fechaHasta}`);
            response = await ordenes.getOrdenesByEmpresaPeriodoConDestinos(this.idEmpresa, this.fechaDesde, this.fechaHasta);
            
            // Depuración profunda de la respuesta
            console.log("Respuesta recibida:", response);
            console.log("Tipo de respuesta:", typeof response);
            console.log("Es array?", Array.isArray(response));
            console.log("Tiene propiedad status?", response && 'status' in response);
            console.log("Tiene propiedad data?", response && 'data' in response);
            console.log("Data es array?", response && response.data && Array.isArray(response.data));
            
          } catch (apiError) {
            console.error("Error en la llamada a getOrdenesByEmpresaPeriodoConDestinos:", {
              error: apiError,
              message: apiError.message,
              stack: apiError.stack,
              response: apiError.response?.data || 'No hay datos de respuesta'
            });
            throw new Error('Error al conectar con el servidor. Verifica tu conexión e intenta nuevamente.');
          }
  
          let data = [];
          
          // Manejo de la respuesta según el formato esperado
          if (response && response.status === 'OK' && Array.isArray(response.data)) {
            // Formato esperado: {status: 'OK', data: [...]}
            console.log(`Se recibieron ${response.data.length} órdenes del servidor`);
            data = response.data;
            
            // Verificar si hay errores en la respuesta
            if (response.errors && response.errors.length > 0) {
              console.warn('La respuesta contiene errores:', response.errors);
            }
          } else if (response && Array.isArray(response)) {
            // Si por alguna razón la respuesta es directamente un array
            console.warn('La respuesta es un array directo, no el formato esperado. Total de órdenes:', response.length);
            data = response;
          } else if (response && response.data === undefined) {
            // Si la respuesta no tiene data, asumimos array vacío
            console.log("La respuesta no contiene datos (array vacío)");
            data = [];
          } else {
            // Formato inesperado
            console.error("Formato de respuesta inesperado:", response);
            // Lanzamos un error más descriptivo
            throw new Error('Formato de respuesta inesperado del servidor. Contacte a soporte.');
          }
          
          console.log(`Total de órdenes a procesar: ${data.length}`);
  
          // Agrupar los datos por IdOrden y consolidar los productos
          const ordenesAgrupadas = {};
          data.forEach(item => {
            if (!ordenesAgrupadas[item.IdOrden]) {
              ordenesAgrupadas[item.IdOrden] = {
                IdOrden: item.IdOrden,
                Numero: item.Numero,
                Fecha: item.Fecha, // Fecha de la orden (que ahora es la fecha de distribución/retiro)
                Estado: item.Estado, // Estado numérico
                Tipo: item.Tipo,
                preOrden: item.preOrden,
                retira_cliente: item.retira_cliente,
                Valor: item.Valor,
                Observaciones: item.Observaciones,
                id_integracion: item.id_integracion,
                IdDestino: item.IdDestino,
                NombreDestino: item.NombreDestino,
                DomicilioDestino: item.DomicilioDestino,
                LocalidadDestino: item.LocalidadDestino,
                CodigoPostalDestino: item.CodigoPostalDestino,
                ObservacionesDestino: item.ObservacionesDestino,
                IdEmpresaDestino: item.IdEmpresaDestino,
                // Propiedades de la empresa de la orden (si vinieran por este endpoint, si no, se usan las del componente)
                // Aquí asumo que la empresa de la orden es this.estaEmpresa
                NombreEmpresa: this.estaEmpresa.RazonSocial || 'N/A', 
                // Para la guía asociada, necesitamos buscarla o determinarla si viene en el JSON
                IdGuia: item.IdGuia || -1, // Asumo que el IdGuia viene en el item
                productos: [] // Inicializamos el array de productos
              };
            }
            // Agregamos el producto a la orden correspondiente
            ordenesAgrupadas[item.IdOrden].productos.push({
              IdDetalle: item.IdDetalle,
              Unidades: item.Unidades,
              Precio: item.Precio,
              loteCompleto: item.loteCompleto,
              IdProducto: item.IdProducto,
              Barcode: item.Barcode,
              NombreProducto: item.NombreProducto,
              CodeEmpresa: item.CodeEmpresa,
              Alto: item.Alto,
              Ancho: item.Ancho,
              Largo: item.Largo,
              Peso: item.Peso
              // Si hay campos como 'lote' o 'Partida' en el JSON original para los productos, agrégalos aquí.
              // Por ejemplo: lote: item.lote, Partida: item.Partida
            });
          });
  
          let todasOrdenes = Object.values(ordenesAgrupadas);
          console.log("popularListaDeOrdenes: Órdenes agrupadas y productos consolidados:", todasOrdenes.length);
  
          // Formatea los datos de cada orden para su visualización en la tabla.
          todasOrdenes.forEach((o) => {
            // La 'Fecha' que viene es la Fecha de distribución/retiro.
            // Para la "Fecha Creación" en la tabla, usaremos la "Fecha" del JSON que representa la Fecha de la orden
            // (que en este nuevo endpoint es la fecha de distribución/retiro).
            // Si necesitas la fecha de AltaRegistro para la columna "Fecha Creación", cámbialo aquí.
            o.Fecha = o.Fecha ? new Date(o.Fecha).toLocaleDateString('es-AR') : 'N/A';
            // o.AltaRegistro = o.AltaRegistro ? new Date(o.AltaRegistro).toLocaleDateString('es-AR') : 'N/A'; // Si quieres usar AltaRegistro
  
            // Traduce el estado numérico de la orden a un estado textual legible.
            switch (o.Estado) {
              case 1: o.NombreEstado = 'Pendiente'; break;
              case 2: o.NombreEstado = 'Preparado'; break;
              case 3: o.NombreEstado = 'A distribuciòn'; break; // Estado textual que indica que tiene guía
              case 4: o.NombreEstado = 'Anulado'; break;
              case 5: o.NombreEstado = 'Retira Cliente'; break;
              default: o.NombreEstado = `Desconocido (${o.Estado})`;
            }
            // Asigna el estado textual al campo `Estado` que la tabla usa para la columna.
            o.Estado = o.NombreEstado; // Para la tabla
  
            o.tipo = o.preOrden === true || o.preOrden === 1 ? 'Pre-Orden' : 'Orden';
            o.preOrdenDisplay = o.tipo;
  
            // Aseguramos que IdGuia esté presente, aunque puede ser -1 si no hay guía
            o.IdGuia = o.IdGuia || -1;
          });
  
          // Ordena las órdenes por fecha de la orden de forma descendente (más recientes primero).
          // Usamos la propiedad 'Fecha' que ya ha sido procesada y formateada como fecha de la orden.
          todasOrdenes.sort(
            (a, b) => {
              const dateA = new Date(a.Fecha.split('/').reverse().join('-')); // Convertir a formato YYYY-MM-DD para Date
              const dateB = new Date(b.Fecha.split('/').reverse().join('-'));
              return dateB.getTime() - dateA.getTime();
            }
          );
  
          this.todasLasOrdenes = todasOrdenes;
          console.log("popularListaDeOrdenes: Total de órdenes procesadas y listas para la tabla:", this.todasLasOrdenes.length);
        } catch (error) {
          console.error("popularListaDeOrdenes: Error al cargar órdenes:", error);
          throw new Error('No se pudieron cargar las órdenes. Intente nuevamente.');
        }
      },
  
      /**
       * `popularListaDeGuias`:
       * Método asíncrono para cargar y procesar la lista de guías.
       * Utiliza el endpoint `getByPeriodoIdEmpresa` para obtener las guías.
       */
      async popularListaDeGuias() {
        console.log("popularListaDeGuias: Iniciando carga de guías.");
        this.todasLasGuias = []; // Limpia la lista de guías antes de la carga.
        try {
          // Llama al servicio de guías para obtenerlas por periodo y ID de empresa.
          console.log(`popularListaDeGuias: Llamando a guias.getByPeriodoIdEmpresa con fechaDesde: ${this.fechaDesde}, fechaHasta: ${this.fechaHasta}, idEmpresa: ${this.idEmpresa}`);
          const response = await guias.getByPeriodoIdEmpresa(this.fechaDesde, this.fechaHasta, this.idEmpresa);
          console.log("popularListaDeGuias: Respuesta de guias.getByPeriodoIdEmpresa recibida:", response);
  
          let todas = [];
          // Verifica el formato de la respuesta para obtener los datos.
          if (response && response.status === 'OK' && Array.isArray(response.data)) {
            todas = response.data;
          } else if (Array.isArray(response)) {
            todas = response; // Si la respuesta ya es el array directamente.
          } else {
            // Lanza un error si el formato es inesperado.
            throw new Error('Formato de guías inesperado. Contacte a soporte.');
          }
  
          // Formatea los datos de cada guía para su visualización en la tabla.
          todas.forEach((g) => {
            g.FechaOriginalDate = new Date(g.FechaOriginal); // Crea un objeto Date para facilitar filtros y ordenamiento.
            g.FechaOriginal = g.FechaOriginal ? new Date(g.FechaOriginal).toLocaleDateString('es-AR') : 'N/A'; // Formatea la fecha original.
            g.NombreCliente = g.NombreCliente || 'N/A';
            g.NombreDestino = g.NombreDestino || 'N/A';
            g.Remitos = g.Remitos || 'N/A';
            g.Estado = g.Estado || 'Desconocido'; // Asegura que el estado exista y sea textual.
          });
  
          // Ordena las guías por fecha de creación de forma descendente.
          todas.sort((a, b) => b.FechaOriginalDate.getTime() - a.FechaOriginalDate.getTime());
          this.todasLasGuias = todas;
          console.log("popularListaDeGuias: Total de guías procesadas:", this.todasLasGuias.length);
        } catch (error) {
          console.error("popularListaDeGuias: Error al cargar guías:", error);
          // Lanza el error para que `popularAmbasListas` lo capture.
          throw new Error('No se pudieron cargar las guías. Intente nuevamente.');
        }
      },

      async popularListaGuiasEmpresa() {
        console.log('popularListaGuiasEmpresa: Iniciando carga')
        this.todasLasGuiasEmpresa = []
        try {
          const response = await guias.getByPeriodoIdEmpresa(this.fechaDesde, this.fechaHasta, this.idEmpresa)
          let todas = []
          if (response && response.status === 'OK' && Array.isArray(response.data)) {
            todas = response.data
          } else if (Array.isArray(response)) {
            todas = response
          } else {
            throw new Error('Formato de guías inesperado')
          }

          todas.forEach(g => {
            g.FechaOriginalDate = new Date(g.FechaOriginal)
            g.FechaOriginal = g.FechaOriginal ? new Date(g.FechaOriginal).toLocaleDateString('es-AR') : 'N/A'
            g.FechaEntrega = g.FechaEntrega ? new Date(g.FechaEntrega).toLocaleDateString('es-AR') : 'N/A'
            g.Bultos = g.Bultos || 0
            g.Remitos = g.Remitos || 'N/A'
            g.Estado = g.Estado || 'Desconocido'
          })

          todas.sort((a, b) => b.FechaOriginalDate.getTime() - a.FechaOriginalDate.getTime())
          this.todasLasGuiasEmpresa = todas
          console.log('popularListaGuiasEmpresa: Total', this.todasLasGuiasEmpresa.length)
        } catch (error) {
          console.error('popularListaGuiasEmpresa: Error', error)
          throw new Error('No se pudieron cargar las guías por empresa')
        }
      },
  
      /**
       * `verGuiaAsociada`:
       * Método que se dispara al hacer clic en el chip "Seguimiento aquí" de una orden.
       * Cambia a la pestaña de guías y abre el modal de detalle de la guía asociada.
       * @param {object} ordenItem - El objeto completo de la orden desde la tabla.
       */
      async verGuiaAsociada(ordenItem) {
        console.log("verGuiaAsociada: Intentando ver guía asociada para orden:", ordenItem.Numero, "IdGuia:", ordenItem.IdGuia);
        // Asegura que hay un IdGuia válido.
        if (ordenItem.IdGuia > 0) {
          // Busca la guía correspondiente en la lista de guías ya cargadas.
          const guiaAsociada = this.todasLasGuias.find(g => g.Id === ordenItem.IdGuia);
  
          if (guiaAsociada) {
            console.log("verGuiaAsociada: Guía asociada encontrada localmente:", guiaAsociada.Comprobante);
            this.tab = 'tab-guias'; // Cambia a la pestaña de Guías.
            // Abre el modal de la guía, pasando el objeto completo de la guía.
            await this.openModal('guia', guiaAsociada);
          } else {
            // Si por alguna razón la guía no está en `todasLasGuias` (ej. fue cargada fuera del rango de fechas de guías),
            // se intenta obtenerla directamente de la API.
            console.warn("verGuiaAsociada: Guía asociada no encontrada en la lista local. Intentando obtener de la API.");
            try {
              const response = await guias.getById(ordenItem.IdGuia);
              const retrievedGuia = (response && response.data) ? response.data : (response && response.Id ? response : null);
              if (retrievedGuia) {
                console.log("verGuiaAsociada: Guía obtenida de la API:", retrievedGuia.Comprobante);
                // Si se obtuvo, la agrega a la lista de guías (opcional, para futuras interacciones)
                // y abre el modal.
                // Formatea la fecha de la guía obtenida directamente para que sea consistente con la lista.
                retrievedGuia.FechaOriginal = retrievedGuia.FechaOriginal ? new Date(retrievedGuia.FechaOriginal).toLocaleDateString('es-AR') : 'N/A';
                retrievedGuia.Estado = retrievedGuia.Estado || 'Desconocido';
                this.todasLasGuias.push(retrievedGuia); // Añade la guía a la lista para que se muestre en la tabla si corresponde
                this.tab = 'tab-guias';
                await this.openModal('guia', retrievedGuia);
              } else {
                this.errorAlCargar = "No se pudo encontrar la guía asociada.";
                console.error("verGuiaAsociada: No se pudo obtener la guía de la API.");
              }
            } catch (error) {
              this.errorAlCargar = `Error al cargar la guía asociada: ${error.message || error}`;
              console.error("verGuiaAsociada: Error al intentar obtener guía de la API:", error);
            }
          }
        } else {
          console.warn("verGuiaAsociada: La orden no tiene un IdGuia válido.");
          this.errorAlCargar = "Esta orden no tiene una guía asociada para seguimiento.";
        }
      },
  
      /**
       * `openModal`:
       * Método asíncrono que se dispara al hacer clic en el ícono "ojo" de una fila.
       * Carga los detalles del elemento (orden o guía) y los muestra en un modal.
       * @param {string} type - 'orden' o 'guia', indica el tipo de elemento a abrir.
       * @param {number|object} item - Para 'orden', es el ID de la orden. Para 'guia', es el objeto completo de la guía.
       */
      async openModal(type, item) {
        console.log(`openModal: Abriendo modal para tipo: ${type}, item:`, item);
        this.modalData = null; // Limpia datos de modal previos.
        this.loading = true; // Activa el spinner dentro del modal.
        this.errorAlCargar = null; // Limpia errores previos.
        this.modalType = type; // Establece el tipo del modal (orden/guía).
  
        try {
          let dataToModal;
          if (type === 'orden') {
            // Si es una orden, se espera que `item` sea el ID de la orden.
            // Buscamos la orden directamente de `todasLasOrdenes` que ya contiene todos los detalles.
            const found = this.todasLasOrdenes.find(o => o.IdOrden === item);
            dataToModal = found ? JSON.parse(JSON.stringify(found)) : null;

            if (dataToModal) {
              // Los productos ya vienen agrupados en dataToModal.productos
              // Formatea fechas específicas de la orden para el modal sin afectar la lista original.
              dataToModal.Fecha = dataToModal.Fecha ? new Date(dataToModal.Fecha).toLocaleDateString('es-AR') : 'N/A';
              // No necesitamos FechaCreacion, FechaPreparado, FechaDistribucion si ya se usa 'Fecha' como la principal
              // Mapeo de estado numérico a textual
              switch (dataToModal.Estado) {
                case 1: dataToModal.NombreEstado = 'Pendiente'; break;
                case 2: dataToModal.NombreEstado = 'Preparado'; break;
                case 3: dataToModal.NombreEstado = 'A distribuciòn'; break;
                case 4: dataToModal.NombreEstado = 'Anulado'; break;
                case 5: dataToModal.NombreEstado = 'Retira Cliente'; break;
                default: dataToModal.NombreEstado = `Desconocido (${dataToModal.Estado})`;
              }
              dataToModal.NombreEmpresa = dataToModal.NombreEmpresa || this.estaEmpresa.RazonSocial || 'N/A';
              console.log("openModal: Datos de orden para modal procesados:", dataToModal);
            } else {
              throw new Error('No se encontraron detalles válidos para esta orden.');
            }
          } else if (type === 'guia') {
            // Para las guías, obtenemos el detalle completo desde la API utilizando su Id.
            console.log("openModal: Procesando datos de guía para modal:", item);

            const response = await guias.getById(item.Id);
            const guiaCompleta = (response && response.data)
              ? response.data
              : (response && response.Id ? response : null);

            if (!guiaCompleta) {
              throw new Error('No se encontraron detalles válidos para esta guía.');
            }

            dataToModal = { ...item, ...guiaCompleta };
            dataToModal.productos = Array.isArray(guiaCompleta.productos) ? guiaCompleta.productos : [];

            // Formatea fechas específicas de la guía para el modal.
            dataToModal.FechaOriginal = dataToModal.FechaOriginal ? new Date(dataToModal.FechaOriginal).toLocaleDateString('es-AR') : 'N/A';
            // Para la fecha de no entrega, se usa la `Fecha` de la guía si el estado es `NO ENTREGADO`.
            if (dataToModal.Estado === 'NO ENTREGADO' && dataToModal.Fecha) {
              dataToModal.FechaNoEntregado = new Date(dataToModal.Fecha).toLocaleDateString('es-AR');
            } else {
              dataToModal.FechaNoEntregado = 'N/A';
            }

            console.log("openModal: Datos de guía para modal procesados:", dataToModal);
          }
  
          // Si se obtuvieron datos válidos para el modal, los asigna y lo muestra.
          if (dataToModal && (dataToModal.IdOrden || dataToModal.Id)) { // IdOrden para ordenes, Id para guias
            this.modalData = dataToModal;
            this.showModal = true;
            console.log("openModal: Modal abierto con datos.");
          } else {
            // Si `dataToModal` es nulo o incompleto después de la lógica, se lanza un error.
            throw new Error('No se encontraron detalles o la respuesta fue inválida.');
          }
        } catch (error) {
          console.error("openModal: Error al cargar detalles del modal:", error);
          this.errorAlCargar = error.message || 'Error al cargar los detalles. Intente nuevamente.';
        } finally {
          this.loading = false; // Desactiva el spinner del modal.
          console.log("openModal: Loading finalizado.");
        }
      },

      openGuiaEmpresaModal(item) {
        this.guiaEmpresaModalData = item
        this.showGuiaEmpresaModal = true
      },

      closeGuiaEmpresaModal() {
        this.guiaEmpresaModalData = null
        this.showGuiaEmpresaModal = false
      },
  
      /**
       * `_obtenerDetalleProductos`: (Método obsoleto para el nuevo endpoint, se mantiene para contexto)
       * Este método ya no es necesario para las órdenes si la API `getOrdenesByEmpresaPeriodoConDestinos`
       * ya devuelve los detalles de los productos anidados.
       */
      async _obtenerDetalleProductos(orden) {
        console.warn("_obtenerDetalleProductos: Este método ya no debería ser necesario si la API devuelve los productos directamente en la orden.");
        // Se podría retornar orden.productos si existiera en la respuesta original del getById o dejarlo vacío.
        return orden.productos || []; 
      },
  
      /**
       * `_construirTimelineOrden`:
       * Método auxiliar para construir la línea de tiempo de una ORDEN.
       * Define los pasos del proceso, sus iconos, fechas y clases de estado
       * (`completed`, `current`, `current-bad`, `pending`) según el estado actual de la orden.
       * Muestra todos los estados posibles, pintando los completados y el actual.
       * @param {object} orden - El objeto de la orden para construir su línea de tiempo.
       * @returns {Array} Array de objetos que representan los pasos de la línea de tiempo.
       */
      _construirTimelineOrden(orden) {
        console.log("_construirTimelineOrden: Construyendo timeline para orden:", orden.Numero, "Estado:", orden.NombreEstado);
        const timelineSteps = [];
        const currentStatusText = orden.NombreEstado; // El estado ya está en formato textual.
        const isAnulada = currentStatusText === 'Anulado';
        const isPreOrden = orden.Tipo === 0 || orden.preOrden === 1; // Usar Tipo 0 para Pre-Orden
        const isRetiraCliente = currentStatusText === 'Retira Cliente' || orden.retira_cliente === 1; // Usar el campo retira_cliente
  
        // Fechas desde la respuesta del nuevo endpoint
        const fechaOrden = orden.Fecha ? new Date(orden.Fecha).toLocaleDateString('es-AR') : 'N/A'; // Fecha de la orden
        const fechaAltaRegistro = orden.AltaRegistro ? new Date(orden.AltaRegistro).toLocaleDateString('es-AR') : 'N/A';
  
        if (isAnulada) {
          // Si la orden está anulada, solo se muestra el paso de anulación con estado 'current-bad'.
          timelineSteps.push({
            id: 'anulado',
            nombre: 'Orden Anulada',
            icon: 'mdi-cancel',
            fecha: fechaAltaRegistro, // Usamos la fecha de alta como referencia
            descripcion: `La orden ha sido cancelada.`,
            statusClass: 'current-bad', // Clase para estados negativos actuales.
          });
          return timelineSteps;
        }

        // Paso "Pre-Orden" (solo si la orden es una pre-orden).
        if (isPreOrden) {
          timelineSteps.push({
            id: 'pre_orden',
            nombre: 'Pre-Orden',
            icon: 'mdi-file-cabinet-outline',
            fecha: fechaAltaRegistro,
            descripcion: 'Orden creada como pre-orden.',
          });
        }

        // Paso "Pendiente"
        timelineSteps.push({
          id: 'pendiente',
          nombre: 'Pendiente',
          icon: 'mdi-file-document-edit-outline',
          fecha: fechaAltaRegistro,
          descripcion: `La orden está pendiente.`,
        });

        // Paso "Preparada"
        timelineSteps.push({
          id: 'preparado',
          nombre: 'Preparada',
          icon: 'mdi-package-variant-closed-check',
          fecha: fechaOrden, // Usamos la fecha de la orden como fecha de preparado
          descripcion: 'Los productos han sido preparados.',
        });

        if (isRetiraCliente) {
          // Paso "Retira Cliente"
          timelineSteps.push({
            id: 'retira_cliente',
            nombre: 'Retira Cliente',
            icon: 'mdi-account-check-outline',
            fecha: fechaOrden, // Fecha de la orden como fecha de retiro
            descripcion: 'La orden está lista para retiro por el cliente.',
          });
        } else {
          // Paso "A Distribución"
          timelineSteps.push({
            id: 'a_distribucion',
            nombre: 'A Distribución',
            icon: 'mdi-truck-fast-outline',
            fecha: fechaOrden, // Fecha de la orden como fecha de distribución
            descripcion: 'La orden ha sido despachada.',
          });
        }

        // Mapeo de estados textuales al ID de paso correspondiente para evaluar el avance.
        const stateToId = {
          'Pre-Orden': 'pre_orden',
          Pendiente: 'pendiente',
          Preparado: 'preparado',
          'A distribuciòn': 'a_distribucion',
          'Retira Cliente': 'retira_cliente',
        };
        const currentStepId = stateToId[currentStatusText] || null;
        const currentIndex = timelineSteps.findIndex(step => step.id === currentStepId);

        // Asigna la clase de estado basándose en la posición relativa al estado actual.
        timelineSteps.forEach((step, index) => {
          if (currentIndex === -1) {
            step.statusClass = 'pending';
          } else if (index < currentIndex) {
            step.statusClass = 'completed';
          } else if (index === currentIndex) {
            step.statusClass = 'current';
          } else {
            step.statusClass = 'pending';
          }
        });

        const colorMap = {
          pendiente: 'pendiente',
          preparado: 'preparada',
          a_distribucion: 'despachada',
          retira_cliente: 'despachada',
          pre_orden: 'pendiente'
        };
        timelineSteps.forEach(step => {
          step.colorClass = colorMap[step.id] || '';
        });

        console.log("_construirTimelineOrden: Timeline construido:", timelineSteps);
        return timelineSteps;
      },
  
      /**
       * `_construirTimelineGuia`:
       * Método auxiliar para construir la línea de tiempo de una GUÍA.
       * Adapta la lógica de `VistaDeTracking.vue` para definir los pasos del proceso,
       * iconos, fechas y clases de estado según el estado actual de la guía.
       * Muestra todos los estados posibles, pintando los completados y el actual.
       * @param {object} guia - El objeto de la guía para construir su línea de tiempo.
       * @returns {Array} Array de objetos que representan los pasos de la línea de tiempo.
       */
      _construirTimelineGuia(guia) {
        console.log("_construirTimelineGuia: Construyendo timeline para guía:", guia.Comprobante, "Estado:", guia.Estado);
        const timelineSteps = [];
        const currentStatusText = guia.Estado; // El estado ya está en formato textual.
        // Determina si la guía es para retiro en sucursal (basado en la dirección "lagos garcia 4470").
        const isRetiraClienteSucursal = guia.Domicilio && guia.Domicilio.toLowerCase().includes("lagos garcia 4470");
  
        // Fechas ya formateadas en el `openModal`.
        const fechaOriginal = guia.FechaOriginal || 'N/A';
        const fechaNoEntregado = guia.FechaNoEntregado || 'N/A'; // Fecha específica para estado "No entregado".
  
        // Pasos base de la línea de tiempo con un `baseOrder` para facilitar la lógica de avance.
        const baseSteps = [
          {
            id: 'preparacion',
            nombre: 'Pedido en preparación',
            icon: 'mdi-clipboard-list-outline',
            fecha: fechaOriginal,
            descripcion: 'Actualmente estamos trabajando en procesar tu pedido para que llegue a tus manos lo mas pronto posible.',
            baseOrder: 1,
          },
          {
            id: 'preparado',
            nombre: 'Pedido preparado',
            icon: 'mdi-cube-outline',
            fecha: fechaOriginal,
            descripcion: 'Tu pedido ha sido preparado y está listo para el proceso de distribución.',
            baseOrder: 2,
          },
          {
            id: 'en_cd',
            nombre: 'En CD',
            icon: 'mdi-warehouse',
            fecha: fechaOriginal, // Podría ser la fecha de "En Planchada" si existe
            descripcion: 'Tu pedido se encuentra en proceso de Cross Docking en nuestras instalaciones, ¡Pronto esta en camino hacia su destino final!',
            baseOrder: 3,
          },
          {
            id: 'en_distribucion',
            nombre: 'En distribución',
            icon: 'mdi-truck-fast-outline',
            // La fecha de distribución podría ser la fecha original si está despachado, o "N/A".
            fecha: guia.Estado === 'DESPACHADO' ? fechaOriginal : 'N/A', // Usamos la fecha original si está despachado, o "N/A"
            descripcion: '¡Tu pedido ya está en camino!',
            baseOrder: 4,
          },
        ];
  
        // Manejo especial para el estado "ANULADO": solo muestra un paso de anulación.
        if (currentStatusText === 'ANULADO') {
          return [{
            id: 'anulado',
            nombre: 'Guía Anulada',
            icon: 'mdi-cancel',
            fecha: fechaOriginal,
            descripcion: `La guía ha sido cancelada.`,
            statusClass: 'current-bad'
          }];
        }
  
        // Lógica para guías con retiro en sucursal ("Lagos Garcia").
        if (isRetiraClienteSucursal) {
          // En este caso, los primeros pasos siempre se consideran completados si la guía existe.
          baseSteps.forEach(step => {
            if (step.baseOrder <= 2) { // Preparación y Preparado siempre son completados para RetiraCliente
              step.statusClass = 'completed';
            } else {
              step.statusClass = 'pending'; // Otros pasos como En CD y En Distribución no aplican o son pendientes
            }
            timelineSteps.push(step);
          });
  
          // Agrega el paso final "Pedido retirado".
          timelineSteps.push({
            id: 'retirado',
            nombre: 'Pedido retirado',
            icon: 'mdi-kabaddi',
            fecha: currentStatusText === 'ENTREGADO' ? fechaOriginal : 'N/A', // Asume fecha original si fue entregado.
            descripcion: `El pedido fue retirado de nuestro centro de distribución.`,
            // El estado es 'current' if the guide is 'ENTREGADO', otherwise 'pending'.
            statusClass: currentStatusText === 'ENTREGADO' ? 'current' : 'pending'
          });
  
        } else {
          // Lógica para guías con distribución normal (no retiro en sucursal).
  
          // Mapeo de estados textuales de la guía a IDs de pasos del timeline para determinar el paso actual.
          let currentStepId = '';
          switch (currentStatusText) {
            case 'Pedido en preparación': currentStepId = 'preparacion'; break;
            case 'Pedido preparado': currentStepId = 'preparado'; break;
            case 'En Planchada':
            case 'En CD': currentStepId = 'en_cd'; break;
            case 'Ruteado':
            case 'DESPACHADO':
            case 'En distribución': currentStepId = 'en_distribucion'; break;
            case 'ENTREGADO': currentStepId = 'entregado'; break; // Un paso final especial
            case 'PARCIAL': currentStepId = 'parcial'; break; // Un paso final especial
            case 'NO ENTREGADO': currentStepId = 'no_entregado'; break; // Un paso final especial
            default: currentStepId = ''; // Estado no reconocido.
          }
  
          // Itera sobre los pasos base y asigna su clase de estado.
          // Los pasos anteriores al `currentStepId` se marcan como 'completed'.
          // El `currentStepId` se marca como 'current' o 'current-bad'.
          // Los pasos posteriores se marcan como 'pending'.
          baseSteps.forEach(step => {
            let stepStatus = 'pending';
            const currentStepIndex = baseSteps.findIndex(s => s.id === currentStepId);
            const stepIndex = baseSteps.findIndex(s => s.id === step.id);
  
            if (step.id === currentStepId) { // Este es el paso actual
              stepStatus = (currentStatusText === 'PARCIAL' || currentStatusText === 'NO ENTREGADO') ? 'current-bad' : 'current';
            } else if (currentStepIndex !== -1 && stepIndex < currentStepIndex) { // Este paso está antes del actual
              stepStatus = 'completed';
            }
            step.statusClass = stepStatus;
            timelineSteps.push(step);
          });
  
          // Agrega los pasos finales (Entregado, Parcial, No Entregado) condicionalmente.
          // Estos pasos se añaden después de los `baseSteps` y solo si la guía ha llegado a ese estado.
          if (currentStatusText === 'ENTREGADO') {
              timelineSteps.push({
                  id: 'entregado',
                  nombre: 'Entregado',
                  icon: 'mdi-truck-check-outline',
                  fecha: fechaOriginal, // Asume la fecha original como fecha de entrega.
                  descripcion: 'Tu pedido fue entrega con exito.',
                  statusClass: 'current' // Es el último paso y el estado actual.
              });
          } else if (currentStatusText === 'PARCIAL') {
              timelineSteps.push({
                  id: 'parcial',
                  nombre: 'Entrega parcial',
                  icon: 'mdi-truck',
                  fecha: fechaOriginal, // Podría ser otra fecha real del DALC.
                  descripcion: 'Por algún motivo no se pudo entregar tu pedido de forma completa.',
                  statusClass: 'current-bad'
              });
          } else if (currentStatusText === 'NO ENTREGADO') {
              timelineSteps.push({
                  id: 'no_entregado',
                  nombre: 'No entregado',
                  icon: 'mdi-truck',
                  fecha: fechaNoEntregado,
                  descripcion: `Al no haberse podido entregar tu pedido se recordinara.`,
                  statusClass: 'current-bad'
              });
          }
        }
  
        // Re-evaluación final de las clases de estado para asegurar la secuencia 'completed' -> 'current' -> 'pending'.
        // Esta iteración final es crucial para asegurar que la línea y los iconos de los pasos previos
        // al estado 'current' o 'current-bad' se marquen correctamente como 'completed'.
        let foundCurrent = false;
        for (let i = timelineSteps.length - 1; i >= 0; i--) {
          const step = timelineSteps[i];
          if (step.statusClass === 'current' || step.statusClass === 'current-bad') {
            foundCurrent = true;
          } else if (foundCurrent && step.statusClass === 'pending') {
            // Si ya encontramos el estado actual y este paso era "pending", se marca como "completed".
            step.statusClass = 'completed';
          }
        }

        const colorMap = {
          preparacion: 'pendiente',
          preparado: 'preparada',
          en_cd: 'despachada',
          en_distribucion: 'despachada',
          retirado: 'despachada',
          entregado: 'entregado',
          parcial: 'despachada',
          no_entregado: 'despachada'
        };
        timelineSteps.forEach(step => {
          step.colorClass = colorMap[step.id] || '';
        });
        console.log("_construirTimelineGuia: Timeline construido:", timelineSteps);
        return timelineSteps;
      },
  
      /**
       * `closeModal`:
       * Cierra el diálogo (modal) de detalle y reinicia sus datos.
       */
      closeModal() {
        console.log("closeModal: Cerrando modal.");
        this.showModal = false; // Oculta el modal.
        this.modalData = null; // Limpia los datos del modal.
        this.modalType = ''; // Restablece el tipo de modal.
        this.errorAlCargar = null; // Limpia cualquier mensaje de error en el modal.
      },
  
      /**
       * `getStatusChipClassTextual`:
       * Devuelve las clases CSS de Vuetify para aplicar un color específico
       * a los `v-chip` de estado, tanto para órdenes como para guías.
       * @param {string} estado - El estado textual del elemento (orden o guía).
       * @returns {string} Clases CSS de Vuetify.
       */
      getStatusChipClassTextual(estado) {
        // Clases para estados de Órdenes.
        if (['Pendiente', 'Preparado', 'A distribuciòn', 'Anulado', 'Retira Cliente'].includes(estado)) {
          switch (estado) {
            case 'Pendiente':
              return 'chip-pendiente'
            case 'Preparado':
              return 'chip-preparada'
            case 'A distribuciòn':
            case 'Retira Cliente':
              return 'chip-despachada'
            case 'Anulado':
              return 'error lighten-2 white--text'
            default:
              return 'secondary lighten-2 white--text'
          }
        }
        // Clases para estados de Guías (basadas en `VistaDeTracking.vue`).
        else if (
          [
            'Pedido en preparación',
            'Pedido preparado',
            'En CD',
            'En Planchada',
            'Ruteado',
            'DESPACHADO',
            'En distribución',
            'Entregado',
            'No entregado',
            'Entrega parcial',
            'Pedido retirado',
            'ANULADO',
          ].includes(estado)
        ) {
          switch (estado) {
            case 'Entregado':
              return 'chip-entregado';
            case 'Pedido preparado':
            case 'Pedido en preparación':
            case 'En CD':
            case 'En Planchada':
            case 'Ruteado':
            case 'DESPACHADO':
            case 'En distribución':
            case 'Pedido retirado':
              return 'success lighten-2 white--text'; // Progreso positivo.
            case 'No entregado':
            case 'ANULADO':
              return 'error lighten-2 white--text'; // Error o anulado.
            case 'Entrega parcial':
              return 'warning lighten-2 white--text'; // Parcial.
            default:
              return 'secondary lighten-2 white--text'; // Por defecto.
          }
        }
        return 'secondary lighten-2 white--text'; // Por defecto si no coincide.
      },

      async descargarOrdenesExcel() {
        const workbook = new excel.Workbook()

        const statusColors = {
          Pendiente: 'FFC81E2B',
          Preparada: 'FFF8B421',
          Despachada: 'FF2D8BBA',
        }

        this.ordenesFiltradasParaTabla.forEach((orden) => {
          const numero = orden.Numero || orden.numero || orden.IdOrden
          const sheetName = String(numero).substring(0, 31)
          const sheet = workbook.addWorksheet(sheetName)

          sheet.getRow(1).values = ['N° Orden', numero]
          sheet.getRow(2).values = ['Empresa', orden.NombreEmpresa || '']
          sheet.getRow(3).values = [
            'Cliente',
            orden.NombreDestino || '',
          ]
          sheet.getRow(4).values = [
            'Fecha',
            orden.Fecha
              ? new Date(orden.Fecha).toLocaleDateString('es-AR')
              : '',
          ]
          sheet.getRow(5).values = [
            'Estado',
            orden.NombreEstado || orden.Estado || '',
          ]

          const estadoCelda = sheet.getCell('B5')
          const color = statusColors[orden.NombreEstado || orden.Estado]
          if (color) {
            estadoCelda.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            }
          }

          sheet.getRow(7).values = [
            'Cantidad',
            'Producto',
            'Barcode',
            'Código Empresa',
            'Precio',
          ]

          if (Array.isArray(orden.productos)) {
            orden.productos.forEach((prod) => {
              sheet.addRow([
                prod.Unidades,
                prod.NombreProducto || '',
                prod.Barcode || '',
                prod.CodeEmpresa || '',
                prod.Precio != null
                  ? Number(prod.Precio).toFixed(2)
                  : '',
              ])
            })
          }

          sheet.eachRow((row, idx) => {
            row.eachCell((cell) => {
              cell.font = idx <= 7 ? { size: 14, bold: idx <= 5 } : { size: 14 }
            })
          })
          sheet.columns = [
            { width: 15 },
            { width: 30 },
            { width: 30 },
            { width: 25 },
            { width: 15 },
          ]
        })

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(
          new Blob([buffer]),
          `ordenes_${this.fechaDesde}_${this.fechaHasta}.xlsx`
        )
      },

      async descargarOrdenExcelIndividual(orden) {
        if (!orden) return

        const workbook = new excel.Workbook()

        const statusColors = {
          Pendiente: 'FFC81E2B',
          Preparada: 'FFF8B421',
          Despachada: 'FF2D8BBA',
        }

        const numero = orden.Numero || orden.numero || orden.IdOrden
        const sheetName = String(numero).substring(0, 31)
        const sheet = workbook.addWorksheet(sheetName)

        sheet.getRow(1).values = ['N° Orden', numero]
        sheet.getRow(2).values = ['Empresa', orden.NombreEmpresa || '']
        sheet.getRow(3).values = ['Cliente', orden.NombreDestino || '']
        sheet.getRow(4).values = [
          'Fecha',
          orden.Fecha ? new Date(orden.Fecha).toLocaleDateString('es-AR') : '',
        ]
        sheet.getRow(5).values = ['Estado', orden.NombreEstado || orden.Estado || '']

        const estadoCelda = sheet.getCell('B5')
        const color = statusColors[orden.NombreEstado || orden.Estado]
        if (color) {
          estadoCelda.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          }
        }

        sheet.getRow(7).values = [
          'Cantidad',
          'Producto',
          'Barcode',
          'Código Empresa',
          'Precio',
        ]

        if (Array.isArray(orden.productos)) {
          orden.productos.forEach((prod) => {
            sheet.addRow([
              prod.Unidades,
              prod.NombreProducto || '',
              prod.Barcode || '',
              prod.CodeEmpresa || '',
              prod.Precio != null ? Number(prod.Precio).toFixed(2) : '',
            ])
          })
        }

        sheet.eachRow((row, idx) => {
          row.eachCell((cell) => {
            cell.font = idx <= 7 ? { size: 14, bold: idx <= 5 } : { size: 14 }
          })
        })
        sheet.columns = [
          { width: 15 },
          { width: 30 },
          { width: 30 },
          { width: 25 },
          { width: 15 },
        ]

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]), `orden_${numero}.xlsx`)
      },

      async descargarGuiaExcelIndividual(guia) {
        if (!guia) return

        const workbook = new excel.Workbook()

        const statusColors = {
          'Pedido en preparación': 'FFC81E2B',
          'Pedido preparado': 'FFF8B421',
          DESPACHADO: 'FF2D8BBA',
          'En distribución': 'FF2D8BBA',
          ENTREGADO: 'FF4CAF50',
          'ANULADO': 'FFF44336'
        }

        const numero = guia.Comprobante || guia.Id || guia.Numero || ''
        const sheetName = String(numero).substring(0, 31)
        const sheet = workbook.addWorksheet(sheetName)

        sheet.getRow(1).values = ['N° Guía', numero]
        sheet.getRow(2).values = ['Empresa', guia.NombreCliente || guia.Empresa?.RazonSocial || '']
        sheet.getRow(3).values = ['Destino', guia.NombreDestino || '']
        sheet.getRow(4).values = ['Remito', guia.Remitos || '']
        sheet.getRow(5).values = [
          'Fecha',
          guia.FechaOriginal ? new Date(guia.FechaOriginal).toLocaleDateString('es-AR') : ''
        ]
        sheet.getRow(6).values = ['Estado', guia.Estado || '']

        const estadoCelda = sheet.getCell('B6')
        const color = statusColors[guia.Estado]
        if (color) {
          estadoCelda.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color }
          }
        }

        sheet.getRow(8).values = [
          'Cantidad',
          'Producto',
          'Barcode',
          'Código Empresa',
          'Precio'
        ]

        if (Array.isArray(guia.productos)) {
          guia.productos.forEach((prod) => {
            sheet.addRow([
              prod.Unidades,
              prod.NombreProducto || '',
              prod.Barcode || '',
              prod.CodeEmpresa || '',
              prod.Precio != null ? Number(prod.Precio).toFixed(2) : ''
            ])
          })
        }

        const historial =
          guia.historialEstados || guia.historial || guia.Historial || guia.Estados

        if (Array.isArray(historial) && historial.length) {
          const sheetHist = workbook.addWorksheet('Historial')
          sheetHist.columns = [{ width: 25 }, { width: 20 }]
          sheetHist.getRow(1).values = ['Estado', 'Fecha']
          historial.forEach((h) => {
            sheetHist.addRow([
              h.estado || h.Estado || h.nombre || h.Nombre || '',
              h.fecha
                ? new Date(h.fecha).toLocaleDateString('es-AR')
                : h.Fecha
                ? new Date(h.Fecha).toLocaleDateString('es-AR')
                : ''
            ])
          })
          sheetHist.eachRow((row, idx) => {
            row.eachCell((cell) => {
              cell.font = idx === 1 ? { size: 14, bold: true } : { size: 14 }
            })
          })
        }

        sheet.eachRow((row, idx) => {
          row.eachCell((cell) => {
            cell.font = idx <= 8 ? { size: 14, bold: idx <= 6 } : { size: 14 }
          })
        })
        sheet.columns = [
          { width: 15 },
          { width: 30 },
          { width: 30 },
          { width: 25 },
          { width: 15 }
        ]

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]), `guia_${numero}.xlsx`)
      },

      async descargarGuiaEmpresaPDF(payload) {
        if (!payload || !payload.guia) return
        const { guia, foto } = payload
        const pdf = new jsPDF('p', 'mm', 'A4')
        pdf.setFont('DM Sans')
        let y = 20
        pdf.text(`Conforme de entrega: ${guia.Comprobante}`, 20, y)
        y += 10
        pdf.text(`Destino: ${guia.NombreDestino || ''}`, 20, y)
        y += 10
        pdf.text(`Bultos: ${guia.Bultos}`, 20, y)
        y += 10
        pdf.text(`Remitos: ${guia.Remitos || ''}`, 20, y)
        y += 10
        pdf.text(`Fecha Entrega: ${guia.FechaEntrega || ''}`, 20, y)
        y += 10
        pdf.text(`Fecha Creación: ${guia.FechaOriginal || ''}`, 20, y)
        y += 10
        pdf.text(`Estado: ${guia.Estado || ''}`, 20, y)

        if (foto) {
          try {
            const imgData = await this.getImageBase64(foto)
            pdf.addImage(imgData, 'JPEG', 20, y + 10, 170, 90)
          } catch (e) {
            console.error('Error agregando imagen', e)
          }
        }

        pdf.save(`conforme_${guia.Comprobante}.pdf`)
      },

      async getImageBase64(url) {
        const res = await fetch(url)
        const blob = await res.blob()
        return await new Promise(resolve => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
      },
  
      /**
       * `getHoy`:
       * Método auxiliar que retorna la fecha actual formateada como 'YYYY-MM-DD'.
       * Es útil para APIs que esperan este formato de fecha.
       * @returns {string} Fecha actual formateada.
       */
      getHoy() {
        const hoy = new Date();
        const y = hoy.getFullYear();
        const m = String(hoy.getMonth() + 1).padStart(2, '0'); // Mes con dos dígitos.
        const d = String(hoy.getDate()).padStart(2, '0'); // Día con dos dígitos.
        return `${y}-${m}-${d}`;
      },

      mostrarError(mensaje) {
        store.dispatch('snackbar/mostrar', mensaje)
      },
    },
  
    /**
     * `created()`:
     * Gancho del ciclo de vida de Vue que se ejecuta una vez que la instancia
     * del componente ha sido creada. Se utiliza para la inicialización inicial.
     */
    async created() {
      console.log("created: Componente SeguimientosOrdenesGuias inicializado.");
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7); // Retrocede 7 días para obtener la fecha de inicio de la última semana.
  
      // Inicializa `fechaDesde` a la fecha de hace 7 días (última semana).
      this.fechaDesde = sevenDaysAgo.toISOString().split('T')[0];
      // Inicializa `fechaHasta` a la fecha de hoy.
      this.fechaHasta = today.toISOString().split('T')[0];
      console.log(`created: Fechas por defecto configuradas: Desde ${this.fechaDesde} hasta ${this.fechaHasta}`);
  
      // Carga la lista de empresas disponibles.
      await this.fetchEmpresas();
  
      // Si el usuario actual tiene una empresa asignada en el store Vuex,
      // se selecciona automáticamente esa empresa y se cargan los datos.
      const empresaUsuario = store.state.usuarios.usuarioActual.IdEmpresa;
      if (empresaUsuario && empresaUsuario > 0) {
        this.idEmpresa = empresaUsuario;
        console.log("created: Usuario con empresa asignada, cargando datos para ID:", this.idEmpresa);
        // Llama a `eligioEmpresa` para iniciar la carga de datos con la empresa preseleccionada.
        await this.eligioEmpresa(empresaUsuario);
      } else {
        console.log("created: No hay empresa asignada al usuario o el ID es inválido.");
      }
    },
  }
  </script>
  
  <style scoped>
  /* Estilos para la línea de tiempo */
  .timeline-step {
    position: relative;
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    min-height: 40px;
  }
  
  .timeline-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 16px;
    flex-shrink: 0;
    background-color: var(--estado-neutral-bg); /* Color por defecto para estados pendientes */
    color: var(--estado-neutral-tx);
  }
  
  .timeline-icon {
    font-size: 18px;
  }
  
  .timeline-content {
    flex-grow: 1;
    padding-bottom: 16px;
  }
  
  .timeline-line {
    position: absolute;
    left: 16px;
    top: 32px;
    bottom: 0;
    width: 2px;
    background-color: var(--estado-neutral-bg);
  }
  
  /* Estados */
  .completed .timeline-icon-container {
    background-color: var(--estado-entregado); /* Verde para completado */
    color: white;
  }
  
  .current .timeline-icon-container {
    background-color: #2196f3; /* Azul para estado actual */
    color: white;
    animation: pulse 2s infinite;
  }
  
  .current-bad .timeline-icon-container {
    background-color: #f44336; /* Rojo para estado actual de error */
    color: white;
    animation: pulse 2s infinite;
  }
  
  .completed + .timeline-step:not(.completed) .timeline-line {
    background: linear-gradient(to bottom, var(--estado-entregado), var(--estado-neutral-bg));
  }
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
    }
  }
  
  /* Estilos para la tabla de productos */
  .product-table {
    border: 1px solid var(--estado-neutral-bg);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .product-table th {
    background-color: var(--login-bg);
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .product-table tr:not(:last-child) {
    border-bottom: 1px solid var(--estado-neutral-bg);
  }
  
  .product-table tr:hover {
    background-color: var(--surface);
  }
  
  /* ============================ */
  /* Estilos generales          */
  /* ============================ */
  
  /*
    `.blue-header`:
    Estilo aplicado a la fila de encabezados de la `v-data-table`
    para darle un fondo azul suave y texto azul oscuro.
  */
  .blue-header th {
    background-color: var(--v-primary-base);
    color: #fff;
    font-weight: 600;
  }
  
  /* ============================ */
  /* Estilos para el Timeline   */
  /* Estos estilos recrean la apariencia de una línea de tiempo vertical
     con iconos circulares y una línea que conecta los pasos. */
  /* ============================ */
  
  /* Contenedor de cada paso individual en la línea de tiempo */
  .timeline-step {
    display: flex; /* Utiliza flexbox para alinear el icono y el contenido */
    align-items: flex-start; /* Alinea los ítems al inicio del contenedor flex */
    position: relative; /* Necesario para posicionar la línea vertical */
    padding-bottom: 1.5rem; /* Espacio entre los pasos */
  }
  /* Elimina el padding inferior del último paso para evitar espacio extra */
  .timeline-step:last-child {
    padding-bottom: 0;
  }
  
  /* Contenedor del ícono circular para cada paso */
  .timeline-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px; /* Ancho del círculo */
    height: 36px; /* Alto del círculo */
    border-radius: 50%; /* Hace el contenedor circular */
    flex-shrink: 0; /* Evita que el contenedor del icono se encoja */
    margin-right: 1rem; /* Espacio a la derecha del icono antes del contenido */
    z-index: 1; /* Asegura que el icono esté por encima de la línea */
  }
  
  /* Estilo del ícono dentro del contenedor circular */
  .timeline-icon {
    font-size: 1.25rem; /* Tamaño del icono */
  }
  
  /* Línea vertical que conecta los pasos de la línea de tiempo */
  .timeline-step:not(:last-child)::before {
    content: ''; /* Contenido vacío para el pseudo-elemento */
    position: absolute; /* Posiciona la línea de forma absoluta */
    left: 17px; /* Ajusta la posición horizontal para que esté centrada con el icono */
    top: 36px; /* Inicia la línea debajo del icono */
    bottom: 0; /* Extiende la línea hasta la parte inferior del paso */
    width: 2px; /* Grosor de la línea */
    background-color: rgba(0, 0, 0, 0.12); /* Color gris claro de la línea */
  }
  
  /* Contenido textual de cada paso (nombre, fecha, descripción) */
  .timeline-content {
    flex: 1; /* Permite que el contenido ocupe el espacio restante */
    padding-top: 0.5rem; /* Alinea el contenido con el centro vertical del icono */
  }
  
  /* Estados del paso: colores de fondo del círculo del icono y de la línea */
  /* Estado `completed`: indica un paso que ya fue finalizado exitosamente. */
  .timeline-step.completed .timeline-icon-container {
    background-color: #e8f5e9; /* Vuetify green lighten-5 */
    color: #388e3c;            /* Vuetify green darken-2 */
  }
  .timeline-step.completed::before {
    background-color: #388e3c; /* La línea también se vuelve verde */
  }
  
  /* Estado `current`: indica el paso actual en el progreso. */
  .timeline-step.current .timeline-icon-container {
    background-color: #e3f2fd; /* Vuetify blue lighten-5 */
    color: #1976d2;            /* Vuetify blue darken-2 */
  }
  
  /* Estado `current-bad`: indica el paso actual que es un estado negativo (ej. anulado, no entregado). */
  .timeline-step.current-bad .timeline-icon-container {
    background-color: #ffebee; /* Vuetify red lighten-5 */
    color: #d32f2f;            /* Vuetify red darken-2 */
  }
  
  /* Estado `pending`: indica un paso que aún no ha sido alcanzado. */
  .timeline-step.pending .timeline-icon-container {
    background-color: var(--login-bg); /* Vuetify grey lighten-4 */
    color: #757575;            /* Vuetify grey darken-1 */
  }

  /* Colores por tipo de estado */
  .timeline-step.pendiente .timeline-icon-container,
  .timeline-line.pendiente {
    background-color: var(--estado-pendiente);
    color: #fff;
  }
  .timeline-step.pendiente::before {
    background-color: var(--estado-pendiente);
  }

  .timeline-step.preparada .timeline-icon-container,
  .timeline-line.preparada {
    background-color: var(--estado-preparada);
    color: #fff;
  }
  .timeline-step.preparada::before {
    background-color: var(--estado-preparada);
  }

  .timeline-step.despachada .timeline-icon-container,
  .timeline-line.despachada {
    background-color: var(--estado-despachada);
    color: #fff;
  }
  .timeline-step.despachada::before {
    background-color: var(--estado-despachada);
  }

  .timeline-step.entregado .timeline-icon-container,
  .timeline-line.entregado {
    background-color: var(--estado-entregado);
    color: #fff;
  }
  .timeline-step.entregado::before {
    background-color: var(--estado-entregado);
  }

  /* === Chip color classes (comparten valores con el timeline) === */
  .chip-pendiente {
    background-color: var(--estado-pendiente);
    color: #fff;
  }

  .chip-preparada {
    background-color: var(--estado-preparada);
    color: #fff;
  }

  .chip-despachada {
    background-color: var(--estado-despachada);
    color: #fff;
  }

  .chip-entregado {
    background-color: var(--estado-entregado);
    color: #fff;
  }
  </style>