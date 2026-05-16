"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-700">
          <span className="text-2xl">✦</span>
          <span>AnswerPlus</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-600 hover:text-indigo-700"
            }`}
          >
            פיד ציבורי
          </Link>
          <Link
            href="/ask"
            className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            + שאל שאלה
          </Link>
        </div>
      </div>
    </nav>
  );
}
