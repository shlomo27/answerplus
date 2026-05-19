import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { queryAllProviders } from "@/lib/ai/providers";
import { generateSummary } from "@/lib/ai/summarize";
import { categorizeQuestion } from "@/lib/ai/categorize";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  const questions = await prisma.question.findMany({
    where: {
      isPublic: true,
      ...(category ? { category } : {}),
    },
    include: {
      summary: { select: { conclusion: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    text,
    type = "ai_question",
    isPublic = true,
    authorName = "אנונימי",
    category: providedCategory,
    imageUrl,
    videoUrl,
  } = body;

  if (!text || typeof text !== "string" || text.trim().length < 5) {
    return NextResponse.json({ error: "התוכן קצר מדי" }, { status: 400 });
  }

  if (type === "post") {
    if (!providedCategory) {
      return NextResponse.json({ error: "חובה לבחור נושא" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        text: text.trim(),
        category: providedCategory,
        type: "post",
        isPublic,
        authorName,
        imageUrl: imageUrl ?? null,
        videoUrl: videoUrl ?? null,
      },
    });

    return NextResponse.json(question, { status: 201 });
  }

  // AI question flow
  const [responses, category] = await Promise.all([
    queryAllProviders(text.trim()),
    categorizeQuestion(text.trim()),
  ]);

  const summary = await generateSummary(text.trim(), responses);

  const question = await prisma.question.create({
    data: {
      text: text.trim(),
      category,
      type: "ai_question",
      isPublic,
      authorName,
      responses: {
        create: responses.map((r) => ({
          provider: r.provider,
          content: r.content,
          error: r.error,
        })),
      },
      summary: {
        create: {
          content: summary.content,
          conclusion: summary.conclusion,
        },
      },
    },
    include: {
      responses: true,
      summary: true,
    },
  });

  return NextResponse.json(question, { status: 201 });
}
