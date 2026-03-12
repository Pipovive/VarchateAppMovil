import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TermsScreen = () => {
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
          Términos y Condiciones
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 13, color: colors.subtext, marginBottom: 24 }}>
          Última actualización: marzo 2026
        </Text>

        <Section title="1. Aceptación de los términos">
          Al acceder y usar Varchate, aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes usar la aplicación.
        </Section>

        <Section title="2. Uso de la plataforma">
          Varchate es una plataforma educativa diseñada para el aprendizaje de programación. Te comprometes a usar la plataforma únicamente para fines educativos y legales, sin interferir con otros usuarios ni con el funcionamiento del servicio.
        </Section>

        <Section title="3. Cuenta de usuario">
          Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.
        </Section>

        <Section title="4. Propiedad intelectual">
          Todo el contenido disponible en Varchate, incluyendo lecciones, ejercicios y evaluaciones, es propiedad de Varchate y está protegido por las leyes de propiedad intelectual. No puedes reproducir, distribuir ni modificar el contenido sin autorización.
        </Section>

        <Section title="5. Certificaciones">
          Los certificados emitidos por Varchate son de carácter educativo y no reemplazan certificaciones profesionales oficiales. Nos reservamos el derecho de revocar certificados obtenidos de manera fraudulenta.
        </Section>

        <Section title="6. Modificaciones">
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su publicación en la aplicación.
        </Section>

        <Section title="7. Contacto">
          Si tienes preguntas sobre estos términos, puedes contactarnos a través de los canales oficiales de Varchate.
        </Section>
      </ScrollView>
    </View>
  );
};

export default TermsScreen;