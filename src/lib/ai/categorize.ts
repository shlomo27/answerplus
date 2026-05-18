import Anthropic from "@anthropic-ai/sdk";
import { CATEGORIES, type Category } from "@/types";

export async function categorizeQuestion(question: string): Promise<Category> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `סווג את השאלה הבאה לאחת מהקטגוריות הבאות: ${CATEGORIES.join(", ")}.

שאלה: "${question}"

ענה בקטגוריה בלבד, בלי הסברים נוספים. לדוגמה: "טכנולוגיה"`;

    const message = await client.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 20,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (message.content[0].type === "text" ? message.content[0].text : "").trim();
    const match = CATEGORIES.find((c) => text.includes(c));
    return match ?? "אחר";
  } catch {
    return "אחר";
  }
}
