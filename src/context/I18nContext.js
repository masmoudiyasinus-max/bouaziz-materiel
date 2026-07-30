"use client";
import React, { createContext, useContext } from "react";

const I18nContext = createContext({
  locale: "fr",
  t: {},
  isAr: false
});

export const I18nProvider = ({ locale, dict, children }) => {
  const isAr = locale === "ar";
  return (
    <I18nContext.Provider value={{ locale, t: dict, isAr }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
