import CustomDrawerButton from "@/components/shared/customDrawer";



import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompetitionLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#AFCBFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontFamily: "Barlow-Bold",
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: "#EAF4FF",
          width: 280,
        },
      }}
      drawerContent={(props) => <CustomContent {...props} />}
    >
      <Drawer.Screen
        name="competition/[slug]"
        options={{ 
          title: "Introducción",
          drawerLabel: "Introducción"
        }}
      />

      <Drawer.Screen
        name="lesson/index"
        options={{ 
          title: "Lección 1",
          drawerLabel: "Lección 1"
        }}
      />

      <Drawer.Screen
        name="evaluate/index"
        options={{ 
          title: "Evaluación",
          drawerLabel: "Evaluación"
        }}
      />
    </Drawer>
  );
}

function CustomContent(props: DrawerContentComponentProps) {
  const currentRoute = props.state.routeNames[props.state.index];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ 
        paddingTop: 0,
        paddingHorizontal: 0,
      }}
      style={{ backgroundColor: "#EAF4FF" }}
    >
      
      {/* HEADER DEL DRAWER */}
      <SafeAreaView>
      {/* SECCIÓN: CONTENIDO DEL CURSO */}
      <View className="pt-6 px-4">
        <Text className="font-barlow-semibold text-sm text-gray-600 mb-3 px-2">
          CONTENIDO DEL CURSO
        </Text>

        <CustomDrawerButton
          variant={currentRoute.includes("competition") ? "active" : "no-active"}
          onPress={() => router.push("/(drawer)/competition/javascript" as any)}
          className="mb-3"
        >
          Introducción
        </CustomDrawerButton>

        <CustomDrawerButton
          variant={currentRoute.includes("lesson") ? "active" : "no-active"}
          onPress={() => router.push("/(drawer)/lesson" as any)}
          className="mb-3"
        >
          Lección 1
        </CustomDrawerButton>

        <CustomDrawerButton
          onPress={() => router.push("/(drawer)/evaluate" as any)}
          className="mb-3"
        >
          Evaluación
        </CustomDrawerButton>
      </View>
      </SafeAreaView>
 

    </DrawerContentScrollView>
  );
}