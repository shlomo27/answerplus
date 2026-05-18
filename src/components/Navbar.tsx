"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  // On the landing page, show a minimal transparent navbar (landing page has its own nav)
  if (pathname === "/") return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={session?.user ? "/feed" : "/"} className="flex items-center gap-1.5 font-bold text-lg text-indigo-700">
          <span className="text-xl">✦</span>
          <span>Qrowd</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/feed"
            className={`hidden sm:block text-sm px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/feed"
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-600 hover:text-indigo-700"
            }`}
          >
            פיד
          </Link>

          {status === "loading" ? null : session?.user ? (
            <>
              <Link
                href="/ask"
                className="text-sm px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-semibold"
              >
                + שאל שאלה
              </Link>
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                  aria-expanded={menuOpen}
                >
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {session.user.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : session.user.email?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400">מחובר כ</p>
                        <p className="text-sm font-semibold text-gray-700 truncate">
                          {session.user.name || session.user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        התנתק
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm px-3 py-1.5 text-gray-600 hover:text-indigo-700 rounded-lg transition-colors"
              >
                התחבר
              </Link>
              <Link
                href="/ask"
                className="text-sm px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-semibold"
              >
                + שאל שאלה
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
