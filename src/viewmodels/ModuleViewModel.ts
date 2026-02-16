// src/viewmodels/ModuleViewModel.ts
import { useState } from 'react';
import { getModuleBySlug, getModules } from '../services/modulesServices';

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

export const useModuleViewModel = () => {
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchModules = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('🚀 Obteniendo módulos...');

            const data = await getModules();

            if (!data || !Array.isArray(data)) {
                throw new Error('Formato de datos inválido');
            }

            const activeModules = data.filter(module => module.estado === 'activo');
            const sortedModules = activeModules.sort((a, b) => a.orden_global - b.orden_global);

            console.log(`✅ ${sortedModules.length} módulos obtenidos`);

            setModules(sortedModules);
            
            return sortedModules;

        } catch (err: any) {
            console.error('❌ Error en fetchModules:', err);
            
            const errorMessage = 
                err?.response?.status === 404 ? 'No se encontraron módulos' :
                err?.response?.status === 401 ? 'Debes iniciar sesión' :
                err?.response?.data?.message || 
                err.message || 
                'Error al obtener módulos';
            
            setError(errorMessage);
            throw err;

        } finally {
            setLoading(false);
        }
    };

    const fetchModuleBySlug = async (slug: string) => {
        try {
            if (!slug || slug.trim() === '') {
                throw new Error('Slug inválido');
            }

            setLoading(true);
            setError(null);
            
            console.log(`🚀 Obteniendo módulo: ${slug}`);

            const data = await getModuleBySlug(slug);

            if (!data) {
                throw new Error('Módulo no encontrado');
            }

            console.log(`✅ Módulo obtenido: ${data.titulo}`);
            
            setSelectedModule(data);
            return data;

        } catch (err: any) {
            console.error('❌ Error en fetchModuleBySlug:', err);
            
            const errorMessage = 
                err?.response?.status === 404 ? 'Módulo no encontrado' :
                err?.response?.data?.message || 
                err.message || 
                'Error al obtener módulo';
            
            setError(errorMessage);
            throw err;

        } finally {
            setLoading(false);
        }
    };

    // ✅ IMPORTANTE: RETORNAR TODO
    return {
        modules,
        selectedModule,
        loading,
        error,
        fetchModules,
        fetchModuleBySlug,
    };
};