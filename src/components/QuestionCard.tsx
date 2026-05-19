"use client";
import Link from "next/link";
import { useState } from "react";
import CategoryBadge from "./CategoryBadge";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";

interface Props {
  id: string;
  text: string;
  category: string;
  type?: string;
  authorName: string;
  createdAt: string;
  conclusion?: string | null;
  commentCount: number;
  likeCount?: number;
  imageUrl?: string | null;
}

export default function QuestionCard({
  id, text, category, type = "ai_question", authorName, createdAt, conclusion, commentCount, likeCount = 0, imageUrl,
}: Props) {
  const { lang } = useLangContext();
  const t = getTranslations(lang).components;
  const locale = lang === "he" ? "he-IL" : "en-US";
  const isPost = type === "post";

  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [liking, setLiking] = useState(false);

  const date = new Date(createdAt).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setLocalLikeCount((prev) => newLiked ? prev + 1 : prev - 1);
    try {
      const res = await fetch(`/api/questions/${id}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLocalLikeCount(data.count);
      } else {
        // Revert on error
        setLiked(!newLiked);
        setLocalLikeCount((prev) => newLiked ? prev - 1 : prev + 1);
      }
    } catch {
      // Revert on error
      setLiked(!newLiked);
      setLocalLikeCount((prev) => newLiked ? prev - 1 : prev + 1);
    } finally {
      setLiking(false);
    }
  }

  return (
    <Link href={`/question/${id}`} className="block group active:scale-[0.99] transition-transform">
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md active:shadow-sm transition-all duration-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isPost && (
              <span className="flex-shrink-0 text-xs bg-purple-100 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-medium">
                ✍️ {lang === "he" ? "פוסט" : "Post"}
              </span>
            )}
            <h3 className="text-gray-900 font-semibold leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2 text-base">
              {text}
            </h3>
          </div>
          <div className="flex-shrink-0 pt-0.5">
            <CategoryBadge category={category} />
          </div>
        </div>

        {/* Image preview for posts */}
        {isPost && imageUrl && (
          <div className="mb-2 rounded-lg overflow-hidden border border-gray-100">
            <img
              src={imageUrl}
              alt=""
              className="w-full max-h-32 object-cover"
            />
          </div>
        )}

        {conclusion && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs text-indigo-500 font-medium mb-0.5">{t.conclusion}</p>
            <p className="text-sm text-indigo-800 line-clamp-2 leading-relaxed">{conclusion}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>{authorName}</span>
            <span>·</span>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
              aria-label={t.likeCount}
            >
              <span>❤️</span>
              <span>{localLikeCount}</span>
            </button>
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
