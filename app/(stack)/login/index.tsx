import Button from '@/components/shared/button'
import Input from '@/components/shared/input'
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

      <View className='bg-white rounded-3xl p-10 mt-[-70]  mx-2'>

        <Text className='font-barlow-bold text-center mb-2 text-2xl '>Iniciar Sesión</Text>


        <Input placeholder='Correo ' value={email} error={!email ? 'El correo es obligatorio ': ''}
              keyboardType='email-address'
              autoCapitalize='none'
              onChangeText={setEmail}
        />
        <Input placeholder='Contraseña ' value={password} error={password.length > 0 && password.length < 8 ? 'La contraseña debe tener minimo 8 character': ''}
              secureTextEntry
              onChangeText={setPassword}
        />

        <Button variant='text-only' textPos='left' className='mx-[-11] mt-[-20]'>¿Olvidate la contraseña?</Button>
        <Button variant='contained'>Entrar</Button>

      </View>
      <View className='h-3 mx-4 -mt-3 rounded-b-2xl bg-secondary/10'></View> 
    </>
  )
}

export default LoginScreen