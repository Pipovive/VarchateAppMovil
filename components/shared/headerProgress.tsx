import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { router, useNavigation } from 'expo-router';
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";


type Props = {
  title: string;
  progress: number;
  activeSlug: string; // 🔥 SLUG ACTIVO
};

// 🔥 Lista de competencias con su slug real
const COMPETENCIAS = [
  { slug: "intro-programacion", label: "INTRODUCCIÓN A LA PROGRAMACIÓN" },
  { slug: "html", label: "HTML" },
  { slug: "css", label: "CSS" },
  { slug: "javascript", label: "JAVASCRIPT" },
  { slug: "php", label: "PHP" },
  { slug: "sql", label: "SQL" },
];

export function TopProgressHeader({ title, progress, activeSlug }: Props) {
  const navigateTo = (slug: string) => {
    if (slug === activeSlug) return; // evita navegación duplicada

    router.replace(`/(tabs)/(drawer)/competition/${slug}`);
  };

  const navigation = useNavigation<DrawerNavigationProp<any>>();
  


  return (
    <>
      {/* PROGRESS BAR */}
      <View className="w-full bg-primary-100 px-4 pt-6 pb-2">
        <View className="flex-row items-center mb-3">

          {/* REGRESAR */}
          <TouchableOpacity
            className="mr-4"
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* BARRA DE PROGRESO */}
          <View className="flex-1 bg-quaternary rounded-xl px-3 py-2">
            <View className="w-full h-8 bg-primary-200 rounded-md overflow-hidden">
              <View
                className="h-full bg-primary-100"
                style={{ width: `${progress}%` }}
              />
              <View className="absolute inset-0 flex-row justify-between items-center px-4">
                <Text className="text-quaternary font-barlow-medium">
                  {title}
                </Text>
                <Text className="text-quaternary font-barlow-bold">
                  {progress}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* MENU + PILLS */}
      <View className="w-full bg-[#D3E8FF] px-4 py-4">
        <View className="flex-row items-center">

          {/* MENÚ */}
          <TouchableOpacity
            className="w-12 h-12 bg-quaternary rounded-2xl items-center justify-center mr-4"
            style={{ elevation: 4 }}
            onPress={() => navigation.openDrawer() }
          >
            <Ionicons name="menu" size={28} color="#0099FF" />
          </TouchableOpacity>

          {/* PILLS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 12 }}
          >
            {COMPETENCIAS.map((item) => {
              const isActive = item.slug === activeSlug;

              return (
                <TouchableOpacity
                  key={item.slug}
                  onPress={() => navigateTo(item.slug)}
                  activeOpacity={0.85}
                  className={`px-6 py-3 rounded-xl ${
                    isActive ? "bg-primary-200" : "bg-quaternary"
                  }`}
                >
                  <Text
                    className={`font-barlow-bold ${
                      isActive ? "text-quaternary" : "text-primary"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </>
  );
}
