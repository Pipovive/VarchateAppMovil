import { useState } from 'react';
import {
    ModuloRanking,
    RankingModulo,
    getRankingModulo,
    getRankingPantallaPrincipal,
} from '../services/RankinServices';

export const useRankingViewModel = () => {
    const [rankingGeneral, setRankingGeneral] = useState<ModuloRanking[]>([]);
    const [rankingModulo, setRankingModulo] = useState<RankingModulo | null>(null);
    const [actualizado, setActualizado] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRankingGeneral = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getRankingPantallaPrincipal();
            if (response.success) {
                setRankingGeneral(response.data.top_5_por_modulo);
                setActualizado(response.data.actualizado);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al obtener ranking');
        } finally {
            setLoading(false);
        }
    };

    const fetchRankingModulo = async (moduloId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getRankingModulo(moduloId);
            if (response.success) {
                setRankingModulo(response.data);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al obtener ranking del módulo');
        } finally {
            setLoading(false);
        }
    };

    return {
        rankingGeneral,
        rankingModulo,
        actualizado,
        loading,
        error,
        fetchRankingGeneral,
        fetchRankingModulo,
    };
};