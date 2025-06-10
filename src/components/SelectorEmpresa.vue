<template>
    <v-autocomplete
        v-model="IdEmpresaSeleccionada"
        dense
        prepend-inner-icon="mdi-factory"
        @change="eligioEmpresa"
        @keypress.enter="eligioEmpresa"
        :chips="false"
        :items="listaEmpresas"
        item-value="Id"
        item-text="Nombre"
        label="Seleccione empresa"
        class="my-0 py-0"
        id="SelectorEmpresa"
        :search-input.sync="searchTerm"
    >
    </v-autocomplete>
</template>

<script>

import {mapState, mapActions} from 'vuex'

export default {
    name: 'SelectorEmpresa',
    data() {
        return {
            IdEmpresaSeleccionada: null,
            searchTerm: ''
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