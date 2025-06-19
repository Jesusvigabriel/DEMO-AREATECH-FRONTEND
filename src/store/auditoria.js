import API from 'vue-lsi-util/APIAccesoV2'

const auditoria = {
  async getAuditoriaByEntidad(entidad) {
    return new Promise((resolve, reject) => {
      API.acceder({ Ruta: `/auditoria/getAuditoriaByEntidad/${entidad}` })
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  },

  async getAuditoriaByEntidadId(entidad, id) {
    return new Promise((resolve, reject) => {
      API.acceder({ Ruta: `/auditoria/getAuditoriaByEntidadId/${entidad}/${id}` })
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  },

  async getHistoricoOrden(idOrden) {
    return new Promise((resolve, reject) => {
      API.acceder({ Ruta: `/auditoria/getHistoricoOrden/${idOrden}` })
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  },

  async getOrdenesEliminadas() {
    return new Promise((resolve, reject) => {
      API.acceder({ Ruta: '/auditoria/getOrdenesEliminadas' })
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  },

  async getHistoricoGuia(idGuia) {
    return new Promise((resolve, reject) => {
      API.acceder({ Ruta: `/auditoria/getHistoricoGuia/${idGuia}` })
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  },

  async getHistoricoPosiciones(idProducto, idEmpresa) {
    return new Promise((resolve, reject) => {
      API.acceder({ Ruta: `/auditoria/getHistoricoPosiciones/${idProducto}/${idEmpresa}` })
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  },

  async getConfiguracionesByEmpresa(idEmpresa, fechaDesde, fechaHasta) {
    return new Promise((resolve, reject) => {
      API.acceder({ Ruta: `/auditoria/getConfiguracionesByEmpresa/${idEmpresa}/${fechaDesde}/${fechaHasta}` })
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  }
}

export default auditoria
