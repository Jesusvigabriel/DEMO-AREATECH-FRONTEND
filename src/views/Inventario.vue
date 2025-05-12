<template>
  <v-container>
    <v-row>
      <v-col>
        <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
      </v-col>
    </v-row>
    <v-row v-if="idEmpresa != null">
      <v-col>
        <v-file-input 
          label="Planilla a procesar" 
          @change="fileOnChange" 
          accept=".xlsx"
          filled
          prepend-icon="mdi-microsoft-excel"
        >Importar planilla excel</v-file-input>
      </v-col>
    </v-row>
    <v-row v-for="(item, index) in mensajes" :key="index" class="py-0">
      <v-col class="py-0">
        <v-alert :color="item.color ?  item.color : 'success'" class="py-0 my-1">{{item.texto}}</v-alert>
      </v-col>
    </v-row>

    <v-row v-show="posicionesRevisadas.length>0" class="pb-0 mb-0">
        <v-col cols="6" class="py-0 my-0"  >
          <v-card-title class="py-1 my-0">
              <v-text-field
                  v-model="textoBusqueda"
                  append-icon="mdi-magnify"
                  label="Búsqueda"
                  single-line
                  dense
                  hide-details
              ></v-text-field>
            </v-card-title>
        </v-col>
        <v-col v-if="posicionDetallada.length>0">
          <h3>Detalle de la posición {{posicionSeleccionada}}</h3>
        </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" v-if="posicionesRevisadas.length>0">
        <v-data-table 
            :headers="cabecerasPosiciones" 
            :items="posicionesRevisadas"  
            :footer-props="{itemsPerPageOptions:[5,15,-1]}"   
            :items-per-page="15" 
            :search="textoBusqueda"
            class="elevation-3" 
        >
          <template v-slot:item.Estado="{item}">
            <v-chip :color="getColorEstado(item.Estado)" dark><v-icon @click="verEstado(item)">{{getIconoEstado(item.Estado)}}</v-icon></v-chip>
          </template>
          <template v-slot:item.Acciones="{item}">
            <v-row class="my-0">
                <v-col align="end" >
                    <v-btn class="mx-1 " :color="getColorEstado(item.Estado)" @click="verEstado(item)"  ><v-icon class="mx-3" color="white">{{getIconoAccion(item.Estado)}}</v-icon></v-btn>
                </v-col>
            </v-row>
          </template>

        </v-data-table>
      </v-col>
      <v-col v-if="posicionDetallada.length>0">
        <v-data-table 
            :headers="cabecerasDetalle" 
            :items="posicionDetallada"  
            :footer-props="{itemsPerPageOptions:[5,30,-1]}"   
            :items-per-page="30" 
            :search="textoBusquedaDetalle"
            class="elevation-3" 
        >
          <template v-slot:item.Estado="{item}">
            <v-chip :color="getColorEstadoDetalle(item)" dark @click="clickEnReparacion(item)"><v-icon>{{getIconoEstadoDetalle(item)}}</v-icon></v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import {xlsx, read, utils} from 'xlsx'
import SelectorEmpresa from '../components/SelectorEmpresa.vue'
import store from '../store'
import posiciones from "../store/posiciones"
import fechas from 'vue-lsi-util/fechas'
import productos from '../store/productosV3'

