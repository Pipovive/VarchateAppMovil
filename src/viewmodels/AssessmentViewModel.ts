import { useState } from 'react';
import {
    DetalleResultado,
    finalizarEvaluacion,
    guardarRespuesta,
    guardarRespuestaArrastrar,
    iniciarEvaluacion,
    IntentoEvaluacion,
    obtenerEstadoEvaluacion,
    obtenerIntentoEnProgreso,
    obtenerResultadoIntento,
    PreguntaEvaluacion,
    ResultadoFinal
} from '../services/assessmentServices';

export type EstadoBoton =
    | 'disponible'       // Puede iniciar nuevo intento
    | 'en_progreso'      // Tiene intento activo → reanudar
    | 'sin_intentos'     // Agotó los intentos y aún en cooldown
    | 'aprobado'         // Ya aprobó
    | 'cargando';        // Consultando estado inicial

export interface EstadoEvaluacionUsuario {
    puede_intentar: boolean;
    mensaje: string;
    intentos_completados: number;
    intentos_disponibles: number;
    tiene_intento_en_progreso: boolean;
    intento_en_progreso_id: number | null;
    ya_aprobo: boolean;
    mejor_porcentaje: string;
}

export const useAssessmentViewModel = () => {
    const [intentoActual, setIntentoActual] = useState<IntentoEvaluacion | null>(null);
    const [preguntaActualIndex, setPreguntaActualIndex] = useState(0);
    const [respuestasGuardadas, setRespuestasGuardadas] = useState<Record<number, number | any>>({});
    const [resultadoFinal, setResultadoFinal] = useState<ResultadoFinal | null>(null);
    const [detalleResultado, setDetalleResultado] = useState<DetalleResultado | null>(null);
    const [estadoUsuario, setEstadoUsuario] = useState<EstadoEvaluacionUsuario | null>(null);
    const [estadoBoton, setEstadoBoton] = useState<EstadoBoton>('cargando');

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tiempoRestante, setTiempoRestante] = useState<number>(0);

    /**
     * Consulta el estado del usuario y decide si iniciar, reanudar o bloquear.
     * Llama a esto al abrir el modal en lugar de startAssessment directamente.
     */
    const loadAssessment = async (moduloId: number): Promise<'iniciado' | 'reanudado'> => {
        try {
            setLoading(true);
            setError(null);
            // Limpiar intento anterior sin usar reset() completo
            setIntentoActual(null);
            setResultadoFinal(null);
            setPreguntaActualIndex(0);
            setRespuestasGuardadas({});
            const estadoResp = await obtenerEstadoEvaluacion(moduloId);

            if (!estadoResp.success || !estadoResp.data) {
                throw new Error('No se pudo obtener el estado de la evaluación');
            }

            const estado: EstadoEvaluacionUsuario = estadoResp.data.estado_usuario;
            setEstadoUsuario(estado);

            // Caso 1: Ya aprobó
            if (estado.ya_aprobo) {
                setEstadoBoton('aprobado');
                const err: any = new Error(estado.mensaje || 'Ya has aprobado esta evaluación');
                err._tipo = 'informativo';
                throw err;
            }

            // Caso 2: No puede intentar (sin intentos disponibles / cooldown)
            if (!estado.puede_intentar && !estado.tiene_intento_en_progreso) {
                setEstadoBoton('sin_intentos');
                const err: any = new Error(estado.mensaje || 'No puedes realizar más intentos por ahora');
                err._tipo = 'informativo';
                throw err;
            }

            // Caso 3: Tiene intento en progreso → reanudar
            if (estado.tiene_intento_en_progreso) {
                const inProgressResp = await obtenerIntentoEnProgreso(moduloId);

                if (!inProgressResp.success || !inProgressResp.data) {
                    // Si el intento expiró en el servidor, intentar iniciar uno nuevo
                    return await _iniciarNuevo(moduloId);
                }

                const data = inProgressResp.data;

                const instruccionesPorTipo: Record<string, string> = {
                    seleccion_multiple: 'Selecciona la respuesta correcta.',
                    verdadero_falso: 'Indica si la afirmación es verdadera o falsa.',
                    arrastrar_soltar: 'Relaciona cada elemento con su definición correspondiente.',
                };

                // Adaptar la respuesta de en-progreso al formato de IntentoEvaluacion
                const intentoAdaptado: IntentoEvaluacion = {
                    intento_id: data.intento_id,
                    evaluacion_id: data.evaluacion_id,
                    modulo_id: Number(data.modulo_id),
                    fecha_inicio: data.fecha_inicio,
                    tiempo_limite_minutos: Math.ceil(data.tiempo_restante_segundos / 60),
                    tiempo_limite_segundos: Math.floor(data.tiempo_restante_segundos),
                    puntaje_minimo: estadoResp.data.evaluacion?.puntaje_minimo ?? 70,
                    numero_preguntas: data.preguntas_totales,
                    preguntas: data.preguntas.map((p: any) => ({
                        ...p,
                        instrucciones: p.instrucciones ?? instruccionesPorTipo[p.tipo] ?? '',
                    })),
                    intento_numero: estadoResp.data.estado_usuario.intentos_completados + 1,
                };

                setIntentoActual(intentoAdaptado);
                setTiempoRestante(Math.max(0, Math.floor(data.tiempo_restante_segundos)));

                // Restaurar respuestas ya guardadas
                const respuestasExistentes: Record<number, number> = {};
                data.preguntas.forEach((p: any) => {
                    if (p.respondida && p.respuesta_usuario?.opcion_id) {
                        respuestasExistentes[p.id] = p.respuesta_usuario.opcion_id;
                    }
                });
                setRespuestasGuardadas(respuestasExistentes);

                // Ir a la primera pregunta sin responder
                const primerasinResponder = data.preguntas.findIndex((p: any) => !p.respondida);
                setPreguntaActualIndex(primerasinResponder >= 0 ? primerasinResponder : 0);

                setEstadoBoton('en_progreso');
                return 'reanudado';
            }

            // Caso 4: Puede iniciar nuevo intento
            return await _iniciarNuevo(moduloId);

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Error al cargar la evaluación';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Inicia un nuevo intento (uso interno)
     */
    const _iniciarNuevo = async (moduloId: number): Promise<'iniciado'> => {
        const response = await iniciarEvaluacion(moduloId);

        if (!response.success || !response.data) {
            // El backend devuelve 400 si hay intento en progreso — manejar ese caso
            if (response.data?.intento_en_progreso_id) {
                throw new Error('Ya tienes un intento en progreso. Recarga e inténtalo de nuevo.');
            }
            throw new Error(response.message || 'No se pudo iniciar la evaluación');
        }

        setIntentoActual(response.data);
        setPreguntaActualIndex(0);
        setRespuestasGuardadas({});
        setTiempoRestante(response.data.tiempo_limite_segundos);
        setEstadoBoton('disponible');
        return 'iniciado';
    };

    /**
     * @deprecated Usa loadAssessment en su lugar.
     * Se mantiene por compatibilidad con código existente.
     */
    const startAssessment = async (moduloId: number) => {
        return loadAssessment(moduloId);
    };

    /**
     * @deprecated Usa loadAssessment en su lugar.
     */
    const checkInProgressAssessment = async (moduloId: number) => {
        const response = await obtenerIntentoEnProgreso(moduloId);
        if (response.success && response.data) {
            setIntentoActual(response.data);
            setTiempoRestante(Math.max(0, Math.floor(response.data.tiempo_restante_segundos || 0)));
            setPreguntaActualIndex(0);
            return response.data;
        }
        return null;
    };

    const saveAnswer = async (moduloId: number, preguntaId: number, opcionId: number) => {
        if (!intentoActual) throw new Error('No hay intento activo');

        try {
            setSubmitting(true);
            setError(null);

            const response = await guardarRespuesta(moduloId, intentoActual.intento_id, preguntaId, opcionId);

            if (response.success && response.data) {
                setRespuestasGuardadas(prev => ({ ...prev, [preguntaId]: opcionId }));
                return response.data;
            } else {
                throw new Error('No se pudo guardar la respuesta');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al guardar respuesta');
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const saveDragDropAnswer = async (
        moduloId: number,
        preguntaId: number,
        parejas: Array<{ id_opcion: number; pareja: string }>
    ) => {
        if (!intentoActual) throw new Error('No hay intento activo');

        try {
            setSubmitting(true);
            setError(null);

            const response = await guardarRespuestaArrastrar(moduloId, intentoActual.intento_id, preguntaId, parejas);

            if (response.success && response.data) {
                setRespuestasGuardadas(prev => ({ ...prev, [preguntaId]: parejas }));
                return response.data;
            } else {
                throw new Error('No se pudieron guardar las parejas');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al guardar parejas');
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const finishAssessment = async (moduloId: number) => {
        if (!intentoActual) throw new Error('No hay intento activo');

        try {
            setSubmitting(true);
            setError(null);

            const response = await finalizarEvaluacion(moduloId, intentoActual.intento_id);

            if (response.success && response.data) {
                setResultadoFinal(response.data);
                return response.data;
            } else {
                throw new Error('No se pudo finalizar la evaluación');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al finalizar evaluación');
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const fetchResultDetail = async (moduloId: number, intentoId: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await obtenerResultadoIntento(moduloId, intentoId);

            if (response.success && response.data) {
                setDetalleResultado(response.data);
                return response.data;
            } else {
                throw new Error('No se pudo obtener el resultado');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al obtener resultado');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const goToNextQuestion = () => {
        if (intentoActual && preguntaActualIndex < intentoActual.preguntas.length - 1) {
            setPreguntaActualIndex(prev => prev + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (preguntaActualIndex > 0) {
            setPreguntaActualIndex(prev => prev - 1);
        }
    };

    const goToQuestion = (index: number) => {
        if (intentoActual && index >= 0 && index < intentoActual.preguntas.length) {
            setPreguntaActualIndex(index);
        }
    };

    const reset = () => {
        setIntentoActual(null);
        setPreguntaActualIndex(0);
        setRespuestasGuardadas({});
        setResultadoFinal(null);
        setDetalleResultado(null);
        setTiempoRestante(0);
        setError(null);
        setEstadoUsuario(null);
        setEstadoBoton('cargando');
    };

    const getPreguntaActual = (): PreguntaEvaluacion | null => {
        if (!intentoActual) return null;
        return intentoActual.preguntas[preguntaActualIndex] || null;
    };

    const hasAnswerForQuestion = (preguntaId: number): boolean => {
        return respuestasGuardadas[preguntaId] !== undefined;
    };

    const getProgress = () => {
        if (!intentoActual) return { answered: 0, total: 0, percentage: 0 };
        const answered = Object.keys(respuestasGuardadas).length;
        const total = intentoActual.preguntas.length;
        const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
        return { answered, total, percentage };
    };

    return {
        // Estados
        intentoActual,
        preguntaActualIndex,
        respuestasGuardadas,
        resultadoFinal,
        detalleResultado,
        estadoUsuario,
        estadoBoton,
        loading,
        submitting,
        error,
        tiempoRestante,

        // Método principal (reemplaza startAssessment)
        loadAssessment,

        // Métodos deprecados (compatibilidad)
        startAssessment,
        checkInProgressAssessment,

        // Acciones
        saveAnswer,
        saveDragDropAnswer,
        finishAssessment,
        fetchResultDetail,

        // Navegación
        goToNextQuestion,
        goToPreviousQuestion,
        goToQuestion,

        // Utilidades
        reset,
        getPreguntaActual,
        hasAnswerForQuestion,
        getProgress,
        setTiempoRestante,
    };
};