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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">שאל שאלה</h1>
        <p className="text-gray-500 text-sm">
          השאלה שלך תישלח בו-זמנית ל-Claude, ChatGPT וGemini. המערכת תסכם את התשובות.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            השאלה שלך
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="מה אתה רוצה לדעת?"
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-400 mt-1">{text.length} תווים</p>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            שמך (אופציונלי)
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="אנונימי"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-gray-700">שאלה ציבורית</p>
              <p className="text-xs text-gray-400">
                {isPublic
                  ? "השאלה תופיע בפיד ומשתמשים יוכלו להגיב"
                  : "רק אתה תוכל לראות את השאלה והתשובות"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isPublic ? "bg-indigo-600" : "bg-gray-300"
              }`}
              disabled={loading}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  isPublic ? "translate-x-0.5" : "translate-x-6"
                }`}
              />
            </button>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              שולח לכל ה-AI... (עשוי לקחת 10-30 שניות)
            </span>
          ) : (
            "שלח שאלה לכל ה-AI"
          )}
        </button>

        {loading && (
          <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-sm text-indigo-700 font-medium mb-2">מה קורה עכשיו:</p>
            <ul className="text-xs text-indigo-600 space-y-1">
              <li>🟠 שולח שאלה ל-Claude...</li>
              <li>🟢 שולח שאלה ל-ChatGPT...</li>
              <li>🔵 שולח שאלה ל-Gemini...</li>
              <li>✦ מסכם ומפיק מסקנה...</li>
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}
