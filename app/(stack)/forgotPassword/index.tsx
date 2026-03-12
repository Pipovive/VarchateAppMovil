import Button from '@/components/shared/button';
import Input from '@/components/shared/input';
import { useTheme } from '@/src/context/ThemeContext';
import { useForgotPasswordViewModel } from '@/src/viewmodels/ForgotPasswordViewModel';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';

const CarruselScreen = () => {
  const { loading, error, success, sendResetEmail } = useForgotPasswordViewModel();
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const { isDark } = useTheme();

  const colors = {
    background: isDark ? '#111827' : '#F3F4F6',
    card: isDark ? '#1B1D23' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#111827',
    subtext: isDark ? '#D1D5DB' : '#6B7280',
    border: isDark ? '#374151' : '#E5E7EB',
  };

  const mostrarAlerta = (titulo: string, mensaje: string, onPress?: () => void) => {
    Alert.alert(titulo, mensaje, [{ text: 'Aceptar', onPress }]);
  };

  const handleSend = async () => {
    setLocalError("");

    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(email)) {
      setLocalError("Por favor ingresa un correo válido.");
      return;
    }

    try {
      await sendResetEmail(email);
      mostrarAlerta(
        'Correo enviado',
        'Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.',
        () => router.push('/(stack)/confirmed')
      );
    } catch (err: any) {
      setLocalError(err?.response?.data?.message || err.message || 'No se pudo enviar el correo');
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, backgroundColor: colors.background }}>

      {/* LOGO */}
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
        <Image
          style={{ width: 200, resizeMode: 'contain' }}
          source={require('../../../assets/images/logo2.png')}
        />
      </View>

      {/* IMAGEN */}
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
        <Image
          style={{ width: 280, height: 280, resizeMode: 'contain' }}
          source={require('../../../assets/images/olvidar-contraseña.png')}
        />
      </View>

      {/* CARD */}
      <View style={{
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 24,
        marginTop: 16,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: colors.border
      }}>
        <Text style={{
          fontFamily: 'Barlow-Bold',
          textAlign: 'center',
          marginBottom: 12,
          fontSize: 28,
          color: colors.text
        }}>
          ¿Olvidaste tu contraseña?
        </Text>
        <Text style={{
          fontFamily: 'Barlow-Medium',
          textAlign: 'center',
          fontSize: 16,
          color: colors.subtext,
          marginBottom: 16
        }}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Text>

        <Input
          isDark={isDark}
          value={email}
          onChangeText={setEmail}
          placeholder="Escribe tu correo"
          keyboardType="email-address"
          autoCapitalize='none'
          error={localError || error || ''}
          editable={!loading}
        />

        {success && (
          <View style={{
            backgroundColor: isDark ? '#064E3B' : '#D1FAE5',
            padding: 16,
            borderRadius: 8,
            marginTop: 8
          }}>
            <Text style={{
              fontFamily: 'Barlow-Medium',
              color: isDark ? '#6EE7B7' : '#065F46',
              textAlign: 'center'
            }}>
              ✓ Correo enviado exitosamente
            </Text>
          </View>
        )}
      </View>

      {/* BOTONES */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <View style={{ flex: 1, margin: 5, marginLeft: 6 }}>
          <Button
            className="h-14 justify-center"
            onPress={() => router.back()}
            disabled={loading}
          >
            Regresar
          </Button>
        </View>
        <View style={{ flex: 1, margin: 5, marginRight: 6 }}>
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