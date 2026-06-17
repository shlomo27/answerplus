import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES } from "@/types";

export async function POST(req: NextRequest) {
  const { content, category } = await req.json();
  if (!content || !category) {
    return NextResponse.json({ matches: true });
  }

  try {
    const categoryList = CATEGORIES.join(", ");
    const prompt = `You are a content moderator. Check if the topic matches the post content.

Topic chosen by user: "${category}"
Post content: "${content.slice(0, 600)}"

Available topics: ${categoryList}

Does the topic "${category}" match the post content?
Respond with JSON only, no markdown, no explanation:
{"matches": true, "suggestedCategory": "${category}"}
or
{"matches": false, "suggestedCategory": "MOST_RELEVANT_TOPIC_FROM_LIST"}`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 60,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error("[validate-category] Anthropic error:", res.status, await res.text());
      return NextResponse.json({ matches: true });
    }

    const data = await res.json();
    const text = (data.content?.[0]?.text ?? "").trim();
    console.log("[validate-category] AI response:", text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[validate-category] No JSON found in:", text);
      return NextResponse.json({ matches: true });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      matches: result.matches === true,
      suggestedCategory: result.suggestedCategory ?? category,
    });
  } catch (e) {
    console.error("[validate-category] Exception:", e);
    return NextResponse.json({ matches: true });
  }
}
