import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
    getLessonById,
    getLessonNavigation,
    getModuleLessons,
    markLessonAsViewed
} from '../services/lessonServices';

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

interface LessonContextType {
  lessons: Lesson[];
  selectedLesson: LessonDetail | null;
  navigation: any;
  statistics: any;
  loading: boolean;
  error: string | null;
  fetchLessons: (moduleSlug: string) => Promise<any>;
  fetchLessonById: (moduleSlug: string, lessonId: number) => Promise<any>;
  markAsViewed: (moduleSlug: string, lessonId: number) => Promise<any>;
  fetchNavigation: (moduleSlug: string, lessonId: number) => Promise<any>;
  getNextAvailableLesson: () => Lesson | null;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider = ({ children }: { children: ReactNode }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetail | null>(null);
  const [navigation, setNavigation] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const fetchLessons = async (moduleSlug: string) => {
  try {
    setLoading(true);
    setError(null);

    console.log('📡 Context: Fetching lessons for:', moduleSlug);
    const data = await getModuleLessons(moduleSlug);

    console.log('✅ Context: Recibidas', data.lecciones.length, 'lecciones');
    console.log('📋 Context: Primera lección:', data.lecciones[0]?.titulo);
    
    // ✅ Asegúrate de que data.lecciones sea un array
    const leccionesArray = Array.isArray(data.lecciones) ? data.lecciones : [];
    
    setLessons(leccionesArray); // ← Guarda el array
    setStatistics(data.estadisticas);
    
    console.log('💾 Context: setLessons llamado con', leccionesArray.length, 'lecciones');
    
    setLoading(false);

    return data;
  } catch (err: any) {
    console.error('❌ Context: Error fetching lessons:', err);
    setError(err.response?.data?.error || 'Error al cargar lecciones');
    setLessons([]); // ← Limpia en caso de error
    setLoading(false);
    throw err;
  }
};

  const fetchLessonById = async (moduleSlug: string, lessonId: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getLessonById(moduleSlug, lessonId);
      setSelectedLesson(data.leccion);
      setLoading(false);

      return data.leccion;
    } catch (err: any) {
      console.error('❌ Error fetching lesson:', err);
      setError(err.response?.data?.error || 'Error al cargar lección');
      setLoading(false);
      throw err;
    }
  };

  const markAsViewed = async (moduleSlug: string, lessonId: number) => {
    try {
      const data = await markLessonAsViewed(moduleSlug, lessonId);
      
      setLessons(prev =>
        prev.map(l =>
          l.id === lessonId
            ? { ...l, vista: true, estado: 'completada' as const }
            : l
        )
      );

      return data;
    } catch (err: any) {
      console.error('❌ Error marking as viewed:', err);
    }
  };

  const fetchNavigation = async (moduleSlug: string, lessonId: number) => {
    try {
      const data = await getLessonNavigation(moduleSlug, lessonId);
      setNavigation(data);
      return data;
    } catch (err: any) {
      console.error('❌ Error fetching navigation:', err);
      throw err;
    }
  };

  const getNextAvailableLesson = () => {
    return lessons.find(l => l.disponible && !l.vista) || null;
  };

  return (
    <LessonContext.Provider
      value={{
        lessons,
        selectedLesson,
        navigation,
        statistics,
        loading,
        error,
        fetchLessons,
        fetchLessonById,
        markAsViewed,
        fetchNavigation,
        getNextAvailableLesson,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLessons = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLessons debe usarse dentro de LessonProvider');
  }
  return context;
};