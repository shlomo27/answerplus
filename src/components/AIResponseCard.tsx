"use client";
import { useState } from "react";
import { PROVIDER_CONFIG } from "@/types";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";

interface Props {
  provider: string;
  content: string;
  error: boolean;
}

export default function AIResponseCard({ provider, content, error }: Props) {
  const { lang } = useLangContext();
  const t = getTranslations(lang).components;
  const [open, setOpen] = useState(false);
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
        {error && (
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
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${error ? "text-red-500" : "text-gray-700"}`}>
            {content}
          </p>
        </div>
      )}
    </div>
  );
}
