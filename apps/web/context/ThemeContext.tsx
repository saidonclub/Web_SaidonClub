'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedTheme = localStorage.getItem('saidon-theme') as Theme;
      const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      const initialTheme = savedTheme || systemTheme;

      console.log('ThemeContext: Initial theme:', initialTheme);
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
      (window as unknown as Record<string, unknown>).THEME_CONTEXT_RUNNING = true;
    } catch (error) {
      console.error('ThemeContext: Error initializing theme:', error);
    }
  }, []);

  const toggleTheme = () => {
    console.log('ThemeContext: Toggling theme from:', theme);
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      console.log('ThemeContext: New theme will be:', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      try {
        localStorage.setItem('saidon-theme', newTheme);
      } catch (error) {
        console.error('ThemeContext: Error saving theme:', error);
      }
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
