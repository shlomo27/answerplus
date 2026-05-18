"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "loading" | "success" | "error";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorParam) {
      setStatus("error");
      if (errorParam === "expired") {
        setErrorMessage("קישור האימות פג תוקף. אנא הירשם מחדש.");
      } else if (errorParam === "invalid" || errorParam === "missing") {
        setErrorMessage("קישור האימות אינו תקין.");
      } else {
        setErrorMessage("אירעה שגיאה באימות. אנא נסה שוב.");
      }
      return;
    }

    if (!token) {
      setStatus("error");
      setErrorMessage("קישור האימות אינו תקין.");
      return;
    }

    // Call verification API
    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => {
        // The API redirects on success/failure, so if we reach here it means
        // the fetch followed the redirect and we need to check where we ended up
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          setStatus("error");
          setErrorMessage("אירעה שגיאה באימות. אנא נסה שוב.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("אירעה שגיאה באימות. אנא נסה שוב.");
      });
  }, [token, errorParam]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-xl text-indigo-700 mb-4">
            <span>✦</span>
            <span>AnswerPlus</span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center mb-4">
                <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">מאמת את כתובת האימייל...</h1>
              <p className="text-gray-500 text-sm">אנא המתן</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">האימייל אומת בהצלחה!</h1>
              <p className="text-gray-500 text-sm mb-6">כעת תוכל להתחבר לחשבונך.</p>
              <Link
                href="/auth/login"
                className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-xl font-bold text-base hover:bg-indigo-700 transition-colors"
              >
                עבור להתחברות
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">שגיאה באימות</h1>
              <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>
              <Link
                href="/auth/register"
                className="inline-block bg-indigo-600 text-white py-3 px-8 rounded-xl font-bold text-base hover:bg-indigo-700 transition-colors"
              >
                חזור להרשמה
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-gray-400">טוען...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
