import CustomDrawerButton from "@/components/shared/customDrawer";
import { useLessons } from "@/src/context/LessonContext";
import { useCurrentModule } from "@/src/context/ModuleContext";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function CompetitionLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: "#EAF4FF",
          width: 280,
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

  // 🎣 Obtener módulo y lecciones del contexto
  const { currentModule } = useCurrentModule();
  const {
    lessons,
    statistics,
    loading,
    error,
    fetchLessons
  } = useLessons();

  // 📚 Cargar lecciones cuando hay módulo
  useEffect(() => {
    if (currentModule && lessons.length === 0 && !loading) {
      console.log('📚 Drawer: Cargando lecciones del módulo', currentModule.slug);
      fetchLessons(currentModule.slug);
    }
  }, [currentModule, lessons.length]);

  // 🎯 Navegar a introducción
  const handleIntroPress = () => {
    if (!currentModule) {
      console.log('⚠️ No hay módulo seleccionado');
      return;
    }
    router.push(`/(tabs)/(drawer)/competition/${currentModule.slug}`);
  };

  // 🎯 Navegar a lección
  const handleLessonPress = (lesson: any) => {
    if (!lesson.disponible) {
      alert(`🔒 Esta lección está bloqueada.\n\nCompleta la lección anterior primero.`);
      return;
    }

    if (!currentModule) {
      alert('❌ No hay módulo seleccionado');
      return;
    }

    console.log('📖 Navegando a lección:', lesson.id);
    router.push({
      pathname: '/(tabs)/(drawer)/lesson/[id]',
      params: {
        id: lesson.id.toString(),
        moduleSlug: currentModule.slug
      }
    });
  };

  // 🎯 Navegar a evaluación
  const handleEvaluatePress = () => {
    if (!currentModule) {
      alert('❌ No hay módulo seleccionado');
      return;
    }

    if (statistics && statistics.completadas < statistics.disponibles) {
      alert(
        `⚠️ Debes completar todas las lecciones antes de la evaluación.\n\n` +
        `Completadas: ${statistics.completadas}/${statistics.disponibles}`
      );
      return;
    }

    router.push('/(tabs)/(drawer)/evaluate');
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 40, paddingHorizontal: 0 }}
      style={{ backgroundColor: "#EAF4FF" }}
    >
      <View style={{ paddingTop: 24, paddingHorizontal: 16 }}>
        {/* TÍTULO DEL MÓDULO */}
        {currentModule ? (
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#1F2937',
              fontFamily: 'Barlow-Bold'
            }}>
              {currentModule.titulo}
            </Text>
            {statistics && (
              <Text style={{
                fontSize: 12,
                color: '#6B7280',
                marginTop: 4,
                fontFamily: 'Barlow-Regular'
              }}>
                {statistics.completadas}/{statistics.disponibles} lecciones completadas
              </Text>
            )}
          </View>
        ) : (
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 14,
              color: '#EF4444',
              fontFamily: 'Barlow-SemiBold'
            }}>
              ⚠️ Selecciona un módulo
            </Text>
          </View>
        )}

        {/* SECCIÓN: CONTENIDO DEL CURSO */}
        <Text style={{
          fontFamily: 'Barlow-SemiBold',
          fontSize: 14,
          color: '#6B7280',
          marginBottom: 12,
          paddingHorizontal: 8
        }}>
          CONTENIDO DEL CURSO
        </Text>

        {/* INTRODUCCIÓN */}
        <View style={{ marginBottom: 12 }}>
          <CustomDrawerButton
            variant={currentRoute.includes("competition") ? "active" : "no-active"}
            onPress={handleIntroPress}
            locked={!currentModule}
          >
            📘 Introducción
          </CustomDrawerButton>
        </View>

        {/* LECCIONES */}
        {loading ? (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#0099FF" />
            <Text style={{
              marginTop: 8,
              fontSize: 12,
              color: '#6B7280',
              fontFamily: 'Barlow-Regular'
            }}>
              Cargando lecciones...
            </Text>
          </View>
        ) : error ? (
          <View style={{ paddingVertical: 20, paddingHorizontal: 8 }}>
            <Text style={{
              fontSize: 14,
              color: '#EF4444',
              textAlign: 'center',
              fontFamily: 'Barlow-Regular'
            }}>
              {error}
            </Text>
          </View>
        ) : lessons.length > 0 ? (
          lessons.map((lesson: any) => {
            const isActive = currentRoute.includes("lesson");

            return (
              <View key={lesson.id} style={{ marginBottom: 12 }}>
                <CustomDrawerButton
                  variant={isActive ? "active" : "no-active"}
                  locked={!lesson.disponible}
                  completed={lesson.vista}
                  onPress={() => handleLessonPress(lesson)}
                >
                  {lesson.titulo}
                </CustomDrawerButton>
              </View>
            );
          })
        ) : (
          <View style={{ paddingVertical: 20, paddingHorizontal: 8 }}>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              textAlign: 'center',
              fontFamily: 'Barlow-Regular'
            }}>
              {currentModule ? 'No hay lecciones disponibles' : 'Selecciona un módulo'}
            </Text>
          </View>
        )}

        {/* EVALUACIÓN */}
        {lessons.length > 0 && (
          <View style={{ marginTop: 8, marginBottom: 12 }}>
            <CustomDrawerButton
              variant={currentRoute.includes("evaluate") ? "active" : "no-active"}
              onPress={handleEvaluatePress}
              locked={!currentModule || (statistics && statistics.completadas < statistics.disponibles)}
            >
              🎯 Evaluación
            </CustomDrawerButton>
          </View>
        )}
      </View>
    </DrawerContentScrollView>
  );
}