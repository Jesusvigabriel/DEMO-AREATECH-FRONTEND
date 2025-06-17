<template>
  <v-container class="remito-container">

    <!-- TÍTULO -->
    <v-btn icon class="mb-2" @click="$router.back()">
      <v-icon class="icono-atras-negro">mdi-arrow-left</v-icon>
    </v-btn>
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
      <v-col cols="4" v-if="showCantidad">
        <v-text-field
          ref="cantidadArticulo"
          v-model.number="cantidadArticulo"
          label="Cantidad"
          type="number"
          @keydown.enter.prevent="cantidadEnter"
          dense
        />
      </v-col>
    </v-row>

    <!-- TABLA DE PRODUCTOS -->
    <v-simple-table class="remito-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Barcode</th>
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
          <td>{{ item.Barcode || item.CodeEmpresa }}</td>
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
      <v-btn class="ml-2" outlined @click="$router.back()">
        <v-icon left>mdi-arrow-left</v-icon>
        Volver
      </v-btn>
      <v-btn class="ml-2" outlined color="success" @click="descargarExcel">
        Descargar Excel
      </v-btn>
    </div>

  </v-container>
</template>

<script>
import atrasIcono from '@/assets/icons/atrasicono.svg'

import ordenesV3 from '@/store/ordenesV3'
import ordenes from '@/store/ordenes'
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
      cantidadArticulo: 1,
      showCantidad: false,
      selectedItem: null,
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
        console.log('Cargando datos para la orden', this.idOrden)
        const respuestaDetalle = await ordenesV3.getDetalleOrdenAndProductoById(this.idOrden)
        console.log('Detalle recibido', respuestaDetalle)
        this.detalle = respuestaDetalle.map(d => ({
          ...d,
          validado: false,
          CantidadSalida: 0,
          NombreProducto: d.Producto?.Nombre || d.NombreProducto || d.Nombre ||
            d.Descripcion || d.Productos || 'Sin nombre',
        Posicion:
          (Array.isArray(d.Posiciones) && d.Posiciones.length
            ? d.Posiciones.map(p => p.Posicion).join(', ')
            : d.Posicion || d.PosicionNombre || d.Ubicacion || null),
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

        console.log('Procesar Orden payload:', JSON.stringify(Cabeceras, null, 2))

        try {
          console.log('Enviando saleOrder')
          await ordenesV3.saleOrder(this.empresaId, { Cabeceras })
          console.log('saleOrder exitosa')
          store.dispatch('snackbar/mostrar', 'Orden procesada correctamente')
          this.$router.push('/Ordenes/OrdenesPendientes')
        } catch (e) {
          console.error('Error en saleOrder', e)
          store.dispatch('snackbar/mostrar', 'Error al procesar la orden')
        }
      },
    async descargarExcel () {
      const workbook = new excel.Workbook()
      const sheet = workbook.addWorksheet('Orden')
      sheet.columns = [
        { header: 'Producto', key: 'producto', width: 30 },
        { header: 'Barcode', key: 'barcode', width: 20 },
        { header: 'Posicion', key: 'posicion', width: 15 },
        { header: 'Unidades', key: 'unidades', width: 10 },
        { header: 'Cant. Salida', key: 'salida', width: 12 }
      ]
      this.detalle.forEach(d => {
        sheet.addRow({
          producto: d.NombreProducto,
          barcode: d.Barcode,
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
      console.log('Barcode ingresado:', codigo)
      const item = this.detalle.find(d => d.Barcode === codigo || d.CodeEmpresa === codigo)
      if (item) {
        console.log('Item encontrado', item)
        this.selectedItem = item
        this.showCantidad = true
        this.cantidadArticulo = 1
        this.barcodeArticulo = ''
        this.$nextTick(() => this.$refs.cantidadArticulo && this.$refs.cantidadArticulo.focus())
      } else {
        console.log('Barcode inexistente', codigo)
        store.dispatch('snackbar/mostrar', codigo + ': Barcode inexistente')
        this.cancelarIngreso()
      }
    },

    cantidadEnter () {
      if (!this.selectedItem) return
      let cantidad = Number(this.cantidadArticulo)
      if (!cantidad || cantidad < 0) cantidad = 1
      if (this.selectedItem.CantidadSalida + cantidad <= this.selectedItem.Unidades) {
        this.selectedItem.CantidadSalida += cantidad
        this.actualizarValidacion(this.selectedItem)
      } else {
        store.dispatch('snackbar/mostrar', 'Cantidad excedida')
      }
      this.cancelarIngreso()
    },

    cancelarIngreso () {
      this.showCantidad = false
      this.selectedItem = null
      this.cantidadArticulo = 1
      this.barcodeArticulo = ''
      this.$nextTick(() => this.$refs.barcodeArticulo && this.$refs.barcodeArticulo.focus())
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
.icono-atras-negro {
  color: #191919 !important;
}

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
