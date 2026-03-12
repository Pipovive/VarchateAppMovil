import { TopProgressHeader } from "@/components/shared/headerProgress";
import { ModuleHeader } from "@/components/shared/moduleHeader";
import { WhiteScreenContainer } from "@/components/shared/whiteScreenCard";
import { useLessons } from "@/src/context/LessonContext";
import { useCurrentModule } from "@/src/context/ModuleContext";
import { useTheme } from "@/src/context/ThemeContext";
import { getModuleBySlug } from "@/src/services/modulesServices";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import RenderHTML from 'react-native-render-html';


export default function CompetitionScreen() {
  const { width } = useWindowDimensions();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { isDark } = useTheme();
  const scrollRef = React.useRef<ScrollView>(null);


  const colors = {
    background: isDark ? '#1B1D23' : '#EAF4FF',
    loadingText: isDark ? '#9CA3AF' : '#6B7280',
    notFoundText: isDark ? '#F3F4F6' : '#111827',
    sectionTitle: isDark ? '#F9FAFB' : '#1F2937',
    lessonCard: isDark ? '#272B35' : '#FFFFFF',
    lessonBorder: isDark ? '#374151' : '#E5E7EB',
    lessonTitle: isDark ? '#F3F4F6' : '#1F2937',
    emptyBg: isDark ? '#3B2A00' : '#FEF3C7',
    emptyText: isDark ? '#FCD34D' : '#92400E',
    htmlBody: isDark ? '#D1D5DB' : '#374151',
    htmlH: isDark ? '#F9FAFB' : '#1F2937',
    htmlCodeBg: isDark ? '#1F2937' : '#F3F4F6',
    htmlCode: isDark ? '#E5E7EB' : '#1F2937',
  };

  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [moduleLoading, setModuleLoading] = useState(false);

  const { setCurrentModule } = useCurrentModule();
  const { lessons, loading: lessonsLoading, fetchLessons } = useLessons();

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    if (!slug) return;

    setModuleLoading(true);
    getModuleBySlug(slug as string)
      .then((data) => {
        setSelectedModule(data);
        setCurrentModule(data);
        setModuleLoading(false);
      })
      .catch(() => setModuleLoading(false));

    fetchLessons(slug as string);
  }, [slug]);

  if (moduleLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color="#0099FF" />
        <Text style={{ marginTop: 12, color: colors.loadingText }}>Cargando...</Text>
      </View>
    );
  }

  if (!selectedModule) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.notFoundText }}>Módulo no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopProgressHeader
        title={selectedModule.titulo}
        activeSlug={slug as string}
      />
      <ScrollView
        ref={scrollRef}  // ← agregar  // ← agregar
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <WhiteScreenContainer>
          <ModuleHeader />

          <RenderHTML
            contentWidth={width}
            source={{
              html: selectedModule.descripcion_larga
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
            }}
            tagsStyles={{
              body: { fontSize: 16, color: colors.htmlBody },
              p: { marginBottom: 12, marginTop: 0, lineHeight: 24, color: colors.htmlBody },
              h2: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: colors.htmlH },
              h3: { fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 6, color: colors.htmlH },
              ul: { marginTop: 8, marginBottom: 12, paddingLeft: 20 },
              li: { marginBottom: 4, lineHeight: 20, color: colors.htmlBody },
              pre: { backgroundColor: colors.htmlCodeBg, padding: 12, borderRadius: 8, marginTop: 8, marginBottom: 12 },
              code: { fontFamily: 'monospace', fontSize: 14, color: colors.htmlCode },
            }}
            systemFonts={['Barlow-Regular', 'Barlow-Bold']}
            defaultTextProps={{ allowFontScaling: false }}
            enableExperimentalMarginCollapsing
          />

          {/* TÍTULO LECCIONES */}
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.sectionTitle, marginTop: 24, marginBottom: 16 }}>
            Contenido ({lessons.length} lecciones)
          </Text>

          {/* LISTA DE LECCIONES */}
          {lessonsLoading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#0099FF" />
              <Text style={{ color: colors.loadingText, marginTop: 8 }}>Cargando lecciones...</Text>
            </View>
          ) : lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={{
                  backgroundColor: colors.lessonCard,
                  borderWidth: 1,
                  borderColor: colors.lessonBorder,
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
                    params: { id: lesson.id.toString(), moduleSlug: slug as string }
                  });
                }}
                disabled={!lesson.disponible}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.lessonTitle }}>
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
            <View style={{ padding: 20, alignItems: 'center', backgroundColor: colors.emptyBg, borderRadius: 8 }}>
              <Text style={{ color: colors.emptyText, fontSize: 14 }}>No hay lecciones disponibles</Text>
            </View>
          )}

          {/* BOTÓN SIGUIENTE */}
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
              scrollRef.current?.scrollTo({ y: 0, animated: true }); // ← agregar
              const nextLesson = lessons.find(l => l.disponible && !l.vista) ||
                lessons.find(l => l.disponible) ||
                lessons[0];

              if (nextLesson) {
                router.push({
                  pathname: '/(tabs)/(drawer)/lesson/[id]',
                  params: { id: nextLesson.id.toString(), moduleSlug: slug as string }
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