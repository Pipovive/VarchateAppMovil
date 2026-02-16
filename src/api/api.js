const { default: axios } = require("axios")
import AsyncStorage from '@react-native-async-storage/async-storage';


//NOTA arracnar php artisan asi: php artisan serve --host=0.0.0.0 --port=8000
// baseURL: 'http://192.168.20.27:8000/api',
// base url SENA:10.32.16.171
// baseURL: 'http://192.168.101.9:8000/api', 
// casa lina 192.168.20.27
// 10.32.22.221

const api = axios.create({
  baseURL: 'http://10.32.22.221:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// 🔑 Interceptor de REQUEST - Agregar token automáticamente
api.interceptors.request.use(
  async (config) => {
    try {
      // Leer el token con la MISMA key que usas en UserViewModel
      const token = await AsyncStorage.getItem('token');

      console.log('🔍 Petición a:', config.url);
      console.log('🔑 Token encontrado:', token ? 'SÍ (' + token.substring(0, 15) + '...)' : 'NO');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token agregado al header');
      } else {
        console.log('⚠️ No hay token - petición sin autenticar');
      }

      return config;
    } catch (error) {
      console.error('❌ Error en request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ Error antes de enviar petición:', error);
    return Promise.reject(error);
  }
);

// 📥 Interceptor de RESPONSE - Debug
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response exitosa:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ API Error interceptado:');
    console.log('URL:', error.config?.url);
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);

    // Si es 401, probablemente no hay token o expiró
    if (error.response?.status === 401) {
      console.log('🔐 Error 401 - Token inválido, expirado o inexistente');
    }

    return Promise.reject(error);
  }
);

export const getModuleLessons = async (moduleId) => {
  console.log('📡 GET /modulos/' + moduleId + '/lecciones');
  const response = await api.get(`/modulos/${moduleId}/lecciones`);
  return response.data;
};

export const getLessonById = async (moduleId, lessonId) => {
  console.log('📡 GET /modulos/' + moduleId + '/lecciones/id/' + lessonId);
  const response = await api.get(`/modulos/${moduleId}/lecciones/id/${lessonId}`);
  return response.data;
};

export const markLessonAsViewed = async (moduleId, lessonId) => {
  console.log('📡 GET /modulos/' + moduleId + '/lecciones/' + lessonId + '/marcar-vista');
  const response = await api.get(`/modulos/${moduleId}/lecciones/${lessonId}/marcar-vista`);
  return response.data;
};

export const getLessonNavigation = async (moduleId, lessonId) => {
  console.log('📡 GET /modulos/' + moduleId + '/lecciones/' + lessonId + '/navegacion');
  const response = await api.get(`/modulos/${moduleId}/lecciones/${lessonId}/navegacion`);
  return response.data;
};


export default api;