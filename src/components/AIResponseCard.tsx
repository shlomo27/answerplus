"use client";
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
  const config = PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG] ?? {
    label: provider,
    color: "bg-gray-50 border-gray-200",
    dot: "bg-gray-400",
    icon: "⚪",
  };

  return (
    <div className={`rounded-xl border p-5 ${config.color}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{config.icon}</span>
        <span className="font-semibold text-gray-800">{config.label}</span>
        {error && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mr-auto">
            {t.error}
          </span>
        )}
      </div>
      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${error ? "text-red-500" : "text-gray-700"}`}>
        {content}
      </p>
    </div>
  );
}
