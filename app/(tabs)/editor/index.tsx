import { useTheme } from '@/src/context/ThemeContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const EditorIndex = () => {
  const [lastOpened, setLastOpened] = useState<Date | null>(null);
  const { isDark } = useTheme();

  const colors = {
    background:   isDark ? '#1B1D23' : '#F3F8FF',
    header:       isDark ? '#1F2937' : '#0099FF',
    headerBorder: isDark ? '#374151' : 'transparent',
    headerText:   isDark ? '#F9FAFB' : '#FFFFFF',
    headerSub:    isDark ? '#9CA3AF' : '#DBEAFE',
    sectionText:  isDark ? '#F3F4F6' : '#1F2937',
    card:         isDark ? '#272B35' : '#FFFFFF',
    cardShadow:   isDark ? '#000000' : '#000000',
    iconBg:       isDark ? '#3B2F2A' : '#FFF1ED',
    iconColor:    '#E44D26',
    titleText:    isDark ? '#F9FAFB' : '#111827',
    subText:      isDark ? '#9CA3AF' : '#6B7280',
    chevron:      isDark ? '#6B7280' : '#9CA3AF',
  };

  useEffect(() => {
    const cargarUltimaVez = async () => {
      const guardado = await AsyncStorage.getItem('editor_last_opened');
      if (guardado) setLastOpened(new Date(guardado));
    };
    cargarUltimaVez();
  }, []);

  const handlePress = () => {
    setLastOpened(new Date());
    router.push('/(tabs)/editor/code');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? 'light' : 'light'} />

      {/* HEADER */}
      <View style={{
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: colors.header,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        borderBottomWidth: isDark ? 1 : 0,
        borderColor: colors.headerBorder,
      }}>
        <Text style={{
          color: colors.headerText,
          fontSize: 22,
          fontWeight: 'bold',
        }}>
          Editor de Código
        </Text>
        <Text style={{
          color: colors.headerSub,
          marginTop: 6,
          fontSize: 14,
        }}>
          Continúa donde lo dejaste
        </Text>
      </View>

      {/* CONTENIDO */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 30 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: colors.sectionText,
          marginBottom: 16,
        }}>
          Archivos recientes
        </Text>

        {/* CARD */}
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={{
            backgroundColor: colors.card,
            padding: 18,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: colors.cardShadow,
            shadowOffset: { width: 0, height: isDark ? 6 : 4 },
            shadowOpacity: isDark ? 0.4 : 0.08,
            shadowRadius: 8,
            elevation: 5,
            marginBottom: 16,
          }}
        >
          {/* Ícono */}
          <View style={{
            backgroundColor: colors.iconBg,
            padding: 12,
            borderRadius: 12,
            marginRight: 16,
          }}>
            <FontAwesome name="html5" size={28} color={colors.iconColor} />
          </View>

          {/* Info */}
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.titleText,
            }}>
              index.html
            </Text>
            <Text style={{
              fontSize: 13,
              color: colors.subText,
              marginTop: 6,
            }}>
              {lastOpened
                ? `Abierto el ${lastOpened.toLocaleString('es-ES', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}`
                : 'Nunca abierto'}
            </Text>
          </View>

          {/* Flecha */}
          <FontAwesome name="chevron-right" size={18} color={colors.chevron} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditorIndex;