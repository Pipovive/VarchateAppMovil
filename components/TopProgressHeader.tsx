import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  progress: number;
  activeLanguage?: string;
};

const LANGUAGES = [
  { key: "introduccion", label: "INTRODUCCIÓN A LA PROGRAMACIÓN" },
  { key: "html", label: "HTML" },
  { key: "css", label: "CSS" },
  { key: "javascript", label: "JAVASCRIPT" },
  { key: "php", label: "PHP" },
  { key: "sql", label: "SQL" },
];

export function TopProgressHeader({
  title,
  progress,
  activeLanguage,
}: Props) {

  const navigateToLanguage = (lang: string) => {
    // evita navegación innecesaria
    if (lang === activeLanguage) return;

    router.replace({
      pathname: "/competition/[language]",
      params: { language: lang },
    });
  };

  return (
    <>
      {/* PROGRESS BAR */}
      <View className="w-full bg-primary-100 px-4 pt-6 pb-2">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity className="mr-4" onPress={() =>
  router.replace("/home")
}>
            <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

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
          {/* MENU */}
          <TouchableOpacity
            className="w-12 h-12 bg-quaternary rounded-2xl items-center justify-center mr-4"
            style={{ elevation: 4 }}
          >
            <Ionicons name="menu" size={28} color="#0099FF" />
          </TouchableOpacity>

          {/* PILLS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ columnGap: 12 }}
          >
            {LANGUAGES.map(lang => {
              const isActive = lang.key === activeLanguage;

              return (
                <TouchableOpacity
                  key={lang.key}
                  onPress={() => navigateToLanguage(lang.key)}
                  // 👇 ELIMINADO
                  // onLongPress NO navega
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
                    {lang.label}
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
