import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';

const CarruselScreen = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    // Limpiar mensaje previo
    setErrorMsg("");

    // Validación básica del correo
    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(email)) {
      setErrorMsg("Por favor ingresa un correo válido.");
      return;
    }

    try {
      setLoading(true);

      // ⛔ Aquí simulas el envío — reemplaza con tu fetch real
      const enviado = false; // <-- fuerza error para probar
      // const enviado = true; // <-- úsalo si quieres probar éxito

      if (!enviado) {
        throw new Error("No se pudo enviar el correo. Intenta de nuevo.");
      }

      // Si todo ok
      alert("Correo enviado correctamente");
      router.push('/login');

    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
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
        />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        {/* COLUMNA 2 */}
        <View style={{ flex: 1, marginLeft: 6, margin:5 }}>
          <Button className="h-14 justify-center color-secondary-100" onPress={() => router.back()}>Regresar</Button>
        </View>

        {/* COLUMNA 1 */}
        <View style={{ flex: 1, marginRight: 6, margin:5}}>
          <Button  className="h-14 justify-center" onPress={() => router.push('/(stack)/confirmed')}>Continuar</Button>
        </View>
      </View>

      {/* MENSAJE DE ERROR */}
      {errorMsg.length > 0 && (
        <Text className="text-red-500 text-center mt-2 m-4">
          {errorMsg}
        </Text>
      )}

      
    </View>
  );
};

export default CarruselScreen;
