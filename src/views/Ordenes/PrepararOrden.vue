<template>
  <v-container class="remito-container">

    <!-- TÍTULO -->
    <h2 class="remito-titulo">ORDEN DE SALIDA</h2>

    <!-- CABECERA -->
    <div class="remito-box">
      <div class="remito-header">
        <div><strong>EMPRESA:</strong> {{ empresaNombre }}</div>
        <div><strong>N.º DE ORDEN:</strong> {{ numeroOrden }}</div>
      </div>
      <div class="remito-header">
        <div><strong>FECHA:</strong> {{ fecha }}</div>
        <div><strong>USUARIO:</strong> {{ usuario }}</div>
      </div>
    </div>

    <!-- LECTOR DE BARCODES -->
    <v-row class="mt-4">
      <v-col cols="6">
        <v-text-field
          ref="barcodeArticulo"
          v-model="barcodeArticulo"
          label="Barcode artículo"
          prepend-inner-icon="mdi-barcode-scan"
          @keydown.enter.prevent="barcodeEnter"
          dense
        />
      </v-col>
    </v-row>

    <!-- TABLA DE PRODUCTOS -->
    <v-simple-table class="remito-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Posición</th>
          <th>Unidades</th>
          <th>Cant. Salida</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in detalle"
          :key="index"
          :class="rowClass(item)"
        >
          <td>{{ item.NombreProducto }}</td>
          <td>{{ item.Posicion || '-' }}</td>
          <td>{{ item.Unidades }}</td>
          <td class="text-center">
            <v-edit-dialog
              :return-value.sync="item.CantidadSalida"
              @save="actualizarValidacion(item)"
            >
              <div class="d-flex align-center">
                {{ item.CantidadSalida }}
                <v-icon small class="ml-1">mdi-pencil</v-icon>
              </div>
              <template v-slot:input>
                <v-text-field v-model.number="item.CantidadSalida" type="number" autofocus></v-text-field>
              </template>
            </v-edit-dialog>
          </td>
          <td>
            <v-chip :color="chipColor(item)" dark small>{{ item.CantidadSalida }}</v-chip>
          </td>
        </tr>
      </tbody>
    </v-simple-table>


    <!-- BOTONES -->
    <div class="remito-actions no-print" v-if="todoValidado">
      <v-btn color="primary" @click="procesarOrden">
        Procesar Orden
      </v-btn>
      <v-btn class="ml-2" outlined @click="window.print()">
        Imprimir
      </v-btn>
      <v-btn class="ml-2" outlined color="success" @click="descargarExcel">
        Descargar Excel
      </v-btn>
    </div>

  </v-container>
</template>

<script>
import ordenesV3 from '@/store/ordenesV3'
import store from '@/store'
import fechas from 'vue-lsi-util/fechas'
import excel from 'exceljs'
import { saveAs } from 'file-saver'

