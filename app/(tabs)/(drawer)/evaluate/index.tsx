import { TopProgressHeader } from '@/components/shared/headerProgress';
import { useCurrentModule } from '@/src/context/ModuleContext';
import { useAssessmentViewModel } from '@/src/viewmodels/AssessmentViewModel';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Pantalla = 'inicio' | 'preguntas' | 'resultados';

const EvaluateIndex = () => {
  const { currentModule } = useCurrentModule();
  const [pantalla, setPantalla] = useState<Pantalla>('inicio');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [segundos, setSegundos] = useState(0);

  const {
    intentoActual,
    preguntaActualIndex,
    resultadoFinal,
    loading,
    submitting,
    tiempoRestante,
    loadAssessment,
    saveAnswer,
    finishAssessment,
    goToNextQuestion,
    goToPreviousQuestion,
    getPreguntaActual,
    getProgress,
    reset,
    setTiempoRestante,
  } = useAssessmentViewModel();

  // Timer simple
  const [timerListo, setTimerListo] = useState(false);

  // Efecto 1: cuando llega el tiempo del VM, preparar timer
  useEffect(() => {
    if (tiempoRestante > 0 && segundos === 0) {
      setSegundos(tiempoRestante);
      setTimerListo(true);
    }
  }, [tiempoRestante]);

  // Efecto 2: arrancar timer solo cuando esté listo
  useEffect(() => {
    if (pantalla !== 'preguntas' || !timerListo || segundos <= 0) return;

    const interval = setInterval(() => {
      setSegundos(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pantalla, timerListo, intentoActual?.intento_id]);

  const handleIniciar = async () => {
    try {
      await loadAssessment(currentModule!.id);
      setPantalla('preguntas');
    } catch (err: any) {
      const esInformativo = err?._tipo === 'informativo';
      Alert.alert(esInformativo ? 'ℹ️ Evaluación' : 'Error', err?.message || 'No se pudo cargar la evaluación');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !intentoActual) return;
    const pregunta = getPreguntaActual();
    if (!pregunta) return;

    try {
      await saveAnswer(currentModule!.id, pregunta.id, selectedOption);
      if (preguntaActualIndex < intentoActual.preguntas.length - 1) {
        goToNextQuestion();
        setSelectedOption(null);
      } else {
        Alert.alert('Última pregunta', '¿Deseas finalizar?', [
          { text: 'Revisar', style: 'cancel' },
          { text: 'Finalizar', onPress: handleFinish },
        ]);
      }
    } catch {
      Alert.alert('Error', 'No se pudo guardar la respuesta');
    }
  };

  const handleFinish = async () => {
    try {
      await finishAssessment(currentModule!.id);
      setPantalla('resultados');
    } catch {
      Alert.alert('Error', 'No se pudo finalizar la evaluación');
    }
  };

  const handleReintentar = () => {
    reset();
    setSelectedOption(null);
    setSegundos(0);
    setPantalla('inicio');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const timerColor = segundos <= 60 ? '#EF4444' : segundos <= 180 ? '#F59E0B' : '#FFFFFF';
  const preguntaActual = getPreguntaActual();
  const progress = getProgress();

  if (!currentModule) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // ── PANTALLA INICIO ──────────────────────────────────────────────────────
  if (pantalla === 'inicio') {
    return (
      <View style={styles.container}>
        <TopProgressHeader title={currentModule.titulo} activeSlug={currentModule.slug} />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Evaluación Final</Text>
          <Text style={styles.subtitle}>{currentModule.titulo}</Text>

          <View style={styles.infoBox}>
            {[
              { icon: '⏱️', text: 'Duración: 10 minutos' },
              { icon: '📝', text: 'Tipos: selección múltiple, verdadero/falso y relacionar' },
              { icon: '✅', text: 'Puntaje mínimo: 70% para aprobar' },
              { icon: '🎯', text: 'Al finalizar obtendrás tu puntaje automáticamente' },
            ].map(item => (
              <View key={item.icon} style={styles.infoRow}>
                <Text style={styles.infoIcon}>{item.icon}</Text>
                <Text style={styles.infoText}>{item.text}</Text>
              </View>
            ))}
          </View>

          <Image
            source={require('../../../../assets/images/gato_eval.png')}
            style={styles.image}
          />

          <TouchableOpacity
            onPress={handleIniciar}
            disabled={loading}
            style={[styles.btnIniciar, loading && { opacity: 0.7 }]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="trophy" size={24} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.btnIniciarText}>Comenzar Evaluación</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            ⚠️ Asegúrate de tener una conexión estable antes de comenzar
          </Text>
        </ScrollView>
      </View>
    );
  }

  // ── PANTALLA PREGUNTAS ───────────────────────────────────────────────────
  if (pantalla === 'preguntas' && intentoActual && preguntaActual) {
    return (
      <View style={styles.container}>
        {/* Header con timer */}
        <View style={styles.quizHeader}>
          <Text style={styles.quizHeaderTitle}>Evaluación</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="time" size={20} color={timerColor} />
            <Text style={[styles.timer, { color: timerColor }]}>
              {formatTime(segundos)}
            </Text>
          </View>
        </View>

        {/* Progreso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {progress.answered} de {progress.total} respondidas
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Pregunta */}
          <View style={styles.questionCard}>
            <Text style={styles.questionMeta}>
              Pregunta {preguntaActualIndex + 1} de {intentoActual.preguntas.length} · {preguntaActual.puntos} pts
            </Text>
            <Text style={styles.questionText}>{preguntaActual.pregunta}</Text>
            {preguntaActual.instrucciones ? (
              <Text style={styles.questionInstructions}>{preguntaActual.instrucciones}</Text>
            ) : null}
          </View>

          {/* Opciones */}
          {preguntaActual.tipo === 'arrastrar_soltar' ? (
            <View style={styles.dragDropPlaceholder}>
              <Text style={styles.dragDropTitle}>⚠️ Ejercicio de Relacionar</Text>
              <Text style={styles.dragDropText}>Este tipo de ejercicio estará disponible pronto</Text>
              <TouchableOpacity
                onPress={() => {
                  if (preguntaActualIndex < intentoActual.preguntas.length - 1) {
                    goToNextQuestion();
                  } else {
                    Alert.alert('Última pregunta', '¿Deseas finalizar?', [
                      { text: 'Revisar', style: 'cancel' },
                      { text: 'Finalizar', onPress: handleFinish },
                    ]);
                  }
                }}
                style={styles.btnSaltar}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Saltar Pregunta</Text>
              </TouchableOpacity>
            </View>
          ) : (
            preguntaActual.opciones.map(opcion => (
              <TouchableOpacity
                key={opcion.id}
                onPress={() => setSelectedOption(opcion.id)}
                style={[
                  styles.opcionBtn,
                  selectedOption === opcion.id && styles.opcionBtnSelected,
                ]}
              >
                <Text style={styles.opcionText}>{opcion.texto}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {preguntaActualIndex > 0 && (
              <TouchableOpacity
                onPress={() => { goToPreviousQuestion(); setSelectedOption(null); }}
                style={styles.btnAnterior}
              >
                <Text style={{ fontWeight: 'bold' }}>Anterior</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSubmitAnswer}
              disabled={preguntaActual.tipo === 'arrastrar_soltar' || !selectedOption || submitting}
              style={[
                styles.btnSiguiente,
                (!selectedOption || preguntaActual.tipo === 'arrastrar_soltar') && styles.btnDisabled,
              ]}
            >
              {submitting
                ? <ActivityIndicator color="#FFFFFF" />
                : <Text style={styles.btnSiguienteText}>
                  {preguntaActualIndex === intentoActual.preguntas.length - 1 ? 'Finalizar' : 'Siguiente'}
                </Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ── PANTALLA RESULTADOS ──────────────────────────────────────────────────
  if (pantalla === 'resultados' && resultadoFinal) {
    return (
      <View style={styles.container}>
        <View style={[styles.resultHeader, { backgroundColor: resultadoFinal.aprobado ? '#10B981' : '#EF4444' }]}>
          <Text style={styles.resultTitle}>
            {resultadoFinal.aprobado ? '🎉 ¡Aprobado!' : '😔 No Aprobado'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.resultCard}>
            <Text style={[styles.resultPorcentaje, { color: resultadoFinal.aprobado ? '#10B981' : '#EF4444' }]}>
              {resultadoFinal.porcentaje_obtenido}%
            </Text>
            <Text style={styles.resultMinimo}>Puntaje mínimo: {resultadoFinal.puntaje_minimo}%</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultSectionTitle}>Detalles</Text>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Correctas</Text>
              <Text style={[styles.resultValue, { color: '#10B981' }]}>{resultadoFinal.preguntas_correctas}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Incorrectas</Text>
              <Text style={[styles.resultValue, { color: '#EF4444' }]}>{resultadoFinal.preguntas_incorrectas}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Tiempo utilizado</Text>
              <Text style={styles.resultValue}>{resultadoFinal.tiempo_utilizado_minutos.toFixed(1)} min</Text>
            </View>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultMensaje}>{resultadoFinal.mensaje}</Text>
          </View>

          {resultadoFinal.certificacion && (
            <View style={[styles.resultCard, {
              backgroundColor: resultadoFinal.certificacion.disponible ? '#D1FAE5' : '#FEF3C7'
            }]}>
              <Text style={styles.resultSectionTitle}>🎓 Certificación</Text>
              <Text style={{ fontSize: 14, color: '#374151' }}>{resultadoFinal.certificacion.mensaje}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {!resultadoFinal.aprobado && (
            <TouchableOpacity onPress={handleReintentar} style={[styles.btnSiguiente, { backgroundColor: '#6B7280', marginBottom: 8 }]}>
              <Text style={styles.btnSiguienteText}>Intentar de nuevo</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleReintentar} style={styles.btnSiguiente}>
            <Text style={styles.btnSiguienteText}>Volver al módulo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Loading intermedio
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color="#10B981" />
      <Text style={{ marginTop: 16, color: '#6B7280' }}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EAF4FF' },
  content: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20 },

  // Inicio
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', textAlign: 'center', marginBottom: 8, fontFamily: 'Barlow-Bold' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24, fontFamily: 'Barlow-Medium' },
  infoBox: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, width: '100%', marginBottom: 20, elevation: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoText: { fontSize: 14, color: '#374151', flex: 1, lineHeight: 20, fontFamily: 'Barlow-Regular' },
  image: { width: 200, height: 200, resizeMode: 'contain', marginVertical: 20 },
  btnIniciar: { backgroundColor: '#10B981', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', elevation: 4 },
  btnIniciarText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', fontFamily: 'Barlow-Bold' },
  disclaimer: { fontSize: 12, color: '#F59E0B', textAlign: 'center', marginTop: 16, fontFamily: 'Barlow-Medium' },

  // Quiz
  quizHeader: { backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quizHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Barlow-Bold' },
  timer: { fontSize: 18, fontWeight: 'bold', fontFamily: 'Barlow-Bold' },
  progressContainer: { backgroundColor: '#10B981', paddingHorizontal: 20, paddingBottom: 16 },
  progressBar: { backgroundColor: 'rgba(255,255,255,0.3)', height: 8, borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 4 },
  progressText: { color: '#FFFFFF', marginTop: 4, fontSize: 12, fontFamily: 'Barlow-Regular' },
  questionCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 20 },
  questionMeta: { fontSize: 12, color: '#6B7280', marginBottom: 8, fontFamily: 'Barlow-Regular' },
  questionText: { fontSize: 18, color: '#1F2937', fontWeight: 'bold', lineHeight: 26, fontFamily: 'Barlow-Bold' },
  questionInstructions: { fontSize: 14, color: '#6B7280', marginTop: 8, fontFamily: 'Barlow-Regular' },
  opcionBtn: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: '#E5E7EB' },
  opcionBtnSelected: { backgroundColor: '#DBEAFE', borderColor: '#10B981' },
  opcionText: { fontSize: 16, color: '#1F2937', fontFamily: 'Barlow-Regular' },
  dragDropPlaceholder: { padding: 20, backgroundColor: '#FEF3C7', borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  dragDropTitle: { fontSize: 16, color: '#92400E', fontWeight: 'bold', marginBottom: 8 },
  dragDropText: { fontSize: 14, color: '#92400E', textAlign: 'center', marginBottom: 12 },
  btnSaltar: { backgroundColor: '#F59E0B', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  footer: { backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  btnAnterior: { flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnSiguiente: { flex: 1, backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnSiguienteText: { color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Barlow-Bold' },
  btnDisabled: { backgroundColor: '#9CA3AF' },

  // Resultados
  resultHeader: { paddingVertical: 32, paddingHorizontal: 20, alignItems: 'center' },
  resultTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Barlow-Bold' },
  resultCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16 },
  resultPorcentaje: { fontSize: 64, fontWeight: 'bold', textAlign: 'center' },
  resultMinimo: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 8 },
  resultSectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, fontFamily: 'Barlow-Bold' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  resultLabel: { color: '#6B7280', fontFamily: 'Barlow-Regular' },
  resultValue: { fontWeight: 'bold', color: '#374151', fontFamily: 'Barlow-Bold' },
  resultMensaje: { fontSize: 16, color: '#374151', lineHeight: 24, fontFamily: 'Barlow-Regular' },
});

export default EvaluateIndex;