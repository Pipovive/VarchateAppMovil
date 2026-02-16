import React, { createContext, useContext, useState } from 'react';

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

interface ModuleContextType {
    currentModule: Module | null;
    setCurrentModule: (module: Module | null) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentModule, setCurrentModule] = useState<Module | null>(null);

    return (
        <ModuleContext.Provider value={{ currentModule, setCurrentModule }}>
            {children}
        </ModuleContext.Provider>
    );
};


export const useCurrentModule = () => {
    const context = useContext(ModuleContext);
    if (!context) {
        throw new Error('useCurrentModule debe usarse dentro de ModuleProvider');
    }
    return context;
};