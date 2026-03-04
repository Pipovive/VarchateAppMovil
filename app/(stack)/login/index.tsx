import Button from '@/components/shared/button'
import Divider from '@/components/shared/divider'
import Input from '@/components/shared/input'
import { useGoogleSignIn } from '@/src/services/googleAuth'
import { useLoginViewModel } from '@/src/viewmodels/LoginViewModel'
import axios from 'axios'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Text, View } from 'react-native'


interface LaravelValidationError {
  message: string
  errors: Record<string, string[]>
}

const LoginScreen = () => {
  const [googleStarted, setGoogleStarted] = useState(false);

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loginUser, loginWithGoogleToken, loading } = useLoginViewModel()
  const { request, response, promptAsync } = useGoogleSignIn()

  // Manejar respuesta de Google
  useEffect(() => {
    console.log('🔄 Response completo:', JSON.stringify(response, null, 2));

    if (!googleStarted) {
      console.log('⏭️ Ignorando response (login no iniciado)');
      return;
    }

    console.log('📊 Response type:', response?.type);

    if (response?.type === 'success') {
      console.log('✅ SUCCESS - Params:', response.params);
      const { id_token } = response.params;

      if (!id_token) {
        Alert.alert('Error', 'No se recibió el token de Google');
        return;
      }

      handleGoogleResponse(id_token);
      setGoogleStarted(false);
    }

    if (response?.type === 'error') {
      console.log('❌ ERROR - Details:', response.error);
      Alert.alert('Error', `Error: ${response.error?.message || 'Desconocido'}`);
      setGoogleStarted(false);
    }

    if (response?.type === 'cancel') {
      console.log('⚠️ Usuario canceló');
      setGoogleStarted(false);
    }
  }, [response]);


  const handleGoogleResponse = async (idToken: string) => {
    try {
      console.warn('🔵 ENVIANDO TOKEN');

      const data = await loginWithGoogleToken(idToken);

      console.warn('✅ RESPUESTA OK:', JSON.stringify(data).substring(0, 100));

      console.warn('🚀 NAVEGANDO...');
      router.replace('/(tabs)/home');

    } catch (error: any) {
      console.warn('❌ ERROR:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Completa todos los campos')
      return
    }

    try {
      const data = await loginUser(email, password)

      if (!data?.access_token) {
        throw new Error('Token no recibido')
      }

      Alert.alert('Éxito', 'Has iniciado sesión correctamente')
      router.replace('/(tabs)/home')

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          const data = error.response.data as LaravelValidationError
          alert(data.message)
          return
        }
        alert(error.message)
        return
      }
      alert('Error inesperado')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      if (!request) {
        Alert.alert('Error', 'Google Sign-In no está listo');
        return;
      }

      setGoogleStarted(true);
      await promptAsync();

    } catch (error: any) {
      setGoogleStarted(false);
      Alert.alert('Error', error.message || 'Error al abrir Google Sign-In');
    }
  };

  return (
    <>
      <View className='mx-3 justify-center items-center' pointerEvents="none">
        <Image
          style={{ width: 200, resizeMode: 'contain', marginTop: 20 }}
          source={require('../../../assets/images/logo2.png')}
        />
        <Image
          style={{ width: 200, resizeMode: 'contain', marginTop: -100 }}
          source={require('../../../assets/images/gato_computador.png')}
        />
      </View>

      <View className='bg-white rounded-3xl p-4 mt-[-100] border border-secondary-100/10 mx-2'>

        <Text className='font-barlow-bold text-center mb-3 text-2xl'>Iniciar Sesión</Text>

        <Input
          className='font-barlow-medium'
          placeholder='Correo'
          value={email}
          error={!email ? 'El correo es obligatorio' : ''}
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={setEmail}
          editable={!loading}
        />

        <Input
          className='font-barlow-medium'
          placeholder='Contraseña'
          value={password}
          error={password.length > 0 && password.length < 8 ? 'La contraseña debe tener mínimo 8 caracteres' : ''}
          secureTextEntry
          onChangeText={setPassword}
          editable={!loading}
        />

        <Button
          variant='text-only'
          textPos='left'
          className='mx-[-11] mt-[-18]'
          onPress={() => router.push('/(stack)/forgotPassword')}
        >
          ¿Olvidaste la contraseña?
        </Button>

        <Button
          variant='contained'
          className='mt-3'
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </Button>

        <Divider />

        <View className='w-full'>
          <Button
            variant='google'
            className='px-10'
            onPress={handleGoogleLogin}
            disabled={!request || loading}
          >
            {loading ? 'Cargando...' : 'Gmail'}
          </Button>
        </View>

      </View>

      <View className='flex-row items-center mt-3 justify-center'>
        <Text className='text-secondary-100 font-barlow-medium'>¿No tienes cuenta?</Text>
        <Button
          variant='text-only'
          textPos='center'
          onPress={() => router.push('/(stack)/register')}
        >
          Regístrate
        </Button>
      </View>
    </>
  )
}

export default LoginScreen