<template>
  <v-container class="pt-0">
    <v-row>
        <v-col>
            <SelectorEmpresa @eligioEmpresa="selectorEmpresaChange($event)" ></SelectorEmpresa>
        </v-col>
    </v-row>
    <v-row v-show="selectorOrden.mostrar">
        <v-col cols="6">
            <v-select 
                v-model="selectorOrden.dato" 
                dense 
                prepend-inner-icon="mdi-clipboard-list-outline"
                @change="selectorOrdenChange" 
                :items="listaOrdenes" 
                item-value="Id" 
                item-text="Numero" 
                label="Seleccione orden"
                class="my-0 py-0"
                id="selectorOrden"
            >
            </v-select>
        </v-col>
        <v-col cols="1" class="my-0 py-0">
            <v-btn @click="botonPrevisualizarOrdenClick" v-show="botonPrevisualizarOrden.mostrar"><v-icon>mdi-magnify</v-icon></v-btn>
        </v-col>
        <v-col cols="1" class="my-0 py-0">
            <v-btn @click="botonImprimirStickersClick" v-show="botonImprimirStickers.mostrar"><v-icon>mdi-label</v-icon></v-btn>
        </v-col>
        <v-col cols="4" v-if="listaOrdenes!=null && ordenEnCurso==null">
            {{listaOrdenes.length==0 ?  'No hay órdenes pendientes' : 'Hay '+listaOrdenes.length+' órdenes pendientes'}}
        </v-col>
    </v-row>
    <v-row v-show="barcodeArticulo.mostrar">
        <v-col cols="6"><v-text-field ref="barcodeArticulo" inputmode="none" prepend-inner-icon="mdi-barcode-scan"  @keypress.enter="BarcodeArticuloEnter" label="Barcode artículo" v-model="barcodeArticulo.dato" v-show="barcodeArticulo.mostrar" dense id="barcodeArticulo" ></v-text-field></v-col>
        <v-col cols="4" v-show="!tieneLOTE">
            <v-text-field type="number" :rules="[reglasCantidad.required, reglasCantidad.min]" ref="cantidadAIngresar" prepend-inner-icon="mdi-calculator" @keypress.enter="cantidadAIngresarEnter" label="Cantidad" v-model="cantidadAIngresar.dato" v-show="cantidadAIngresar.mostrar" dense id="cantidadAIngresar" ></v-text-field>
        </v-col>
        <v-col cols="4" v-show="tieneLOTE">
            <v-text-field type="number" :rules="[reglasCantidad.required, reglasCantidad.min]" ref="cantidadAIngresar" prepend-inner-icon="mdi-calculator" @keypress.enter="cantidadAIngresarEnterLote" label="Cantidad" v-model="cantidadAIngresar.dato" v-show="cantidadAIngresar.mostrar" dense id="cantidadAIngresar" ></v-text-field>
        </v-col>
        <v-col cols="1" class="mx-1 my-0 py-0">
            <v-btn v-if="!tieneLOTE" @click="cantidadAIngresarEnter" id="procesarCantidadAIngresar" v-show="cantidadAIngresar.mostrar"><v-icon color="blue">mdi-content-save</v-icon></v-btn>
            <v-btn v-if="tieneLOTE" @click="cantidadAIngresarEnterLote" id="procesarCantidadAIngresar" v-show="cantidadAIngresar.mostrar"><v-icon color="blue">mdi-content-save</v-icon></v-btn>
        </v-col>
    </v-row>
    <v-row v-show="botonSalidaExpress">
        <v-col cols="1" class="my-0 py-0">
            <v-btn block color="primary" @click="salidaExpress">Salida Express</v-btn>
        </v-col>
    </v-row>
    <v-row v-show="productoEnCurso.mostrar">
        <v-col>
            <v-alert class="my-1 mx-0" color="info" >{{productoEnCurso.descripcion}}</v-alert>
        </v-col>
    </v-row>
    <v-row v-show="listaProductosLeidos.length>0">
        <v-col>
            <v-btn block color="primary" @click="clickFinalizarIngresarBultos()" >Finalizar e ingresar cantidad de bultos</v-btn>
        </v-col>
    </v-row>
    <v-row v-show="pedirCantidadBultos">
        <v-col>
            <v-text-field type="number" prepend-inner-icon="mdi-calculator" label="Cantidad de bultos" v-model="cantidadBultos" dense ></v-text-field>
            <v-btn block color="primary" :disabled="botonDesactivado"  @click="clickProcesarIngreso()" >Finalizar y registrar</v-btn>
        </v-col>
    </v-row>
    <v-card v-show="tieneLOTE" v-if="elegirLote">
        <v-card-title>
            <span class="text-h5">{{"Elegir Lote"}}</span>
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-row v-if="listaLotes.length>0">
                    <v-col class="py-0" >
                        <v-data-table
                            :headers="cabecerasListadoLote" 
                            :items="listaLotes"  
                            :footer-props="{itemsPerPageOptions:[10,30,100,-1]}"   
                            :items-per-page="30" 
                            :search="textoBusqueda"
                            class="elevation-3" >
                            <template v-slot:item.Acciones="{ item, index }">
                                <v-icon color="green" @click="seleccionarLote(item); textoBusqueda=''">mdi-plus</v-icon>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="mostrarListaArticulos=false; textoBusqueda=''">Cerrar</v-btn>
        </v-card-actions>
    </v-card>
    <v-row >
        <v-col>
            <v-alert v-if="!tieneLOTE" dark class="my-1 mx-0" v-for="(item, index) in listaProductosLeidos" :key="index" dense :color="colorLectura(item)" >
                {{item.barcode}} - {{item.descripcion}} x {{item.cantidad}}
                <v-icon color="red" @click="eliminarLectura(item, index)" >mdi-delete-outline</v-icon>
            </v-alert>
            <v-alert v-if="tieneLOTE" dark class="my-1 mx-0" v-for="(item, index) in listaProductosLeidos" :key="index" dense :color="colorLectura(item)" >
                {{"BoxNumber: " + item.lote}} - {{"SerialNumber: " + item.barcode}} - {{"PartNumber: " + item.partNumber}} - {{item.descripcion}} x {{item.cantidad}}
                <v-icon color="red" @click="eliminarLectura(item, index)" >mdi-delete-outline</v-icon>
            </v-alert>
            
        </v-col>
    </v-row>
    <v-divider v-if="listaProductosLeidos.length>=1" />
    <div v-if="listaProductosLeidos.length>=1">Total artículos leídos: {{listaProductosLeidos.length}}</div>
    <v-row> <v-col> <div> </div> </v-col> </v-row>
    <v-row> <v-col> <div> </div> </v-col> </v-row>
    <v-row> <v-col> <div> </div> </v-col> </v-row>
    <v-footer absolute><v-btn block @click="resetearPantalla">Limpiar pantalla</v-btn></v-footer>
  </v-container>
