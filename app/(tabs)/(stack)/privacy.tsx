import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PrivacyScreen = () => {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDark ? '#1B1D23' : '#F9FAFB',
    text:       isDark ? '#F9FAFB' : '#111827',
    subtext:    isDark ? '#9CA3AF' : '#6B7280',
    card:       isDark ? '#272B35' : '#FFFFFF',
    border:     isDark ? '#374151' : '#E5E7EB',
    accent:     '#0099FF',
  };

  const Section = ({ title, children }: { title: string; children: string }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 17, fontFamily: 'Barlow-Bold', color: colors.text, marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 15, fontFamily: 'Barlow-Regular', color: colors.subtext, lineHeight: 24 }}>
        {children}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontFamily: 'Barlow-Bold', color: colors.text }}>
          Política de Privacidad
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 13, color: colors.subtext, marginBottom: 24 }}>
          Última actualización: marzo 2026
        </Text>

        <Section title="1. Información que recopilamos">
          Recopilamos información que nos proporcionas directamente, como nombre, correo electrónico y contraseña al registrarte. También recopilamos datos de uso como lecciones completadas, ejercicios realizados y evaluaciones aprobadas.
        </Section>

        <Section title="2. Uso de la información">
          Usamos tu información para personalizar tu experiencia de aprendizaje, enviarte notificaciones relevantes, generar certificados de finalización y mejorar continuamente nuestra plataforma.
        </Section>

        <Section title="3. Almacenamiento y seguridad">
          Tu información se almacena en servidores seguros. Implementamos medidas técnicas y organizativas para proteger tus datos contra accesos no autorizados, pérdida o alteración.
        </Section>

        <Section title="4. Compartir información">
          No vendemos ni compartimos tu información personal con terceros, excepto cuando sea necesario para operar el servicio o cuando lo exija la ley.
        </Section>

        <Section title="5. Cookies y tecnologías similares">
          Usamos tokens de autenticación para mantener tu sesión activa. No usamos cookies de rastreo publicitario ni compartimos datos de navegación con redes publicitarias.
        </Section>

        <Section title="6. Tus derechos">
          Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento desde la configuración de tu cuenta. También puedes solicitar la eliminación completa de tu cuenta y todos tus datos.
        </Section>

        <Section title="7. Menores de edad">
          Varchate no está dirigida a menores de 13 años. Si eres padre o tutor y crees que tu hijo ha proporcionado información personal, contáctanos para eliminarla.
        </Section>

        <Section title="8. Cambios a esta política">
          Podemos actualizar esta política periódicamente. Te notificaremos sobre cambios significativos a través de la aplicación. El uso continuado de Varchate tras los cambios implica la aceptación de la nueva política.
        </Section>

        <Section title="9. Contacto">
          Para cualquier pregunta sobre privacidad o el manejo de tus datos, contáctanos a través de los canales oficiales de Varchate.
        </Section>
      </ScrollView>
    </View>
  );
};

export default PrivacyScreen;