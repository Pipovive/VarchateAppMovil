import Button from '@/components/shared/button'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const HomeScreen = () => {
  const router = useRouter();

  const [competencias, setCompetencias] = useState([
    {
      id: 1,
      title: "INTRODUCCIÓN A LA PROGRAMACIÓN",
      slug: "intro-programacion",
      image: require("../../../assets/images/diagrama-de-flujo.png"),
    },
    {
      id: 2,
      title: "HTML",
      slug: "html",
      image: require("../../../assets/images/html-5.png"),
    },
    {
      id: 3,
      title: "CSS",
      slug: "css",
      image: require("../../../assets/images/css-3.png"),
    },
    {
      id: 4,
      title: "JAVASCRIPT",
      slug: "javascript",
      image: require("../../../assets/images/javascript.png"),
    },
    {
      id: 5,
      title: "SQL",
      slug: "sql",
      image: require("../../../assets/images/sql.png"),
    },
    {
      id: 6,
      title: "PHP",
      slug: "php",
      image: require("../../../assets/images/php.png"),
    }
  ]);

  const handlePress = (slug: string) => {
    // Opción A: Ruta dinámica
    // router.push(`/(stack)/competition/${slug}` as any);
    
    // Opción B: Ruta estática
    router.push(`/(tabs)/competition/${slug}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2] px-4">

      <Text className="font-barlow-bold text-center text-2xl mt-4 mb-6">
        COMPETENCIAS
      </Text>

      <View className="flex-row flex-wrap gap-4 justify-between">
        {competencias.map((item) => (
          <Button
            key={item.id}
            variant="card"
            color="secondary"
            className="w-[45%] aspect-square p-1 bg-[#AFCBFF7D] rounded-xl items-center justify-center shadow-md"
            source={item.image}
            onPress={() => handlePress(item.slug)}
          >
            {item.title}
          </Button>
        ))}
      </View>

    </SafeAreaView>
  );
};

export default HomeScreen;