export default {
  name: 'PrepararOrden',
  data () {
    return {
      idOrden: this.$route.params.idOrden,
      numeroOrden: '',
      empresaId: 0,
      empresaNombre: '',
      usuario: store.state.usuarios.usuarioActual.Nombre,
      fecha: fechas.getHoy(),
      barcodeArticulo: '',
      detalle: []
    }
  },
  computed: {
    todoValidado () {
      return this.detalle.every(d => d.CantidadSalida === d.Unidades)
    }
  },
  created () {
    this.cargarDatos()
  },
  methods: {
    async cargarDatos () {
      const respuestaDetalle = await ordenesV3.getDetalleOrdenAndProductoById(this.idOrden)
      this.detalle = respuestaDetalle.map(d => ({
        ...d,
        validado: false,
        CantidadSalida: 0,
        NombreProducto: d.Producto?.Nombre || d.NombreProducto || d.Nombre || d.Descripcion || 'Sin nombre',
        Posicion: d.Posicion || d.PosicionNombre || d.Ubicacion || null,
        Barcode: d.Barcode || d.CodeEmpresa,
        CodeEmpresa: d.CodeEmpresa
      }))

      const orden = await ordenesV3.getById(this.idOrden)
      this.numeroOrden = orden.Numero || orden.numero
      this.empresaId = orden.IdEmpresa || orden.id_empresa
      const emp = orden.Empresa
      this.empresaNombre = emp?.RazonSocial || emp?.Nombre || 'Empresa desconocida'
      this.$nextTick(() => this.$refs.barcodeArticulo && this.$refs.barcodeArticulo.focus())
    },

    async procesarOrden () {
      const detallePayload = this.detalle.map(i => ({
        IdProducto: i.IdProducto,
        Cantidad: i.CantidadSalida
      }))

      const Cabeceras = {
        IdOrden: this.idOrden,
        IdEmpresa: this.empresaId,
        Comprobante: this.numeroOrden,
        Usuario: this.usuario,
        Detalle: detallePayload,
        Textil: false,
        StockPosicionado: false,
        TieneLote: false,
        Fecha: this.fecha
      }

      try {
        await ordenesV3.saleOrder(this.empresaId, { Cabeceras })
        store.dispatch('snackbar/mostrar', 'Orden procesada correctamente')
        this.$router.push('/Ordenes/OrdenesPendientes')
      } catch (e) {
        store.dispatch('snackbar/mostrar', 'Error al procesar la orden')
      }
    },
    async descargarExcel () {
      const workbook = new excel.Workbook()
      const sheet = workbook.addWorksheet('Orden')
      sheet.columns = [
        { header: 'Producto', key: 'producto', width: 30 },
        { header: 'Posicion', key: 'posicion', width: 15 },
        { header: 'Unidades', key: 'unidades', width: 10 },
        { header: 'Cant. Salida', key: 'salida', width: 12 }
      ]
      this.detalle.forEach(d => {
        sheet.addRow({
          producto: d.NombreProducto,
          posicion: d.Posicion || '',
          unidades: d.Unidades,
          salida: d.CantidadSalida
        })
      })
      const buf = await workbook.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `orden_${this.numeroOrden}.xlsx`)
    },

    barcodeEnter () {
      const codigo = this.barcodeArticulo.trim()
      if (!codigo) return
      const item = this.detalle.find(d => d.Barcode === codigo || d.CodeEmpresa === codigo)
      if (item) {
        if (!item.CantidadSalida) item.CantidadSalida = 0
        if (item.CantidadSalida < item.Unidades) {
          item.CantidadSalida++
          this.actualizarValidacion(item)
        } else {
          store.dispatch('snackbar/mostrar', 'Cantidad excedida')
        }
      } else {
        store.dispatch('snackbar/mostrar', codigo + ': Barcode inexistente')
      }
      this.barcodeArticulo = ''
      this.$nextTick(() => this.$refs.barcodeArticulo.focus())
    },
    actualizarValidacion (item) {
      item.validado = item.CantidadSalida === item.Unidades
    },
    chipColor (item) {
      return item.CantidadSalida === item.Unidades ? 'green' : 'red'
    },
    rowClass (item) {
      return item.CantidadSalida === item.Unidades ? 'correct-row' : 'incorrect-row'
    }
  }
}
</script>

<style scoped>
.remito-container {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  padding: 32px;
  background-color: #fff;
  color: #333;
}

.remito-titulo {
  text-align: center;
  font-size: 20px;
  margin-bottom: 24px;
  font-weight: bold;
  letter-spacing: 1px;
}

.remito-box {
  border: 1px solid #ccc;
  padding: 20px 24px;
  margin-bottom: 30px;
  background-color: #f9f9f9;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.remito-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}

.remito-table {
  width: 100%;
  border: 1px solid #aaa;
  border-radius: 4px;
  overflow: hidden;
}

.remito-table th {
  background-color: #efefef;
  font-weight: 600;
  text-transform: uppercase;
}

.remito-table th,
.remito-table td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: left;
}
.correct-row {
  background-color: #e8f5e9;
}
.incorrect-row {
  background-color: #ffebee;
}

.remito-actions {
  margin-top: 28px;
  display: flex;
  gap: 12px;
}


@media print {
  .no-print {
    display: none !important;
  }

  .remito-container {
    padding: 0;
    color: #000;
    background: white;
    font-size: 12pt;
  }

  .remito-box {
    border: none;
    box-shadow: none;
    padding: 0 0 16px 0;
  }

  .remito-table {
    page-break-inside: auto;
  }

}
</style>
