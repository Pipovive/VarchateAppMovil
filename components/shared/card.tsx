import React from 'react';
import { Text, View } from 'react-native';

interface props {
    children: string;
    className?: string;
}


const card = ({children, className} :props) => {
    return (
    <View className='w'>
      <Text>{children}</Text>
    </View>
  )
}

export default card