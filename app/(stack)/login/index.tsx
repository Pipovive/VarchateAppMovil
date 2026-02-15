import Button from '@/components/shared/button'
import Divider from '@/components/shared/divider'
import Input from '@/components/shared/input'
import { useLoginViewModel } from '@/src/viewmodels/LoginViewModel'
import axios from 'axios'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, Text, View } from 'react-native'

interface LaravelValidationError {
  message: string
  errors: Record<string, string[]>
}

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loginUser, loading } = useLoginViewModel()

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos')
      return
    }

    try {
      const data = await loginUser(email, password)

      if (!data?.access_token) {
        throw new Error('Token no recibido')
      }

      router.replace('/(tabs)/home');

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          const data = error.response.data as LaravelValidationError
          Alert.alert('Error', data.message)
          return
        }
        Alert.alert('Error', error.response?.data?.message || error.message)
        return
      }
      Alert.alert('Error', 'Error inesperado al iniciar sesión')
    }
  }

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
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={setEmail}
          editable={!loading}
        />

        <Input
          className='font-barlow-medium'
          placeholder='Contraseña'
          value={password}
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

        <View className='flex-row items-center justify-between'>
          <Button variant='facebook' className='px-7' disabled={true}>
            Facebook
          </Button>

          <Button variant='google' className='px-10' disabled={true}>
            Gmail
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