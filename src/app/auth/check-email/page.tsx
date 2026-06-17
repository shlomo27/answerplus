"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-xl text-indigo-700 mb-4">
            <span>✦</span>
            <span>AICrowd</span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">בדוק את תיבת הדואר שלך</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            שלחנו לך אימייל לאימות הכתובת. יש ללחוץ על הקישור באימייל כדי להפעיל את חשבונך.
          </p>

          {email && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-6">
              <p className="text-indigo-700 text-sm font-medium" dir="ltr">{email}</p>
            </div>
          )}

          <p className="text-gray-400 text-xs mb-6">
            הקישור יפוג תוך 24 שעות. אם לא קיבלת אימייל, בדוק בתיקיית הספאם.
          </p>

          <Link
            href="/auth/login"
            className="inline-block text-indigo-600 font-semibold text-sm hover:underline"
          >
            חזור לדף ההתחברות
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-gray-400">טוען...</p>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  );
}
