import { deleteAccount as deleteAccountService, loginWithGoogle, logout as logoutServices, requestUser, updatePassword, updateUserProfile } from '@/src/services/authservices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
interface User {
    id: number;
    nombre: string;
    email: string;
    avatar_id: number;
    proveedor_auth: 'email' | 'google';
}
export const useUserViewModel = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);

            const userData = await requestUser();

            if (!userData) {
                throw new Error('Usuario no recibido');
            }

            setUser(userData);
            return userData;

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Error al obtener usuario';
            setError(errorMessage);
            console.error('Error en fetchUser:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutServices();

            await AsyncStorage.removeItem('token');
            setUser(null);

            return true;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Error al cerrar sesión';
            setError(errorMessage);
            console.error('Error en logout:', err);

            // Aunque falle el servidor, limpiar localmente
            await AsyncStorage.removeItem('token');
            setUser(null);

            throw err;
        } finally {
            setLoading(false);

        }
    }

    const changePassword = async (
        currentPassword: string,
        newPassword: string,
        passwordConfirmation: string
    ) => {
        try {
            setLoading(true);
            setError(null);

            if (newPassword !== passwordConfirmation) {
                throw new Error('Las contraseñas no coinciden');
            }

            if (newPassword.length < 8) {
                throw new Error('La contraseña debe tener al menos 8 caracteres');
            }

            // Validar que tenga al menos un carácter especial
            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
            if (!specialCharRegex.test(newPassword)) {
                throw new Error('La contraseña debe tener al menos un carácter especial');
            }

            const response = await updatePassword(
                currentPassword,
                newPassword,
                passwordConfirmation
            );

            return response;

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Error al cambiar contraseña';
            setError(errorMessage);
            console.error('Error en changePassword:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (nombre: string, avatarId: number) => {
        try {
            setLoading(true);
            setError(null);

            if (!nombre || nombre.trim() === '') {
                throw new Error('El nombre es obligatorio');
            }

            const response = await updateUserProfile(nombre, avatarId);

            // Actualizar el estado local del usuario
            setUser(response);

            return response;

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Error al actualizar perfil';
            setError(errorMessage);
            console.error('Error en updateProfile:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async (password: string) => {
        try {
            console.log('🔴 Intentando eliminar cuenta con password:', password ? '***' : 'VACÍO');
            setLoading(true);
            setError(null);

            if (!password || password.trim() === '') {
                throw new Error('Debes ingresar tu contraseña para eliminar la cuenta');
            }

            // Llamar al endpoint de eliminación
            await deleteAccountService(password);

            // Limpiar token y estado
            await AsyncStorage.removeItem('token');
            setUser(null);

            return true;

        } catch (err: any) {
            console.log('❌ Error completo:', error);
            console.log('❌ Error response:', error);
            console.log('❌ Error status:', error);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogleToken = async (idToken: string) => {
        try {
            setLoading(true);
            setError(null);

            console.log('🟡 Enviando token a Laravel...');

            const data = await loginWithGoogle(idToken);
            const { access_token, user } = data;

            if (!access_token) {
                throw new Error('Token no recibido del servidor');
            }

            console.log('✅ Login con Google exitoso');

            await AsyncStorage.setItem('token', access_token);

            return { user, access_token };

        } catch (err: any) {
            console.log('❌ Error en Google login:', err);
            const errorMessage = err?.response?.data?.message || err.message || 'Error al iniciar sesión con Google';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };



    return {
        user,
        loading,
        error,
        fetchUser,
        changePassword,
        updateProfile,
        logout,
        deleteAccount,
        loginWithGoogleToken
    };
};