import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface ProgressCardProps {
    title: string;
    progress: number;
    icon?: string;
    lecciones_vistas?: number | null;
    total_lecciones?: number | null;
    evaluacion_aprobada?: boolean;
    certificado_disponible?: boolean;
    moduloId?: number;
    moduloSlug?: string;  // ✅ AGREGAR
    generating?: boolean;
    onVerCertificado?: (moduloId: number, moduloSlug: string) => void;  // ✅ CAMBIAR
}

const ProgressCard = ({
    title,
    progress,
    icon,
    lecciones_vistas,
    total_lecciones,
    evaluacion_aprobada,
    certificado_disponible,
    moduloId,
    moduloSlug,  // ✅ AGREGAR
    generating,
    onVerCertificado,
}: ProgressCardProps) => {
    return (
        <View className="bg-quaternary rounded-xl p-4 mb-3 border border-secondary-100/20">
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                    <Text className="font-barlow-bold text-secondary flex-1 text-2xl" numberOfLines={1}>
                        {title}
                    </Text>
                </View>
                <Text className="font-barlow-bold text-primary-200 ml-2">{progress}%</Text>
            </View>

            {/* Barra de progreso */}
            <View className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <View
                    className="h-full bg-primary-200 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </View>

            {/* Info adicional */}
            <View className="flex-row items-center justify-between mt-2">
                {lecciones_vistas !== null && total_lecciones !== null && (
                    <Text className="text-xs text-secondary-100 font-barlow-medium">
                        {lecciones_vistas}/{total_lecciones} lecciones
                    </Text>
                )}
                <View className="flex-row gap-2">
                    {evaluacion_aprobada && (
                        <Text className="text-xs">✅ Evaluado</Text>
                    )}
                </View>
            </View>

            {/* Botón certificado */}
            {certificado_disponible && moduloId && moduloSlug && onVerCertificado && (  // ✅ AGREGAR moduloSlug &&
                <TouchableOpacity
                    onPress={() => onVerCertificado(moduloId, moduloSlug)}  // ✅ PASAR 2 PARÁMETROS
                    disabled={generating}
                    className="mt-3 bg-yellow-500 rounded-lg py-2 px-4 flex-row items-center justify-center"
                    style={{ opacity: generating ? 0.7 : 1 }}
                >
                    {generating ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text className="text-white font-barlow-bold text-xl">
                            Ver mi Certificado
                        </Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ProgressCard;