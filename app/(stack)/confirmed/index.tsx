import Button from '@/components/shared/button';
import { useTheme } from '@/src/context/ThemeContext';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

const CarruselScreen = () => {
  const { isDark } = useTheme();

  const colors = {
    background: isDark ? '#111827' : '#F3F4F6',
    card:       isDark ? '#1B1D23' : '#FFFFFF',
    text:       isDark ? '#FFFFFF' : '#111827',
    subtext:    isDark ? '#D1D5DB' : '#6B7280',
    border:     isDark ? '#374151' : '#E5E7EB',
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 }}>

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
          source={require('../../../assets/images/confirmed.png')}
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
        borderColor: colors.border,
        alignItems: 'center',
      }}>
        {/* Ícono de éxito */}
        <View style={{
          width: 64, height: 64,
          borderRadius: 32,
          backgroundColor: isDark ? '#064E3B' : '#D1FAE5',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}>
          <Text style={{ fontSize: 32 }}>✅</Text>
        </View>

        <Text style={{
          fontFamily: 'Barlow-Bold',
          textAlign: 'center',
          marginBottom: 12,
          fontSize: 26,
          color: colors.text,
        }}>
          Enlace de confirmación
        </Text>

        <Text style={{
          fontFamily: 'Barlow-Medium',
          textAlign: 'center',
          fontSize: 16,
          color: colors.subtext,
          lineHeight: 24,
          marginBottom: 24,
        }}>
          Te enviamos un enlace a tu correo electrónico para restablecer tu contraseña. Revisa tu bandeja de entrada o la carpeta de spam.
        </Text>

        <Button onPress={() => router.back()}>
          Regresar al inicio
        </Button>
      </View>

    </View>
  );
};

export default CarruselScreen;