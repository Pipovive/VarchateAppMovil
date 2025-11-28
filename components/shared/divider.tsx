import React from 'react';
import { Text, View } from 'react-native';

interface props {
    text ?: string;
}

const Divider = ({text='O'}: props) => {
  return (
    <View className='flex-row items-center my-4'>
      <View className='flex-1 h-px bg-secondary-100/10'
        />
        <Text className='mx-3 text-secondary-100 font-barlow-medium'>{text}</Text>
      <View className='flex-1 h-px bg-secondary-100/10'
        />
    </View>
  )
}

export default Divider