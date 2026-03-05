import React, { createContext, useContext, useState } from 'react';

type theme = 'light' | 'dark';

const ThemeContext = createContext<{
    theme: theme;
    toggleTheme: () => void;
    isDark: boolean;
}>({ theme: 'light', toggleTheme: () => {}, isDark: false });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<theme>('light');
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);