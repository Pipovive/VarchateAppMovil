import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IntroText } from "../../../../components/IntroText";
import { LessonCard } from "../../../../components/LessonCard";
import { ModuleHeader } from "../../../../components/ModuleHeader";
import { TopProgressHeader } from "../../../../components/TopProgressHeader";

export default function CompetitionLanguageScreen() {
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
    <SafeAreaView className="flex-1 bg-quaternary">
      <ScrollView>

        {/* HEADER */}
        <TopProgressHeader
          title="INTRODUCCION A LA PROGRAMACION"
          progress={69}
        />

        <View className="px-4 py-6">
          <ModuleHeader />
          <IntroText />

          <Text className="text-2xl font-barlow-extraBold text-secondary mt-6 mb-4">
            Contenido
          </Text>

          <View className="space-y-4">
            {lessons.map((lesson, index) => (
              <LessonCard
                key={index}
                title={lesson.title}
                desc={lesson.desc}
              />
            ))}
          </View>

          <TouchableOpacity className="bg-primary mt-8 py-4 rounded-2xl">
            <Text className="text-center text-quaternary font-barlow-bold text-lg">
              Siguiente
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
