import { useTheme } from '@/src/context/ThemeContext';
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
    moduloSlug?: string;
    generating?: boolean;
    onVerCertificado?: (moduloId: number, moduloSlug: string) => void;
}

const ProgressCard = ({
    title, progress, icon, lecciones_vistas, total_lecciones,
    evaluacion_aprobada, certificado_disponible, moduloId, moduloSlug,
    generating, onVerCertificado,
}: ProgressCardProps) => {
    const { isDark } = useTheme();

    const colors = {
        card: isDark ? '#454958' : '#FFFFFF',
        text: isDark ? '#FFFFFF' : '#111827',
        subtext: isDark ? '#D1D5DB' : '#6B7280',
        border: isDark ? '#555555' : '#E5E7EB',
        progressBg: isDark ? '#555555' : '#E5E7EB',
        botton: isDark ? '#616461' : '#AFCBFF'
    };

    return (
        <View style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.border,
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontFamily: 'Barlow-Bold', color: colors.text, fontSize: 22, flex: 1 }} numberOfLines={1}>
                    {title}
                </Text>
                <Text style={{ fontFamily: 'Barlow-Bold', color: '#0099FF', marginLeft: 8 }}>{progress}%</Text>
            </View>

            {/* Barra de progreso */}
            <View style={{ width: '100%', height: 34, backgroundColor: colors.progressBg, borderRadius: 12, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${progress}%`, backgroundColor: '#0099FF', borderRadius: 12 }} />
            </View>

            {/* Info adicional */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                {lecciones_vistas !== null && total_lecciones !== null && (
                    <Text style={{ fontSize: 12, color: colors.subtext, fontFamily: 'Barlow-Medium' }}>
                        {lecciones_vistas}/{total_lecciones} lecciones
                    </Text>
                )}
                {evaluacion_aprobada && (
                    <Text style={{ fontSize: 12 }}>✅ Evaluado</Text>
                )}
            </View>

            {/* Botón certificado */}
            {certificado_disponible && moduloId && moduloSlug && onVerCertificado && (
                <TouchableOpacity
                    onPress={() => onVerCertificado(moduloId, moduloSlug)}
                    disabled={generating}
                    style={{ marginTop: 12, backgroundColor: colors.botton, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignItems: 'center', opacity: generating ? 0.7 : 1 }}
                >
                    {generating ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={{ color: '#FFFFFF', fontFamily: 'Barlow-Bold', fontSize: 16 }}>
                            Ver mi Certificado
                        </Text>
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ProgressCard;