import React from "react";
import { Text, TouchableOpacity } from "react-native";


export function LessonCard({ title, desc }: { title: string; desc: string }) {
return (
<TouchableOpacity className="bg-quaternary border border-secondary-200 p-4 rounded-2xl">
<Text className="text-secondary font-barlow-bold text-lg">{title}</Text>
<Text className="text-secondary-100 mt-1 font-barlow-medium">{desc}</Text>
</TouchableOpacity>
);
}