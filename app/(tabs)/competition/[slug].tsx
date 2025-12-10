import { TopProgressHeader } from ".../../../components/shared/headerProgress";
import { LessonCard } from ".../../../components/shared/lessonCard";
import { IntroText } from "@/components/shared/introText";
import { WhiteScreenContainer } from "@/components/shared/whiteScreenCard";
import { useLocalSearchParams } from "expo-router";

import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompetitionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  // Mapeo de títulos según el slug
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
      desc:
        "Descubrirás qué significa programar, qué son los algoritmos y cómo se comunican con la computadora.",
    },
    {
      title: "Lección 2 – Tipos de datos y variables",
      desc:
        "Conocerás cómo almacenar y manipular información dentro de un programa.",
    },
    {
      title: "Lección 3 – Operadores y expresiones",
      desc: "Aprenderás a realizar cálculos y operaciones lógicas.",
    },
    {
      title: "Lección 4 – Condicionales (if/else, switch)",
      desc:
        "Descubrirás cómo tomar decisiones en un programa según condiciones.",
    },
    {
      title: "Evaluación",
      desc:
        "Pondrás en práctica los fundamentos de programación con ejercicios sencillos.",
    },
  ];

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className="flex-1 bg-[#EAF4FF]"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <TopProgressHeader
          title={title}
          progress={69}
          activeLanguage={slug}
        />

        <WhiteScreenContainer>
          <ModuleHeader />
          <IntroText />

          <Text className="text-2xl font-barlow-bold text-secondary mt-6 mb-4">
            Contenido
          </Text>

          {lessons.map((lesson, index) => (
            <View key={index} className="mb-4">
              <LessonCard title={lesson.title} desc={lesson.desc} />
            </View>
          ))}

          <TouchableOpacity className="bg-primary-200 mt-8 py-4 w-40 self-end rounded-2xl">
            <Text className="text-center text-quaternary font-barlow-bold text-xl">
              Siguiente
            </Text>
          </TouchableOpacity>
        </WhiteScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
