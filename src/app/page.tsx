import QuestionCard from "@/components/QuestionCard";
import { CATEGORIES } from "@/types";
import Link from "next/link";

interface QuestionListItem {
  id: string;
  text: string;
  category: string;
  authorName: string;
  createdAt: string;
  summary: { conclusion: string } | null;
  _count: { comments: number };
}

async function getQuestions(category?: string): Promise<QuestionListItem[]> {
  const url = `http://localhost:3000/api/questions${category ? `?category=${encodeURIComponent(category)}` : ""}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const questions = await getQuestions(category);

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AnswerPlus</h1>
        <p className="text-gray-500">שאל שאלה וקבל תשובות מ-Claude, ChatGPT וGemini – בבת אחת</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <Link
          href="/"
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            !category
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
          }`}
        >
          הכל
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              category === cat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">אין שאלות עדיין{category ? ` בקטגוריה "${category}"` : ""}</p>
          <Link
            href="/ask"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            שאל את השאלה הראשונה
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              id={q.id}
              text={q.text}
              category={q.category}
              authorName={q.authorName}
              createdAt={q.createdAt}
              conclusion={q.summary?.conclusion}
              commentCount={q._count.comments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
