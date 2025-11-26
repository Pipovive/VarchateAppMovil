import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const HomeScreen = () => {
  const router = useRouter()
  return (
    <View>
      <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.replace("../(drawer)") }
      className="w-40 h-40 bg-[#AFCBFF] rounded-2xl items-center justify-center shadow-md"
    >
      <Text className="text-slate-800 text-lg font-semibold">Modulo:1</Text>
    </TouchableOpacity>
    </View>
  )
}

export default HomeScreen