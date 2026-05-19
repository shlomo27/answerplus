"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";

const AVATAR_URLS: Record<string, string> = {
  robot: "https://api.dicebear.com/9.x/bottts/png?seed=qrowd-r1&backgroundColor=b6e3f4",
  explorer: "https://api.dicebear.com/9.x/adventurer/png?seed=qrowd-a1&backgroundColor=d1f0d1",
  cool: "https://api.dicebear.com/9.x/avataaars/png?seed=qrowd-c1&backgroundColor=fde68a",
  ninja: "https://api.dicebear.com/9.x/pixel-art/png?seed=qrowd-n1&backgroundColor=d1d4f9",
  scientist: "https://api.dicebear.com/9.x/adventurer/png?seed=qrowd-s2&backgroundColor=c7f2fa",
  artist: "https://api.dicebear.com/9.x/croodles/png?seed=qrowd-ar1&backgroundColor=ffd5dc",
  gamer: "https://api.dicebear.com/9.x/bottts/png?seed=qrowd-g1&backgroundColor=c1f4c5",
  chef: "https://api.dicebear.com/9.x/adventurer/png?seed=qrowd-ch1&backgroundColor=fde8c8",
  athlete: "https://api.dicebear.com/9.x/adventurer/png?seed=qrowd-sp1&backgroundColor=d4f5d4",
  coder: "https://api.dicebear.com/9.x/bottts/png?seed=qrowd-co1&backgroundColor=e4d4f4",
  alien: "https://api.dicebear.com/9.x/fun-emoji/png?seed=qrowd-al1&backgroundColor=d4e8ff",
  cat: "https://api.dicebear.com/9.x/fun-emoji/png?seed=qrowd-cat&backgroundColor=fff0d4",
};

interface NotificationItem {
  id: string;
  type: string;
  questionId: string;
  actorName: string;
  createdAt: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifItems, setNotifItems] = useState<NotificationItem[]>([]);
  const bellRef = useRef<HTMLDivElement>(null);
  const { lang, setLang } = useLangContext();
  const t = getTranslations(lang).nav;
  const tc = getTranslations(lang).components;

  if (pathname === "/") return null;

  const avatarUrl = session?.user?.avatarId ? AVATAR_URLS[session.user.avatarId] : null;
  const displayName = session?.user?.username
    ? `@${session.user.username}`
    : (session?.user?.name || session?.user?.email || "?");
  const initial = (session?.user?.username || session?.user?.name || session?.user?.email || "?").charAt(0).toUpperCase();

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifCount(data.count ?? 0);
        setNotifItems(data.items ?? []);
      }
    } catch {
      // ignore
    }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setNotifCount(0);
      setNotifItems([]);
    } catch {
      // ignore
    }
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!session?.user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [session?.user]);

  // Close bell dropdown when clicking outside
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    if (bellOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [bellOpen]);

  function getNotifText(type: string) {
    if (type === "like") return tc.notifLike;
    if (type === "comment") return tc.notifComment;
    return type;
  }

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
            {t.feed}
          </Link>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "he" ? "en" : "he")}
            className="text-sm px-2 py-1 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-gray-600 hover:text-indigo-700 font-medium"
            title={lang === "he" ? "Switch to English" : "עבור לעברית"}
          >
            {lang === "he" ? "🇺🇸" : "🇮🇱"}
          </button>

          {status === "loading" ? null : session?.user ? (
            <>
              {/* Notification bell */}
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => setBellOpen(!bellOpen)}
                  className="relative p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                  aria-label={tc.notifications}
                >
                  <span className="text-lg">🔔</span>
                  {notifCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>

                {bellOpen && (
                  <div className="absolute right-0 mt-1 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-800">{tc.notifications}</span>
                      {notifCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          {tc.markAllRead}
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifItems.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">{tc.noNotifications}</p>
                      ) : (
                        notifItems.map((n) => (
                          <Link
                            key={n.id}
                            href={`/question/${n.questionId}`}
                            onClick={() => setBellOpen(false)}
                            className="flex items-start gap-2 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                          >
                            <span className="text-base flex-shrink-0">{n.type === "like" ? "❤️" : "💬"}</span>
                            <div className="min-w-0">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">{n.actorName}</span>{" "}
                                {getNotifText(n.type)}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(n.createdAt).toLocaleDateString(lang === "he" ? "he-IL" : "en-US")}
                              </p>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/ask"
                className="text-sm px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-semibold"
              >
                {t.askQuestion}
              </Link>
              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                  aria-expanded={menuOpen}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-indigo-600">{initial}</span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400">{t.connectedAs}</p>
                        <p className="text-sm font-semibold text-gray-700 truncate">{displayName}</p>
                      </div>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        {t.signOut}
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
                {t.signIn}
              </Link>
              <Link
                href="/ask"
                className="text-sm px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors font-semibold"
              >
                {t.askQuestion}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
