import { requestUser, updatePassword, updateUserProfile } from '@/src/services/authservices';
import { useState } from 'react';

interface User {
    id: number;
    nombre: string;
    email: string;
    avatar_id: number;
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

    return {
        user,
        loading,
        error,
        fetchUser,
        changePassword,
        updateProfile
    };
};