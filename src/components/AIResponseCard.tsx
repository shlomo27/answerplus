"use client";
import { useState } from "react";
import { PROVIDER_CONFIG } from "@/types";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";

interface Props {
  provider: string;
  content: string;
  error: boolean;
  questionId?: string;
  responseId?: string;
}

export default function AIResponseCard({ provider, content, error, questionId, responseId }: Props) {
  const { lang } = useLangContext();
  const t = getTranslations(lang).components;
  const [open, setOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);
  const [currentError, setCurrentError] = useState(error);
  const [retrying, setRetrying] = useState(false);

  async function handleRetry() {
    if (!questionId || !responseId) return;
    setRetrying(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/retry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, responseId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentContent(data.content);
        setCurrentError(data.error);
      }
    } finally {
      setRetrying(false);
    }
  }

  const config = PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG] ?? {
    label: provider,
    color: "bg-gray-50 border-gray-200",
    dot: "bg-gray-400",
    icon: "⚪",
  };

  return (
    <div className={`rounded-xl border ${config.color}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 p-4 text-left"
      >
        <span className="text-lg">{config.icon}</span>
        <span className="font-semibold text-gray-800 flex-1">{config.label}</span>
        {currentError && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
            {t.error}
          </span>
        )}
        <span className={`ml-1 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${currentError ? "text-red-500" : "text-gray-700"}`}>
            {currentError
              ? (lang === "he" ? "השירות אינו זמין כרגע. נסה שוב מאוחר יותר." : "This service is temporarily unavailable. Please try again later.")
              : currentContent}
          </p>
          {currentError && questionId && responseId && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {retrying ? "⏳ " + (lang === "he" ? "מנסה שוב..." : "Retrying...") : "🔄 " + (lang === "he" ? "נסה שוב" : "Try again")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
