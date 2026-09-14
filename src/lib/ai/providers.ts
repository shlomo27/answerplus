import OpenAI from "openai";

export interface ProviderResult {
  provider: "claude" | "chatgpt" | "gemini";
  content: string;
  error: boolean;
}

export interface ConversationTurn {
  question: string;
  responses: { provider: string; content: string; error: boolean }[];
}

async function queryClaude(question: string, history: ConversationTurn[] = []): Promise<ProviderResult> {
  try {
    const messages: { role: "user" | "assistant"; content: string }[] = [];
    for (const turn of history) {
      const prev = turn.responses.find((r) => r.provider === "claude");
      messages.push({ role: "user", content: turn.question });
      if (prev && !prev.error) {
        messages.push({ role: "assistant", content: prev.content });
      } else {
        messages.push({ role: "assistant", content: "לא הצלחתי לענות על שאלה זו." });
      }
    }
    messages.push({ role: "user", content: question });

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
        messages,
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

async function queryChatGPT(question: string, history: ConversationTurn[] = []): Promise<ProviderResult> {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const messages: { role: "user" | "assistant"; content: string }[] = [];
    for (const turn of history) {
      const prev = turn.responses.find((r) => r.provider === "chatgpt");
      messages.push({ role: "user", content: turn.question });
      if (prev && !prev.error) {
        messages.push({ role: "assistant", content: prev.content });
      } else {
        messages.push({ role: "assistant", content: "I was unable to answer this question." });
      }
    }
    messages.push({ role: "user", content: question });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
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

async function queryGemini(question: string, history: ConversationTurn[] = []): Promise<ProviderResult> {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY ?? "";
    const contents: { role: string; parts: { text: string }[] }[] = [];
    for (const turn of history) {
      const prev = turn.responses.find((r) => r.provider === "gemini");
      contents.push({ role: "user", parts: [{ text: turn.question }] });
      if (prev && !prev.error) {
        contents.push({ role: "model", parts: [{ text: prev.content }] });
      } else {
        contents.push({ role: "model", parts: [{ text: "I was unable to answer this question." }] });
      }
    }
    contents.push({ role: "user", parts: [{ text: question }] });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents }),
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

export async function queryAllProviders(question: string, history: ConversationTurn[] = []): Promise<ProviderResult[]> {
  const results = await Promise.allSettled([
    queryClaude(question, history),
    queryChatGPT(question, history),
    queryGemini(question, history),
  ]);

  return results.map((r, i) => {
    const providers: ProviderResult["provider"][] = ["claude", "chatgpt", "gemini"];
    if (r.status === "fulfilled") return r.value;
    return { provider: providers[i], content: `שגיאה בחיבור לשרת`, error: true };
  });
}
