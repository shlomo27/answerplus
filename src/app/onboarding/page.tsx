"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";
import { CATEGORIES } from "@/types";
import { CATEGORY_EN } from "@/lib/i18n";

const AVATARS = [
  { id: "robot", url: "https://api.dicebear.com/9.x/bottts/png?seed=aicrowd-r1&backgroundColor=b6e3f4", label: "🤖" },
  { id: "explorer", url: "https://api.dicebear.com/9.x/adventurer/png?seed=aicrowd-a1&backgroundColor=d1f0d1", label: "🌍" },
  { id: "cool", url: "https://api.dicebear.com/9.x/avataaars/png?seed=aicrowd-c1&backgroundColor=fde68a", label: "😎" },
  { id: "ninja", url: "https://api.dicebear.com/9.x/pixel-art/png?seed=aicrowd-n1&backgroundColor=d1d4f9", label: "🥷" },
  { id: "scientist", url: "https://api.dicebear.com/9.x/adventurer/png?seed=aicrowd-s2&backgroundColor=c7f2fa", label: "🔬" },
  { id: "artist", url: "https://api.dicebear.com/9.x/croodles/png?seed=aicrowd-ar1&backgroundColor=ffd5dc", label: "🎨" },
  { id: "gamer", url: "https://api.dicebear.com/9.x/bottts/png?seed=aicrowd-g1&backgroundColor=c1f4c5", label: "🎮" },
  { id: "chef", url: "https://api.dicebear.com/9.x/adventurer/png?seed=aicrowd-ch1&backgroundColor=fde8c8", label: "🍳" },
  { id: "athlete", url: "https://api.dicebear.com/9.x/adventurer/png?seed=aicrowd-sp1&backgroundColor=d4f5d4", label: "⚽" },
  { id: "coder", url: "https://api.dicebear.com/9.x/bottts/png?seed=aicrowd-co1&backgroundColor=e4d4f4", label: "💻" },
  { id: "alien", url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=aicrowd-al1&backgroundColor=d4e8ff", label: "👾" },
  { id: "cat", url: "https://api.dicebear.com/9.x/fun-emoji/png?seed=aicrowd-cat&backgroundColor=fff0d4", label: "🐱" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "בריאות": "💪", "ספורט": "⚽", "טכנולוגיה": "💻",
  "פיננסים": "💰", "בישול": "🍳", "טיולים": "✈️",
  "מדע": "🔬", "משפט": "⚖️", "אחר": "🌟",
};

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { lang } = useLangContext();
  const t = getTranslations(lang).onboarding;

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid" | "short">("idle");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated") {
      // Check DB directly — session may be stale across devices
      fetch("/api/user/me")
        .then((r) => r.json())
        .then((data) => { if (data.onboarded) router.push("/feed"); })
        .catch(() => { if (session?.user?.onboarded) router.push("/feed"); });
    }
  }, [status, session, router]);

  const checkUsername = useCallback(async (val: string) => {
    if (!val || val.length < 3) { setUsernameStatus(val.length > 0 ? "short" : "idle"); return; }
    if (!/^[a-zA-Z0-9_א-ת]+$/.test(val)) { setUsernameStatus("invalid"); return; }
    setUsernameStatus("checking");
    const res = await fetch(`/api/user/check-username?username=${encodeURIComponent(val)}`);
    const data = await res.json();
    setUsernameStatus(data.available ? "available" : "taken");
    setSuggestions(data.suggestions ?? []);
  }, []);

  useEffect(() => {
    if (!username) { setUsernameStatus("idle"); return; }
    const t = setTimeout(() => checkUsername(username), 500);
    return () => clearTimeout(t);
  }, [username, checkUsername]);

  async function handleFinish() {
    if (!username || usernameStatus !== "available") return;
    if (interests.length === 0) { setError(t.interestsLabel); return; }
    setSaving(true);
    setError("");

    try {
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 12000);

      let res: Response;
      try {
        res = await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, avatarId, interests }),
          signal: controller.signal,
        });
        clearTimeout(fetchTimeout);
      } catch {
        clearTimeout(fetchTimeout);
        setError(lang === "he" ? "שגיאת חיבור, נסה שוב" : "Connection error, please try again");
        setSaving(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error");
        setSaving(false);
        return;
      }
    } catch {
      setError(lang === "he" ? "שגיאה, נסה שוב" : "Error, please try again");
      setSaving(false);
      return;
    }

    sessionStorage.setItem("onboardingDone", "1");
    // update() can hang in NextAuth v5 beta — redirect after 2s regardless
    const timeout = setTimeout(() => router.push("/feed"), 2000);
    try { await update(); } catch { /* ignore */ }
    clearTimeout(timeout);
    router.push("/feed");
  }

  const canGoNext = username && usernameStatus === "available";

  if (status === "loading") return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
              step >= s ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"
            }`}>{s}</div>
            {s < 2 && <div className={`h-1 flex-1 rounded-full transition-colors ${step > s ? "bg-indigo-600" : "bg-gray-200"}`} />}
          </div>
        ))}
        <span className="text-xs text-gray-400 ml-2">{t.stepOf} {step} {t.of} 2</span>
      </div>

      <h1 className="text-2xl font-black text-gray-900 mb-1">
        {step === 1 ? t.welcome : t.step2Title}
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {step === 1 ? t.subtitle : t.interestsSub}
      </p>

      {step === 1 && (
        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t.step1Title}</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, "_"))}
                placeholder={t.usernamePlaceholder}
                maxLength={20}
                className={`w-full border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 transition-colors ${
                  usernameStatus === "available" ? "border-green-400 focus:ring-green-200" :
                  usernameStatus === "taken" || usernameStatus === "invalid" ? "border-red-300 focus:ring-red-100" :
                  "border-gray-200 focus:ring-indigo-200"
                }`}
              />
              {usernameStatus === "checking" && (
                <div className="absolute left-3 top-3.5">
                  <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                </div>
              )}
            </div>
            {usernameStatus === "available" && <p className="text-green-600 text-xs mt-1">{t.usernameAvailable}</p>}
            {usernameStatus === "taken" && (
              <div>
                <p className="text-red-500 text-xs mt-1">{t.usernameTaken}</p>
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-xs text-gray-400">{t.usernameSuggestions}</span>
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => setUsername(s)}
                        className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-lg hover:bg-indigo-100 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {usernameStatus === "invalid" && <p className="text-red-500 text-xs mt-1">{t.usernameInvalid}</p>}
            {usernameStatus === "short" && <p className="text-gray-400 text-xs mt-1">{t.usernameMinLength}</p>}
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">{t.avatarLabel}</label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((av) => (
                <button key={av.id} type="button"
                  onClick={() => setAvatarId(avatarId === av.id ? null : av.id)}
                  className={`relative aspect-square rounded-2xl border-2 overflow-hidden transition-all ${
                    avatarId === av.id ? "border-indigo-500 ring-2 ring-indigo-300 scale-105" : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                  {avatarId === av.id && (
                    <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                      <span className="text-indigo-600 text-lg">✓</span>
                    </div>
                  )}
                </button>
              ))}
              <button type="button"
                onClick={() => setAvatarId(null)}
                className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-2xl transition-all ${
                  avatarId === null ? "border-gray-400 bg-gray-100" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                ⬜
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">{t.noAvatar}</p>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!canGoNext}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-base hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
          >
            {t.next}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = interests.includes(cat);
              const label = lang === "en" ? (CATEGORY_EN[cat] ?? cat) : cat;
              const icon = CATEGORY_ICONS[cat] ?? "📌";
              return (
                <button key={cat} type="button"
                  onClick={() => setInterests(isSelected ? interests.filter(c => c !== cat) : [...interests, cat])}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50"
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span>{label}</span>
                  {isSelected && <span className="mr-auto text-indigo-500 text-base">✓</span>}
                </button>
              );
            })}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex gap-2">
            <button onClick={() => setStep(1)}
              className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
              ←
            </button>
            <button
              onClick={handleFinish}
              disabled={interests.length === 0 || saving}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-base hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-[0.99]"
            >
              {saving ? t.finishing : `${t.finish} (${interests.length} ${lang === "he" ? "נבחרו" : "selected"})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
