"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
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
  likeCount?: number;
  imageUrl?: string | null;
}

interface Props {
  questions: Question[];
  activeCategory?: string;
}

export default function FeedClient({ questions, activeCategory }: Props) {
  const { lang } = useLangContext();
  const t = getTranslations(lang).feed;
  const { data: session } = useSession();
  const [tab, setTab] = useState<"all" | "forYou">("all");

  const categoryLabel = (cat: string) => lang === "en" ? (CATEGORY_EN[cat] ?? cat) : cat;

  const userInterests: string[] = session?.user?.interests ?? [];
  const hasInterests = userInterests.length > 0;
  const displayedQuestions = tab === "forYou" && hasInterests
    ? questions.filter((q) => userInterests.includes(q.category))
    : questions;

  return (
    <div className="pb-24">
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">AICrowd</h1>
        <p className="text-gray-500 text-sm sm:text-base">{t.subtitle}</p>
      </div>

      {hasInterests && !activeCategory && (
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit mx-auto">
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              tab === "all" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.all}
          </button>
          <button
            onClick={() => setTab("forYou")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              tab === "forYou" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.forYouTab}
          </button>
        </div>
      )}

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

      {displayedQuestions.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">{tab === "forYou" ? "⭐" : "🤔"}</p>
          <p className="text-gray-400 text-base mb-5">
            {tab === "forYou"
              ? (lang === "he" ? "אין עדיין תוכן בתחומי העניין שלך" : "No content in your interests yet")
              : `${t.noQuestions}${activeCategory ? ` ${t.noQuestionsInCategory}` : ""}`}
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
          {displayedQuestions.map((q) => (
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
              likeCount={q.likeCount}
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
