import api from '../api/api';

export interface UsuarioRanking {
    id: number;
    nombre: string;
    avatar_id: number;
    iniciales: string;
}

export interface EntradaRanking {
    posicion: number;
    usuario: UsuarioRanking;
    porcentaje?: number;
    completado?: boolean;
    progreso?: {
        porcentaje: number;
        completado: boolean;
        fecha_ultima_actualizacion: string;
        fecha_finalizacion: string;
    };
    medalla?: {
        tipo: string;
        icono: string;
    };
}

export interface ModuloRanking {
    modulo: {
        id: number;
        titulo: string;
        slug: string;
        icono?: string;
    };
    top_5: EntradaRanking[];
    mi_posicion: {
        posicion: number;
        porcentaje: number;
        en_top_5: boolean;
    } | null;
    total_participantes: number;
}

export interface RankingPantallaPrincipal {
    top_5_por_modulo: ModuloRanking[];
    actualizado: string;
}

export interface RankingModulo {
    modulo: {
        id: number;
        titulo: string;
        slug: string;
        descripcion_corta: string;
    };
    top_5: EntradaRanking[];
    estadisticas: {
        total_participantes: number;
        promedio_progreso: number;
        actualizado: string;
    };
}

export const getRankingPantallaPrincipal = async () => {
    const response = await api.get('/ranking/pantalla-principal');
    return response.data as { success: boolean; data: RankingPantallaPrincipal };
};

export const getRankingModulo = async (moduloId: number) => {
    const response = await api.get(`/ranking/modulo/${moduloId}/top5`);
    return response.data as { success: boolean; data: RankingModulo };
};