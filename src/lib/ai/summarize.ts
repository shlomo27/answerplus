import type { ProviderResult } from "./providers";

export interface SummaryResult {
  content: string;
  conclusion: string;
}

export async function generateSummary(
  question: string,
  responses: ProviderResult[],
  lang: "he" | "en" = "en"
): Promise<SummaryResult> {
  try {
    const validResponses = responses.filter((r) => !r.error);
    if (validResponses.length === 0) {
      return lang === "he"
        ? { content: "לא התקבלו תשובות מה-AI.", conclusion: "לא ניתן לסכם." }
        : { content: "No AI responses received.", conclusion: "Unable to summarize." };
    }

    const responsesText = validResponses
      .map((r) => `**${r.provider.toUpperCase()}:**\n${r.content}`)
      .join("\n\n---\n\n");

    const prompt = lang === "he"
      ? `השאלה שנשאלה: "${question}"

להלן תשובות ממערכות AI שונות:

${responsesText}

אנא:
1. כתוב סיכום קצר (2-3 משפטים) של הנקודות המשותפות והשונות בין התשובות
2. כתוב מסקנה אחת ברורה וממוקדת (משפט אחד או שניים) שמייצגת את התשובה הטובה ביותר

ענה בפורמט JSON בלבד:
{
  "content": "הסיכום כאן",
  "conclusion": "המסקנה כאן"
}`
      : `The question asked: "${question}"

Below are answers from different AI systems:

${responsesText}

Please:
1. Write a brief summary (2-3 sentences) of the common points and differences between the answers
2. Write one clear and focused conclusion (one or two sentences) representing the best answer

Reply in JSON format only:
{
  "content": "summary here",
  "conclusion": "conclusion here"
}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      return lang === "he"
        ? { content: "שגיאה ביצירת הסיכום.", conclusion: "לא ניתן לסכם." }
        : { content: "Error generating summary.", conclusion: "Unable to summarize." };
    }

    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { content: parsed.content ?? "", conclusion: parsed.conclusion ?? "" };
    }

    return { content: text, conclusion: "" };
  } catch {
    return lang === "he"
      ? { content: "שגיאה ביצירת הסיכום.", conclusion: "לא ניתן לסכם." }
      : { content: "Error generating summary.", conclusion: "Unable to summarize." };
  }
}
