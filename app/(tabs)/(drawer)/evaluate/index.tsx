import { DragDropExercise } from '@/components/exercises/DragDropExercise';
import { TopProgressHeader } from '@/components/shared/headerProgress';
import { useCurrentModule } from '@/src/context/ModuleContext';
import { useAssessmentViewModel } from '@/src/viewmodels/AssessmentViewModel';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type Pantalla = 'inicio' | 'preguntas' | 'resultados';


const EvaluateIndex = () => {
  const insets = useSafeAreaInsets();
  const { currentModule } = useCurrentModule();
  const [pantalla, setPantalla] = useState<Pantalla>('inicio');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [segundos, setSegundos] = useState(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

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
    saveDragDropAnswer,
  } = useAssessmentViewModel();

  // Timer simple
  const [timerListo, setTimerListo] = useState(false);
  const [datosEvaluacion, setDatosEvaluacion] = useState<any>(null);
  const [infoEvaluacion, setInfoEvaluacion] = useState<{ tiempo_limite_minutos: number; numero_preguntas: number } | null>(null);

  // Efecto 1: cuando llega tiempoRestante, setear segundos
  useEffect(() => {
    if (tiempoRestante > 0) {
      setSegundos(tiempoRestante);
    }
  }, [tiempoRestante]);

  // Efecto 2: arrancar/parar interval cuando cambia pantalla o segundos se inicializa
  useEffect(() => {
    if (pantalla !== 'preguntas' || segundos <= 0) return;

    // Limpiar interval anterior si existe
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSegundos(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pantalla, segundos === tiempoRestante && tiempoRestante > 0]);

  // Efecto 3: cargar info de la evaluación para pantalla inicio
  useEffect(() => {
    if (!currentModule) return;
    import('@/src/services/assessmentServices').then(({ obtenerEstadoEvaluacion }) => {
      obtenerEstadoEvaluacion(currentModule.id)
        .then(res => {
          if (res.success && res.data?.evaluacion) {
            setInfoEvaluacion({
              tiempo_limite_minutos: res.data.evaluacion.tiempo_limite_minutos,
              numero_preguntas: res.data.evaluacion.numero_preguntas,
            });
          }
        })
        .catch(() => { });
    });
  }, [currentModule]);

  const handleIniciar = async () => {
    try {
      await loadAssessment(currentModule!.id);
      setPantalla('preguntas');
    } catch (err: any) {
      const esInformativo = err?._tipo === 'informativo';
      const mensajeFormateado = formatearTiempoEspera(err?.message || 'No se pudo cargar la evaluación');
      Alert.alert(esInformativo ? 'ℹ️ Evaluación' : 'Error', mensajeFormateado);
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
  const formatearTiempoEspera = (mensaje: string): string => {
    // Buscar número en el mensaje
    const match = mensaje.match(/(\d+\.?\d*)\s*horas?/i);
    if (!match) return mensaje;

    const totalHoras = parseFloat(match[1]);
    const horas = Math.floor(totalHoras);
    const minutosDecimal = (totalHoras - horas) * 60;
    const minutos = Math.floor(minutosDecimal);
    const segundos = Math.floor((minutosDecimal - minutos) * 60);

    const partes = [];
    if (horas > 0) partes.push(`${horas}h`);
    if (minutos > 0) partes.push(`${minutos}min`);
    if (segundos > 0) partes.push(`${segundos}s`);

    return mensaje.replace(match[0], partes.join(' '));
  };

  const handleFinish = async () => {
    try {
      console.log('🏁 handleFinish - Iniciando...');
      console.log('📦 intentoActual:', intentoActual?.intento_id);
      console.log('📦 moduloId:', currentModule?.id);

      const resultado = await finishAssessment(currentModule!.id);

      console.log('✅ finishAssessment completado:', resultado);
      console.log('✅ resultadoFinal después de finalizar:', resultadoFinal);

      // ✅ VERIFICAR QUE EL RESULTADO EXISTA
      if (!resultado) {
        console.error('❌ No se recibió resultado');
        Alert.alert('Error', 'No se pudo obtener el resultado de la evaluación');
        return;
      }

      console.log('🎯 Cambiando a pantalla de resultados');
      setPantalla('resultados');

    } catch (err: any) {
      console.error('❌ Error en handleFinish:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error response:', err.response?.data);

      Alert.alert(
        'Error',
        err.message || 'No se pudo finalizar la evaluación'
      );
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
        <ActivityIndicator size="large" color="#3478E6" />
      </View>
    );
  }

  // ── PANTALLA INICIO ──────────────────────────────────────────────────────
  if (pantalla === 'inicio') {
    return (
      <View style={styles.container}>

        <TopProgressHeader title={currentModule.titulo} activeSlug={currentModule.slug} />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.container2}>
            <Text style={styles.title}>Evaluación Final</Text>
            <Text style={styles.subtitle}>{currentModule.titulo}</Text>

            <View style={styles.infoBox}>
              {[
                { icon: '⏱️', text: infoEvaluacion ? `Duración: 10 minutos` : 'Cargando...' },
                { icon: '📝', text: infoEvaluacion ? `${infoEvaluacion.numero_preguntas} preguntas` : 'Cargando...' },
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
                  <Text style={styles.btnIniciarText}>Comenzar Evaluación</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Asegúrate de tener una conexión estable antes de comenzar
            </Text>
          </View>
        </ScrollView>
      </View>

    );
  }

  // ── PANTALLA PREGUNTAS ───────────────────────────────────────────────────
  if (pantalla === 'preguntas' && intentoActual && preguntaActual) {
    return (
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <StatusBar style='dark'></StatusBar>
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
        <View style={[styles.progressContainer,]}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
          </View>
          <Text style={[styles.progressText]}>
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
            <DragDropExercise
              opciones={preguntaActual.opciones}
              disabled={submitting}
              onSubmit={async (parejas) => {
                try {
                  await saveDragDropAnswer(
                    currentModule!.id,
                    preguntaActual.id,
                    parejas.map(p => ({ id_opcion: p.id_opcion, pareja: p.respuesta }))
                  );
                  if (preguntaActualIndex < intentoActual.preguntas.length - 1) {
                    goToNextQuestion();
                  } else {
                    Alert.alert('Última pregunta', '¿Deseas finalizar?', [
                      { text: 'Revisar', style: 'cancel' },
                      { text: 'Finalizar', onPress: handleFinish },
                    ]);
                  }
                } catch {
                  Alert.alert('Error', 'No se pudo guardar la respuesta');
                }
              }}
            />
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
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
            {preguntaActualIndex > 0 && (
              <TouchableOpacity
                onPress={() => { goToPreviousQuestion(); setSelectedOption(null); }}
                style={styles.btnAnterior}
              >
                <Text style={{ fontWeight: 'bold', fontFamily: 'Barlow-Bold', color: '#374151' }}>Anterior</Text>
              </TouchableOpacity>
            )}
            {preguntaActual.tipo !== 'arrastrar_soltar' && (
              <TouchableOpacity
                onPress={handleSubmitAnswer}
                disabled={!selectedOption || submitting}
                style={[
                  styles.btnSiguiente,
                  !selectedOption && styles.btnDisabled,
                ]}
              >
                {submitting
                  ? <ActivityIndicator color="#FFFFFF" />
                  : <Text style={styles.btnSiguienteText}>
                    {preguntaActualIndex === intentoActual.preguntas.length - 1 ? 'Finalizar' : 'Siguiente'}
                  </Text>
                }
              </TouchableOpacity>
            )}
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
            {resultadoFinal.aprobado ? '¡Aprobado!' : 'No Aprobado'}
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 14, opacity: 0.9, marginTop: 4 }}>
            {resultadoFinal.evaluacion_titulo}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Puntaje */}
          <View style={styles.resultCard}>
            <Text style={[styles.resultPorcentaje, { color: resultadoFinal.aprobado ? '#10B981' : '#EF4444' }]}>
              {resultadoFinal.porcentaje_obtenido}%
            </Text>
            <Text style={styles.resultMinimo}>Puntaje mínimo: {resultadoFinal.puntaje_minimo}%</Text>
            <View style={{ marginTop: 12, backgroundColor: '#F3F4F6', borderRadius: 8, overflow: 'hidden', height: 8 }}>
              <View style={{ height: '100%', width: `${resultadoFinal.porcentaje_obtenido}%`, backgroundColor: resultadoFinal.aprobado ? '#10B981' : '#EF4444' }} />
            </View>
          </View>

          {/* Detalles numéricos */}
          <View style={styles.resultCard}>
            <Text style={styles.resultSectionTitle}>📊 Detalles</Text>
            {[
              { label: 'Correctas', value: `${resultadoFinal.preguntas_correctas} / ${resultadoFinal.preguntas_totales}`, color: '#10B981' },
              { label: 'Incorrectas', value: String(resultadoFinal.preguntas_incorrectas), color: '#EF4444' },
              { label: 'Puntuación', value: String(resultadoFinal.puntuacion_total), color: '#374151' },
              { label: 'Tiempo utilizado', value: `${resultadoFinal.tiempo_utilizado_minutos.toFixed(1)} min`, color: '#374151' },
            ].map(item => (
              <View key={item.label} style={styles.resultRow}>
                <Text style={styles.resultLabel}>{item.label}</Text>
                <Text style={[styles.resultValue, { color: item.color }]}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Recomendaciones */}
          <View style={styles.resultCard}>
            <Text style={styles.resultSectionTitle}>💡 Recomendación</Text>
            <Text style={{ fontSize: 15, color: '#374151', lineHeight: 22, fontFamily: 'Barlow-Regular' }}>
              {resultadoFinal.mensaje}
            </Text>
            {resultadoFinal.siguiente_paso ? (
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8, fontStyle: 'italic' }}>
                👉 {resultadoFinal.siguiente_paso}
              </Text>
            ) : null}
          </View>

          {/* Respuestas detalladas */}
          {resultadoFinal.respuestas_detalladas?.length > 0 && (
            <View style={styles.resultCard}>
              <Text style={styles.resultSectionTitle}>📝 Revisión de respuestas</Text>
              <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
                Revisa cada pregunta para identificar tus aciertos y áreas de mejora
              </Text>

              {resultadoFinal.respuestas_detalladas.map((r: any, index: number) => (
                <View
                  key={r.pregunta_id}
                  style={{
                    backgroundColor: r.respuesta_usuario?.es_correcta ? '#F0FDF4' : '#FEF2F2',
                    borderLeftWidth: 4,
                    borderLeftColor: r.respuesta_usuario?.es_correcta ? '#10B981' : '#EF4444',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                  }}
                >
                  {/* Número y estado */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '600' }}>
                      Pregunta {index + 1}
                    </Text>
                    <View style={{
                      backgroundColor: r.respuesta_usuario?.es_correcta ? '#10B981' : '#EF4444',
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 4
                    }}>
                      <Text style={{ fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' }}>
                        {r.respuesta_usuario?.es_correcta ? '✓ CORRECTA' : '✗ INCORRECTA'}
                      </Text>
                    </View>
                  </View>

                  {/* Pregunta */}
                  <Text style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#1F2937',
                    marginBottom: 8,
                    lineHeight: 20
                  }}>
                    {r.pregunta_texto}
                  </Text>

                  {/* Tu respuesta */}
                  <View style={{ marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
                      Tu respuesta:
                    </Text>
                    <Text style={{
                      fontSize: 13,
                      color: r.respuesta_usuario?.es_correcta ? '#059669' : '#DC2626',
                      fontWeight: '600',
                      backgroundColor: r.respuesta_usuario?.es_correcta ? '#D1FAE5' : '#FEE2E2',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 4,
                      alignSelf: 'flex-start'
                    }}>
                      {r.respuesta_usuario?.opcion_texto || 'No respondida'}
                    </Text>
                  </View>

                  {/* Respuesta correcta (si falló) */}
                  {!r.respuesta_usuario?.es_correcta && (
                    <View style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
                        Respuesta correcta:
                      </Text>
                      <Text style={{
                        fontSize: 13,
                        color: '#059669',
                        fontWeight: '600',
                        backgroundColor: '#D1FAE5',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                        alignSelf: 'flex-start'
                      }}>
                        {r.respuesta_correcta?.texto}
                      </Text>
                    </View>
                  )}

                  {/* Puntos */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>
                      Puntos obtenidos:
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: r.respuesta_usuario?.es_correcta ? '#059669' : '#DC2626',
                      marginLeft: 4
                    }}>
                      {r.respuesta_usuario?.puntos_obtenidos || 0} / {r.puntos}
                    </Text>
                  </View>

                  {/* Explicación */}
                  {r.explicacion && (
                    <View style={{
                      backgroundColor: '#F9FAFB',
                      padding: 8,
                      borderRadius: 6,
                      marginTop: 8,
                      borderLeftWidth: 2,
                      borderLeftColor: '#9CA3AF'
                    }}>
                      <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '600', marginBottom: 4 }}>
                        💡 Explicación:
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: '#4B5563',
                        lineHeight: 18,
                        fontStyle: 'italic'
                      }}>
                        {r.explicacion}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {resultadoFinal.certificacion && (
            <View style={styles.resultCard}>
              <Text style={styles.resultSectionTitle}>📊 Estadísticas Detalladas</Text>

              {/* Grid de estadísticas */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, gap: 12 }}>
                <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#F0FDF4', padding: 12, borderRadius: 8 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#10B981' }}>
                    {resultadoFinal.preguntas_correctas}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#059669' }}>Correctas</Text>
                </View>

                <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#EF4444' }}>
                    {resultadoFinal.preguntas_incorrectas}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#DC2626' }}>Incorrectas</Text>
                </View>

                <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3B82F6' }}>
                    {resultadoFinal.puntuacion_total}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#2563EB' }}>Puntos totales</Text>
                </View>

                <View style={{ flex: 1, minWidth: '45%', backgroundColor: '#FEF3C7', padding: 12, borderRadius: 8 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B' }}>
                    {Math.abs(resultadoFinal.tiempo_utilizado_minutos).toFixed(1)}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#D97706' }}>Minutos</Text>
                </View>
              </View>

              {/* Barra de progreso */}
              <View style={{ marginTop: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>
                    Precisión de respuestas
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151' }}>
                    {((resultadoFinal.preguntas_correctas / resultadoFinal.preguntas_totales) * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' }}>
                  <View style={{
                    height: '100%',
                    width: `${(resultadoFinal.preguntas_correctas / resultadoFinal.preguntas_totales) * 100}%`,
                    backgroundColor: '#10B981'
                  }} />
                </View>
              </View>
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
  content: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
    paddingTop: 20
  },

  // Inicio
  container2: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: 'center', // ← Centra horizontalmente
    justifyContent: 'center', // ← Centra verticalmente si hay espacio
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // ← Sombra en Android
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center', // ← Centrar texto
    marginBottom: 8,
    fontFamily: 'Barlow-Bold'
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Barlow-Medium'
  },
  infoBox: {
    backgroundColor: '#F9FAFB', // ← Color diferente para distinguir
    borderRadius: 12,
    padding: 16,
    width: '100%', // ← Ocupa todo el ancho del container2
    marginBottom: 20
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoText: { fontSize: 14, color: '#374151', lineHeight: 20, fontFamily: 'Barlow-Regular' },
  image: { width: 250, height: 250, resizeMode: 'contain', marginVertical: 20 },
  btnIniciar: { backgroundColor: '#3478E6', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'center', elevation: 4 },
  btnIniciarText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', fontFamily: 'Barlow-Bold' },
  disclaimer: { fontSize: 12, color: '#F59E0B', textAlign: 'center', marginTop: 16, fontFamily: 'Barlow-Medium' },

  // Quiz
  quizHeader: { backgroundColor: '#3478E6', paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quizHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'Barlow-Bold' },
  timer: { fontSize: 18, fontWeight: 'bold', fontFamily: 'Barlow-Bold' },
  progressContainer: { backgroundColor: '#3478E6', paddingHorizontal: 20, paddingBottom: 16, },
  progressBar: { backgroundColor: 'rgba(255,255,255,0.3)', height: 8, borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 4 },
  progressText: { color: '#FFFFFF', marginTop: 4, fontSize: 12, fontFamily: 'Barlow-Regular' },
  questionCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, marginBottom: 20 },
  questionMeta: { fontSize: 12, color: '#6B7280', marginBottom: 8, fontFamily: 'Barlow-Regular' },
  questionText: { fontSize: 18, color: '#1F2937', fontWeight: 'bold', lineHeight: 26, fontFamily: 'Barlow-Bold' },
  questionInstructions: { fontSize: 14, color: '#6B7280', marginTop: 8, fontFamily: 'Barlow-Regular' },
  opcionBtn: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: '#E5E7EB' },
  opcionBtnSelected: { backgroundColor: '#DBEAFE', borderColor: '#3478E6' },
  opcionText: { fontSize: 16, color: '#1F2937', fontFamily: 'Barlow-Regular' },
  dragDropPlaceholder: { padding: 20, backgroundColor: '#FEF3C7', borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  dragDropTitle: { fontSize: 16, color: '#92400E', fontWeight: 'bold', marginBottom: 8 },
  dragDropText: { fontSize: 14, color: '#92400E', textAlign: 'center', marginBottom: 12 },
  btnSaltar: { backgroundColor: '#F59E0B', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  footer: { backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB'},
  btnAnterior: { flex: 1, backgroundColor: '#E5E7EB', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', },
  btnSiguiente: { flex: 1, backgroundColor: '#3478E6', paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', },
  btnSiguienteText: { color: '#FFFFFF', fontWeight: 'bold', fontFamily: 'Barlow-Bold', height: 23},
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