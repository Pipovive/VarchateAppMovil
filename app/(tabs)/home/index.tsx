import Button from '@/components/shared/button';
import { useTheme } from '@/src/context/ThemeContext';
import { useModuleViewModel } from '@/src/viewmodels/ModuleViewModel';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

const MODULE_IMAGES: Record<string, any> = {
  'intro-programacion': require("../../../assets/images/diagrama-de-flujo.png"),
  'html': require("../../../assets/images/html-5.png"),
  'css': require("../../../assets/images/css-3.png"),
  'javascript': require("../../../assets/images/javascript.png"),
  'js': require("../../../assets/images/javascript.png"),
  'sql': require("../../../assets/images/sql.png"),
  'php': require("../../../assets/images/php.png"),
};

const HomeScreen = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { modules, loading, error, fetchModules } = useModuleViewModel();

  const colors = {
    background: isDark ? '#343734' : '#F2F2F2',
    card: isDark ? '#616461' : '#AFCBFF7D',
    text: isDark ? '#FFFFFF' : '#111827',
    subtext: isDark ? '#D1D5DB' : '#6B7280',
  };

  useEffect(() => { fetchModules(); }, []);

  const handlePress = (slug: string) => {
    router.push({
      pathname: '/(tabs)/(drawer)/competition/[slug]',
      params: { slug }
    });
  };

  const getModuleImage = (moduleName: string) => {
    const key = moduleName.toLowerCase().replace(/\s+/g, '-');
    if (MODULE_IMAGES[key]) return MODULE_IMAGES[key];
    const foundKey = Object.keys(MODULE_IMAGES).find(k => key.includes(k) || k.includes(key));
    if (foundKey) return MODULE_IMAGES[foundKey];
    return require("../../../assets/images/indefinido.png"); // ← imagen por defecto
  };

  if (loading && modules.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color="#0099FF" />
        <Text style={{ marginTop: 12, fontSize: 16, color: colors.subtext, fontFamily: 'Barlow-Medium' }}>
          Cargando módulos...
        </Text>
      </View>
    );
  }

  if (error && modules.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
        <Text style={{ fontSize: 18, color: '#EF4444', marginBottom: 16, textAlign: 'center', fontFamily: 'Barlow-SemiBold' }}>
          {error}
        </Text>
        <Button variant="contained" onPress={fetchModules}>Reintentar</Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingTop: 40 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Text style={{ fontFamily: 'Barlow-Bold', textAlign: 'center', fontSize: 24, marginTop: 16, marginBottom: 24, color: colors.text }}>
        COMPETENCIAS
      </Text>

      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', paddingBottom: 20 }}>
        {modules.map((item: any) => (
          <Button
            key={item.id}
            variant="card"
            color="secondary"
            className="w-[45%] aspect-square p-1 rounded-xl items-center justify-center shadow-md"
            style={{ backgroundColor: colors.card }}
            source={getModuleImage(item.modulo)}
            onPress={() => handlePress(item.slug)}
          >
            {item.titulo}
          </Button>
        ))}
      </ScrollView>

      {loading && modules.length > 0 && (
        <View style={{ position: 'absolute', top: 100, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Actualizando...</Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;