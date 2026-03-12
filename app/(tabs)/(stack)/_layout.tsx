import { useTheme } from '@/src/context/ThemeContext';
import { Stack } from 'expo-router';
import React from 'react';

const StackProfile = () => {
    const { isDark } = useTheme();

    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: isDark ? '#454958' : '#FFFFFF' },
                headerStyle: {
                    backgroundColor: '#0A84FF',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
            }}
        >
            <Stack.Screen name='profile/index' options={{ title: 'Profile', headerShown: false }} />
            <Stack.Screen name='profile/[id]' options={{ title: 'Profile', headerShown: false }} />
            <Stack.Screen name='code/index' options={{ title: 'Index.HTML', headerShown: true }} />
            <Stack.Screen name='editor/index' options={{ title: 'Profile', headerShown: false }} />
            <Stack.Screen name='certificado' options={{ title: 'Certificado', headerShown: false, presentation: 'card' }} />
            <Stack.Screen name='rankin/index' options={{ title: 'Ranking', headerShown: false, presentation: 'card' }} />
            <Stack.Screen name='termos' options={{ title: 'Términos y Condiciones', headerShown: false }} />
            <Stack.Screen name='privacy' options={{ title: 'Política de Privacidad', headerShown: false }} />
        </Stack>
    );
};

export default StackProfile;