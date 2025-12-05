import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import { users } from '@/store/user.store';
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const UserEditScreen = () => {
    const {id} = useLocalSearchParams();
    const user = users.find((u) => u.id == id);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [validPassword, setValidPassword] = useState('');
    const [on, setOn] = useState(true);

  return (
<View className='flex-1 bg-primary-500 rounded-3xl p-4 my-10 border border-secondary-100/10 mx-3'>

     <View className="flex-row justify-between">
        <TouchableOpacity onPress={() => {router.push('/(tabs)/profile')}}>
          <AntDesign name="close" size={27} color="#D64545" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {router.push('/(tabs)/profile')}}>
          <Feather name="check" size={29} color="#276CDC" />
        </TouchableOpacity>
      </View>

      <View className='items-center justify-center'>
        <Image
        style={{width: 160, resizeMode: 'contain', marginTop: 6, borderRadius: 50, height: 160}}
        source={require('../../../../assets/images/gato-perfil.png')}></Image>

        <View className='flex-row justify-between w-1/3 mt-3/4'>
          <TouchableOpacity onPress={() => {}}>
          <FontAwesome5 name="trash-alt" size={27} color="#D64545" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <FontAwesome5 name="edit" size={27} color="#000" />
        </TouchableOpacity>
        </View>
      </View>

    <ScrollView className='flex-1 mt-2'>
      <View className='mt-11'>


      <Input className='font-barlow-medium' label='Nombre' placeholder='Nombre' value={nombre} error={!nombre ? 'El nombre es obligatorio ': ''}
                 onChangeText={setNombre}
           />
   
           <Input className='font-barlow-medium' label='Correo' placeholder='Correo' value={email} error={!email ? 'El correo es obligatorio ': ''}
                 keyboardType='email-address'
                 autoCapitalize='none'
                 onChangeText={setEmail}
           />
           <Input className='font-barlow-medium' label='Contraseña' placeholder='Contraseña ' value={password} error={password.length > 0 && password.length < 8 ? 'La contraseña debe tener mínimo 8 caracteres': ''}
                 secureTextEntry
                 onChangeText={setPassword}
           />
      </View>
    
      <Text className='font-barlow-medium mt-5 text-base'>Personalizar tema</Text>

     <View className='justify-between w-full flex-row mt-6'>
        <MaterialIcons name='dark-mode' size={25} />
        <Button variant='toggle' value={on} onPress={() => setOn(!on)}></Button>
        <MaterialIcons name='wb-sunny' size={25} />    
    </View>

    <Text className='font-barlow-medium mt-12 text-base'>Conoce más sobre nosotros</Text>

    <View className='bg-quaternary items-center rounded-md border border-secondary-100/10 flex-row mt-2'>
        <Ionicons name='document-text-outline' size={23} className='ml-2' />
        <Button variant='text-only' textColor='normal' >Terminos y Condiciones</Button>
    </View>

    <View className='bg-quaternary items-center rounded-md border border-secondary-100/10 flex-row mt-1'>
        <Feather name='lock' size={21} className='ml-2' />
        <Button variant='text-only' textColor='normal' >Politica de Privacidad</Button>
    </View>

    <Text className='font-barlow-medium mt-8 text-base'>Gestionar cuenta</Text>

    <View className='bg-quaternary items-center rounded-md  flex-row mt-1'>
        <FontAwesome5 name='trash-alt' size={19} className='ml-2' color='#D64545' />
        <Button variant='text-only' textColor='normal' >Eliminar cuenta</Button>
    </View>

    <Button color='tertiary' className='mt-10'>Cerrar sesión</Button>

  </ScrollView>
 </View>
  )
}

export default UserEditScreen