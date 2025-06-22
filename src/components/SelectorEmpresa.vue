<template>
    <v-autocomplete
        v-model="IdEmpresaSeleccionada"
        dense
        prepend-inner-icon="mdi-factory"
        @keypress.enter="eligioEmpresa"
        @blur="touched = true"
        :rules="empresaRules"
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
            searchTerm: '',
            touched: false,
            empresaRules: [v => !!v || 'Seleccione una empresa']
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
            if (this.IdEmpresaSeleccionada) {
                this.$emit('eligioEmpresa', this.IdEmpresaSeleccionada)
            }
        }
    },
    created() {
        this.IdEmpresaSeleccionada=this.idEmpresaInicialmenteSeleccionada
    }
}
</script>