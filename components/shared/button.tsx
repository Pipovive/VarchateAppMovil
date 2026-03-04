import React from 'react';
import { Image, Pressable, PressableProps, Text, View } from 'react-native';


interface props extends PressableProps {
    children?: string;
    color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
    variant?: 'contained' | 'facebook' | 'google' | 'text-only' | 'card' | 'toggle';
    className?: string;
    font?: 'medium' | 'bold' | 'extraBold';
    source?: {};
    textPos?: 'left' | 'right' | 'center';
    value?: boolean;
    textColor?: 'normal' | 'link';



}

const Button = ({ children, color = 'primary', variant = 'contained', className, onPress, font = 'bold', source, textPos = 'center', value, textColor = 'link' }: props) => {
    const txtPos = {
        left: 'text-left',
        right: 'text-right',
        center: 'text-center'
    }[textPos];

    const btnColor = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        tertiary: 'bg-tertiary',
        quaternary: 'bg-quaternary'
    }[color];

    const btnText = {
        primary: 'color-quaternary',
        secondary: 'color-quaternary',
        tertiary: 'color-quaternary',
        quaternary: 'color-secondary'
    }[color];

    const btnFont = {
        medium: 'font-barlow-medium',
        bold: 'font-barlow-bold',
        extraBold: 'font-barlow-extraBold'
    }[font]

    if (variant === 'text-only') {
        return (
            <Pressable className={`p-3 ${className}`}
                onPress={onPress}
            >
                <Text className={`${txtPos} ${textColor != 'link' ? 'color-secondary-600' : ' color-primary-200'} ${btnFont}`}>{children}</Text>
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
            <Pressable className={`p-3 rounded-md border-tertiary border-2 active:opacity-90 w-full ${className}`}
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
                    style={{
                        width: "50%",
                        height: "50%",
                        resizeMode: "contain",
                        marginBottom: 15,
                    }}
                />
                <Text className={`${txtPos} text-black ${btnFont} `}>{children}</Text>
            </Pressable>
        )
    } else if (variant === 'toggle') {
        return (
            <Pressable className={`h-10 mr-2 w-20 flex-row rounded-full p-1 ${value ? 'bg-primary-100' : 'bg-secondary-100'} `}
                onPress={onPress}
            >

                <View className={`w-8 h-8 rounded-full bg-quaternary ${value ? 'ml-10' : 'ml-0'}`}></View>

                {/* <Text className='text-sm'>{value ? 'Light' : 'Dark'}</Text> */}

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