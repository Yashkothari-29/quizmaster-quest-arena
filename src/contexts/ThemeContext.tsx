
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme>('dark');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or use default
    const savedTheme = localStorage.getItem('quizquest_theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (user?.preferences?.theme) {
      setTheme(user.preferences.theme);
    }
    
    setIsInitialized(true);
  }, [user]);

  useEffect(() => {
    // Only update document when theme changes and after initialization
    if (isInitialized) {
      // Remove both classes first
      document.documentElement.classList.remove('dark', 'light');
      // Add the current theme class
      document.documentElement.classList.add(theme);
      // Save to localStorage
      localStorage.setItem('quizquest_theme', theme);
    }
  }, [theme, isInitialized]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
