<template>
  <v-container fluid>
    <!-- FILA GRÁFICO Y CARDS DE RESUMEN -->
    <v-row class="mb-6 mt-2 resumen-row" align="center" justify="center" no-gutters>
      <!-- Gráfico de torta a la izquierda -->
      <v-col
        cols="12"
        md="6"
        lg="5"
        class="d-flex justify-center align-center chart-col"
        style="min-height: 230px;"
      >
        <div class="chart-wrap">
          <canvas ref="pieChart" width="230" height="230"></canvas>
        </div>
      </v-col>
      <!-- Cards de resumen a la derecha, siempre horizontal en desktop -->
      <v-col
        cols="12"
        md="6"
        lg="7"
        class="d-flex align-center justify-center resumen-tarjetas"
      >
        <div class="resumen-cards-row">
          <!-- CARD: TOTAL -->
          <v-card class="tarjeta-resumen azul">
            <div class="titulo">Totales</div>
            <div class="cantidad">{{ resumen.total }}</div>
          </v-card>
          <!-- CARD: EN USO -->
          <v-card class="tarjeta-resumen verde">
            <div class="titulo">En uso</div>
            <div class="cantidad">{{ resumen.enUso }}</div>
          </v-card>
          <!-- CARD: VACÍAS -->
          <v-card class="tarjeta-resumen rojo">
            <div class="titulo">Vacías</div>
            <div class="cantidad">{{ resumen.vacias }}</div>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- FILTRO Y ACCIONES DE SELECCIÓN -->
    <v-row class="mb-2">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filtro"
          label="Buscar posición..."
          append-icon="mdi-magnify"
          dense
        />
      </v-col>
      <v-col cols="12" md="8" class="d-flex align-end justify-end flex-wrap">
        <v-btn @click="seleccionarTodas" small outlined>Seleccionar todas</v-btn>
        <v-btn color="success" @click="exportarExcel" class="mx-2" large>
          EXPORTAR A EXCEL <v-icon right>mdi-microsoft-excel</v-icon>
        </v-btn>
        <v-btn
          color="red"
          :disabled="seleccionadas.length === 0"
          class="ml-2"
          @click="vaciarSeleccionadas"
        >
          Vaciar seleccionadas
        </v-btn>
      </v-col>
    </v-row>

    <!-- TABLA DE POSICIONES -->
    <v-data-table
      :headers="headers"
      :items="posicionesFiltradas"
      :item-key="'Id'"
      show-select
      v-model="seleccionadas"
      dense
      class="elevation-2"
      style="border-radius:14px"
    >
      <!-- Estado visual con chip -->
      <template v-slot:item.estado="{ item }">
        <v-chip small :color="item.EnUso ? 'green' : 'red'" dark>
          {{ item.EnUso ? 'En uso' : 'Vacía' }}
        </v-chip>
      </template>
      <!-- Nombre de la posición con tooltip y click -->
      <template v-slot:item.Nombre="{ item }">
        <span
          style="cursor:pointer; text-decoration:underline"
          @click="mostrarDetalle(item)"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">{{ item.Nombre }}</span>
            </template>
            <span>
              {{ item.EnUso
                ? 'Click para ver productos de la posición'
                : 'Posición vacía'
              }}
            </span>
          </v-tooltip>
        </span>
      </template>
      <!-- Artículos distintos -->
      <template v-slot:item.CantArticulos="{ item }">
        {{ item.CantArticulos }}
      </template>
      <!-- Unidades -->
      <template v-slot:item.CantUnidades="{ item }">
        {{ item.CantUnidades }}
      </template>
    </v-data-table>

    <!-- MODAL DETALLE DE ARTÍCULOS DE LA POSICIÓN -->
    <v-dialog v-model="showModal" max-width="700px">
      <v-card>
        <v-card-title class="text-h6">
          Productos en posición: <b>{{ posicionDetalle?.Nombre }}</b>
        </v-card-title>
        <v-card-text>
          <!-- Si la posición no tiene productos -->
          <v-alert v-if="!detalleArticulos.length" color="info" dense>
            No hay artículos en esta posición.
          </v-alert>
          <!-- Tabla de artículos si hay productos -->
          <v-data-table
            v-else
            :headers="detalleHeaders"
            :items="detalleArticulos"
            dense
            class="elevation-1"
            hide-default-footer
          >
            <!-- Columna Descripción -->
            <template v-slot:item.Producto="{ item }">
              {{ item.Producto && item.Producto.Nombre ? item.Producto.Nombre : '-' }}
            </template>
            <!-- Columna Barcode -->
            <template v-slot:item.Barcode="{ item }">
              {{ item.Producto && item.Producto.Barcode ? item.Producto.Barcode : '-' }}
            </template>
            <!-- Columna Empresa -->
            <template v-slot:item.Empresa="{ item }">
              {{ item.Empresa && item.Empresa.Nombre ? item.Empresa.Nombre : '-' }}
            </template>
            <!-- Unidades -->
            <template v-slot:item.Unidades="{ item }">
              {{ item.Unidades || 0 }}
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="showModal = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// ==============================
// LÓGICA DEL COMPONENTE
// ==============================
import posiciones from "@/store/posiciones"
import store from "@/store"
import excel from "exceljs"
import { saveAs } from "file-saver"
import Chart from "chart.js/auto"

