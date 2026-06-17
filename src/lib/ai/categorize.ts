import { CATEGORIES, type Category } from "@/types";

export async function categorizeQuestion(question: string): Promise<Category> {
  try {
    const prompt = `סווג את השאלה הבאה לאחת מהקטגוריות הבאות: ${CATEGORIES.join(", ")}.

שאלה: "${question}"

ענה בקטגוריה בלבד, בלי הסברים נוספים. לדוגמה: "טכנולוגיה"`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 20,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return "אחר";

    const data = await res.json();
    const text = (data.content?.[0]?.text ?? "").trim();
    const match = CATEGORIES.find((c) => text.includes(c));
    return match ?? "אחר";
  } catch {
    return "אחר";
  }
}
