import { AVATARS } from '@/src/const/avatar';
import { useTheme } from '@/src/context/ThemeContext';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Image } from 'react-native';

const TabsLayout = () => {
  const { user, fetchUser } = useUserViewModel();
  const { isDark } = useTheme();

  useEffect(() => {
    fetchUser();
  }, []);

  const tabBarBg = isDark ? '#1B1D23' : '#0099FF';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          paddingHorizontal: 20,
          borderTopWidth: isDark ? 1 : 0,
          borderTopColor: isDark ? '#374151' : 'transparent',
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
        tabBarInactiveTintColor: isDark ? '#6B7280' : '#FFFFFF',
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
                opacity: (!isDark || focused) ? 1 : 0.5,
              }}
            />
          ),
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
                opacity: (!isDark || focused) ? 1 : 0.5,
              }}
            />
          ),
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
                opacity: (!isDark || focused) ? 1 : 0.5,
              }}
            />
          ),
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
                opacity: (!isDark || focused) ? 1 : 0.5,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(stack)"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <Image
              source={AVATARS[user?.avatar_id || 1]}
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: focused ? '#FFFFFF' : isDark ? '#4B5563' : '#FFFFFF',
                opacity: (!isDark || focused) ? 1 : 0.7,
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(drawer)"
        options={{ href: null }}
      />
    </Tabs>
  );
};

export default TabsLayout;