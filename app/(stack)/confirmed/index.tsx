import Button from '@/components/shared/button';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const CarruselScreen = () => {


  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      {/* LOGO */}
      <View className="justify-center items-center mt-6">
        <Image
          style={{ width: 200, resizeMode: 'contain' }}
          source={require('../../../assets/images/logo2.png')}
        />
      </View>

      {/* IMAGEN */}
      <View className="justify-center items-center mt-10">
        <Image
          style={{ width: 280, height: 280, resizeMode: 'contain' }}
          source={require('../../../assets/images/confirmed.png')}
        />
      </View>

      {/* TEXTO */}
      <View className="bg-white rounded-3xl p-6 mt-4 border border-secondary-100/10 mx-2">
        <Text className="font-barlow-bold text-center mb-3 text-3xl">
          Enlace de confirmación
        </Text>
        <Text className="text-secondary-100 font-barlow-medium text-center text-lg">
          Te enviamos un enlace a tu correo electrónico para restablecer tu contraseña. Revisa tu bandeja de entrada o la carpeta de spam.
        </Text>

        <Button onPress={router.back}>Regresar al inicio</Button>
         
      </View>

    
    </View>
  
)};

export default CarruselScreen;
