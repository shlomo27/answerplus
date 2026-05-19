"use client";
import Link from "next/link";
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
    isPublic: boolean;
    authorName: string;
    createdAt: string;
    responses: { id: string; provider: string; content: string; error: boolean }[];
    summary: { content: string; conclusion: string } | null;
    comments: { id: string; authorName: string; content: string; createdAt: string }[];
  };
}

export default function QuestionPageClient({ question }: Props) {
  const { lang } = useLangContext();
  const t = getTranslations(lang).question;
  const locale = lang === "he" ? "he-IL" : "en-US";

  const date = new Date(question.createdAt).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <Link href="/feed" className="inline-flex items-center gap-1 text-sm text-indigo-600 mb-4 py-1">
        {t.back}
      </Link>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 mb-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug flex-1">
            {question.text}
          </h1>
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

      {question.summary && (
        <div className="mb-4">
          <SummaryCard content={question.summary.content} conclusion={question.summary.conclusion} />
        </div>
      )}

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

      {question.isPublic && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <CommentSection questionId={question.id} initialComments={question.comments} />
        </div>
      )}
    </div>
  );
}
