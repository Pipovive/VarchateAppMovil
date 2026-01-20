import { TopProgressHeader } from '@/components/shared/headerProgress'
import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  return (
    <SafeAreaView className="flex-1">
      <TopProgressHeader
            title={"Prueba"}
            progress={69}
            activeSlug={"Prueba2" as string}
      />
      <View>
        <Text>index</Text>
      </View>
    </SafeAreaView>
  )
}

export default index