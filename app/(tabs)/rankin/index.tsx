import { AVATARS } from '@/src/const/avatar';
import { useRankingViewModel } from '@/src/viewmodels/Rankingviewmodel ';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RankingScreen() {
  const { rankingGeneral, actualizado, loading, error, fetchRankingGeneral } = useRankingViewModel();
  const { user } = useUserViewModel();
  const [moduloSeleccionado, setModuloSeleccionado] = useState<number | null>(null);
  const insets = useSafeAreaInsets();  // ← AGREGA
  useEffect(() => {
    fetchRankingGeneral();
  }, []);

  // Módulos con participantes
  const modulosActivos = rankingGeneral.filter(m => m.total_participantes > 0);
  const moduloActual = moduloSeleccionado !== null
    ? rankingGeneral.find(m => m.modulo.id === moduloSeleccionado)
    : modulosActivos[0] || null;

  if (loading) {
    return (
      <View className="flex-1 bg-[#EAF4FF] items-center justify-center">
        <ActivityIndicator size="large" color="#0099FF" />
        <Text className="mt-4 text-gray-500 font-barlow-medium">Cargando ranking...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#EAF4FF] items-center justify-center px-8">
        <Text className="text-red-500 text-center font-barlow-medium">{error}</Text>
        <TouchableOpacity
          onPress={fetchRankingGeneral}
          className="mt-4 bg-primary-200 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-barlow-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#EAF4FF]">
      <StatusBar style="light"  />
      <View style={{ height: insets.top, backgroundColor: '#0099FF' }} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View className="bg-primary-100 flex-row items-center px-4 py-4">
          <Text className="text-quaternary font-barlow-bold text-xl">
            RANKING
          </Text>
          {actualizado ? (
            <Text className="text-quaternary text-xs ml-auto opacity-70">
              {actualizado}
            </Text>
          ) : null}
        </View>

        {/* PODIO */}
        <View className="items-center mt-6">
          <Image
            source={require('@/assets/images/gatopodium.png')}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
        </View>

        {/* TEXTO */}
        <View className="items-center px-8 mt-4">
          <Text className="font-barlow-bold text-xl mb-2">¡BIENVENIDO!</Text>
          <Text className="text-center text-gray-600 font-barlow-regular">
            Explora nuestro ranking clasificatorio por módulos. Mientras más avances en la competencia, estarás en primer lugar.
          </Text>
        </View>

        {/* SELECTOR DE MÓDULOS */}
        {rankingGeneral.length > 0 && (
          <View className="mt-6 px-4">
            <Text className="font-barlow-bold text-gray-700 mb-3">Módulos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {rankingGeneral.map(m => (
                  <TouchableOpacity
                    key={m.modulo.id}
                    onPress={() => setModuloSeleccionado(m.modulo.id)}
                    className="px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: (moduloActual?.modulo.id === m.modulo.id)
                        ? '#0099FF'
                        : '#FFFFFF',
                      borderWidth: 1,
                      borderColor: '#0099FF',
                    }}
                  >
                    <Text style={{
                      color: (moduloActual?.modulo.id === m.modulo.id) ? '#FFFFFF' : '#0099FF',
                      fontFamily: 'Barlow-Bold',
                      fontSize: 13,
                    }}>
                     {m.modulo.titulo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* MI POSICIÓN */}
        {moduloActual?.mi_posicion && (
          <View className="mx-4 mt-4 rounded-2xl p-4"
            style={{ backgroundColor: 'rgba(24, 162, 255, 0.15)', borderWidth: 1, borderColor: '#0099FF' }}>
            <Text className="font-barlow-bold text-primary-200 mb-1">Tu posición en {moduloActual.modulo.titulo}</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <Image
                  source={AVATARS[user?.avatar_id || 1]}
                  style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#0099FF' }}
                />
                <View>
                  <Text className="font-barlow-bold text-gray-800">{user?.nombre || 'Tú'}</Text>
                  <Text className="text-xs text-gray-500">{moduloActual.mi_posicion.porcentaje}% completado</Text>
                </View>
              </View>
              <View className="items-center">
                <Text className="font-barlow-bold text-2xl text-primary-200">
                  #{moduloActual.mi_posicion.posicion}
                </Text>
                {moduloActual.mi_posicion.en_top_5 && (
                  <Text className="text-xs text-green-500 font-barlow-bold">TOP 5 ✓</Text>
                )}
              </View>
            </View>

            {/* Barra de progreso */}
            <View className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
              <View
                className="h-full bg-primary-200 rounded-full"
                style={{ width: `${moduloActual.mi_posicion.porcentaje}%` }}
              />
            </View>
          </View>
        )}

        {/* TOP 5 DEL MÓDULO SELECCIONADO */}
        {moduloActual && (
          <View className="px-4 mt-6">
            <Text className="font-barlow-bold text-gray-700 mb-3">
              Top 5 — {moduloActual.modulo.titulo}
            </Text>

            {moduloActual.top_5.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center">
                <Text className="text-4xl mb-2">🏁</Text>
                <Text className="text-gray-500 font-barlow-medium text-center">
                  Aún no hay participantes en este módulo.{'\n'}¡Sé el primero!
                </Text>
              </View>
            ) : (
              moduloActual.top_5.map((entrada: any) => {
                const porcentaje = entrada.porcentaje ?? entrada.progreso?.porcentaje ?? 0;
                const medalla = entrada.medalla?.icono ??
                  (entrada.posicion === 1 ? '🥇' : entrada.posicion === 2 ? '🥈' : entrada.posicion === 3 ? '🥉' : `#${entrada.posicion}`);
                const esYo = entrada.usuario.id === user?.id;

                return (
                  <View
                    key={entrada.posicion}
                    className="flex-row items-center rounded-2xl p-4 mb-3"
                    style={{
                      backgroundColor: esYo ? 'rgba(24,162,255,0.15)' : '#FFFFFF',
                      borderWidth: esYo ? 1.5 : 0,
                      borderColor: esYo ? '#0099FF' : 'transparent',
                      shadowColor: '#000',
                      shadowOpacity: 0.06,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    {/* Medalla */}
                    <Text style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{medalla}</Text>

                    {/* Avatar */}
                    <Image
                      source={AVATARS[entrada.usuario.avatar_id || 1]}
                      style={{ width: 44, height: 44, borderRadius: 22, marginHorizontal: 12 }}
                    />

                    {/* Info */}
                    <View className="flex-1">
                      <Text className="font-barlow-bold text-gray-800">
                        {entrada.usuario.nombre} {esYo ? '(Tú)' : ''}
                      </Text>
                      <View className="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${porcentaje}%`,
                            backgroundColor: entrada.posicion === 1 ? '#F59E0B' : entrada.posicion === 2 ? '#9CA3AF' : '#CD7C2F',
                          }}
                        />
                      </View>
                    </View>

                    {/* Porcentaje */}
                    <Text className="font-barlow-bold text-gray-700 ml-3">
                      {porcentaje}%
                    </Text>
                  </View>
                );
              })
            )}

            <Text className="text-xs text-gray-400 text-right mt-1 font-barlow-regular">
              {moduloActual.total_participantes} participante{moduloActual.total_participantes !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}