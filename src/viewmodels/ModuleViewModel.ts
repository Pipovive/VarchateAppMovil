import { useState } from 'react';
import {
    getModuleBySlug,
    getModules,
    getModulesWithProgress
} from '../services/modulesServices';

interface Module {
    id: number;
    titulo: string;
    slug: string;
    descripcion_larga: string;
    modulo: string;
    orden_global: number;
    estado: string;
    total_lecciones: number;
    created_by: number;
    created_at: string;
    updated_at: string;
}

interface ModuleWithProgress {
    id: number;
    titulo: string;
    slug: string;
    icono: string;
    progreso: number;
    lecciones_vistas: number | null;
    total_lecciones: number | null;
    evaluacion_aprobada: boolean;
    certificado_disponible: boolean;
    desglose: {
        lecciones: number;
        evaluacion: number;
    };
}

export const useModuleViewModel = () => {
    const [modules, setModules] = useState<Module[]>([]);
    const [modulesWithProgress, setModulesWithProgress] = useState<ModuleWithProgress[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Obtener todos los módulos (sin progreso)
     */
    const fetchModules = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getModules();

            console.log(`✅ ${data.length} módulos obtenidos`);

            setModules(data);

            return data;

        } catch (err: any) {
            console.error('❌ Error en fetchModules:', err);

            const errorMessage =
                err?.response?.status === 401 ? 'Debes iniciar sesión' :
                err?.response?.data?.message ||
                err.message ||
                'Error al obtener módulos';

            setError(errorMessage);
            setModules([]);

        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtener módulos con progreso del usuario
     */
    const fetchModulesWithProgress = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📊 Obteniendo módulos con progreso...');

            const response = await getModulesWithProgress();

            if (!response.success || !Array.isArray(response.data)) {
                throw new Error('Formato de respuesta inválido');
            }

            console.log(`✅ ${response.data.length} módulos con progreso obtenidos`);

            setModulesWithProgress(response.data);

            return response.data;

        } catch (err: any) {
            console.error('❌ Error en fetchModulesWithProgress:', err);

            // Si el endpoint no existe, usar módulos sin progreso
            if (err?.response?.status === 404) {
                console.log('⚠️ Endpoint de progreso no disponible');
                setModulesWithProgress([]);
                return [];
            }

            const errorMessage =
                err?.response?.status === 401 ? 'Debes iniciar sesión' :
                err?.response?.data?.message ||
                err.message ||
                'Error al obtener progreso';

            setError(errorMessage);
            setModulesWithProgress([]);

        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtener un módulo específico por slug
     */
    const fetchModuleBySlug = async (slug: string) => {
        try {
            setLoading(true);
            setError(null);

            console.log(`🚀 Obteniendo módulo: ${slug}`);

            const data = await getModuleBySlug(slug);

            console.log(`✅ Módulo obtenido: ${data.titulo}`);

            setSelectedModule(data);

            return data;

        } catch (err: any) {
            console.error('❌ Error en fetchModuleBySlug:', err);

            const errorMessage =
                err?.response?.status === 404 ? 'Módulo no encontrado' :
                err?.response?.status === 401 ? 'Debes iniciar sesión' :
                err?.response?.data?.message ||
                err.message ||
                'Error al obtener módulo';

            setError(errorMessage);
            setSelectedModule(null);

        } finally {
            setLoading(false);
        }
    };

    /**
     * Obtener progreso de un módulo específico
     */
    const getModuleProgress = (moduleSlug: string): number => {
        const module = modulesWithProgress.find(m => m.slug === moduleSlug);
        return module?.progreso || 0;
    };

    /**
     * Verificar si un módulo tiene evaluación aprobada
     */
    const hasApprovedEvaluation = (moduleSlug: string): boolean => {
        const module = modulesWithProgress.find(m => m.slug === moduleSlug);
        return module?.evaluacion_aprobada || false;
    };

    /**
     * Verificar si un módulo tiene certificado disponible
     */
    const hasCertificateAvailable = (moduleSlug: string): boolean => {
        const module = modulesWithProgress.find(m => m.slug === moduleSlug);
        return module?.certificado_disponible || false;
    };

    return {
        // Estados
        modules,
        modulesWithProgress,
        selectedModule,
        loading,
        error,

        // Funciones
        fetchModules,
        fetchModulesWithProgress,
        fetchModuleBySlug,
        getModuleProgress,
        hasApprovedEvaluation,
        hasCertificateAvailable,
    };
};