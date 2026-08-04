'use client';

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const tNav = useTranslations("nav");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const isDark = theme === "dark" || theme === undefined;

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? tNav("theme_light") : tNav("theme_dark")}
      aria-label="Toggle theme mode"
      className="
        relative w-10 h-10 rounded-2xl flex items-center justify-center
        bg-white border border-slate-200 text-slate-800 hover:border-hextech-blue hover:bg-slate-50
        dark:bg-slate-900/80 dark:border-white/10 dark:text-slate-100 dark:hover:border-hextech-blue/50 dark:hover:bg-hextech-blue/10
        transition-all duration-300 group backdrop-blur-md shadow-sm cursor-pointer
      "
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
      ) : (
        <Moon className="w-5 h-5 text-hextech-blue transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      )}
    </button>
  );
}
