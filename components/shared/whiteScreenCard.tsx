import React from "react";
import { StyleSheet, View } from "react-native";

type Props = { children: React.ReactNode; innerPadding?: number };

export function WhiteScreenContainer({ children, innerPadding = 20 }: Props) {
  
  return (
    <View
      style={
        styles.outer}
        className="px-3 mt-8"
        >
        <View
        style={{
          padding: innerPadding,
          borderRadius: 0,
          backgroundColor: "#ffffff",
        }}
    >
      
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: "100%",
  },
});
