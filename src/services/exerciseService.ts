import api from '../api/api';

// ✅ Obtener ejercicios de una lección
export const getExercises = async (moduloId: number, leccionId: number) => {
    const response = await api.get(`/modulos/${moduloId}/lecciones/${leccionId}/ejercicios`);
    return response.data;
}

// ✅ Enviar respuesta de ejercicio (selección múltiple o verdadero/falso)
export const submitExerciseAnswer = async (
    moduloId: number,
    leccionId: number,
    ejercicioId: number,
    opcionId: number
) => {
    const response = await api.post(
        `/modulos/${moduloId}/lecciones/${leccionId}/ejercicios/${ejercicioId}/intento`,
        { opcion_id: opcionId }
    );
    return response.data;
}

// ✅ Enviar respuesta de ejercicio de arrastrar y soltar
export const submitDragDropAnswer = async (
    moduloId: number,
    leccionId: number,
    ejercicioId: number,
    parejas: Array<{ id_opcion: number; respuesta: string }>
) => {
    console.log("📡 URL FINAL:",
        `/modulos/${moduloId}/lecciones/${leccionId}/ejercicios/${ejercicioId}/intento`
    );
    const response = await api.post(
        `/modulos/${moduloId}/lecciones/${leccionId}/ejercicios/${ejercicioId}/intento`,
        { parejas }
    );
    return response.data;
}

// Interfaz para la respuesta del backend
export interface ExerciseAttemptResponse {
    success: boolean;
    data: {
        ejercicio_id: number;
        es_correcta: boolean;
        feedback: string;
        intento_id: number;
        opcion_correcta: {
            id: number;
            texto: string;
        } | Array<{
            texto: string;
            pareja_correcta: string;
        }>;
        explicacion: string;
    };
}