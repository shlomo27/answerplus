"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function FeedError({ error }: { error: Error }) {
  useEffect(() => {
    console.error("[Feed Error]", error.message, error.stack);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto py-20 text-center px-4">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-lg font-bold text-gray-800 mb-2">שגיאה בטעינת הפיד</h2>
      <p className="text-sm text-red-500 font-mono bg-red-50 rounded-xl px-4 py-3 mb-6 text-left break-all">
        {error.message}
      </p>
      <Link href="/" className="text-indigo-600 text-sm underline">חזור לדף הבית</Link>
    </div>
  );
}
