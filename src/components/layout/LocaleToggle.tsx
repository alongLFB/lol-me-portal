'use client';

import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { useState } from "react";

export function LocaleToggle() {
  const locale = useLocale();
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
      title={locale === "zh" ? "Switch to English" : "切换为中文"}
      className="
        relative flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-semibold
        bg-white/5 border border-white/10 dark:bg-slate-900/60 dark:border-white/10
        hover:border-hextech-blue/50 hover:text-hextech-blue hover:bg-hextech-blue/10
        transition-all duration-300 backdrop-blur-md shadow-md text-slate-200 dark:text-slate-200
        disabled:opacity-60 cursor-pointer z-30
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
