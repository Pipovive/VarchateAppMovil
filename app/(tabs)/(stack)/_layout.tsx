import { Stack } from 'expo-router'
import React from 'react'

const StackProfile = () => {
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
        name='profile/index'
        options={{
            title: 'Profile'

        }}/>
        

    </Stack>
  )
}

export default StackProfile