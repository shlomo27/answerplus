export async function moderateContent(text: string): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        messages: [
          {
            role: "user",
            content: `האם הטקסט הבא מכיל תוכן פוגעני, גזעני, מיני, אלים, ספאם, או בלתי הולם לפלטפורמה ציבורית? ענה אך ורק "OK" או "BLOCK".

טקסט: "${text.slice(0, 500)}"`,
          },
        ],
      }),
    });

    if (!res.ok) return { allowed: true };

    const data = await res.json();
    const answer = (data.content?.[0]?.text ?? "").trim().toUpperCase();
    if (answer.includes("BLOCK")) {
      return { allowed: false, reason: "התוכן אינו מתאים לפרסום" };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}
