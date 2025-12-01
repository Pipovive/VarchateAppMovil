import { router } from 'expo-router'
import React from 'react'
import { Pressable, Text, View } from 'react-native'

const CarruselScreen = () => {
  return (
    <View>
      <Text>CarruselScreen</Text>
      <Pressable onPress={() => router.push('/(stack)/login')}>
        <Text>Go to Login</Text>
      </Pressable>
    </View>
  )
}

export default CarruselScreen