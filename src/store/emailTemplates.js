import API from 'vue-lsi-util/APIAccesoV2'

const emailTemplates = {
    async getAll() {
        const logPrefix = '[emailTemplates] [getAll]';
        console.group(`${logPrefix} Iniciando`);
        try {
            const url = '/apiv3/emailTemplates';
            console.log(`${logPrefix} GET:`, url);
            const response = await API.acceder({ Ruta: url, Metodo: 'GET' });
            const result = Array.isArray(response) ? response : (response?.data || []);
            console.log(`${logPrefix} OK:`, result.length, 'plantillas');
            console.groupEnd();
            return result;
        } catch (error) {
            console.error(`${logPrefix} Error:`, error.response?.data || error.message);
            console.groupEnd();
            throw error;
        }
    },

    async getByType(tipo) {
        const logPrefix = `[emailTemplates] [getByType:${tipo}]`;
        console.group(logPrefix);
        try {
            const url = `/apiv3/emailTemplate/${tipo}`;
            console.log(`${logPrefix} GET:`, url);
            const response = await API.acceder({ Ruta: url, Metodo: 'GET' });
            const result = response?.data || response;
            console.log(`${logPrefix} OK:`, result ? 'Encontrada' : 'No encontrada');
            console.groupEnd();
            return result;
        } catch (error) {
            console.error(`${logPrefix} Error:`, error.response?.data || error.message);
            console.groupEnd();
            if (error.response?.status === 404) return null;
            throw error;
        }
    },

    getByCode(codigo) {
        console.log(`[emailTemplates] [getByCode] Redirigiendo a getByType:`, codigo);
        return this.getByType(codigo);
    },

    async getByEmpresa(idEmpresa) {
        const logPrefix = `[emailTemplates] [getByEmpresa:${idEmpresa}]`;
        console.group(logPrefix);
        try {
            const url = `/apiv3/emailTemplates/byEmpresa/${idEmpresa}`;
            console.log(`${logPrefix} GET:`, url);
            const response = await API.acceder({ Ruta: url, Metodo: 'GET' });
            const result = response?.data || [];
            console.log(`${logPrefix} OK:`, result.length, 'plantillas');
            console.groupEnd();
            return result;
        } catch (error) {
            console.error(`${logPrefix} Error:`, error.response?.data || error.message);
            console.groupEnd();
            if (error.response?.status === 404) return [];
            throw error;
        }
    },

    async save(template) {
        const isUpdate = !!template.Id;
        const logPrefix = `[emailTemplates] [${isUpdate ? 'update' : 'create'}]`;
        console.group(logPrefix);
        try {
            const url = `/apiv3/emailTemplates${isUpdate ? `/${template.Id}` : ''}`;
            const method = isUpdate ? 'PATCH' : 'POST';
            const requestData = {
                Tipo: template.Tipo,
                Titulo: template.Titulo,
                Cuerpo: template.Cuerpo,
                Activo: template.Activo !== false
            };
            
            console.log(`${logPrefix} ${method}:`, url);
            console.log(`${logPrefix} Data:`, { ...requestData, Cuerpo: '...' });
            
            const response = await API.acceder({
                Ruta: url,
                Metodo: method,
                Body: requestData
            });
            
            const result = response?.data || response;
            console.log(`${logPrefix} OK:`, { id: result.Id, tipo: result.Tipo });
            console.groupEnd();
            return result;
            
        } catch (error) {
            console.error(`${logPrefix} Error:`, error.response?.data || error.message);
            console.groupEnd();
            throw error;
        }
    },

    async setActive(id, activo) {
        const log = `[emailTemplates] [setActive] ${activo ? 'Activando' : 'Desactivando'} ${id}`;
        console.log(log);
        const response = await API.acceder({
            Ruta: `/apiv3/emailTemplates/${id}/activate/${activo}`,
            Metodo: 'PATCH'
        });
        return response?.data || response;
    },

    async delete(id) {
        console.log(`[emailTemplates] [delete] Eliminando ${id}`);
        await API.acceder({
            Ruta: `/apiv3/emailTemplates/${id}`,
            Metodo: 'DELETE'
        });
        return true;
    },

    async uploadImage(file) {
        const log = `[emailTemplates] [uploadImage] ${file.name} (${(file.size / 1024).toFixed(1)}KB)`;
        console.log(log);
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await API.acceder({
            Ruta: '/apiv3/upload',
            Metodo: 'POST',
            Body: formData,
            Headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const url = response?.data?.url || response?.url;
        console.log(`${log} - OK:`, url?.substring(0, 50) + '...');
        return url;
    }
};

export default { ...emailTemplates };
