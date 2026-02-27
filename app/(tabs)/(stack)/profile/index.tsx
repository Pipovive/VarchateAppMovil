import ProgressCard from '@/components/shared/ProgressCard';
import { generarCertificacion, obtenerCertificadoPorSlug } from '@/src/services/Certificacionservices'; // ✅ AGREGAR
import { useModuleViewModel } from '@/src/viewmodels/ModuleViewModel'; // ✅ AGREGAR
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
  const router = useRouter();
  const [generatingCertificate, setGeneratingCertificate] = useState<number | null>(null);
  
  const { user, loading: userLoading, error: userError, fetchUser } = useUserViewModel();
  const { 
    modulesWithProgress, 
    loading: modulesLoading, 
    error: modulesError, 
    fetchModulesWithProgress 
  } = useModuleViewModel();

  useEffect(() => {
    fetchUser();
    fetchModulesWithProgress();
  }, []);

  const handleVerCertificado = async (moduloId: number, moduloSlug: string) => {
    try {
        setGeneratingCertificate(moduloId);
        
        console.log('📜 Obteniendo certificado para módulo:', moduloSlug);
        
        const response = await obtenerCertificadoPorSlug(moduloSlug);
        
        if (response.success && response.data) {
            console.log('✅ Certificado obtenido:', response.data);
            
            router.push({
                pathname: '/(tabs)/(stack)/certificado',
                params: {
                    codigo: response.data.codigo,
                    modulo: response.data.modulo.titulo,
                    porcentaje: response.data.porcentaje_obtenido.toString(),
                    fecha: response.data.fecha_emision,
                }
            });
        }
        
    } catch (err: any) {
        console.error('❌ Error al obtener certificado:', err);
        
        if (err.message.includes('No tienes un certificado')) {
            Alert.alert(
                'Generar Certificado',
                '¿Deseas generar tu certificado ahora?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Generar',
                        onPress: async () => {
                            try {
                                const genResponse = await generarCertificacion(moduloId);
                                if (genResponse.success && genResponse.data) {
                                    router.push({
                                        pathname: '/(tabs)/(stack)/certificado',
                                        params: {
                                            codigo: genResponse.data.codigo_certificado,
                                            modulo: genResponse.data.modulo,
                                            porcentaje: genResponse.data.porcentaje.toString(),
                                            fecha: genResponse.data.fecha_emision,
                                        }
                                    });
                                }
                            } catch (genErr: any) {
                                Alert.alert('Error', genErr?.response?.data?.message || 'No se pudo generar el certificado');
                            }
                        }
                    }
                ]
            );
        } else {
            Alert.alert('Error', err.message || 'No se pudo obtener el certificado');
        }
    } finally {
        setGeneratingCertificate(null);
    }
  };

  if (userLoading || modulesLoading) {
    return (
      <View className="flex-1 bg-primary-500 rounded-3xl p-4 my-10 border border-secondary-100/10 mx-3 items-center justify-center">
        <ActivityIndicator size="large" color="#0099FF" />
        <Text className="text-secondary mt-4">Cargando perfil...</Text>
      </View>
    );
  }

  if (userError || modulesError) {
    return (
      <View className="flex-1 bg-primary-500 rounded-3xl p-4 my-10 border border-secondary-100/10 mx-3 items-center justify-center">
        <Text className="text-red-500">Error: {userError || modulesError}</Text>
        <TouchableOpacity 
          onPress={() => {
            fetchUser();
            fetchModulesWithProgress();
          }}
          className="mt-4 bg-primary-200 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-barlow-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-primary-500 rounded-3xl p-4 my-10 border border-secondary-100/10 mx-3'>
      <View className="flex-row justify-end">
        <TouchableOpacity onPress={() => router.push(`/profile/${user?.id || '1'}`)}>
          <FontAwesome5 name="edit" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View className='items-center justify-center'>
        <Image
          style={{ width: 160, resizeMode: 'contain', marginTop: 6, borderRadius: 50, height: 160 }}
          source={require('../../../../assets/images/gato-perfil.png')}
        />

        <Text className='font-barlow-medium text-center mb-3 text-2xl text-secondary'>
          {user?.nombre || 'Usuario'}
        </Text>
      </View>

      <View className="flex-row justify-between items-center mt-2 mb-2">
        <Text className='font-barlow-bold text-2xl text-secondary'>Progreso</Text>
        
        {modulesWithProgress.length > 0 && (
          <Text className="font-barlow-semibold text-sm text-secondary-100">
            {modulesWithProgress.filter(m => m.progreso === 100).length}/{modulesWithProgress.length} completados
          </Text>
        )}
      </View>

      <ScrollView className='flex-1 mt-2' showsVerticalScrollIndicator={false}>
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
          <View className="items-center justify-center py-12">
            <Text className="text-secondary-100 font-barlow-medium">
              No hay módulos disponibles
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;