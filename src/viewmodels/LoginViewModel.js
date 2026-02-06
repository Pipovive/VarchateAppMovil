import { requestLogin } from '@/src/services/authservices';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLoginViewModel = () => {

    const loginUser = async (email, password) => {
        try {
            const data = await requestLogin(email, password)

            // Laravel responde aquí ↓
            const { access_token, user } = data


            if (!access_token) {
                throw new Error('Token no recibido')
            }

            // Guardamos token (responsabilidad del ViewModel)
            await AsyncStorage.setItem('token', access_token)

            return { user, access_token }

        } catch (error) {
            throw error.response?.data || error;
        }
    };

    return {
        loginUser,
    };
};
