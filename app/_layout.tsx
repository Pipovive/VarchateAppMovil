// app/_layout.tsx
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

import { LessonProvider } from '@/src/context/LessonContext';
import { ModuleProvider } from '@/src/context/ModuleContext';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
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
    <ModuleProvider>
      <LessonProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </LessonProvider>
    </ModuleProvider>
  );
}

export default RootLayout