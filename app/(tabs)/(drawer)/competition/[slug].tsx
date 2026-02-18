import { TopProgressHeader } from "@/components/shared/headerProgress";
import { ModuleHeader } from "@/components/shared/moduleHeader";
import { WhiteScreenContainer } from "@/components/shared/whiteScreenCard";
import { useLessons } from "@/src/context/LessonContext";
import { getModuleBySlug } from "@/src/services/modulesServices";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function CompetitionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [moduleLoading, setModuleLoading] = useState(false);

  const { lessons, loading: lessonsLoading, fetchLessons } = useLessons();

  useEffect(() => {
    if (!slug) return;

    // Cargar módulo
    setModuleLoading(true);
    getModuleBySlug(slug as string)
      .then((data) => {
        setSelectedModule(data);
        setModuleLoading(false);
      })
      .catch(() => setModuleLoading(false));

    // Cargar lecciones
    fetchLessons(slug as string);

  }, [slug]);

  if (moduleLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EAF4FF' }}>
        <ActivityIndicator size="large" color="#0099FF" />
        <Text style={{ marginTop: 12, color: '#6B7280' }}>Cargando...</Text>
      </View>
    );
  }

  if (!selectedModule) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Módulo no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#EAF4FF' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <TopProgressHeader
          title={selectedModule.titulo}
          activeSlug={slug as string}
        />

        <WhiteScreenContainer>
          <ModuleHeader />

          <Text style={{
            fontSize: 16,
            lineHeight: 24,
            color: '#374151',
            fontFamily: 'Barlow-Regular',
            marginTop: 16
          }}>
            {selectedModule.descripcion_larga}
          </Text>

          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginTop: 24, marginBottom: 16 }}>
            Contenido ({lessons.length} lecciones)
          </Text>

          {lessonsLoading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#0099FF" />
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Cargando lecciones...</Text>
            </View>
          ) : lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  padding: 16,
                  borderRadius: 16,
                  marginBottom: 16,
                  opacity: lesson.disponible ? 1 : 0.5
                }}
                onPress={() => {
                  if (!lesson.disponible) {
                    alert('Esta lección no está disponible aún');
                    return;
                  }
                  router.push({
                    pathname: '/(tabs)/(drawer)/lesson/[id]',
                    params: {
                      id: lesson.id.toString(),
                      moduleSlug: slug as string
                    }
                  });
                }}
                disabled={!lesson.disponible}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937' }}>
                  {index + 1}. {lesson.titulo}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                  {lesson.vista && (
                    <View style={{ backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ fontSize: 10, color: '#FFF', fontWeight: '600' }}>✓ COMPLETADA</Text>
                    </View>
                  )}
                  {!lesson.disponible && (
                    <View style={{ backgroundColor: '#9CA3AF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ fontSize: 10, color: '#FFF', fontWeight: '600' }}>🔒 BLOQUEADA</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#FEF3C7', borderRadius: 8 }}>
              <Text style={{ color: '#92400E', fontSize: 14 }}>No hay lecciones disponibles</Text>
            </View>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: '#0099FF',
              marginTop: 32,
              paddingVertical: 16,
              width: 160,
              alignSelf: 'flex-end',
              borderRadius: 16,
              opacity: lessons.length === 0 ? 0.5 : 1
            }}
            onPress={() => {
              const nextLesson = lessons.find(l => l.disponible && !l.vista) ||
                lessons.find(l => l.disponible) ||
                lessons[0];

              if (nextLesson) {
                router.push({
                  pathname: '/(tabs)/(drawer)/lesson/[id]',
                  params: {
                    id: nextLesson.id.toString(),
                    moduleSlug: slug as string
                  }
                });
              } else {
                alert('No hay lecciones disponibles');
              }
            }}
            disabled={lessons.length === 0}
          >
            <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 18 }}>
              Siguiente
            </Text>
          </TouchableOpacity>
        </WhiteScreenContainer>
      </ScrollView>
    </View>
  );
}