// src/viewmodels/ForgotPasswordViewModel.ts
import { forgotPassword } from '@/src/services/authservices';
import { useState } from 'react';

export const useForgotPasswordViewModel = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const sendResetEmail = async (email: string) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('El formato del correo es inválido');
            }

            const response = await forgotPassword(email);
            
            setSuccess(true);
            return response;

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Error al enviar correo de recuperación';
            setError(errorMessage);
            console.error('Error en sendResetEmail:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        success,
        sendResetEmail
    };
};