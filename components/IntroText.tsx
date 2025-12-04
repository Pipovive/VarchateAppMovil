import React from "react";
import { Text, View } from "react-native";


export function IntroText() {
return (
<View className="space-y-3">
<Text className="text-secondary-100 font-barlow-medium leading-6">
La programación es el proceso de crear instrucciones que una computadora
puede ejecutar para resolver problemas o realizar tareas.
</Text>
<Text className="text-secondary-100 font-barlow-medium leading-6">
Gracias a la programación se desarrollan páginas web, aplicaciones móviles,
videojuegos, software empresarial, y mucho más.
</Text>
<Text className="text-secondary-100 font-barlow-medium leading-6">
Aprender a programar significa aprender a pensar en pasos lógicos,
dividir un problema en partes más pequeñas y dar instrucciones claras.
</Text>
</View>
);
}