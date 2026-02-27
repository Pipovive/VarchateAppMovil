import { ExerciseButton } from '@/components/exercises/ExerciseButton';
import { TopProgressHeader } from '@/components/shared/headerProgress';
import { WhiteScreenContainer } from '@/components/shared/whiteScreenCard';
import { useLessons } from "@/src/context/LessonContext"; // ← CAMBIAR IMPORT
import { useCurrentModule } from '@/src/context/ModuleContext';
import { getModuleBySlug } from "@/src/services/modulesServices";
import { useExerciseViewModel } from '@/src/viewmodels/ExcerciseViewModel';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const LessonDetailScreen = () => {
    const router = useRouter();

    const { id, moduleSlug } = useLocalSearchParams<{
        id: string;
        moduleSlug?: string;
    }>();

    const { currentModule, setCurrentModule } = useCurrentModule(); // ← IMPORTAR DESDE CONTEXT
    const {
        selectedLesson,
        navigation,
        loading,
        error,
        fetchLessonById,
        fetchNavigation,
        markAsViewed
    } = useLessons();
    const { exerciseData, fetchExercises } = useExerciseViewModel();
    const [hasRealExercises, setHasRealExercises] = useState(false);
    const [checkingExercises, setCheckingExercises] = useState(false);

    useEffect(() => {
        // ✅ SIEMPRE verificar, sin importar lo que diga el backend
        if (selectedLesson && selectedLesson.modulo?.id) {
            setCheckingExercises(true);

            fetchExercises(selectedLesson.modulo.id, selectedLesson.id)
                .then((data) => {
                    console.log('✅ Ejercicios encontrados:', data.ejercicios.length);
                    setHasRealExercises(data.ejercicios.length > 0);
                })
                .catch((err) => {
                    console.log('⚠️ No hay ejercicios o error:', err);
                    setHasRealExercises(false);
                })
                .finally(() => {
                    setCheckingExercises(false);
                });
        }
    }, [selectedLesson]);
    // ✅ UN SOLO useEffect (eliminar el duplicado)
    useEffect(() => {
        if (id) {
            const lessonId = parseInt(id, 10);
            const slug = moduleSlug || currentModule?.slug;

            if (!slug) {
                console.log('❌ No hay slug de módulo disponible');
                return;
            }

            console.log('═══════════════════════════════════');
            console.log('🚀 CARGANDO LECCIÓN');
            console.log('Lección ID:', lessonId);
            console.log('Módulo Slug (param):', moduleSlug);
            console.log('Módulo Slug (context):', currentModule?.slug);
            console.log('Usando slug:', slug);
            console.log('═══════════════════════════════════');

            fetchLessonById(slug, lessonId)
                .then((lesson) => {
                    console.log('✅ Lección cargada:', lesson.titulo);
                })
                .catch((error) => {
                    console.log('❌ Error al cargar lección:', error.response?.data);

                    // Si la lección no existe en este módulo, volver al inicio
                    if (error.response?.status === 404) {
                        console.log('🔙 Lección no encontrada, volviendo al módulo');
                        setTimeout(() => {
                            router.replace(`/(tabs)/(drawer)/competition/${slug}`);
                        }, 1500);
                    }
                });

            // Intentar cargar navegación (pero no fallar si da error)
            fetchNavigation(slug, lessonId).catch((err) => {
                console.log('⚠️ No se pudo cargar navegación (no crítico)');
            });
        }
    }, [id, moduleSlug]);
    useEffect(() => {
        if (selectedLesson && selectedLesson.modulo.slug) {
            console.log('💾 Cargando módulo completo:', selectedLesson.modulo.slug);

            getModuleBySlug(selectedLesson.modulo.slug)
                .then((module) => {
                    console.log('✅ Módulo completo cargado:', module.titulo);
                    setCurrentModule(module);
                })
                .catch((err) => {
                    console.log('⚠️ No se pudo cargar módulo completo:', err);
                });
        }
    }, [selectedLesson]);

    const handleScrollEnd = () => {
        if (selectedLesson) {
            const slug = moduleSlug || currentModule?.slug;

            if (slug) {
                console.log('✅ Marcando como vista...');
                markAsViewed(slug, selectedLesson.id);
            }
            console.log('🔍 selectedLesson.modulo:', selectedLesson.modulo);
        }

    };

    console.log('🔍 selectedLesson completo:', selectedLesson);
    console.log('🔍 tiene_ejercicios:', selectedLesson?.tiene_ejercicios);
    console.log('🔍 cantidad_ejercicios:', selectedLesson?.cantidad_ejercicios);
    console.log('🔍 modulo:', selectedLesson?.modulo);
    console.log('🔍 modulo.id:', selectedLesson?.modulo?.id);

    if (loading && !selectedLesson) {
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
                    Cargando lección...
                </Text>
            </View>
        );
    }

    if (error && !selectedLesson) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#EAF4FF',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24
            }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>🔒</Text>
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
                    onPress={() => router.back()}
                    style={{
                        backgroundColor: '#0099FF',
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 8
                    }}
                >
                    <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                        Volver
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!selectedLesson) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Lección no encontrada</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#EAF4FF' }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }}
                showsVerticalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                    const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

                    if (isEndReached) {
                        handleScrollEnd();
                    }
                }}
            >
                <TopProgressHeader
                    title={selectedLesson.titulo}
                    activeSlug={selectedLesson.modulo.slug}  // ← Usa el slug del MÓDULO, no de la lección
                />

                <WhiteScreenContainer>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 16
                    }}>
                        <Text style={{ fontSize: 14, color: '#6B7280' }}>
                            {selectedLesson.modulo.titulo}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6B7280', marginHorizontal: 8 }}>
                            →
                        </Text>
                        <Text style={{ fontSize: 14, color: '#0099FF', fontWeight: '600' }}>
                            Lección {selectedLesson.orden}
                        </Text>
                    </View>

                    <Text style={{
                        fontSize: 28,
                        fontFamily: 'Barlow-Bold',
                        color: '#1F2937',
                        marginBottom: 16
                    }}>
                        {selectedLesson.titulo}
                    </Text>

                    <View style={{ marginTop: 16 }}>
                        <Text style={{
                            fontSize: 16,
                            lineHeight: 28,
                            color: '#374151',
                            fontFamily: 'Barlow-Regular'
                        }}>
                            {selectedLesson.contenido}
                        </Text>
                    </View>

                    {/* Badges informativos */}
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 24,
                        gap: 8
                    }}>
                        {selectedLesson.tiene_editor_codigo && (
                            <View style={{
                                backgroundColor: '#DBEAFE',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 12
                            }}>
                                <Text style={{ fontSize: 12, color: '#1E40AF', fontWeight: '600' }}>
                                    💻 Editor de código
                                </Text>
                            </View>
                        )}

                        {selectedLesson.tiene_ejercicios && (
                            <View style={{
                                backgroundColor: '#FEF3C7',
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 12
                            }}>
                                <Text style={{ fontSize: 12, color: '#92400E', fontWeight: '600' }}>
                                    📝 {selectedLesson.cantidad_ejercicios} ejercicios
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Botón de ejercicios - FUERA del View anterior */}
                    {hasRealExercises && (
                        <ExerciseButton
                            cantidadEjercicios={exerciseData?.ejercicios.length || 0}
                            moduloId={selectedLesson.modulo.id}
                            leccionId={selectedLesson.id}
                        />
                    )}

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 32,
                        gap: 12
                    }}>
                        {navigation?.anterior ? (
                            <TouchableOpacity
                                onPress={() => {
                                    if (navigation.anterior) {
                                        const slug = moduleSlug || currentModule?.slug;
                                        console.log('⬅️ Navegando a lección anterior:', navigation.anterior.id);

                                        router.push({
                                            pathname: '/(tabs)/(drawer)/lesson/[id]',
                                            params: {
                                                id: navigation.anterior.id.toString(),
                                                moduleSlug: slug
                                            }
                                        });
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#E5E7EB',
                                    paddingVertical: 16,
                                    paddingHorizontal: 20,
                                    borderRadius: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >

                                <Text style={{ fontSize: 20, marginRight: 8 }}>←</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 12, color: '#6B7280' }}>Anterior</Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: '#1F2937',
                                            fontWeight: '600',
                                            marginTop: 2
                                        }}
                                        numberOfLines={1}
                                    >
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
                                    if (navigation.siguiente) {
                                        const slug = moduleSlug || currentModule?.slug;
                                        console.log('➡️ Navegando a lección siguiente:', navigation.siguiente.id);

                                        router.push({
                                            pathname: '/(tabs)/(drawer)/lesson/[id]',
                                            params: {
                                                id: navigation.siguiente.id.toString(),
                                                moduleSlug: slug
                                            }
                                        });
                                    }
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
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: '#FFFFFF',
                                            fontWeight: '600',
                                            marginTop: 2
                                        }}
                                        numberOfLines={1}
                                    >
                                        {navigation.siguiente.titulo}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 20, marginLeft: 8, color: '#FFF' }}>→</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('🎉 Módulo completado, ir a evaluación');
                                    router.push('/(tabs)/(drawer)/evaluate');
                                }}
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