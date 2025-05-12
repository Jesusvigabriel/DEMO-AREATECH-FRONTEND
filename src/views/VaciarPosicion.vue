<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="5" md="2">
                <v-text-field 
                    ref="barcodePosicion"
                    inputmode="none" 
                    prepend-inner-icon="mdi-bookshelf" 
                    @keypress.enter="procesarBarcodePosicion" 
                    label="Barcode posicicion" 
                    v-model="barcodePosicion.dato" 
                    dense>
                </v-text-field>
            </v-col>
            <v-col cols="1" class="mx-0">
                <v-icon color="green" v-show="barcodePosicion.correcto">mdi-checkbox-marked-circle-outline</v-icon>
                <v-icon color="red" v-show="barcodePosicion.incorrecto">mdi-alert-circle-outline</v-icon>
            </v-col>
        </v-row>
        <v-row v-if="listaArticulos.length>0">
            <v-col cols="2">
                <v-alert class="py-0 my-0" color="green" dark><b>Unidades</b></v-alert>
            </v-col>
            <v-col>
                <v-alert class="py-0 my-0" color="green" dark><b>Descripción</b></v-alert>
            </v-col>
            <v-col>
                <v-alert class="py-0 my-0" color="green" dark><b>Barcode</b></v-alert>
            </v-col>
            <v-col>
                <v-alert class="py-0 my-0" color="green" dark><b>Empresa</b></v-alert>
            </v-col>
        </v-row>
        <v-row class="py-0 my-2" v-for="(item, index) in listaArticulos" :key="index">
            <v-col class="py-1 my-0" cols="2" align="end">
                <v-alert class="py-0 my-0" color="info" dark>{{item.Unidades}}</v-alert>
            </v-col>
            <v-col class="py-1 my-0" >
                <v-alert class="py-0 my-0" color="info" dark>{{item.Producto.Nombre}}</v-alert>
            </v-col>
            <v-col class="py-1 my-0" >
                <v-alert class="py-0 my-0" color="info" dark>{{item.Producto.Barcode}}</v-alert>
            </v-col>
            <v-col class="py-1 my-0" >
                <v-alert class="py-0 my-0" color="info" dark>{{item.Empresa.Nombre}}</v-alert>
            </v-col>
        </v-row>
        <v-row v-if="listaArticulos.length>0">
            <v-col>
                <v-btn @click="clickEnVaciar()" xlarge block color="red" dark>Vaciar posición</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import posiciones from "@/store/posiciones"
import store from "@/store"

export default {
    name: "VaciarPosicion",

    data() {
        return  {
            barcodePosicion: {
                dato: process.env.NODE_ENV=='development' ? '001-01-01' : '', 
                correcto: false, 
                incorrecto: false
            },   
            posicionActual: null,
            listaArticulos: []
        }
    },

    methods: {
        clickEnVaciar() {
            const confirmacion={
                titulo: "Confirma?", 
                texto: "Confirma el vaciado de la posición seleccionada?<br><br>Atención! Esta accion no puede deshacerse ⚠️",
                botonPrimario: "Vaciar la posición",
                botonSecundario: "Cancelar",
                callback: respuesta => {
                    if (respuesta=="Vaciar la posición") {
                        this.registrarVaciado()
                    }
                }
            }
            store.dispatch("alertDialog/mostrar", confirmacion)
        },
        registrarVaciado() {
            posiciones.vaciar(this.posicionActual.Id)
                .then(respuesta => {
                    this.mostrarMensaje("Posición vaciada correctamente", "Éxito")
                    this.listaArticulos=[]
                    this.barcodePosicion={
                        dato: process.env.NODE_ENV=='development' ? '001-01-01' : '', 
                        correcto: false, 
                        incorrecto: false
                    }
                    this.enfocarBarcodePosicion()
                })
                .catch(error => {
                    console.log(error)
                    this.mostrarMensaje(error, "Error!")                    
                })
        },  
        procesarBarcodePosicion() {
            posiciones.getByNombre(this.barcodePosicion.dato)
                .then(respuesta => {
                    this.barcodePosicion.correcto=true
                    this.barcodePosicion.incorrecto=false
                    this.posicionActual=respuesta
                    this.obtenerContenidoDeLaPosicion()
                })
                .catch(puteada => {
                    console.log(puteada)
                    this.barcodePosicion.incorrecto=true
                    this.barcodePosicion.correcto=false
                    this.enfocarBarcodePosicion()
                })
        },
        obtenerContenidoDeLaPosicion() {
            posiciones.getContent(this.posicionActual.Id)
                .then(respuesta => {
                    this.listaArticulos=respuesta
                    if (this.listaArticulos.length==0) {
                        store.dispatch("alertDialog/mostrar", {titulo: "Posición vacía", mensaje: "No hay artículos en la posición seleccionada"})
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        enfocarBarcodePosicion() {
            this.$nextTick(() => {
                this.$refs.barcodePosicion.focus()
            })
        },
        mostrarMensaje(mensaje, titulo) {
            store.dispatch("alertDialog/mostrar", {titulo, mensaje})
        }
    },

    mounted() {
        this.enfocarBarcodePosicion()
    }
}
</script>