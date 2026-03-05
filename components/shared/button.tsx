import { useTheme } from '@/src/context/ThemeContext';
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
    style?: object;


}

const Button = ({ children, color = 'primary', variant = 'contained', className, onPress, font = 'bold', source, textPos = 'center', value, textColor = 'link', style }: props) => {
    const { isDark } = useTheme();
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
            <Pressable
                style={{
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: isDark ? '#E67F76' : '#FF6B6B',
                    backgroundColor: isDark ? '#1B1D23' : 'transparent',
                    width: '100%',
                    opacity: 1,
                }}
                className={`active:opacity-90 ${className}`}
                onPress={onPress}
            >
                <Text style={{
                    textAlign: 'center',
                    color: isDark ? '#FFFFFF' : '#FF6B6B',
                    fontFamily: 'Barlow-Bold'
                }}>
                    {children}
                </Text>
            </Pressable>
        )
    } else if (variant === 'card') {
        return (
            <Pressable className={`my-4 p-3 active:opacity-90 ${className} `}
                onPress={onPress}
                style={style}
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
            <Pressable
                style={{
                    height: 40,
                    width: 80,
                    borderRadius: 20,
                    padding: 4,
                    backgroundColor: value ? '#0099FF' : '#9CA3AF',
                }}
                onPress={() => {
                    console.log('🔘 Toggle presionado, value actual:', value);
                    // onPress?.(); // ← llama onPress si existe
                }}
            >
                <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#FFFFFF',
                    marginLeft: value ? 36 : 0,
                }} />
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