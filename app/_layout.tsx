import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
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

  return <Slot />
}

export default RootLayout