</template>

<script>


import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import store from '@/store'
import router from '@/router'
import API from '@/API/Acceso'
import ordenes from "@/store/ordenes"
import ordenesV3 from "@/store/ordenesV3"
import movimientosStockV3 from '@/store/movimientosStockV3'
import empresasV3 from '@/store/empresasV3'
import posiciones from '@/store/posiciones'
import productosV3 from '@/store/productosV3'
import fechas from 'vue-lsi-util/fechas'

export default {
    name: 'OrdenesSalida',
    components: {
        SelectorEmpresa
    },
    data() {
        return {
            botonSalidaExpress: false,
            idEmpresa: null,
            selectorEmpresa: {mostrar: true, dato: null},
            selectorOrden: {mostrar: false, dato: null},
            botonPrevisualizarOrden: {mostrar: false},
            botonImprimirStickers: {mostrar: false},
            botonConfirmarIngreso: {mostrar: false},
            listaOrdenes: [],
            listaProductosLeidos: [],
            ordenEnCurso: null,
            listaBarcode: [],
            detalleOrdenEnCurso: [],
			detalleOrden: [],
            detallePosiciones: [],
            productoEnCurso: {mostrar: false},
            pedirCantidadBultos: false,
            cantidadBultos: 0,
            empresa: {},
            userName: null,
            botonDesactivado: false,
            tieneLOTE: false,
            tienePART: false,
            elegirLote: false,
            listaLotes: [],
            textoBusqueda: "",
            indiceItemDetalleEnCurso: null,
            barcodeArticulo: {mostrar: false, dato: null},
            cantidadAIngresar: {mostrar: false, dato: null},
            reglasCantidad: { required: value =>  !!value || 'Obligatorio', min: value => value>0 || 'Debe ser mayor que cero' },
            cabecerasListadoLote: [
                    {text: 'Box Number', value: 'lote'},
                    {text: '', value: 'Acciones'},
            ]
        }
    },
    methods: {
        botonImprimirStickersClick() {

        },
        eliminarLectura(item, index) {
            if(this.tieneLOTE){
                if(item.loteCompleto == 1){

                    this.ordenEnCurso.forEach(producto => {
                        if (producto.lote === item.lote) {     
                            producto.CantidadSalida -= producto.CantidadSalida   
                            producto.loteYaIngresado = false                      
                        }
                    })

                    this.listaProductosLeidos = this.listaProductosLeidos.filter(producto => {
                        return producto.lote !== item.lote
                    })
                } else {
                    this.ordenEnCurso.forEach(producto => {
                        if(producto.Barcode == item.barcode && producto.lote == item.lote){
                            producto.CantidadSalida -= item.cantidad
                        }
                    })

                    this.listaProductosLeidos = this.listaProductosLeidos.filter(producto => {
                        return producto.lote !== item.lote && producto.Barcode !== item.barcode
                    })
                }
            } else {
                this.listaProductosLeidos.splice(index, 1)
                // const indiceItemDetalle=this.ordenEnCurso.findIndex(element => element.Barcode == item.barcode.trim())
                this.ordenEnCurso[this.indiceItemDetalleEnCurso].CantidadSalida -= item.cantidad

            }
        },
        async selectorEmpresaChange(IdEmpresaElegida) {
            this.listaOrdenes = []
            this.idEmpresa = IdEmpresaElegida
            this.botonPrevisualizarOrden.mostrar=false
            this.botonImprimirStickers.mostrar=false
            this.selectorEmpresa.dato=IdEmpresaElegida;
            this.ordenEnCurso=null
            this.barcodeArticulo.mostrar=false

            empresasV3.getOne(this.selectorEmpresa.dato)
                .then( async response => {   
                    if(response.LOTE == true){
                        this.tieneLOTE = true  
                        this.tienePART =false
                    } else if(response.PART){
                        this.tienePART =true
                        this.tieneLOTE = false
                    }else{
                        this.tieneLOTE = false  
                        this.tienePART =false
                    }                       
                    this.empresa = response
                    this.botonSalidaExpress = false
                })
                .catch( error => {
                    this.mostrarMensaje({titulo: "Error", mensaje: error})
                })

            try{
                const results=await ordenesV3.getByPeriodoEmpresaSoloPreparadasYNoPreorden('2022-10-01', '2030-12-31', IdEmpresaElegida) 
                this.listaOrdenes=results.sort((e1, e2) => {return e1.Numero.localeCompare(e2.Numero)})
                this.listaOrdenes=this.listaOrdenes.filter(e => (!e.PreOrden) && (e.Estado===1))
                this.selectorOrden.mostrar=true
            } catch (error) {
                console.log("Error al leer órdenes", error)
            }

        },
        selectorOrdenChange(idOrdenSeleccionada) {
            this.botonSalidaExpress = false
            this.pedirCantidadBultos = false
            this.cantidadBultos = 0
            const ordenEnCurso=this.listaOrdenes.find(element => element.Id == idOrdenSeleccionada)
            if (typeof(ordenEnCurso)=='undefined') {
                store.dispatch("snackbar/mostrar", "Orden inexistente")
            } else {
                this.detalleOrdenEnCurso = []
                this.botonPrevisualizarOrden.mostrar=true
                this.botonImprimirStickers.mostrar=true

                if(this.tieneLOTE){
                // if(this.idEmpresa == 242){
                // if(this.idEmpresa == 239){
                    //Obtenemos detalle de la Orden
                    ordenesV3.getDetalleOrdenAndProductoById(ordenEnCurso.Id)
                        .then(response => {
                            response.forEach(e => {
                                e.Numero = ordenEnCurso.Numero
                                e.Id = ordenEnCurso.Id
                                e.CantidadSalida = 0
                                e.PartNumber = e.CodeEmpresa
                                // Guardamos el detalle para poder mostrarlo con la lupa
                                this.detalleOrdenEnCurso.push(e)
                            })
                            this.ordenEnCurso = this.detalleOrdenEnCurso
                        })
                        .catch( error => {
                            this.mostrarMensaje({titulo: "Error", mensaje: error})
                        })
                        
                        this.barcodeArticulo.mostrar=false
                        this.botonSalidaExpress = true
                } else if(this.tienePART){
                    ordenesV3.getDetalleOrdenAndProductoPartidaById(ordenEnCurso.Id)
                        .then(response => {
                            response.forEach(e => {
                                e.Numero = ordenEnCurso.Numero
                                e.Id = ordenEnCurso.Id
                                e.CantidadSalida = 0
                                // Guardamos el detalle para poder mostrarlo con la lupa
                                this.detalleOrdenEnCurso.push(e)
                            })
                            this.ordenEnCurso = this.detalleOrdenEnCurso
                        })
                        .catch( error => {
                            this.mostrarMensaje({titulo: "Error", mensaje: error})
                        })

                    if(this.empresa.SalidaExpress){
                        this.barcodeArticulo.mostrar=false
                        this.botonSalidaExpress = true
                    } else {
                        this.barcodeArticulo.mostrar=true
                        this.enfocarBarcodeArticulo()    
                    }
                }else{
                    //Obtenemos detalle de la Orden
                    ordenesV3.getDetalleOrdenAndProductoById(ordenEnCurso.Id)
                        .then(response => {
                            response.forEach(e => {
                                e.Numero = ordenEnCurso.Numero
                                e.Id = ordenEnCurso.Id
                                e.CantidadSalida = 0
                                e.PartNumber = e.CodeEmpresa
                                // Guardamos el detalle para poder mostrarlo con la lupa
                                this.detalleOrdenEnCurso.push(e)
                            })
                            this.ordenEnCurso = this.detalleOrdenEnCurso
                        })
                        .catch( error => {
                            this.mostrarMensaje({titulo: "Error", mensaje: error})
                        })

                    if(this.empresa.SalidaExpress){
                        this.barcodeArticulo.mostrar=false
                        this.botonSalidaExpress = true
                    } else {
                        this.barcodeArticulo.mostrar=true
                        this.enfocarBarcodeArticulo()    
                    }
                }
            }

        },

        salidaExpress(){
            this.ordenEnCurso.forEach(producto => {
                producto.CantidadSalida = producto.Unidades
            })
            this.pedirCantidadBultos=true
        },

        botonPrevisualizarOrdenClick() {
            let detalle=""
            let numeroItem=0
          
            // iteramos el detalle para mostrar unidades, nombre y barcode por cada producto
            if(this.tieneLOTE){
                this.detalleOrdenEnCurso.forEach(element => {
                numeroItem++
                detalle+=numeroItem+") "+element.Unidades+" x "+element.Productos+" - BoxNumber:("+element.lote+ ") SerialNumber:("+element.Barcode+") PartNumber:("+ element.PartNumber +") - Salidos: "+element.CantidadSalida+";"   
                })
            } else {
                this.detalleOrdenEnCurso.forEach(element => {
                numeroItem++
                detalle+=numeroItem+") "+element.Unidades+" x "+element.Productos+" ("+element.Barcode+")"+" - Salidos: "+element.CantidadSalida+";"   
                })
            }
            const mensajeAMostrar = {   titulo: 'Detalle de la orden', 
                                        mensaje: detalle 
                                    }
            this.mostrarMensaje(mensajeAMostrar)
            this.enfocarBarcodeArticulo()         
        },

        async clickFinalizarIngresarBultos() {
            this.pedirCantidadBultos=true
        },//
        async clickProcesarIngreso() {
            this.botonDesactivado = true
            if (this.cantidadBultos<=0) {
                this.mostrarMensaje({titulo: "Error", mensaje: "Debe ingresar cantidad de bultos"})
                this.botonDesactivado = false
                return
            }
            const validacionOrden=this.validarOrdenCompleta()

            if (validacionOrden==="") {
                const mensajeAMostrar=
                    {
                        titulo: "Orden de salida",
                        mensaje: "Confirma la registración?",
                        botonPrimario: "Confirmar", 
                        botonSecundario: "Cancelar",
                        callback: (respuesta => {
                            if (respuesta=="Confirmar") {
                                this.registrarProcesamientoOrden()

                                this.ordenEnCurso.forEach(element => {
                                    this.listaBarcode.push(element.Barcode)
                                })
                                //Chequeo que no se hayan duplicado movimientos en la tabla de movimientos, si es asi, los elimino.
                                //movimientosStockV3.validaMovimientoStock(this.ordenEnCurso.Numero, this.selectorEmpresa.dato,this.listaBarcode)
                            }
                        })
                    }
                this.mostrarMensaje(mensajeAMostrar)
            } else {
                this.mostrarMensaje({titulo: "Error 👎", mensaje: "La orden presenta las siguientes irregularidades:;;"+validacionOrden})
                this.botonDesactivado = false
            }
            this.botonSalidaExpress = false
        },
        validarOrdenCompleta() {
            let ordenCompleta=''
            this.ordenEnCurso.forEach(element => {
                if (element.CantidadSalida<element.Unidades) {
                    ordenCompleta += element.CodeEmpresa + " - " + element.Productos+": cantidad faltante;"
                } else if (element.CantidadSalida>element.Unidades) {
                    ordenCompleta += element.CodeEmpresa + " - " + element.Productos+": cantidad excedente;"
                }
            })
            return ordenCompleta
        },
        registrarProcesamientoOrden() {
            let detalleArray = []
            let detalle="["
            this.ordenEnCurso.forEach(element => {
                detalle += "{"
                detalle += "IdProducto: "+element.IdPartida
                detalle += ", "
                detalle += "Cantidad: "+element.CantidadSalida
                detalle += "}, "
                if(this.tieneLOTE){
                    detalleArray.push({IdProducto: element.IdProducto, Cantidad: element.CantidadSalida, Lote: element.lote, Barcode: element.Barcode, Descripcion: element.Productos})
                } else if(this.tienePART){
                    detalleArray.push({Cantidad: element.CantidadSalida, importe: element.Importe, barcode: element.Barcode, partida: element.Partida, idProducto: element.IdProducto, idPartida: element.IdPartida})
                }else{
                    detalleArray.push({IdProducto: element.IdProducto, Cantidad: element.CantidadSalida})
                }
            })
            detalle= detalle.slice(0, -2)
            detalle += "]"
        
            let Cabeceras={
                IdOrden: this.ordenEnCurso[0].Id,
                IdEmpresa: this.selectorEmpresa.dato,
                Comprobante:this.ordenEnCurso[0].Numero,
                Usuario: this.userName,
                Detalle: detalleArray,
                Textil: this.empresa.ClienteTextil,
                StockPosicionado: this.empresa.StockPosicionado,
                TieneLote: this.tieneLOTE, 
                TienePART:this.tienePART,
                Fecha: fechas.getHoy()
            }
            
            if(this.empresa.StockPosicionado==true && this.empresa.ClienteTextil==false){
                ordenesV3.getDetalleOrdenById(this.ordenEnCurso[0].Id)
                        .then( async response => {
                            this.detalleOrden = response
                            this.detalleOrden.forEach(d=>{

                                ordenesV3.getDetallePosicionesOrdenById(d.Id,this.selectorEmpresa.dato)
                                .then( async response => {
                                    this.detallePosiciones.push({idProducto: response[0].IdProducto, idPosicion: response[0].IdPosicion, cantidad: response[0].Cantidad})
                                })
                                    .catch( error => {
                                        this.mostrarMensaje({titulo: "Error", mensaje: error})
                                }) 
                            }) 
                        })
                            .catch( error => {
                                this.mostrarMensaje({titulo: "Error", mensaje: error})
                        })                   
                }              
                           
             ordenesV3.saleOrder(this.selectorEmpresa.dato,{Cabeceras})
                  .then(respuesta => {  
                        
                        ordenesV3.setCantidadBultos(this.ordenEnCurso[0].Id, this.selectorEmpresa.dato, this.cantidadBultos)
                               .then( async response => {
                                   this.mostrarMensaje({titulo: "Registración correcta! 👍", mensaje: "La salida de la orden ha sido registrada exitosamente"})
                                
                                   const datosOrden =  await ordenesV3.getById(this.ordenEnCurso[0].Id)
                                   const ordenActualizada=await ordenes.actions.getDatosOrden(datosOrden)
                                   const pdfEtiqueta=await ordenes.generarOrdenEtiquetaEnPDFChicaUnaPorHoja(ordenActualizada)
                                   //const pdfSticker=await ordenesV3.imprimirStickersBulto(ordenActualizada,Number(this.cantidadBultos))
                                   pdfEtiqueta.save("etiqueta_"+ordenActualizada[0].Orden.Numero+".pdf")
                               })
                               .catch( error => {
                                   this.mostrarMensaje({titulo: "Error", mensaje: error})
                               })

                           //este es el lugar correcto 
                           this.resetearPantalla()      
                    
                    })
                      .catch(error => {
                          store.dispatch('snackbar/mostrar', error)
                    })
         },


        cantidadAIngresarEnter() {
            this.procesarItemEnCurso()
        },
        BarcodeArticuloEnter() {

            if (process.env.VUE_APP_Quien_Soy=="Bogota" && this.IdEmpresa==6) {
                //Soy Bogotá y eligió Textil Katalina
                //https://logiciel.freshdesk.com/a/tickets/26566
                //Sacarle el último caracter al barcode leido
                this.barcodeArticulo=this.barcodeArticulo.slice(0, -1)
            }

            if(this.tieneLOTE){
               
                const indiceItemDetalle=this.ordenEnCurso.findIndex(element => 
                    element.Barcode == this.barcodeArticulo.dato.trim() || 
                    element.lote == this.barcodeArticulo.dato.trim() ||
                    element.PartNumber == this.barcodeArticulo.dato.trim())
                if(indiceItemDetalle==-1){
                    //El barcode ingresado no pertenece a la orden
                    this.productoEnCurso.mostrar=false
                    this.listaProductosLeidos.unshift({correcto: false, barcode: this.barcodeArticulo.dato, cantidad: 0, descripcion: ''})
                    store.dispatch('snackbar/mostrar', this.barcodeArticulo.dato+': Barcode inexistente')
                    this.barcodeArticulo.dato=null
                    this.enfocarBarcodeArticulo()
                } else {
                    this.listaLotes = []
                    let borrarBarcodeLote = false
                    let lotesUnicos = new Set()

                    this.ordenEnCurso.forEach(producto => {
                        if(this.barcodeArticulo.dato == producto.Barcode || this.barcodeArticulo.dato == producto.CodeEmpresa ){
                            if (!lotesUnicos.has(producto.lote)) {
                                this.listaLotes.push({lote: producto.lote})
                                lotesUnicos.add(producto.lote)
                            }
                        }

                        if(producto.loteCompleto == 1 && producto.lote == this.barcodeArticulo.dato){
                            if(!producto.loteYaIngresado){
                                borrarBarcodeLote = true
                                producto.loteYaIngresado = true
                                producto.CantidadSalida = producto.Unidades
                                this.listaProductosLeidos.unshift({correcto: true, barcode: producto.Barcode, partNumber: producto.CodeEmpresa, cantidad: producto.Unidades, descripcion: producto.Productos, lote: producto.lote, loteCompleto: producto.loteCompleto})

                                this.enfocarBarcodeArticulo()
                            } else {
                                this.mostrarMensaje({titulo: "Error", mensaje: 'El Box Number ya fue ingresado'})
                            }
                        } else {
                            if(producto.Barcode == this.barcodeArticulo.dato || producto.PartNumber == this.barcodeArticulo.dato){
                                this.elegirLote = true
                            }
                        }
                    })
                          
                    if(borrarBarcodeLote){
                        this.resetearBarcodeArticulo()
                    }
                }
            } else {
                const indiceItemDetalle=this.ordenEnCurso.findIndex(element => element.Barcode == this.barcodeArticulo.dato.trim())
                if (indiceItemDetalle==-1) {
                    //El barcode ingresado no pertenece a la orden
                    this.productoEnCurso.mostrar=false
                    this.listaProductosLeidos.unshift({correcto: false, barcode: this.barcodeArticulo.dato, cantidad: 0, descripcion: ''})
                    store.dispatch('snackbar/mostrar', this.barcodeArticulo.dato+': Barcode inexistente')
                    this.barcodeArticulo.dato=null
                    this.enfocarBarcodeArticulo()
                } else {
                    this.indiceItemDetalleEnCurso=indiceItemDetalle
                    //El barcode ingresado pertenece a la orden
                    if (!this.ordenEnCurso[indiceItemDetalle].StockUnitario) {

                        //El articulo NO tiene StockUnitario
                        this.productoEnCurso.descripcion=this.ordenEnCurso[indiceItemDetalle].Productos
                        this.productoEnCurso.mostrar=true

                        //
                        //https://logiciel.freshdesk.com/a/tickets/27499
                        //
                        //No se debe pedir nunca la cantidad, se debe escanear item por item
                        //this.cantidadAIngresar.mostrar=true
                        //this.enfocarCantidadAIngresar()
                        //


                        //
                        //https://logiciel.freshdesk.com/a/tickets/31587
                        //
                        //Ahora otra vez quieren que se pida la cantidad.
                        
                        // this.cantidadAIngresar.dato="1"
                        // this.procesarItemEnCurso()

                        if(!this.empresa.IngesarCantidadUnidadesEnSalidaOrdenes){
                            this.cantidadAIngresar.dato="1"
                            this.procesarItemEnCurso()
                        }else{
                            this.cantidadAIngresar.mostrar=true
                            this.enfocarCantidadAIngresar()
                        }
                    
                    } else {

                        //Como es stock unitario, si ya estaba ingresado una vez, no permito de nuevo
                        if (this.ordenEnCurso[this.indiceItemDetalleEnCurso].CantidadSalida==0) {
                            this.cantidadAIngresar.dato="1"
                            this.procesarItemEnCurso()
                        } else {
                            this.productoEnCurso.mostrar=false
                            this.listaProductosLeidos.unshift({correcto: false, barcode: this.barcodeArticulo.dato, cantidad: 0, descripcion: 'Barcode repetido para stock unitario'})
                            store.dispatch('snackbar/mostrar', this.barcodeArticulo.dato+': Barcode repetido para stock unitario')
                            this.barcodeArticulo.dato=null
                            this.enfocarBarcodeArticulo()
                        }
                    }
                }
            }
        },
        procesarItemEnCurso() {
            const cantidadIngresada=Number.parseInt(this.cantidadAIngresar.dato)
            if(this.tieneLOTE){
                // if (isNaN(cantidadIngresada) || cantidadIngresada < 1) {
                //     this.mostrarMensaje({titulo: "Error", mensaje: 'La cantidad debe ser numérica o mayor a "0"'})
                //     this.enfocarCantidadAIngresar()
                // } else {
                //     this.ordenEnCurso[this.indiceItemDetalleEnCurso].CantidadSalida += cantidadIngresada
                //     this.listaProductosLeidos.unshift({correcto: true, barcode: this.barcodeArticulo.dato, cantidad: cantidadIngresada, descripcion: this.ordenEnCurso[this.indiceItemDetalleEnCurso].Productos, codeempresa: this.ordenEnCurso[this.indiceItemDetalleEnCurso].CodeEmpresa})
                //     this.resetearBarcodeArticulo()
                // }

            } else {
                if (isNaN(cantidadIngresada) || cantidadIngresada < 1) {
                    this.mostrarMensaje({titulo: "Error", mensaje: 'La cantidad debe ser numérica o mayor a "0"'})
                    this.enfocarCantidadAIngresar()
                } else {
                    this.ordenEnCurso[this.indiceItemDetalleEnCurso].CantidadSalida += cantidadIngresada
                    this.listaProductosLeidos.unshift({correcto: true, barcode: this.barcodeArticulo.dato, cantidad: cantidadIngresada, descripcion: this.ordenEnCurso[this.indiceItemDetalleEnCurso].Productos, codeempresa: this.ordenEnCurso[this.indiceItemDetalleEnCurso].CodeEmpresa})
                    this.resetearBarcodeArticulo()
                }
            }
        },
        colorLectura: function(item) {
            return item.correcto ? "success" : "error";
        },
        resetearBarcodeArticulo() {
            this.barcodeArticulo.dato=''
            this.barcodeArticulo.lote=''
            this.productoEnCurso.mostrar=false
            this.cantidadAIngresar={mostrar:false, dato:''}
            this.enfocarBarcodeArticulo()
        },
        resetearPantalla() {
            this.listaOrdenes = this.listaOrdenes.filter(orden => orden.Id !== this.detalleOrdenEnCurso[0].Id)
            store.dispatch("empresas/vaciarLista")
            // comente esta linea porque al usar la lista de ordenes ya filtrada
            // para mostrarlas de nuevo sin tener que volver a cargar las ordenes, perdia el id de la empresa seleccionada
            //this.selectorEmpresa={mostrar: true, dato: null}
            this.selectorOrden={mostrar: true, datos: null}
            if(this.tieneLOTE){
                this.barcodeArticulo={mostrar: false, datos: null, lote: null}
            } else {
                this.barcodeArticulo={mostrar: false, datos: null}
            }

            this.cantidadAIngresar={mostrar: false, datos: null}
            this.listaProductosLeidos=[]
            this.cantidadBultos = 0
            this.pedirCantidadBultos=false
            this.detalleOrdenEnCurso = []
            this.botonDesactivado = false
            store.dispatch('empresas/cargarListaEmpresas','SoloActivas')
        },

        cantidadAIngresarEnterLote(){
            const cantidadIngresada=Number.parseInt(this.cantidadAIngresar.dato)

            if (isNaN(cantidadIngresada) || cantidadIngresada < 1) {
            this.mostrarMensaje({titulo: "Error", mensaje: 'La cantidad debe ser numérica o mayor a "0"'})
            this.enfocarCantidadAIngresar()
            } else {
                this.ordenEnCurso.forEach(producto => {
                    if((producto.Barcode == this.barcodeArticulo.dato || producto.PartNumber == this.barcodeArticulo.dato) && producto.lote == this.barcodeArticulo.lote){
                        let todoCorrecto = true
                        if(cantidadIngresada + producto.CantidadSalida > producto.Unidades){
                        this.mostrarMensaje({titulo: "Error", mensaje: 'La cantidad ingresada es mayor a la que tiene el producto en la orden o ya esta ingresado el producto'})
                            todoCorrecto = false
                        }

                        if(todoCorrecto){
                            producto.CantidadSalida += cantidadIngresada
                            this.listaProductosLeidos.unshift({correcto: true, barcode: producto.Barcode, partNumber: producto.CodeEmpresa, cantidad: cantidadIngresada, descripcion: producto.Productos, codeempresa: producto.CodeEmpresa, lote: producto.lote, loteCompleto: producto.loteCompleto})
                            this.resetearBarcodeArticulo()
                        }
                    } 
                })
            }
        },

        async seleccionarLote(item){
            let productoSeleccionLote = true
            this.ordenEnCurso.forEach(producto => {
                if((producto.Barcode == this.barcodeArticulo.dato || producto.PartNumber == this.barcodeArticulo.dato) && producto.lote == item.lote && producto.loteCompleto == true){
                    this.mostrarMensaje({titulo: "Error", mensaje: 'El producto, se ingresa por LOTE COMPLETO!'})
                    productoSeleccionLote = false
                    this.elegirLote = false
                }  
            })

            if(productoSeleccionLote){
                this.barcodeArticulo.lote = item.lote
                this.cantidadAIngresar.mostrar=true
                this.enfocarCantidadAIngresar()
                this.elegirLote = false
                this.listaLotes = []
            }
        },
        
        enfocarBarcodeArticulo() {
            this.$nextTick(() => { this.$refs.barcodeArticulo.focus()})
        },
        enfocarCantidadAIngresar() {
            this.$nextTick(() => { this.$refs.cantidadAIngresar.focus()})
        },
        mostrarMensaje(payload) {
            store.dispatch("alertDialog/mostrar", payload)  
        },
        async test() {
            try {
                const ordenActualizada=await ordenes.actions.getById(71115)
                const pdfEtiqueta=await ordenes.generarOrdenEtiquetaEnPDFChicaUnaPorHoja(ordenActualizada)
                //const pdfSticker=await ordenesV3.imprimirStickersBulto(ordenActualizada,Number(this.cantidadBultos))
                pdfEtiqueta.save("etiqueta_"+ordenActualizada.Numero+".pdf")
                //pdfSticker.save("etiqueta_"+ordenActualizada.Numero+".pdf")
            } catch (error) {
                console.log("Error", error)
            }

        }
    },
    created() {
        store.dispatch('actualizarTituloPrincipal', 'Salida de órdenes')
        store.dispatch('empresas/cargarListaEmpresas','SoloActivas')
        this.userName =  store.state.usuarios.usuarioActual.Nombre
        // this.test()
    }
}
</script>