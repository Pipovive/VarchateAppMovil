import api from '../api/api';

export const requestLogin = async (email, password) => {
    const response = await api.post('/login', {
        email,
        password
    });

    return response.data;
};

export const requestUser = async () => {
    const response = await api.get('/me');
    return response.data;
};

export const requestRegister = async (
    nombre,
    email,
    password,
    password_confirmation,
    terms_accepted
) => {
    const response = await api.post('/register', {
        nombre,
        email,
        password,
        password_confirmation,
        terms_accepted
    });

    return response.data; // 👈 FUNDAMENTAL
};

export const updateUserProfile = async (nombre, avatarId) => {
    const response = await api.put('/me', {
        nombre,
        avatar_id: avatarId
    });

    return response.data;
};

export const logout = async () => {
    const response = await api.post('/logout');
    return response.data;
}

//BORRAR CUENTA

export const deleteAccount = async (password) => {
    const response = await api.delete('/account', {
        data: {  // ← Importante: axios DELETE requiere 'data'
            password: password
        }
    });
    return response.data;
};

export const updatePassword = async (
    currentPassword,
    newPassword,
    passwordConfirmation
) => {
    const response = await api.put('/me/password', {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: passwordConfirmation
    });

    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/password/forgot', {
        email
    });

    return response.data;
};

export const loginWithGoogle = async (googleToken) => {
    const response = await api.post('/auth/google', {
        token: googleToken
    });

    return response.data;
};