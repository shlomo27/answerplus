"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLangContext } from "@/components/LangProvider";
import { getTranslations } from "@/lib/i18n";
import { CATEGORIES } from "@/types";
import { CATEGORY_EN } from "@/lib/i18n";

const CUSTOM_VALUE = "__custom__";

interface MismatchDialog {
  yourCategory: string;
  suggestedCategory: string;
}

export default function PostForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { lang } = useLangContext();
  const t = getTranslations(lang).post;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState("");
  const [mismatch, setMismatch] = useState<MismatchDialog | null>(null);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const authorName = session?.user?.name || session?.user?.email || (lang === "he" ? "אנונימי" : "Anonymous");
  const isCustom = selectedCategory === CUSTOM_VALUE;
  const effectiveCategory = isCustom ? customCategory : selectedCategory;

  const categoryLabel = (cat: string) => lang === "en" ? (CATEGORY_EN[cat] ?? cat) : cat;

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError(t.errorImage);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImageBase64(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  }

  async function validateAndSubmit(category: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: content.trim(),
          type: "post",
          category,
          isPublic,
          authorName,
          imageUrl: imageBase64 ?? null,
          videoUrl: videoUrl.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? t.errorContent);
      }
      const post = await res.json();
      router.push(`/question/${post.id}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!content.trim() || content.trim().length < 5) {
      setError(t.errorContent);
      return;
    }
    if (!effectiveCategory.trim()) {
      setError(t.errorCategory);
      return;
    }

    // Validate category against content (always, not just for custom)
    setValidating(true);
    try {
      const res = await fetch("/api/validate-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), category: effectiveCategory.trim() }),
      });
      const data = await res.json();
      setValidating(false);
      if (!data.matches && data.suggestedCategory !== effectiveCategory.trim()) {
        setMismatch({ yourCategory: effectiveCategory.trim(), suggestedCategory: data.suggestedCategory });
        setPendingSubmit(true);
        return;
      }
    } catch {
      setValidating(false);
    }

    await validateAndSubmit(effectiveCategory.trim());
  }

  function handleMismatchKeep() {
    setMismatch(null);
    setPendingSubmit(false);
    validateAndSubmit(customCategory.trim());
  }

  function handleMismatchAccept() {
    const suggested = mismatch!.suggestedCategory;
    setMismatch(null);
    setPendingSubmit(false);
    setCustomCategory(suggested);
    validateAndSubmit(suggested);
  }

  return (
    <>
      {/* Mismatch Dialog */}
      {mismatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🤖</span>
              <h3 className="font-bold text-gray-900 text-base">{t.mismatchTitle}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{t.mismatchMsg}</p>
            <div className="space-y-2 mb-5">
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
                <p className="text-xs text-gray-400 mb-0.5">{t.mismatchYours}</p>
                <p className="font-semibold text-gray-700 text-sm">{categoryLabel(mismatch.yourCategory)}</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5">
                <p className="text-xs text-indigo-400 mb-0.5">{t.mismatchSuggested}</p>
                <p className="font-semibold text-indigo-700 text-sm">{categoryLabel(mismatch.suggestedCategory)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleMismatchKeep}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.mismatchKeep}
              </button>
              <button
                onClick={handleMismatchAccept}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                {t.mismatchAccept}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.contentLabel}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t.placeholder}
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none leading-relaxed"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-400 mt-1">{content.length} {t.charCount}</p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.categoryLabel}</label>
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCustomCategory(""); }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            disabled={loading}
          >
            <option value="">{t.selectCategory}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{categoryLabel(cat)}</option>
            ))}
            <option value={CUSTOM_VALUE}>{t.customCategory}</option>
          </select>

          {isCustom && (
            <div className="mt-2">
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder={t.customCategoryPlaceholder}
                className="w-full border border-indigo-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                disabled={loading || validating}
              />
              <p className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
                <span>🤖</span> {t.customNote}
              </p>
            </div>
          )}
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.imageLabel}</label>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="preview"
                className="w-full max-h-48 object-cover rounded-xl border border-gray-200"
              />
              <button
                type="button"
                onClick={() => { setImagePreview(null); setImageBase64(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-600 transition-colors"
              >
                {t.removeImage}
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-6 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <span className="text-2xl mb-1">📷</span>
              <span className="text-sm text-gray-500">{t.imageNote}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageChange}
                disabled={loading}
              />
            </label>
          )}
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.videoLabel}</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder={t.videoPlaceholder}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            disabled={loading}
          />
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-gray-400">{t.authorLabel}</p>
            <p className="text-sm font-semibold text-gray-700">{authorName}</p>
          </div>
        </div>

        {/* Public toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-semibold text-gray-700">{t.publicLabel}</p>
            <p className="text-xs text-gray-400 mt-0.5">{isPublic ? t.publicDesc : t.privateDesc}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            disabled={loading}
            aria-pressed={isPublic}
            className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${isPublic ? "bg-indigo-600" : "bg-gray-300"}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${isPublic ? "right-1" : "right-7"}`} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || validating || content.trim().length < 5}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-base hover:bg-indigo-700 active:bg-indigo-800 active:scale-[0.99] disabled:opacity-50 transition-all"
        >
          {validating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {t.validating}
            </span>
          ) : loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              {t.submitting}
            </span>
          ) : t.submit}
        </button>
      </form>
    </>
  );
}
