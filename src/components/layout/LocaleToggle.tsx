'use client';

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { useState } from "react";

export function LocaleToggle() {
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const [loading, setLoading] = useState(false);

  const targetLocale = locale === "zh" ? "en" : "zh";
  const label = locale === "zh" ? "EN / 英文" : "中文 / ZH";

  const handleSwitch = () => {
    setLoading(true);
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
    let newPath = currentPath;

    if (currentPath.startsWith("/zh")) {
      newPath = currentPath.replace(/^\/zh/, "/en");
    } else if (currentPath.startsWith("/en")) {
      newPath = currentPath.replace(/^\/en/, "/zh");
    } else {
      const cleanPath = currentPath.startsWith("/") ? currentPath : `/${currentPath}`;
      newPath = `/${targetLocale}${cleanPath}`;
    }

    window.location.href = newPath;
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      disabled={loading}
      title={tNav("language")}
      className="
        relative flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold
        bg-white border border-slate-200 text-slate-800 hover:border-hextech-blue hover:text-hextech-blue hover:bg-slate-50
        dark:bg-slate-900/80 dark:border-white/10 dark:text-slate-100 dark:hover:border-hextech-blue/50 dark:hover:text-hextech-blue dark:hover:bg-hextech-blue/10
        transition-all duration-300 backdrop-blur-md shadow-sm disabled:opacity-60 cursor-pointer z-30
      "
    >
      <Languages className="w-4 h-4 text-hextech-blue shrink-0" />
      <span>{label}</span>
      {loading && (
        <span className="w-3 h-3 border-2 border-hextech-blue border-t-transparent rounded-full animate-spin ml-1" />
      )}
    </button>
  );
}
