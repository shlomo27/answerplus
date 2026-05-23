"use client";
import { useState, useEffect } from "react";
import type { Lang } from "@/lib/i18n";

const STORAGE_KEY = "aicrowd-lang";

export function useLang(initialLang: Lang = "en"): [Lang, (lang: Lang) => void] {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "he" || stored === "en") {
      setLangState(stored);
      document.documentElement.lang = stored;
      document.documentElement.dir = stored === "he" ? "rtl" : "ltr";
      return;
    }
    const browserLang = navigator.language || "";
    const detected: Lang = browserLang.startsWith("he") ? "he" : "en";
    setLangState(detected);
    document.documentElement.lang = detected;
    document.documentElement.dir = detected === "he" ? "rtl" : "ltr";
  }, []);

  const setLang = (newLang: Lang) => {
    localStorage.setItem(STORAGE_KEY, newLang);
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
  };

  return [lang, setLang];
}
