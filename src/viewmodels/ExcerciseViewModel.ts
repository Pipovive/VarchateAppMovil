import { useState } from 'react';
import {
    ExerciseAttemptResponse,
    getExercises,
    submitDragDropAnswer,
    submitExerciseAnswer
} from '../services/exerciseService';

// Interfaces
interface Opcion {
  id: number;
  texto: string;
  orden: number;
  pareja_arrastre: string | null;
}

interface Ejercicio {
  id: number;
  pregunta: string;
  tipo: 'seleccion_multiple' | 'verdadero_falso' | 'arrastrar_soltar' | 'llenar_espacios';
  orden: number;
  opciones: Opcion[];
  instrucciones: string;
}

interface Leccion {
  id: number;
  titulo: string;
  orden: number;
}

interface Modulo {
  id: number;
  titulo: string;
  slug: string;
}

interface ExerciseData {
  tiene_ejercicios: boolean;
  cantidad_ejercicios: number;
  leccion: Leccion;
  modulo: Modulo;
  ejercicios: Ejercicio[];
}

interface RespuestaIntento {
  ejercicio_id: number;
  es_correcta: boolean;
  feedback: string;
  intento_id: number;
  opcion_correcta: any;
  explicacion: string;
}

export const useExerciseViewModel = () => {
  const [exerciseData, setExerciseData] = useState<ExerciseData | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<RespuestaIntento | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Obtener ejercicios de una lección
  const fetchExercises = async (moduloId: number, leccionId: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log('📡 Obteniendo ejercicios:', { moduloId, leccionId });

      const response = await getExercises(moduloId, leccionId);

      if (response.success && response.data) {
        console.log('✅ Ejercicios obtenidos:', response.data.cantidad_ejercicios);
        setExerciseData(response.data);
        return response.data;
      } else {
        throw new Error('No se pudieron obtener los ejercicios');
      }

    } catch (err: any) {
      console.error('❌ Error en fetchExercises:', err);
      const errorMessage = err?.response?.data?.message || 'Error al cargar ejercicios';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Enviar respuesta de ejercicio (selección múltiple o verdadero/falso)
  const submitAnswer = async (
    moduloId: number,
    leccionId: number,
    ejercicioId: number,
    opcionId: number
  ) => {
    try {
      setSubmitting(true);
      setError(null);

      console.log('📤 Enviando respuesta:', { moduloId, leccionId, ejercicioId, opcionId });

      const response: ExerciseAttemptResponse = await submitExerciseAnswer(
        moduloId,
        leccionId,
        ejercicioId,
        opcionId
      );

      if (response.success && response.data) {
        console.log('✅ Respuesta enviada:', response.data.es_correcta ? 'Correcta' : 'Incorrecta');
        setCurrentAttempt(response.data);
        return response.data;
      } else {
        throw new Error('No se pudo enviar la respuesta');
      }

    } catch (err: any) {
      console.error('❌ Error en submitAnswer:', err);
      const errorMessage = err?.response?.data?.message || 'Error al enviar respuesta';
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Enviar respuesta de arrastrar y soltar
  const submitDragDrop = async (
    moduloId: number,
    leccionId: number,
    ejercicioId: number,
    parejas: Array<{ id_opcion: number; respuesta: string }>
  ) => {
    try {
      setSubmitting(true);
      setError(null);

      console.log('📤 Enviando parejas:', { moduloId, leccionId, ejercicioId, parejas });

      const response: ExerciseAttemptResponse = await submitDragDropAnswer(
        moduloId,
        leccionId,
        ejercicioId,
        parejas
      );

      if (response.success && response.data) {
        console.log('✅ Parejas enviadas:', response.data.es_correcta ? 'Correctas' : 'Incorrectas');
        setCurrentAttempt(response.data);
        return response.data;
      } else {
        throw new Error('No se pudieron enviar las parejas');
      }

    } catch (err: any) {
      console.error('❌ Error en submitDragDrop:', err);
      const errorMessage = err?.response?.data?.message || 'Error al enviar parejas';
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Limpiar intento actual (para siguiente ejercicio)
  const clearCurrentAttempt = () => {
    setCurrentAttempt(null);
  };

  // ✅ Reiniciar todo (para recargar ejercicios)
  const reset = () => {
    setExerciseData(null);
    setCurrentAttempt(null);
    setError(null);
  };

  return {
    // Estados
    exerciseData,
    currentAttempt,
    loading,
    submitting,
    error,
    
    // Métodos
    fetchExercises,
    submitAnswer,
    submitDragDrop,
    clearCurrentAttempt,
    reset,
  };
};