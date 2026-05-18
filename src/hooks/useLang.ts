"use client";
import { useState, useEffect } from "react";
import type { Lang } from "@/lib/i18n";

const STORAGE_KEY = "qrowd-lang";

export function useLang(): [Lang, (lang: Lang) => void] {
  const [lang, setLangState] = useState<Lang>("he");

  useEffect(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "he" || stored === "en") {
      setLangState(stored);
      return;
    }
    // Fall back to browser language
    const browserLang = navigator.language || "";
    setLangState(browserLang.startsWith("he") ? "he" : "en");
  }, []);

  const setLang = (newLang: Lang) => {
    localStorage.setItem(STORAGE_KEY, newLang);
    setLangState(newLang);
    // Update html dir/lang attributes live
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
  };

  return [lang, setLang];
}
