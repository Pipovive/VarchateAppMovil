import { Tabs } from 'expo-router';
import React from 'react';
import { Image } from 'react-native';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0099FF',
          paddingHorizontal: 20,
          borderTopWidth: 0, // Elimina borde superior
          elevation: 0, // Elimina sombra en Android
          shadowOpacity: 0, // Elimina sombra en iOS
        },
        tabBarItemStyle: {
          gap: 10,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',

      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Módulos',
          tabBarLabelStyle: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/VA.png')}
              style={{
                width:  focused ? 28 : 24,
                height:  focused ? 28 : 24,
                resizeMode: 'contain',
              }}
            />
          )
        }}
      />

      <Tabs.Screen
        name="editor"
        options={{
          title: 'Editor',
          tabBarLabelStyle: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarIcon: ({  focused }) => (
            <Image
              source={require('../../assets/images/codeW.png')}
              style={{
                width:  focused ? 28 : 24,
                height:  focused ? 28 : 24 ,
                resizeMode: 'contain',
              }}
            />
          )
        }}
      />

      <Tabs.Screen
        name="chatbot/index"
        options={{
          title: 'Pregúntar',
          tabBarLabelStyle: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/iaW.png')}
              style={{
                width:  focused ? 28 : 24 ,
                height:  focused ? 28 : 24 ,
                resizeMode: 'contain',
              }}
            />
          )
        }}
      />

      <Tabs.Screen
        name="(stack)"
        options={{
          title: 'Perfil',
          tabBarIcon: ({  }) => (
            <Image
              source={require('../../assets/images/foto-perfil.png')}
              style={{
                width:  24,
                height:  24, 
                borderRadius: 50,
                borderColor: 'white'
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(drawer)"
        options={{
          href: null,
        }}
      />


    </Tabs>
  );
};

export default TabsLayout;
