import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';


interface props extends TextInputProps {
    label?: string;
    error?: string;

}

const Input = ( {label, error, ...rest} : props) => {

  return (
        <View className='w-full mb-4'>
            {label && (
                <Text className='mb-1 text-sm font-barlow-medium text-secondary'>
                    {label}
                </Text>
            )}
            <View className={`flex-row items-center rounded-xl border px-4  bg-quaternary ${error ? 'border-r-tertiary' : 'border-r-secondary-100'}`}>
                <TextInput 
                className='flex-1 text-base text-secondary-100'
                placeholderTextColor='#757575'
                {...rest}
                />
            </View>
            {error && (
                <Text className='mt-1 font-barlow-medium text-left text-sm text-tertiary'>{error}</Text>
            )}
        </View>
     
  )
}

export default Input