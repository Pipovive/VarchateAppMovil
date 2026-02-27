// components/exercises/ExerciseButton.tsx
import { useExerciseViewModel } from '@/src/viewmodels/ExcerciseViewModel';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { DragDropExercise } from '../exercises/DragDropExercise';

interface ExerciseButtonProps {
    moduloId: number;
    leccionId: number;
    cantidadEjercicios: number;
}

export const ExerciseButton = ({
    moduloId,
    leccionId,
    cantidadEjercicios
}: ExerciseButtonProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const {
        exerciseData,
        currentAttempt,
        loading,
        submitting,
        error,
        fetchExercises,
        submitAnswer,
        submitDragDrop, // ✅ Agregar
        clearCurrentAttempt,
        reset,
    } = useExerciseViewModel();

    // ✅ Debug - Log cuando cambia el índice
    useEffect(() => {
        if (exerciseData) {
            console.log('🔵 Índice actual:', currentExerciseIndex);
            console.log('🔵 Ejercicio actual:', exerciseData.ejercicios[currentExerciseIndex]);
        }
    }, [currentExerciseIndex, exerciseData]);

    const handleOpenModal = async () => {
        setModalVisible(true);
        setCurrentExerciseIndex(0);
        setSelectedOption(null);
        clearCurrentAttempt();

        if (!exerciseData) {
            await fetchExercises(moduloId, leccionId);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setCurrentExerciseIndex(0);
        setSelectedOption(null);
        clearCurrentAttempt();
        reset(); // ✅ Limpiar todo al cerrar
    };

    const handleSubmit = async () => {
        if (selectedOption === null || !exerciseData) {
            console.log('❌ No hay opción seleccionada o datos de ejercicio');
            return;
        }

        const currentExercise = exerciseData.ejercicios[currentExerciseIndex];
        
        if (!currentExercise) {
            console.log("❌ currentExercise es undefined en índice:", currentExerciseIndex);
            console.log("❌ Total ejercicios:", exerciseData.ejercicios.length);
            return;
        }

        console.log('📤 Enviando respuesta:', {
            ejercicioId: currentExercise.id,
            opcionId: selectedOption,
            moduloId,
            leccionId
        });

        try {
            await submitAnswer(moduloId, leccionId, currentExercise.id, selectedOption);
        } catch (err) {
            console.error('❌ Error al enviar respuesta:', err);
        }
    };

    // ✅ NUEVO: Handler para arrastrar y soltar
    const handleDragDropSubmit = async (parejas: Array<{ id_opcion: number; respuesta: string }>) => {
        if (!exerciseData) return;

        const currentExercise = exerciseData.ejercicios[currentExerciseIndex];
        
        if (!currentExercise) {
            console.log("❌ currentExercise es undefined");
            return;
        }

        console.log('📤 Enviando parejas:', {
            ejercicioId: currentExercise.id,
            parejas,
            moduloId,
            leccionId
        });

        try {
            await submitDragDrop(moduloId, leccionId, currentExercise.id, parejas);
        } catch (err) {
            console.error('❌ Error al enviar parejas:', err);
        }
    };

    const handleNext = () => {
        if (!exerciseData) return;

        console.log('➡️ Siguiente ejercicio. Índice actual:', currentExerciseIndex);
        console.log('➡️ Total ejercicios:', exerciseData.ejercicios.length);

        if (currentExerciseIndex < exerciseData.ejercicios.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setSelectedOption(null);
            clearCurrentAttempt();
        } else {
            // Completado
            handleCloseModal();
            alert('¡Felicitaciones! Has completado todos los ejercicios. 🎉');
        }
    };

    // ✅ Obtener ejercicio actual de forma segura
    const currentExercise = exerciseData?.ejercicios[currentExerciseIndex];

    return (
        <>
            {/* BOTÓN PARA ABRIR EJERCICIOS */}
            <TouchableOpacity
                onPress={handleOpenModal}
                style={{
                    backgroundColor: '#FEF3C7',
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 24,
                    borderWidth: 2,
                    borderColor: '#F59E0B'
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        backgroundColor: '#F59E0B',
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12
                    }}>
                        <Ionicons name="create-outline" size={24} color="#FFFFFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#92400E',
                            fontFamily: 'Barlow-Bold'
                        }}>
                            Practicar Ejercicios
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            color: '#92400E',
                            fontFamily: 'Barlow-Medium'
                        }}>
                            {cantidadEjercicios} ejercicio{cantidadEjercicios !== 1 ? 's' : ''} disponible{cantidadEjercicios !== 1 ? 's' : ''}
                        </Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#92400E" />
            </TouchableOpacity>

            {/* MODAL DE EJERCICIOS */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCloseModal}
            >
                
                <View style={{ flex: 1, backgroundColor: '#EAF4FF', paddingBottom:80  }}>
                    {/* HEADER */}
                    <View style={{
                        backgroundColor: '#0099FF',
                        paddingTop: 50,
                        paddingBottom: 20,
                        paddingHorizontal: 20
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#FFFFFF',
                                fontFamily: 'Barlow-Bold'
                            }}>
                                Ejercicios
                            </Text>
                            <TouchableOpacity onPress={handleCloseModal}>
                                <Ionicons name="close" size={28} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {exerciseData && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 12,
                                gap: 8
                            }}>
                                {exerciseData.ejercicios.map((_, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            flex: 1,
                                            height: 4,
                                            backgroundColor: index <= currentExerciseIndex ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                                            borderRadius: 2
                                        }}
                                    />
                                ))}
                            </View>
                        )}
                    </View>

                    {/* CONTENIDO */}
                    <ScrollView 
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            padding: 20,
                            paddingBottom: 100
                        }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {loading ? (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                                <ActivityIndicator size="large" color="#0099FF" />
                                <Text style={{ marginTop: 12, color: '#6B7280' }}>Cargando ejercicios...</Text>
                            </View>
                        ) : error ? (
                            <View style={{ padding: 20, backgroundColor: '#FEE2E2', borderRadius: 8 }}>
                                <Text style={{ color: '#991B1B', textAlign: 'center' }}>{error}</Text>
                            </View>
                        ) : currentExercise ? (
                            <>
                                {/* PREGUNTA */}
                                <View style={{
                                    backgroundColor: '#FFFFFF',
                                    padding: 20,
                                    borderRadius: 12,
                                    marginBottom: 20
                                }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#6B7280',
                                        marginBottom: 8,
                                        fontFamily: 'Barlow-Medium'
                                    }}>
                                        Pregunta {currentExerciseIndex + 1} de {exerciseData?.ejercicios.length}
                                    </Text>
                                    <Text style={{
                                        fontSize: 18,
                                        color: '#1F2937',
                                        fontWeight: 'bold',
                                        fontFamily: 'Barlow-Bold',
                                        lineHeight: 26
                                    }}>
                                        {currentExercise.pregunta}
                                    </Text>
                                    {currentExercise.instrucciones && (
                                        <Text style={{
                                            fontSize: 14,
                                            color: '#6B7280',
                                            marginTop: 8,
                                            fontFamily: 'Barlow-Regular'
                                        }}>
                                            {currentExercise.instrucciones}
                                        </Text>
                                    )}
                                </View>

                                {/* OPCIONES O DRAG DROP */}
                                {currentExercise.tipo === 'arrastrar_soltar' ? (
                                    // ✅ Componente de arrastrar y soltar
                                    <DragDropExercise
                                        opciones={currentExercise.opciones}
                                        onSubmit={handleDragDropSubmit}
                                        disabled={!!currentAttempt}
                                    />
                                ) : (
                                    // Opciones normales (selección múltiple / verdadero-falso)
                                    currentExercise.opciones.map((opcion) => (
                                        <TouchableOpacity
                                            key={opcion.id}
                                            onPress={() => !currentAttempt && setSelectedOption(opcion.id)}
                                            disabled={!!currentAttempt}
                                            style={{
                                                backgroundColor:
                                                    currentAttempt && currentAttempt.opcion_correcta.id === opcion.id
                                                        ? '#D1FAE5'
                                                        : selectedOption === opcion.id
                                                            ? '#DBEAFE'
                                                            : '#FFFFFF',
                                                padding: 16,
                                                borderRadius: 12,
                                                marginBottom: 12,
                                                borderWidth: 2,
                                                borderColor:
                                                    currentAttempt && currentAttempt.opcion_correcta.id === opcion.id
                                                        ? '#10B981'
                                                        : selectedOption === opcion.id
                                                            ? '#0099FF'
                                                            : '#E5E7EB'
                                            }}
                                        >
                                            <Text style={{
                                                fontSize: 16,
                                                color: '#1F2937',
                                                fontFamily: 'Barlow-Medium'
                                            }}>
                                                {opcion.texto}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                )}

                                {/* FEEDBACK */}
                                {currentAttempt && (
                                    <View style={{
                                        backgroundColor: currentAttempt.es_correcta ? '#D1FAE5' : '#FEE2E2',
                                        padding: 16,
                                        borderRadius: 12,
                                        marginTop: 12
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: currentAttempt.es_correcta ? '#065F46' : '#991B1B',
                                            marginBottom: 8,
                                            fontFamily: 'Barlow-Bold'
                                        }}>
                                            {currentAttempt.es_correcta ? '✅ ¡Correcto!' : '❌ Incorrecto'}
                                        </Text>
                                        <Text style={{
                                            fontSize: 14,
                                            color: currentAttempt.es_correcta ? '#065F46' : '#991B1B',
                                            fontFamily: 'Barlow-Regular'
                                        }}>
                                            {currentAttempt.feedback}
                                        </Text>
                                        {currentAttempt.explicacion && (
                                            <Text style={{
                                                fontSize: 14,
                                                color: currentAttempt.es_correcta ? '#065F46' : '#991B1B',
                                                marginTop: 8,
                                                fontFamily: 'Barlow-Regular'
                                            }}>
                                                {currentAttempt.explicacion}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </>
                        ) : null}
                    </ScrollView>

                    {/* FOOTER */}
                    <View style={{
                        backgroundColor: '#FFFFFF',
                        padding: 20,
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB'
                    }}>
                        {!currentAttempt ? (
                            // ✅ Solo mostrar botón Verificar si NO es drag-drop (el drag-drop tiene su propio botón)
                            currentExercise?.tipo !== 'arrastrar_soltar' && (
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    disabled={selectedOption === null || submitting}
                                    style={{
                                        backgroundColor: selectedOption === null ? '#9CA3AF' : '#0099FF',
                                        paddingVertical: 16,
                                        borderRadius: 12,
                                        alignItems: 'center'
                                    }}
                                >
                                    {submitting ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={{
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            fontFamily: 'Barlow-Bold'
                                        }}>
                                            Verificar Respuesta
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )
                        ) : (
                            <TouchableOpacity
                                onPress={handleNext}
                                style={{
                                    backgroundColor: '#10B981',
                                    paddingVertical: 16,
                                    borderRadius: 12,
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    fontFamily: 'Barlow-Bold'
                                }}>
                                    {currentExerciseIndex < (exerciseData?.ejercicios.length || 0) - 1
                                        ? 'Siguiente Ejercicio'
                                        : 'Finalizar'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
};