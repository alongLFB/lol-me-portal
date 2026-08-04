'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ShieldCheck, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleToggle } from "@/components/layout/LocaleToggle";

export default function AdminLoginPage() {
  const tLogin = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/${locale}/admin`);
      } else {
        setError(data.error || "登录校验失败");
      }
    } catch {
      setError("网络或服务器异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-hextech-blue/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-lol-gold/5 blur-[100px] pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-3 z-20">
        <LocaleToggle />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-white/90 border border-slate-200/80 dark:bg-slate-900/80 dark:border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-8 relative z-10 transition-colors duration-300">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-hextech-blue/10 border border-hextech-blue/30 text-hextech-blue mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {tLogin("title")}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {tLogin("subtitle")}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs flex items-center shadow-lg">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {tLogin("password_label")}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tLogin("password_placeholder")}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/80 dark:border-white/10 dark:text-white dark:placeholder-slate-500 focus:outline-none focus:border-hextech-blue text-sm transition-all shadow-sm"
              />
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-hextech-blue hover:bg-hextech-blue/90 text-slate-950 font-bold text-sm transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(10,200,185,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>{tLogin("submitting")}</span>
              </>
            ) : (
              <>
                <span>{tLogin("submit_btn")}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href={`/${locale}`}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            ← 返回前台 Portal
          </a>
        </div>
      </div>
    </main>
  );
}
