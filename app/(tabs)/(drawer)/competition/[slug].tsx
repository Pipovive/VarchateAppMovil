import { TopProgressHeader } from "@/components/shared/headerProgress";
import { IntroText } from "@/components/shared/introText";
import { ModuleHeader } from "@/components/shared/moduleHeader";
import { WhiteScreenContainer } from "@/components/shared/whiteScreenCard";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context"; // ← Comenta esto

export default function CompetitionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const titles: Record<string, string> = {
    "intro-programacion": "INTRODUCCIÓN A LA PROGRAMACIÓN",
    html: "HTML",
    css: "CSS",
    javascript: "JAVASCRIPT",
    sql: "SQL",
    php: "PHP",
  };

  const title = titles[slug] ?? "Competencia";

  const lessons = [
    {
      title: "Lección 1 – ¿Qué es programar? Conceptos básicos",
      desc: "Descubrirás qué significa programar, qué son los algoritmos y cómo se comunican con la computadora.",
    },
    {
      title: "Lección 2 – Tipos de datos y variables",
      desc: "Conocerás cómo almacenar y manipular información dentro de un programa.",
    },
    {
      title: "Lección 3 – Operadores y expresiones",
      desc: "Aprenderás a realizar cálculos y operaciones lógicas.",
    },
    {
      title: "Lección 4 – Condicionales (if/else, switch)",
      desc: "Descubrirás cómo tomar decisiones en un programa según condiciones.",
    },
    {
      title: "Evaluación",
      desc: "Pondrás en práctica los fundamentos de programación con ejercicios sencillos.",
    },
  ];

  // Validación defensiva
  if (!slug || typeof slug !== 'string') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: Slug inválido</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#EAF4FF' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <TopProgressHeader
          title={title}
          progress={69}
          activeSlug={slug}
        />

        <WhiteScreenContainer>
          <ModuleHeader />
          <IntroText />

          <Text className="text-2xl font-barlow-bold text-secondary mt-6 mb-4">
            Contenido
          </Text>

          {lessons.map((lesson, index) => (
            <TouchableOpacity
              key={index}
              className="bg-quaternary border border-secondary-200 p-4 rounded-2xl mb-4"
            >
              <Text className="text-secondary font-barlow-bold text-lg">
                {lesson.title}
              </Text>
              <Text className="text-secondary-100 mt-1 font-barlow-medium">
                {lesson.desc}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity className="bg-primary-200 mt-8 py-4 w-40 self-end rounded-2xl">
            <Text className="text-center text-quaternary font-barlow-bold text-xl">
              Siguiente
            </Text>
          </TouchableOpacity>
        </WhiteScreenContainer>
      </ScrollView>
    </View>
  );
}