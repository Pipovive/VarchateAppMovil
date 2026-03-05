import { AVATARS } from '@/src/const/avatar';
import { useTheme } from '@/src/context/ThemeContext';
import { useRankingViewModel } from '@/src/viewmodels/Rankingviewmodel ';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RankingScreen() {
  const { rankingGeneral, actualizado, loading, error, fetchRankingGeneral } = useRankingViewModel();
  const { user } = useUserViewModel();
  const { isDark } = useTheme();
  const [moduloSeleccionado, setModuloSeleccionado] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDark ? '#343734' : '#EAF4FF',
    card: isDark ? '#454958' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#111827',
    subtext: isDark ? '#D1D5DB' : '#6B7280',
    border: isDark ? '#555555' : '#E5E7EB',
    progressBg: isDark ? '#555555' : '#E5E7EB',
    button: isDark ? '#616461' : '#AFCBFF',
    header: isDark ? '#1F2937' : '#0099FF',
  };

  useEffect(() => { fetchRankingGeneral(); }, []);

  const modulosActivos = rankingGeneral.filter(m => m.total_participantes > 0);
  const moduloActual = moduloSeleccionado !== null
    ? rankingGeneral.find(m => m.modulo.id === moduloSeleccionado)
    : modulosActivos[0] || null;

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0099FF" />
        <Text style={{ marginTop: 16, color: colors.subtext, fontFamily: 'Barlow-Medium' }}>Cargando ranking...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        <Text style={{ color: '#EF4444', textAlign: 'center', fontFamily: 'Barlow-Medium' }}>{error}</Text>
        <TouchableOpacity onPress={fetchRankingGeneral}
          style={{ marginTop: 16, backgroundColor: '#0099FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Barlow-Bold' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'light'} />
      <View style={{ height: insets.top, backgroundColor: colors.header }} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={{ backgroundColor: colors.header, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 }}>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Barlow-Bold', fontSize: 20 }}>RANKING</Text>
          {actualizado && (
            <Text style={{ color: '#FFFFFF', fontSize: 12, marginLeft: 'auto', opacity: 0.7 }}>{actualizado}</Text>
          )}
        </View>

        {/* PODIO */}
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Image source={require('@/assets/images/gatopodium.png')} style={{ width: 200, height: 200 }} resizeMode="contain" />
        </View>

        {/* TEXTO */}
        <View style={{ alignItems: 'center', paddingHorizontal: 32, marginTop: 16 }}>
          <Text style={{ fontFamily: 'Barlow-Bold', fontSize: 20, marginBottom: 8, color: colors.text }}>¡BIENVENIDO!</Text>
          <Text style={{ textAlign: 'center', color: colors.subtext, fontFamily: 'Barlow-Regular' }}>
            Explora nuestro ranking clasificatorio por módulos. Mientras más avances en la competencia, estarás en primer lugar.
          </Text>
        </View>

        {/* SELECTOR DE MÓDULOS */}
        {rankingGeneral.length > 0 && (
          <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
            <Text style={{ fontFamily: 'Barlow-Bold', color: colors.text, marginBottom: 12 }}>Módulos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {rankingGeneral.map(m => {
                  const activo = moduloActual?.modulo.id === m.modulo.id;
                  return (
                    <TouchableOpacity
                      key={m.modulo.id}
                      onPress={() => setModuloSeleccionado(m.modulo.id)}
                      style={{
                        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                        backgroundColor: activo ? '#0099FF' : colors.button,
                        borderWidth: 1, borderColor: '#0099FF',
                      }}
                    >
                      <Text style={{ color: activo ? '#FFFFFF' : isDark ? '#FFFFFF' : '#0099FF', fontFamily: 'Barlow-Bold', fontSize: 13 }}>
                        {m.modulo.titulo}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {/* MI POSICIÓN */}
        {moduloActual?.mi_posicion && (
          <View style={{
            marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 16,
            backgroundColor: isDark ? 'rgba(0,153,255,0.1)' : 'rgba(24,162,255,0.15)',
            borderWidth: 1, borderColor: '#0099FF'
          }}>
            <Text style={{ fontFamily: 'Barlow-Bold', color: '#0099FF', marginBottom: 4 }}>
              Tu posición en {moduloActual.modulo.titulo}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Image source={AVATARS[user?.avatar_id || 1]}
                  style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#0099FF' }} />
                <View>
                  <Text style={{ fontFamily: 'Barlow-Bold', color: colors.text }}>{user?.nombre || 'Tú'}</Text>
                  <Text style={{ fontSize: 12, color: colors.subtext }}>{moduloActual.mi_posicion.porcentaje}% completado</Text>
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Barlow-Bold', fontSize: 24, color: '#0099FF' }}>
                  #{moduloActual.mi_posicion.posicion}
                </Text>
                {moduloActual.mi_posicion.en_top_5 && (
                  <Text style={{ fontSize: 12, color: '#10B981', fontFamily: 'Barlow-Bold' }}>TOP 5 ✓</Text>
                )}
              </View>
            </View>
            <View style={{ width: '100%', height: 8, backgroundColor: colors.progressBg, borderRadius: 4, marginTop: 12, overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${moduloActual.mi_posicion.porcentaje}%`, backgroundColor: '#0099FF', borderRadius: 4 }} />
            </View>
          </View>
        )}

        {/* TOP 5 */}
        {moduloActual && (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <Text style={{ fontFamily: 'Barlow-Bold', color: colors.text, marginBottom: 12 }}>
              Top 5 — {moduloActual.modulo.titulo}
            </Text>

            {moduloActual.top_5.length === 0 ? (
              <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 36, marginBottom: 8 }}>🏁</Text>
                <Text style={{ color: colors.subtext, fontFamily: 'Barlow-Medium', textAlign: 'center' }}>
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
                  <View key={entrada.posicion} style={{
                    flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 12,
                    backgroundColor: esYo ? (isDark ? 'rgba(0,153,255,0.15)' : 'rgba(24,162,255,0.15)') : colors.card,
                    borderWidth: esYo ? 1.5 : 0,
                    borderColor: esYo ? '#0099FF' : 'transparent',
                    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
                  }}>
                    <Text style={{ fontSize: 24, width: 36, textAlign: 'center' }}>{medalla}</Text>
                    <Image source={AVATARS[entrada.usuario.avatar_id || 1]}
                      style={{ width: 44, height: 44, borderRadius: 22, marginHorizontal: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Barlow-Bold', color: colors.text }}>
                        {entrada.usuario.nombre} {esYo ? '(Tú)' : ''}
                      </Text>
                      <View style={{ width: '100%', height: 8, backgroundColor: colors.progressBg, borderRadius: 4, marginTop: 4, overflow: 'hidden' }}>
                        <View style={{
                          height: '100%', borderRadius: 4,
                          width: `${porcentaje}%`,
                          backgroundColor: entrada.posicion === 1 ? '#F59E0B' : entrada.posicion === 2 ? '#9CA3AF' : '#CD7C2F',
                        }} />
                      </View>
                    </View>
                    <Text style={{ fontFamily: 'Barlow-Bold', color: colors.text, marginLeft: 12 }}>{porcentaje}%</Text>
                  </View>
                );
              })
            )}

            <Text style={{ fontSize: 12, color: colors.subtext, textAlign: 'right', marginTop: 4, fontFamily: 'Barlow-Regular' }}>
              {moduloActual.total_participantes} participante{moduloActual.total_participantes !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}