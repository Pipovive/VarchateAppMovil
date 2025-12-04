import Button from '@/components/shared/button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';

const CarruselScreen = () => {

  // DATA DEL CARRUSEL
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

  // Animación
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Ejecutar animación cuando cambie la pantalla
  const startFade = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    startFade();
  }, [index]);

  // FUNCIONES DE NAVEGACIÓN
  const siguiente = () => {
    if (index < slides.length - 1) setIndex(index + 1);
  };

  const anterior = () => {
    if (index > 0) setIndex(index - 1);
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

      {/* CONTENIDO CON ANIMACIÓN */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1]
              })
            }
          ]
        }}
      >

        {/* IMAGEN DEL CARRUSEL */}
        <View className="justify-center items-center mt-10">
          <Image
            style={{
              width: 280,
              height: 280,
              resizeMode: 'contain',
            }}
            source={slides[index].image}
          />
        </View>

        {/* TARJETA DE TEXTO */}
        <View className="bg-white rounded-3xl p-6 mt-4 border border-secondary-100/10 mx-2">
          <Text className="font-barlow-bold text-center mb-3 text-3xl">
            {slides[index].title}
          </Text>
          <Text className="text-secondary-100 font-barlow-medium text-center text-lg">
            {slides[index].description}
          </Text>
          {index === slides.length -1 && (
            <Button onPress={() => router.push('/(stack)/login')} >
                  Iniciar a aprender
            </Button>
          )}
        </View>

      </Animated.View>

      {/* INDICADORES */}
      <View className="flex-row justify-center items-center mt-6 gap-2">
        {slides.map((_, i) => (
          <MaterialIcons
            key={i}
            name={i === index ? "radio-button-checked" : "radio-button-unchecked"}
            size={22}
            color="#4A90E2"
          />
        ))}
      </View>

      {/* BOTONES */}
      <View className="flex-row justify-between px-10 mt-8">
        <Pressable onPress={anterior} disabled={index === 0}>
          <MaterialIcons
            name="chevron-left"
            size={32}
            color={index === 0 ? "#ccc" : "#4A90E2"}
          />
        </Pressable>

        <Pressable onPress={siguiente} disabled={index === slides.length - 1}>
          <MaterialIcons
            name="chevron-right"
            size={32}
            color={index === slides.length - 1 ? "#ccc" : "#4A90E2"}
          />
        </Pressable>
      </View>

    </View>
  );
};

export default CarruselScreen;
