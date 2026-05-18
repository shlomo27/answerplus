import Anthropic from "@anthropic-ai/sdk";
import type { ProviderResult } from "./providers";

export interface SummaryResult {
  content: string;
  conclusion: string;
}

export async function generateSummary(
  question: string,
  responses: ProviderResult[]
): Promise<SummaryResult> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const validResponses = responses.filter((r) => !r.error);
    if (validResponses.length === 0) {
      return { content: "לא התקבלו תשובות מה-AI.", conclusion: "לא ניתן לסכם." };
    }

    const responsesText = validResponses
      .map((r) => `**${r.provider.toUpperCase()}:**\n${r.content}`)
      .join("\n\n---\n\n");

    const prompt = `השאלה שנשאלה: "${question}"

להלן תשובות ממערכות AI שונות:

${responsesText}

אנא:
1. כתוב סיכום קצר (2-3 משפטים) של הנקודות המשותפות והשונות בין התשובות
2. כתוב מסקנה אחת ברורה וממוקדת (משפט אחד או שניים) שמייצגת את התשובה הטובה ביותר

ענה בפורמט JSON בלבד:
{
  "content": "הסיכום כאן",
  "conclusion": "המסקנה כאן"
}`;

    const message = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { content: parsed.content ?? "", conclusion: parsed.conclusion ?? "" };
    }

    return { content: text, conclusion: "" };
  } catch {
    return { content: "שגיאה ביצירת הסיכום.", conclusion: "לא ניתן לסכם." };
  }
}
