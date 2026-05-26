"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";

export default function AIQuestionForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { lang } = useLangContext();
  const t = getTranslations(lang).ask;

  const [text, setText] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authorName = session?.user?.username || session?.user?.name || session?.user?.email || (lang === "he" ? "אנונימי" : "Anonymous");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || text.trim().length < 5) {
      setError(t.errorMinLength);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: "ai_question", isPublic, authorName, lang }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? t.errorMinLength);
      }
      const question = await res.json();
      router.push(`/question/${question.id}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">{t.questionLabel}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          rows={5}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none leading-relaxed"
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-400 mt-1">{text.length} {t.charCount}</p>
      </div>

      <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
        <span className="text-lg">🏷️</span>
        <p className="text-xs text-indigo-700">{t.autoCategoryNote}</p>
      </div>

      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
          {authorName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs text-gray-400">{t.authorLabel}</p>
          <p className="text-sm font-semibold text-gray-700">{authorName}</p>
        </div>
      </div>

      <div className="flex items-center justify-between py-1">
        <div>
          <p className="text-sm font-semibold text-gray-700">{t.publicLabel}</p>
          <p className="text-xs text-gray-400 mt-0.5">{isPublic ? t.publicDesc : t.privateDesc}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsPublic(!isPublic)}
          disabled={loading}
          aria-pressed={isPublic}
          className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${isPublic ? "bg-indigo-600" : "bg-gray-300"}`}
        >
          <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${isPublic ? "right-1" : "right-7"}`} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || text.trim().length < 5}
        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-base hover:bg-indigo-700 active:bg-indigo-800 active:scale-[0.99] disabled:opacity-50 transition-all"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            {t.submitting}
          </span>
        ) : t.submit}
      </button>

      {loading && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-sm text-indigo-700 font-semibold mb-2">{t.loadingTitle}</p>
          <ul className="text-sm text-indigo-600 space-y-1.5">
            <li className="flex items-center gap-2"><span>🟠</span> {t.loadingClaude}</li>
            <li className="flex items-center gap-2"><span>🟢</span> {t.loadingChatGPT}</li>
            <li className="flex items-center gap-2"><span>🔵</span> {t.loadingGemini}</li>
            <li className="flex items-center gap-2"><span>🏷️</span> {t.loadingCategory}</li>
            <li className="flex items-center gap-2"><span>✦</span> {t.loadingSummary}</li>
          </ul>
          <p className="text-xs text-indigo-400 mt-2">{t.loadingTime}</p>
        </div>
      )}
    </form>
  );
}
