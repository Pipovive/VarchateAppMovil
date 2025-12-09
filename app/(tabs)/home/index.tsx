import Button from '@/components/shared/button'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const DATA = [
  { title: "INTRODUCCION A LA PROGRAMACION", img: require("../../../assets/images/diagrama-de-flujo.png"), lang: "introduccion" },
  { title: "HTML", img: require("../../../assets/images/html-5.png"), lang: "html" },
  { title: "CSS", img: require("../../../assets/images/css-3.png"), lang: "css" },
  { title: "JAVASCRIPT", img: require("../../../assets/images/javascript.png"), lang: "javascript" },
  { title: "SQL", img: require("../../../assets/images/sql.png"), lang: "sql" },
  { title: "PHP", img: require("../../../assets/images/php.png"), lang: "php" }
]

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
      
      <Text className="font-barlow-bold text-center text-2xl mt-4 mb-6">
        COMPETENCIAS
      </Text>

      <FlatList
        data={DATA}
        numColumns={2}   // 👈 garantiza SIEMPRE 2 columnas
        columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <Button
            variant="card"
            color="secondary"
            className="w-[48%] aspect-square bg-[#AFCBFF7D] rounded-2xl items-center justify-center shadow-md"
            source={item.img}
            onPress={() => goToCompetition(item.lang)}
          >
            {item.title}
          </Button>
        )}
      />
    </SafeAreaView>
  )
}

export default HomeScreen
