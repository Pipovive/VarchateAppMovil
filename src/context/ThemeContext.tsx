import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}>({ theme: 'light', toggleTheme: () => {}, isDark: false });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('light');

    // Cargar tema guardado al iniciar
    useEffect(() => {
        AsyncStorage.getItem('theme').then(saved => {
            if (saved === 'light' || saved === 'dark') {
                setTheme(saved);
            }
        });
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await AsyncStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);