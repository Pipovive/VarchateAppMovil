// app/_layout.tsx
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

import { LessonProvider } from '@/src/context/LessonContext';
import { ModuleProvider } from '@/src/context/ModuleContext';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar'; // ← AGREGA
import React, { useEffect } from 'react';
import "./global.css";


SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    'BarlowSemiCondensed-Bold': require('../assets/fonts/BarlowSemiCondensed-Bold.ttf'),
    'BarlowSemiCondensed-ExtraBold': require('../assets/fonts/BarlowSemiCondensed-ExtraBold.ttf'),
    'BarlowSemiCondensed-Medium': require('../assets/fonts/BarlowSemiCondensed-Medium.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error])

  if (!fontsLoaded && !error) return null;

  return (
    <ThemeProvider>
      <ModuleProvider>
        <LessonProvider>
          <StatusBar style="light" backgroundColor="#0099FF" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0099FF' } }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </LessonProvider>
      </ModuleProvider>
    </ThemeProvider>

  );
}

export default RootLayout