import { Stack } from 'expo-router';

export default function EditorLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#0A84FF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
            }}
        >
            <Stack.Screen
                name='index'
                options={{
                    headerShown: false,

                }}
            />


        </Stack>

    );
}
