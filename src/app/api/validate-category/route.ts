import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { content, category } = await req.json();
  if (!content || !category) {
    return NextResponse.json({ matches: true }, { status: 200 });
  }

  try {
    const prompt = `בדוק אם הנושא "${category}" מתאים לתוכן הבא:

"${content.slice(0, 500)}"

ענה בJSON בלבד, ללא הסברים:
{"matches": true/false, "suggestedCategory": "הנושא המתאים ביותר בעברית"}

אם הנושא מתאים, החזר matches: true עם אותו נושא. אם לא, החזר matches: false ונושא מתאים יותר.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 80,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return NextResponse.json({ matches: true });

    const data = await res.json();
    const text = (data.content?.[0]?.text ?? "").trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ matches: true });

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      matches: !!result.matches,
      suggestedCategory: result.suggestedCategory ?? category,
    });
  } catch {
    return NextResponse.json({ matches: true });
  }
}
