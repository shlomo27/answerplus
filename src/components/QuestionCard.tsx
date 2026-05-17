import Link from "next/link";
import CategoryBadge from "./CategoryBadge";

interface Props {
  id: string;
  text: string;
  category: string;
  authorName: string;
  createdAt: string;
  conclusion?: string | null;
  commentCount: number;
}

export default function QuestionCard({
  id,
  text,
  category,
  authorName,
  createdAt,
  conclusion,
  commentCount,
}: Props) {
  const date = new Date(createdAt).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link href={`/question/${id}`} className="block group active:scale-[0.99] transition-transform">
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md active:shadow-sm transition-all duration-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-gray-900 font-semibold leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2 text-base flex-1">
            {text}
          </h3>
          <div className="flex-shrink-0 pt-0.5">
            <CategoryBadge category={category} />
          </div>
        </div>

        {conclusion && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 mb-3">
            <p className="text-xs text-indigo-500 font-medium mb-0.5">✦ מסקנה</p>
            <p className="text-sm text-indigo-800 line-clamp-2 leading-relaxed">{conclusion}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>{authorName}</span>
            <span>·</span>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💬</span>
            <span>{commentCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