export default {
  name: "VaciarPosicion",

  data() {
    return {
      listaPosiciones: [],   // Todas las posiciones y su estado actual
      seleccionadas: [],     // Objetos completos de la fila seleccionados
      filtro: "",            // Para filtrar por nombre/cantidad/etc
      resumen: { total: 0, enUso: 0, vacias: 0 }, // Totales arriba
      showModal: false,      // Modal de detalle de posición
      posicionDetalle: null, // Posición seleccionada (para modal)
      detalleArticulos: [],  // Productos/artículos en la posición
      pieChart: null,        // Objeto Chart.js para la torta
      headers: [
        { text: "Estado", value: "estado", sortable: false },
        { text: "Posición", value: "Nombre" },
        { text: "Unidades", value: "CantUnidades" },
        { text: "Artículos distintos", value: "CantArticulos" }
        // ID está presente internamente, pero NO lo mostramos.
      ],
      detalleHeaders: [
        { text: "Unidades", value: "Unidades" },
        { text: "Descripción", value: "Producto" },
        { text: "Barcode", value: "Barcode" },
        { text: "Empresa", value: "Empresa" }
      ]
    }
  },

  computed: {
    // Filtro de la tabla principal
    posicionesFiltradas() {
      if (!this.filtro) return this.listaPosiciones
      const buscar = this.filtro.toLowerCase()
      return this.listaPosiciones.filter(pos =>
        (pos.Nombre || "").toLowerCase().includes(buscar) ||
        ("" + pos.CantUnidades).includes(buscar) ||
        ("" + pos.CantArticulos).includes(buscar)
      )
    }
  },

  methods: {
    // Trae todas las posiciones y sus estados
    async cargarPosiciones() {
      this.listaPosiciones = []
      let total = 0, enUso = 0, vacias = 0

      // Traigo todas las posiciones
      const todas = await posiciones.getAll()
      for (const pos of todas) {
        // Traigo productos/artículos de esa posición
        let articulos = []
        try {
          articulos = await posiciones.getContent(pos.Id)
        } catch (e) {
          articulos = []
        }
        // Sumo unidades y artículos
        const cantUnidades = articulos.reduce((acc, art) => acc + (art.Unidades || 0), 0)
        const cantArticulos = articulos.length

        // Armo objeto posición para la tabla
        this.listaPosiciones.push({
          ...pos,
          EnUso: cantArticulos > 0,
          CantUnidades: cantUnidades,
          CantArticulos: cantArticulos,
          Detalle: articulos // Modal rápido y eficiente
        })

        total++
        if (cantArticulos > 0) enUso++
        else vacias++
      }
      // Cargo resumen para tarjetas de arriba
      this.resumen = { total, enUso, vacias }
      // Dibujo el gráfico de torta
      this.$nextTick(this.renderPieChart)
    },

    // Gráfico de torta, sin leyenda (solo gráfico)
    renderPieChart() {
      if (!this.$refs.pieChart) return
      if (this.pieChart) this.pieChart.destroy()
      this.pieChart = new Chart(this.$refs.pieChart, {
        type: "pie",
        data: {
          labels: ["En uso", "Vacías"],
          datasets: [
            {
              data: [this.resumen.enUso, this.resumen.vacias],
              backgroundColor: ["#43a047", "#ff5252"],
              borderColor: ["#fff", "#fff"],
              borderWidth: 3,
              hoverOffset: 16
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false // Oculta leyenda, sólo gráfico
            }
          }
        }
      })
    },

    // Mostrar modal detalle de la posición
    mostrarDetalle(posicion) {
      this.posicionDetalle = posicion
      this.detalleArticulos = Array.isArray(posicion.Detalle) ? posicion.Detalle : []
      this.showModal = true
    },

    // Selecciono todas las posiciones filtradas en la tabla
    seleccionarTodas() {
      this.seleccionadas = this.posicionesFiltradas.map(pos => pos)
    },

    // Vacía solo las posiciones con ID numérico válido
    vaciarSeleccionadas() {
      // Mapeo a los IDs de los objetos seleccionados
      const idsDisponibles = this.listaPosiciones.map(p => p.Id)
      const posicionesValidas = this.seleccionadas
        .map(item => item.Id)
        .filter(id => typeof id === "number" && !isNaN(id) && idsDisponibles.includes(id))

      if (!posicionesValidas.length) {
        this.mostrarMensaje("No hay posiciones válidas para vaciar.", "Error")
        return
      }

      const tieneMuchaCarga = this.listaPosiciones
        .filter(pos => posicionesValidas.includes(pos.Id))
        .some(pos => pos.CantUnidades >= 100)
      let texto = `¿Confirma el vaciado de las ${posicionesValidas.length} posiciones seleccionadas?<br><br>`
      if (tieneMuchaCarga) {
        texto +=
          "<b style='color:red'>¡Atención! Una o más posiciones tienen mucho stock.<br>Esta acción no se puede deshacer.</b><br>"
      }
      store.dispatch("alertDialog/mostrar", {
        titulo: "Confirmar vaciado",
        texto,
        botonPrimario: "Vaciar posiciones",
        botonSecundario: "Cancelar",
        callback: async (respuesta) => {
          if (respuesta === "Vaciar posiciones") {
            for (const posId of posicionesValidas) {
              try {
                await posiciones.vaciar(posId)
              } catch (e) {}
            }
            this.mostrarMensaje("Posiciones vaciadas correctamente.", "Éxito")
            this.seleccionadas = []
            this.cargarPosiciones()
          }
        }
      })
    },

    // Exportar listado de posiciones a Excel
    async exportarExcel() {
      const workbook = new excel.Workbook()
      const worksheet = workbook.addWorksheet("Posiciones")
      worksheet.columns = [
        { header: "Posición", width: 40 },
        { header: "Estado", width: 10 },
        { header: "Unidades", width: 15 },
        { header: "Artículos distintos", width: 20 }
      ]
      this.listaPosiciones.forEach(pos => {
        worksheet.addRow([
          pos.Nombre,
          pos.EnUso ? "En uso" : "Vacía",
          pos.CantUnidades,
          pos.CantArticulos
        ])
      })
      worksheet.getRow(1).font = { bold: true, size: 15 }
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) row.font = { size: 13 }
      })
      const buf = await workbook.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `Posiciones_${(new Date()).toLocaleDateString('es-AR')}.xlsx`)
    },

    // Mensaje global para snack o popup
    mostrarMensaje(mensaje, titulo) {
      store.dispatch("alertDialog/mostrar", { titulo, mensaje })
    }
  },

  mounted() {
    // Al montar el componente, cargo toda la info y la tabla inicial
    this.cargarPosiciones()
  }
}
</script>

