<template>
  <v-container class="remito-container">

    <!-- TÍTULO -->
    <h2 class="remito-titulo">REMITO DE SALIDA</h2>

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

    <!-- TABLA DE PRODUCTOS -->
    <v-simple-table class="remito-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Posición</th>
          <th>Unidades</th>
          <th>Validado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in detalle" :key="index">
          <td>{{ item.NombreProducto }}</td>
          <td>{{ item.Posicion || '-' }}</td>
          <td>{{ item.Unidades }}</td>
          <td>
            <v-checkbox v-model="item.validado" color="primary" dense hide-details />
          </td>
        </tr>
      </tbody>
    </v-simple-table>

    <!-- FIRMA -->
    <div class="remito-firma mt-6">
      <div>
        <strong>Recibido por:</strong>
        <div class="firma-linea"></div>
      </div>
      <div>
        <strong>Firma:</strong>
        <div class="firma-linea"></div>
      </div>
    </div>

    <!-- BOTONES -->
    <div class="remito-actions no-print">
      <v-btn color="primary" :disabled="!todoValidado" @click="procesarOrden">
        Procesar Orden
      </v-btn>
      <v-btn class="ml-2" outlined @click="window.print()">
        Imprimir
      </v-btn>
    </div>

  </v-container>
</template>

<script>
import ordenesV3 from '@/store/ordenesV3'
import store from '@/store'
import fechas from 'vue-lsi-util/fechas'

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
      detalle: []
    }
  },
  computed: {
    todoValidado () {
      return this.detalle.every(d => d.validado)
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
        NombreProducto: d.Producto?.Nombre || d.NombreProducto || d.Nombre || d.Descripcion || 'Sin nombre',
        Posicion: d.Posicion || d.PosicionNombre || d.Ubicacion || null
      }))

      const orden = await ordenesV3.getById(this.idOrden)
      this.numeroOrden = orden.Numero || orden.numero
      this.empresaId = orden.IdEmpresa || orden.id_empresa
      const emp = orden.Empresa
      this.empresaNombre = emp?.RazonSocial || emp?.Nombre || 'Empresa desconocida'
    },

    async procesarOrden () {
      const detallePayload = this.detalle.map(i => ({
        IdProducto: i.IdProducto,
        Cantidad: i.Unidades
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

.remito-actions {
  margin-top: 28px;
  display: flex;
  gap: 12px;
}

.remito-firma {
  margin-top: 48px;
  font-size: 13px;
  line-height: 2.2;
}

.firma-linea {
  width: 100%;
  border-bottom: 1px dotted #888;
  margin-top: 6px;
  height: 20px;
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

  .firma-linea {
    border-bottom: 1px solid #000;
  }
}
</style>
