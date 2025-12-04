import React from 'react';
import { Text, View } from 'react-native';


interface props {
    title: string;
    progress: number;
    className?: string;
    barColor ?: string;
    bgColor ?: string;
}

const ProgressCard = ({title, progress, className, barColor='bg-primary-100', bgColor='bg-primary-400'}: props) => {
  return (
    <View className={`rounded-2xl mt-4 p-3 ${bgColor} ${className}`}>
      
      <Text className="font-barlow-bold text-2xl text-secondary mx-2">
        {title}
      </Text>

      <View
        style={{
          marginTop: 14,
          backgroundColor: "#FFFFFF",  
          borderRadius: 999,
          paddingHorizontal: 8,
          paddingVertical: 6,
        }}
      >
        <View
          style={{
            height: 13,
            borderRadius: 999,
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              height: 13,
              borderRadius: 10,
              width: `${progress}%`,
              backgroundColor: '#0099FF',
            }}
          />
        </View>
      </View>

      <Text className="font-barlow-bold text-xl mt-2 text-secondary text-right">
        {progress}%
      </Text>

    </View>
  )
}

export default ProgressCard