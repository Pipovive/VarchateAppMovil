import CustomDrawerButton from "@/components/shared/customDrawer";
import { useLessons } from "@/src/context/LessonContext";
import { useCurrentModule } from "@/src/context/ModuleContext";
import { useTheme } from "@/src/context/ThemeContext";
import { DrawerContentComponentProps, DrawerContentScrollView, useDrawerStatus } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function CompetitionLayout() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: isDark ? '#1B1D23' : '#FFFFFF',
          width: 300,
          paddingTop: insets.top
        },
      }}
      drawerContent={(props) => <CustomContent {...props} />}
    >
      <Drawer.Screen name="competition/[slug]" options={{ title: "Introducción", drawerLabel: "Introducción" }} />
      <Drawer.Screen name="lesson/[id]" options={{ title: "Lección", drawerLabel: "Lección" }} />
      <Drawer.Screen name="evaluate/index" options={{ title: "Evaluación", drawerLabel: "Evaluación" }} />
    </Drawer>
  );
}

function CustomContent(props: DrawerContentComponentProps) {
  const currentRoute = props.state.routeNames[props.state.index];
  const { currentModule } = useCurrentModule();
  const { lessons, statistics, loading, error, fetchLessons } = useLessons();
  const { isDark } = useTheme();
  const isDrawerOpen = useDrawerStatus();

  const colors = {
    background:       isDark ? '#1B1D23' : '#FFFFFF',
    border:           isDark ? '#374151' : '#E5E7EB',
    moduleTitle:      isDark ? '#60B4FF' : '#0099FF',
    progressBg:       isDark ? '#1E3A5F' : '#EFF6FF',
    progressText:     isDark ? '#93C5FD' : '#1E40AF',
    warningBg:        isDark ? '#3B2A00' : '#FEF3C7',
    warningText:      isDark ? '#FCD34D' : '#92400E',
    errorBg:          isDark ? '#3B1515' : '#FEE2E2',
    errorText:        isDark ? '#FCA5A5' : '#991B1B',
    emptyBg:          isDark ? '#272B35' : '#F3F4F6',
    emptyText:        isDark ? '#9CA3AF' : '#6B7280',
    loadingText:      isDark ? '#9CA3AF' : '#6B7280',
  };

  useEffect(() => {
    if (isDrawerOpen === 'open' && currentModule) {
      fetchLessons(currentModule.slug);
    }
  }, [isDrawerOpen, currentModule]);

  const handleIntroPress = () => {
    if (!currentModule) return;
    router.push(`/(tabs)/(drawer)/competition/${currentModule.slug}`);
  };

  const handleLessonPress = (lesson: any) => {
    if (!lesson.disponible) {
      alert(`🔒 Esta lección está bloqueada.\n\nCompleta la lección anterior primero.`);
      return;
    }
    if (!currentModule) {
      alert('Error: No se encontró el módulo activo');
      return;
    }
    router.push({
      pathname: '/(tabs)/(drawer)/lesson/[id]',
      params: { id: lesson.id.toString(), moduleSlug: currentModule.slug }
    });
  };

  const handleEvaluatePress = () => {
    if (statistics && statistics.completadas < statistics.disponibles) {
      alert(
        `⚠️ Completa todas las lecciones primero\n\n` +
        `Progreso: ${statistics.completadas}/${statistics.disponibles} lecciones`
      );
      return;
    }
    router.push('/(tabs)/(drawer)/evaluate');
  };

  const allLessonsCompleted = statistics
    ? statistics.completadas >= statistics.disponibles
    : false;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 0 }}
      style={{ backgroundColor: colors.background }}
    >
      <View style={{ paddingHorizontal: 20 }}>

        {/* HEADER */}
        {currentModule ? (
          <View style={{
            marginBottom: 24,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.border
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.moduleTitle,
              fontFamily: 'Barlow-Bold',
              marginBottom: 8
            }}>
              {currentModule.titulo}
            </Text>
            {statistics && (
              <View style={{
                backgroundColor: colors.progressBg,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                alignSelf: 'flex-start'
              }}>
                <Text style={{
                  fontSize: 12,
                  color: colors.progressText,
                  fontFamily: 'Barlow-SemiBold'
                }}>
                  ✓ {statistics.completadas}/{statistics.disponibles} completadas
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={{
            marginBottom: 24,
            padding: 12,
            backgroundColor: colors.warningBg,
            borderRadius: 8
          }}>
            <Text style={{
              fontSize: 13,
              color: colors.warningText,
              fontFamily: 'Barlow-SemiBold'
            }}>
              ⚠️ Selecciona un módulo
            </Text>
          </View>
        )}

        {/* INTRODUCCIÓN */}
        <View style={{ marginBottom: 8 }}>
          <CustomDrawerButton
            variant={currentRoute.includes("competition") ? "active" : "no-active"}
            onPress={handleIntroPress}
          >
            Introducción
          </CustomDrawerButton>
        </View>

        {/* SEPARADOR */}
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />

        {/* LECCIONES */}
        {loading ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#0099FF" />
            <Text style={{
              marginTop: 12,
              fontSize: 13,
              color: colors.loadingText,
              fontFamily: 'Barlow-Medium'
            }}>
              Cargando lecciones...
            </Text>
          </View>
        ) : error ? (
          <View style={{
            paddingVertical: 20,
            paddingHorizontal: 16,
            backgroundColor: colors.errorBg,
            borderRadius: 8,
            marginBottom: 12
          }}>
            <Text style={{
              fontSize: 13,
              color: colors.errorText,
              textAlign: 'center',
              fontFamily: 'Barlow-Medium'
            }}>
              ⚠️ {error}
            </Text>
          </View>
        ) : lessons.length > 0 ? (
          <>
            {lessons.map((lesson: any) => (
              <View key={lesson.id} style={{ marginBottom: 8 }}>
                <CustomDrawerButton
                  variant={currentRoute.includes("lesson") ? "active" : "no-active"}
                  locked={!lesson.disponible}
                  completed={lesson.vista}
                  onPress={() => handleLessonPress(lesson)}
                >
                  {lesson.titulo}
                </CustomDrawerButton>
              </View>
            ))}
          </>
        ) : (
          <View style={{
            paddingVertical: 20,
            paddingHorizontal: 16,
            backgroundColor: colors.emptyBg,
            borderRadius: 8,
            marginBottom: 12
          }}>
            <Text style={{
              fontSize: 13,
              color: colors.emptyText,
              textAlign: 'center',
              fontFamily: 'Barlow-Medium'
            }}>
              {currentModule ? 'No hay lecciones' : 'Selecciona un módulo'}
            </Text>
          </View>
        )}

        {/* SEPARADOR */}
        {lessons.length > 0 && (
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 12 }} />
        )}

        {/* EVALUACIÓN */}
        {lessons.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <CustomDrawerButton
              variant={currentRoute.includes("evaluate") ? "active" : "no-active"}
              onPress={handleEvaluatePress}
              locked={!allLessonsCompleted}
              completed={allLessonsCompleted}
            >
              Evaluación
            </CustomDrawerButton>
          </View>
        )}

      </View>
    </DrawerContentScrollView>
  );
}