import React from "react";
import { Text, View } from "react-native";

type ProgressBarProps = {
  title: string;
  progress: number;
  className?: string;
};

export function ProgressBar({ title, progress, className }: ProgressBarProps) {
  return (
    <View className={`w-full bg-primary-100 px-4 pt-6 pb-4 ${className ?? ""}`}>
      <View className="bg-quaternary rounded-xl px-3 py-2">
        <View className="w-full h-8 bg-primary-200 rounded-md overflow-hidden">
          {/* Barra de progreso animada */}
          <View
            className="h-full bg-primary-100"
            style={{ width: `${progress}%` }}
          />
          
          {/* Texto sobre la barra */}
          <View className="absolute inset-0 flex-row justify-between items-center px-4">
            <Text className="text-quaternary font-barlow-medium">
              {title}
            </Text>
            <Text className="text-quaternary font-barlow-bold">
              {progress}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}