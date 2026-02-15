import Button from '@/components/shared/button';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context' // ← Comenta esto

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
    router.push(`/(tabs)/(drawer)/competition/${slug}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F2', paddingHorizontal: 16, paddingTop: 40 }}>
      <Text className="font-barlow-bold text-center text-2xl mt-4 mb-6">
        COMPETENCIAS
      </Text>

      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' }}>
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
      </ScrollView>
    </View>
  );
};

export default HomeScreen;