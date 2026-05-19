"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface Props {
  questionId: string;
  initialComments: Comment[];
}

export default function CommentSection({ questionId, initialComments }: Props) {
  const { lang } = useLangContext();
  const t = getTranslations(lang).components;
  const locale = lang === "he" ? "he-IL" : "en-US";
  const { data: session } = useSession();

  const loggedInDefault = session?.user?.username || session?.user?.name || "";

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = !!session?.user;

  function getAuthorName(): string {
    if (isLoggedIn) {
      if (anonymous) return lang === "he" ? "אנונימי" : "Anonymous";
      return loggedInDefault || (lang === "he" ? "אנונימי" : "Anonymous");
    }
    return author || (lang === "he" ? "אנונימי" : "Anonymous");
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/questions/${questionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, authorName: getAuthorName() }),
      });
      if (!res.ok) throw new Error(t.sendError);
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setText("");
    } catch {
      setError(t.sendError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>💬</span>
        <span>{t.comments} ({comments.length})</span>
      </h3>

      <div className="space-y-3 mb-5">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-6">{t.noComments}</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                {c.authorName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{c.authorName}</span>
              <span className="text-xs text-gray-400 mr-auto">
                {new Date(c.createdAt).toLocaleDateString(locale)}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submitComment} className="space-y-2.5">
        {/* Name input: only show when not logged in */}
        {!isLoggedIn && (
          <input
            type="text"
            placeholder={t.namePlaceholder}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-300"
            disabled={loading}
          />
        )}

        {/* Anonymous toggle for logged-in users */}
        {isLoggedIn && (
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-600"
              disabled={loading}
            />
            {t.anonymousToggle}
          </label>
        )}

        <textarea
          placeholder={t.commentPlaceholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none leading-relaxed"
          required
          disabled={loading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 transition-colors"
        >
          {loading ? t.sending : t.send}
        </button>
      </form>
    </div>
  );
}
