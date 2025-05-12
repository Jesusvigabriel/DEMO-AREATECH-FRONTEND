import axios from 'axios'
import store from '../store'

const AccesosAAPI = {
    namespaced: true,
    actions: {
        async acceder (payload) {
                return new Promise( 
                function (resolve, reject) {
                    if (typeof(payload.Cartel)!=='undefined') {
                        store.dispatch('loading/mostrar', payload.Cartel)
                    }
                    if (typeof(payload.Metodo)=="undefined") {
                        payload.Metodo="GET"
                    }

                    axios({method: payload.Metodo, url: payload.Ruta, headers: payload.Cabeceras})
                        .then(datos => {
                            if (datos.data.Estado=="OK") {
                                resolve(datos.data)
                            } else {
                                reject(datos.data)
                            }
                        })
                        .catch(error => {
                            reject(error)
                        })
                        .finally( () => {
                            if (typeof(payload.Cartel)!=='undefined') {
                                store.dispatch('loading/ocultar')
                            }        
                        })
                }
            )
        }
    }
}

export default AccesosAAPI