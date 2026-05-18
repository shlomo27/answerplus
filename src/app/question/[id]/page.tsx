import { notFound } from "next/navigation";
import AIResponseCard from "@/components/AIResponseCard";
import SummaryCard from "@/components/SummaryCard";
import CommentSection from "@/components/CommentSection";
import CategoryBadge from "@/components/CategoryBadge";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      responses: { orderBy: { createdAt: "asc" } },
      summary: true,
      comments: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!question) notFound();

  const date = new Date(question.createdAt).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <Link
        href="/feed"
        className="inline-flex items-center gap-1 text-sm text-indigo-600 mb-4 py-1"
      >
        ← חזור לפיד
      </Link>

      {/* Question Header */}
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
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">🔒 פרטי</span>
          )}
        </div>
      </div>

      {/* Summary – prominent */}
      {question.summary && (
        <div className="mb-4">
          <SummaryCard
            content={question.summary.content}
            conclusion={question.summary.conclusion}
          />
        </div>
      )}

      {/* AI Responses */}
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          תשובות ה-AI
          <span className="text-sm font-normal text-gray-400">({question.responses.length} מודלים)</span>
        </h2>
        <div className="grid gap-3">
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
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
          <CommentSection
            questionId={question.id}
            initialComments={question.comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
            }))}
          />
        </div>
      )}
    </div>
  );
}
