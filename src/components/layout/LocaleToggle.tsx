'use client';

import { Languages } from "lucide-react";

interface LocaleToggleProps {
  currentLocale: "zh" | "en";
  onLocaleChange: (locale: "zh" | "en") => void;
}

export function LocaleToggle({ currentLocale, onLocaleChange }: LocaleToggleProps) {
  const nextLocale = currentLocale === "zh" ? "en" : "zh";
  const label = currentLocale === "zh" ? "EN / 英文" : "中文 / ZH";

  return (
    <button
      onClick={() => onLocaleChange(nextLocale)}
      title={currentLocale === "zh" ? "Switch to English" : "切换为中文"}
      className="
        relative flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-semibold
        bg-white/5 border border-white/10 dark:bg-slate-900/60 dark:border-white/10
        hover:border-hextech-blue/50 hover:text-hextech-blue hover:bg-hextech-blue/10
        transition-all duration-300 backdrop-blur-md shadow-md text-slate-200 dark:text-slate-200
      "
    >
      <Languages className="w-4 h-4 text-hextech-blue" />
      <span>{label}</span>
    </button>
  );
}
