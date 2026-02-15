// src/viewmodels/LoginViewModel.ts
import { loginWithGoogle, requestLogin } from '@/src/services/authservices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

export const useLoginViewModel = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loginUser = useCallback(async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            const data = await requestLogin(email, password);
            const { access_token, user } = data;

            if (!access_token) {
                throw new Error('Token no recibido');
            }

            await AsyncStorage.setItem('token', access_token);
            return { user, access_token };

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Error al iniciar sesión';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // ← Dependencias vacías

    const loginWithGoogleToken = useCallback(async (idToken: string) => {
        try {
            setLoading(true);
            setError(null);

            const data = await loginWithGoogle(idToken);
            const { access_token, user } = data;

            if (!access_token) {
                throw new Error('Token no recibido del servidor');
            }

            await AsyncStorage.setItem('token', access_token);

            return { user, access_token };

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err.message || 'Error al iniciar sesión con Google';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []); // ← Dependencias vacías
    
    return {
        loading,
        error,
        loginUser,
        loginWithGoogleToken,
    };
};