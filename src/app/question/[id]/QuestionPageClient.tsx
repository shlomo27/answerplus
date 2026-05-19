"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AIResponseCard from "@/components/AIResponseCard";
import SummaryCard from "@/components/SummaryCard";
import CommentSection from "@/components/CommentSection";
import CategoryBadge from "@/components/CategoryBadge";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";

interface Props {
  question: {
    id: string;
    text: string;
    category: string;
    type: string;
    isPublic: boolean;
    authorName: string;
    userId?: string | null;
    createdAt: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    responses: { id: string; provider: string; content: string; error: boolean }[];
    summary: { content: string; conclusion: string } | null;
    comments: { id: string; authorName: string; content: string; createdAt: string; parentId?: string | null }[];
  };
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch { /* ignore */ }
  return null;
}

export default function QuestionPageClient({ question }: Props) {
  const { lang } = useLangContext();
  const t = getTranslations(lang).question;
  const locale = lang === "he" ? "he-IL" : "en-US";
  const isPost = question.type === "post";
  const { data: session } = useSession();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOwner = session?.user?.id && question.userId && session.user.id === question.userId;

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/questions/${question.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/feed");
        router.refresh();
      }
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const date = new Date(question.createdAt).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const videoEmbed = question.videoUrl ? getYouTubeEmbedUrl(question.videoUrl) : null;

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-base mb-2">
              {lang === "he" ? "מחיקת פוסט" : "Delete Post"}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {lang === "he" ? "האם אתה בטוח? פעולה זו לא ניתנת לביטול." : "Are you sure? This action cannot be undone."}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                disabled={deleting}
              >
                {lang === "he" ? "ביטול" : "Cancel"}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "..." : (lang === "he" ? "מחק" : "Delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <Link href="/feed" className="inline-flex items-center gap-1 text-sm text-indigo-600 py-1">
          {t.back}
        </Link>
        {isOwner && (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            {lang === "he" ? "🗑 מחק" : "🗑 Delete"}
          </button>
        )}
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {isPost && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-medium mb-2">
                ✍️ {lang === "he" ? "פוסט" : "Post"}
              </span>
            )}
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              {question.text}
            </h1>
          </div>
          <div className="flex-shrink-0">
            <CategoryBadge category={question.category} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span>{question.authorName}</span>
          <span>·</span>
          <span>{date}</span>
          {!question.isPublic && (
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.private}</span>
          )}
        </div>
      </div>

      {/* Image (posts) */}
      {question.imageUrl && (
        <div className="mb-4 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <img src={question.imageUrl} alt="" className="w-full object-cover max-h-96" />
        </div>
      )}

      {/* Video (posts) */}
      {question.videoUrl && (
        <div className="mb-4">
          {videoEmbed ? (
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-video">
              <iframe
                src={videoEmbed}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={question.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">🎬</span>
              <span className="truncate">{question.videoUrl}</span>
            </a>
          )}
        </div>
      )}

      {/* Summary (AI questions only) */}
      {question.summary && (
        <div className="mb-4">
          <SummaryCard content={question.summary.content} conclusion={question.summary.conclusion} />
        </div>
      )}

      {/* AI Responses (AI questions only) */}
      {question.responses.length > 0 && (
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            {t.aiAnswers}
            <span className="text-sm font-normal text-gray-400">({question.responses.length} {t.models})</span>
          </h2>
          <div className="grid gap-3">
            {question.responses.map((r) => (
              <AIResponseCard key={r.id} provider={r.provider} content={r.content} error={r.error} />
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      {question.isPublic && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <CommentSection questionId={question.id} initialComments={question.comments} />
        </div>
      )}
    </div>
  );
}
