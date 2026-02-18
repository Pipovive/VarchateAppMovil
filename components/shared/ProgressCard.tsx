  import React from 'react';
import { Text, View } from 'react-native';


  interface ProgressCardProps {
    title: string;
    progress: number;
    icon?: string;
    lecciones_vistas?: number | null;
    total_lecciones?: number | null;
    evaluacion_aprobada?: boolean;
    certificado_disponible?: boolean;
  }

  const ProgressCard = ({ 
    title, 
    progress, 
    icon,
    lecciones_vistas,
    total_lecciones,
    evaluacion_aprobada,
    certificado_disponible 
  }: ProgressCardProps) => {
    return (
      <View className="bg-primary-600 rounded-xl p-4 mb-3 border border-secondary-100/20">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1">
            {icon && (
              <Text className="text-2xl mr-2">{icon}</Text>
            )}
            <Text className="font-barlow-bold text-secondary flex-1" numberOfLines={1}>
              {title}
            </Text>
          </View>
          
          <Text className="font-barlow-bold text-primary-200 ml-2">
            {progress}%
          </Text>
        </View>

        {/* Barra de progreso */}
        <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <View 
            className="h-full bg-primary-200 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </View>

        {/* Info adicional */}
        <View className="flex-row items-center justify-between mt-2">
          {lecciones_vistas !== null && total_lecciones !== null && (
            <Text className="text-xs text-secondary-100 font-barlow-medium">
              📚 {lecciones_vistas}/{total_lecciones} lecciones
            </Text>
          )}
          
          <View className="flex-row gap-2">
            {evaluacion_aprobada && (
              <Text className="text-xs">✅ Evaluado</Text>
            )}
            {certificado_disponible && (
              <Text className="text-xs">🏆 Certificado</Text>
            )}
          </View>
        </View>
      </View>
    );
  };


  export default ProgressCard