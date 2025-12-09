import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#276CDC',   // ← barra azul
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) =>
            <FontAwesome size={28} name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="editor/index"
        options={{
          title: 'Editor',
          tabBarIcon: ({ color }) =>
            <FontAwesome size={28} name="code" color={color} />,
        }}
      />

      <Tabs.Screen
        name="chatbot/index"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color }) =>
            <FontAwesome size={28} name="wechat" color={color} />,
        }}
      />

      <Tabs.Screen
        name="(stack)"
        options={{
          title: 'Profile',
          tabBarIcon: ({  size }) => (
            <Image
              source={require('../../assets/images/foto-perfil.png')}
              style={{
                width: size,
                height: size,
                borderRadius: 50,
                borderColor: 'white'
              }}
            />
          ),  
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
