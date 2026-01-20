import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const [lastOpened, setLasOpened] = useState<Date | null>(null);


const handlePress = () => {
  setLasOpened(new Date())
}

const index = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "#EAF4FF" }} className="flex-1 bg-white">

      <View className="px-4 py-3">
        <Text className="text-white text-base">Inicio - Editor de código</Text>
      </View>


      <ScrollView style={{ backgroundColor: "#FFFFFF" }} className="flex-1 px-4 py-6 m-4">

        <Text className="text-xl font-bold text-gray-800 mb-4">
          Códigos recientes
        </Text>

        {/* Texto principal */}
        <TouchableOpacity
          onPress={ () => router.push('/editor/code')}
          className="flex-row items-center py-3 border-b border-gray-200">

          <View className="mr-3">
            <FontAwesome name="html5" size={32} color="#E44D26" />
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-800">
              Index.html
            </Text>
            <Text className="text-sm text-gray-500">
              Última vez abierto { }
              {lastOpened
                ? lastOpened.toLocaleString()
                : 'Nunca'}
            </Text>
          </View>
        </TouchableOpacity>


      </ScrollView>


      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default index