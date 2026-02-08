const { default: axios } = require("axios")
import AsyncStorage from '@react-native-async-storage/async-storage';


//NOTA arracnar php artisan asi: php artisan serve --host=0.0.0.0 --port=8000


const api = axios.create({
    // baseURL: 'http://192.168.20.27:8000/api',
    // base url SENA:10.32.21.107 
    baseURL: 'http://192.168.101.9:8000/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

// Interceptor corregido
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token'); // Obtener token guardado
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // ¡Importante! Debes retornar config
}, (error) => {
    return Promise.reject(error);
});

export default api;