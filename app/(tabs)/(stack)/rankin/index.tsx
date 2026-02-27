import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RankingScreen() {
  const ranking = [
    { id: 1, name: "Juan", percent: 100 },
    { id: 2, name: "Daniel", percent: 85 },
    { id: 3, name: "Juan", percent: 70 },
    { id: 4, name: "Juan", percent: 50 },
    { id: 5, name: "Juan", percent: 30 },
    { id: 6, name: "Juan", percent: 10 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#EAF4FF]">
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View className="bg-primary-100 flex-row items-center px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-quaternary text-2xl mr-4">←</Text>
          </TouchableOpacity>

          <Text className="text-quaternary font-barlow-bold text-xl">
            RANKING
          </Text>
        </View>

        {/* PODIO */}
        <View className="items-center mt-6">
          <Image
            source={require("@/assets/images//gatopodium.png")}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>

        {/* TEXTO */}
        <View className="items-center px-8 mt-4">
          <Text className="font-barlow-bold text-xl mb-2">
            ¡BIENVENIDO!
          </Text>

          <Text className="text-center text-gray-600">
            Explora nuestro ranking clasificatorio por modulos. mientras
            más avances en la competencia estaras en primer lugar
          </Text>
        </View>

        {/* CARD USUARIO */}
        <View className="items-center mt-8">
          <View className="w-[55%] aspect-square rounded-2xl p-4 items-center justify-between"
          style={{ backgroundColor: "rgba(24, 162, 255, 0.52)"}}>
            <Text className="text-quaternary font-barlow-bold text-lg">
              15
            </Text>

            <View className="items-center">
              <Image
                source={require("@/assets/images/avatar_01.png")}
                style={{ width: 60, height: 60 }}
              />
              <Text className="text-quaternary font-barlow-bold">Tú</Text>
            </View>

            {/* PROGRESS */}
            <View className="w-full h-3 rounded-full bg-quaternary mt-2 overflow-hidden">
              <View
                className="h-full bg-quaternary rounded-full"
                style={{ width: "50%" }}
              />
            </View>

            <Text className="text-quaternary text-xs text-right mt-1">
              50%
            </Text>
          </View>
        </View>

        {/* GRID */}
        <View className="flex-row flex-wrap justify-center mt-8 px-2">
          {ranking.map(item => (
            <View
              key={item.id}
              className="w-[45%] aspect-square m-2 rounded-2xl p-4 items-center justify-between"
              style={{ backgroundColor: "rgba(39, 108, 220, 0.5)", 
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 }}}
            >
              <Text className="absolute top-3 left-3 text-quaternary font-barlow-bold">
                {item.id}
              </Text>

              <View className="items-center">
                <Image
                  source={require("@/assets/images/avatar_01.png")}
                  style={{ width: 50, height: 50 }}
                />
                <Text className="text-quaternary">{item.name}</Text>
              </View>

              <View className="bg-quaternary h-2 rounded-full mt-2">
                <View
                  className="bg-quaternary h-2 rounded-full"
                  style={{ width: `${item.percent}%` }}
                />
              </View>

              <Text className="text-quaternary text-xs text-right mt-1">
                {item.percent}%
              </Text>
            </View>
          ))}
        </View>

        {/* PAGINACION */}
        <View className="flex-row justify-center mt-6 mb-8">
          {[1,2,3,4,5,6,7,8,9].map(p => (
            <View
              key={p}
              className={`mx-1 px-3 py-1 rounded ${
                p === 1 ? "bg-primary-200" : "bg-gray-300"
              }`}
            >
              <Text
                className={`font-barlow-bold ${
                  p === 1 ? "text-quaternary" : "text-gray-700"
                }`}
              >
                {p}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}