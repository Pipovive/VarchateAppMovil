import Button from '@/components/shared/button'
import { TopProgressHeader } from '@/components/shared/headerProgress'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const EvaluateIndex = () => {
  return (
    <View style={styles.container}>
      <TopProgressHeader
        title="Prueba"
        progress={69}
        activeSlug="Prueba2"
      />

      {/* CONTENIDO CENTRADO */}
      <View style={styles.content}>
        <Text style={styles.tabText}>Duración: 10 minutos</Text>

        <Text style={styles.tabText}>
          Preguntas: selección múltiple, verdadero/falso y completar
        </Text>

        <Text style={styles.tabText}>
          Al finalizar, obtendrás tu puntaje automáticamente.
        </Text>

        <Image
          source={require('../../../../assets/images/gato_eval.png')}
          style={styles.image}
        />

        <Button
          variant="contained"
          className="mt-3"
          onPress={() => {}}
        >
          Realizar Evaluación
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50, // ← Espaciado superior agregado
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  tabText: {
    fontSize: 14,
    color: '#767676',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 6,
  },

  image: {
    width: 220,
    resizeMode: 'contain',
    marginVertical: 20,
  },
})

export default EvaluateIndex