import api from '../api/api';

export const getModules = async () => {
    const response = await api.get('/modulos');

    return response.data
}
export const getModuleBySlug = async (slug : string) => {
    const response = await api.get(`/modulos/${slug}`);
    return response.data;
};