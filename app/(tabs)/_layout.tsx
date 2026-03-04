import { AVATARS } from '@/src/const/avatar';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Image } from 'react-native';


const TabsLayout = () => {
  const { user, loading: userLoading, error: userError, fetchUser } = useUserViewModel();
  useEffect(() => {
    fetchUser()
  }, [])
 
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0099FF',
          paddingHorizontal: 20,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: 0,
        },
        tabBarLabelStyle: {
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#FFFFFF',
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Módulos',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/VA.png')}
              style={{
                width: focused ? 28 : 24,
                height: focused ? 28 : 24,
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
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/codeW.png')}
              style={{
                width: focused ? 28 : 24,
                height: focused ? 28 : 24,
                resizeMode: 'contain',
              }}
            />
          )
        }}
      />

      <Tabs.Screen
        name="chatbot/index"
        options={{
          href: null,
          title: 'Pregúntar',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/iaW.png')}
              style={{
                width: focused ? 28 : 24,
                height: focused ? 28 : 24,
                resizeMode: 'contain',
              }}
            />
          )
        }}
      />

      <Tabs.Screen
        name="rankin/index"
        options={{
          title: 'rankin',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/rankin.png')}
              style={{
                width: focused ? 28 : 24,
                height: focused ? 28 : 24,
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
          tabBarIcon: () => (
            <Image
              source={AVATARS[user?.avatar_id || 1]}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'white',
              }}
            />
          ),
        }}
      />




      {/* Oculta el drawer de los tabs */}
      <Tabs.Screen
        name="(drawer)"
        options={{
          href: null, // ← Esto oculta el drawer de la tab bar
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;