import { Stack } from 'expo-router'
import React from 'react'

export default function StackViews() {
  return (
    <Stack
        screenOptions={{
            headerShown: false,
            contentStyle: {
                backgroundColor: 'white'
            }
        }        
        }>
            
        <Stack.Screen
        name='competition/[language]/index'
        options={{
            title: "Competition" 
        }}/>
        

    </Stack>
  )
}
