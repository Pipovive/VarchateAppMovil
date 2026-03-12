import { useTheme } from "@/src/context/ThemeContext";
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
  mode?: 'competition' | 'lesson'; // ← nuevo prop
};

export function TopProgressHeader({ title, activeSlug, mode = 'competition' }: Props) {
  const { isDark } = useTheme();
  const {
    modules,
    modulesWithProgress,
    loading,
    fetchModules,
    fetchModulesWithProgress
  } = useModuleViewModel();

  const colors = {
    // Barra superior (progress bar)
    headerBg: isDark ? '#1F2937' : '#0099FF',
    progressTrack: isDark ? '#374151' : '#BFDBFE',
    progressFill: isDark ? '#3B82F6' : '#0099FF',
    progressText: isDark ? '#F3F4F6' : '#FFFFFF',

    // Barra inferior (pills)
    pillsBarBg: isDark ? '#272B35' : '#D3E8FF',
    menuBg: isDark ? '#1B1D23' : '#FFFFFF',
    menuIcon: isDark ? '#60B4FF' : '#0099FF',

    // Pills inactivas
    pillBg: isDark ? '#374151' : '#FFFFFF',
    pillText: isDark ? '#93C5FD' : '#0099FF',

    // Pill activa
    pillActiveBg: isDark ? '#1E3A5F' : '#0099FF',
    pillActiveText: isDark ? '#FFFFFF' : '#FFFFFF',

    loadingText: isDark ? '#9CA3AF' : '#6B7280',
  };

  React.useEffect(() => {
    if (modules.length === 0) fetchModules();
    fetchModulesWithProgress();
  }, []);

  const navigateTo = (slug: string) => {
    if (slug === activeSlug) return;
    router.replace({
      pathname: '/(tabs)/(drawer)/competition/[slug]',
      params: { slug }
    });
  };

  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const insets = useSafeAreaInsets();

  const currentProgress = React.useMemo(() => {
    const moduleWithProgress = modulesWithProgress.find(m => m.slug === activeSlug);
    return moduleWithProgress?.progreso || 0;
  }, [modulesWithProgress, activeSlug]);

  return (
    <>
      {/* BARRA DE PROGRESO */}
      <View style={{
        width: '100%',
        backgroundColor: colors.headerBg,
        paddingHorizontal: 16,
        paddingBottom: 8,
        paddingTop: insets.top + 8
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          {/* REGRESAR */}
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => {
              if (mode === 'lesson') {
                // Desde lección → volver a competition/[slug]
                router.replace({
                  pathname: '/(tabs)/(drawer)/competition/[slug]',
                  params: { slug: activeSlug }
                });
              } else {
                // Desde competition → volver a home
                router.replace('/(tabs)/home');
              }
            }}
          >
            <Ionicons name="arrow-back" size={28} color={colors.progressText} />
          </TouchableOpacity>

          {/* BARRA */}
          <View style={{
            flex: 1,
            backgroundColor: colors.progressTrack,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8
          }}>
            <View style={{
              width: '100%',
              height: 32,
              backgroundColor: isDark ? '#4B5563' : '#BFDBFE',
              borderRadius: 6,
              overflow: 'hidden'
            }}>
              <View style={{
                height: '100%',
                backgroundColor: colors.progressFill,
                width: `${currentProgress}%`
              }} />
              <View style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0, right: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16
              }}>
                <Text style={{ color: colors.progressText, fontFamily: 'Barlow-Medium', fontSize: 13 }}>
                  {title}
                </Text>
                <Text style={{ color: colors.progressText, fontFamily: 'Barlow-Bold', fontSize: 13 }}>
                  {currentProgress}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* MENÚ + PILLS */}
      <View style={{
        width: '100%',
        backgroundColor: colors.pillsBarBg,
        paddingHorizontal: 16,
        paddingVertical: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* MENÚ */}
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{
              width: 48,
              height: 48,
              backgroundColor: colors.menuBg,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.4 : 0.1,
              shadowRadius: 4,
            }}
          >
            <Ionicons name="menu" size={28} color={colors.menuIcon} />
          </TouchableOpacity>

          {/* PILLS */}
          {loading && modules.length === 0 ? (
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 12, color: colors.loadingText }}>Cargando...</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ columnGap: 12 }}
            >
              {modules.map((module) => {
                const isActive = module.slug === activeSlug;
                const moduleProgress = modulesWithProgress.find(m => m.slug === module.slug);
                const hasProgress = moduleProgress && moduleProgress.progreso > 0;

                return (
                  <TouchableOpacity
                    key={module.id}
                    onPress={() => navigateTo(module.slug)}
                    activeOpacity={0.85}
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: isActive ? colors.pillActiveBg : colors.pillBg,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'Barlow-Bold',
                          fontSize: 14,
                          color: isActive ? colors.pillActiveText : colors.pillText,
                        }}
                      >
                        {module.titulo.toUpperCase()}
                      </Text>

                      {hasProgress && !isActive && (
                        <View style={{
                          backgroundColor: '#10B981',
                          width: 6,
                          height: 6,
                          borderRadius: 3
                        }} />
                      )}

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