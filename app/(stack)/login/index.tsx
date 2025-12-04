import Button from '@/components/shared/button'
import Divider from '@/components/shared/divider'
import Input from '@/components/shared/input'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'


const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  return (
    <>
      <View className='mx-3 justify-center items-center'>
        <Image
          style={{width: 200, resizeMode: 'contain', marginTop: 20}}
          source={require('../../../assets/images/logo2.png')}
        />
        <Image
          style={{width: 200, resizeMode: 'contain', marginTop: -100}}
          source={require('../../../assets/images/gato_computador.png')}
        />
      </View>

      <View className='bg-white rounded-3xl p-4 mt-[-100] border border-secondary-100/10  mx-2 '>


        <Text className='font-barlow-bold text-center mb-3 text-2xl '>Iniciar Sesión</Text>


        <Input className='font-barlow-medium' placeholder='Correo ' value={email} error={!email ? 'El correo es obligatorio ': ''}
              keyboardType='email-address'
              autoCapitalize='none'
              onChangeText={setEmail}
        />
        <Input className='font-barlow-medium' placeholder='Contraseña ' value={password} error={password.length > 0 && password.length < 8 ? 'La contraseña debe tener mínimo 8 caracteres': ''}
              secureTextEntry
              onChangeText={setPassword}
        />

        <Button variant='text-only' textPos='left' className='mx-[-11] mt-[-18]' onPress={() => {router.push('/(stack)/forgotPassword')}}>¿Olvidaste la contraseña?</Button>
        <Button variant='contained' className='mt-3' onPress={() => {router.push('/(tabs)/home')}}>Entrar</Button>

        <Divider></Divider>

        <View className='flex-row items-center justify-between'>
          <Button variant='facebook' className='px-7'>Facebook</Button>
          <Button variant='google' className='px-10'>Gmail</Button>
        </View>


      </View>

      <View className='flex-row items-center mt-3 justify-center'>
      <Text className='text-secondary-100 font-barlow-medium'>¿No tienes cuenta?</Text>
      <Button variant='text-only' textPos='center' onPress={() => {router.push('/(stack)/register')}}>Regístrate</Button>
      </View>
    </>

  )
}

export default LoginScreen