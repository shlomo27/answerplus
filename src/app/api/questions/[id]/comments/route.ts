import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

  try {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || !question.isPublic) {
      return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: { questionId: id, content: content.trim(), authorName },
    });

    // Create notification for question owner if different user
    if (question.userId) {
      const session = await auth();
      if (session?.user?.email) {
        const commenter = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (commenter && commenter.id !== question.userId) {
          await prisma.notification.create({
            data: {
              userId: question.userId,
              type: "comment",
              questionId: id,
              actorName: authorName,
            },
          });
        }
      }
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error("Comment POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
