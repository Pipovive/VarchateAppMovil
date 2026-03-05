import Button from '@/components/shared/button';
import Divider from '@/components/shared/divider';
import Input from '@/components/shared/input';
import { signInWithGoogle } from '@/src/services/googleAuth';
// import { useGoogleSignIn } from '@/src/services/googleAuth'; // ← importa el hook
import { useRegisterViewModel } from '@/src/viewmodels/RegisterViewModel';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [googleIniciado, setGoogleIniciado] = useState(false);
  const [nombre, setNombre] = useState('')
  const [validPassword, setValidPassword] = useState('')
  const [checked, setChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // ← Estado de carga
  const { registerUser } = useRegisterViewModel()
  const { loginWithGoogleToken } = useUserViewModel(); // ← agrega esto
  // const { request, response, promptAsync } = useGoogleSignIn(); // ← úsalo

  
  const handleGoogleLogin = async () => {
  try {
    const userInfo = await signInWithGoogle();
    if (userInfo.type === 'success') {
      // ← obtén el accessToken
      const { accessToken } = await GoogleSignin.getTokens();
      console.log('🔑🔑🔑 Access Token:', accessToken);
      if (!accessToken) {
        Alert.alert('Error', 'No se pudo obtener el token');
        return;
      }

      await loginWithGoogleToken(accessToken); // ← envía accessToken
      router.replace('/(tabs)/home');
    }
  } catch (error: any) {
    Alert.alert('Error', error.message);
  }
};

  const handleRegister = async () => {
    if (!email || !nombre || !password || !validPassword || !checked) {
      alert('Completa todos los campos')
      return
    }

    if (password !== validPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)

    try {
      console.log('🚀 Screen: Iniciando registro...')
      console.log('📦 Datos:', { nombre, email, password: '***' })

      const result = await registerUser(nombre, email, password, validPassword, checked)

      console.log('✅ Screen: Resultado recibido:', result)

      // ✅ Detener loading antes de navegar
      setIsLoading(false)

      // Navegar después de un pequeño delay
      setTimeout(() => {
        router.replace('/(stack)/confirmed')
      }, 200)

      return

    } catch (error: unknown) {
      console.log('❌ Screen: Error capturado:', error)

      setIsLoading(false)

      // 1️⃣ Error de Axios
      if (axios.isAxiosError(error)) {
        console.log('📡 Axios Error')
        console.log('Status:', error.response?.status)
        console.log('Data:', error.response?.data)
        console.log('Message:', error.message)

        // 🔴 Error de validación (422)
        if (error.response?.status === 422) {
          const data = error.response.data as {
            message?: string
            errors?: Record<string, string[]>
          }

          if (data.errors) {
            const firstError = Object.values(data.errors)[0][0]
            alert(firstError)
            return
          }

          alert(data.message || 'Datos inválidos')
          return
        }

        // 🔐 Credenciales incorrectas (401)
        if (error.response?.status === 401) {
          alert('Credenciales incorrectas')
          return
        }

        // 🌐 Error de red (sin respuesta)
        if (!error.response) {
          console.log('🔴 Sin respuesta del servidor')
          console.log('Request:', error.request)
          alert('No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.')
          return
        }

        // Otros errores HTTP
        alert(error.response?.data?.message || error.message)
        return
      }

      // 2️⃣ Error manual
      if (error instanceof Error) {
        console.log('⚠️ Error instanceof Error:', error.message)
        alert(error.message)
        return
      }

      // 3️⃣ Error desconocido
      console.log('❓ Error desconocido:', error)
      alert('Ocurrió un error inesperado')
    }
  }
  //   if (!googleIniciado) return; // ← ignora si no iniciaste el login

  //   console.log('🔄 Response:', response);
  //   if (response?.type === 'success') {
  //     const token = response.authentication?.accessToken;
  //     console.log('✅ Token:', token);
  //   }
  //   if (response?.type === 'dismiss') {
  //     console.log('⚠️ Usuario cerró el login');
  //   }
  // }, [response]);

  return (
    <>
      <View className='mx-3 justify-center items-center'>
        <Image
          style={{ width: 200, resizeMode: 'contain', marginTop: 20 }}
          source={require('../../../assets/images/logo2.png')}
        />
      </View>

      <View className='bg-white rounded-3xl p-4 border border-secondary-100/10 mx-2'>
        <Text className='font-barlow-bold text-center mb-2 text-2xl'>Registrarse</Text>

        <Input
          className='font-barlow-medium'
          placeholder='Nombre'
          value={nombre}
          error={!nombre ? 'El nombre es obligatorio' : ''}
          onChangeText={setNombre}
          editable={!isLoading} // ← Deshabilita mientras carga
        />

        <Input
          className='font-barlow-medium'
          placeholder='Correo'
          value={email}
          error={!email ? 'El correo es obligatorio' : ''}
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={setEmail}
          editable={!isLoading}
        />

        <Input
          className='font-barlow-medium'
          placeholder='Contraseña'
          value={password}
          error={password.length > 0 && password.length < 8 ? 'La contraseña debe tener mínimo 8 caracteres' : ''}
          secureTextEntry
          onChangeText={setPassword}
          editable={!isLoading}
        />

        <Input
          className='font-barlow-medium'
          placeholder='Confirmar contraseña'
          value={validPassword}
          error={validPassword !== password ? 'Las contraseñas deben de ser iguales' : ''}
          secureTextEntry
          onChangeText={setValidPassword}
          editable={!isLoading}
        />

        <View className='flex-row items-center mb-4'>
          <TouchableOpacity
            onPress={() => !isLoading && setChecked(!checked)}
            className={`w-5 h-5 mr-2 rounded border ${checked ? 'bg-primary-100' : 'bg-quaternary border-secondary-100'} items-center justify-center`}
            disabled={isLoading}
          >
            {checked && <Text className='text-quaternary text-xs'>✔</Text>}
          </TouchableOpacity>
          <Text className='text-sm text-secondary-100 flex-1 font-barlow-medium'>
            Acepto los{' '}
            <Text className='text-primary-200 underline font-barlow-medium'>términos y condiciones</Text>
          </Text>
        </View>
        {isLoading && (
          <View className='items-center mb-2'>
            <ActivityIndicator color="#0099FF" size="small" />
          </View>
        )}

        <Button
          variant='contained'
          className='mt-4'
          onPress={handleRegister}
          disabled={!checked || isLoading}
        >
          {isLoading ? 'Registrando...' : 'Registrar'}
        </Button>
        <Divider />

        <Button
          variant='google'
          className='px-10'
          disabled={isLoading}
          onPress={handleGoogleLogin}
        >
          Gmail
        </Button>
      </View>

      <View className='flex-row items-center mt-4 justify-center'>
        <Text className='text-secondary-100 font-barlow-medium'>¿Ya tienes cuenta?</Text>
        <Button
          variant='text-only'
          textPos='center'
          onPress={() => router.push('/(stack)/login')}
          disabled={isLoading}
        >
          Iniciar sesión
        </Button>
      </View>
    </>
  )
}

export default RegisterScreen