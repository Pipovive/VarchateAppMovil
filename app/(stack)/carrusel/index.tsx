import Button from '@/components/shared/button';
import { useTheme } from '@/src/context/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';

const CarruselScreen = () => {
  const { isDark } = useTheme();

  const colors = {
    background: isDark ? '#343734' : '#F3F4F6',
    card: isDark ? '#1B1D23' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#111827',
    subtext: isDark ? '#D1D5DB' : '#6B7280',
    border: isDark ? '#555555' : '#E5E7EB',
  };

  const slides = [
    {
      image: require('../../../assets/images/carrusel1.png'),
      title: 'Aprende a programar sin aburrirte',
      description: 'Varchate convierte el código en un juego divertido y fácil de entender.',
    },
    {
      image: require('../../../assets/images/carrusel1.png'),
      title: 'Practica con retos interactivos',
      description: 'Completa desafíos y gana experiencia mientras avanzas.',
    },
    {
      image: require('../../../assets/images/carrusel1.png'),
      title: 'Avanza a tu ritmo',
      description: 'Aprende lo que quieras, cuando quieras, sin presión.',
    }
  ];

  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const startFade = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => { startFade(); }, [index]);

  const siguiente = () => {
    if (index < slides.length - 1) setIndex(prev => prev + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(prev => prev - 1);
  };

  const esUltimo = index === slides.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>

      {/* ZONA TAP IZQUIERDA */}
      <Pressable
        onPress={anterior}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%', zIndex: 10 }}
      />

      {/* ZONA TAP DERECHA */}
      <Pressable
        onPress={siguiente}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '30%', zIndex: 10 }}
      />

      <View style={{ flex: 1, paddingHorizontal: 16 }}>

        {/* LOGO */}
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
          <Image style={{ width: 200, resizeMode: 'contain' }} source={require('../../../assets/images/logo2.png')} />
        </View>

        {/* CONTENIDO ANIMADO */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) }] }}>

          {/* IMAGEN */}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
            <Image style={{ width: 280, height: 280, resizeMode: 'contain' }} source={slides[index].image} />
          </View>

          {/* TARJETA */}
          <View style={{
            backgroundColor: colors.card,
            borderRadius: 24,
            padding: 24,
            marginTop: 16,
            marginHorizontal: 8,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{ fontFamily: 'Barlow-Bold', textAlign: 'center', marginBottom: 12, fontSize: 26, color: colors.text }}>
              {slides[index].title}
            </Text>
            <Text style={{ fontFamily: 'Barlow-Medium', textAlign: 'center', fontSize: 16, color: colors.subtext }}>
              {slides[index].description}
            </Text>
            {esUltimo && (
              <Button onPress={() => router.push('/(stack)/login')} className='mt-4'>
                Iniciar a aprender
              </Button>
            )}
          </View>
        </Animated.View>

        {/* INDICADORES */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 8 }}>
          {slides.map((_, i) => (
            <MaterialIcons
              key={i}
              name={i === index ? "radio-button-checked" : "radio-button-unchecked"}
              size={22}
              color="#4A90E2"
            />
          ))}
        </View>

        {/* FLECHAS */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 40, marginTop: 16 }}>
          <Pressable onPress={anterior} disabled={index === 0}>
            <MaterialIcons name="chevron-left" size={36} color={index === 0 ? (isDark ? '#555' : '#ccc') : '#4A90E2'} />
          </Pressable>
          <Pressable onPress={siguiente} disabled={esUltimo}>
            <MaterialIcons name="chevron-right" size={36} color={esUltimo ? (isDark ? '#555' : '#ccc') : '#4A90E2'} />
          </Pressable>
        </View>

      </View>
    </View>
  );
};

export default CarruselScreen;