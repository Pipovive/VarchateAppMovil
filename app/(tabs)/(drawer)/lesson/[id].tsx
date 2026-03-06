import { ExerciseButton } from '@/components/exercises/ExerciseButton';
import { TopProgressHeader } from '@/components/shared/headerProgress';
import { WhiteScreenContainer } from '@/components/shared/whiteScreenCard';
import { useLessons } from "@/src/context/LessonContext";
import { useCurrentModule } from '@/src/context/ModuleContext';
import { useTheme } from '@/src/context/ThemeContext';
import { getModuleBySlug } from "@/src/services/modulesServices";
import { useExerciseViewModel } from '@/src/viewmodels/ExcerciseViewModel';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHTML from 'react-native-render-html';

import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const LessonDetailScreen = () => {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const { isDark } = useTheme();
    const { id, moduleSlug } = useLocalSearchParams<{ id: string; moduleSlug?: string }>();

    const { currentModule, setCurrentModule } = useCurrentModule();
    const { selectedLesson, navigation, loading, error, fetchLessonById, fetchNavigation, markAsViewed } = useLessons();
    const { exerciseData, fetchExercises } = useExerciseViewModel();
    const [hasRealExercises, setHasRealExercises] = useState(false);
    const [checkingExercises, setCheckingExercises] = useState(false);

    const colors = {
        background:       isDark ? '#1B1D23' : '#EAF4FF',
        card:             isDark ? '#272B35' : '#FFFFFF',
        text:             isDark ? '#F9FAFB' : '#1F2937',
        subtext:          isDark ? '#9CA3AF' : '#6B7280',
        accent:           '#0099FF',
        accentLight:      isDark ? '#1E3A5F' : '#DBEAFE',
        accentLightText:  isDark ? '#93C5FD' : '#1E40AF',
        breadcrumb:       isDark ? '#9CA3AF' : '#6B7280',
        navPrevBg:        isDark ? '#374151' : '#E5E7EB',
        navPrevText:      isDark ? '#F3F4F6' : '#1F2937',
        navPrevSub:       isDark ? '#9CA3AF' : '#6B7280',
        badgeEditorBg:    isDark ? '#1E3A5F' : '#DBEAFE',
        badgeEditorText:  isDark ? '#93C5FD' : '#1E40AF',
        badgeExBg:        isDark ? '#3B2A00' : '#FEF3C7',
        badgeExText:      isDark ? '#FCD34D' : '#92400E',
        htmlP:            isDark ? '#D1D5DB' : '#374151',
        htmlH:            isDark ? '#F9FAFB' : '#1F2937',
        htmlCode:         isDark ? '#E5E7EB' : '#1F2937',
        htmlCodeBg:       isDark ? '#1F2937' : '#F3F4F6',
        errorText:        isDark ? '#FCA5A5' : '#EF4444',
    };

    useEffect(() => {
        if (selectedLesson && selectedLesson.modulo?.id) {
            setCheckingExercises(true);
            fetchExercises(selectedLesson.modulo.id, selectedLesson.id)
                .then((data) => setHasRealExercises(data.ejercicios.length > 0))
                .catch(() => setHasRealExercises(false))
                .finally(() => setCheckingExercises(false));
        }
    }, [selectedLesson]);

    useEffect(() => {
        if (id) {
            const lessonId = parseInt(id, 10);
            const slug = moduleSlug || currentModule?.slug;
            if (!slug) return;

            fetchLessonById(slug, lessonId)
                .catch((error) => {
                    if (error.response?.status === 404) {
                        setTimeout(() => router.replace(`/(tabs)/(drawer)/competition/${slug}`), 1500);
                    }
                });

            fetchNavigation(slug, lessonId).catch(() => {});
        }
    }, [id, moduleSlug]);

    useEffect(() => {
        if (selectedLesson && selectedLesson.modulo.slug) {
            getModuleBySlug(selectedLesson.modulo.slug)
                .then((module) => setCurrentModule(module))
                .catch(() => {});
        }
    }, [selectedLesson]);

    const handleScrollEnd = () => {
        if (selectedLesson) {
            const slug = moduleSlug || currentModule?.slug;
            if (slug) markAsViewed(slug, selectedLesson.id);
        }
    };

    // --- LOADING STATE ---
    if (loading && !selectedLesson) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0099FF" />
                <Text style={{ marginTop: 12, fontSize: 16, color: colors.subtext, fontFamily: 'Barlow-Medium' }}>
                    Cargando lección...
                </Text>
            </View>
        );
    }

    // --- ERROR STATE ---
    if (error && !selectedLesson) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>🔒</Text>
                <Text style={{ fontSize: 18, color: colors.errorText, marginBottom: 16, textAlign: 'center', fontFamily: 'Barlow-SemiBold' }}>
                    {error}
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ backgroundColor: '#0099FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
                >
                    <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- NOT FOUND STATE ---
    if (!selectedLesson) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colors.subtext }}>Lección no encontrada</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }}
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
                        handleScrollEnd();
                    }
                }}
            >
                <TopProgressHeader
                    title={selectedLesson.titulo}
                    activeSlug={selectedLesson.modulo.slug}
                />

                <WhiteScreenContainer>
                    {/* BREADCRUMB */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={{ fontSize: 14, color: colors.breadcrumb }}>
                            {selectedLesson.modulo.titulo}
                        </Text>
                        <Text style={{ fontSize: 14, color: colors.breadcrumb, marginHorizontal: 8 }}>→</Text>
                        <Text style={{ fontSize: 14, color: colors.accent, fontWeight: '600' }}>
                            Lección {selectedLesson.orden}
                        </Text>
                    </View>

                    {/* TÍTULO */}
                    <Text style={{ fontSize: 28, fontFamily: 'Barlow-Bold', color: colors.text, marginBottom: 16 }}>
                        {selectedLesson.titulo}
                    </Text>

                    {/* CONTENIDO HTML */}
                    <View style={{ marginTop: 16 }}>
                        <RenderHTML
                            contentWidth={width}
                            source={{
                                html: selectedLesson.contenido
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&amp;/g, '&')
                                    .replace(/&quot;/g, '"')
                            }}
                            tagsStyles={{
                                p:    { fontSize: 16, lineHeight: 24, color: colors.htmlP, marginBottom: 12 },
                                h2:   { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: colors.htmlH },
                                h3:   { fontSize: 18, fontWeight: 'bold', marginTop: 12, marginBottom: 6, color: colors.htmlH },
                                ul:   { marginTop: 8, marginBottom: 12, paddingLeft: 20 },
                                li:   { marginBottom: 4, lineHeight: 20, color: colors.htmlP },
                                pre:  { backgroundColor: colors.htmlCodeBg, padding: 12, borderRadius: 8, marginBottom: 12 },
                                code: { fontFamily: 'monospace', fontSize: 14, color: colors.htmlCode },
                            }}
                            defaultTextProps={{ allowFontScaling: false }}
                        />
                    </View>

                    {/* BADGES */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 24, gap: 8 }}>
                        {selectedLesson.tiene_editor_codigo && (
                            <View style={{ backgroundColor: colors.badgeEditorBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                                <Text style={{ fontSize: 12, color: colors.badgeEditorText, fontWeight: '600' }}>
                                    💻 Editor de código
                                </Text>
                            </View>
                        )}
                        {selectedLesson.tiene_ejercicios && (
                            <View style={{ backgroundColor: colors.badgeExBg, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
                                <Text style={{ fontSize: 12, color: colors.badgeExText, fontWeight: '600' }}>
                                    📝 {selectedLesson.cantidad_ejercicios} ejercicios
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* BOTÓN EJERCICIOS */}
                    {hasRealExercises && (
                        <ExerciseButton
                            cantidadEjercicios={exerciseData?.ejercicios.length || 0}
                            moduloId={selectedLesson.modulo.id}
                            leccionId={selectedLesson.id}
                        />
                    )}

                    {/* NAVEGACIÓN */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 32, gap: 12 }}>

                        {navigation?.anterior ? (
                            <TouchableOpacity
                                onPress={() => {
                                    const slug = moduleSlug || currentModule?.slug;
                                    router.push({
                                        pathname: '/(tabs)/(drawer)/lesson/[id]',
                                        params: { id: navigation.anterior!.id.toString(), moduleSlug: slug }
                                    });
                                }}
                                style={{
                                    flex: 1,
                                    backgroundColor: colors.navPrevBg,
                                    paddingVertical: 16,
                                    paddingHorizontal: 20,
                                    borderRadius: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ fontSize: 20, marginRight: 8, color: colors.navPrevText }}>←</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 12, color: colors.navPrevSub }}>Anterior</Text>
                                    <Text style={{ fontSize: 14, color: colors.navPrevText, fontWeight: '600', marginTop: 2 }} numberOfLines={1}>
                                        {navigation.anterior.titulo}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={{ flex: 1 }} />
                        )}

                        {navigation?.siguiente ? (
                            <TouchableOpacity
                                onPress={() => {
                                    const slug = moduleSlug || currentModule?.slug;
                                    router.push({
                                        pathname: '/(tabs)/(drawer)/lesson/[id]',
                                        params: { id: navigation.siguiente!.id.toString(), moduleSlug: slug }
                                    });
                                }}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#0099FF',
                                    paddingVertical: 16,
                                    paddingHorizontal: 20,
                                    borderRadius: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 12, color: '#DBEAFE' }}>Siguiente</Text>
                                    <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: '600', marginTop: 2 }} numberOfLines={1}>
                                        {navigation.siguiente.titulo}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 20, marginLeft: 8, color: '#FFF' }}>→</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/(drawer)/evaluate')}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#10B981',
                                    paddingVertical: 16,
                                    paddingHorizontal: 20,
                                    borderRadius: 12,
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>
                                    Ir a Evaluación 🎯
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </WhiteScreenContainer>
            </ScrollView>
        </View>
    );
};

export default LessonDetailScreen;