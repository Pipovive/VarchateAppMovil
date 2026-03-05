import Button from '@/components/shared/button';
import Divider from '@/components/shared/divider';
import Input from '@/components/shared/input';
import { signInWithGoogle } from '@/src/services/googleAuth';
import { useLoginViewModel } from '@/src/viewmodels/LoginViewModel';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, View } from 'react-native';

interface LaravelValidationError {
  message: string
  errors: Record<string, string[]>
}

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loginUser, loading } = useLoginViewModel()
  const { loginWithGoogleToken } = useUserViewModel();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Completa todos los campos')
      return
    }
    try {
      const data = await loginUser(email, password)
      if (!data?.access_token) throw new Error('Token no recibido')
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
    setIsLoading(true);
    try {
      const userInfo = await signInWithGoogle();
      if (userInfo.type === 'success') {
        const idToken = userInfo.data.idToken;

        if (!idToken) {
          Alert.alert('Error', 'No se pudo obtener el token de Google');
          return;
        }

        await loginWithGoogleToken(idToken);
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);  // ← desactiva loading siempre
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
          onPress={handleLogin}  // ← corregido
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </Button>

        <Divider />

        <View className='w-full'>
          <Button
            variant='google'
            className='px-10'
            disabled={isLoading}
            onPress={handleGoogleLogin}  // ← corregido
          >
            Gmail
          </Button>
          {isLoading && <ActivityIndicator color="#0099FF" size="small" />}
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