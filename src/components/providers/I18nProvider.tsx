'use client';

import { useState, createContext, useContext, ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

import zhMessages from "../../../messages/zh.json";
import enMessages from "../../../messages/en.json";

const messagesMap = {
  zh: zhMessages,
  en: enMessages,
};

interface I18nContextType {
  locale: "zh" | "en";
  switchLocale: (targetLocale: "zh" | "en") => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "zh",
  switchLocale: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: "zh" | "en";
  children: ReactNode;
}) {
  const [locale, setLocale] = useState<"zh" | "en">(initialLocale);

  const switchLocale = (targetLocale: "zh" | "en") => {
    setLocale(targetLocale);

    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      let newPath = currentPath;
      if (currentPath.startsWith("/zh")) {
        newPath = currentPath.replace(/^\/zh/, `/${targetLocale}`);
      } else if (currentPath.startsWith("/en")) {
        newPath = currentPath.replace(/^\/en/, `/${targetLocale}`);
      } else {
        const cleanPath = currentPath.startsWith("/") ? currentPath : `/${currentPath}`;
        newPath = `/${targetLocale}${cleanPath}`;
      }
      window.history.replaceState(null, "", newPath);
    }
  };

  const messages = messagesMap[locale] || zhMessages;

  return (
    <I18nContext.Provider value={{ locale, switchLocale }}>
      <NextIntlClientProvider messages={messages} locale={locale}>
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}
