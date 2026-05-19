"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";
import AIQuestionForm from "./AIQuestionForm";
import PostForm from "./PostForm";

export default function AskPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { lang } = useLangContext();
  const t = getTranslations(lang).ask;
  const [tab, setTab] = useState<"ai" | "post">("ai");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/ask");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="max-w-2xl mx-auto pb-10 flex items-center justify-center py-20">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-gray-400 text-sm">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Tab selector */}
      <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-2xl">
        <button
          onClick={() => setTab("ai")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === "ai"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.tabAI}
        </button>
        <button
          onClick={() => setTab("post")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === "post"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.tabPost}
        </button>
      </div>

      {/* Tab content */}
      {tab === "ai" ? (
        <>
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.title}</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t.subtitle}
              <br />
              <span className="text-indigo-600 font-medium">{t.subtitleNote}</span>
            </p>
          </div>
          <AIQuestionForm />
        </>
      ) : (
        <>
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {getTranslations(lang).post.title}
            </h1>
            <p className="text-gray-500 text-sm">
              {getTranslations(lang).post.subtitle}
            </p>
          </div>
          <PostForm />
        </>
      )}
    </div>
  );
}
