import { useModuleViewModel } from "@/src/viewmodels/ModuleViewModel";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type Props = {
  title: string;
  activeSlug: string;
};

export function TopProgressHeader({ title, activeSlug }: Props) {
  const { 
    modules, 
    modulesWithProgress, 
    loading, 
    fetchModules, 
    fetchModulesWithProgress 
  } = useModuleViewModel();

  React.useEffect(() => {
    if (modules.length === 0) {
      fetchModules();
    }
    // ✅ Cargar progreso real de los módulos
    fetchModulesWithProgress();
  }, []);

  const navigateTo = (slug: string) => {
    if (slug === activeSlug) return;
    router.replace({
      pathname: '/(tabs)/(drawer)/competition/[slug]',
      params: { slug: slug }
    });
  };

  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const handleMenuPress = () => {
    console.log('📱 Abriendo drawer...');
    navigation.openDrawer();
  };

  // ✅ Obtener el progreso real del módulo activo
  const currentProgress = React.useMemo(() => {
    const moduleWithProgress = modulesWithProgress.find(m => m.slug === activeSlug);
    return moduleWithProgress?.progreso || 0;
  }, [modulesWithProgress, activeSlug]);

  return (
    <>
      {/* PROGRESS BAR */}
      <View className="w-full bg-primary-100 px-4 pb-2" style={{ paddingTop: insets.top + 8 }}>
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
                style={{ width: `${currentProgress}%` }}
              />
              <View className="absolute inset-0 flex-row justify-between items-center px-4">
                <Text className="text-quaternary font-barlow-medium">
                  {title}
                </Text>
                <Text className="text-quaternary font-barlow-bold">
                  {currentProgress}%
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
            onPress={handleMenuPress}
          >
            <Ionicons name="menu" size={28} color="#0099FF" />
          </TouchableOpacity>

          {/* PILLS */}
          {loading && modules.length === 0 ? (
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Cargando...</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ columnGap: 12 }}
            >
              {modules.map((module) => {
                const isActive = module.slug === activeSlug;
                
                // ✅ Obtener progreso del módulo (si está disponible)
                const moduleProgress = modulesWithProgress.find(m => m.slug === module.slug);
                const hasProgress = moduleProgress && moduleProgress.progreso > 0;

                return (
                  <TouchableOpacity
                    key={module.id}
                    onPress={() => navigateTo(module.slug)}
                    activeOpacity={0.85}
                    className={`px-6 py-3 rounded-xl ${
                      isActive ? "bg-primary-200" : "bg-quaternary"
                    }`}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text
                        className={`font-barlow-bold text-sm ${
                          isActive ? "text-quaternary" : "text-primary"
                        }`}
                        numberOfLines={1}
                      >
                        {module.titulo.toUpperCase()}
                      </Text>
                      
                      {/* ✅ Mostrar indicador de progreso si tiene */}
                      {hasProgress && !isActive && (
                        <View style={{
                          backgroundColor: '#10B981',
                          width: 6,
                          height: 6,
                          borderRadius: 3
                        }} />
                      )}
                      
                      {/* ✅ Mostrar checkmark si está completado */}
                      {moduleProgress?.progreso === 100 && !isActive && (
                        <Text style={{ fontSize: 10 }}>✓</Text>
                      )}
                    </View>
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