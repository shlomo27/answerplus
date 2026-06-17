"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { lang, setLang } = useLangContext();
  const t = getTranslations(lang).landing;
  const isRTL = lang === "he";

  useEffect(() => {
    if (status !== "authenticated") return;
    router.push("/feed");
  }, [status, router]);

  if (status === "loading" || status === "authenticated") return null;

  return (
    <div
      className="min-h-screen bg-white text-gray-900 overflow-hidden -mx-4 -my-5 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <span className="text-2xl">✦</span>
          <span>AICrowd</span>
        </div>
        <div className="flex items-center gap-3">
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

      <div className="flex flex-col items-center justify-center px-4 pt-10 pb-8 text-center">
        <h1 className="text-6xl sm:text-7xl font-black mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          AICrowd
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-2 max-w-lg">
          {t.tagline}
        </p>
        <p className="text-sm text-gray-400 mb-10">
          {t.subTagline}
        </p>

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
