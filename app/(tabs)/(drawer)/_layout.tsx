import CustomDrawerButton from "@/components/shared/customDrawer";
import { useLessons } from "@/src/context/LessonContext";
import { useCurrentModule } from "@/src/context/ModuleContext";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CompetitionLayout() {
    const insets = useSafeAreaInsets();
  

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#FFFFFF",
          width: 300,
          paddingTop: insets.top
        },
      }}
      drawerContent={(props) => <CustomContent {...props} />}
    >
      <Drawer.Screen
        name="competition/[slug]"
        options={{ title: "Introducción", drawerLabel: "Introducción" }}
      />
      <Drawer.Screen
        name="lesson/[id]"
        options={{ title: "Lección", drawerLabel: "Lección" }}
      />
      <Drawer.Screen
        name="evaluate/index"
        options={{ title: "Evaluación", drawerLabel: "Evaluación" }}
      />
    </Drawer>
  );
}

function CustomContent(props: DrawerContentComponentProps) {
  const currentRoute = props.state.routeNames[props.state.index];

  const { currentModule } = useCurrentModule();
  const {
    lessons,
    statistics,
    loading,
    error,
    fetchLessons
  } = useLessons();

  

  useEffect(() => {
    if (currentModule && lessons.length === 0 && !loading) {
      console.log('📚 Drawer: Cargando lecciones del módulo', currentModule.slug);
      fetchLessons(currentModule.slug);
    }
  }, [currentModule, lessons.length]);

  const handleIntroPress = () => {
    if (!currentModule) return;
    router.push(`/(tabs)/(drawer)/competition/${currentModule.slug}`);
  };

 const handleLessonPress = (lesson: any) => {
  if (!lesson.disponible) {
    alert(`🔒 Esta lección está bloqueada.\n\nCompleta la lección anterior primero.`);
    return;
  }

  // ✅ VALIDAR que currentModule exista
  if (!currentModule) {
    console.log('❌ No hay módulo en el contexto');
    alert('Error: No se encontró el módulo activo');
    return;
  }

  console.log('📖 Navegando a lección:', lesson.id, 'Módulo:', currentModule.slug);
  router.push({
    pathname: '/(tabs)/(drawer)/lesson/[id]',
    params: {
      id: lesson.id.toString(),
      moduleSlug: currentModule.slug
    }
  });
};

  const handleEvaluatePress = () => {
    // ✅ CORREGIDO: Solo verificar si completó todas las lecciones
    if (statistics && statistics.completadas < statistics.disponibles) {
      alert(
        `⚠️ Completa todas las lecciones primero\n\n` +
        `Progreso: ${statistics.completadas}/${statistics.disponibles} lecciones`
      );
      return;
    }

    router.push('/(tabs)/(drawer)/evaluate');
  };

  // ✅ Verificar si todas las lecciones están completadas
  const allLessonsCompleted = statistics 
    ? statistics.completadas >= statistics.disponibles 
    : false;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 0 }}
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <View style={{ paddingHorizontal: 20 }}>
        {/* ✅ HEADER MEJORADO */}
        {currentModule ? (
          <View style={{ 
            marginBottom: 24,
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB'
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#0099FF',
              fontFamily: 'Barlow-Bold',
              marginBottom: 8
            }}>
              {currentModule.titulo}
            </Text>
            {statistics && (
              <View style={{
                backgroundColor: '#EFF6FF',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                alignSelf: 'flex-start'
              }}>
                <Text style={{
                  fontSize: 12,
                  color: '#1E40AF',
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
            backgroundColor: '#FEF3C7',
            borderRadius: 8
          }}>
            <Text style={{
              fontSize: 13,
              color: '#92400E',
              fontFamily: 'Barlow-SemiBold'
            }}>
              ⚠️ Selecciona un módulo
            </Text>
          </View>
        )}

        {/* INTRODUCCIÓN - ✅ SIN LOCKED */}
        <View style={{ marginBottom: 8 }}>
          <CustomDrawerButton
            variant={currentRoute.includes("competition") ? "active" : "no-active"}
            onPress={handleIntroPress}
          >
            Introducción
          </CustomDrawerButton>
        </View>

        {/* SEPARADOR */}
        <View style={{ 
          height: 1, 
          backgroundColor: '#E5E7EB', 
          marginVertical: 12 
        }} />

        {/* LECCIONES */}
        {loading ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#0099FF" />
            <Text style={{
              marginTop: 12,
              fontSize: 13,
              color: '#6B7280',
              fontFamily: 'Barlow-Medium'
            }}>
              Cargando lecciones...
            </Text>
          </View>
        ) : error ? (
          <View style={{ 
            paddingVertical: 20, 
            paddingHorizontal: 16,
            backgroundColor: '#FEE2E2',
            borderRadius: 8,
            marginBottom: 12
          }}>
            <Text style={{
              fontSize: 13,
              color: '#991B1B',
              textAlign: 'center',
              fontFamily: 'Barlow-Medium'
            }}>
              ⚠️ {error}
            </Text>
          </View>
        ) : lessons.length > 0 ? (
          <>
            {lessons.map((lesson: any, index: number) => (
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
            backgroundColor: '#F3F4F6',
            borderRadius: 8,
            marginBottom: 12
          }}>
            <Text style={{
              fontSize: 13,
              color: '#6B7280',
              textAlign: 'center',
              fontFamily: 'Barlow-Medium'
            }}>
              {currentModule ? 'No hay lecciones' : 'Selecciona un módulo'}
            </Text>
          </View>
        )}

        {/* SEPARADOR */}
        {lessons.length > 0 && (
          <View style={{ 
            height: 1, 
            backgroundColor: '#E5E7EB', 
            marginVertical: 12 
          }} />
        )}

        {/* EVALUACIÓN - ✅ SIN LOCKED si completó todo */}
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