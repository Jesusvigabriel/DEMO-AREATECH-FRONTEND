import API from 'vue-lsi-util/APIAccesoV2'

const emailTemplates = {
    // Obtener todas las plantillas
    async getAll() {
        console.log('[emailTemplates] Obteniendo todas las plantillas')
        try {
            const response = await API.acceder({
                Ruta: '/apiv3/emailTemplates',
                Metodo: 'GET'
            })
            console.log('[emailTemplates] Plantillas obtenidas:', response)
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
                Ruta: `/apiv3/emailTemplates/${tipo}`,
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

    // Crear o actualizar plantilla
    async save(template) {
        const isUpdate = !!template.Id
        console.log(`[emailTemplates] ${isUpdate ? 'Actualizando' : 'Creando'} plantilla:`, template)
        
        try {
            const response = await API.acceder({
                Ruta: '/apiv3/emailTemplates' + (isUpdate ? `/${template.Id}` : ''),
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
                Ruta: `/apiv3/emailTemplates/${id}/activate/${activo}`,
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
                Ruta: `/apiv3/emailTemplates/${id}`,
                Metodo: 'DELETE'
            })
            console.log(`[emailTemplates] Plantilla ${id} eliminada`)
            return true
        } catch (error) {
            console.error(`[emailTemplates] Error al eliminar plantilla ${id}:`, error)
            throw error
        }
    },

    // Enviar correo de prueba
    async sendTestEmail(serverConfig, destinatario) {
        console.log('[emailTemplates] Enviando correo de prueba a:', destinatario)
        console.log('Configuración del servidor:', {
            ...serverConfig,
            Password: '***' // No registrar la contraseña en los logs
        })
        
        const testEmail = {
            to: destinatario,
            subject: 'Prueba de envío de correo',
            text: 'Este es un correo de prueba enviado desde el panel de configuración.',
            html: `
                <h2>¡Prueba de envío exitosa!</h2>
                <p>Este es un correo de prueba enviado desde el panel de configuración.</p>
                <p>Configuración del servidor:</p>
                <ul>
                    <li><strong>Servidor:</strong> ${serverConfig.Host}:${serverConfig.Port}</li>
                    <li><strong>Usuario:</strong> ${serverConfig.Username}</li>
                    <li><strong>SSL/TLS:</strong> ${serverConfig.Secure ? 'Habilitado' : 'Deshabilitado'}</li>
                </ul>
                <p>Si recibes este correo, la configuración SMTP es correcta.</p>
            `,
            serverConfig: {
                host: serverConfig.Host,
                port: serverConfig.Port,
                secure: serverConfig.Secure,
                auth: {
                    user: serverConfig.Username,
                    pass: serverConfig.Password
                }
            }
        }

        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: '/emailTemplate/test',
                Metodo: 'POST',
                Body: testEmail,
            })
            .then(data => {
                console.log('[emailTemplates] Correo de prueba enviado con éxito:', data)
                resolve(data)
            })
            .catch(err => {
                console.error('[emailTemplates] Error al enviar correo de prueba:', err)
                reject(err)
            })
        })
    }
}

// Exportar el store como un objeto con métodos
export default {
  ...emailTemplates
}
