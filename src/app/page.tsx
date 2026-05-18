"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { lang, setLang } = useLangContext();
  const t = getTranslations(lang).landing;
  const isRTL = lang === "he";

  // Redirect authenticated users to feed
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/feed");
    }
  }, [session, status, router]);

  if (status === "loading") return null;

  return (
    <div
      className="min-h-screen bg-white text-gray-900 overflow-hidden -mx-4 -my-5 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <span className="text-2xl">✦</span>
          <span>Qrowd</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "he" ? "en" : "he")}
            className="text-sm px-2 py-1 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-gray-500 hover:text-indigo-600"
            title={lang === "he" ? "Switch to English" : "עבור לעברית"}
          >
            {lang === "he" ? "🇺🇸 EN" : "🇮🇱 HE"}
          </button>
          <Link
            href="/auth/login"
            className="text-sm px-4 py-2 text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors font-semibold"
          >
            {t.signIn}
          </Link>
          <Link
            href="/auth/register"
            className="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-semibold"
          >
            {t.signUp}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 pt-10 pb-8 text-center">
        <h1 className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Qrowd
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-2 max-w-lg">
          {t.tagline}
        </p>
        <p className="text-sm text-gray-400 mb-10">
          {t.subTagline}
        </p>

        {/* SVG Network Visualization */}
        <div className="w-full max-w-[600px] mb-10 select-none">
          <svg
            viewBox="0 0 600 400"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            aria-hidden="true"
          >
            <defs>
              {/* Line gradients */}
              <linearGradient id="grad-claude" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <linearGradient id="grad-gemini" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="grad-chatgpt" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <linearGradient id="grad-community" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Background lines (static, faint) */}
            <line x1="300" y1="200" x2="300" y2="60"  stroke="#6366f1" strokeWidth="1.5" className="network-line-bg" />
            <line x1="300" y1="200" x2="100" y2="200" stroke="#6366f1" strokeWidth="1.5" className="network-line-bg" />
            <line x1="300" y1="200" x2="500" y2="200" stroke="#6366f1" strokeWidth="1.5" className="network-line-bg" />
            <line x1="300" y1="200" x2="300" y2="340" stroke="#6366f1" strokeWidth="1.5" className="network-line-bg" />

            {/* Animated flowing lines */}
            <line
              x1="300" y1="200" x2="300" y2="60"
              stroke="url(#grad-claude)"
              strokeWidth="2.5"
              className="network-line"
              style={{ animationDelay: "0s", animationDuration: "2s" }}
            />
            <line
              x1="300" y1="200" x2="100" y2="200"
              stroke="url(#grad-gemini)"
              strokeWidth="2.5"
              className="network-line"
              style={{ animationDelay: "0.5s", animationDuration: "2s" }}
            />
            <line
              x1="300" y1="200" x2="500" y2="200"
              stroke="url(#grad-chatgpt)"
              strokeWidth="2.5"
              className="network-line"
              style={{ animationDelay: "1s", animationDuration: "2s" }}
            />
            <line
              x1="300" y1="200" x2="300" y2="340"
              stroke="url(#grad-community)"
              strokeWidth="2.5"
              className="network-line"
              style={{ animationDelay: "1.5s", animationDuration: "2s" }}
            />

            {/* Traveling dots */}
            <circle r="5" fill="#f97316">
              <animateMotion dur="2s" repeatCount="indefinite" begin="0s">
                <mpath href="#path-claude" />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin="0s" />
            </circle>
            <circle r="5" fill="#3b82f6">
              <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s">
                <mpath href="#path-gemini" />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin="0.5s" />
            </circle>
            <circle r="5" fill="#22c55e">
              <animateMotion dur="2s" repeatCount="indefinite" begin="1s">
                <mpath href="#path-chatgpt" />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin="1s" />
            </circle>
            <circle r="5" fill="#a855f7">
              <animateMotion dur="2s" repeatCount="indefinite" begin="1.5s">
                <mpath href="#path-community" />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin="1.5s" />
            </circle>

            {/* Hidden paths for animateMotion */}
            <path id="path-claude"    d="M300,200 L300,60"   fill="none" />
            <path id="path-gemini"    d="M300,200 L100,200"  fill="none" />
            <path id="path-chatgpt"   d="M300,200 L500,200"  fill="none" />
            <path id="path-community" d="M300,200 L300,340"  fill="none" />

            {/* Center node – Qrowd */}
            <circle cx="300" cy="200" r="38" fill="#6366f1" className="center-node-pulse" />
            <text x="300" y="196" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="system-ui">Q</text>
            <text x="300" y="214" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontWeight="600" fontFamily="system-ui" letterSpacing="1">QROWD</text>

            {/* Top node – Claude */}
            <circle cx="300" cy="60" r="28" fill="rgba(249,115,22,0.1)" stroke="#f97316" strokeWidth="2" className="outer-node" style={{ animationDelay: "0s" }} />
            <text x="300" y="56" textAnchor="middle" dominantBaseline="middle" fill="#f97316" fontSize="18" fontFamily="system-ui">🟠</text>
            <text x="300" y="98" textAnchor="middle" dominantBaseline="middle" fill="#ea580c" fontSize="12" fontWeight="600" fontFamily="system-ui">Claude</text>

            {/* Left node – Gemini */}
            <circle cx="100" cy="200" r="28" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="2" className="outer-node" style={{ animationDelay: "0.5s" }} />
            <text x="100" y="196" textAnchor="middle" dominantBaseline="middle" fill="#3b82f6" fontSize="18" fontFamily="system-ui">🔵</text>
            <text x="100" y="236" textAnchor="middle" dominantBaseline="middle" fill="#2563eb" fontSize="12" fontWeight="600" fontFamily="system-ui">Gemini</text>

            {/* Right node – ChatGPT */}
            <circle cx="500" cy="200" r="28" fill="rgba(34,197,94,0.1)" stroke="#22c55e" strokeWidth="2" className="outer-node" style={{ animationDelay: "1s" }} />
            <text x="500" y="196" textAnchor="middle" dominantBaseline="middle" fill="#22c55e" fontSize="18" fontFamily="system-ui">🟢</text>
            <text x="500" y="236" textAnchor="middle" dominantBaseline="middle" fill="#16a34a" fontSize="12" fontWeight="600" fontFamily="system-ui">ChatGPT</text>

            {/* Bottom node – Community */}
            <circle cx="300" cy="340" r="28" fill="rgba(168,85,247,0.1)" stroke="#a855f7" strokeWidth="2" className="outer-node" style={{ animationDelay: "1.5s" }} />
            <text x="300" y="336" textAnchor="middle" dominantBaseline="middle" fill="#a855f7" fontSize="18" fontFamily="system-ui">👥</text>
            <text x="300" y="376" textAnchor="middle" dominantBaseline="middle" fill="#9333ea" fontSize="12" fontWeight="600" fontFamily="system-ui">{t.community}</text>
          </svg>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-14">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            {t.ctaPrimary}
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-2xl font-semibold text-base transition-all active:scale-95"
          >
            {t.ctaSecondary}
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full px-2">
          <div className="bg-white border border-indigo-100 rounded-2xl p-5 text-center hover:shadow-md hover:border-indigo-300 transition-all shadow-sm">
            <div className="text-3xl mb-3">✦</div>
            <h3 className="font-bold text-gray-900 mb-1">{t.feature1Title}</h3>
            <p className="text-sm text-gray-500">{t.feature1Desc}</p>
          </div>
          <div className="bg-white border border-indigo-100 rounded-2xl p-5 text-center hover:shadow-md hover:border-indigo-300 transition-all shadow-sm">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-gray-900 mb-1">{t.feature2Title}</h3>
            <p className="text-sm text-gray-500">{t.feature2Desc}</p>
          </div>
          <div className="bg-white border border-indigo-100 rounded-2xl p-5 text-center hover:shadow-md hover:border-indigo-300 transition-all shadow-sm">
            <div className="text-3xl mb-3">🏷️</div>
            <h3 className="font-bold text-gray-900 mb-1">{t.feature3Title}</h3>
            <p className="text-sm text-gray-500">{t.feature3Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
