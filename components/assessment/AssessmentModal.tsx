import { useAssessmentViewModel } from '@/src/viewmodels/AssessmentViewModel';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AssessmentModalProps {
    moduloId: number;
    moduloTitulo: string;
}

export const AssessmentModal = ({ moduloId, moduloTitulo }: AssessmentModalProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const {
        intentoActual,
        preguntaActualIndex,
        resultadoFinal,
        estadoBoton,
        loading,
        submitting,
        tiempoRestante,
        loadAssessment,
        saveAnswer,
        saveDragDropAnswer,
        finishAssessment,
        goToNextQuestion,
        goToPreviousQuestion,
        getPreguntaActual,
        getProgress,
        reset,
        setTiempoRestante,
    } = useAssessmentViewModel();

    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // ─── Temporizador ────────────────────────────────────────────────────────
    // Cambiar el useEffect a esto:
    useEffect(() => {
        if (!intentoActual || showResults || tiempoRestante <= 0) return;

        const interval = setInterval(() => {
            setTiempoRestante(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [intentoActual?.intento_id]);

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        if (tiempoRestante === 0 && intentoActual && !showResults) {
            handleFinish();
        }
    }, [tiempoRestante]);

    // ─── Abrir modal ─────────────────────────────────────────────────────────
    const handleOpenModal = async () => {
        // No hacer reset() aquí — causa el estado inconsistente
        setShowResults(false);
        setSelectedOption(null);
        setModalVisible(true);

        try {
            const resultado = await loadAssessment(moduloId);

            if (resultado === 'reanudado') {
                setTimeout(() => {
                    Alert.alert(
                        '▶️ Evaluación en progreso',
                        'Tienes una evaluación sin finalizar. Continuamos desde donde la dejaste.',
                        [{ text: 'Continuar', style: 'default' }]
                    );
                }, 500);
            }
        } catch (err: any) {
            console.log('ERROR EN handleOpenModal:', err?.message, err?._tipo, err?.response?.data);
            const mensaje = err?.message || 'No se pudo cargar la evaluación';
            const esInformativo = err?._tipo === 'informativo';
            setModalVisible(false);
            Alert.alert(esInformativo ? 'ℹ️ Evaluación' : 'Error', mensaje);
        }
    };

    // ─── Cerrar modal ────────────────────────────────────────────────────────
    const handleCloseModal = () => {
        stopTimer();

        if (intentoActual && !showResults) {
            Alert.alert(
                '¿Salir de la evaluación?',
                'Tu progreso se guardará. Podrás continuar después.',
                [
                    { text: 'Quedarme', style: 'cancel' },
                    {
                        text: 'Salir',
                        style: 'destructive',
                        onPress: () => {
                            reset();
                            setSelectedOption(null);
                            setShowResults(false);
                            setModalVisible(false);
                        }
                    }
                ]
            );
        } else {
            reset();
            setSelectedOption(null);
            setShowResults(false);
            setModalVisible(false);
        }
    };

    // ─── Responder pregunta ───────────────────────────────────────────────────
    const handleSubmitAnswer = async () => {
        if (!selectedOption || !intentoActual) return;

        const preguntaActual = getPreguntaActual();
        if (!preguntaActual) return;

        try {
            await saveAnswer(moduloId, preguntaActual.id, selectedOption);

            if (preguntaActualIndex < intentoActual.preguntas.length - 1) {
                goToNextQuestion();
                setSelectedOption(null);
            } else {
                Alert.alert(
                    'Última pregunta',
                    '¿Deseas finalizar la evaluación?',
                    [
                        { text: 'Revisar', style: 'cancel' },
                        { text: 'Finalizar', onPress: handleFinish }
                    ]
                );
            }
        } catch {
            Alert.alert('Error', 'No se pudo guardar la respuesta. Intenta de nuevo.');
        }
    };

    const handleDragDropSubmit = async (parejas: Array<{ id_opcion: number; respuesta: string }>) => {
        if (!intentoActual) return;

        const preguntaActual = getPreguntaActual();
        if (!preguntaActual) return;

        const parejasFormateadas = parejas.map(p => ({
            id_opcion: p.id_opcion,
            pareja: p.respuesta
        }));

        try {
            await saveDragDropAnswer(moduloId, preguntaActual.id, parejasFormateadas);

            if (preguntaActualIndex < intentoActual.preguntas.length - 1) {
                goToNextQuestion();
            } else {
                Alert.alert(
                    'Última pregunta',
                    '¿Deseas finalizar la evaluación?',
                    [
                        { text: 'Revisar', style: 'cancel' },
                        { text: 'Finalizar', onPress: handleFinish }
                    ]
                );
            }
        } catch {
            Alert.alert('Error', 'No se pudo guardar la respuesta. Intenta de nuevo.');
        }
    };

    // ─── Finalizar evaluación ─────────────────────────────────────────────────
    const handleFinish = async () => {
        stopTimer();

        try {
            await finishAssessment(moduloId);
            setShowResults(true);
        } catch {
            Alert.alert('Error', 'No se pudo finalizar la evaluación. Intenta de nuevo.');
        }
    };

    // ─── Helpers ──────────────────────────────────────────────────────────────
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (tiempoRestante <= 60) return '#EF4444';   // rojo: último minuto
        if (tiempoRestante <= 180) return '#F59E0B';  // amarillo: últimos 3 min
        return '#FFFFFF';
    };

    const preguntaActual = getPreguntaActual();
    const progress = getProgress();
    console.log('PREGUNTA ACTUAL:', JSON.stringify(getPreguntaActual()));
    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* BOTÓN DE ENTRADA */}
            <TouchableOpacity
                onPress={handleOpenModal}
                disabled={loading}
                style={{
                    backgroundColor: '#10B981',
                    paddingVertical: 20,
                    paddingHorizontal: 24,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                    opacity: loading ? 0.7 : 1,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{
                        width: 48,
                        height: 48,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                    }}>
                        {loading
                            ? <ActivityIndicator size="small" color="#10B981" />
                            : <Ionicons name="trophy" size={28} color="#10B981" />
                        }
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Barlow-Bold' }}>
                            Evaluación Final
                        </Text>
                        <Text style={{ fontSize: 14, color: '#D1FAE5', fontFamily: 'Barlow-Medium' }}>
                            {moduloTitulo}
                        </Text>
                    </View>
                </View>
                <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* MODAL */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={handleCloseModal}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: '#EAF4FF' }} edges={['top']}>

                    {/* LOADING INICIAL */}
                    {loading && !intentoActual ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#10B981" />
                            <Text style={{ marginTop: 16, color: '#6B7280', fontFamily: 'Barlow-Medium' }}>
                                Cargando evaluación...
                            </Text>
                        </View>

                    ) : showResults && resultadoFinal ? (
                        /* ── PANTALLA DE RESULTADOS ── */
                        <View style={{ flex: 1 }}>
                            <View style={{
                                backgroundColor: resultadoFinal.aprobado ? '#10B981' : '#EF4444',
                                paddingVertical: 24,
                                paddingHorizontal: 20,
                            }}>
                                <TouchableOpacity onPress={handleCloseModal} style={{ alignSelf: 'flex-end' }}>
                                    <Ionicons name="close" size={28} color="#FFFFFF" />
                                </TouchableOpacity>
                                <Text style={{
                                    fontSize: 32,
                                    fontWeight: 'bold',
                                    color: '#FFFFFF',
                                    textAlign: 'center',
                                    fontFamily: 'Barlow-Bold',
                                    marginTop: 16,
                                }}>
                                    {resultadoFinal.aprobado ? '🎉 ¡Aprobado!' : '😔 No Aprobado'}
                                </Text>
                            </View>

                            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                                {/* Puntaje principal */}
                                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 64, fontWeight: 'bold', color: resultadoFinal.aprobado ? '#10B981' : '#EF4444' }}>
                                        {resultadoFinal.porcentaje_obtenido}%
                                    </Text>
                                    <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 8 }}>
                                        Puntaje mínimo: {resultadoFinal.puntaje_minimo}%
                                    </Text>
                                </View>

                                {/* Detalles */}
                                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, fontFamily: 'Barlow-Bold' }}>
                                        Detalles
                                    </Text>
                                    {[
                                        { label: 'Correctas', value: resultadoFinal.preguntas_correctas, color: '#10B981' },
                                        { label: 'Incorrectas', value: resultadoFinal.preguntas_incorrectas, color: '#EF4444' },
                                        { label: 'Tiempo utilizado', value: `${resultadoFinal.tiempo_utilizado_minutos.toFixed(1)} min`, color: '#374151' },
                                    ].map(item => (
                                        <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <Text style={{ color: '#6B7280', fontFamily: 'Barlow-Regular' }}>{item.label}</Text>
                                            <Text style={{ fontWeight: 'bold', color: item.color, fontFamily: 'Barlow-Bold' }}>{item.value}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Mensaje */}
                                <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                                    <Text style={{ fontSize: 16, color: '#374151', lineHeight: 24, fontFamily: 'Barlow-Regular' }}>
                                        {resultadoFinal.mensaje}
                                    </Text>
                                </View>

                                {/* Certificación */}
                                {resultadoFinal.certificacion && (
                                    <View style={{
                                        backgroundColor: resultadoFinal.certificacion.disponible ? '#D1FAE5' : '#FEF3C7',
                                        borderRadius: 16,
                                        padding: 20,
                                    }}>
                                        <Text style={{ fontSize: 16, color: '#374151', fontWeight: 'bold', marginBottom: 8, fontFamily: 'Barlow-Bold' }}>
                                            🎓 Certificación
                                        </Text>
                                        <Text style={{ fontSize: 14, color: '#374151', fontFamily: 'Barlow-Regular' }}>
                                            {resultadoFinal.certificacion.mensaje}
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>

                            <View style={{ padding: 20, backgroundColor: '#FFFFFF' }}>
                                <TouchableOpacity
                                    onPress={handleCloseModal}
                                    style={{ backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 12, alignItems: 'center' }}
                                >
                                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', fontFamily: 'Barlow-Bold' }}>
                                        Finalizar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    ) : intentoActual && preguntaActual ? (
                        /* ── PANTALLA DE PREGUNTAS ── */
                        <View style={{ flex: 1 }}>
                            {/* Header */}
                            <View style={{ backgroundColor: '#10B981', paddingBottom: 20, paddingHorizontal: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Barlow-Bold' }}>
                                        Evaluación
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Ionicons name="time" size={20} color={getTimerColor()} />
                                            <Text style={{ color: getTimerColor(), marginLeft: 4, fontWeight: 'bold', fontFamily: 'Barlow-Bold' }}>
                                                {formatTime(tiempoRestante)}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={handleCloseModal}>
                                            <Ionicons name="close" size={28} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Barra de progreso */}
                                <View style={{ marginTop: 12, backgroundColor: 'rgba(255,255,255,0.3)', height: 8, borderRadius: 4 }}>
                                    <View style={{
                                        width: `${progress.percentage}%`,
                                        height: '100%',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 4,
                                    }} />
                                </View>
                                <Text style={{ color: '#FFFFFF', marginTop: 4, fontSize: 12, fontFamily: 'Barlow-Regular' }}>
                                    {progress.answered} de {progress.total} preguntas respondidas
                                </Text>
                            </View>

                            {/* Preguntas */}
                            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
                                <View style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 20 }}>
                                    <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8, fontFamily: 'Barlow-Regular' }}>
                                        Pregunta {preguntaActualIndex + 1} de {intentoActual.preguntas.length} · {preguntaActual.puntos} pts
                                    </Text>
                                    <Text style={{ fontSize: 18, color: '#1F2937', fontWeight: 'bold', lineHeight: 26, fontFamily: 'Barlow-Bold' }}>
                                        {preguntaActual.pregunta}
                                    </Text>
                                    {preguntaActual.instrucciones ? (
                                        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8, fontFamily: 'Barlow-Regular' }}>
                                            {preguntaActual.instrucciones}
                                        </Text>
                                    ) : null}
                                </View>

                                {preguntaActual.tipo === 'arrastrar_soltar' ? (
                                    /* Drag & drop — pendiente de implementar */
                                    <View style={{ padding: 20, backgroundColor: '#FEF3C7', borderRadius: 12, marginBottom: 20 }}>
                                        <Text style={{ fontSize: 16, color: '#92400E', textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>
                                            ⚠️ Ejercicio de Relacionar
                                        </Text>
                                        <Text style={{ fontSize: 14, color: '#92400E', textAlign: 'center', marginBottom: 12 }}>
                                            Este tipo de ejercicio estará disponible pronto
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (preguntaActualIndex < intentoActual.preguntas.length - 1) {
                                                    goToNextQuestion();
                                                } else {
                                                    Alert.alert(
                                                        'Última pregunta',
                                                        '¿Deseas finalizar la evaluación?',
                                                        [
                                                            { text: 'Revisar', style: 'cancel' },
                                                            { text: 'Finalizar', onPress: handleFinish }
                                                        ]
                                                    );
                                                }
                                            }}
                                            style={{ backgroundColor: '#F59E0B', paddingVertical: 12, borderRadius: 8, alignItems: 'center' }}
                                        >
                                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Barlow-Bold' }}>
                                                Saltar Pregunta
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    preguntaActual.opciones.map((opcion) => (
                                        <TouchableOpacity
                                            key={opcion.id}
                                            onPress={() => setSelectedOption(opcion.id)}
                                            style={{
                                                backgroundColor: selectedOption === opcion.id ? '#DBEAFE' : '#FFFFFF',
                                                padding: 16,
                                                borderRadius: 12,
                                                marginBottom: 12,
                                                borderWidth: 2,
                                                borderColor: selectedOption === opcion.id ? '#10B981' : '#E5E7EB',
                                            }}
                                        >
                                            <Text style={{ fontSize: 16, color: '#1F2937', fontFamily: 'Barlow-Regular' }}>
                                                {opcion.texto}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>

                            {/* Footer */}
                            <View style={{ backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    {preguntaActualIndex > 0 && (
                                        <TouchableOpacity
                                            onPress={goToPreviousQuestion}
                                            style={{ flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
                                        >
                                            <Text style={{ fontWeight: 'bold', fontFamily: 'Barlow-Bold' }}>Anterior</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        onPress={handleSubmitAnswer}
                                        disabled={preguntaActual.tipo === 'arrastrar_soltar' || !selectedOption || submitting}
                                        style={{
                                            flex: 1,
                                            backgroundColor: (preguntaActual.tipo === 'arrastrar_soltar' || !selectedOption)
                                                ? '#9CA3AF'
                                                : '#10B981',
                                            paddingVertical: 14,
                                            borderRadius: 12,
                                            alignItems: 'center',
                                        }}
                                    >
                                        {submitting
                                            ? <ActivityIndicator color="#FFFFFF" />
                                            : <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Barlow-Bold' }}>
                                                {preguntaActualIndex === intentoActual.preguntas.length - 1 ? 'Finalizar' : 'Siguiente'}
                                            </Text>
                                        }
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    ) : null}
                </SafeAreaView>
            </Modal>
        </>
    );
};