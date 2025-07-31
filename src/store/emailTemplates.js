import API from 'vue-lsi-util/APIAccesoV2'

const emailTemplates = {
    // Obtener todas las plantillas
    async getAll() {
        console.log('[emailTemplates] Obteniendo todas las plantillas')
        try {
            const response = await API.acceder({
                Ruta: '/emailTemplates',
                Metodo: 'GET'
            })
            console.log('[emailTemplates] Plantillas obtenidas:', response)
            if (Array.isArray(response)) {
                return response
            }
            return response.data || []
        } catch (error) {
            console.error('[emailTemplates] Error al obtener plantillas:', error)
            throw error
        }
    },

    // Obtener plantilla por tipo
    async getByType(tipo) {
        console.log(`[emailTemplates] Obteniendo plantilla de tipo: ${tipo}`)
        try {
            const response = await API.acceder({
                Ruta: `/emailTemplate/${tipo}`,
                Metodo: 'GET'
            })
            console.log(`[emailTemplates] Plantilla ${tipo} obtenida:`, response)
            return response.data
        } catch (error) {
            console.error(`[emailTemplates] Error al obtener plantilla ${tipo}:`, error)
            // Si no existe, devolver null en lugar de lanzar error
            if (error.response && error.response.status === 404) {
                return null
            }
            throw error
        }
    },

    // Mantener compatibilidad con componentes existentes
    async getByCode(codigo) {
        return this.getByType(codigo)
    },

    // Obtener plantillas por empresa
    async getByEmpresa(idEmpresa) {
        console.log(`[emailTemplates] Obteniendo plantillas para la empresa: ${idEmpresa}`)
        try {
            const response = await API.acceder({
                Ruta: `/emailTemplates/byEmpresa/${idEmpresa}`,
                Metodo: 'GET'
            })
            console.log(`[emailTemplates] Plantillas de la empresa ${idEmpresa} obtenidas:`, response)
            if (Array.isArray(response)) {
                return response
            }
            return response.data || []
        } catch (error) {
            console.error(`[emailTemplates] Error al obtener plantillas para la empresa ${idEmpresa}:`, error)
            throw error
        }
    },

    // Crear o actualizar plantilla
    async save(template) {
        const isUpdate = !!template.Id
        console.log(`[emailTemplates] ${isUpdate ? 'Actualizando' : 'Creando'} plantilla:`, template)
        
        try {
            const response = await API.acceder({
                Ruta: '/emailTemplates' + (isUpdate ? `/${template.Id}` : ''),
                Metodo: isUpdate ? 'PATCH' : 'POST',
                Body: {
                    Tipo: template.Tipo,
                    Titulo: template.Titulo,
                    Cuerpo: template.Cuerpo,
                    Activo: template.Activo !== false // Por defecto true si no se especifica
                }
            })
            
            console.log(`[emailTemplates] Plantilla ${isUpdate ? 'actualizada' : 'creada'}:`, response)
            return response.data
        } catch (error) {
            console.error(`[emailTemplates] Error al ${isUpdate ? 'actualizar' : 'crear'} plantilla:`, error)
            throw error
        }
    },

    // Activar/desactivar plantilla
    async setActive(id, activo) {
        console.log(`[emailTemplates] ${activo ? 'Activando' : 'Desactivando'} plantilla ${id}`)
        try {
            const response = await API.acceder({
                Ruta: `/emailTemplates/${id}/activate/${activo}`,
                Metodo: 'PATCH'
            })
            console.log(`[emailTemplates] Plantilla ${id} ${activo ? 'activada' : 'desactivada'}`)
            return response.data
        } catch (error) {
            console.error(`[emailTemplates] Error al ${activo ? 'activar' : 'desactivar'} plantilla ${id}:`, error)
            throw error
        }
    },

    // Eliminar plantilla
    async delete(id) {
        console.log(`[emailTemplates] Eliminando plantilla ${id}`)
        try {
            await API.acceder({
                Ruta: `/emailTemplates/${id}`,
                Metodo: 'DELETE'
            })
            console.log(`[emailTemplates] Plantilla ${id} eliminada`)
            return true
        } catch (error) {
            console.error(`[emailTemplates] Error al eliminar plantilla ${id}:`, error)
            throw error
        }
    },

    // Subir imagen y obtener URL
    async uploadImage(file) {
        console.log('[emailTemplates] Subiendo imagen:', file)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await API.acceder({
                Ruta: '/emailTemplates/upload',
                Metodo: 'POST',
                Body: formData
            })
            const url = response.url || (response.data && response.data.url)
            console.log('[emailTemplates] Imagen subida. URL:', url)
            return url
        } catch (error) {
            console.error('[emailTemplates] Error al subir imagen:', error)
            throw error
        }
    }
}

// Exportar el store como un objeto con métodos
export default {
  ...emailTemplates
}
