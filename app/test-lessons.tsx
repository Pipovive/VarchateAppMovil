// app/test-lessons.tsx
import { useLessons } from '@/src/context/LessonContext';
import { useEffect } from 'react';
import { Button, Text, View } from 'react-native';

export default function TestLessons() {
  const { lessons, loading, fetchLessons } = useLessons();

  // ✅ Cargar lecciones al montar el componente
  useEffect(() => {
    console.log('🧪 Test: Cargando lecciones...');
    fetchLessons('intro-programacion'); // ← Usa un slug válido
  }, []);

  // ✅ Log cuando lessons cambie
  useEffect(() => {
    console.log('🧪 Test: Lessons actualizadas:', lessons.length);
    lessons.forEach((l, i) => {
      console.log(`  ${i + 1}. ${l.titulo}`);
    });
  }, [lessons]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'white', paddingTop: 60 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Test de Lecciones
      </Text>
      
      {/* Debug info */}
      <View style={{ padding: 12, backgroundColor: '#DBEAFE', borderRadius: 8, marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1E40AF' }}>
          🔍 DEBUG:
        </Text>
        <Text style={{ fontSize: 12, color: '#1E40AF' }}>
          Loading: {loading ? 'SÍ' : 'NO'}
        </Text>
        <Text style={{ fontSize: 12, color: '#1E40AF' }}>
          Lessons length: {lessons.length}
        </Text>
        <Text style={{ fontSize: 12, color: '#1E40AF' }}>
          Is array: {Array.isArray(lessons) ? 'SÍ' : 'NO'}
        </Text>
      </View>

      {/* Botón para recargar */}
      <Button
        title="Recargar lecciones"
        onPress={() => {
          console.log('🔄 Recargando...');
          fetchLessons('intro-programacion');
        }}
      />

      <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 10 }}>
        Lecciones en Context: {lessons.length}
      </Text>

      {loading ? (
        <Text style={{ color: '#6B7280' }}>Cargando...</Text>
      ) : lessons.length > 0 ? (
        lessons.map((lesson, index) => (
          <View key={lesson.id} style={{ padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
              {index + 1}. {lesson.titulo}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              ID: {lesson.id} | Disponible: {lesson.disponible ? 'Sí' : 'No'}
            </Text>
          </View>
        ))
      ) : (
        <Text style={{ color: '#EF4444' }}>
          No hay lecciones cargadas
        </Text>
      )}
    </View>
  );
}
