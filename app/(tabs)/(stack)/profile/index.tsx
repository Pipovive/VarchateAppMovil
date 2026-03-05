import ProgressCard from '@/components/shared/ProgressCard';
import { AVATARS } from '@/src/const/avatar';
import { useTheme } from '@/src/context/ThemeContext';
import { generarCertificacion, obtenerCertificadoPorSlug } from '@/src/services/Certificacionservices';
import { useModuleViewModel } from '@/src/viewmodels/ModuleViewModel';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const [generatingCertificate, setGeneratingCertificate] = useState<number | null>(null);

  const colors = {
    background: isDark ? '#343734' : '#AFCBFF',
    card: isDark ? '#343734' : '#F9FAFB',
    text: isDark ? '#FFFFFF' : '#111827',
    subtext: isDark ? '#D1D5DB' : '#6B7280',
    border: isDark ? '#555555' : '#E5E7EB',
    icon: isDark ? '#FFFFFF' : '#000000',
    inputsColor: isDark ? '#616461' : '#FFFFFF'
  };

  const { user, loading: userLoading, error: userError, fetchUser } = useUserViewModel();
  const { modulesWithProgress, loading: modulesLoading, error: modulesError, fetchModulesWithProgress } = useModuleViewModel();

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      fetchModulesWithProgress();
    }, [])
  );

  const handleVerCertificado = async (moduloId: number, moduloSlug: string) => {
    try {
      setGeneratingCertificate(moduloId);
      try {
        const response = await obtenerCertificadoPorSlug(moduloSlug);
        if (response.success && response.data) {
          router.push({
            pathname: '/(tabs)/(stack)/certificado',
            params: {
              codigo: response.data.codigo,
              modulo: response.data.modulo.titulo,
              porcentaje: response.data.porcentaje_obtenido.toString(),
              fecha: response.data.fecha_emision,
            }
          });
          return;
        }
      } catch { }

      Alert.alert('Generar Certificado', '¿Deseas generar tu certificado?', [
        { text: 'Cancelar', style: 'cancel', onPress: () => setGeneratingCertificate(null) },
        {
          text: 'Generar',
          onPress: async () => {
            try {
              const genResponse = await generarCertificacion(moduloId);
              if (!genResponse.success) throw new Error('No se pudo generar');
              await new Promise(resolve => setTimeout(resolve, 3000));
              const certResponse = await obtenerCertificadoPorSlug(moduloSlug);
              if (certResponse.success && certResponse.data) {
                router.push({
                  pathname: '/(tabs)/(stack)/certificado',
                  params: {
                    codigo: certResponse.data.codigo,
                    modulo: certResponse.data.modulo.titulo,
                    porcentaje: certResponse.data.porcentaje_obtenido.toString(),
                    fecha: certResponse.data.fecha_emision,
                  }
                });
              }
            } catch (genErr: any) {
              Alert.alert('Error', genErr?.response?.data?.message || 'No se pudo generar el certificado');
            } finally {
              setGeneratingCertificate(null);
            }
          }
        }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo obtener el certificado');
      setGeneratingCertificate(null);
    }
  };

  if (userLoading || modulesLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 24, padding: 16, marginVertical: 40, marginHorizontal: 12, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0099FF" />
        <Text style={{ color: colors.text, marginTop: 16, fontFamily: 'Barlow-Medium' }}>Cargando perfil...</Text>
      </View>
    );
  }

  if (userError || modulesError) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 24, padding: 16, marginVertical: 40, marginHorizontal: 12, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#EF4444' }}>Error: {userError || modulesError}</Text>
        <TouchableOpacity
          onPress={() => { fetchUser(); fetchModulesWithProgress(); }}
          style={{ marginTop: 16, backgroundColor: '#0099FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
        >
          <Text style={{ color: '#FFFFFF', fontFamily: 'Barlow-SemiBold' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: 24, padding: 16, marginVertical: 40, marginHorizontal: 12, borderWidth: 1, borderColor: colors.border }}>
      
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity onPress={() => router.push(`/profile/${user?.id || '1'}`)}>
          <FontAwesome5 name="edit" size={28} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          style={{ width: 160, height: 160, resizeMode: 'contain', marginTop: 6, borderRadius: 80 }}
          source={AVATARS[user?.avatar_id || 1]}
        />
        <Text style={{ fontFamily: 'Barlow-Medium', textAlign: 'center', marginBottom: 12, fontSize: 24, color: colors.text }}>
          {user?.nombre || 'Usuario'}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <Text style={{ fontFamily: 'Barlow-Bold', fontSize: 24, color: colors.text }}>PROGRESO</Text>
        {modulesWithProgress.length > 0 && (
          <Text style={{ fontFamily: 'Barlow-SemiBold', fontSize: 14, color: colors.subtext }}>
            {modulesWithProgress.filter(m => m.progreso === 100).length}/{modulesWithProgress.length} completados
          </Text>
        )}
      </View>

      <ScrollView style={{ flex: 1, marginTop: 8 }} showsVerticalScrollIndicator={false}>
        {modulesWithProgress.length > 0 ? (
          modulesWithProgress.map((module) => (
            <ProgressCard
              key={module.id}
              title={module.titulo.toUpperCase()}
              progress={module.progreso}
              icon={module.icono}
              lecciones_vistas={module.lecciones_vistas}
              total_lecciones={module.total_lecciones}
              evaluacion_aprobada={module.evaluacion_aprobada}
              certificado_disponible={module.certificado_disponible}
              moduloId={module.id}
              moduloSlug={module.slug}
              generating={generatingCertificate === module.id}
              onVerCertificado={handleVerCertificado}
            />
          ))
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
            <Text style={{ color: colors.subtext, fontFamily: 'Barlow-Medium' }}>
              No hay módulos disponibles
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;