import Button from '@/components/shared/button'
import { useRouter } from 'expo-router'
import React from 'react'
import { View } from 'react-native'


const HomeScreen = () => {
  const router = useRouter()
  return (
    <View>
    <Button variant='card' color='primary' className="w-40 h-40 bg-[#242424] rounded-2xl items-center justify-center shadow-md" source={require("../../../assets/images/splash-icon.png")}>Hola</Button>
    <Button variant='card' color='primary' className="w-40 h-40 bg-[#242424] rounded-2xl items-center justify-center shadow-md" source={require("../../../assets/images/splash-icon.png")}>Hola</Button>
    <Button variant='card' color='primary' className="w-40 h-40 bg-[#242424] rounded-2xl items-center justify-center shadow-md" source={require("../../../assets/images/splash-icon.png")}>Hola</Button>
    

    </View>
  )
}

export default HomeScreen