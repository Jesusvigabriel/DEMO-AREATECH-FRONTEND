import API from 'vue-lsi-util/APIAccesoV2'

const emailTemplates = {
    async getByCode(codigo) {
        return new Promise((resolve, reject) => {
            API.acceder({ Ruta: `/emailTemplate/byCode/${codigo}` })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    async create(payload) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/emailTemplate`,
                Metodo: 'PUT',
                Body: payload,
            })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    async update(id, payload) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/emailTemplate/${id}`,
                Metodo: 'PATCH',
                Body: payload,
            })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },

    async activate(id, activo) {
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: `/emailTemplate/activate/${id}/${activo}`,
                Metodo: 'PUT',
            })
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    },
}

export default emailTemplates

