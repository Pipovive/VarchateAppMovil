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
      console.log('🚀 ViewModel: Iniciando registro...')
      
      const response = await requestRegister(
        nombre,
        email,
        password,
        password_confirmation,
        terms_accepted
      );

      console.log('✅ ViewModel: Respuesta completa:', response)

      // ✅ Si llegó aquí, la petición fue exitosa
      // Retorna el mensaje o un texto por defecto
      return {
        success: true,
        message: response?.message || 'Registro exitoso',
        data: response
      }

    } catch (error) {
      console.log('❌ ViewModel: Error capturado:', error)
      console.log('❌ Error response:', error.response)
      console.log('❌ Error message:', error.message)
      
      // Re-lanza el error para que lo maneje el componente
      throw error
    }
  };

  return {
    registerUser,
  };
};