export default {
  name: "Inventario",

  data() {
    return {
      idEmpresa: null,
      mensajes: [],
      posicionesARevisar: [],
      posicionesRevisadas: [],
      posicionDetallada: [],
      cabecerasPosiciones: [
          {text: 'Posición', align: 'start', value: 'Nombre', sortable: true},
          {text: 'Fec.Inv.', align: 'start', value: 'FechaInventario', sortable: true},
          {text: '', align: 'start', value: 'Estado', sortable: true},
          {text: '', value: 'Acciones', sortable: false},
      ],
      cabecerasDetalle: [
          {text: 'Id', align: 'start', value: 'IdProducto', sortable: true},
          {text: 'Barcode', align: 'start', value: 'BarcodeProducto', sortable: true},
          {text: 'Sistema', align: 'start', value: 'Unidades', sortable: true},
          {text: 'Inventario', align: 'start', value: 'Inventariado', sortable: true},
          {text: '', align: 'start', value: 'Estado', sortable: true},
      ],
      textoBusqueda: '',
      textoBusquedaDetalle: '',
      posicionSeleccionada: '',
      idPosicionSeleccionada: -1,
    }
  },

  methods: {
    async clickEnReparacion(item) {
      if (item.Unidades==item.Inventariado) {
        this.mostrarError("El elemento seleccionado no tiene errores para corregir")
      } else {
        if (item.Unidades>item.Inventariado) {
          //Hay más por sistema que en el inventario, las saco y desposicion
          const botonPrimario="Confirmar el desposicionamiento"
          const confirmacion={
            titulo: "Confirma el desposicionamiento?", 
            mensaje: "Confirma el desposicionamiento de "+parseInt(item.Unidades-item.Inventariado)+" unidades?",
            botonPrimario,
            botonSecundario: 'Cancelar',
            callback: respuesta => {
              if (respuesta==botonPrimario) {
                this.registrarDesposicionamiento(item)
              }
            }
          }
          store.dispatch("alertDialog/mostrar", confirmacion)
        } else {
          //Hay más en el inventario que en el sistema, si hay sin posicionar las posiciono acá
          try {
            const productoAPosicionar=await productos.getByBarcodeAndEmpresa(item.BarcodeProducto, this.idEmpresa)
            const cantidadAPosicionar=item.Inventariado-item.Unidades
            if (productoAPosicionar.StockSinPosicionar >= cantidadAPosicionar) {
              const botonPrimario="Confirmar el posicionamiento"
              const confirmacion={
                titulo: "Confirma el posicionamiento?", 
                mensaje: `Confirma el posicionamiento de ${cantidadAPosicionar} unidades?`,
                botonPrimario,
                botonSecundario: 'Cancelar',
                callback: respuesta => {
                  if (respuesta==botonPrimario) {
                    this.registrarPosicionamiento(productoAPosicionar.Id, this.idPosicionSeleccionada, cantidadAPosicionar, item)
                  }
                }
              }
              store.dispatch("alertDialog/mostrar", confirmacion)
            } else {
              let posiciones=""
              productoAPosicionar.Posiciones.forEach(element => {
                posiciones="Posición: "+element.Nombre+" - Unidades: "+element.Unidades+";"
              })
              const aviso={
                titulo: "No se puede posicionar!", 
                mensaje: `Atención!;No se puede posicionar porque no hay suficiente stock sin posicionar: ${productoAPosicionar.StockSinPosicionar} - Cantidad a posicionar: ${cantidadAPosicionar};;Posicionado actual del artículo: ${posiciones}`
              }
              store.dispatch("alertDialog/mostrar", aviso)
            }
          } catch (error) {
            this.mostrarError(error)
          }
        }
      }
    },
    registrarDesposicionamiento(item) {
      productos.registrarDesposicionamiento(item.IdProducto, this.idPosicionSeleccionada, item.Unidades-item.Inventariado)
        .then(response => {
          item.Unidades=item.Inventariado
          this.sonidoExito()
          this.actualizarEstadoPosicionRevisada()
          // store.dispatch("alertDialog/mostrar", {titulo: 'Desposicionamiento exitoso!', mensaje: "El producto fue correctamente desposicionado"})
        })
        .catch(error => {
          this.mostrarError(error)
        })
    },
    registrarPosicionamiento(idProducto, idPosicion, cantidadAPosicionar, item) {
      productos.registrarPosicionamiento(idProducto, idPosicion, cantidadAPosicionar)
        .then(response => {
          item.Unidades=item.Inventariado
          this.sonidoExito()
          this.actualizarEstadoPosicionRevisada()
          // store.dispatch("alertDialog/mostrar", {titulo: 'Posicionamiento exitoso!', mensaje: "El producto fue correctamente posicionado"})
        })
        .catch(error => {
          this.mostrarError(error)
        })
    },
    actualizarEstadoPosicionRevisada() {
      const registrosConError=this.posicionDetallada.filter(e => e.Inventariado != e.Unidades)
      if (registrosConError.length==0) {
        const index=this.posicionesARevisar.findIndex(e => e.Id===this.idPosicionSeleccionada)
        this.posicionesRevisadas[index].Estado="OK"
        this.sonidoExito()
      } 
    },
    getIconoEstadoDetalle(item) {
      if (item.Unidades==item.Inventariado) {
        return "mdi-check-circle-outline"
      } else {
        return 'mdi-tools'
      }
    },
    getColorEstadoDetalle(item) {
      if (item.Unidades==item.Inventariado) {
        return "green"
      } else {
        return "red"
      }
    },
    getIconoAccion(estado) {
      return estado=="OK" ? "mdi-calendar-lock-outline" : "mdi-magnify"
    },
    getIconoVer(estado) {
      return estado!="OK" 
    },
    getIconoEstado(estado) {
      return estado=="OK" ? "mdi-check-circle-outline" : 'mdi-alert-circle-outline'
    },
    getColorEstado(estado) {
      return estado=="OK" ? "green" : 'red'
    },
    async verEstado(item) {
      if (item.Estado=="OK") {
        this.posicionDetallada=[]
        this.posicionSeleccionada=''
        this.idPosicionSeleccionada=-1
        const textoPrimario="Si, confirmar"
        const textoSecundario="Cancelar"
        const ad={
          titulo: 'Confirma la registración?',
          mensaje: `Confirma la registración de la fecha de inventario para la posición <b>${item.Nombre}</b>?`,
          botonPrimario: textoPrimario,
          botonSecundario: textoSecundario,
          callback: ((respuesta) => {
            if (respuesta==textoPrimario) {
              this.registrarFechaInventarioEnPosicion(item)
            }
          })
        }
        store.dispatch("alertDialog/mostrar", ad)        
      } else {
        const posicionADetallar=this.posicionesARevisar.find(e => e.Id==item.Id)
        this.posicionDetallada=posicionADetallar.Contenido
        this.posicionSeleccionada=posicionADetallar.Nombre
        this.idPosicionSeleccionada=posicionADetallar.Id
      }
    },
    async registrarFechaInventarioEnPosicion(item) {
      try {
        const response=await posiciones.modificar(item.Id, {UsuarioInventario: store.state.usuarios.usuarioActual.Nombre, FechaInventario: fechas.getHoy()})
        item.FechaInventario=fechas.getHoy()
        store.dispatch("alertDialog/mostrar", { titulo: 'Proceso exitoso 👍', mensaje: 'El proceso finalizó <b>exitosamente</b>'})
      } catch (error) {
        this.mostrarError(error)
      }
    },
    procesarPlanilla(planilla) {
      this.mensajes.push({texto: "Procesando planilla ..."})

      //Obtengo los comprobantes distintos
      this.posicionesARevisar=[]
      planilla.forEach(element => {
          const existente=this.posicionesARevisar.find(e => e.Nombre.trim()==element.Posicion.trim())
          if (existente==null) {
            this.posicionesARevisar.push({Nombre: element.Posicion.trim()})
          }
      })
      this.procesarTodasLasPosiciones(planilla)
    },
    async procesarTodasLasPosiciones(planilla) {
      let nombresPosiciones=''
      this.posicionesARevisar.forEach(element => {
        nombresPosiciones += element.Nombre + ","
      })
      nombresPosiciones=nombresPosiciones.slice(0, -1)

      const contenidoDeLasPosiciones=await posiciones.getContenidoVariasPosiciones(nombresPosiciones)

      let nombresPosicionesInexistentes=""
      this.posicionesARevisar.forEach(element => {
        const indice=contenidoDeLasPosiciones.findIndex(e => element.Nombre == e.Posicion.Nombre)
        if (indice>=0) {
          element.Id=contenidoDeLasPosiciones[indice].Posicion.Id
          element.FechaInventario=contenidoDeLasPosiciones[indice].Posicion.FechaInventario
          if (element.Id<0) {
            nombresPosicionesInexistentes += element.Nombre+";";
          }
        }
      })

      for (const unaPosicionARevisar of this.posicionesARevisar) {
        const contenidoDeLaPosicion=contenidoDeLasPosiciones.filter(e => e.Posicion.Id==unaPosicionARevisar.Id)

        if (typeof contenidoDeLaPosicion[0].Contenido != "undefined") {
          unaPosicionARevisar.Contenido=contenidoDeLaPosicion[0].Contenido
          unaPosicionARevisar.Contenido.forEach(element => {
            element.Inventariado=0
          })

          const inventarioDeLaPosicion=planilla.filter(e => e.Posicion==unaPosicionARevisar.Nombre)
          for (const unArticuloInventariado of inventarioDeLaPosicion) {
            const posicion=unaPosicionARevisar.Contenido.findIndex(e => e.BarcodeProducto==unArticuloInventariado["Barcode Producto"] && e.IdEmpresa==this.idEmpresa)
            if (posicion>=0) {
              unaPosicionARevisar.Contenido[posicion].Inventariado++
            } else {
              unaPosicionARevisar.Contenido.push({IdProducto: -1, Inventariado: 1, Unidades: 0, BarcodeProducto: unArticuloInventariado["Barcode Producto"] })
            }
          }

        }
      }

      this.posicionesRevisadas=[]
      this.posicionesARevisar.forEach(element => {
        let todoOK=true

        if (element.Id>0) {
          element.Contenido.forEach(element => {
            if (element.Inventariado!=element.Unidades) {
              todoOK=false
            }
          });
          this.posicionesRevisadas.push({Id: element.Id, Nombre: element.Nombre, Estado: todoOK ? 'OK' : 'Errores', FechaInventario: element.FechaInventario, UsuarioInventario: element.UsuarioInventario})
        }
      })
      this.mensajes=[]

      if (nombresPosicionesInexistentes.length>0) {
        store.dispatch("alertDialog/mostrar", {titulo: 'Posiciones inexistentes', mensaje: "<b>Atención!!!⚠️</b>;;Se han leido las siguientes posiciones inexistentes:;;"+nombresPosicionesInexistentes+";Estas posiciones no serán procesadas."})
      }

    },
    verificarColumnasExcel(planilla) {

      let columnasObligatorias=['Posicion', 'Barcode Producto']
      this.mensajes.push({texto: "Verificando columnas ..."})
      let columnasFaltantes=[]
      let filaActual=1
      let tituloMostrado=false
      planilla.forEach(unaFila => {
        filaActual++
        columnasObligatorias.forEach(unaColumnaObligatoria => {
          if (!Object.keys(unaFila).includes(unaColumnaObligatoria)) {
            if (!columnasFaltantes.includes(unaColumnaObligatoria)) {
              if (!tituloMostrado) {
                this.mensajes.push({texto: "Faltan las siguientes columnas:", color:"red"})
                tituloMostrado=true
              }
              this.mensajes.push({texto: "Fila: "+filaActual+" - Columna: "+unaColumnaObligatoria, color:"yellow"})
            }
          }
        })
      })
      if (tituloMostrado) {
        this.mensajes.push({texto: "La planilla no puede ser procesada", color: "red"})
      } else {
        this.mensajes.push({texto: "La planilla tiene las columnas correctas"})
        planilla.forEach(element => {
          element["Barcode Producto"]=element["Barcode Producto"].toUpperCase()
        });
        this.procesarPlanilla(planilla)
      }
    },
    fileOnChange(archivoLeido) {
      if (archivoLeido!=null) {
        this.mensajes.push({texto: "Leyendo archivo ..."})
        const lector=new FileReader()
        lector.onload = ev => {
          const datosCrudos = ev.target.result;
          const planillaCruda = read(datosCrudos, {type: "binary", cellDates: true, cellNF: true, cellText:true})
          const nombreHoja1=planillaCruda.SheetNames[0]
          const datosPlanilla=utils.sheet_to_json(planillaCruda.Sheets[nombreHoja1])
          this.verificarColumnasExcel(datosPlanilla)
        }

        lector.readAsBinaryString(archivoLeido)            
      } else {
        this.mensajes=[]
        this.posicionesARevisar= []
        this.posicionesRevisadas= []
        this.posicionDetallada= []
      }
    },
    eligioEmpresa(idEmpresaElegida) {
      this.idEmpresa=idEmpresaElegida;
    },
    mostrarError(mensaje) {
      store.dispatch("snackbar/mostrar", mensaje)
    },
    sonidoExito() {
      store.dispatch('sonidos/exito')
    }
  },

  components: {
    SelectorEmpresa
  },

  created() {
    store.dispatch('actualizarTituloPrincipal', 'Inventario')
    store.dispatch('empresas/cargarListaEmpresas', "SoloStockPosicionado")
  }

}
</script>