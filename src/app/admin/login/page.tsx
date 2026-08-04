'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "登录失败");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 text-slate-100 overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-hextech-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lol-gold/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(10,200,185,0.15)] relative z-10">
        <a
          href="/"
          className="inline-flex items-center text-sm text-slate-400 hover:text-hextech-blue transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          返回前台首页
        </a>

        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-hextech-blue/10 border border-hextech-blue/30 text-hextech-blue mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            后台管理平台登录
          </h1>
          <p className="text-sm text-slate-400">
            LOL 中东服玩家社区门户 · 内容管理后台
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              管理员密码
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入后台管理员密码"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-hextech-blue focus:ring-1 focus:ring-hextech-blue transition-all text-sm"
              />
              <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-hextech-blue to-hextech-dark hover:from-hextech-blue/90 hover:to-hextech-dark/90 text-slate-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(10,200,185,0.3)] disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                登录验证中...
              </>
            ) : (
              "安全登录"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
