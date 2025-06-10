<template>
  <v-container fluid class="pa-4">
    <!-- =================================================================== -->
    <!-- Sección del Encabezado Principal del Componente                     -->
    <!-- Muestra el título principal de la vista "Seguimiento"               -->
    <!-- =================================================================== -->
    <v-row>
      <v-col>
        <v-sheet elevation="0" class="mb-6">
          <v-row align="center" justify="space-between">
            <v-col cols="12" md="6">
              <!-- Título grande para la sección de seguimiento -->
              <span class="text-h4 font-weight-semibold">
                Seguimiento
              </span>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- =================================================================== -->
    <!-- Sección de Filtros: Selector de Empresa y Rangos de Fechas          -->
    <!-- Permite al usuario seleccionar una empresa y un rango de fechas     -->
    <!-- para filtrar las órdenes y guías que se mostrarán.                  -->
    <!-- =================================================================== -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="mb-6">
          <v-card-text>
            <v-row dense align="center" no-gutters>
              <!-- Bloque: Selector de Empresa -->
              <v-col cols="12" md="4" class="pr-4">
                <v-row>
                  <v-col cols="12">
                    <span class="subtitle-2 font-weight-medium mb-1">
                      Seleccionar empresa
                    </span>
                  </v-col>
                  <v-col cols="12">
                    <!-- Componente `SelectorEmpresa` para elegir la empresa -->
                    <!-- Emite un evento `eligioEmpresa` con el ID de la empresa seleccionada -->
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

              <!-- Bloque: Campo de Fecha Desde -->
              <v-col cols="12" md="4" class="pr-4">
                <v-row>
                  <v-col cols="12">
                    <span class="subtitle-2 font-weight-medium mb-1">
                      Fecha Desde
                    </span>
                  </v-col>
                  <v-col cols="12">
                    <!-- Campo de texto para seleccionar la fecha de inicio del rango -->
                    <!-- Al cambiar la fecha, se recargan ambas listas (órdenes y guías) -->
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

              <!-- Bloque: Campo de Fecha Hasta -->
              <v-col cols="12" md="4">
                <v-row>
                  <v-col cols="12">
                    <span class="subtitle-2 font-weight-medium mb-1">
                      Fecha Hasta
                    </span>
                  </v-col>
                  <v-col cols="12">
                    <!-- Campo de texto para seleccionar la fecha de fin del rango -->
                    <!-- Al cambiar la fecha, se recargan ambas listas (órdenes y guías) -->
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

    <!-- =================================================================== -->
    <!-- Sección de Pestañas: Alterna entre Órdenes y Guías                  -->
    <!-- Utiliza `v-tabs` para permitir al usuario elegir qué tipo de        -->
    <!-- seguimiento desea ver.                                              -->
    <!-- =================================================================== -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <!-- Pestañas para "Órdenes" y "Guías" -->
          <v-tabs v-model="tab" background-color="grey lighten-4" color="primary" show-arrows>
            <v-tab href="#tab-ordenes">
              Órdenes
            </v-tab>
            <v-tab href="#tab-guias">
              Guías
            </v-tab>
          </v-tabs>

          <!-- Contenido de las Pestañas -->
          <v-tabs-items v-model="tab">
            <!-- PESTAÑA: Seguimiento de Órdenes -->
            <v-tab-item value="tab-ordenes">
              <v-card-text>
                <v-toolbar flat dense color="grey lighten-4">
                  <v-toolbar-title class="subtitle-1 font-weight-medium text--primary">
                    Seguimiento de Órdenes
                  </v-toolbar-title>
                </v-toolbar>

                <!-- Estado de carga (spinner) para órdenes -->
                <div v-if="loading" class="text-center py-10">
                  <v-progress-circular indeterminate size="40" color="primary" />
                  <div class="mt-2">
                    <span class="body-2 text--secondary">
                      Cargando órdenes...
                    </span>
                  </div>
                </div>

                <!-- Mensaje de error al cargar órdenes -->
                <div v-else-if="errorAlCargar" class="text-center py-10">
                  <v-icon size="36" color="error">mdi-alert-circle-outline</v-icon>
                  <div class="mt-2">
                    <span class="body-2 text--error">
                      {{ errorAlCargar }}
                    </span>
                  </div>
                </div>

                <!-- Mensaje si no se ha seleccionado ninguna empresa para órdenes -->
                <div v-else-if="idEmpresa <= 0" class="text-center py-10">
                  <v-icon size="36" color="grey">mdi-office-building</v-icon>
                  <div class="mt-2">
                    <span class="body-2 text--secondary">
                      Seleccione una empresa para ver sus órdenes.
                    </span>
                  </div>
                </div>

                <!-- Contenido principal: Buscador, Selector de filas y Tabla de Órdenes -->
                <div v-else>
                  <v-row align="center" justify="space-between" class="mb-4">
                    <!-- Buscador de órdenes -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="textoBusqueda"
                        append-icon="mdi-magnify"
                        label="Buscar órdenes..."
                        dense
                        outlined
                        clearable
                      />
                    </v-col>

                    <!-- Desplegable "Filas por página" para órdenes -->
                    <v-col cols="12" md="3">
                      <v-select
                        v-model="itemsPerPage"
                        :items="itemsPerPageOptions"
                        label="Filas por página"
                        dense
                        outlined
                        hide-details
                      />
                    </v-col>
                  </v-row>

                  <!-- Tabla de datos de Órdenes -->
                  <v-data-table
                    :headers="cabecerasOrdenes"
                    :items="ordenesFiltradasParaTabla"
                    :search="textoBusqueda"
                    item-key="IdOrden"
                    :items-per-page="itemsPerPage"
                    class="elevation-1"
                    dense
                    hide-default-footer
                    header-class="blue-header"
                  >
                    <!-- Slot personalizado para la columna "N° Orden" (texto en negrita) -->
                    <template v-slot:item.numero="{ item }">
                      <span class="body-2 font-weight-bold">
                        {{ item.numero }}
                      </span>
                    </template>

                    <!-- Slot personalizado para la columna "Empresa" -->
                    <template v-slot:item.nombreEmpresa="{ item }">
                      <span class="body-2">{{ item.nombre || 'N/A' }}</span>
                    </template>

                    <!-- Slot personalizado para la columna "Cliente" -->
                    <template v-slot:item.nombreCliente="{ item }">
                      <span class="body-2">{{ item.nombreDestino || 'N/A' }}</span>
                    </template>

                    <!-- Slot personalizado para la columna "Fecha Creación" -->
                    <template v-slot:item.fechaCreacion="{ item }">
                      <span class="body-2">{{ item.Creada }}</span>
                    </template>

                    <!-- Slot personalizado para la columna "Estado Actual" (chip con color) -->
                    <template v-slot:item.estadoActual="{ item }">
                      <v-chip
                        :class="getStatusChipClassTextual(item.Estado)"
                        small
                      >
                        {{ item.Estado }}
                      </v-chip>
                    </template>

                    <!-- Slot personalizado para la columna "Acciones" (botón de ojo para ver detalle y botón de seguimiento de guía) -->
                    <template v-slot:item.acciones="{ item }">
                      <!-- Botón para ver detalles de la orden -->
                      <v-btn
                        icon
                        small
                        @click="openModal('orden', item.IdOrden)"
                        :aria-label="`Ver detalles orden ${item.numero}`"
                      >
                        <v-icon color="primary">mdi-eye-outline</v-icon>
                      </v-btn>

                      <!-- Condición para mostrar el botón/chip de seguimiento de guía -->
                      <!-- Se muestra si la orden está en estado 'A distribución' (despachada) y tiene un IdGuia válido. -->
                      <v-chip
                        v-if="item.Estado === 'A distribuciòn' && item.IdGuia > 0"
                        small
                        class="ml-2"
                        color="green lighten-4"
                        text-color="green darken-4"
                        @click="verGuiaAsociada(item)"
                        title="Haz clic para ver el seguimiento de la guía asociada"
                        label
                      >
                        Seguimiento aquí
                        <v-icon right small>mdi-truck-check-outline</v-icon>
                      </v-chip>
                    </template>

                    <!-- Pie de tabla: Paginación manual y texto "Mostrando X de Y" -->
                    <template v-slot:footer.prepend>
                      <v-row align="center" justify="space-between" class="px-4">
                        <v-col cols="12" md="6">
                          <v-pagination
                            v-model="pageOrdenes"
                            :length="pageCountOrdenes"
                            prev-icon="mdi-chevron-left"
                            next-icon="mdi-chevron-right"
                            circle
                            dense
                          />
                        </v-col>
                        <v-col cols="12" md="6" class="text-right">
                          <span class="caption text--secondary">
                            Mostrando {{ paginationInfoOrdenes }}
                          </span>
                        </v-col>
                      </v-row>
                    </template>

                    <!-- Slot "no-data" si no hay órdenes para los filtros seleccionados -->
                    <template v-slot:no-data>
                      <v-alert type="warning" dense text>
                        No se encontraron órdenes para los filtros seleccionados.
                      </v-alert>
                    </template>
                  </v-data-table>
                </div>
              </v-card-text>
            </v-tab-item>

            <!-- PESTAÑA: Seguimiento de Guías -->
            <v-tab-item value="tab-guias">
              <v-card-text>
                <v-toolbar flat dense color="grey lighten-4">
                  <v-toolbar-title class="subtitle-1 font-weight-medium text--primary">
                    Seguimiento de Guías
                  </v-toolbar-title>
                </v-toolbar>

                <!-- Estado de carga (spinner) para guías -->
                <div v-if="loading" class="text-center py-10">
                  <v-progress-circular indeterminate size="40" color="primary" />
                  <div class="mt-2">
                    <span class="body-2 text--secondary">
                      Cargando guías...
                    </span>
                  </div>
                </div>

                <!-- Mensaje de error al cargar guías -->
                <div v-else-if="errorAlCargar" class="text-center py-10">
                  <v-icon size="36" color="error">mdi-alert-circle-outline</v-icon>
                  <div class="mt-2">
                    <span class="body-2 text--error">
                      {{ errorAlCargar }}
                    </span>
                  </div>
                </div>

                <!-- Mensaje si no se ha seleccionado ninguna empresa para guías -->
                <div v-else-if="idEmpresa <= 0" class="text-center py-10">
                  <v-icon size="36" color="grey">mdi-office-building</v-icon>
                  <div class="mt-2">
                    <span class="body-2 text--secondary">
                      Seleccione una empresa para ver sus guías.
                    </span>
                  </div>
                </div>

                <!-- Contenido principal: Buscador, Selector de filas y Tabla de Guías -->
                <div v-else>
                  <v-row align="center" justify="space-between" class="mb-4">
                    <!-- Buscador de guías -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="textoBusquedaGuias"
                        append-icon="mdi-magnify"
                        label="Buscar guías..."
                        dense
                        outlined
                        clearable
                      />
                    </v-col>

                    <!-- Desplegable "Filas por página" para guías -->
                    <v-col cols="12" md="3">
                      <v-select
                        v-model="itemsPerPageGuias"
                        :items="itemsPerPageOptions"
                        label="Filas por página"
                        dense
                        outlined
                        hide-details
                      />
                    </v-col>
                  </v-row>

                  <!-- Tabla de datos de Guías -->
                  <v-data-table
                    :headers="cabecerasGuias"
                    :items="guiasFiltradasParaTabla"
                    :search="textoBusquedaGuias"
                    item-key="Id"
                    :items-per-page="itemsPerPageGuias"
                    class="elevation-1"
                    dense
                    hide-default-footer
                    header-class="blue-header"
                  >
                    <!-- Slot personalizado para la columna "N° Guía" (texto en negrita) -->
                    <template v-slot:item.Comprobante="{ item }">
                      <span class="body-2 font-weight-bold">
                        {{ item.Comprobante }}
                      </span>
                    </template>

                    <!-- Slot personalizado para la columna "Empresa" -->
                    <template v-slot:item.NombreCliente="{ item }">
                      <span class="body-2">{{ item.NombreCliente || 'N/A' }}</span>
                    </template>

                    <!-- Slot personalizado para la columna "Destino" -->
                    <template v-slot:item.NombreDestino="{ item }">
                      <span class="body-2">{{ item.NombreDestino || 'N/A' }}</span>
                    </template>

                    <!-- Slot personalizado para la columna "Remito" -->
                    <template v-slot:item.Remitos="{ item }">
                      <span class="body-2">{{ item.Remitos || 'N/A' }}</span>
                    </template>

                    <!-- Slot personalizado para la columna "Fecha Creación" -->
                    <template v-slot:item.FechaOriginal="{ item }">
                      <span class="body-2">{{ item.FechaOriginal }}</span>
                    </template>

                    <!-- Slot personalizado para la columna "Estado Actual" (chip con color) -->
                    <template v-slot:item.Estado="{ item }">
                      <v-chip
                        :class="getStatusChipClassTextual(item.Estado)"
                        small
                      >
                        {{ item.Estado }}
                      </v-chip>
                    </template>

                    <!-- Slot personalizado para la columna "Acciones" (botón de ojo para ver detalle) -->
                    <template v-slot:item.acciones="{ item }">
                      <v-btn
                        icon
                        small
                        @click="openModal('guia', item)"
                        :aria-label="`Ver detalles guía ${item.Comprobante}`"
                      >
                        <v-icon color="primary">mdi-eye-outline</v-icon>
                      </v-btn>
                    </template>

                    <!-- Pie de tabla: Paginación manual y texto "Mostrando X de Y" -->
                    <template v-slot:footer.prepend>
                      <v-row align="center" justify="space-between" class="px-4">
                        <v-col cols="12" md="6">
                          <v-pagination
                            v-model="pageGuias"
                            :length="pageCountGuias"
                            prev-icon="mdi-chevron-left"
                            next-icon="mdi-chevron-right"
                            circle
                            dense
                          />
                        </v-col>
                        <v-col cols="12" md="6" class="text-right">
                          <span class="caption text--secondary">
                            Mostrando {{ paginationInfoGuias }}
                          </span>
                        </v-col>
                      </v-row>
                    </template>

                    <!-- Slot "no-data" si no hay guías para los filtros seleccionados -->
                    <template v-slot:no-data>
                      <v-alert type="warning" dense text>
                        No se encontraron guías para los filtros seleccionados.
                      </v-alert>
                    </template>
                  </v-data-table>
                </div>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>

    <!-- =================================================================== -->
    <!-- Diálogo (Modal): Detalle de Orden o Guía Específica                 -->
    <!-- Muestra información detallada de una orden o guía seleccionada,     -->
    <!-- incluyendo datos generales, una línea de tiempo de progreso y       -->
    <!-- detalles de productos (para órdenes).                               -->
    <!-- =================================================================== -->
    <v-dialog v-model="showModal" scrollable max-width="650px">
      <v-card>
        <v-card-title class="justify-space-between">
          <!-- Título del modal dinámico según el tipo (Orden o Guía) y su número/comprobante -->
          <span class="text-h6">
            Detalle de {{ modalType === 'orden' ? 'Orden' : 'Guía' }}: {{ modalData?.Numero || modalData?.Comprobante || '' }}
          </span>
          <!-- Botón para cerrar el modal -->
          <v-btn icon @click="closeModal" aria-label="Cerrar detalle">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <!-- Spinner mientras se cargan los detalles del modal -->
          <div v-if="loading && !modalData" class="text-center py-6">
            <v-progress-circular indeterminate size="36" color="primary" />
            <div class="mt-2">
              <span class="body-2 text--secondary">
                Cargando detalles...
              </span>
            </div>
          </div>

          <!-- Mensaje de error al cargar detalles del modal -->
          <div v-else-if="errorAlCargar && !modalData" class="text-center py-6">
            <v-icon size="36" color="error">mdi-alert-circle-outline</v-icon>
            <div class="mt-2">
              <span class="body-2 text--error">
                {{ errorAlCargar }}
              </span>
            </div>
          </div>

          <!-- Contenido del detalle del modal (visible si hay datos cargados) -->
          <div v-else-if="modalData">
            <v-row dense>
              <!-- Columna izquierda: Datos Generales de la orden/guía -->
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

                  <!-- Campo "Email Cliente" solo para órdenes -->
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
                  <!-- Campo "Remito" solo para guías -->
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
                        {{
                          modalType === 'orden' ? (modalData.FechaCreacion ? new Date(modalData.FechaCreacion).toLocaleDateString() : 'N/A') : modalData.FechaOriginal || 'N/A'
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- Campos de fecha específicos para órdenes -->
                  <v-list-item v-if="modalType === 'orden'">
                    <v-list-item-content>
                      <v-list-item-title class="subtitle-2 font-weight-medium">
                        Preparado:
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <span v-if="modalData.FechaPreparado">{{
                          new Date(modalData.FechaPreparado).toLocaleDateString()
                        }}</span>
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
                        <span v-if="modalData.Fecha">{{
                          new Date(modalData.Fecha).toLocaleDateString()
                        }}</span>
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
                        <!-- Chip que muestra el estado actual con color condicional -->
                        <v-chip
                          :class="getStatusChipClassTextual(modalData.NombreEstado || modalData.Estado)"
                          small
                        >
                          {{ modalData.NombreEstado || modalData.Estado }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>

              <!-- Columna derecha: Línea de Tiempo de la Orden/Guía -->
              <v-col cols="12" md="6">
                <span class="subtitle-1 font-weight-medium mb-2">
                  Progreso de la {{ modalType === 'orden' ? 'Orden' : 'Guía' }}:
                </span>
                <v-sheet elevation="0">
                  <!-- Renderiza los pasos de la línea de tiempo (órdenes o guías) -->
                  <div
                    v-for="(paso, index) in timelineStepsComputed"
                    :key="paso.id + index"
                    class="timeline-step"
                  >
                    <div :class="['timeline-icon-container', paso.statusClass]">
                      <v-icon class="timeline-icon">{{ paso.icon }}</v-icon>
                    </div>
                    <div class="timeline-content">
                      <span class="subtitle-2 font-weight-medium">
                        {{ paso.nombre }}
                      </span>
                      <span v-if="paso.fecha" class="caption text--secondary">
                        – {{ paso.fecha }}
                      </span>
                      <span
                        v-if="paso.descripcion"
                        class="caption mt-1 text--secondary"
                      >
                        {{ paso.descripcion }}
                      </span>
                    </div>
                    <!-- Línea vertical que conecta los pasos del timeline -->
                    <div
                      v-if="index < timelineStepsComputed.length - 1"
                      class="timeline-line"
                    ></div>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>

            <!-- Separador antes de la sección de productos -->
            <v-divider class="my-4" />

            <!-- Sección: Detalle de Productos (solo para órdenes) -->
            <span class="subtitle-1 font-weight-medium mb-2">
              Detalle de Productos:
            </span>
            <div v-if="modalData.productosDetalle && modalData.productosDetalle.length > 0">
              <v-list dense>
                <v-list-item
                  v-for="(prod, prodIndex) in modalData.productosDetalle"
                  :key="prodIndex"
                >
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
              <span class="body-2 text--secondary">
                No hay productos en esta orden.
              </span>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- Acciones del modal (botón para cerrar) -->
        <v-card-actions class="justify-end">
          <v-btn text color="primary" @click="closeModal">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

  * **Corrección de `TypeError` en manejo de fechas:** El error `fechaDesdeObj.setHours(...).getTime is not a function` se resolvió asegurando que `Date.prototype.setHours()` se utiliza correctamente. Ahora, se normalizan los objetos `Date` al inicio del día antes de comparar sus valores numéricos (`getTime()`). Se introdujo un método auxiliar `normalizeDateToStartOfDay` para una gestión más limpia y reutilizable de las fechas.
  * **Reemplazo de `<v-typography>`:** Se reemplazaron todas las instancias de `<v-typography>` por elementos HTML estándar (`<span>`, `<div>`) con las clases de tipografía de Vuetify correspondientes (ej. `text-h4`, `subtitle-2`, `body-2`, `caption`, `text-h6`, `subtitle-1`). Esto resuelve la advertencia de Vue "Unknown custom element: <v-typography>".
  * **Corrección en `openModal` para Órdenes:**
    * Se aseguró que `item.IdOrden` se pase correctamente a la función `@click="openModal('orden', item.IdOrden)"`.
    * Se ajustó la lógica dentro de `openModal` para manejar las respuestas de la API de forma más robusta. Ahora, si la API o el store Vuex devuelve el objeto de la orden/guía directamente (sin un wrapper `data`), el componente lo reconoce y utiliza correctamente. Esto resuelve el `TypeError` y el problema de que el modal de órdenes no cargaba.
  * **Manejo de Fechas en Filtros:** Los campos de fecha (`fechaDesde`, `fechaHasta`) ahora disparan la recarga de ambas listas (`popularAmbasListas`) al cambiar.
  * **Consistencia en Nombres de Propiedades:** Asegura que los estados (`Estado`, `NombreEstado`) se usen de manera consistente para la visualización y la lógica del timeline.
  * **`console.log` para Depuración:** Se han añadido numerosos `console.log` en puntos estratégicos de los métodos asíncronos (`fetchEmpresas`, `eligioEmpresa`, `popularAmbasListas`, `popularListaDeOrdenes`, `popularListaDeGuias`, `openModal`, `_obtenerDetalleProductos`, `_construirTimelineOrden`, `_construirTimelineGuia`, `closeModal`) para ayudar a rastrear el flujo de datos, los parámetros de entrada y las respuestas de la API. Esto es crucial para identificar problemas de comunicación con el backend (como errores 404 o datos inesperados).
  * **Manejo de Errores Asíncronos:** Las funciones asíncronas ahora incluyen `try-catch` para capturar errores de la API y propagarlos o mostrarlos al usuario, mejorando la robustez.

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
import store from '@/store'
import ordenes from '@/store/ordenesV3' // Módulo Vuex para órdenes
import empresasV3 from '@/store/empresasV3' // Módulo Vuex para empresas
import roles from '@/store/roles' // Módulo Vuex para roles de usuario
import guias from '@/store/guias' // Importamos el módulo de guías

export default {
  name: 'SeguimientosOrdenesGuias', // Nuevo nombre para el componente
  components: { SelectorEmpresa },
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
        { text: 'N° Orden', value: 'numero', sortable: true },
        { text: 'Empresa', value: 'nombre', sortable: true },
        { text: 'Cliente', value: 'nombreDestino', sortable: true },
        { text: 'Fecha Creación', value: 'Creada', sortable: true },
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

      textoBusqueda: '', // Texto para el campo de búsqueda de órdenes.
      textoBusquedaGuias: '', // Texto para el campo de búsqueda de guías.
      loading: false, // Indica si alguna operación de carga está en curso.
      errorAlCargar: null, // Almacena mensajes de error durante la carga de datos.

      showModal: false, // Controla la visibilidad del modal de detalle.
      modalType: '', // 'orden' o 'guia', indica qué tipo de elemento se está mostrando en el modal.
      modalData: null, // Objeto con los datos del elemento (orden o guía) que se muestra en el modal.

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
    }
  },
  computed: {
    /**
     * `ordenesFiltradasParaTabla`:
     * Propiedad computada que filtra la lista completa de órdenes (`todasLasOrdenes`)
     * según la empresa seleccionada y el rango de fechas. Luego aplica la paginación manual.
     * Esta función solo prepara los datos para la tabla de órdenes.
     * @returns {Array} Array de órdenes filtradas y paginadas.
     */
    ordenesFiltradasParaTabla() {
      // Si no hay empresa seleccionada, no hay órdenes que mostrar.
      if (this.idEmpresa <= 0) return []

      // 1) Filtrar por empresa seleccionada
      let filtrado = this.todasLasOrdenes.filter(
        (o) => o.IdEmpresa === this.idEmpresa
      )

      // Convertir strings de fecha a objetos Date para comparación.
      const fechaDesdeNormalized = this.normalizeDateToStartOfDay(this.fechaDesde);
      const fechaHastaNormalized = this.normalizeDateToStartOfDay(this.fechaHasta);

      // 2) Filtrar por rango de fechas (basado en `fechaCreacionDate` de la orden)
      if (fechaDesdeNormalized) {
        filtrado = filtrado.filter((o) => {
          const ordenDateNormalized = this.normalizeDateToStartOfDay(o.Creada);
          return ordenDateNormalized && ordenDateNormalized.getTime() >= fechaDesdeNormalized.getTime();
        });
      }
      if (fechaHastaNormalized) {
        filtrado = filtrado.filter((o) => {
          const ordenDateNormalized = this.normalizeDateToStartOfDay(o.Creada);
          return ordenDateNormalized && ordenDateNormalized.getTime() <= fechaHastaNormalized.getTime();
        });
      }

      // 3) Aplicar paginación manual a los resultados filtrados.
      if (this.itemsPerPage > 0) {
        const start = (this.pageOrdenes - 1) * this.itemsPerPage
        return filtrado.slice(start, start + this.itemsPerPage)
      } else {
        // Si la opción es "Todos" (value: -1), se devuelve toda la lista filtrada.
        return filtrado
      }
    },

    /**
     * `pageCountOrdenes`:
     * Calcula el número total de páginas para la paginación de órdenes,
     * basándose en la cantidad total de órdenes filtradas y los ítems por página.
     * @returns {number} Número total de páginas.
     */
    pageCountOrdenes() {
      if (this.itemsPerPage > 0) {
        // Calcula el total de órdenes filtradas por empresa (sin considerar el filtro de fecha aquí para el total de páginas)
        const total = this.todasLasOrdenes.filter(
          (o) => o.IdEmpresa === this.idEmpresa
        ).length
        return Math.ceil(total / this.itemsPerPage)
      }
      return 1 // Si no hay ítems por página definidos, se asume 1 página.
    },

    /**
     * `paginationInfoOrdenes`:
     * Genera la cadena de texto para mostrar la información de paginación
     * en el pie de la tabla de órdenes (ej. "Mostrando 1-30 de 100").
     * @returns {string} Información de paginación.
     */
    paginationInfoOrdenes() {
      // Calcula el total de órdenes filtradas por empresa.
      const total = this.todasLasOrdenes.filter(
        (o) => o.IdEmpresa === this.idEmpresa
      ).length
      if (this.itemsPerPage > 0) {
        const start = (this.pageOrdenes - 1) * this.itemsPerPage + 1
        const end = Math.min(start + this.itemsPerPage - 1, total)
        return `${start}-${end} de ${total}`
      } else {
        // Si se muestran todos los ítems, el rango es de 1 al total.
        return `1-${total} de ${total}`
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
          const guiaDateNormalized = this.normalizeDateToStartOfDay(g.FechaOriginal);
          return guiaDateNormalized && guiaDateNormalized.getTime() >= fechaDesdeNormalized.getTime();
        });
      }
      if (fechaHastaNormalized) {
        filtrado = filtrado.filter((g) => {
          const guiaDateNormalized = this.normalizeDateToStartOfDay(g.FechaOriginal);
          return guiaDateNormalized && guiaDateNormalized.getTime() <= fechaHastaNormalized.getTime();
        });
      }

      // 3) Aplicar paginación manual a los resultados filtrados.
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
        // Calcula el total de guías filtradas por empresa.
        const total = this.todasLasGuias.filter(
          (g) => g.IdEmpresa === this.idEmpresa
        ).length
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
      // Calcula el total de guías filtradas por empresa.
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
      // Limpia los datos del modal y lo oculta.
      this.modalData = null;
      this.showModal = false;
      this.errorAlCargar = null; // Limpia mensajes de error previos.

      try {
        // Obtiene la configuración detallada de la empresa seleccionada.
        const resp = await empresasV3.getOneById(idEmpresa);
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
      this.idEmpresa = idEmpresa;
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
      console.log("popularAmbasListas: Intentando cargar órdenes y guías.");
      // Solo procede si hay una empresa y fechas de filtro válidas.
      if (this.idEmpresa > 0 && this.fechaDesde && this.fechaHasta) {
        this.loading = true; // Activa el spinner de carga general.
        this.errorAlCargar = null; // Limpia errores previos.
        try {
          // Ejecuta ambas funciones de carga en paralelo usando `Promise.all`.
          await Promise.all([
            this.popularListaDeOrdenes(),
            this.popularListaDeGuias()
          ]);
          console.log("popularAmbasListas: Carga de órdenes y guías completada exitosamente.");
        } catch (error) {
          console.error("popularAmbasListas: Error al cargar ambas listas:", error);
          // Muestra un mensaje de error si alguna de las promesas falla.
          this.errorAlCargar = error.message || "Ocurrió un error al cargar los datos. Intente nuevamente.";
        } finally {
          this.loading = false; // Desactiva el spinner de carga.
        }
      } else {
        console.log("popularAmbasListas: No hay empresa o fechas seleccionadas, limpiando listas.");
        // Si no hay filtros válidos, limpia las listas y los estados de carga/error.
        this.todasLasOrdenes = [];
        this.todasLasGuias = [];
        this.errorAlCargar = null;
        this.loading = false;
      }
    },

    /**
     * `popularListaDeOrdenes`:
     * Método asíncrono para cargar y procesar la lista de órdenes.
     * Filtra las órdenes por empresa y rango de fechas, las formatea y las ordena.
     */
    async popularListaDeOrdenes() {
      console.log("popularListaDeOrdenes: Iniciando carga de órdenes.");
      this.todasLasOrdenes = []; // Limpia la lista de órdenes antes de la carga.

      // Bloque para verificar roles de usuario (se mantiene del código original).
      try {
        const userId = store.state.usuarios.usuarioActual.Id;
        console.log("popularListaDeOrdenes: Obteniendo roles para userId:", userId);
        const rolesUser = await roles.getUserRolesById(userId);
        this.rolPermitido =
          !store.state.usuarios.usuarioActual.IdEmpresa &&
          rolesUser[0]?.IdRole === 1;
        console.log("popularListaDeOrdenes: rolPermitido:", this.rolPermitido);
      } catch (error) {
        console.error("popularListaDeOrdenes: Error al verificar roles de usuario:", error);
        this.rolPermitido = false;
      }

      try {
        // Llama al servicio de órdenes.getOrdenes(). Este endpoint debería devolver el IdGuia.
        console.log(`popularListaDeOrdenes: Llamando a ordenes.getOrdenes() para idEmpresa: ${this.idEmpresa}, fechas: ${this.fechaDesde} a ${this.fechaHasta}`);
        const response = await ordenes.getOrdenes(); // Asume que este ya filtra o filtraremos aquí
        console.log("popularListaDeOrdenes: Respuesta de ordenes.getOrdenes() recibida:", response);

        let todas = [];
        // Verifica el formato de la respuesta para obtener los datos.
        if (response && response.status === 'OK' && Array.isArray(response.data)) {
          todas = response.data;
        } else if (Array.isArray(response)) {
          todas = response; // Si la respuesta ya es el array directamente.
        } else {
          // Lanza un error si el formato es inesperado.
          throw new Error('Formato de órdenes inesperado. Contacte a soporte.');
        }

        // Filtro manual por empresa, en caso de que la API no lo haga directamente.
        todas = todas.filter(o => o.IdEmpresa === this.idEmpresa);
        console.log("popularListaDeOrdenes: Órdenes filtradas por empresa (antes de fecha):", todas.length);

        const fechaDesdeNormalized = this.normalizeDateToStartOfDay(this.fechaDesde);
        const fechaHastaNormalized = this.normalizeDateToStartOfDay(this.fechaHasta);

        todas = todas.filter(o => {
            // Asegúrate de que Creada es una cadena de fecha válida
            if (!o.Creada) return false;

            const ordenDateNormalized = this.normalizeDateToStartOfDay(o.Creada);

            let passedDateFilter = true;
            if (fechaDesdeNormalized) {
                passedDateFilter = ordenDateNormalized.getTime() >= fechaDesdeNormalized.getTime();
            }
            if (fechaHastaNormalized && passedDateFilter) {
                passedDateFilter = ordenDateNormalized.getTime() <= fechaHastaNormalized.getTime();
            }
            return passedDateFilter;
        });
        console.log("popularListaDeOrdenes: Órdenes filtradas por fecha:", todas.length);

        // Formatea los datos de cada orden para su visualización en la tabla.
        todas.forEach((o) => {
          // No necesitamos o.fechaCreacionDate aquí ya que se usa en el filtro
          o.Creada = new Date(o.Creada).toLocaleDateString(); // Formatea la fecha de creación.

          o.Modificada = o.Modificada
            ? new Date(o.Modificada).toLocaleDateString()
            : 'N/A';
          o.Preparado = o.Preparado
            ? new Date(o.Preparado).toLocaleDateString()
            : 'N/A';

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
          o.Estado = o.NombreEstado;

          o.tipo = o.preOrden === true || o.preOrden === 1 ? 'Pre-Orden' : 'Orden';
          o.preOrdenDisplay = o.tipo;

          o.nombre = o.nombre || 'N/A';
          o.nombreDestino = o.nombreDestino || 'N/A';
          // Aseguramos que IdGuia esté presente, aunque puede ser -1 si no hay guía
          o.IdGuia = o.IdGuia || -1;
        });

        // Ordena las órdenes por fecha de creación de forma descendente (más recientes primero).
        todas.sort(
          (a, b) => new Date(b.Creada).getTime() - new Date(a.Creada).getTime()
        );
        this.todasLasOrdenes = todas;
        console.log("popularListaDeOrdenes: Total de órdenes procesadas:", this.todasLasOrdenes.length);
      } catch (error) {
        console.error("popularListaDeOrdenes: Error al cargar órdenes:", error);
        // Lanza el error para que `popularAmbasListas` lo capture.
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
          g.FechaOriginal = g.FechaOriginal ? new Date(g.FechaOriginal).toLocaleDateString() : 'N/A'; // Formatea la fecha original.
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
              retrievedGuia.FechaOriginal = retrievedGuia.FechaOriginal ? new Date(retrievedGuia.FechaOriginal).toLocaleDateString() : 'N/A';
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
          console.log(`openModal: Llamando a ordenes.getById con ID: ${item}`);
          const response = await ordenes.getById(item);
          console.log("openModal: Respuesta de ordenes.getById recibida:", response);

          // Ajuste crucial: Determina si la respuesta contiene un wrapper 'data' o si el objeto es directo.
          dataToModal = (response && response.data) ? response.data : (response && response.Id ? response : null);

          if (dataToModal && dataToModal.Id) {
            // Obtiene detalles de productos y formatea fechas para el modal de orden.
            const productosDetalle = await this._obtenerDetalleProductos(dataToModal);
            dataToModal.productosDetalle = productosDetalle;
            dataToModal.Creada = dataToModal.FechaCreacion ? new Date(dataToModal.FechaCreacion).toLocaleDateString() : 'N/A';
            dataToModal.Preparado = dataToModal.FechaPreparado ? new Date(dataToModal.FechaPreparado).toLocaleDateString() : 'N/A';
            dataToModal.FechaDistribucion = dataToModal.Fecha ? new Date(dataToModal.Fecha).toLocaleDateString() : 'N/A';
            // Asegura que el estado textual para el modal se use correctamente.
            switch (dataToModal.Estado) {
              case 1: dataToModal.NombreEstado = 'Pendiente'; break;
              case 2: dataToModal.NombreEstado = 'Preparado'; break;
              case 3: dataToModal.NombreEstado = 'A distribuciòn'; break;
              case 4: dataToModal.NombreEstado = 'Anulado'; break;
              case 5: dataToModal.NombreEstado = 'Retira Cliente'; break;
              default: dataToModal.NombreEstado = `Desconocido (${dataToModal.Estado})`;
            }
            dataToModal.nombreCliente = dataToModal.Destino?.Nombre || 'N/A';
            console.log("openModal: Datos de orden para modal procesados:", dataToModal);
          } else {
            // Lanza un error si el objeto de la orden no es válido.
            throw new Error('No se encontraron detalles válidos para esta orden.');
          }
        } else if (type === 'guia') {
          // Si es una guía, se espera que `item` ya sea el objeto completo de la guía de la tabla.
          console.log("openModal: Procesando datos de guía para modal:", item);
          dataToModal = { ...item }; // Clona el objeto para evitar mutaciones directas en la lista de la tabla.
          // Las guías no tienen un `detalle de productos` como las órdenes por defecto en este sistema.
          dataToModal.productosDetalle = []; // Por ahora, se inicializa vacío.

          // Formatea fechas específicas de la guía para el modal.
          dataToModal.FechaOriginal = dataToModal.FechaOriginal ? new Date(dataToModal.FechaOriginal).toLocaleDateString() : 'N/A';
          // Para la fecha de no entrega, se usa la `Fecha` de la guía si el estado es `NO ENTREGADO`.
          if (dataToModal.Estado === 'NO ENTREGADO' && dataToModal.Fecha) {
              dataToModal.FechaNoEntregado = new Date(dataToModal.Fecha).toLocaleDateString();
          } else {
            dataToModal.FechaNoEntregado = 'N/A';
          }
           console.log("openModal: Datos de guía para modal procesados:", dataToModal);
        }

        // Si se obtuvieron datos válidos para el modal, los asigna y lo muestra.
        if (dataToModal && (dataToModal.Id || dataToModal.Comprobante)) {
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

    /**
     * `_obtenerDetalleProductos`:
     * Método asíncrono auxiliar para obtener los detalles de productos de una orden.
     * Decide si usar el endpoint de productos con partida (`PART`) o el estándar.
     * @param {object} orden - El objeto de la orden para la cual obtener los detalles de productos.
     * @returns {Promise<Array>} Promesa que resuelve a un array de productos o un array vacío en caso de error.
     */
    async _obtenerDetalleProductos(orden) {
      console.log("_obtenerDetalleProductos: Obteniendo detalle de productos para orden con IdEmpresa:", orden.IdEmpresa);
      try {
        // Obtiene la configuración de la empresa para saber si usa "PART".
        const empresaConfig = await empresasV3.getOneById(orden.IdEmpresa);
        console.log("_obtenerDetalleProductos: Configuración de empresa para productos:", empresaConfig);
        if (empresaConfig && empresaConfig.PART) {
          // Si usa PART, llama al endpoint específico para productos con partida.
          const productos = await ordenes.getDetalleOrdenAndProductoPartidaById(orden.Id);
          console.log("_obtenerDetalleProductos: Productos con partida obtenidos:", productos);
          return productos;
        }
        // Si no usa PART, llama al endpoint estándar para productos.
        const productos = await ordenes.getDetalleOrdenAndProductoById(orden.Id);
        console.log("_obtenerDetalleProductos: Productos estándar obtenidos:", productos);
        return productos;
      } catch (error) {
        console.error("_obtenerDetalleProductos: Error al obtener detalle de productos:", error);
        return []; // Retorna un array vacío en caso de error.
      }
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
      const isPreOrden = orden.preOrden === true || orden.preOrden === 1;
      const isRetiraCliente = currentStatusText === 'Retira Cliente'; // Usa el estado textual para la verificación.

      // Fechas ya formateadas en el `openModal`.
      const fechaModificada = orden.Modificada || 'N/A';
      const fechaCreacion = orden.Creada || 'N/A';
      const fechaPreparado = orden.Preparado || 'N/A';
      const fechaDistribucion = orden.FechaDistribucion || 'N/A';

      if (isAnulada) {
        // Si la orden está anulada, solo se muestra el paso de anulación con estado 'current-bad'.
        timelineSteps.push({
          id: 'anulado',
          nombre: 'Orden Anulada',
          icon: 'mdi-cancel',
          fecha: fechaModificada,
          descripcion: `La orden ha sido cancelada por ${orden.Usuario || 'N/A'}.`,
          statusClass: 'current-bad', // Clase para estados negativos actuales.
        });
      } else {
        // Paso "Pre-Orden" (solo si la orden es una pre-orden).
        if (isPreOrden) {
          timelineSteps.push({
            id: 'pre_orden',
            nombre: 'Pre-Orden',
            icon: 'mdi-file-cabinet-outline',
            fecha: fechaCreacion,
            descripcion: 'Orden creada como pre-orden.',
            // Si el estado actual NO es "Pre-Orden", ya está completado; de lo contrario, es el estado actual.
            statusClass:
              currentStatusText !== 'Pre-Orden' ? 'completed' : 'current',
          });
        }

        // Paso "Pendiente"
        timelineSteps.push({
          id: 'pendiente',
          nombre: 'Pendiente',
          icon: 'mdi-file-document-edit-outline',
          fecha: fechaCreacion,
          descripcion: `Ingresada por: ${orden.UsuarioCreoOrd || 'N/A'}.`,
          statusClass:
            currentStatusText === 'Pendiente'
              ? 'current' // Es el estado actual
              : (orden.FechaCreacion ? 'completed' : 'pending'), // Completado si tiene fecha, sino pendiente
        });

        // Paso "Preparada"
        timelineSteps.push({
          id: 'preparado',
          nombre: 'Preparada',
          icon: 'mdi-package-variant-closed-check',
          fecha: fechaPreparado,
          descripcion: 'Los productos han sido preparados.',
          statusClass:
            currentStatusText === 'Preparado'
              ? 'current'
              : (orden.FechaPreparado ? 'completed' : 'pending'),
        });

        // Determina si la orden ha alcanzado el estado "Preparado" o posterior para incluir los siguientes pasos.
        const reachedPreparationOrBeyond = [
          'Preparado',
          'A distribuciòn',
          'Retira Cliente',
        ].includes(currentStatusText);

        if (reachedPreparationOrBeyond) {
          if (isRetiraCliente) {
            // Paso "Retira Cliente"
            timelineSteps.push({
              id: 'retira_cliente',
              nombre: 'Retira Cliente',
              icon: 'mdi-account-check-outline',
              fecha: fechaDistribucion,
              descripcion: 'La orden está lista para retiro por el cliente.',
              statusClass:
                currentStatusText === 'Retira Cliente'
                  ? 'current'
                  : (orden.Fecha ? 'completed' : 'pending'), // 'Fecha' es la fecha de distribución/retiro
            });
          } else {
            // Paso "A Distribución"
            timelineSteps.push({
              id: 'a_distribucion',
              nombre: 'A Distribución',
              icon: 'mdi-truck-fast-outline',
              fecha: fechaDistribucion,
              descripcion: 'La orden ha sido despachada.',
              statusClass:
                currentStatusText === 'A distribuciòn'
                  ? 'current'
                  : (orden.Fecha ? 'completed' : 'pending'),
            });
          }
        }
      }
      // Re-evaluación final de las clases de estado para asegurar la secuencia 'completed' -> 'current' -> 'pending'.
      // Esto asegura que todos los pasos anteriores al 'current' se marquen como 'completed'.
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
          // El estado es 'current' si la guía está 'ENTREGADO', sino 'pending'.
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
          case 'Pendiente': return 'grey lighten-4 amber--text text--darken-3'; // Amarillo para advertencia.
          case 'Preparado': return 'grey lighten-4 blue--text text--darken-2'; // Azul para información.
          case 'A distribuciòn': return 'grey lighten-4 green--text text--darken-2'; // Verde para éxito/distribución.
          case 'Anulado': return 'grey lighten-4 red--text text--darken-2'; // Rojo para error/anulado.
          case 'Retira Cliente': return 'grey lighten-4 deep-purple--text text--darken-2'; // Morado para retiro.
          default: return 'grey lighten-4 grey--text text--darken-1'; // Gris por defecto.
        }
      }
      // Clases para estados de Guías (basadas en `VistaDeTracking.vue`).
      else if (['Pedido en preparación', 'Pedido preparado', 'En CD', 'En Planchada', 'Ruteado', 'DESPACHADO', 'En distribución', 'Entregado', 'No entregado', 'Entrega parcial', 'Pedido retirado', 'ANULADO'].includes(estado)) {
          switch (estado) {
              case 'Entregado':
              case 'Pedido preparado':
              case 'Pedido en preparación':
              case 'En CD':
              case 'En Planchada':
              case 'Ruteado':
              case 'DESPACHADO':
              case 'En distribución':
              case 'Pedido retirado':
                  return 'grey lighten-4 green--text text--darken-2'; // Verde para estados de progreso positivo.
              case 'No entregado':
              case 'ANULADO': // Añadido para guías anuladas
                  return 'grey lighten-4 red--text text--darken-2'; // Rojo para no entregado o anulado.
              case 'Entrega parcial':
                  return 'grey lighten-4 orange--text text--darken-2'; // Naranja/Amarillo para parcial.
              default:
                  return 'grey lighten-4 grey--text text--darken-1'; // Gris por defecto.
          }
      }
      return 'grey lighten-4 grey--text text--darken-1'; // Color por defecto si el estado no coincide.
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
/* ============================ */
/* Estilos generales            */
/* ============================ */

/*
  `.blue-header`:
  Estilo aplicado a la fila de encabezados de la `v-data-table`
  para darle un fondo azul suave y texto azul oscuro.
*/
.blue-header th {
  background-color: #e3f2fd; /* Azul muy suave */
  color: #1a237e;            /* Texto azul oscuro para contraste */
  font-weight: 600;          /* Negrita ligera en encabezados */
}

/* ============================ */
/* Estilos para el Timeline     */
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
  background-color: #f5f5f5; /* Vuetify grey lighten-4 */
  color: #757575;            /* Vuetify grey darken-1 */
}
</style>