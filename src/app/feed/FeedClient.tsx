"use client";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";
import { CATEGORIES } from "@/types";
import { CATEGORY_EN } from "@/lib/i18n";

interface Question {
  id: string;
  text: string;
  category: string;
  type: string;
  authorName: string;
  createdAt: string;
  conclusion?: string | null;
  commentCount: number;
  imageUrl?: string | null;
}

interface Props {
  questions: Question[];
  activeCategory?: string;
}

export default function FeedClient({ questions, activeCategory }: Props) {
  const { lang } = useLangContext();
  const t = getTranslations(lang).feed;

  const categoryLabel = (cat: string) => lang === "en" ? (CATEGORY_EN[cat] ?? cat) : cat;

  return (
    <div className="pb-24">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Qrowd</h1>
        <p className="text-gray-500 text-sm sm:text-base">{t.subtitle}</p>
      </div>

      <div className="overflow-x-auto pb-2 mb-5 -mx-4 px-4">
        <div className="flex gap-2 w-max">
          <Link
            href="/feed"
            className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full border transition-colors ${
              !activeCategory
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {t.all}
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/feed?category=${encodeURIComponent(cat)}`}
              className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {categoryLabel(cat)}
            </Link>
          ))}
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🤔</p>
          <p className="text-gray-400 text-base mb-5">
            {t.noQuestions}{activeCategory ? ` ${t.noQuestionsInCategory}` : ""}
          </p>
          <Link
            href="/ask"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
          >
            {t.askFirst}
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
              type={q.type}
              authorName={q.authorName}
              createdAt={q.createdAt}
              conclusion={q.conclusion}
              commentCount={q.commentCount}
              imageUrl={q.imageUrl}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:hidden z-40">
        <Link
          href="/ask"
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all font-semibold text-sm"
        >
          <span className="text-lg">+</span>
          {lang === "he" ? "שאל / פרסם" : "Ask / Post"}
        </Link>
      </div>
    </div>
  );
}
