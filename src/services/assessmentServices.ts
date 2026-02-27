import api from '../api/api';

// ==================== INTERFACES ====================

export interface OpcionEvaluacion {
    id: number;
    texto: string;
    orden: number;
    pareja_arrastre: string | null;
}

export interface PreguntaEvaluacion {
    id: number;
    pregunta: string;
    tipo: 'seleccion_multiple' | 'verdadero_falso' | 'arrastrar_soltar';
    puntos: number;
    orden: number;
    opciones: OpcionEvaluacion[];
    instrucciones: string;
}

export interface IntentoEvaluacion {
    intento_id: number;
    evaluacion_id: number;
    modulo_id: number;
    fecha_inicio: string;
    tiempo_limite_minutos: number;
    tiempo_limite_segundos: number;
    puntaje_minimo: number;
    numero_preguntas: number;
    preguntas: PreguntaEvaluacion[];
    intento_numero: number;
}

export interface RespuestaEvaluacion {
    respuesta_id: number;
    pregunta_id: number;
    es_correcta: boolean;
    puntos_obtenidos: string;
    mensaje: string;
}

export interface ResultadoFinal {
    intento_id: number;
    evaluacion_id: number;
    fecha_fin: string;
    tiempo_utilizado_segundos: number;
    tiempo_utilizado_minutos: number;
    puntuacion_total: number;
    porcentaje_obtenido: number;
    preguntas_correctas: number;
    preguntas_incorrectas: number;
    preguntas_totales: number;
    aprobado: boolean;
    puntaje_minimo: number;
    mensaje: string;
    certificacion?: {
        disponible: boolean;
        modulo_id: number;
        mensaje: string;
    };
}

export interface DetalleResultado {
    intento: {
        id: number;
        intento_numero: number;
        fecha_inicio: string;
        fecha_fin: string;
        tiempo_utilizado_segundos: number;
        tiempo_utilizado_minutos: number;
        estado: string;
    };
    resultados: {
        puntuacion_total: number;
        porcentaje_obtenido: number;
        preguntas_correctas: number;
        preguntas_incorrectas: number;
        preguntas_totales: number;
        aprobado: boolean;
        puntaje_minimo_requerido: number;
    };
    evaluacion: {
        id: number;
        titulo: string;
        descripcion: string;
    };
    modulo: {
        id: string;
        titulo: string;
    };
    respuestas_detalladas: any[];
    recomendaciones: {
        mensaje: string;
        siguiente_paso: string;
    };
}

// ==================== SERVICIOS ====================

/**
 * Iniciar una nueva evaluación
 * POST /modulos/{moduloId}/evaluacion/iniciar
 */
export const iniciarEvaluacion = async (moduloId: number) => {
    const response = await api.post(`/modulos/${moduloId}/evaluacion/iniciar`);
    return response.data;
};

/**
 * Obtener estado de la evaluación
 * GET /modulos/{moduloId}/evaluacion/estado
 */
export const obtenerEstadoEvaluacion = async (moduloId: number) => {
    const response = await api.get(`/modulos/${moduloId}/evaluacion/estado`);
    return response.data;
};

/**
 * Obtener intento en progreso
 * GET /modulos/{moduloId}/evaluacion/en-progreso
 */
export const obtenerIntentoEnProgreso = async (moduloId: number) => {
    const response = await api.get(`/modulos/${moduloId}/evaluacion/en-progreso`);
    return response.data;
};

/**
 * Guardar respuesta de selección múltiple o verdadero/falso
 * POST /modulos/{moduloId}/evaluacion/{intentoId}/respuesta
 */
export const guardarRespuesta = async (
    moduloId: number,
    intentoId: number,
    preguntaId: number,
    opcionId: number
) => {
    const response = await api.post(
        `/modulos/${moduloId}/evaluacion/${intentoId}/respuesta`,
        {
            pregunta_id: preguntaId,
            opcion_id: opcionId
        }
    );
    return response.data;
};

/**
 * Guardar respuesta de arrastrar y soltar
 * POST /modulos/{moduloId}/evaluacion/{intentoId}/respuesta
 */
export const guardarRespuestaArrastrar = async (
    moduloId: number,
    intentoId: number,
    preguntaId: number,
    parejas: Array<{ id_opcion: number; pareja: string }>
) => {
    const response = await api.post(
        `/modulos/${moduloId}/evaluacion/${intentoId}/respuesta`,
        {
            pregunta_id: preguntaId,
            parejas: parejas
        }
    );
    return response.data;
};

/**
 * Finalizar evaluación
 * POST /modulos/{moduloId}/evaluacion/{intentoId}/finalizar
 */
export const finalizarEvaluacion = async (moduloId: number, intentoId: number) => {
    const response = await api.post(`/modulos/${moduloId}/evaluacion/${intentoId}/finalizar`);
    return response.data;
};

/**
 * Obtener resultado de intento
 * GET /modulos/{moduloId}/evaluacion/{intentoId}/resultado
 */
export const obtenerResultadoIntento = async (moduloId: number, intentoId: number) => {
    const response = await api.get(`/modulos/${moduloId}/evaluacion/${intentoId}/resultado`);
    return response.data;
};