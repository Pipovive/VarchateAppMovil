
import Button from '@/components/shared/button'
import { router } from 'expo-router'

import React from 'react'
import { Text, View } from 'react-native'

const ProfileScreen = () => {

  return (
    
    <View>
      <Text>ProfileScreen</Text>
      <Button onPress={() => {router.push('/(stack)/login')} }> Volver al login</Button>
    </View>
  )
}

export default ProfileScreen


