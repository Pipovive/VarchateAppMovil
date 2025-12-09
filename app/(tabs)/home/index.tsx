import Button from '@/components/shared/button'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = () => {
  const router = useRouter()

  const goToCompetition = (language: string) => {
 router.push({
  pathname: "/(stack)/competition/[language]",
  params: { language }
});
  };
  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2] px-4">
      
      {/* TÍTULO */}
      <Text className="font-barlow-bold text-center text-2xl mt-4 mb-6">
        COMPETENCIAS
      </Text>

      {/* GRID DE 2 COLUMNAS */}
      <View className="flex-row flex-wrap gap-4 justify-between">

        <Button 
          variant="card"
          color="secondary"
          className="w-[48%] aspect-square bg-[#AFCBFF7D] rounded-2xl items-center justify-center shadow-md"
          source={require("../../../assets/images/diagrama-de-flujo.png")}
          onPress={() => goToCompetition("introduccion")}
        >
          INTRODUCCION A LA PROGRAMACION
        </Button>

        <Button 
          variant="card"
          color="secondary"
          className="w-[48%] aspect-square bg-[#AFCBFF7D] rounded-2xl items-center justify-center shadow-md"
          source={require("../../../assets/images/html-5.png")}
          onPress={() => goToCompetition("html")}
       >
          HTML
        </Button>

        <Button 
          variant="card"
          color="secondary"
          className="w-[48%] aspect-square bg-[#AFCBFF7D] rounded-2xl items-center justify-center shadow-md"
          source={require("../../../assets/images/css-3.png")}
          onPress={() => goToCompetition("css")}
       >
          CSS
        </Button>

        <Button 
          variant="card"
          color="primary"
          className="w-[48%] aspect-square bg-[#AFCBFF7D] rounded-2xl items-center justify-center shadow-md"
          source={require("../../../assets/images/javascript.png")}
          onPress={() => goToCompetition("javascript")}
        >
          JAVASCRIPT
        </Button>

        <Button 
          variant="card"
          color="primary"
          className="w-[48%] aspect-square bg-[#AFCBFF7D] rounded-2xl items-center justify-center shadow-md"
          source={require("../../../assets/images/sql.png")}
          onPress={() => goToCompetition("sql")}
        >
          SQL
        </Button>

        <Button 
          variant="card"
          color="primary"
          className="w-[48%] aspect-square bg-[#AFCBFF7D] rounded-2xl items-center justify-center shadow-md"
          source={require("../../../assets/images/php.png")}
          onPress={() => goToCompetition("php")}
        >
          PHP
        </Button>

      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
