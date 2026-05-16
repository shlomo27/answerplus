import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { content, authorName = "אנונימי" } = body;

  if (!content || typeof content !== "string" || content.trim().length < 2) {
    return NextResponse.json({ error: "תגובה קצרה מדי" }, { status: 400 });
  }

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question || !question.isPublic) {
    return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { questionId: id, content: content.trim(), authorName },
  });

  return NextResponse.json(comment, { status: 201 });
}
