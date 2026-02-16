import { useModuleViewModel } from "@/src/viewmodels/ModuleViewModel";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { router, useNavigation } from 'expo-router';
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  progress: number;
  activeSlug: string;
};

export function TopProgressHeader({ title, progress, activeSlug }: Props) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  
  // 🎣 Usar el ViewModel
  const { modules, loading, fetchModules } = useModuleViewModel();

  // 🚀 Cargar módulos al montar el componente
  useEffect(() => {
    if (modules.length === 0) {
      fetchModules();
    }
  }, []);

  const navigateTo = (slug: string) => {
    if (slug === activeSlug) return; // Evita navegación duplicada
    router.replace(`/(tabs)/(drawer)/competition/${slug}`);
  };

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
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={28} color="#0099FF" />
          </TouchableOpacity>

          {/* PILLS */}
          {loading && modules.length === 0 ? (
            // Mostrar loading solo si no hay módulos cargados
            <View style={{ paddingHorizontal: 16 }}>
              <ActivityIndicator size="small" color="#0099FF" />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ columnGap: 12 }}
            >
              {modules.map((module) => {
                const isActive = module.slug === activeSlug;

                return (
                  <TouchableOpacity
                    key={module.id}
                    onPress={() => navigateTo(module.slug)}
                    activeOpacity={0.85}
                    className={`px-6 py-3 rounded-xl ${
                      isActive ? "bg-primary-200" : "bg-quaternary"
                    }`}
                  >
                    <Text
                      className={`font-barlow-bold text-sm ${
                        isActive ? "text-quaternary" : "text-primary"
                      }`}
                      numberOfLines={1}
                    >
                      {module.titulo.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </>
  );
}