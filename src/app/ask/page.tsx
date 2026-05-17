"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AskPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || text.trim().length < 5) {
      setError("אנא הזן שאלה של לפחות 5 תווים");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, isPublic, authorName: authorName || "אנונימי" }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "שגיאה");
      }
      const question = await res.json();
      router.push(`/question/${question.id}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">שאל שאלה</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          השאלה תישלח בו-זמנית ל-Claude, ChatGPT וGemini.
          <br />
          <span className="text-indigo-600 font-medium">הקטגוריה נקבעת אוטומטית.</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
        {/* Question */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            השאלה שלך
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="מה אתה רוצה לדעת?"
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none leading-relaxed"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-400 mt-1">{text.length} תווים</p>
        </div>

        {/* Auto-category notice */}
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
          <span className="text-lg">🏷️</span>
          <p className="text-xs text-indigo-700">
            הקטגוריה (בריאות / ספורט / טכנולוגיה...) נקבעת <strong>אוטומטית</strong> על ידי AI
          </p>
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            שמך (אופציונלי)
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="אנונימי"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            disabled={loading}
          />
        </div>

        {/* Public toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-semibold text-gray-700">שאלה ציבורית</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {isPublic
                ? "תופיע בפיד, משתמשים יוכלו להגיב"
                : "רק אתה תראה את השאלה והתשובות"}
            </p>
          </div>
          {/* Toggle – fixed for RTL */}
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            disabled={loading}
            aria-pressed={isPublic}
            className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              isPublic ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                isPublic ? "right-1" : "right-7"
              }`}
            />
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
              שולח לכל ה-AI...
            </span>
          ) : (
            "שלח שאלה לכל ה-AI ✦"
          )}
        </button>

        {loading && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-sm text-indigo-700 font-semibold mb-2">מה קורה עכשיו:</p>
            <ul className="text-sm text-indigo-600 space-y-1.5">
              <li className="flex items-center gap-2"><span>🟠</span> שולח שאלה ל-Claude...</li>
              <li className="flex items-center gap-2"><span>🟢</span> שולח שאלה ל-ChatGPT...</li>
              <li className="flex items-center gap-2"><span>🔵</span> שולח שאלה ל-Gemini...</li>
              <li className="flex items-center gap-2"><span>🏷️</span> מסווג קטגוריה אוטומטית...</li>
              <li className="flex items-center gap-2"><span>✦</span> מסכם ומפיק מסקנה...</li>
            </ul>
            <p className="text-xs text-indigo-400 mt-2">עשוי לקחת 15-30 שניות</p>
          </div>
        )}
      </form>
    </div>
  );
}
