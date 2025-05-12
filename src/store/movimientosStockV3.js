import API from 'vue-lsi-util/APIAccesoV2'

const movimientosStockV3 ={


    async conciliarMovimientosStock(id, modalidad) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/movimientos/conciliarStock/${id}/${modalidad}`, Metodo: "Post"})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                console.log(puteada)})
            }
        )            
    },

    async eliminarMovimientoStock(id) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/movimientos/eliminarMovimientoStock/${id}`, Metodo: "Post"})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                })
            }
        )            
    },
    
    async getMovimientoByOrdenBarcodeAndEmpresa(id, orden,barcode) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/movimientos/getMovimientoByOrdenBarcodeAndEmpresa/${id}/${orden}/${barcode}`})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                })
            }
        )            
    },
    async createMovimientoStock(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: '/movimientos/crearMovimiento',
                    Metodo: "PUT",
                    Body: payload,
                    Cartel: "Creando Movimiento de Stock"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                console.log(puteada)})
            }
        )            
    },

    async validaMovimientoStock(idOrden, idEmpresa, barrcodes) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/movimientos/validaMovimiento/${idOrden}/${idEmpresa}/${barrcodes}`,
                    Metodo: "POST",
                    Cartel: "Validando Movimientos de Stock"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                console.log(puteada)})
            }
        )            
    },

    async validarMovimientos(comprobante, idEmpresa, barrcodes) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/movimientos/validarMovimientos/${comprobante}/${idEmpresa}/${barrcodes}`,
                    Metodo: "POST",
                    Cartel: "Validando Movimientos de Stock"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                console.log(puteada)})
            }
        )            
    },

    async informarIngresoStock(payload) {
        return new Promise (
          function (resolve, reject) {
            API.acceder({Ruta: `/movimientos/informarIngresoStock`, Metodo: "Put", Cartel: "Enviando E-Mail al Cliente", Body: payload})
            .then(response => {resolve(response)})
            .catch(puteada => {reject(puteada)})
          }
        )            
      },

}

export default  movimientosStockV3 
