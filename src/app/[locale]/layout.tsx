import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";

import zhMessages from "../../../messages/zh.json";
import enMessages from "../../../messages/en.json";

const messagesMap = {
  zh: zhMessages,
  en: enMessages,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "zh" | "en")) {
    notFound();
  }

  const messages = messagesMap[locale as "zh" | "en"] || zhMessages;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
