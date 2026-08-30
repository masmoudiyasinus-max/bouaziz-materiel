import React, { createContext, useContext, useMemo } from 'react';
import frDict from '../locales/fr.json';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const t = useMemo(() => {
    const dict = frDict || {};
    return (path, fallback = '') => {
      if (!path || typeof path !== 'string') return fallback || '';
      const keys = path.split('.');
      let current = dict;
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return fallback || path;
        }
      }
      return typeof current === 'string' ? current : (fallback || path);
    };
  }, []);

  const value = useMemo(() => ({
    language: 'fr',
    dir: 'ltr',
    isAr: false,
    t,
    dict: frDict || {},
  }), [t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
