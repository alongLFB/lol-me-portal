'use client';

import { useI18n } from "@/components/providers/I18nProvider";
import { useTranslations } from "next-intl";
import { Languages } from "lucide-react";

export function LocaleToggle() {
  const { locale, switchLocale } = useI18n();
  const tNav = useTranslations("nav");

  const targetLocale = locale === "zh" ? "en" : "zh";
  const label = locale === "zh" ? "EN / 英文" : "中文 / ZH";

  return (
    <button
      type="button"
      onClick={() => switchLocale(targetLocale)}
      title={tNav("language")}
      className="
        relative flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold
        bg-white border border-slate-200 text-slate-800 hover:border-hextech-blue hover:text-hextech-blue hover:bg-slate-50
        dark:bg-slate-900/80 dark:border-white/10 dark:text-slate-100 dark:hover:border-hextech-blue/50 dark:hover:text-hextech-blue dark:hover:bg-hextech-blue/10
        transition-all duration-300 backdrop-blur-md shadow-sm cursor-pointer z-30
      "
    >
      <Languages className="w-4 h-4 text-hextech-blue shrink-0" />
      <span>{label}</span>
    </button>
  );
}
