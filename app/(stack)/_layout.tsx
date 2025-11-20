import { Stack } from 'expo-router'
import React from 'react'

const StackLayout = () => {
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
        name='carrusel/index'
        options={{
            title: 'Carrusel'

        }}/>
        
        <Stack.Screen
        name='register/index'
        options={{
            title: 'Register'

        }}/>
        
        <Stack.Screen
        name='terms/index'
        options={{
            title: 'Terms and Conditions'

        }}/>

        <Stack.Screen
        name='login/index'
        options={{
            title: 'Login'

        }}/>

        <Stack.Screen
        name='forgotPassword/index'
        options={{
            title: 'Forgot Password'

        }}/>
        



    </Stack>
  )
}

export default StackLayout