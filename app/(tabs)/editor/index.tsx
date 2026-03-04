import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const EditorIndex = () => {
  const [lastOpened, setLastOpened] = useState<Date | null>(null);

  useEffect(() => {
    const cargarUltimaVez = async () => {
      const guardado = await AsyncStorage.getItem('editor_last_opened');
      if (guardado) setLastOpened(new Date(guardado));
    };
    cargarUltimaVez();
  }, []);


  const handlePress = () => {
    setLastOpened(new Date());
    router.push('/(tabs)/editor/code');
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F8FF" }}>
      <StatusBar style="light"  />
      {/* HEADER MODERNO */}
      <View style={{
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: "#0099FF",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
      }}>
        <Text style={{
          color: "#FFFFFF",
          fontSize: 22,
          fontWeight: "bold"
        }}>
          Editor de Código
        </Text>

        <Text style={{
          color: "#DBEAFE",
          marginTop: 6,
          fontSize: 14
        }}>
          Continúa donde lo dejaste 
        </Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingTop: 30
        }}
      >

        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: "#1F2937",
          marginBottom: 16
        }}>
          Archivos recientes
        </Text>

        {/* CARD PRINCIPAL */}
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={{
            backgroundColor: "#FFFFFF",
            padding: 18,
            borderRadius: 16,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 5,
            marginBottom: 16
          }}
        >

          {/* Icono */}
          <View style={{
            backgroundColor: "#FFF1ED",
            padding: 12,
            borderRadius: 12,
            marginRight: 16
          }}>
            <FontAwesome name="html5" size={28} color="#E44D26" />
          </View>

          {/* Información */}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#111827"
            }}>
              index.html
            </Text>

            <Text style={{
              fontSize: 13,
              color: "#6B7280",
              marginTop: 6
            }}>
              {lastOpened
                ? `Abierto el ${lastOpened.toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}`
                : "Nunca abierto"}
            </Text>
          </View>

          {/* Flecha */}
          <FontAwesome name="chevron-right" size={18} color="#9CA3AF" />

        </TouchableOpacity>

      </ScrollView>

      {/* BOTÓN FLOTANTE */}
      {/* <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "#0099FF",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8
        }}
      >
        <FontAwesome name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity> */}

    </View>
  );
};

export default EditorIndex;