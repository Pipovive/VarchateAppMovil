import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="editor/index"
        options={{
          title: 'Editor',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="code" color={color} />,
        }}
      />

       <Tabs.Screen
        name="chatbot/index"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="wechat" color={color} />,
        }}
      />

       <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
    </Tabs>

    
  );
}

export default TabsLayout