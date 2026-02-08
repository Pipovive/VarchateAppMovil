import { Stack } from 'expo-router'
import React from 'react'

const StackProfile = () => {
    return (
        <Stack
            screenOptions={{

                contentStyle: {
                    backgroundColor: 'white'
                },
                headerStyle: {
                    backgroundColor: '#0A84FF', // 🔵 azul
                },
                headerTintColor: '#FFFFFF', // color flecha y título
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
            }
            }>

            <Stack.Screen
                name='profile/index'
                options={{
                    title: 'Profile',
                    headerShown: false,

                }} />

            <Stack.Screen
                name='profile/[id]'
                options={{
                    title: 'Profile',
                    headerShown: false,

                }} />

            <Stack.Screen
                name='code/index'
                options={{
                    title: 'Index.HTML',
                    headerShown: true,

                }} />

            <Stack.Screen
                name='editor/index'
                options={{
                    title: 'Profile',
                    headerShown: false,

                }} />


        </Stack>
    )
}

export default StackProfile