import Button from '@/components/shared/button'
import Divider from '@/components/shared/divider'
import Input from '@/components/shared/input'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const RegisterScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [nombre, setNombre] = useState('')
    const [validPassword, setValidPassword] = useState('')
    const [checked, setChecked] = useState(false)
   
   
     return (
       <>
         <View className='mx-3 justify-center items-center'>
           <Image
             style={{width: 200, resizeMode: 'contain', marginTop: 20}}
             source={require('../../../assets/images/logo2.png')}
           />
         </View>
   
         <View className='bg-white rounded-3xl p-4  border border-secondary-100/10  mx-2 '>
   
   
           <Text className='font-barlow-bold text-center mb-2 text-2xl '>Registrarse</Text>

          <Input className='font-barlow-medium' placeholder='Nombre' value={nombre} error={!nombre ? 'El nombre es obligatorio ': ''}
                 onChangeText={setNombre}
           />
   
           <Input className='font-barlow-medium' placeholder='Correo ' value={email} error={!email ? 'El correo es obligatorio ': ''}
                 keyboardType='email-address'
                 autoCapitalize='none'
                 onChangeText={setEmail}
           />
           <Input className='font-barlow-medium' placeholder='Contraseña ' value={password} error={password.length > 0 && password.length < 8 ? 'La contraseña debe tener mínimo 8 caracteres': ''}
                 secureTextEntry
                 onChangeText={setPassword}
           />

           <Input className='font-barlow-medium' placeholder='Confirmar contraseña ' value={validPassword} error={validPassword !== password ? 'Las contraseñas deben de ser iguales': ''}
                 secureTextEntry
                 onChangeText={setValidPassword}
           />
   
           <View className='flex-row items-center mb-4'>
            <TouchableOpacity onPress={() => setChecked(!checked)} className={`w-5 h-5 mr-2 rounded border ${checked ? 'bg-primary-100' : 'bg-quaternary border-secondary-100' } items-center justify-center`}>
              {checked && <Text className='text-quaternary text-xs'>✔</Text>}
            </TouchableOpacity>
            <Text className='text-sm text-secondary-100 flex-1 font-barlow-medium'>Acepto los{' '} <Text className='text-primary-200 underline font-barlow-medium'>términos y condiciones</Text></Text>
           </View>
           <Button variant='contained' className='mt-4' onPress={() => {router.push('/(stack)/login')}} disabled={!checked}>Registrar</Button>
   
           <Divider></Divider>
   
           <View className='flex-row items-center justify-between'>
             <Button variant='facebook' className='px-7'>Facebook</Button>
             <Button variant='google' className='px-10'>Gmail</Button>
           </View>
   
   
         </View>
   
         <View className='flex-row items-center mt-4 justify-center'>
         <Text className='text-secondary-100 font-barlow-medium'>¿Ya tienes cuenta?</Text>
         <Button variant='text-only' textPos='center' onPress={() => {router.push('/(stack)/login')}}>Iniciar sesión</Button>
         </View>
       </>
     )
  
}

export default RegisterScreen