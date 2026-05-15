'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import es from '../locales/es.json';
import en from '../locales/en.json';

type Locale = 'es' | 'en';
type Translations = typeof es;

interface LocaleContextType {
  locale: Locale;
  t: (path: string) => string;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translations: Record<Locale, Translations> = { es, en };

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedLocale = localStorage.getItem('saidon-locale') as Locale;
      if (savedLocale) setLocaleState(savedLocale);
    } catch (error) {
      console.error('LocaleContext: Error loading locale:', error);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('saidon-locale', newLocale);
    } catch (error) {
      console.error('LocaleContext: Error saving locale:', error);
    }
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: Translations | string = translations[locale];
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = (result as Record<string, unknown>)[key] as Translations | string;
      } else {
        return path;
      }
    }
    return typeof result === 'string' ? result : path;
  };

  return (
    <LocaleContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
