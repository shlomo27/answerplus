import QuestionCard from "@/components/QuestionCard";
import { CATEGORIES } from "@/types";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const questions = await prisma.question.findMany({
    where: { isPublic: true, ...(category ? { category } : {}) },
    include: {
      summary: { select: { conclusion: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Qrowd</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          שאל AI וקהילה - קבל את התשובה הטובה ביותר
        </p>
      </div>

      {/* Category Filter – horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-2 mb-5 -mx-4 px-4">
        <div className="flex gap-2 w-max">
          <Link
            href="/feed"
            className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full border transition-colors ${
              !category
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            הכל
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/feed?category=${encodeURIComponent(cat)}`}
              className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full border transition-colors ${
                category === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🤔</p>
          <p className="text-gray-400 text-base mb-5">
            אין שאלות עדיין{category ? ` בקטגוריה "${category}"` : ""}
          </p>
          <Link
            href="/ask"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
          >
            שאל את השאלה הראשונה
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              id={q.id}
              text={q.text}
              category={q.category}
              authorName={q.authorName}
              createdAt={q.createdAt.toISOString()}
              conclusion={q.summary?.conclusion}
              commentCount={q._count.comments}
            />
          ))}
        </div>
      )}

      {/* Mobile FAB */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:hidden z-40">
        <Link
          href="/ask"
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all font-semibold text-sm"
        >
          <span className="text-lg">+</span>
          שאל שאלה
        </Link>
      </div>
    </div>
  );
}
