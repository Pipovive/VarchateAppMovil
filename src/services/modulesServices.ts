import api from '../api/api';

export const getModules = async () => {
    const response = await api.get('/modulos');

    return response.data
}
export const getModuleBySlug = async (slug : string) => {
    const response = await api.get(`/modulos/${slug}`);
    return response.data;
};

// ✅ NUEVO: Obtener progresión de módulos
export const getModulesWithProgress = async () => {
    console.log('📊 Obteniendo módulos con progreso...');
    const response = await api.get('/modulos-con-progreso');
    return response.data;
};