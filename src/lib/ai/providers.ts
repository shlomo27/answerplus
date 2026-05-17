import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ProviderResult {
  provider: "claude" | "chatgpt" | "gemini";
  content: string;
  error: boolean;
}

async function queryClaude(question: string): Promise<ProviderResult> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: question }],
    });
    const content = message.content[0];
    return {
      provider: "claude",
      content: content.type === "text" ? content.text : "",
      error: false,
    };
  } catch (e) {
    return { provider: "claude", content: `שגיאה: ${(e as Error).message}`, error: true };
  }
}

async function queryChatGPT(question: string): Promise<ProviderResult> {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: question }],
      max_tokens: 1024,
    });
    return {
      provider: "chatgpt",
      content: completion.choices[0]?.message?.content ?? "",
      error: false,
    };
  } catch (e) {
    return { provider: "chatgpt", content: `שגיאה: ${(e as Error).message}`, error: true };
  }
}

async function queryGemini(question: string): Promise<ProviderResult> {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(question);
    return {
      provider: "gemini",
      content: result.response.text(),
      error: false,
    };
  } catch (e) {
    return { provider: "gemini", content: `שגיאה: ${(e as Error).message}`, error: true };
  }
}

export async function queryAllProviders(question: string): Promise<ProviderResult[]> {
  const results = await Promise.allSettled([
    queryClaude(question),
    queryChatGPT(question),
    queryGemini(question),
  ]);

  return results.map((r, i) => {
    const providers: ProviderResult["provider"][] = ["claude", "chatgpt", "gemini"];
    if (r.status === "fulfilled") return r.value;
    return { provider: providers[i], content: `שגיאה בחיבור לשרת`, error: true };
  });
}
