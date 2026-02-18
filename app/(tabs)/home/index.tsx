import Button from '@/components/shared/button';
import { useModuleViewModel } from '@/src/viewmodels/ModuleViewModel';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

// 📦 Mapeo de imágenes locales por módulo
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

  // 🎣 Usar el ViewModel
  const { modules, loading, error, fetchModules } = useModuleViewModel();

  // 🚀 Cargar módulos al montar el componente
  useEffect(() => {
    console.log('🚀 HomeScreen montado - cargando módulos...');
    fetchModules();
  }, []);

  // 📱 Navegar al módulo seleccionado
  const handlePress = (slug: string) => {
  console.log('📱 Navegando a:', slug);
  router.push({
    pathname: '/(tabs)/(drawer)/competition/[slug]',
    params: { slug: slug }
  });
};

  // 🖼️ Obtener imagen según el módulo
  const getModuleImage = (moduleName: string) => {
    // Convertir a minúsculas y quitar espacios
    const key = moduleName.toLowerCase().replace(/\s+/g, '-');

    // Buscar coincidencia exacta o parcial
    if (MODULE_IMAGES[key]) {
      return MODULE_IMAGES[key];
    }

    // Buscar si el key está contenido en alguna imagen
    const foundKey = Object.keys(MODULE_IMAGES).find(k =>
      key.includes(k) || k.includes(key)
    );

    if (foundKey) {
      return MODULE_IMAGES[foundKey];
    }

    // Imagen por defecto si no se encuentra
    return require("../../../assets/images/diagrama-de-flujo.png");
  };

  // 🔄 Pantalla de carga
  if (loading && modules.length === 0) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color="#0099FF" />
        <Text style={{
          marginTop: 12,
          fontSize: 16,
          color: '#6B7280',
          fontFamily: 'Barlow-Medium'
        }}>
          Cargando módulos...
        </Text>

      </View>
    );
  }

  // ❌ Pantalla de error
  if (error && modules.length === 0) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
      }}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
        <Text style={{
          fontSize: 18,
          color: '#EF4444',
          marginBottom: 16,
          textAlign: 'center',
          fontFamily: 'Barlow-SemiBold'
        }}>
          {error}
        </Text>
        <Button
          variant="contained"
          onPress={fetchModules}
        >
          Reintentar
        </Button>
      </View>
    );
  }

  // ✅ Pantalla principal
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F2F2F2',
      paddingHorizontal: 16,
      paddingTop: 40
    }}>
      <Text className="font-barlow-bold text-center text-2xl mt-4 mb-6">
        COMPETENCIAS
      </Text>

      <ScrollView
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 16,
          justifyContent: 'space-between',
          paddingBottom: 20
        }}
      >
        {modules.map((item: any) => (
          <Button
            key={item.id}
            variant="card"
            color="secondary"
            className="w-[45%] aspect-square p-1 bg-[#AFCBFF7D] rounded-xl items-center justify-center shadow-md"
            source={getModuleImage(item.modulo)}  // ← Usa el campo 'modulo' de la API
            onPress={() => handlePress(item.slug)}
          >
            {item.titulo}
          </Button>
        ))}
      </ScrollView>

      {/* Indicador de recarga si está cargando pero ya hay datos */}
      {loading && modules.length > 0 && (
        <View style={{
          position: 'absolute',
          top: 100,
          alignSelf: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
            Actualizando...
          </Text>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;