import { Drawer } from 'expo-router/drawer';
import React from 'react';

const _layout = () => {
  return (
    <Drawer>
      <Drawer.Screen
        name="index"
        options={{ title: "Lesson" }}
      />

      <Drawer.Screen
        name="(drawer)/introduction/index"
        options={{ title: "Introduction" }}
      />

      <Drawer.Screen
        name="(drawer)/evaluate/index"
        options={{ title: "Evaluation" }}
      />

      <Drawer.Screen
        name="(drawer)/lesson/index"
        options={{ title: "Content" }}
      />
    </Drawer>
  )
}

export default _layout