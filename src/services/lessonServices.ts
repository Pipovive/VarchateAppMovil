import api from '../api/api';

/**
 * Obtener todas las lecciones de un módulo
 * GET /modulos/{moduleId}/lecciones
 */
export const getModuleLessons = async (moduleSlug : any) => {
    console.log('📡 GET /modulos/' + moduleSlug + '/lecciones');
    const response = await api.get(`/modulos/${moduleSlug}/lecciones`);
    return response.data;
};

export const getLessonById = async (moduleSlug : any , lessonId : any) => {
    console.log('📡 GET /modulos/' + moduleSlug + '/lecciones/id/' + lessonId);
    const response = await api.get(`/modulos/${moduleSlug}/lecciones/id/${lessonId}`);
    return response.data;
};

export const markLessonAsViewed = async (moduleSlug : any, lessonId : any) => {
    console.log('📡 GET /modulos/' + moduleSlug + '/lecciones/' + lessonId + '/marcar-vista');
    const response = await api.get(`/modulos/${moduleSlug}/lecciones/${lessonId}/marcar-vista`);
    return response.data;
};

export const getLessonNavigation = async (moduleSlug : any, lessonId : any) => {
    console.log('📡 GET /modulos/' + moduleSlug + '/lecciones/' + lessonId + '/navegacion');
    const response = await api.get(`/modulos/${moduleSlug}/lecciones/${lessonId}/navegacion`);
    return response.data;
};