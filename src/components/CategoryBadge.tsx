"use client";
import { CATEGORY_COLORS, type Category } from "@/types";
import { useLangContext } from "@/components/LangProvider";
import { CATEGORY_EN } from "@/lib/i18n";

export default function CategoryBadge({ category }: { category: string }) {
  const { lang } = useLangContext();
  const colorClass =
    CATEGORY_COLORS[category as Category] ?? "bg-slate-100 text-slate-600 border-slate-200";
  const label = lang === "en" ? (CATEGORY_EN[category] ?? category) : category;

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${colorClass}`}>
      {label}
    </span>
  );
}
