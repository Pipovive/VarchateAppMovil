import { TopProgressHeader } from "@/components/shared/headerProgress";
import { ModuleHeader } from "@/components/shared/moduleHeader";
import { WhiteScreenContainer } from "@/components/shared/whiteScreenCard";
import { useCurrentModule } from "@/src/context/ModuleContext";
import { useLessonViewModel } from "@/src/viewmodels/LessonViewModel";
import { useModuleViewModel } from "@/src/viewmodels/ModuleViewModel";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CompetitionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { setCurrentModule } = useCurrentModule();

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      console.log('🚀 Cargando módulo:', slug);
      fetchModuleBySlug(slug);
    }
  }, [slug]);

  useEffect(() => {
    if (selectedModule) {
      console.log('💾 Guardando módulo en Context:', selectedModule.titulo);
      setCurrentModule(selectedModule);
    }
  }, [setCurrentModule]);

  // 🎣 ViewModels
  const { selectedModule, loading, error, fetchModuleBySlug } = useModuleViewModel();
  const {
    lessons,
    fetchLessons,
    getNextAvailableLesson
  } = useLessonViewModel();

  // 🚀 Cargar módulo cuando cambie el slug
  useEffect(() => {
    if (slug && typeof slug === 'string') {
      console.log('🚀 Cargando módulo:', slug);
      fetchModuleBySlug(slug);
    }
  }, [slug]);

  // 📚 Cargar lecciones cuando se cargue el módulo
  useEffect(() => {
    if (selectedModule) {
      console.log('📚 Cargando lecciones del módulo:', selectedModule.slug);  // ← Usar slug
      fetchLessons(selectedModule.slug);  // ← Enviar slug en lugar de ID
    }
  }, [selectedModule]);

  // ❌ Validación de slug
  if (!slug || typeof slug !== 'string') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: Slug inválido</Text>
      </View>
    );
  }

  // 🔄 Pantalla de carga
  if (loading && !selectedModule) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#EAF4FF',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color="#0099FF" />
        <Text style={{
          marginTop: 12,
          fontSize: 16,
          color: '#6B7280',
          fontFamily: 'Barlow-Medium'
        }}>
          Cargando módulo...
        </Text>
      </View>
    );
  }

  // ❌ Pantalla de error
  if (error && !selectedModule) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#EAF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
      }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
        <Text style={{
          fontSize: 18,
          color: '#EF4444',
          marginBottom: 16,
          textAlign: 'center',
          fontFamily: 'Barlow-SemiBold'
        }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => fetchModuleBySlug(slug)}
          style={{
            backgroundColor: '#0099FF',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
            Reintentar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ⚠️ Sin módulo
  if (!selectedModule) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Módulo no encontrado</Text>
      </View>
    );
  }

  // 📋 Lecciones de ejemplo (mantén estas temporalmente hasta cargar de la API)
  const lessonsPlaceholder = [
    {
      title: "Lección 1 – ¿Qué es programar? Conceptos básicos",
      desc: "Descubrirás qué significa programar, qué son los algoritmos y cómo se comunican con la computadora.",
    },
    {
      title: "Lección 2 – Tipos de datos y variables",
      desc: "Conocerás cómo almacenar y manipular información dentro de un programa.",
    },
    {
      title: "Lección 3 – Operadores y expresiones",
      desc: "Aprenderás a realizar cálculos y operaciones lógicas.",
    },
    {
      title: "Lección 4 – Condicionales (if/else, switch)",
      desc: "Descubrirás cómo tomar decisiones en un programa según condiciones.",
    },
    {
      title: "Evaluación",
      desc: "Pondrás en práctica los fundamentos de programación con ejercicios sencillos.",
    },
  ];

  // 🎯 Función para manejar el clic en "Siguiente"
  const handleNextClick = () => {
    if (!selectedModule) {
      alert('Módulo no cargado');
      return;
    }

    console.log('📋 Total de lecciones:', lessons.length);

    let nextLesson = getNextAvailableLesson();

    if (!nextLesson && lessons.length > 0) {
      nextLesson = lessons.find(l => l.disponible) || lessons[0];
    }

    if (nextLesson) {
      console.log('➡️ Navegando a lección:', nextLesson.titulo);
      console.log('🔑 Lección ID:', nextLesson.id);
      console.log('🔑 Módulo Slug:', selectedModule.slug);

      // ✅ PASAR EL SLUG DEL MÓDULO COMO PARÁMETRO
      router.push({
        pathname: '/(tabs)/(drawer)/lesson/[id]',
        params: {
          id: nextLesson.id.toString(),
          moduleSlug: selectedModule.slug  // ← NUEVO: Pasar el slug
        }
      });
    } else {
      alert('No hay lecciones disponibles en este módulo');
    }
  };

  // ✅ Pantalla principal
  return (
    <View style={{ flex: 1, backgroundColor: '#EAF4FF' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <TopProgressHeader
          title={selectedModule.titulo}
          progress={0}
          activeSlug={slug}
        />

        <WhiteScreenContainer>
          <ModuleHeader />

          {/* Descripción del módulo */}
          <Text style={{
            fontSize: 16,
            lineHeight: 24,
            color: '#374151',
            fontFamily: 'Barlow-Regular',
            marginTop: 16
          }}>
            {selectedModule.descripcion_larga}
          </Text>

          <Text className="text-2xl font-barlow-bold text-secondary mt-6 mb-4">
            Contenido ({selectedModule.total_lecciones} lecciones)
          </Text>

          {/* Mostrar lecciones de la API o placeholder */}
          {(lessons.length > 0 ? lessons : lessonsPlaceholder).map((lesson, index) => (
            <TouchableOpacity
              key={index}
              className="bg-quaternary border border-secondary-200 p-4 rounded-2xl mb-4"
              onPress={() => {
                if ('id' in lesson) {
                  // Lección de la API
                  router.push({
                    pathname: '/(tabs)/(drawer)/lesson/[id]',
                    params: { id: lesson.id.toString() }
                  });
                } else {
                  // Placeholder
                  alert('Lecciones aún no cargadas');
                }
              }}
            >
              <Text className="text-secondary font-barlow-bold text-lg">
                {'titulo' in lesson ? lesson.titulo : lesson.title}
              </Text>
              <Text className="text-secondary-100 mt-1 font-barlow-medium">
                {'desc' in lesson ? lesson.desc : ''}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="bg-primary-200 mt-8 py-4 w-40 self-end rounded-2xl"
            onPress={handleNextClick}
          >
            <Text className="text-center text-quaternary font-barlow-bold text-xl">
              Siguiente
            </Text>
          </TouchableOpacity>
        </WhiteScreenContainer>
      </ScrollView>
    </View>
  );
}