import { useState } from 'react';
import {
    getLessonById,
    getLessonNavigation,
    getModuleLessons,
    markLessonAsViewed
} from '../services/lessonServices';

// 📝 Tipos de datos basados en tu API Laravel
interface Lesson {
    id: number;
    titulo: string;
    slug: string;
    orden: number;
    tiene_editor_codigo: boolean;
    tiene_ejercicios: boolean;
    cantidad_ejercicios: number;
    vista: boolean;
    disponible: boolean;
    estado: 'completada' | 'disponible' | 'bloqueada';
}

interface LessonDetail {
    id: number;
    titulo: string;
    slug: string;
    contenido: string;
    orden: number;
    tiene_editor_codigo: boolean;
    tiene_ejercicios: boolean;
    cantidad_ejercicios: number;
    modulo: {
        id: number;
        titulo: string;
        slug: string;
    };
}

interface LessonNavigation {
    anterior: {
        id: number;
        titulo: string;
        slug: string;
    } | null;
    siguiente: {
        id: number;
        titulo: string;
        slug: string;
    } | null;
}

interface LessonsResponse {
    modulo: {
        id: number;
        titulo: string;
        slug: string;
    };
    lecciones: Lesson[];
    total: number;
    estadisticas: {
        vistas: number;
        disponibles: number;
        completadas: number;
    };
}

export const useLessonViewModel = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<LessonDetail | null>(null);
    const [navigation, setNavigation] = useState<LessonNavigation | null>(null);
    const [statistics, setStatistics] = useState<LessonsResponse['estadisticas'] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Obtener todas las lecciones de un módulo
     */
    const fetchLessons = async (moduleSlug: string) => {  // ← Cambiar de number a string
        try {
            setLoading(true);
            setError(null);

            console.log('🚀 Obteniendo lecciones del módulo:', moduleSlug);

            const data: LessonsResponse = await getModuleLessons(moduleSlug);  // ← Enviar slug

            if (!data || !data.lecciones) {
                throw new Error('Formato de datos inválido');
            }

            console.log(`✅ ${data.total} lecciones obtenidas`);
            console.log('📊 Estadísticas:', data.estadisticas);

            setLessons(data.lecciones);
            setStatistics(data.estadisticas);

            return data;

        } catch (err: any) {
            console.error('❌ Error en fetchLessons:', err);

            const errorMessage =
                err?.response?.status === 404 ? 'Módulo no encontrado' :
                    err?.response?.status === 401 ? 'Debes iniciar sesión' :
                        err?.response?.data?.error ||
                        err?.response?.data?.message ||
                        err.message ||
                        'Error al obtener lecciones';

            setError(errorMessage);
            throw err;

        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtener una lección específica por ID
     */
     const fetchLessonById = async (moduleSlug: string, lessonId: number) => {  // ← Cambiar primer parámetro
        try {
            setLoading(true);
            setError(null);
            
            console.log(`🚀 Obteniendo lección ${lessonId} del módulo ${moduleSlug}`);

            const data = await getLessonById(moduleSlug, lessonId);  // ← Enviar slug

            if (!data?.leccion) {
                throw new Error('Lección no encontrada');
            }

            console.log(`✅ Lección obtenida: ${data.leccion.titulo}`);

            setSelectedLesson(data.leccion);
            
            return data.leccion;

        } catch (err: any) {
            console.error('❌ Error en fetchLessonById:', err);
            
            const errorMessage = 
                err?.response?.status === 404 ? 'Lección no encontrada' :
                err?.response?.status === 403 ? err?.response?.data?.error || 'Acceso denegado' :
                err?.response?.status === 401 ? 'Debes iniciar sesión' :
                err?.response?.data?.error || 
                err?.response?.data?.message || 
                err.message || 
                'Error al obtener lección';
            
            setError(errorMessage);
            throw err;

        } finally {
            setLoading(false);
        }
    };

    /**
     * Marcar lección como vista/completada
     */
    const markAsViewed = async (moduleSlug: string, lessonId: number) => {  // ← Cambiar primer parámetro
        try {
            console.log(`✅ Marcando lección ${lessonId} como vista`);

            const data = await markLessonAsViewed(moduleSlug, lessonId);  // ← Enviar slug

            console.log('✅ Lección marcada como vista');

            setLessons(prevLessons => 
                prevLessons.map(lesson => 
                    lesson.id === lessonId 
                        ? { ...lesson, vista: true, estado: 'completada' }
                        : lesson
                )
            );

            return data;

        } catch (err: any) {
            console.error('❌ Error al marcar lección como vista:', err);
        }
    };


    /**
     * Obtener navegación (anterior/siguiente)
     */
    const fetchNavigation = async (moduleSlug: string, lessonId: number) => {  // ← Cambiar primer parámetro
        try {
            console.log(`🧭 Obteniendo navegación para lección ${lessonId}`);

            const data = await getLessonNavigation(moduleSlug, lessonId);  // ← Enviar slug

            console.log('✅ Navegación obtenida:', data);

            setNavigation(data);
            
            return data;

        } catch (err: any) {
            console.error('❌ Error al obtener navegación:', err);
            throw err;
        }
    };


    /**
     * Obtener lección siguiente disponible
     */
    const getNextAvailableLesson = () => {
        const nextLesson = lessons.find(
            lesson => lesson.disponible && !lesson.vista
        );
        return nextLesson || null;
    };

    /**
     * Calcular progreso del módulo
     */
    const getModuleProgress = () => {
        if (lessons.length === 0) return 0;

        const completadas = lessons.filter(l => l.vista).length;
        return Math.round((completadas / lessons.length) * 100);
    };

    /**
     * Verificar si una lección está disponible
     */
    const isLessonAvailable = (lessonId: number) => {
        const lesson = lessons.find(l => l.id === lessonId);
        return lesson?.disponible || false;
    };

    /**
     * Obtener lección por orden
     */
    const getLessonByOrder = (order: number) => {
        return lessons.find(l => l.orden === order) || null;
    };

    return {
        // Estados
        lessons,
        selectedLesson,
        navigation,
        statistics,
        loading,
        error,

        // Funciones
        fetchLessons,
        fetchLessonById,
        markAsViewed,
        fetchNavigation,
        getNextAvailableLesson,
        getModuleProgress,
        isLessonAvailable,
        getLessonByOrder,
    };
};