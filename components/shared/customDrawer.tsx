import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, PressableProps, Text, View, ViewStyle } from "react-native";

interface DrawerButtonProps extends PressableProps {
  children?: React.ReactNode;  // ← CAMBIO: de 'string' a 'React.ReactNode'
  className?: string;
  variant?: "active" | "no-active";
  locked?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  completed?: boolean;
  style?: ViewStyle;  // ← AGREGADO: para soportar style prop
}

const CustomDrawerButton = ({
  children,
  className,
  variant = "no-active",
  locked = false,
  icon,
  completed = false,
  style,  // ← AGREGADO
  ...rest
}: DrawerButtonProps) => {
  const isActive = variant === "active";

  return (
    <Pressable
      className={`
        w-full py-4 px-4 rounded-2xl flex-row items-center justify-between
        ${isActive ? "bg-primary-200" : "bg-white/50"}
        ${locked ? "opacity-60" : "opacity-100"}
        ${className ?? ""}
      `}
      style={style}  // ← AGREGADO: aplicar style prop
      disabled={locked}
      {...rest}
    >
      <View className="flex-row items-center flex-1">
        {/* Icono izquierdo opcional */}
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isActive ? "#fff" : "#666"}
            style={{ marginRight: 12 }}
          />
        )}

        <Text
          className={`
            font-barlow-semibold text-base flex-1
            ${isActive ? "text-white" : "text-gray-700"}
          `}
          numberOfLines={1}
        >
          {children}
        </Text>
      </View>

      {/* Estado del botón */}
      <View className="ml-2">
        {locked && (
          <Ionicons name="lock-closed" size={18} color={isActive ? "#fff" : "#666"} />
        )}
        {completed && !locked && (
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        )}
        {isActive && !locked && !completed && (
          <View className="w-2 h-2 bg-white rounded-full" />
        )}
      </View>
    </Pressable>
  );
};

export default CustomDrawerButton;