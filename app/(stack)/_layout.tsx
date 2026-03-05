import { useTheme } from '@/src/context/ThemeContext';
import { Stack } from 'expo-router';
import React from 'react';

const StackLayout = () => {
    const { isDark } = useTheme();
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: isDark ? '#454958' : '#0099FF' } 
            }
            }>

            <Stack.Screen
                name='carrusel/index'
                options={{
                    title: 'Carrusel'

                }} />

            <Stack.Screen
                name='register/index'
                options={{
                    title: 'Register',
                    contentStyle: { backgroundColor: isDark ? '#343734' : '#FFFFFF' } 

                }} />

            <Stack.Screen
                name='terms/index'
                options={{
                    title: 'Terms and Conditions'

                }} />

            <Stack.Screen
                name='login/index'
                options={{
                    title: 'Login',
                    contentStyle: { backgroundColor: isDark ? '#343734' : '#FFFFFF' } 

                }} />

            <Stack.Screen
                name='forgotPassword/index'
                options={{
                    title: 'Forgot Password'

                }} />




        </Stack>
    )
}

export default StackLayout