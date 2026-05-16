export type Category =
  | "בריאות"
  | "ספורט"
  | "טכנולוגיה"
  | "פיננסים"
  | "בישול"
  | "טיולים"
  | "מדע"
  | "משפט"
  | "אחר";

export const CATEGORIES: Category[] = [
  "בריאות",
  "ספורט",
  "טכנולוגיה",
  "פיננסים",
  "בישול",
  "טיולים",
  "מדע",
  "משפט",
  "אחר",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  בריאות: "bg-red-100 text-red-700 border-red-200",
  ספורט: "bg-green-100 text-green-700 border-green-200",
  טכנולוגיה: "bg-blue-100 text-blue-700 border-blue-200",
  פיננסים: "bg-yellow-100 text-yellow-700 border-yellow-200",
  בישול: "bg-orange-100 text-orange-700 border-orange-200",
  טיולים: "bg-teal-100 text-teal-700 border-teal-200",
  מדע: "bg-purple-100 text-purple-700 border-purple-200",
  משפט: "bg-gray-100 text-gray-700 border-gray-200",
  אחר: "bg-slate-100 text-slate-600 border-slate-200",
};

export const PROVIDER_CONFIG = {
  claude: { label: "Claude", color: "bg-orange-50 border-orange-200", dot: "bg-orange-400", icon: "🟠" },
  chatgpt: { label: "ChatGPT", color: "bg-green-50 border-green-200", dot: "bg-green-500", icon: "🟢" },
  gemini: { label: "Gemini", color: "bg-blue-50 border-blue-200", dot: "bg-blue-500", icon: "🔵" },
};

export interface QuestionWithAll {
  id: string;
  text: string;
  category: string;
  isPublic: boolean;
  authorName: string;
  createdAt: string;
  responses: {
    id: string;
    provider: string;
    content: string;
    error: boolean;
  }[];
  summary: {
    content: string;
    conclusion: string;
  } | null;
  comments: {
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }[];
}
