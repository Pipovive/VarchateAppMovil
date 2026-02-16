import CustomDrawerButton from "@/components/shared/customDrawer";
import { useCurrentModule } from '@/src/context/ModuleContext';
import { useLessonViewModel } from "@/src/viewmodels/LessonViewModel";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React, { useEffect } from "react";
import { ActivityIndicator, GestureResponderEvent, Text, View } from "react-native";

import { useModuleViewModel } from '@/src/viewmodels/ModuleViewModel';


export default function CompetitionLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#AFCBFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "Barlow-Bold",
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: "#EAF4FF",
          width: 280,
        },
      }}
      drawerContent={(props) => <CustomContent {...props} />}
    >
      <Drawer.Screen
        name="competition/[slug]"
        options={{
          title: "Introducción",
          drawerLabel: "Introducción"
        }}
      />

      <Drawer.Screen
        name="lesson/[id]"
        options={{
          title: "Lecciones",
          drawerLabel: "Lecciones"
        }}
      />

      <Drawer.Screen
        name="evaluate/index"
        options={{
          title: "Evaluación",
          drawerLabel: "Evaluación"
        }}
      />
    </Drawer>
  );
}

// ✅ CustomContent FUERA del componente principal
function CustomContent(props: DrawerContentComponentProps) {
   const { selectedModule, fetchModuleBySlug } = useModuleViewModel();
  const currentRoute = props.state.routeNames[props.state.index];
   const { setCurrentModule } = useCurrentModule();  // ← AGREGAR ESTO
  const { currentModule } = useCurrentModule();
  const {
    lessons,
    statistics,
    loading,
    error,
    fetchLessons
  } = useLessonViewModel();

  useEffect(() => {
    console.log('═══════════════════════════════════');
    console.log('🔍 DRAWER - useEffect ejecutado');
    console.log('currentModule:', currentModule);
    console.log('currentModule?.slug:', currentModule?.slug);
    console.log('lessons.length:', lessons.length);
    console.log('loading:', loading);
    console.log('error:', error);
    console.log('═══════════════════════════════════');

    if (currentModule && lessons.length === 0 && !loading) {  // ← AGREGADO: verificar que no haya lecciones
      console.log('✅ Módulo existe y no hay lecciones, cargando...');
      console.log('📚 Llamando fetchLessons con slug:', currentModule.slug);

      fetchLessons(currentModule.slug)
        .then((data) => {
          console.log('✅ fetchLessons completado');
          console.log('Data recibida:', data);
          console.log('Lecciones:', data?.lecciones);
        })
        .catch((err) => {
          console.log('❌ Error en fetchLessons:', err);
          console.log('Error response:', err.response?.data);
        });
    } else {
      console.log('⚠️ Condiciones no cumplidas:');
      console.log('  - selectedModule:', !!currentModule);
      console.log('  - lessons.length:', lessons.length);
      console.log('  - loading:', loading);
    }
  }, [currentModule, lessons.length]);  // ← CAMBIO: Agregar lessons.length como dependencia

  function handleEvaluatePress(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  function handleIntroPress(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  // ... resto del código (handleLessonPress, etc.)

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: 40,
        paddingHorizontal: 0,
      }}
      style={{ backgroundColor: "#EAF4FF" }}
    >
      <View style={{ paddingTop: 24, paddingHorizontal: 16 }}>
        {/* Debug info */}
        <View style={{ 
          marginBottom: 16, 
          padding: 12, 
          backgroundColor: '#FEF3C7',
          borderRadius: 8 
        }}>
          <Text style={{ fontSize: 10, color: '#92400E' }}>
            DEBUG: Module: {currentModule?.titulo || 'null'} | Lessons: {lessons.length} | Loading: {loading ? 'YES' : 'NO'}
          </Text>
        </View>

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
              ⚠️ Selecciona un módulo primero
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
          <View style={{
            paddingVertical: 20,
            alignItems: 'center'
          }}>
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
          <View style={{
            paddingVertical: 20,
            paddingHorizontal: 8
          }}>
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
          lessons.map((lesson) => {
            const isActive = currentRoute.includes("lesson");

            function handleLessonPress(lesson: any): void {
              throw new Error("Function not implemented.");
            }

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
          <View style={{
            paddingVertical: 20,
            paddingHorizontal: 8
          }}>
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              textAlign: 'center',
              fontFamily: 'Barlow-Regular'
            }}>
              {currentModule ? 'No hay lecciones disponibles' : 'Selecciona un módulo para ver las lecciones'}
            </Text>
          </View>
        )}

        {/* EVALUACIÓN */}
        {lessons.length > 0 && (
          <View style={{ marginTop: 8, marginBottom: 12 }}>
            <CustomDrawerButton
              variant={currentRoute.includes("evaluate") ? "active" : "no-active"}
              onPress={handleEvaluatePress}
            >
              🎯 Evaluación
            </CustomDrawerButton>
          </View>
        )}
      </View>
    </DrawerContentScrollView>
  );
}