'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

import zhMessages from "../../../messages/zh.json";
import enMessages from "../../../messages/en.json";

const messagesMap = {
  zh: zhMessages,
  en: enMessages,
};

interface I18nContextType {
  locale: "zh" | "en";
  setLocale: (locale: "zh" | "en") => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "zh",
  setLocale: () => {},
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
  const [timeZone, setTimeZone] = useState<string>("UTC");

  useEffect(() => {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (userTimeZone) {
        setTimeZone(userTimeZone);
      }
    } catch {
      // Fallback
    }
  }, []);

  const messages = messagesMap[locale] || zhMessages;

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider messages={messages} locale={locale} timeZone={timeZone}>
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}
