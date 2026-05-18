import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white overflow-hidden -mx-4 -my-5 px-4">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-300">
          <span className="text-2xl">✦</span>
          <span>Qrowd</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm px-4 py-2 text-indigo-300 hover:text-white border border-indigo-700 hover:border-indigo-400 rounded-xl transition-colors"
          >
            התחבר
          </Link>
          <Link
            href="/auth/register"
            className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-semibold"
          >
            הירשם
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 pt-10 pb-8 text-center">
        <h1 className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
          Qrowd
        </h1>
        <p className="text-lg sm:text-xl text-indigo-200 mb-2 max-w-lg">
          שאל שאלה אחת - קבל תשובות מ-AI וקהילה
        </p>
        <p className="text-sm text-indigo-400 mb-10">
          שאל AI וקהילה - קבל את התשובה הטובה ביותר
        </p>

        {/* Animated Network Visualization */}
        <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] mb-10 select-none">
          {/* Animated connection lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 420 420"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top line (Claude) */}
            <line
              x1="210" y1="210" x2="210" y2="60"
              stroke="url(#lineGrad1)"
              strokeWidth="2"
              className="network-line"
              style={{ animationDelay: "0s" }}
            />
            {/* Left line (ChatGPT) */}
            <line
              x1="210" y1="210" x2="60" y2="210"
              stroke="url(#lineGrad2)"
              strokeWidth="2"
              className="network-line"
              style={{ animationDelay: "0.5s" }}
            />
            {/* Right line (Gemini) */}
            <line
              x1="210" y1="210" x2="360" y2="210"
              stroke="url(#lineGrad3)"
              strokeWidth="2"
              className="network-line"
              style={{ animationDelay: "1s" }}
            />
            {/* Bottom line (Community) */}
            <line
              x1="210" y1="210" x2="210" y2="360"
              stroke="url(#lineGrad4)"
              strokeWidth="2"
              className="network-line"
              style={{ animationDelay: "1.5s" }}
            />
            <defs>
              <linearGradient id="lineGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <linearGradient id="lineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="lineGrad4" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center node – Qrowd */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.6)] ring-2 ring-indigo-400/50">
              <span className="text-xl font-black text-white leading-none">Q</span>
              <span className="text-[9px] font-semibold text-indigo-200 leading-none">QROWD</span>
            </div>
          </div>

          {/* Top node – Claude */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] animate-pulse-slow">
              <span className="text-2xl">🟠</span>
            </div>
            <span className="text-xs text-orange-300 font-semibold">Claude</span>
          </div>

          {/* Left node – ChatGPT */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-pulse-slow" style={{ animationDelay: "0.5s" }}>
              <span className="text-2xl">🟢</span>
            </div>
            <span className="text-xs text-green-300 font-semibold">ChatGPT</span>
          </div>

          {/* Right node – Gemini */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] animate-pulse-slow" style={{ animationDelay: "1s" }}>
              <span className="text-2xl">🔵</span>
            </div>
            <span className="text-xs text-blue-300 font-semibold">Gemini</span>
          </div>

          {/* Bottom node – Community */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse-slow" style={{ animationDelay: "1.5s" }}>
              <span className="text-2xl">👥</span>
            </div>
            <span className="text-xs text-purple-300 font-semibold">קהילה</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-14">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-bold text-base shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all active:scale-95"
          >
            התחל עכשיו - הרשם בחינם
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 border border-indigo-600 hover:border-indigo-400 text-indigo-300 hover:text-white rounded-2xl font-semibold text-base transition-all active:scale-95"
          >
            כבר רשום? התחבר
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full px-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
            <div className="text-3xl mb-3">✦</div>
            <h3 className="font-bold text-white mb-1">3 מערכות AI</h3>
            <p className="text-sm text-indigo-300">
              Claude, ChatGPT, Gemini עונים בו-זמנית
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-white mb-1">קהילה אנושית</h3>
            <p className="text-sm text-indigo-300">
              אנשים מוסיפים תובנות ותגובות
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
            <div className="text-3xl mb-3">🏷️</div>
            <h3 className="font-bold text-white mb-1">סיווג אוטומטי</h3>
            <p className="text-sm text-indigo-300">
              כל שאלה מסווגת לקטגוריה
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
