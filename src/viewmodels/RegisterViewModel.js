import { requestRegister } from '@/src/services/authservices';

export const useRegisterViewModel = () => {

  const registerUser = async (
    nombre,
    email,
    password,
    password_confirmation,
    terms_accepted
  ) => {
    try {
      const response = await requestRegister(
        nombre,
        email,
        password,
        password_confirmation,
        terms_accepted
      );

      // Laravel responde: { message: "..." }
      if (!response?.message) {
        throw new Error('Mensaje no recibido');
      }

      return response;

    } catch (error) {
      throw error;
    }
  };

  return {
    registerUser,
  };
};
