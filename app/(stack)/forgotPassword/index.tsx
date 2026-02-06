import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import { useForgotPasswordViewModel } from '@/src/viewmodels/ForgotPasswordViewModel';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';

const CarruselScreen = () => {
  const { loading, error, success, sendResetEmail } = useForgotPasswordViewModel();
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSend = async () => {
    // Limpiar errores previos
    setLocalError("");

    // Validación básica del correo
    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(email)) {
      setLocalError("Por favor ingresa un correo válido.");
      return;
    }

    try {
      await sendResetEmail(email);

      // Si fue exitoso, mostrar alerta y redirigir
      Alert.alert(
        'Correo enviado',
        'Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.',
        [
          {
            text: 'Entendido',
            onPress: () => router.push('/(stack)/confirmed')
          }
        ]
      );

    } catch (err: any) {
      setLocalError(err?.response?.data?.message || err.message || 'No se pudo enviar el correo');
    }
  };

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
          source={require('../../../assets/images/olvidar-contraseña.png')}
        />
      </View>

      {/* TEXTO */}
      <View className="bg-white rounded-3xl p-6 mt-4 border border-secondary-100/10 mx-2">
        <Text className="font-barlow-bold text-center mb-3 text-3xl">
          ¿Olvidaste tu contraseña?
        </Text>
        <Text className="text-secondary-100 font-barlow-medium text-center text-lg">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
        
        <Input
          className='m-2'
          value={email}
          onChangeText={setEmail}
          placeholder="Escribe tu correo"
          keyboardType="email-address"
          autoCapitalize='none'
          error={localError || error || ''}
          editable={!loading}
        />

        {/* MENSAJE DE ÉXITO */}
        {success && (
          <View className='bg-green-100 p-4 rounded-lg mt-2'>
            <Text className='font-barlow-medium text-green-800 text-center'>
              ✓ Correo enviado exitosamente
            </Text>
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        {/* BOTÓN REGRESAR */}
        <View style={{ flex: 1, marginLeft: 6, margin: 5 }}>
          <Button 
            className="h-14 justify-center color-secondary-100" 
            onPress={() => router.back()}
            disabled={loading}
          >
            Regresar
          </Button>
        </View>

        {/* BOTÓN CONTINUAR */}
        <View style={{ flex: 1, marginRight: 6, margin: 5 }}>
          <Button 
            className="h-14 justify-center" 
            onPress={handleSend}
            disabled={loading || !email}
          >
            {loading ? 'Enviando...' : 'Continuar'}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default CarruselScreen;