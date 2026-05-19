import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { content, authorName = "אנונימי", parentId } = body;

  if (!content || typeof content !== "string" || content.trim().length < 2) {
    return NextResponse.json({ error: "תגובה קצרה מדי" }, { status: 400 });
  }

  try {
    const question = await prisma.question.findUnique({ where: { id } });
    if (!question || !question.isPublic) {
      return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
    }

    // Look up commenter by email
    const session = await auth();
    let commenter = null;
    if (session?.user?.email) {
      commenter = await prisma.user.findUnique({ where: { email: session.user.email } });
    }

    const comment = await prisma.comment.create({
      data: {
        questionId: id,
        content: content.trim(),
        authorName,
        ...(parentId ? { parentId } : {}),
        ...(commenter ? { userId: commenter.id } : {}),
      },
    });

    let questionOwnerNotified = false;

    // For replies: notify parent comment author first
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
      if (parentComment?.userId && parentComment.userId !== (commenter?.id ?? null)) {
        await prisma.notification.create({
          data: { userId: parentComment.userId, type: "reply", questionId: id, actorName: authorName },
        });
        // If the question owner IS the parent comment author, they're already notified
        if (parentComment.userId === question.userId) questionOwnerNotified = true;
      }
    }

    // Notify question owner for any activity on their post (unless already notified above)
    if (!questionOwnerNotified && question.userId && commenter?.id !== question.userId) {
      await prisma.notification.create({
        data: { userId: question.userId, type: "comment", questionId: id, actorName: authorName },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    console.error("Comment POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
