'use client';

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
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
      title={isDark ? "切换为白昼浅色模式" : "切换为海克斯暗黑夜间模式"}
      aria-label="Toggle theme mode"
      className="
        relative w-10 h-10 rounded-2xl flex items-center justify-center
        bg-white/5 border border-white/10 dark:bg-slate-900/60 dark:border-white/10
        hover:border-hextech-blue/50 hover:bg-hextech-blue/10
        transition-all duration-300 group backdrop-blur-md shadow-md
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
