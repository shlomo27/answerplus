import OpenAI from "openai";

export interface ProviderResult {
  provider: "claude" | "chatgpt" | "gemini";
  content: string;
  error: boolean;
}

async function queryClaude(question: string): Promise<ProviderResult> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: question }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { provider: "claude", content: `שגיאה ${res.status}: ${err}`, error: true };
    }
    const data = await res.json();
    const text = data.content?.[0]?.text ?? "";
    return { provider: "claude", content: text, error: false };
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
    const apiKey = process.env.GOOGLE_AI_API_KEY ?? "";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: question }] }] }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      return { provider: "gemini", content: `שגיאה ${res.status}: ${err}`, error: true };
    }
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return { provider: "gemini", content: text, error: false };
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
