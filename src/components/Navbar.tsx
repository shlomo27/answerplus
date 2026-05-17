"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 font-bold text-lg text-indigo-700">
          <span className="text-xl">✦</span>
          <span>AnswerPlus</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`hidden sm:block text-sm px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-600 hover:text-indigo-700"
            }`}
          >
            פיד ציבורי
          </Link>
          <Link
            href="/ask"
            className="text-sm px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-semibold"
          >
            + שאל שאלה
          </Link>
        </div>
      </div>
    </nav>
  );
}
