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
  parentId?: string | null;
  userId?: string | null;
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

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");

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

  async function submitReply(parentId: string) {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    setReplyError("");
    try {
      const res = await fetch(`/api/questions/${questionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText,
          authorName: getAuthorName(),
          parentId,
        }),
      });
      if (!res.ok) throw new Error(t.sendError);
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setReplyText("");
      setReplyingTo(null);
    } catch {
      setReplyError(t.sendError);
    } finally {
      setReplyLoading(false);
    }
  }

  async function deleteComment(commentId: string, isTopLevel: boolean) {
    try {
      const res = await fetch(`/api/questions/${questionId}/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.ok) return;
      if (isTopLevel) {
        // Remove top-level comment and all its replies
        setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
      } else {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      }
    } catch {
      // ignore
    }
  }

  const topLevel = comments.filter((c) => !c.parentId);
  const repliesMap: Record<string, Comment[]> = {};
  for (const c of comments) {
    if (c.parentId) {
      if (!repliesMap[c.parentId]) repliesMap[c.parentId] = [];
      repliesMap[c.parentId].push(c);
    }
  }

  const totalCount = comments.length;

  return (
    <div>
      <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>💬</span>
        <span>{t.comments} ({totalCount})</span>
      </h3>

      <div className="space-y-3 mb-5">
        {topLevel.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-6">{t.noComments}</p>
        )}
        {topLevel.map((c) => {
          const replies = repliesMap[c.id] ?? [];
          const isOwnComment = !!(session?.user?.id && c.userId && session.user.id === c.userId);
          return (
            <div key={c.id}>
              {/* Top-level comment */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                    {c.authorName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{c.authorName}</span>
                  <span className="text-xs text-gray-400 mr-auto">
                    {new Date(c.createdAt).toLocaleDateString(locale)}
                  </span>
                  {isOwnComment && (
                    <button
                      type="button"
                      onClick={() => deleteComment(c.id, true)}
                      className="text-xs text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                      title={t.deleteComment}
                    >
                      🗑
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(replyingTo === c.id ? null : c.id);
                      setReplyText("");
                      setReplyError("");
                    }}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium px-1.5 py-0.5 rounded hover:bg-indigo-50 transition-colors"
                  >
                    ↩ {t.reply}
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
              </div>

              {/* Replies */}
              {replies.length > 0 && (
                <div className="ml-5 mt-1.5 space-y-1.5 border-l-2 border-indigo-200 pl-3">
                  {replies.map((r) => {
                    const isOwnReply = !!(session?.user?.id && r.userId && session.user.id === r.userId);
                    return (
                      <div key={r.id} className="bg-white border border-gray-100 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600 flex-shrink-0">
                            {r.authorName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{r.authorName}</span>
                          <span className="text-xs text-gray-400 mr-auto">
                            {new Date(r.createdAt).toLocaleDateString(locale)}
                          </span>
                          {isOwnReply && (
                            <button
                              type="button"
                              onClick={() => deleteComment(r.id, false)}
                              className="text-xs text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors"
                              title={t.deleteComment}
                            >
                              🗑
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{r.content}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Inline reply form */}
              {replyingTo === c.id && (
                <div className="ml-5 mt-1.5 border-l-2 border-indigo-200 pl-3">
                  <div className="flex flex-col gap-1.5">
                    {/* Anonymous toggle for logged-in users in reply form */}
                    {isLoggedIn && (
                      <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={anonymous}
                          onChange={(e) => setAnonymous(e.target.checked)}
                          className="w-4 h-4 rounded accent-indigo-600"
                          disabled={replyLoading}
                        />
                        {t.anonymousToggle}
                      </label>
                    )}
                    <textarea
                      placeholder={t.replyPlaceholder}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none leading-relaxed"
                      disabled={replyLoading}
                      autoFocus
                    />
                    {replyError && <p className="text-red-500 text-xs">{replyError}</p>}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => submitReply(c.id)}
                        disabled={replyLoading || !replyText.trim()}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {replyLoading ? t.sending : t.reply}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setReplyingTo(null); setReplyText(""); setReplyError(""); }}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        disabled={replyLoading}
                      >
                        {t.cancelReply}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
