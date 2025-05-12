<template>
    <v-select 
        v-model="IdEmpresaSeleccionada" 
        dense 
        prepend-inner-icon="mdi-factory"
        @change="eligioEmpresa" 
        :chips="false" 
        :items="listaEmpresas" 
        item-value="Id" 
        item-text="Nombre" 
        label="Seleccione empresa"
        class="my-0 py-0"
        id="SelectorEmpresa"
    >
    </v-select>
</template>

<script>

import {mapState, mapActions} from 'vuex'

export default {
    name: 'SelectorEmpresa',
    data() {
        return {
            IdEmpresaSeleccionada: null
        }
    },
    props: {
        idEmpresaInicialmenteSeleccionada: Number
    },
    computed: {
        listaEmpresas() {
            return this.$store.state.empresas.listaEmpresas
        }
    },
    methods: {        
        eligioEmpresa() {
            this.$emit('eligioEmpresa', this.IdEmpresaSeleccionada)
        }
    },
    created() {
        this.IdEmpresaSeleccionada=this.idEmpresaInicialmenteSeleccionada
    }
}
</script>