<style scoped>
/* ===========================================
   ESTILOS PRODUCTIVOS, RESPONSIVE, COMENTADOS
   =========================================== */

/* FILA resumen y gráfica: centrado y alineado horizontal SIEMPRE */
.resumen-row {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0;
}

/* Cards de resumen: SIEMPRE horizontal, gap proporcional, ajustable */
.resumen-cards-row {
  display: flex;
  flex-direction: row;
  gap: 22px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 12px;
  margin-bottom: 12px;
}

/* Cards adaptativos, crecen pero nunca bajan a columna salvo en móviles extremos */
.tarjeta-resumen {
  min-width: 104px;
  min-height: 84px;
  width: 132px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 28px rgba(65,100,250,0.13);
  padding: 18px 24px 10px 24px;
  transition: transform 0.15s;
}
.tarjeta-resumen:hover {
  transform: scale(1.04);
  box-shadow: 0 14px 32px rgba(20, 30, 85, 0.16);
}
.tarjeta-resumen.azul {
  background: linear-gradient(115deg,#417fff 65%,#6db2ff 98%);
  color: #fff;
}
.tarjeta-resumen.verde {
  background: linear-gradient(115deg,#5beb51 65%,#239a41 98%);
  color: #fff;
}
.tarjeta-resumen.rojo {
  background: linear-gradient(115deg,#ff5252 65%,#b30021 98%);
  color: #fff;
}
.tarjeta-resumen .titulo {
  font-size: 1.02rem;
  font-weight: 500;
  margin-bottom: 2px;
  text-shadow: 0 2px 6px #0001;
  letter-spacing: 0.08em;
}
.tarjeta-resumen .cantidad {
  font-size: 2.2rem;
  font-weight: 700;
  margin-top: 4px;
  letter-spacing: 1.5px;
  text-shadow: 0 3px 12px #0002;
}

/* Gráfico de torta centrado */
.chart-col {
  display: flex;
  align-items: center;
  justify-content: center;
}
.chart-wrap {
  background: rgba(31,66,160,0.07);
  border-radius: 60%;
  padding: 15px;
  box-shadow: 0 4px 22px 0 rgba(62,110,220,0.08);
  margin-bottom: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 230px;
  min-width: 230px;
}

/* Responsive SOLO apila debajo de 720px, si no hay lugar */
@media (max-width: 720px) {
  .resumen-row {
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .resumen-cards-row {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-items: center;
    margin-top: 18px;
    margin-bottom: 6px;
  }
  .tarjeta-resumen {
    min-width: 80px;
    width: 100px;
    min-height: 62px;
    padding: 12px 8px 6px 8px;
    font-size: 1rem;
  }
  .chart-wrap {
    margin-bottom: 2px;
    padding: 5px;
    min-height: 120px;
    min-width: 120px;
    max-width: 150px;
  }
}
</style>
