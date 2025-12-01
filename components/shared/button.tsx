import React from 'react';
import { Image, Pressable, PressableProps, Text } from 'react-native';


interface props extends PressableProps {
    children : string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
    variant?: 'contained' | 'facebook' | 'google' | 'text-only' | 'card'; 
    className?: string;
    font?:  'medium' | 'bold' | 'extraBold';
    source?: {};
    textPos?: 'left' | 'right' | 'center';   

}

const Button = ({children, color='primary', variant='contained', className, onPress, font='bold', source, textPos='center'}:props) => {
    const txtPos = {
        left:'text-left',
        right: 'text-right',
        center: 'text-center'
    }[textPos];

    const btnColor = {
    primary : 'bg-primary',
    secondary : 'bg-secondary',
    tertiary : 'bg-tertiary',
    quaternary : 'bg-quaternary'
}[color];

const btnText = {
    primary : 'color-quaternary',
    secondary : 'color-quaternary',
    tertiary : 'color-quaternary',
    quaternary : 'color-secondary'
}[color];

const btnFont = {
    medium : 'font-barlow-medium',
    bold: 'font-barlow-bold',
    extraBold: 'font-barlow-extraBold'
}[font]

    if (variant==='text-only') {
        return (
            <Pressable className={`p-3 ${className}`}
                onPress={onPress}
            >
                <Text className={`${txtPos} color-primary-200 ${btnFont}`}>{children}</Text>
            </Pressable>
        )
    } else if (variant === 'facebook') {
        return (
        <Pressable className={`p-3 rounded-md border-primary-200 border-2 active:opacity-90 ${className}`}
            onPress={onPress}
        >
            <Text className={`${txtPos} color-primary-200 ${btnFont}`}>{children}</Text>
        </Pressable>
        )
    } else if (variant === 'google') {
        return (
        <Pressable className={`p-3 rounded-md border-tertiary border-2 active:opacity-90 ${className}`}
            onPress={onPress}
        >
            <Text className={`${txtPos} color-tertiary ${btnFont}`}>{children}</Text>
        </Pressable>
        )
    } else if (variant === 'card') {
        return (
        <Pressable className={`my-4 p-3 active:opacity-90 ${className} `}
            onPress={onPress}
        >
            <Image 
                source={source}
                style={{width: "60%",
                height: "60%",
                resizeMode: "contain",
                marginBottom: 15,
            }} 
            />
            <Text className={`${txtPos} text-black ${btnFont} `}>{children}</Text>
        </Pressable>
  )
    }

  return (
    <Pressable className={`p-3 rounded-md ${btnColor} active:opacity-90 ${className}`}
        onPress={onPress}
        >
        <Text className={`text-lg ${txtPos} ${btnText} ${btnFont}`}>{children}</Text>
    </Pressable>
  )
}

export default Button