import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';

const ConfirmPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleConfirm = () => {
    setErrorMsg("");

    if (!password || !confirmPass) {
      setErrorMsg("Por favor completa ambos campos.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPass) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    // Si todo está bien
    router.push("/confirmed");
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
          source={require('../../../assets/images/gato_computador.png')}
        />
      </View>

      {/* TARJETA */}
      <View className="bg-white rounded-3xl p-6 pb-1 mt-4 border border-secondary-100/10 mx-2">
        <Text className="font-barlow-bold text-center mb-3 text-3xl">
          Crea una contraseña nueva
        </Text>
        <Text className="text-secondary-100 font-barlow-medium text-center text-sm mb-5">
          Crea una contraseña nueva de ocho caracteres como mínimo. Una contraseña segura tiene una combinación de letras, números y signos de puntuación
        </Text>

        {/* INPUTS */}
        <Input
          className="m-1"
          placeholder="Nueva contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Input
          className="m-1"
          placeholder="Confirmar contraseña"
          secureTextEntry
          value={confirmPass}
          onChangeText={setConfirmPass}
        />
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <View style={{ flex: 1, marginLeft: 6 }}>
          <Button className="h-14 justify-center" onPress={() => router.back()}>
            Regresar
          </Button>
        </View>

        <View style={{ flex: 1, marginRight: 6 }}>
          <Button className="h-14 justify-center" onPress={handleConfirm}>
            Confirmar
          </Button>
        </View>
      </View>

      {/* ERROR */}
      {errorMsg.length > 0 && (
        <Text className="text-red-500 text-center mt-2 m-4">
          {errorMsg}
        </Text>
      )}
    </View>
  );
};

export default ConfirmPasswordScreen;
