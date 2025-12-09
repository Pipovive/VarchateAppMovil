import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function TopProgressHeader({ title, progress }: { title: string; progress: number }) {
  return (
    <>
     <View className="w-full bg-primary-100 px-4 pt-6 pb-2">

        {/* Back + Progress Bar */}
        <View className="flex-row items-center mb-3">

          <TouchableOpacity className="mr-3" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Contenedor general */}
          <View className="flex-1 bg-quaternary rounded-md px-3 py-3 justify-center">

            {/* CONTENEDOR RELATIVO PARA SUPERPOSICIÓN */}
            <View className="w-full h-12 bg-primary-200 rounded-md overflow-hidden relative">

              {/* Barra dinámica */}
              <View
                className="h-full bg-primary-100 rounded-md"
                style={{ width: `${progress}%` }}
              />

              {/* TEXTOS ENCIMA DE LA BARRA (ABSOLUTE) */}
              <View className="absolute inset-0 flex-row justify-between items-center px-4">
                <Text className="text-quaternary font-barlow-medium text-base">
                  {title}
                </Text>

                <Text className="text-quaternary font-barlow-bold text-lg">
                  {progress}%
                </Text>
              </View>
            </View>

          </View>

        </View>
      </View>

      {/* Navigation Pills */}
      <View className="w-full bg-[#D3E8FF] px-4 pb-4">
        <View className="flex-row items-center space-x-3 mt-2">
          <TouchableOpacity className="bg-primary-200 px-4 py-2 rounded-full">
            <Text className="text-quaternary font-barlow-bold">{title}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-quaternary px-4 py-2 rounded-full border border-primary-200">
            <Text className="text-primary font-barlow-medium">HTML</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-quaternary px-4 py-2 rounded-full border border-primary-200">
            <Text className="text-primary font-barlow-medium">CSS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
