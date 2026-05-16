"use client";
import { useState } from "react";

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
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/questions/${questionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, authorName: author || "אנונימי" }),
      });
      if (!res.ok) throw new Error("שגיאה בשליחה");
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setText("");
    } catch {
      setError("שגיאה בשליחת התגובה. נסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>💬</span>
        <span>תגובות ({comments.length})</span>
      </h3>

      <div className="space-y-3 mb-6">
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">
            אין תגובות עדיין. היה הראשון!
          </p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                {c.authorName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-700">{c.authorName}</span>
              <span className="text-xs text-gray-400 mr-auto">
                {new Date(c.createdAt).toLocaleDateString("he-IL")}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submitComment} className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">הוסף תגובה</h4>
        <input
          type="text"
          placeholder="שמך (אופציונלי)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <textarea
          placeholder="כתוב תגובה..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          required
        />
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "שולח..." : "שלח תגובה"}
        </button>
      </form>
    </div>
  );
}
