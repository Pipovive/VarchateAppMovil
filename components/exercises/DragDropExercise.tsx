import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Opcion {
  id: number;
  texto: string;
  orden: number;
  pareja_arrastre: string | null;
}

interface DragDropExerciseProps {
  opciones: Opcion[];
  onSubmit: (parejas: Array<{ id_opcion: number; respuesta: string }>) => void;
  disabled: boolean;
}

export const DragDropExercise = ({ opciones, onSubmit, disabled }: DragDropExerciseProps) => {
  // Estado: { [opcionId]: "respuesta_seleccionada" }
  const [parejas, setParejas] = useState<Record<number, string>>({});

  // Extraer todas las respuestas únicas de pareja_arrastre
  const respuestasDisponibles = Array.from(
    new Set(opciones.map(o => o.pareja_arrastre).filter(Boolean))
  ) as string[];

  const handleSelectRespuesta = (opcionId: number, respuesta: string) => {
    if (disabled) return;

    setParejas(prev => ({
      ...prev,
      [opcionId]: respuesta
    }));
  };

  const handleSubmitParejas = () => {
    // Convertir a formato esperado por el backend
    const parejasArray = opciones.map(opcion => ({
      id_opcion: opcion.id,
      respuesta: parejas[opcion.id] || ''
    }));

    onSubmit(parejasArray);
  };

  const allPaired = opciones.every(opcion => parejas[opcion.id]);

  return (
    <View>
      <Text style={{
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
        fontFamily: 'Barlow-Medium'
      }}>
        Relaciona cada elemento con su pareja correcta:
      </Text>

      {/* Lista de opciones con selector */}
      {opciones.map((opcion) => (
        <View
          key={opcion.id}
          style={{
            backgroundColor: '#FFFFFF',
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            borderWidth: 2,
            borderColor: parejas[opcion.id] ? '#0099FF' : '#E5E7EB'
          }}
        >
          {/* Elemento izquierdo (fijo) */}
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: 8,
            fontFamily: 'Barlow-Bold'
          }}>
            {opcion.texto}
          </Text>

          {/* Selector de respuesta */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {respuestasDisponibles.map((respuesta, index) => {
              const isSelected = parejas[opcion.id] === respuesta;
              
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectRespuesta(opcion.id, respuesta)}
                  disabled={disabled}
                  style={{
                    backgroundColor: isSelected ? '#DBEAFE' : '#F3F4F6',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: isSelected ? '#0099FF' : 'transparent',
                    opacity: disabled ? 0.6 : 1
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    color: isSelected ? '#1E40AF' : '#6B7280',
                    fontFamily: 'Barlow-Medium'
                  }}>
                    {respuesta}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ))}

      {/* Botón enviar (si no está disabled) */}
      {!disabled && (
        <TouchableOpacity
          onPress={handleSubmitParejas}
          disabled={!allPaired}
          style={{
            backgroundColor: allPaired ? '#0099FF' : '#9CA3AF',
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 16
          }}
        >
          <Text style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: 'Barlow-Bold'
          }}>
            Verificar Respuesta
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};