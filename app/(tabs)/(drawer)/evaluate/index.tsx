import { AssessmentModal } from '@/components/assessment/AssessmentModal';
import { TopProgressHeader } from '@/components/shared/headerProgress';
import { useCurrentModule } from '@/src/context/ModuleContext';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

const EvaluateIndex = () => {
  const { currentModule } = useCurrentModule();

  if (!currentModule) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Cargando módulo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopProgressHeader
        title={currentModule.titulo}
        activeSlug={currentModule.slug}
      />

      {/* CONTENIDO CENTRADO */}
      <View style={styles.content}>
        <Text style={styles.title}>Evaluación Final</Text>
        <Text style={styles.subtitle}>{currentModule.titulo}</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <Text style={styles.infoText}>Duración: 10 minutos</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📝</Text>
            <Text style={styles.infoText}>
              Tipos: selección múltiple, verdadero/falso y relacionar
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>✅</Text>
            <Text style={styles.infoText}>
              Puntaje mínimo: 70% para aprobar
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🎯</Text>
            <Text style={styles.infoText}>
              Al finalizar, obtendrás tu puntaje automáticamente
            </Text>
          </View>
        </View>

        <Image
          source={require('../../../../assets/images/gato_eval.png')}
          style={styles.image}
        />

        {/* Botón de evaluación */}
        <AssessmentModal 
          moduloId={currentModule.id} 
          moduloTitulo={currentModule.titulo}
        />

        <Text style={styles.disclaimer}>
          ⚠️ Asegúrate de tener una conexión estable antes de comenzar
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF4FF',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Barlow-Bold',
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Barlow-Medium',
  },

  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  infoText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
    fontFamily: 'Barlow-Regular',
  },

  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
  },

  disclaimer: {
    fontSize: 12,
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Barlow-Medium',
  },
});

export default EvaluateIndex;