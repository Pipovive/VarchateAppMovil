import { AVATARS } from '@/src/const/avatar';
import { useTheme } from '@/src/context/ThemeContext';
import { useUserViewModel } from '@/src/viewmodels/UserViewModel';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabsLayout = () => {
  const { user, fetchUser } = useUserViewModel();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchUser();
  }, []);

  const tabBarBg = isDark ? '#1B1D23' : '#0099FF';
  const activeColor = '#FFFFFF';
  const inactiveColor = isDark ? '#6B7280' : 'rgba(255,255,255,0.45)';

  const tabIcon = (source: any, focused: boolean, rounded = false) => (
    <View style={{
      backgroundColor: focused
        ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)')
        : 'transparent',
      borderRadius: 12,
      padding: 4,
      minWidth: 40,
      alignItems: 'center',
    }}>
      <Image
        source={source}
        style={{
          width: focused ? 26 : 22,
          height: focused ? 26 : 22,
          resizeMode: 'contain',
          borderRadius: rounded ? 13 : 0,
          borderWidth: rounded && focused ? 2 : rounded ? 1.5 : 0,
          borderColor: rounded ? (focused ? '#FFFFFF' : inactiveColor) : 'transparent',
          opacity: focused ? 1 : (isDark ? 0.5 : 0.55),
        }}
      />
    </View>
  );

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
          height: 60 + insets.bottom, // ← altura + espacio del sistema
          paddingBottom: insets.bottom, // ← empuja el contenido hacia arriba
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Módulos',
          tabBarIcon: ({ focused }) => tabIcon(require('../../assets/images/VA.png'), focused),
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: 'Editor',
          tabBarIcon: ({ focused }) => tabIcon(require('../../assets/images/codeW.png'), focused),
        }}
      />
      <Tabs.Screen
        name="chatbot/index"
        options={{
          href: null,
          title: 'Preguntar',
          tabBarIcon: ({ focused }) => tabIcon(require('../../assets/images/iaW.png'), focused),
        }}
      />
      <Tabs.Screen
        name="rankin/index"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ focused }) => tabIcon(require('../../assets/images/rankin.png'), focused),
        }}
      />
      <Tabs.Screen
        name="(stack)"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => tabIcon(AVATARS[user?.avatar_id || 1], focused, true),
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