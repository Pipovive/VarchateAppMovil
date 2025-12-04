import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";


export function TopProgressHeader({ title, progress }: { title: string; progress: number }) {
return (
<View className="w-full bg-primary px-4 pt-10 pb-4 rounded-b-3xl">
{/* Back + Progress Bar */}
<View className="flex-row items-center justify-between mb-3">
<TouchableOpacity>
<Ionicons name="arrow-back" size={28} color="#FFFFFF" />
</TouchableOpacity>


<View className="flex-row items-center bg-quaternary rounded-full px-3 py-1">
<Text className="text-secondary font-barlow-medium mr-2">{title}</Text>
<Text className="text-secondary font-barlow-extraBold">{progress}%</Text>
</View>
</View>


{/* Navigation Pills */}
<View className="flex-row items-center space-x-3 mt-2">
<TouchableOpacity className="bg-primary-200 px-4 py-2 rounded-full">
<Text className="text-quaternary font-barlow-bold">{title}</Text>
</TouchableOpacity>


<TouchableOpacity className="bg-quaternary px-4 py-2 rounded-full border border-primary-200">
<Text className="text-primary font-barlow-medium">HTML</Text>
</TouchableOpacity>


<TouchableOpacity className="bg-quaternary px-4 py-2 rounded-full border border-primary-200">
<Text className="text-primary font-barlow-medium">CSS</Text>
</TouchableOpacity>
</View>
</View>
);
}