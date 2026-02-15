import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const EditorIndex = () => {
  // ✅ useState DENTRO del componente
  const [lastOpened, setLastOpened] = useState<Date | null>(null);

  const handlePress = () => {
    setLastOpened(new Date());
    router.push('/(tabs)/editor/code');
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#EAF4FF" }}>
      {/* Header */}
      <View style={{ 
        paddingHorizontal: 16, 
        paddingVertical: 12,
        paddingTop: 50, // ← Espaciado superior manual
        backgroundColor: "#0099FF" 
      }}>
        <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
          Inicio - Editor de código
        </Text>
      </View>

      {/* Contenido */}
      <ScrollView 
        style={{ 
          flex: 1, 
          backgroundColor: "#FFFFFF",
          margin: 16,
          borderRadius: 8,
          padding: 16
        }}
      >
        <Text style={{ 
          fontSize: 20, 
          fontWeight: 'bold', 
          color: "#1F2937",
          marginBottom: 16
        }}>
          Códigos recientes
        </Text>

        {/* Item de código */}
        <TouchableOpacity
          onPress={handlePress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB'
          }}
        >
          <View style={{ marginRight: 12 }}>
            <FontAwesome name="html5" size={32} color="#E44D26" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: "#1F2937" 
            }}>
              Index.html
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: "#6B7280",
              marginTop: 4
            }}>
              Última vez abierto: {lastOpened
                ? lastOpened.toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Nunca'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Botón flotante */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: '#3B82F6',
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        activeOpacity={0.8}
        onPress={() => {
          // Aquí va la lógica para crear nuevo archivo
          console.log("Crear nuevo archivo");
        }}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default EditorIndex;