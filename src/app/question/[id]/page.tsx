import { notFound } from "next/navigation";
import AIResponseCard from "@/components/AIResponseCard";
import SummaryCard from "@/components/SummaryCard";
import CommentSection from "@/components/CommentSection";
import CategoryBadge from "@/components/CategoryBadge";
import type { QuestionWithAll } from "@/types";
import Link from "next/link";

async function getQuestion(id: string): Promise<QuestionWithAll | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/questions/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await getQuestion(id);

  if (!question) notFound();

  const date = new Date(question.createdAt).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        → חזור לפיד
      </Link>

      {/* Question Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{question.text}</h1>
          <CategoryBadge category={question.category} />
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span>{question.authorName}</span>
          <span>·</span>
          <span>{date}</span>
          {!question.isPublic && (
            <>
              <span>·</span>
              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">פרטי</span>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {question.summary && (
        <div className="mb-6">
          <SummaryCard
            content={question.summary.content}
            conclusion={question.summary.conclusion}
          />
        </div>
      )}

      {/* AI Responses */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>תשובות ה-AI</span>
          <span className="text-sm font-normal text-gray-400">({question.responses.length} מודלים)</span>
        </h2>
        <div className="grid gap-4">
          {question.responses.map((r) => (
            <AIResponseCard
              key={r.id}
              provider={r.provider}
              content={r.content}
              error={r.error}
            />
          ))}
        </div>
      </div>

      {/* Comments */}
      {question.isPublic && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <CommentSection questionId={question.id} initialComments={question.comments} />
        </div>
      )}
    </div>
  );
}
