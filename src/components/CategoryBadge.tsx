import { CATEGORY_COLORS, type Category } from "@/types";

export default function CategoryBadge({ category }: { category: string }) {
  const colorClass =
    CATEGORY_COLORS[category as Category] ?? "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${colorClass}`}>
      {category}
    </span>
  );
}
